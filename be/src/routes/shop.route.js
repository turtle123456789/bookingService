const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
router.get('/', async (req, res) => {
  try {
    const { isActivated } = req.query;

    const whereClause = {
      role: 'shop'
    };

    // Nếu có query isActivated thì thêm vào where
    if (isActivated === 'true') {
      whereClause.isActivated = true;
    } else if (isActivated === 'false') {
      whereClause.isActivated = false;
    }

    const shops = await User.findAll({
      where: whereClause,
      attributes: ['id', 'username', 'email', 'phonenumber', 'isActivated', 'status', 'avatar', 'businessLicenseFile', 'createdAt', 'isPayment'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ shops });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách shop:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách shop' });
  }
});

module.exports = router;
