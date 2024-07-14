// src/models/index.js
const { Sequelize } = require("sequelize");

// Initialize Sequelize with SQLite database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_URL || "./database.sqlite",
});

const User = require("./userModel");
const Video = require("./videoModel");

module.exports = {
  sequelize,
  User,
  Video,
};
