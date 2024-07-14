const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");
const videoRoutes = require("./routes/videoRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/auth", authRoutes);
app.use("/videos", videoRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
