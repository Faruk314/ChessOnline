import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import query from "../db";
import { VerifiedToken } from "../types/types";
import { UserInfo } from "../../types/types";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(400);
    throw new Error("Token does not exist");
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET!) as VerifiedToken;

  if (!verified) {
    res.status(400);
    throw new Error("Token not verified");
  }

  if (!verified.userId) {
    res.status(400);
    throw new Error("UserId does not exist on JWT token");
  }

  try {
    let q =
      "SELECT `userId` ,`userName`,`email`,`image` FROM users WHERE `userId`= ?";

    let data: any = await query(q, [verified.userId]);

    let userInfo: UserInfo = data[0];

    req.user = userInfo;

    next();
  } catch (error) {
    console.log("Error retrieving loggedUserInfo", error);
  }
});
