import express from "express";
import { getLoginStatus, login, logout, register } from "../controllers/auth";
import { changeAvatar, retrieveGameStatus } from "../controllers/game";

const router = express.Router();

router.get("/retrieveGameStatus", retrieveGameStatus);

router.post("/changeAvatar", changeAvatar);

export default router;
