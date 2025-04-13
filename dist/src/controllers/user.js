"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.resetPassword = exports.forgotPassword = exports.myProfile = exports.loginUser = exports.verifyUser = exports.register = void 0;
const User_js_1 = require("../models/User.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_js_1 = __importStar(require("../middlewares/sendMail.js"));
const TryCatch_js_1 = __importDefault(require("../middlewares/TryCatch.js"));
const getEnvVar = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing environment variable: ${key}`);
    return value;
};
exports.register = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    const existingUser = yield User_js_1.User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const otp = Math.floor(Math.random() * 1000000);
    const activationToken = jsonwebtoken_1.default.sign({ user: { name, email, password: hashPassword }, otp }, getEnvVar("Activation_Secret"), { expiresIn: "5m" });
    yield (0, sendMail_js_1.default)(email, "E learning", { name, otp });
    res.status(200).json({
        message: "OTP sent to your email",
        activationToken,
    });
}));
exports.verifyUser = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, activationToken } = req.body;
    const verify = jsonwebtoken_1.default.verify(activationToken, getEnvVar("Activation_Secret"));
    if (!verify || verify.otp !== otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    if (!verify.user) {
        return res.status(400).json({ message: "Invalid token payload" });
    }
    yield User_js_1.User.create(verify.user);
    res.json({ message: "User registered successfully" });
}));
exports.loginUser = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_js_1.User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, getEnvVar("Jwt_Sec"), {
        expiresIn: "15d",
    });
    res.json({
        message: `Welcome back ${user.name}`,
        token,
        user: { name: user.name, email: user.email },
    });
}));
exports.myProfile = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_js_1.User.findById(req.user._id);
    res.json({ user });
}));
exports.forgotPassword = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_js_1.User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "No user with this email" });
    }
    const token = jsonwebtoken_1.default.sign({ email }, getEnvVar("Forgot_Secret"), { expiresIn: "5m" });
    yield (0, sendMail_js_1.sendForgotMail)("E learning", { email, token });
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    yield user.save();
    res.json({ message: "Reset password link sent to your email" });
}));
exports.resetPassword = (0, TryCatch_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(req.query.token, getEnvVar("Forgot_Secret"));
    const user = yield User_js_1.User.findOne({ email: decoded.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
        return res.status(400).json({ message: "Token expired" });
    }
    user.password = yield bcrypt_1.default.hash(req.body.password, 10);
    user.resetPasswordExpire = null;
    yield user.save();
    res.json({ message: "Password reset successfully" });
}));
