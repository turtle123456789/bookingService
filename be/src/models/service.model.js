module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false, 
      defaultValue: 0,
    },
    deposit: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return Service;
};
