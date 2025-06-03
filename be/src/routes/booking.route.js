const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateToken } = require('../middlewares/auth.middleware');
// POST /api/bookings
router.post('/',authenticateToken, async (req, res) => {
  try {
     const userId = req.user.id;
    const { serviceId, bookingDate, isDeposited, depositAmount, notes } = req.body;

    // Validate dữ liệu cơ bản
    if (!serviceId || !userId) {
      return res.status(400).json({ error: 'serviceId và userId là bắt buộc' });
    }

    if (!Array.isArray(bookingDate) || bookingDate.length === 0) {
      return res.status(400).json({ error: 'bookingDate phải là mảng và không được rỗng' });
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

module.exports = router;
