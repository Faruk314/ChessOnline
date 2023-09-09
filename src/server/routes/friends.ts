import express, { Router } from "express";
import {
  acceptFriendRequest,
  checkFriendRequestStatus,
  deleteFriendRequest,
  getFriendRequests,
  getFriends,
  sendFriendRequest,
} from "../controllers/friends";
import { protect } from "../utils/protect";

const router: Router = express.Router();

router.get("/getFriendRequests", protect, getFriendRequests);

router.get("/getFriends", protect, getFriends);

router.post("/sendFriendRequest", protect, sendFriendRequest);

router.put("/acceptFriendRequest", protect, acceptFriendRequest);

router.post("/checkFriendRequestStatus", protect, checkFriendRequestStatus);

router.put("/deleteFriendRequest", protect, deleteFriendRequest);

export default router;
