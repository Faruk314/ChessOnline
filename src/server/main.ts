import express from "express";
import ViteExpress from "vite-express";
import authRoutes from "./routes/auth";
import errorHandler from "./utils/error";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import setupSocket from "./socket";
dotenv.config();

const app = express();
const server = http.createServer(app);

setupSocket();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(errorHandler);
