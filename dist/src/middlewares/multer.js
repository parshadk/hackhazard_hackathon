"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads");
    },
    filename(req, file, cb) {
        const id = (0, uuid_1.v4)();
        const extName = file.originalname.split(".").pop();
        const fileName = `${id}.${extName}`;
        cb(null, fileName);
    },
});
exports.uploadFiles = (0, multer_1.default)({ storage }).single("file");
