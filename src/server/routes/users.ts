import express from "express";
import { changeAvatar, findUsers } from "../controllers/users";
import { protect } from "../utils/protect";

const router = express.Router();

router.post("/changeAvatar", protect, changeAvatar);

router.get("/findUsers", protect, findUsers);

export default router;
