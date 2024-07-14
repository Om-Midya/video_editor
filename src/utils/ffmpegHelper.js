// src/utils/ffmpegHelper.js
const ffmpeg = require("fluent-ffmpeg");
const ffprobeStatic = require("ffprobe-static");

ffmpeg.setFfprobePath(ffprobeStatic.path);

const getVideoInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata);
    });
  });
};

const trimVideo = (inputPath, outputPath, startTime, endTime) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
};

const mergeVideos = (inputPaths, outputPath) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    inputPaths.forEach((inputPath) => command.input(inputPath));
    command.on("end", resolve).on("error", reject).mergeToFile(outputPath);
  });
};

module.exports = {
  getVideoInfo,
  trimVideo,
  mergeVideos,
};
