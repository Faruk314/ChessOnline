import express from "express";
import {
  acceptInvite,
  getInvites,
  invite,
  rejectInvite,
} from "../controllers/invite";
import { protect } from "../utils/protect";

const router = express.Router();

router.post("/sendInvite", protect, invite);

router.get("/getInvites", protect, getInvites);

router.post("/acceptInvite", protect, acceptInvite);

router.post("/rejectInvite", protect, rejectInvite);

export default router;
