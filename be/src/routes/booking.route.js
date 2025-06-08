const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
// POST /api/bookings
router.post('/',authenticateToken, async (req, res) => {
  try {
     const userId = req.user.id;
    const { serviceId, bookingDate, isDeposited, depositAmount, notes , coupons } = req.body;

    // Validate dữ liệu cơ bản
    if (!serviceId || !userId) {
      return res.status(400).json({ error: 'serviceId và userId là bắt buộc' });
    }

    if (!Array.isArray(bookingDate) || bookingDate.length === 0) {
      return res.status(400).json({ error: 'bookingDate phải là mảng và không được rỗng' });
    }
    // Nếu có truyền coupons thì kiểm tra
      if (coupons && Array.isArray(coupons) && coupons.length > 0) {
        // Lấy dịch vụ kèm coupons từ DB
        const service = await db.Service.findByPk(serviceId);

        if (!service) {
          return res.status(404).json({ error: 'Dịch vụ không tồn tại' });
        }

        const serviceCoupons = service.coupons || [];

        const invalidCoupons = coupons.filter(c => {
          return !serviceCoupons.some(sc => sc.code === c.code);
        });

        if (invalidCoupons.length > 0) {
          return res.status(400).json({
            error: 'Mã giảm gá không hợp lệ',
            invalidCoupons
          });
        }
      }
      const user = await db.User.findByPk(userId);
        if (user && Array.isArray(coupons)) {
          const oldCoupons = user.listCoupon || [];
          const newCoupons = coupons.filter(
            c => !oldCoupons.some(oc => oc.code === c.code)
          );
          const updatedList = [...oldCoupons, ...newCoupons];
          await user.update({ listCoupon: updatedList });
        }


    // Tạo booking mới
    const newBooking = await db.Booking.create({
      serviceId,
      userId,
      bookingDate,       // lưu mảng trực tiếp do kiểu JSON trong model
      isDeposited: isDeposited ?? false,
      depositAmount: depositAmount ?? 0,
    });

    return res.status(201).json(newBooking);
  } catch (error) {
    console.error('Lỗi khi tạo booking:', error);
    return res.status(500).json({ error: 'Server lỗi khi tạo booking' });
  }
});
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bookings = await db.Booking.findAll({
      include: [
        {
          model: db.User, as: 'customer' ,
          attributes: ['id', 'username', 'email']
        },
       {
          model: db.Service,
          as: 'service',
          include: [
            {
              model: db.User,
              as: 'creator',
              attributes: ['id', 'username', 'email'] 
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy bookings:', error);
    return res.status(500).json({ error: 'Server lỗi khi lấy bookings' });
  }
});
router.patch('/:id/approve', authenticateToken,  authorizeRole(['shop']), async (req, res) => {
  try {
    console.log('req.params :>> ', req.params);
    const {id} = req.params;
    const { status } = req.body;
    console.log('id :>> ', id);
    // Kiểm tra status hợp lệ
    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ. Chỉ chấp nhận "completed" hoặc "cancelled".' });
    }

    // Tìm booking theo ID
    const booking = await db.Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking không tồn tại.' });
    }

    // Cập nhật trạng thái
    booking.status = status;
    await booking.save();

    return res.status(200).json({ message: 'Cập nhật trạng thái thành công.', booking });
  } catch (error) {
    console.error('Lỗi khi duyệt booking:', error);
    return res.status(500).json({ error: 'Server lỗi khi duyệt booking.' });
  }
});
module.exports = router;
