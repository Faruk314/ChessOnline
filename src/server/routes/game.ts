import express from "express";
import { retrieveGameStatus } from "../controllers/game";
import { protect } from "../utils/protect";

const router = express.Router();

router.get("/retrieveGameStatus/:gameId", protect, retrieveGameStatus);

export default router;
