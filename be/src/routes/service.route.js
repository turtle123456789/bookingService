const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const db = require('../models');

router.post('/', authenticateToken, authorizeRole(['shop']), async (req, res) => {
  try {
    const { name, shopId, subCategoryId, image, description } = req.body;
    const creatorId = req.user.id;

    const service = await db.Service.create({
      name,
      shopId,
      subCategoryId,
      image,
      description,
      creatorId,
    });

    res.status(201).json({ message: 'Tạo dịch vụ thành công', service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi tạo service' });
  }
});

module.exports = router;
