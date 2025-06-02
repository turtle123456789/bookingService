const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const SECRET_KEY = 'your_secret_key';
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
let refreshTokens = [];
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  };

  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

router.post('/register', upload.single('businessLicenseFile'), async (req, res) => {
  try {
    const { username, email, password, role = 'customer', phonenumber } = req.body;
    const businessLicenseFile = req.file?.filename;
    const existing = await User.findOne({ where: { email } });
    console.log('existing :>> ', existing);
      if (existing) return res.status(400).json({ error: 'Email đã tồn tại' });
    const existingPhone = await User.findOne({ where: { phonenumber } });
    console.log('existingPhone :>> ', existingPhone);
      if (existingPhone) return res.status(400).json({ error: 'Số điện thoại đã được sử dụng' });
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      username,
      email,
      phonenumber,
      password: hashedPassword,
      role
    };

    if (role === 'customer') {
      if (!phonenumber) return res.status(400).json({ error: 'Phonenumber là bắt buộc với khách hàng' });
      userData.isActivated = true;
  
    }
  if (role === 'shop') {
    if (!req.file) return res.status(400).json({ error: 'Thiếu file chứng chỉ cho shop' });
    console.log('req.file.path :>> ', req.file.path);
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'business_licenses',
      resource_type: 'auto'
    });
    fs.unlinkSync(req.file.path);

    userData.businessLicenseFile = result.secure_url;
    userData.wallet = 0;
    userData.isActivated = false;
  }

    if (role === 'admin') {
      userData.wallet = 0;
      userData.isActivated = true;
    }

    const user = await User.create(userData);
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Refresh token không hợp lệ' });
  }

  jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token hết hạn hoặc lỗi' });

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    const newAccessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
  });
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(401).json({ error: 'Không tìm thấy người dùng' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
