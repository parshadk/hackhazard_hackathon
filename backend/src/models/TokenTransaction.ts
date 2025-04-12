import mongoose, { Schema, model } from "mongoose";

const TokenTransactionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["Earned", "Sent", "Redeemed"] },
  amount: Number,
  description: String,
  timestamp: { type: Date, default: Date.now },
});

export const TokenTransaction = model("TokenTransaction", TokenTransactionSchema);
