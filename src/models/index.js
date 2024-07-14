// src/models/index.js
const { Sequelize } = require("sequelize");

// Initialize Sequelize with SQLite database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_URL || "./database.sqlite",
});

module.exports = { sequelize };
