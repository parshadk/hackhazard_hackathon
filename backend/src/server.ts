import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { LessonProgress, User, Lesson } from "./models";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


connectDB();

app.post("/api/test/progress", async (req:any, res:any) => {
  try {
    
    const user = await User.create({
      name: "Test User",
      email: `testuser${Date.now()}@mail.com`,
      passwordHash: "hashedpassword",
    });


    const lesson = await Lesson.create({
      title: "Intro to Money",
      slug: `money-${Date.now()}`,
      content: { text: "What is money?" },
      level: "Beginner",
      topic: "Finance Basics",
    });

    const progress = await LessonProgress.create({
      user_id: user._id,
      lesson_id: lesson._id,
      completed: false,
      score: 0,
      attempts: 1,
    });

    res.status(201).json({
      message: "Test progress created successfully",
      user,
      lesson,
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req:any, res:any) => {
  res.send("EduFinance API up & running 🪙");
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
