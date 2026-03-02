import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;

console.log("backend registered route: ", req);


  if (!email || !password || !name) {
    throw new ApiError(400, "all field are required");
  }

  
    const existingUser = await db.user.findUnique({
      where: { email }
    });
    console.log("exist:", existingUser);

    if (existingUser) {
      throw new ApiError(401, "user already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });
    console.log("new user : ", newUser);
    

    const JWT_TOKEN = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwtToken", JWT_TOKEN, {
      httpOnly: true,
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  

    res
      .status(201)
      .json(new ApiResponse(201, newUser, "user created successfully"));
 
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email or password are incorrect");
  }
 
  const user = await db.user.findUnique({
    where:{
      email
    }
  })
  
  if (!user) {
    throw new ApiError(400, "user does not exists");
  }
  console.log("user", user);
  console.log("password", password);
  
  
  const isMatch = await bcrypt.compare(password.trim(), user.password);

  console.log("match : ", isMatch);
  

  if (!isMatch) {
    throw new ApiError(401, "invalid creditails ");
  }


  const jwtToken = jwt.sign(
    {
      id: user.id,    
    },
    process.env.JWT_SECRET,
    {
      expiresIn:'7d'
    }
  )

  res.cookie('jwtToken', jwtToken, {
    httpOnly: true,
    sameSite: true,
    maxAge: 1000*60*60*24*7
  } )

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user login successfully"));
});

export const logout = asyncHandler(async (req, res) => {
   res.clearCookie('jwtToken', {
    httpOnly: true, 
    secure: true
   })

   return res.status(200).json(new ApiResponse(
    200,
    {},
    "user logout sucessfully"
   ))
});

export const profile = asyncHandler(async (req, res) => {
   return res.status(200).json(
    new ApiResponse(200,
      req.user,
      "profile fetched successfully"
    )
   )
});
