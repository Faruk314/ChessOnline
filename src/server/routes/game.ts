import express from "express";
import {
  changeAvatar,
  retrieveGameStatus,
  findUsers,
} from "../controllers/game";
import { protect } from "../utils/protect";

const router = express.Router();

router.get("/retrieveGameStatus/:gameId", protect, retrieveGameStatus);

router.post("/changeAvatar", protect, changeAvatar);

router.get("/findUsers", protect, findUsers);

export default router;
