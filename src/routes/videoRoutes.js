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

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Get a list of uploaded videos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of uploaded videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   filename:
 *                     type: string
 *                   originalname:
 *                     type: string
 *                   path:
 *                     type: string
 *                   duration:
 *                     type: number
 *                   size:
 *                     type: integer
 *                   url:
 *                     type: string
 */
router.get("/", authMiddleware, videoController.listVideos);

/**
 * @swagger
 * /videos/share:
 *   post:
 *     summary: Generate a shareable link for a video with an expiry time
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
 *               expiryTime:
 *                 type: integer
 *                 description: Expiry time in seconds from now
 *     responses:
 *       200:
 *         description: Shareable link generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   type: string
 */
router.post("/share", authMiddleware, videoController.generateShareableLink);

/**
 * @swagger
 * /videos/share/{filename}:
 *   get:
 *     summary: Access a shared video link
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The video filename
 *       - in: query
 *         name: expiry
 *         schema:
 *           type: integer
 *         required: true
 *         description: Expiry timestamp
 *       - in: query
 *         name: signature
 *         schema:
 *           type: string
 *         required: true
 *         description: Signature
 *     responses:
 *       200:
 *         description: Video file
 *       400:
 *         description: Invalid link
 *       410:
 *         description: Link expired
 */
router.get("/share/:filename", videoController.accessSharedLink);

module.exports = router;
