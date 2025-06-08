const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// Load tất cả các model
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const modelModule = require(modelPath);

    if (typeof modelModule !== 'function') {
      console.error(`❌ File "${file}" không export một function. Giá trị xuất ra là:`, modelModule);
    } else {
      const model = modelModule(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });


// === Khai báo quan hệ giữa các model ===
// User <-> Category
db.Category.belongsTo(db.User, {
  foreignKey: 'creatorId',
  as: 'creator'
});
db.User.hasMany(db.Category, {
  foreignKey: 'creatorId',
  as: 'categories'
});

// Category <-> SubCategory
db.Category.hasMany(db.SubCategory, {
  foreignKey: 'categoryId',
  as: 'subCategories',
  onDelete: 'CASCADE',
});
db.SubCategory.belongsTo(db.Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// Ví tiền
// db.User.hasOne(db.Wallet, {
//   foreignKey: 'userId',
//   as: 'wallet',
//   onDelete: 'CASCADE',
// });
// db.Wallet.belongsTo(db.User, {
//   foreignKey: 'userId',
//   as: 'user',
// });

// Chứng chỉ (Certificate) – chỉ dành cho Shop
// db.User.hasOne(db.Certificate, {
//   foreignKey: 'userId',
//   as: 'certificate',
//   onDelete: 'CASCADE',
// });
// db.Certificate.belongsTo(db.User, {
//   foreignKey: 'userId',
//   as: 'user',
// });

// db.Shop.belongsTo(db.User, {
//   foreignKey: 'creatorId',
//   as: 'creator',
// });
// db.User.hasOne(db.Shop, {
//   foreignKey: 'creatorId',
//   as: 'shop',
// });

db.Service.belongsTo(db.User, {
  foreignKey: 'creatorId',
  as: 'creator',
});
db.User.hasMany(db.Service, {
  foreignKey: 'creatorId',
  as: 'services',
});

// Service -> SubCategory
db.Service.belongsTo(db.SubCategory, {
  foreignKey: 'subCategoryId',
  as: 'subCategory',
});
db.SubCategory.hasMany(db.Service, {
  foreignKey: 'subCategoryId',
  as: 'services',
});
db.Booking.belongsTo(db.User, { foreignKey: 'userId', as: 'customer' });
db.User.hasMany(db.Booking, { foreignKey: 'userId', as: 'bookings' });

db.Booking.belongsTo(db.Service, { foreignKey: 'serviceId', as: 'service' });
db.Service.hasMany(db.Booking, { foreignKey: 'serviceId', as: 'bookings' });
// Service associations
db.Service.hasMany(db.Feedback, { foreignKey: 'serviceId', as: 'feedbacks' });
db.Feedback.belongsTo(db.Service, { foreignKey: 'serviceId', as: 'service' });

// User associations
db.User.hasMany(db.Feedback, { foreignKey: 'userId', as: 'feedbacks' });
db.Feedback.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.sequelize = sequelize;
module.exports = db;
