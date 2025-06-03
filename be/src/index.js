const express = require('express');
const app = express();

const PORT = 3001;
const cors = require('cors');
const db = require('./models');
app.use(express.json());
app.use(cors());
const userRoutes = require('./routes/user.route');
const categoryRoutes = require('./routes/category.route');
const shopRoutes = require('./routes/shop.route');
const uploadImage = require('./routes/upload.route');
const serviceRoutes = require('./routes/service.route');
const bookingRoutes = require('./routes/booking.route');
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload-image', uploadImage);
app.get('/', (req, res) => {
  res.send('Backend Node.js với Express');
});

db.sequelize.sync({ alter: true }) .then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Lỗi kết nối DB:', err);
});
