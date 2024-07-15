// tests/e2e/video.test.js
const request = require("supertest");
const app = require("../../src/app.js");
const { sequelize, Video } = require("../../src/models/index.js");
const fs = require("fs");
const path = require("path");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create a test user and login to get the token
  await request(app)
    .post("/auth/register")
    .send({ username: "testuser", password: "testpassword" });

  const response = await request(app)
    .post("/auth/login")
    .send({ username: "testuser", password: "testpassword" });

  global.token = response.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Video e2e Tests", () => {
  let videoIds = [];

  test("Upload first video", async () => {
    const response = await request(app)
      .post("/videos/upload")
      .set("Authorization", `Bearer ${global.token}`)
      .attach("video", path.resolve(__dirname, "../sample1.mp4"));

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Video uploaded successfully");
    expect(response.body.video).toHaveProperty("id");

    videoIds.push(response.body.video.id);
  });

  test("Upload second video", async () => {
    const response = await request(app)
      .post("/videos/upload")
      .set("Authorization", `Bearer ${global.token}`)
      .attach("video", path.resolve(__dirname, "../sample2.mp4"));

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Video uploaded successfully");
    expect(response.body.video).toHaveProperty("id");

    videoIds.push(response.body.video.id);
  });

  test("Trim the first video", async () => {
    const response = await request(app)
      .post("/videos/trim")
      .set("Authorization", `Bearer ${global.token}`)
      .send({ videoId: videoIds[0], startTime: 0, endTime: 5 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Video trimmed successfully");
    expect(response.body.trimmedVideo).toHaveProperty("id");
  });

  test("Merge the uploaded videos", async () => {
    const response = await request(app)
      .post("/videos/merge")
      .set("Authorization", `Bearer ${global.token}`)
      .send({ videoIds });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Videos merged successfully");
    expect(response.body.mergedVideo).toHaveProperty("id");
  });
});
