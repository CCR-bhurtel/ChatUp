import { Express } from "express";
import path from "path";
import { Options } from "swagger-jsdoc";
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "ChatUp REST API",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Shishir Bhurtel",
        url: "https://www.shishirbhurtel.com.np",
        email: "bhurtelshishir@gmail.com",
      },
    },
    servers: [{ url: "http://localhost:8000/api/v1" }],
  },
  apis: [path.join(__dirname, "../docs/*.yml")],
};

const specs = swaggerJsdoc(options);

export default (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCssUrl:
        "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
    })
  );
};
