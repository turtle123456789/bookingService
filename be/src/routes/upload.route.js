const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// Cấu hình multer lưu file tạm
const upload = multer({ dest: 'uploads/' });

// API upload ảnh (1 ảnh duy nhất)
router.post('/', upload.single('upload'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Không có ảnh được upload' });
    }

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'ckeditor',
      resource_type: 'auto',
    });

    // Xóa file tạm
    fs.unlinkSync(file.path);

    // Trả về định dạng CKEditor yêu cầu
    return res.status(200).json({
      url: result.secure_url, // Trường CKEditor cần
    });
  } catch (err) {
    console.error('Lỗi upload ảnh:', err);
    res.status(500).json({ error: 'Lỗi upload ảnh' });
  }
});

module.exports = router;
