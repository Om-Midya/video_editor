const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index").sequelize;

const User = sequelize.define(
  "Video",
  {
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Video;
