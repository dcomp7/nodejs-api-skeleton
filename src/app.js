import express from "express";
import routes from "./app/routes.js";
import "./database/index.js";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      );
      next();
    });
    this.server.use((req, res, next) => {
      console.log("Request was made to: " + req.originalUrl);
      next();
    });
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
