import mongoose, { Schema, model } from "mongoose";

const GroqPromptHistorySchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  input: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
});

export const GroqPromptHistory = model("GroqPromptHistory", GroqPromptHistorySchema);
