const express = require('express');
const axios = require('axios');
const router = express.Router();

// Thay token này bằng token thật từ Casso
const CASSO_TOKEN = 'YOUR_CASSO_OAUTH_TOKEN';

// Route GET /payment?from_date=YYYY-MM-DD&to_date=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const { from_date, to_date, page = 1, limit = 50 } = req.query;

    const response = await axios.get('https://oauth.casso.vn/v2/transactions', {
      headers: {
        Authorization: `Bearer ${CASSO_TOKEN}`,
      },
      params: {
        from_date,
        to_date,
        page,
        limit,
        sort: 'desc'
      },
    });

    res.status(200).json({
      status: true,
      message: 'Lấy danh sách thanh toán thành công',
      data: response.data.data,
      pagination: response.data.pagination
    });

  } catch (error) {
    console.error('Lỗi khi gọi API Casso:', error.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: 'Lỗi khi lấy danh sách thanh toán từ Casso',
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;
