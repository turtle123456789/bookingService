const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
router.get('/', async (req, res) => {
  try {
    const shops = await User.findAll({
      where: { role: 'shop', isActivated: true },
      attributes: ['id', 'username', 'email', 'phonenumber','isActivated','avatar', 'businessLicenseFile', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ shops });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách shop:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách shop' });
  }
});

module.exports = router;
