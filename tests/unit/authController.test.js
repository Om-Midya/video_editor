// tests/unit/authController.test.js
const { register, login } = require("../../src/controllers/authController");
const { User } = require("../../src/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../src/models");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  describe("register", () => {
    it("should register a new user", async () => {
      const req = {
        body: { username: "testuser", password: "testpassword" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.create.mockResolvedValue({ id: 1, username: "testuser" });

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("testpassword", 10);
      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        password: "hashedpassword",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
      });
    });

    it("should return error if username already exists", async () => {
      const req = {
        body: { username: "testuser", password: "testpassword" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.create.mockRejectedValue(new Error("Username already exists"));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Username already exists",
      });
    });
  });

  describe("login", () => {
    it("should login a user and return a token", async () => {
      const req = {
        body: { username: "testuser", password: "testpassword" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue({
        id: 1,
        username: "testuser",
        password: "hashedpassword",
      });
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue("token");

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        "testpassword",
        "hashedpassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, username: "testuser" },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    it("should return error if username or password is incorrect", async () => {
      const req = {
        body: { username: "testuser", password: "wrongpassword" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue({
        id: 1,
        username: "testuser",
        password: "hashedpassword",
      });
      bcrypt.compareSync.mockReturnValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid username or password",
      });
    });
  });
});
