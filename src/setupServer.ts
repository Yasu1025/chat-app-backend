import { Application, json, urlencoded } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import compression from "compression";
import "express-async-errors";

const SERVER_PORT = 6000;

export class AppServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    // Middlewares
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    // Error handle
    this.globalErrorHandler(this.app);
    // Start Server
    this.startServer(this.app);
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

  // TODO
  private routesMiddleware(app: Application): void {}
  private globalErrorHandler(app: Application): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      console.log(error);
    }
  }

  // TODO
  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  }
}
