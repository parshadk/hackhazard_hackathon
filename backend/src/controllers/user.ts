import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middleware/sendMail";
import TryCatch from "../middleware/TryCatch";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
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

const updateXPAndLevel = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  
  user.xp += 25;

  if (user.xp >= 100 && user.level === "Beginner") {
    user.level = "Intermediate";
  } else if (user.xp >= 200 && user.level === "Intermediate") {
    user.level = "Advanced";
  }

  await user.save();
};

export const register = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return next();
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
  return next();
});

export const verifyUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, getEnvVar("Activation_Secret")) as JwtPayload;
  
  if (!verify || verify.otp !== Number(otp)) {
    res.status(400).json({ message: "Invalid or expired OTP" });
    return next();
  }

  if (!verify.user) {
    res.status(400).json({ message: "Invalid token payload" });
    return next();
  }

  await User.create(verify.user);
  res.json({ message: "User registered successfully" });
  return next();
});

export const loginUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "Invalid email or password" });
    return next();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid email or password" });
    return next();
  }

  const token = jwt.sign({ _id: user._id }, getEnvVar("Jwt_Sec"), {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user: { name: user.name, email: user.email, xp: user.xp, level: user.level },
  });
  return next();
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return next();
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return next();
  }
  
  res.json({ 
    user: { 
      name: user.name, 
      email: user.email, 
      xp: user.xp, 
      level: user.level 
    } 
  });
  return next();
});

export const forgotPassword = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "No user with this email" });
    return next();
  }

  const token = jwt.sign({ email }, getEnvVar("Forgot_Secret"), { expiresIn: "5m" });
  await sendForgotMail("E learning", { email, token });

  user.resetPasswordExpire = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  res.json({ message: "Reset password link sent to your email" });
  return next();
});

export const resetPassword = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string;
  const decoded = jwt.verify(token, getEnvVar("Forgot_Secret")) as JwtPayload;
  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return next();
  }

  if (!user.resetPasswordExpire || user.resetPasswordExpire.getTime() < Date.now()) {
    res.status(400).json({ message: "Token expired" });
    return next();
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ message: "Password reset successfully" });
  return next();
});

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: "Current password is incorrect" });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};