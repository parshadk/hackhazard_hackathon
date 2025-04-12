import mongoose, { Schema, model } from "mongoose";

const FluvioNewsSchema = new Schema({
  headline: String,
  content: String,
  source: String,
  published_at: Date,
});

export const FluvioNews = model("FluvioNews", FluvioNewsSchema);
