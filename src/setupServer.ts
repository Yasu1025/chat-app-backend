import { Application, json, urlencoded } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import compression from "compression";
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

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: "session",
        keys: ["test1", "test2"], // TODO: change later
        maxAge: 24 * 7 * 3600000, // 7 days
        secure: false, // TODO: change later
      })
    );

    app.use(hpp()); // For http param pollutions
    app.use(helmet()); // Security header
    app.use(
      cors({
        origin: "*", // TODO: change later
        credentials: true, // caz we use cookie
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    const limitMB = "50mb";
    app.use(compression()); // to help compress our req
    app.use(json({ limit: limitMB }));
    app.use(urlencoded({ extended: true, limit: limitMB }));
  }

  private routeMiddleware(app: Application): void {}
  private globalErrorHandler(app: Application): void {}
  private startServer(app: Application): void {}
  private createSocketIO(httpServer: http.Server): void {}
  private startHttpServer(httpServer: http.Server): void {}
}
