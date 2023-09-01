import express from "express";
import { getLoginStatus, login, logout, register } from "../controllers/auth";
import { retrieveGameStatus } from "../controllers/game";

const router = express.Router();

router.get("/retrieveGameStatus", retrieveGameStatus);

export default router;
