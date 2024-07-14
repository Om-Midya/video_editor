// src/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Video Editor API",
      version: "1.0.0",
      description: "API documentation for the Video Editor project",
    },
    servers: [
      {
        url: "http://localhost:3000", // Change to your server URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
