import express from "express";
import ViteExpress from "vite-express";
import authRoutes from "./routes/auth";
import errorHandler from "./utils/error";

const app = express();

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

app.use("/api/auth", authRoutes);

app.use(errorHandler);
