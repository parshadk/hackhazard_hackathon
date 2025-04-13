"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYourProgress = exports.addProgress = exports.paymentVerification = exports.checkout = exports.getMyCourses = exports.fetchLecture = exports.fetchLectures = exports.getSingleCourse = exports.getAllCourses = void 0;
const index_js_1 = require("../index.js");
const TryCatch_js_1 = __importDefault(require("../middlewares/TryCatch.js"));
const Courses_js_1 = require("../models/Courses.js");
const Lecture_js_1 = require("../models/Lecture.js");
const User_js_1 = require("../models/User.js");
const crypto_1 = __importDefault(require("crypto"));
const Payment_js_1 = require("../models/Payment.js");
const Progress_js_1 = require("../models/Progress.js");
// Helper function to ensure env vars exist
const getEnvVar = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
exports.getAllCourses = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Courses_js_1.Courses.find();
    res.json({ courses });
}));
exports.getSingleCourse = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Courses_js_1.Courses.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    res.json({ course });
}));
exports.fetchLectures = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lectures = yield Lecture_js_1.Lecture.find({ course: req.params.id });
    const user = yield User_js_1.User.findById(req.user._id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    if (user.role === "admin")
        return res.json({ lectures });
    if (!user.subscription.some(subId => subId.toString() === req.params.id)) {
        return res.status(403).json({ message: "You have not subscribed to this course" });
    }
    res.json({ lectures });
}));
exports.fetchLecture = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lecture = yield Lecture_js_1.Lecture.findById(req.params.id);
    if (!lecture)
        return res.status(404).json({ message: "Lecture not found" });
    const user = yield User_js_1.User.findById(req.user._id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    if (user.role === "admin")
        return res.json({ lecture });
    if (!user.subscription.some(subId => subId.toString() === lecture.course.toString())) {
        return res.status(403).json({ message: "You have not subscribed to this course" });
    }
    res.json({ lecture });
}));
exports.getMyCourses = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Courses_js_1.Courses.find({ _id: { $in: req.user.subscription } });
    res.json({ courses });
}));
exports.checkout = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_js_1.User.findById(req.user._id);
    const course = yield Courses_js_1.Courses.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    if (user.subscription.includes(course._id.toString())) {
        return res.status(400).json({
            message: "You already have this course",
        });
    }
    const options = {
        amount: Number(course.price * 100),
        currency: "INR",
    };
    const order = yield index_js_1.instance.orders.create(options);
    res.status(201).json({ order, course });
}));
exports.paymentVerification = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto_1.default
        .createHmac("sha256", getEnvVar("Razorpay_Secret"))
        .update(body)
        .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
        return res.status(400).json({ message: "Payment Failed" });
    }
    yield Payment_js_1.Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    });
    const user = yield User_js_1.User.findById(req.user._id);
    const course = yield Courses_js_1.Courses.findById(req.params.id);
    if (!user || !course) {
        return res.status(404).json({ message: "User or Course not found" });
    }
    user.subscription.push(course._id);
    yield user.save();
    yield Progress_js_1.Progress.create({
        course: course._id,
        completedLectures: [],
        user: req.user._id,
    });
    res.status(200).json({ message: "Course Purchased Successfully" });
}));
exports.addProgress = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const progress = yield Progress_js_1.Progress.findOne({
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
    if (progress.completedLectures.includes(lectureId)) {
        return res.json({ message: "Progress already recorded" });
    }
    progress.completedLectures.push(lectureId);
    yield progress.save();
    res.status(201).json({ message: "New progress added" });
}));
exports.getYourProgress = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const progress = yield Progress_js_1.Progress.find({
        user: req.user._id,
        course: req.query.course,
    });
    if (!progress || progress.length === 0) {
        return res.status(404).json({ message: "Progress not found" });
    }
    const allLectures = yield Lecture_js_1.Lecture.countDocuments({ course: req.query.course });
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
}));
