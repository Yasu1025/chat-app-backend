import { Application } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";

export class AppServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.startServer(this.app);
    this.standardMiddleware(this.app);
  }

  private securityMiddleware(app: Application): void {}
  private standardMiddleware(app: Application): void {}
  private routeMiddleware(app: Application): void {}
  private globalErrorHandler(app: Application): void {}
  private startServer(app: Application): void {}
  private createSocketIO(httpServer: http.Server): void {}
  private startHttpServer(httpServer: http.Server): void {}
}