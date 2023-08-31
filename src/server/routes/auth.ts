import express from "express";
import { getLoginStatus, login, logout, register } from "../controllers/auth";

const router = express.Router();

router.get("/register", register);

router.get("/login", login);

router.get("/logout", logout);

router.get("/getLoginStatus", getLoginStatus);

export default router;
