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
      const { name, subCategoryId, description, price, deposit } = req.body;

      if (!name || !subCategoryId) {
        return res.status(400).json({ message: 'Thiếu tên dịch vụ hoặc phân loại' });
      }

      // Có thể kiểm tra thêm price và deposit là số hợp lệ
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

      const newService = await db.Service.create({
        creatorId: user.id,
        name,
        subCategoryId,
        image: imageUrl,
        description,
        price: parseFloat(price),
        deposit: parseFloat(deposit),
      });

      res.status(201).json({
        message: 'Tạo dịch vụ thành công',
        service: newService
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const services = await db.Service.findAll({
      attributes: ['id', 'name', 'description', 'image', 'subCategoryId', 'createdAt'], // trường muốn lấy
      include: [
        {
          model: db.SubCategory,
          as: 'subCategory',
          attributes: ['id', 'name'],
        },
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'username', 'role'],
          where: { role: 'shop' }, // lấy dịch vụ chỉ của các shop
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
module.exports = router;
