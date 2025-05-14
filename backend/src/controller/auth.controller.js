import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, "all field are required");
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    console.log("exist:", existingUser);

    if (existingUser) {
      throw new ApiError(401, "user already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    const JWT_TOKEN = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwtToken", JWT_TOKEN, {
      httpOnly: true,
      sameSite: true,
      maxAge: 1000*60*60*24*7
    });

    console.log("user:", newUser);

    res
      .status(201)
      .json(new ApiResponse(201, newUser, "user created successfully"));
  } catch (error) {
    console.log("error is register: ", error);
  }
});

export const login = asyncHandler(async (req, res) => {
  console.log("user logged in");

  return res.status(200).json("user logged in");
});

export const logout = asyncHandler(async (req, res) => {});

export const profile = asyncHandler(async (req, res) => {});
