module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin', 'shop'),
      allowNull: false,
      defaultValue: 'customer'
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isPayment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
    wallet: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    businessLicenseFile: {
      type: DataTypes.STRING,
      allowNull: true
    },
     isActivated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};
