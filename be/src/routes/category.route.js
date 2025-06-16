const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const db = require('../models');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

router.post(
  '/',
  authenticateToken,
  authorizeRole(['shop']),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, subCategories } = req.body;
      const creatorId = req.user.id;

      const subCats = subCategories ? JSON.parse(subCategories) : [];

      // --- Upload ảnh chính (image)
      let categoryImageUrl = null;
      if (req.files['image'] && req.files['image'][0]) {
        const imagePath = req.files['image'][0].path;
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: 'categories',
          resource_type: 'auto'
        });
        fs.unlinkSync(imagePath);
        categoryImageUrl = result.secure_url;
      }

      // --- Tạo hoặc tìm category
      let category = await db.Category.findOne({ where: { name } });
      if (!category) {
        category = await db.Category.create({
          name,
          creatorId,
          image: categoryImageUrl,
        });
      } else if (categoryImageUrl) {
        await category.update({ image: categoryImageUrl });
      }

      // --- Tạo sub categories
      if (subCats.length > 0) {
        const existingSubs = await db.SubCategory.findAll({
          where: { categoryId: category.id },
          attributes: ['name'],
        });
        const existingSubNames = existingSubs.map(sub => sub.name);

        const newSubs = [];
        const subImagesFiles = req.files['subImages'] || [];

        for (let i = 0; i < subCats.length; i++) {
          const sub = subCats[i];
          if (!existingSubNames.includes(sub.name)) {
            let subImageUrl = null;

            if (subImagesFiles[i]) {
              const subImagePath = subImagesFiles[i].path;
              const subResult = await cloudinary.uploader.upload(subImagePath, {
                folder: 'subcategories',
                resource_type: 'auto'
              });
              fs.unlinkSync(subImagePath);
              subImageUrl = subResult.secure_url;
            }

            newSubs.push({
              name: sub.name,
              categoryId: category.id,
              subImages: subImageUrl,
            });
          }
        }

        if (newSubs.length > 0) {
          await db.SubCategory.bulkCreate(newSubs);
        }
      }

      return res.status(201).json({ message: 'Tạo danh mục thành công', category });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi tạo danh mục', error: err.message });
    }
  }
);


router.get('/public', async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      include: [
        {
          model: db.SubCategory,
          as: 'subCategories',
          attributes: ['id', 'name', 'subImages']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục công khai' });
  }
});
router.get('/', authenticateToken, authorizeRole(['shop']), async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      where: { creatorId: req.user.id },
      include: [
        {
          model: db.SubCategory,
          as: 'subCategories',
          attributes: ['id', 'name', 'subImages'],
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục' });
  }
});

// Cập nhật category
router.put(
  '/:categoryId',
  authenticateToken,
  authorizeRole(['shop']),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 10 },
  ]),
  async (req, res) => {
    const { categoryId } = req.params;
    const userId = req.user.id;

    try {
      const category = await db.Category.findOne({
        where: { id: categoryId, creatorId: userId },
        include: [{ model: db.SubCategory, as: 'subCategories' }],
      });

      if (!category) {
        return res.status(404).json({ message: 'Danh mục không tồn tại hoặc không có quyền' });
      }

      let imageUrl = category.image;
      if (req.files['image'] && req.files['image'][0]) {
        const result = await cloudinary.uploader.upload(req.files['image'][0].path, {
          folder: 'categories',
          resource_type: 'auto'
        });
        fs.unlinkSync(req.files['image'][0].path);
        imageUrl = result.secure_url;
      }

      await category.update({
        name: req.body.name || category.name,
        image: imageUrl
      });

      // Thêm mới sub category nếu có truyền lên
      if (req.body.subCategories) {
        const newSubCats = JSON.parse(req.body.subCategories);

        const existingSubs = await db.SubCategory.findAll({
          where: { categoryId: category.id },
          attributes: ['name'],
        });
        const existingSubNames = existingSubs.map(s => s.name);

        const toCreate = [];
        const subImagesFiles = req.files['subImages'] || [];

        for (let i = 0; i < newSubCats.length; i++) {
          const sub = newSubCats[i];
          if (!existingSubNames.includes(sub.name)) {
            let subImageUrl = null;
            if (subImagesFiles[i]) {
              const subResult = await cloudinary.uploader.upload(subImagesFiles[i].path, {
                folder: 'subcategories',
                resource_type: 'auto'
              });
              fs.unlinkSync(subImagesFiles[i].path);
              subImageUrl = subResult.secure_url;
            }

            toCreate.push({
              name: sub.name,
              categoryId: category.id,
              subImages: subImageUrl,
            });
          }
        }

        if (toCreate.length > 0) {
          await db.SubCategory.bulkCreate(toCreate);
        }
      }

      // Lấy lại category kèm subCategories
      const updatedCategory = await db.Category.findByPk(category.id, {
        include: [{ model: db.SubCategory, as: 'subCategories' }],
      });

      return res.status(200).json({ message: 'Cập nhật danh mục thành công', category: updatedCategory });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi khi cập nhật danh mục' });
    }
  }
);

// Cập nhật sub category
router.put(
  '/sub/:subCategoryId',
  authenticateToken,
  authorizeRole(['shop']),
  upload.single('image'),
  async (req, res) => {
    const { subCategoryId } = req.params;
    const userId = req.user.id;

    try {
      const subCategory = await db.SubCategory.findOne({
        where: { id: subCategoryId },
        include: {
          model: db.Category,
          as: 'category',
          where: { creatorId: userId }
        }
      });

      if (!subCategory) {
        return res.status(404).json({ message: 'Danh mục con không tồn tại hoặc không có quyền' });
      }

      let imageUrl = subCategory.subImages;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'subcategories',
          resource_type: 'auto'
        });
        fs.unlinkSync(req.file.path);
        imageUrl = result.secure_url;
      }

      await subCategory.update({
        name: req.body.name || subCategory.name,
        subImages: imageUrl
      });

      return res.status(200).json({ message: 'Cập nhật danh mục con thành công', subCategory });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi khi cập nhật danh mục con' });
    }
  }
);

router.delete('/:categoryId', authenticateToken, authorizeRole(['shop']), async (req, res) => {
  const { categoryId } = req.params;
  const userId = req.user.id;

  try {
    // Tìm category có creatorId là user hiện tại
    const category = await db.Category.findOne({
      where: { id: categoryId, creatorId: userId }
    });

    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại hoặc không có quyền' });
    }

    // Xóa tất cả sub categories thuộc category này
    await db.SubCategory.destroy({ where: { categoryId: category.id } });

    // Xóa category cha
    await category.destroy();

    return res.status(200).json({ message: 'Xóa danh mục và toàn bộ danh mục con thành công' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi xóa danh mục' });
  }
});
router.delete('/sub/:subCategoryId', authenticateToken, authorizeRole(['shop']), async (req, res) => {
  const { subCategoryId } = req.params;
  const userId = req.user.id;

  try {
    // Tìm sub category và check quyền dựa trên category.creatorId
    const subCategory = await db.SubCategory.findOne({
      where: { id: subCategoryId },
      include: {
        model: db.Category,
        as: 'category',
        where: { creatorId: userId }
      }
    });

    if (!subCategory) {
      return res.status(404).json({ message: 'Danh mục con không tồn tại hoặc không có quyền' });
    }

    await subCategory.destroy();

    return res.status(200).json({ message: 'Xóa danh mục con thành công' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi xóa danh mục con' });
  }
});

module.exports = router;
