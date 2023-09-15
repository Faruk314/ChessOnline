import express from "express";
import { getInvites, invite } from "../controllers/invite";
import { protect } from "../utils/protect";

const router = express.Router();

router.post("/sendInvite", protect, invite);

router.get("/getInvites", protect, getInvites);

router.post("/deleteInvite");

export default router;
