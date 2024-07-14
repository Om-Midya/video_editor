const ffmpeg = require("fluent-ffmpeg");

const getVideoInfo = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};

const trimVideo = (inputPath, outputPath, startTime, duration) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(outputPath)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
};

const mergeVideos = (inputPaths, outputPath) => {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg();

    inputPaths.forEach((inputPath) => {
      ffmpegCommand.input(inputPath);
    });

    ffmpegCommand
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      })
      .mergeToFile(outputPath);
  });
};

module.exports = {
  getVideoInfo,
  trimVideo,
  mergeVideos,
};
