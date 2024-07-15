// tests/e2e/auth.test.js
const request = require("supertest");
const app = require("../../src/app");
const { sequelize } = require("../../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Authentication e2e Tests", () => {
  test("Register a new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  test("Login with registered user", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    global.token = response.body.token;
  });

  test("Login with incorrect credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid username or password");
  });
});
