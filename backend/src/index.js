import mongoose from "mongoose";

mongoose.connect("mongodb+srv://nitinyadav484220:dhB5JqYv8LbnffVT@cluster0.aq9li.mongodb.net/hackazard");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  xp: { type: Number, default: 0 },
  educoins: { type: Number, default: 0.0 },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  avatar: String,
  created_at: { type: Date, default: Date.now }
});

const LessonSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  content: Object,
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  topic: String,
  created_at: { type: Date, default: Date.now }
});

const LessonProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  last_access: { type: Date, default: Date.now }
});

const QuizSchema = new mongoose.Schema({
  lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  question: String,
  options: [String],
  answer: String,
  ai_generated: { type: Boolean, default: false }
});

const GroqPromptHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  input: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});

const TokenTransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["Earned", "Sent", "Redeemed"] },
  amount: Number,
  description: String,
  timestamp: { type: Date, default: Date.now }
});

const FluvioNewsSchema = new mongoose.Schema({
  headline: String,
  content: String,
  source: String,
  published_at: Date
});

const User = mongoose.model("User", UserSchema);
const Lesson = mongoose.model("Lesson", LessonSchema);
const LessonProgress = mongoose.model("LessonProgress", LessonProgressSchema);
const Quiz = mongoose.model("Quiz", QuizSchema);
const GroqPromptHistory = mongoose.model("GroqPromptHistory", GroqPromptHistorySchema);
const TokenTransaction = mongoose.model("TokenTransaction", TokenTransactionSchema);
const FluvioNews = mongoose.model("FluvioNews", FluvioNewsSchema);


console.log("testing");
