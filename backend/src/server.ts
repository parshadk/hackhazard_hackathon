import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { LessonProgress, User, Lesson } from "./models";
import Razorpay from "razorpay";
import cors from "cors";

dotenv.config();

if (!process.env.Razorpay_Key || !process.env.Razorpay_Secret) {
  throw new Error("Razorpay Key and Secret are required");
}


export const instance = new Razorpay({

  key_id: 'rzp_test_EHzOpiEBWXopwq',
  key_secret: 'ErJwXn4IGZRtv6T6E1cmgs4V'
});


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

connectDB();



app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import adminRoutes from "./routes/admin";

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

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
