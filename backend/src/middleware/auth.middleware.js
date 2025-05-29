import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const isLoggedIn = asyncHandler(async (req, _, next) => {
  const token = req.cookies.jwtToken;
  // console.log("token:", token);

  if (!token) {
    throw new ApiError(404, "token not found");
  }

  // console.log("token ", token);

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("decoded: ", decodedToken);

  if (!decodedToken) {
    throw new ApiError(404, "token not matched");
  }

  const user = await db.user.findUnique({
    where: { id: decodedToken.id },
    select: {
      id: true,
      role: true,
      email: true,
      // isVerified: true/
    },
  });

  if (!user) {
    throw new ApiError(404, "user not exist");
  }

  req.user = user;
  next();
});

export const checkAdmin = asyncHandler(async(req, res, next) => {
  const userId = req.user.id
  const user = await db.user.findUnique({ 
    where: {
      id: userId
    },
    select: {
      role: true
    }
  })
  console.log("user:", user);
  
  
  if (!user || user.role !== 'ADMIN') {
    throw new ApiError(400, "access denied , only admin can create problem")
  }
  next()  
})