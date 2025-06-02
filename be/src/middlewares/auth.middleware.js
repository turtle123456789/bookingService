const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

module.exports = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token không tồn tại' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token không hợp lệ' });

      req.user = user;
      next();
    });
  },

  authorizeRole: (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Không có quyền truy cập' });
      }
      next();
    };
  }
};
