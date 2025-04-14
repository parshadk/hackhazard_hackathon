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
exports.isAdmin = exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = require("../models/User.js");
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.token;
        if (!token)
            return res.status(403).json({
                message: "Please Login",
            });
        const secret = process.env.Jwt_Sec;
        if (!secret)
            throw new Error("JWT Secret not defined!");
        const decodedData = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decodedData === 'string' || !('_id' in decodedData)) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = yield User_js_1.User.findById(decodedData._id);
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Login First",
        });
    }
});
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({
                message: "You are not admin",
            });
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
};
exports.isAdmin = isAdmin;
