"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuth_js_1 = require("../middlewares/isAuth.js");
const admin_js_1 = require("../controllers/admin.js");
const multer_js_1 = require("../middlewares/multer.js");
const router = express_1.default.Router();
router.post("/course/new", isAuth_js_1.isAuth, isAuth_js_1.isAdmin, multer_js_1.uploadFiles, admin_js_1.createCourse);
router.post("/course/:id", isAuth_js_1.isAuth, isAuth_js_1.isAdmin, multer_js_1.uploadFiles, admin_js_1.addLectures);
router.delete("/course/:id", isAuth_js_1.isAuth, isAuth_js_1.isAdmin, admin_js_1.deleteCourse);
router.delete("/lecture/:id", isAuth_js_1.isAuth, isAuth_js_1.isAdmin, admin_js_1.deleteLecture);
router.get("/stats", isAuth_js_1.isAuth, isAuth_js_1.isAdmin, admin_js_1.getAllStats);
router.put("/user/:id", isAuth_js_1.isAuth, admin_js_1.updateRole);
router.get("/users", isAuth_js_1.isAuth, isAuth_js_1.isAdmin, admin_js_1.getAllUser);
exports.default = router;
