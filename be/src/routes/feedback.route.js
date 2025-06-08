const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const db = require('../models');

router.post(
  '/',
  authenticateToken,
  async (req, res) => {
    try {
      const { serviceId, rating, comment } = req.body;
      const userId = req.user.id;

      if (!serviceId || !rating) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
      }

      // Kiểm tra dịch vụ tồn tại
      const service = await db.Service.findByPk(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
      }

      // Tạo feedback
      const feedback = await db.Feedback.create({
        userId,
        serviceId,
        rating,
        comment
      });

      res.status(201).json({ message: 'Gửi đánh giá thành công', feedback });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
);

// Lấy tất cả feedback của 1 service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;

    const feedbacks = await db.Feedback.findAll({
      where: { serviceId },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
