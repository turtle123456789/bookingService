const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const db = require('../models');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
router.post(
  '/',
  authenticateToken,
  authorizeRole(['shop']),
  upload.single('image'), 
  async (req, res) => {
    try {
      const user = req.user;
      const {
        name,
        subCategoryId,
        description,
        price,
        deposit,
        workingHours,
        coupons // ✅ Lấy thêm coupons từ body
      } = req.body;

      if (!name || !subCategoryId) {
        return res.status(400).json({ message: 'Thiếu tên dịch vụ hoặc phân loại' });
      }

      if (price === undefined || isNaN(parseFloat(price))) {
        return res.status(400).json({ message: 'Giá tiền không hợp lệ' });
      }
      if (deposit === undefined || isNaN(parseFloat(deposit))) {
        return res.status(400).json({ message: 'Tiền cọc không hợp lệ' });
      }

      let imageUrl = '';
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'service_images',
          resource_type: 'image'
        });
        fs.unlinkSync(req.file.path);
        imageUrl = result.secure_url;
      }

      // Parse workingHours nếu là chuỗi
      let parsedWorkingHours = [];
      if (workingHours) {
        parsedWorkingHours = typeof workingHours === 'string'
          ? JSON.parse(workingHours)
          : workingHours;
      }

      // ✅ Parse coupons nếu là chuỗi
      let parsedCoupons = [];
      if (coupons) {
        parsedCoupons = typeof coupons === 'string'
          ? JSON.parse(coupons)
          : coupons;
      }

      const newService = await db.Service.create({
        creatorId: user.id,
        name,
        subCategoryId,
        image: imageUrl,
        description,
        price: parseFloat(price),
        deposit: parseFloat(deposit),
        workingHours: parsedWorkingHours,
        coupons: parsedCoupons // ✅ Lưu coupons
      });

      res.status(201).json({
        message: 'Tạo dịch vụ thành công',
        service: newService
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const services = await db.Service.findAll({
      attributes: ['id', 'name', 'description', 'image', 'subCategoryId', 'createdAt','price', 'deposit', 'workingHours', 'coupons'], 
      include: [
        {
          model: db.SubCategory,
          as: 'subCategory',
          attributes: ['id', 'name'],
        },
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'username', 'role','addresses','ward','city','district'],
          where: { role: 'shop' }, 
        },
        {
          model: db.Feedback, 
          as: 'feedbacks', 
          attributes: ['id', 'rating', 'comment', 'createdAt'],
          include: [
            {
              model: db.User,
              as: 'user', 
              attributes: ['id', 'username']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Lấy danh sách dịch vụ thành công',
      services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['shop']),
  upload.single('image'),
  async (req, res) => {
    try {
      const serviceId = req.params.id;
      const user = req.user;
      const {
        name,
        subCategoryId,
        description,
        price,
        deposit,
        workingHours,
        coupons
      } = req.body;

      const service = await db.Service.findOne({
        where: { id: serviceId, creatorId: user.id }
      });

      if (!service) {
        return res.status(404).json({ message: 'Dịch vụ không tồn tại hoặc bạn không có quyền chỉnh sửa' });
      }

      let imageUrl = service.image;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'service_images',
          resource_type: 'image'
        });
        fs.unlinkSync(req.file.path);
        imageUrl = result.secure_url;
      }

      const parsedWorkingHours = workingHours
        ? typeof workingHours === 'string' ? JSON.parse(workingHours) : workingHours
        : service.workingHours;

      const parsedCoupons = coupons
        ? typeof coupons === 'string' ? JSON.parse(coupons) : coupons
        : service.coupons;

      await service.update({
        name: name || service.name,
        subCategoryId: subCategoryId || service.subCategoryId,
        image: imageUrl,
        description: description || service.description,
        price: price !== undefined ? parseFloat(price) : service.price,
        deposit: deposit !== undefined ? parseFloat(deposit) : service.deposit,
        workingHours: parsedWorkingHours,
        coupons: parsedCoupons
      });

      res.status(200).json({
        message: 'Cập nhật dịch vụ thành công',
        service
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
);
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['shop']),
  async (req, res) => {
    try {
      const serviceId = req.params.id;
      const user = req.user;
      const relatedBookings = await db.Booking.findAll({
        where: { serviceId }
      });
      if (relatedBookings.length > 0) {
        return res.status(400).json({ message: "Không thể xóa dịch vụ đang được đặt!" });
      }
      const service = await db.Service.findOne({
        where: { id: serviceId, creatorId: user.id }
      });

      if (!service) {
        return res.status(404).json({ message: 'Dịch vụ không tồn tại hoặc bạn không có quyền xóa' });
      }

      await service.destroy();

      res.status(200).json({ message: 'Xóa dịch vụ thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
);

module.exports = router;
