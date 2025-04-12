import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  xp: { type: Number, default: 0 },
  educoins: { type: Number, default: 0.0 },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  avatar: String,
  created_at: { type: Date, default: Date.now },
});

export const User = model("User", UserSchema);
