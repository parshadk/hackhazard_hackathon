import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { 
      type: String,
      unique: true 
    },
    password: {
      type: String,
      required: true,
    },
    passwordHash: String,
    xp: { 
      type: Number,
      default: 0 
    },
    educoins: {
      type: Number,
      default: 0.0
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    avatar: String,
    created_at: { type: Date, default: Date.now },
    role: {
      type: String,
      default: 'user',
    },
    mainrole: {
      type: String,
      default: 'user',
    },
    subscription: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    resetPasswordExpire: {
      type: Date,
    },
  },
  { timestamps: true });

export const User = model("User", UserSchema);
