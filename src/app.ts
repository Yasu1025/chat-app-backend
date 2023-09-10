import express, { Express } from "express";
import { AppServer } from "./setupServer";

class Application {
  public init(): void {
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.init();
