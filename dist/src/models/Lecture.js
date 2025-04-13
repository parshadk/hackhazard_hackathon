"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecture = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.Lecture = mongoose_1.default.model("Lecture", schema);
