import mongoose, { Schema, model } from "mongoose";

const LessonSchema = new Schema({
  title: String,
  slug: { type: String, unique: true },
  content: Object,
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  topic: String,
  created_at: { type: Date, default: Date.now },
});

export const Lesson = model("Lesson", LessonSchema);
