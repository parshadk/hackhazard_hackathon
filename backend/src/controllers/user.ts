import {User} from "../models/User" ;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middleware/sendMail";
import TryCatch from "../middleware/TryCatch";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    name: string;
  };
}

interface JwtPayload {
  user?: {
    name: string;
    email: string;
    password: string;
  };
  otp?: number;
  email?: string;
  _id?: string;
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

    // Function ubdate => level and xp
const updateXPAndLevel = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

       // Update XP => exm: 25 XP for completing a video
  user.xp += 25;


  if (user.xp >= 100 && user.level === "Beginner") {
    user.level = "Intermediate";
  } else if (user.xp >= 200 && user.level === "Intermediate") {
    user.level = "Advanced";
  }


  await user.save();
};

export const register = TryCatch(async (req: any, res: any) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(Math.random() * 1000000);
  
  const activationToken = jwt.sign(
    { user: { name, email, password: hashPassword }, otp },
    getEnvVar("Activation_Secret"),
    { expiresIn: "5m" }
  );

  await sendMail(email, "E learning", { name, otp });

  res.status(200).json({
    message: "OTP sent to your email",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req: any, res: any) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, getEnvVar("Activation_Secret")) as JwtPayload;
  console.log(verify);
  
  if (!verify || verify.otp !== Number(otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  if (!verify.user) {
    return res.status(400).json({ message: "Invalid token payload" });
  }

  await User.create(verify.user);
  res.json({ message: "User registered successfully" });
});

export const loginUser = TryCatch(async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ _id: user._id }, getEnvVar("Jwt_Sec"), {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user
  });
});

export const myProfile = TryCatch(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user });
});

export const forgotPassword = TryCatch(async (req: any, res: any) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No user with this email" });
  }

  const token = jwt.sign({ email }, getEnvVar("Forgot_Secret"), { expiresIn: "5m" });
  await sendForgotMail("E learning", { email, token });

  user.resetPasswordExpire = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  res.json({ message: "Reset password link sent to your email" });
});

export const resetPassword = TryCatch(async (req: any, res: any) => {
  const decoded = jwt.verify(req.query.token as string, getEnvVar("Forgot_Secret")) as JwtPayload;
  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.resetPasswordExpire || user.resetPasswordExpire.getTime() < Date.now()) {
    return res.status(400).json({ message: "Token expired" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ message: "Password reset successfully" });
});
