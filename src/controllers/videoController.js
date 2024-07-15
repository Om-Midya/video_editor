const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Video } = require("../models"); // Correctly import Video model
const {
  getVideoInfo,
  trimVideo,
  mergeVideos,
} = require("../utils/ffmpegHelper");

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /mp4|mov|avi|mkv/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Videos Only!");
    }
  },
}).single("video");

const uploadVideo = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ error: err.message });
    }

    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const videoInfo = await getVideoInfo(file.path);
      const duration = videoInfo.format.duration;

      if (duration > 120) {
        fs.unlinkSync(file.path);
        return res
          .status(400)
          .json({ error: "Video duration exceeds 2 minutes" });
      }

      const video = await Video.create({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        duration: videoInfo.format.duration,
        size: file.size,
      });
      res.status(201).json({ message: "Video uploaded successfully", video });
    } catch (error) {
      console.error("Video processing error:", error);
      res.status(500).json({ error: "Failed to process video" });
    }
  });
};

const trimVideoController = async (req, res) => {
  const { videoId, startTime, endTime } = req.body;

  try {
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const trimmedFilename = `trimmed_${Date.now()}_${video.filename}`;
    const trimmedPath = path.join("uploads", trimmedFilename);

    await trimVideo(video.path, trimmedPath, startTime, endTime);

    // Save the trimmed video metadata
    const trimmedVideoInfo = await getVideoInfo(trimmedPath);
    const trimmedVideo = await Video.create({
      filename: trimmedFilename,
      originalname: video.originalname,
      path: trimmedPath,
      duration: trimmedVideoInfo.format.duration,
      size: fs.statSync(trimmedPath).size,
    });

    res
      .status(201)
      .json({ message: "Video trimmed successfully", trimmedVideo });
  } catch (error) {
    console.error("Trim video error:", error);
    res.status(500).json({ error: "Failed to trim video" });
  }
};

const mergeVideosController = async (req, res) => {
  const { videoIds } = req.body;

  try {
    const videos = await Video.findAll({ where: { id: videoIds } });
    if (videos.length !== videoIds.length) {
      return res.status(404).json({ error: "One or more videos not found" });
    }

    const inputPaths = videos.map((video) => video.path);
    const mergedFilename = `merged_${Date.now()}.mp4`;
    const mergedPath = path.join("uploads", mergedFilename);

    await mergeVideos(inputPaths, mergedPath);

    // Save the merged video metadata
    const mergedVideoInfo = await getVideoInfo(mergedPath);
    const mergedVideo = await Video.create({
      filename: mergedFilename,
      originalname: "Merged Video",
      path: mergedPath,
      duration: mergedVideoInfo.format.duration,
      size: fs.statSync(mergedPath).size,
    });

    res
      .status(201)
      .json({ message: "Videos merged successfully", mergedVideo });
  } catch (error) {
    console.error("Merge video error:", error);
    res.status(500).json({ error: "Failed to merge videos" });
  }
};

const listVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    const videoList = videos.map((video) => ({
      id: video.id,
      filename: video.filename,
      originalname: video.originalname,
      path: video.path,
      duration: video.duration,
      size: video.size,
      url: `${req.protocol}://${req.get("host")}/videos/${video.filename}`,
    }));
    res.status(200).json(videoList);
  } catch (error) {
    console.error("Failed to retrieve videos:", error);
    res.status(500).json({ error: "Failed to retrieve videos" });
  }
};

module.exports = {
  uploadVideo,
  trimVideoController,
  mergeVideosController,
  listVideos,
};
