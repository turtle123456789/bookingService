const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const { Op } = require('sequelize');

router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalCustomers, totalShops, totalBookings, totalServices, newCustomers, newShops, newBookings, newServices] = await Promise.all([
      db.User.count({ where: { role: 'customer' } }),
      db.User.count({ where: { role: 'shop' } }),
      db.Booking.count(),
      db.Service.count(),
      db.User.count({ where: { role: 'customer', createdAt: { [Op.gte]: sevenDaysAgo } } }),
      db.User.count({ where: { role: 'shop', createdAt: { [Op.gte]: sevenDaysAgo } } }),
      db.Booking.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } }),
      db.Service.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } })
    ]);

    res.json({
      totalCustomers,
      totalShops,
      totalBookings,
      totalServices,
      newCustomers,
      newShops,
      newBookings,
      newServices
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy dữ liệu doanh thu theo ngày
router.get('/revenue', authenticateToken, authorizeRole(['admin', 'shop']), async (req, res) => {
  try {
    const { start, end, shopId } = req.query;

    const where = { };
    // Chỉ tính những booking có số tiền đặt cọc > 0
    where.depositAmount = { [Op.gt]: 0 };
    if (start) {
      where.createdAt = { ...(where.createdAt || {}), [Op.gte]: new Date(start) };
    }
    if (end) {
      where.createdAt = { ...(where.createdAt || {}), [Op.lte]: new Date(end) };
    }

    // Lọc theo shop nếu cần
    const include = [{ model: db.Service, as: 'service', attributes: ['creatorId'] }];
    if (req.user.role === 'shop') {
      where['$service.creatorId$'] = req.user.id;
    } else if (shopId) {
      where['$service.creatorId$'] = shopId;
    }

    const bookings = await db.Booking.findAll({
      where,
      attributes: ['depositAmount', 'createdAt'],
      include
    });

    const revenueMap = {};
    bookings.forEach(b => {
      const date = b.createdAt.toISOString().split('T')[0];
      const amount = parseFloat(b.depositAmount) || 0;
      revenueMap[date] = (revenueMap[date] || 0) + amount;
    });

    const data = Object.entries(revenueMap)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, revenue]) => ({ date, revenue }));

    res.json(data);
  } catch (err) {
    console.error('Error fetching revenue:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;