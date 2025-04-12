import mongoose, { Schema, model } from "mongoose";

const QuizSchema = new Schema({
  lesson_id: { type: Schema.Types.ObjectId, ref: "Lesson" },
  question: String,
  options: [String],
  answer: String,
  ai_generated: { type: Boolean, default: false },
});

export const Quiz = model("Quiz", QuizSchema);
