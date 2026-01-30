import express from "express";
import {
  acceptGameInvite,
  getGameInvites,
  sendGameInvite,
  rejectGameInvite,
} from "../controllers/gameInvites";
import { protect } from "../utils/protect";

const router = express.Router();

router.post("/sendGameInvite", protect, sendGameInvite);

router.get("/getGameInvites", protect, getGameInvites);

router.post("/acceptGameInvite", protect, acceptGameInvite);

router.post("/rejectGameInvite", protect, rejectGameInvite);

export default router;
