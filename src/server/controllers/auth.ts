import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import query from "../db";

export const register = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  let q = "SELECT `userId` FROM users WHERE `email`= ?";

  let result: any = await query(q, [email]);

  if (result.length > 0) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password has to be 8 characters min");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    q = "INSERT INTO users (`userName`,`email`,`password`) VALUES (?, ?, ?)";

    result = await query(q, [userName, email, hash]);

    q =
      "SELECT `userId`,`userName`,`email`,`image` FROM users WHERE `email`= ? AND `password`= ?";

    result = await query(q, [email, hash]);

    const token = jwt.sign(
      { userId: result[0].userId },
      process.env.JWT_SECRET!
    );

    if (!token) {
      res.status(400);
      throw new Error("Something went wrong with token creation");
    }

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      })
      .status(200)
      .json({
        userInfo: {
          userId: result[0].userId,
          userName: result[0].userName,
          email: result[0].email,
          image: result[0].image,
        },
      });
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred during user registration");
  }
});
