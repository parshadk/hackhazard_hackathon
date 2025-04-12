import mongoose, { Schema, model } from "mongoose";

const LessonProgressSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  lesson_id: { type: Schema.Types.ObjectId, ref: "Lesson" },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  last_access: { type: Date, default: Date.now },
});

export const LessonProgress = model("LessonProgress", LessonProgressSchema);
