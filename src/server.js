require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log("Connected to the database");

    //Sync the database
    await sequelize.sync();
    console.log("Database synchronized");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
};

startServer();
