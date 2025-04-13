"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Courses",
    },
    completedLectures: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Lecture",
        },
    ],
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
exports.Progress = mongoose_1.default.model("Progress", schema);
