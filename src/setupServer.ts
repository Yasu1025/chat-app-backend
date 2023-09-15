import { Application, json, urlencoded } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import compression from "compression";
import "express-async-errors";
import { config } from "./config";
import { Server } from "socket.io";
import { createClient } from "redis";
import { connect } from "mongoose";
import { createAdapter } from "@socket.io/redis-adapter";
import ApplicationRoutes from "./routes";

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
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000, // 7 days
        secure: config.NODE_ENV !== "development",
      })
    );

    app.use(hpp()); // For http param pollutions
    app.use(helmet()); // Security header
    app.use(
      cors({
        origin: config.CLIENT_URL,
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

  private routesMiddleware(app: Application): void {
    ApplicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnection(socketIO);
    } catch (error) {
      console.log(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    console.log(`Server has started with process ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  }

  private socketIOConnection(io: Server): void {}
}
