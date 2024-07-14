// src/routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /videos/upload:
 *   post:
 *     summary: Upload a video
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post("/upload", authMiddleware, videoController.uploadVideo);

/**
 * @swagger
 * /videos/trim:
 *   post:
 *     summary: Trim a video
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video trimmed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Video not found
 */
router.post("/trim", authMiddleware, videoController.trimVideoController);

/**
 * @swagger
 * /videos/merge:
 *   post:
 *     summary: Merge videos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Videos merged successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: One or more videos not found
 */
router.post("/merge", authMiddleware, videoController.mergeVideosController);

module.exports = router;
