const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index").sequelize;

const User = sequelize.define("User", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
