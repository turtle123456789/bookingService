module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Category.associate = (models) => {
    Category.hasMany(models.SubCategory, {
      as: 'subCategories',
      foreignKey: 'categoryId',
      onDelete: 'CASCADE',
    });

    Category.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
  };

  return Category;
};
