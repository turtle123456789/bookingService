const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const SECRET_KEY = 'your_secret_key';
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
let refreshTokens = [];
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

  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

