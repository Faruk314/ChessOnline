import express from "express";
import { getLoginStatus, login, logout, register } from "../controllers/auth";
import { changeAvatar, retrieveGameStatus } from "../controllers/game";
import { protect } from "../utils/protect";

const router = express.Router();

router.get("/retrieveGameStatus", protect, retrieveGameStatus);

router.post("/changeAvatar", protect, changeAvatar);

export default router;
