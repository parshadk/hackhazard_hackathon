import { instance } from "../server";
import TryCatch from "../middleware/TryCatch";
import { Courses } from "../models/Courses";
import { Lecture } from "../models/Lecture";
import { User } from "../models/User";
import crypto from "crypto";
import { Payment } from "../models/Payment";
import { Progress } from "../models/Progress";
import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import Razorpay from "razorpay";
import { Request, Response } from "express";
import { updateUserXP } from "../helpers/updateXP";

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    subscription: string[];
    role: string;
  };
}

export const getAllCourses = TryCatch(async (req: Request, res: Response) => {
  const courses = await Courses.find();
  res.json({ courses });
});

export const getSingleCourse = TryCatch(async (req: any, res: any) => {
  const course = await Courses.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json({ course });
});

export const fetchLectures = TryCatch(async (req: any, res: any) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin") return res.json({ lectures });
  if (!user.subscription.some(subId => subId.toString() === req.params.id)) {
    return res.status(403).json({ message: "You have not subscribed to this course" });
  }
  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req: any, res: any) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: "Lecture not found" });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin") return res.json({ lecture });
  if (!user.subscription.some(subId => subId.toString() === lecture.course.toString())) {
    return res.status(403).json({ message: "You have not subscribed to this course" });
  }

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req: any, res: any) => {
  const courses = await Courses.find({ _id: { $in: req.user.subscription } });
  res.json({ courses });
});

export const checkout = TryCatch(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (user.subscription.includes(course._id)) {
    return res.status(400).json({ message: "You already have this course" });
  }

  const options = { amount: Number(course.price * 100), currency: "INR" ,
  notes: {
    userId: req.user._id.toString(), // This is crucial for filtering
    courseId: course.id,
    courseName: course.title
  }

  };
  console.log(options)
  try {
    const order = await instance.orders.create(options);
    res.status(201).json({ order, course });
  } catch (error) {
    console.log(error);
  }
});

export const paymentVerification = TryCatch(async (req: any, res: any) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", getEnvVar("Razorpay_Secret"))
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (!isAuthentic) {
    return res.status(400).json({ message: "Payment Failed" });
  }

  await Payment.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);
  if (!user || !course) {
    return res.status(404).json({ message: "User or Course not found" });
  }

  user.subscription.push(course._id);
  await user.save();

  await Progress.create({
    course: course._id,
    completedLectures: [],
    user: req.user._id,
  });

  res.status(200).json({ message: "Course Purchased Successfully" });
});

export const addProgress = TryCatch(async (req: any, res: any) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) {
    return res.status(404).json({ message: "Progress not found" });
  }

  const { lectureId } = req.query;

  if (!lectureId || typeof lectureId !== "string") {
    return res.status(400).json({ message: "Invalid lecture ID" });
  }

  const lectureObjectId = new mongoose.Types.ObjectId(lectureId);

  if (progress.completedLectures.map(id => id.toString()).includes(lectureObjectId.toString())) {
    return res.json({ message: "Progress already recorded" });
  }

  progress.completedLectures.push(lectureObjectId);
  await progress.save();

  // Updated XP handling with level-up detection
  const xpResult = await updateUserXP(req.user._id, 25);
  
  let responseMessage = "New progress added, +25 XP awarded";
  if (xpResult.hasLeveledUp) {
    responseMessage += `, Congratulations! You've reached level ${xpResult.newLevel}!`;
  }
  
  res.status(201).json({ 
    message: responseMessage,
    xp: xpResult.newXP,
    level: xpResult.newLevel
  });
});
export const getYourProgress = TryCatch(async (req: any, res: any) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress || progress.length === 0) {
    return res.status(404).json({ message: "Progress not found" });
  }

  const allLectures = await Lecture.countDocuments({ course: req.query.course });
  const completedLectures = progress[0].completedLectures.length;
  const courseProgressPercentage = allLectures > 0 
    ? (completedLectures * 100) / allLectures 
    : 0;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress: progress[0],
  });
});
