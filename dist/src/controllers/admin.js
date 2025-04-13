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
exports.updateRole = exports.getAllUser = exports.getAllStats = exports.deleteCourse = exports.deleteLecture = exports.addLectures = exports.createCourse = void 0;
const TryCatch_js_1 = __importDefault(require("../middlewares/TryCatch.js"));
const Courses_js_1 = require("../models/Courses.js");
const Lecture_js_1 = require("../models/Lecture.js");
const fs_1 = require("fs");
const util_1 = require("util");
const fs_2 = __importDefault(require("fs"));
const User_js_1 = require("../models/User.js");
exports.createCourse = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, category, createdBy, duration, price } = req.body;
    const image = req.file;
    yield Courses_js_1.Courses.create({
        title,
        description,
        category,
        createdBy,
        image: image === null || image === void 0 ? void 0 : image.path,
        duration,
        price,
    });
    res.status(201).json({
        message: "Course Created Successfully",
    });
}));
exports.addLectures = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Courses_js_1.Courses.findById(req.params.id);
    if (!course)
        return res.status(404).json({
            message: "No Course with this id",
        });
    const { title, description } = req.body;
    const file = req.file;
    const lecture = yield Lecture_js_1.Lecture.create({
        title,
        description,
        video: file === null || file === void 0 ? void 0 : file.path,
        course: course._id,
    });
    res.status(201).json({
        message: "Lecture Added",
        lecture,
    });
}));
exports.deleteLecture = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lecture = yield Lecture_js_1.Lecture.findById(req.params.id);
    (0, fs_1.rm)(lecture.video, () => {
        console.log("Video deleted");
    });
    yield lecture.deleteOne();
    res.json({ message: "Lecture Deleted" });
}));
const unlinkAsync = (0, util_1.promisify)(fs_2.default.unlink);
exports.deleteCourse = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Courses_js_1.Courses.findById(req.params.id);
    const lectures = yield Lecture_js_1.Lecture.find({ course: course._id });
    yield Promise.all(lectures.map((lecture) => __awaiter(void 0, void 0, void 0, function* () {
        yield unlinkAsync(lecture.video);
        console.log("video deleted");
    })));
    (0, fs_1.rm)(course.image, () => {
        console.log("image deleted");
    });
    yield Lecture_js_1.Lecture.find({ course: req.params.id }).deleteMany();
    yield course.deleteOne();
    yield User_js_1.User.updateMany({}, { $pull: { subscription: req.params.id } });
    res.json({
        message: "Course Deleted",
    });
}));
exports.getAllStats = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalCoures = (yield Courses_js_1.Courses.find()).length;
    const totalLectures = (yield Lecture_js_1.Lecture.find()).length;
    const totalUsers = (yield User_js_1.User.find()).length;
    const stats = {
        totalCoures,
        totalLectures,
        totalUsers,
    };
    res.json({
        stats,
    });
}));
exports.getAllUser = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_js_1.User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json({ users });
}));
exports.updateRole = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.mainrole !== "superadmin")
        return res.status(403).json({
            message: "This endpoint is assign to superadmin",
        });
    const user = yield User_js_1.User.findById(req.params.id);
    if (user.role === "user") {
        user.role = "admin";
        yield user.save();
        return res.status(200).json({
            message: "Role updated to admin",
        });
    }
    if (user.role === "admin") {
        user.role = "user";
        yield user.save();
        return res.status(200).json({
            message: "Role updated",
        });
    }
}));
