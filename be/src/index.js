const express = require('express');
const app = express();
const PORT = 3000;

// Middleware để parse JSON
app.use(express.json());

// Import user routes
const userRoutes = require('./routes/user.route');
app.use('/api/users', userRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.send('Backend Node.js với Express');
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
