"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_js_1 = require("../controllers/course.js");
const isAuth_js_1 = require("../middlewares/isAuth.js");
const router = express_1.default.Router();
router.get("/course/all", course_js_1.getAllCourses);
router.get("/course/:id", course_js_1.getSingleCourse);
router.get("/lectures/:id", isAuth_js_1.isAuth, course_js_1.fetchLectures);
router.get("/lecture/:id", isAuth_js_1.isAuth, course_js_1.fetchLecture);
router.get("/mycourse", isAuth_js_1.isAuth, course_js_1.getMyCourses);
router.post("/course/checkout/:id", isAuth_js_1.isAuth, course_js_1.checkout);
router.post("/verification/:id", isAuth_js_1.isAuth, course_js_1.paymentVerification);
exports.default = router;
