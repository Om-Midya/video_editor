// src/routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

/**
 * @swagger
 * /videos/test:
 *   get:
 *     summary: Test route
 *     responses:
 *       200:
 *         description: Test successful
 */
router.get("/test", videoController.test);

module.exports = router;
