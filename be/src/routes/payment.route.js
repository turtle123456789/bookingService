const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateToken } = require('../middlewares/auth.middleware');
router.post("/generate-vietqr",authenticateToken, async (req, res) => {
  const { accountNo, accountName, amount, addInfo, template } = req.body;

  try {
    const response = await axios.post(
      "https://api.vietqr.io/v2/generate",
      {
        accountNo,
        accountName,
        acqId: "970422", // mã ngân hàng, ví dụ MB Bank
        amount,
        addInfo,
        template: template || "compact",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo mã QR", error });
  }
});

module.exports = router;
