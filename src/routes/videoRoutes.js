// src/routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const authMiddleware = require("../middlewares/authMiddleware");

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

router.post("/upload", authMiddleware, videoController.upload);
router.post("/merge", authMiddleware, videoController.list);
router.post("/trim", authMiddleware, videoController.trim);
router.post("/share", authMiddleware, videoController.share);

module.exports = router;
