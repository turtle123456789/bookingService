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
      role,
      status: true
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
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // không trả về password
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
router.patch('/:id/status', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  const { id } = req.params;
  const { status, isActive } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });

    // Cập nhật linh hoạt theo body gửi lên
    if (typeof status !== 'undefined') {
      user.status = status;
    }

    if (typeof isActive !== 'undefined') {
      user.isActivated = isActive;
    }

    await user.save();

    res.json({ 
      message: 'Cập nhật thành công',
      user: {
        id: user.id,
        status: user.status,
        isActivated: user.isActivated
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch(
  '/me',
  authenticateToken,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, phonenumber, email } = req.body;

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });

      // Kiểm tra email nếu thay đổi
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) return res.status(400).json({ error: 'Email đã được sử dụng' });
        user.email = email;
      }

      // Kiểm tra số điện thoại nếu thay đổi
      if (phonenumber && phonenumber !== user.phonenumber) {
        const existingPhone = await User.findOne({ where: { phonenumber } });
        if (existingPhone) return res.status(400).json({ error: 'Số điện thoại đã được sử dụng' });
        user.phonenumber = phonenumber;
      }

      if (username) user.username = username;

      // Nếu có file avatar mới thì upload lên Cloudinary
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'avatars',
          resource_type: 'image',
        });

        fs.unlinkSync(req.file.path); // Xoá file cục bộ sau khi upload

        user.avatar = result.secure_url;
      }

      await user.save();

      res.json({
        message: 'Cập nhật thông tin thành công',
        user: {
          id: user.id,
          email: user.email,
          phonenumber: user.phonenumber,
          username: user.username,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
router.patch(
  '/me/password',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Cần cung cấp mật khẩu cũ và mật khẩu mới' });
      }

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });

      // Kiểm tra mật khẩu cũ có đúng không
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });

      // Hash mật khẩu mới và lưu
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();

      res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
