"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_js_1 = require("../controllers/user.js");
const isAuth_js_1 = require("../middlewares/isAuth.js");
const course_js_1 = require("../controllers/course.js");
const router = express_1.default.Router();
router.post("/user/register", user_js_1.register);
router.post("/user/verify", user_js_1.verifyUser);
router.post("/user/login", user_js_1.loginUser);
router.get("/user/me", isAuth_js_1.isAuth, user_js_1.myProfile);
router.post("/user/forgot", user_js_1.forgotPassword);
router.post("/user/reset", user_js_1.resetPassword);
router.post("/user/progress", isAuth_js_1.isAuth, course_js_1.addProgress);
router.get("/user/progress", isAuth_js_1.isAuth, course_js_1.getYourProgress);
exports.default = router;
