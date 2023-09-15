import express, { Express } from 'express';
import { AppServer } from './setupServer';
import databaseConnection from './setupDatabase';
import { config } from './config';

class Application {
  public init(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.init();
