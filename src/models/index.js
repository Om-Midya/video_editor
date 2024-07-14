// src/models/index.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_URL || "./database.sqlite",
});

const User = require("./userModel")(sequelize);
const Video = require("./videoModel")(sequelize);

sequelize.sync();

const db = {
  sequelize,
  User,
  Video,
};

module.exports = db;
