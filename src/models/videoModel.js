// src/models/videoModel.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Video = sequelize.define(
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

  return Video;
};
