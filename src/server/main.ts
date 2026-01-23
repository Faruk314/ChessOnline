import express from "express";
import ViteExpress from "vite-express";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";
import friendRoutes from "./routes/friends";
import inviteRoutes from "./routes/invite";
import errorHandler from "./utils/error";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { setupSocket } from "./socket/socket";

dotenv.config();

const app = express();
const port = Number(process.env.SERVER_PORT) || 3000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://chess.farukspahic.com"],
    credentials: true,
  })
);

const server = http.createServer(app);

setupSocket(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

ViteExpress.bind(app, server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/invite", inviteRoutes);

app.use(errorHandler);
