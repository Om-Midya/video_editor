// tests/unit/videoController.test.js
const {
  uploadVideo,
  trimVideoController,
  mergeVideosController,
} = require("../../src/controllers/videoController");
const Video = require("../../src/models/videoModel");
const {
  getVideoInfo,
  trimVideo,
  mergeVideos,
} = require("../../src/utils/ffmpegHelper");
const multer = require("multer");

jest.mock("../../src/models/videoModel");
jest.mock("../../src/utils/ffmpegHelper");

// Properly mock multer
jest.mock("multer", () => {
  const mMulter = {
    diskStorage: jest.fn(() => ({
      _handleFile: jest.fn(),
      _removeFile: jest.fn(),
    })),
    single: jest.fn(() => (req, res, next) => next()),
  };
  return jest.fn(() => mMulter);
});

describe("Video Controller", () => {
  describe("uploadVideo", () => {
    it("should upload a video", async () => {
      const req = {
        file: {
          filename: "test.mp4",
          originalname: "test.mp4",
          path: "uploads/test.mp4",
          size: 1024,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      getVideoInfo.mockResolvedValue({ format: { duration: 60 } });
      Video.create.mockResolvedValue({ id: 1, filename: "test.mp4" });

      await uploadVideo(req, res);

      expect(getVideoInfo).toHaveBeenCalledWith("uploads/test.mp4");
      expect(Video.create).toHaveBeenCalledWith({
        filename: "test.mp4",
        originalname: "test.mp4",
        path: "uploads/test.mp4",
        duration: 60,
        size: 1024,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Video uploaded successfully",
        video: { id: 1, filename: "test.mp4" },
      });
    });

    it("should return error if no file is uploaded", async () => {
      const req = { file: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await uploadVideo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" });
    });
  });

  describe("trimVideoController", () => {
    it("should trim a video", async () => {
      const req = { body: { videoId: 1, startTime: 0, endTime: 10 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Video.findByPk.mockResolvedValue({
        id: 1,
        filename: "test.mp4",
        path: "uploads/test.mp4",
      });
      trimVideo.mockResolvedValue(true);
      getVideoInfo.mockResolvedValue({ format: { duration: 10 } });
      Video.create.mockResolvedValue({ id: 2, filename: "trimmed_test.mp4" });

      await trimVideoController(req, res);

      expect(Video.findByPk).toHaveBeenCalledWith(1);
      expect(trimVideo).toHaveBeenCalledWith(
        "uploads/test.mp4",
        expect.any(String),
        0,
        10
      );
      expect(getVideoInfo).toHaveBeenCalledWith(expect.any(String));
      expect(Video.create).toHaveBeenCalledWith({
        filename: expect.any(String),
        originalname: "test.mp4",
        path: expect.any(String),
        duration: 10,
        size: expect.any(Number),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Video trimmed successfully",
        trimmedVideo: { id: 2, filename: "trimmed_test.mp4" },
      });
    });
  });

  describe("mergeVideosController", () => {
    it("should merge videos", async () => {
      const req = { body: { videoIds: [1, 2] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Video.findAll.mockResolvedValue([
        { id: 1, path: "uploads/test1.mp4" },
        { id: 2, path: "uploads/test2.mp4" },
      ]);
      mergeVideos.mockResolvedValue(true);
      getVideoInfo.mockResolvedValue({ format: { duration: 120 } });
      Video.create.mockResolvedValue({ id: 3, filename: "merged_test.mp4" });

      await mergeVideosController(req, res);

      expect(Video.findAll).toHaveBeenCalledWith({ where: { id: [1, 2] } });
      expect(mergeVideos).toHaveBeenCalledWith(
        ["uploads/test1.mp4", "uploads/test2.mp4"],
        expect.any(String)
      );
      expect(getVideoInfo).toHaveBeenCalledWith(expect.any(String));
      expect(Video.create).toHaveBeenCalledWith({
        filename: expect.any(String),
        originalname: "Merged Video",
        path: expect.any(String),
        duration: 120,
        size: expect.any(Number),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Videos merged successfully",
        mergedVideo: { id: 3, filename: "merged_test.mp4" },
      });
    });
  });
});
