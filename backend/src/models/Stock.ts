import { Schema, model } from 'mongoose';

const stockSchema = new Schema({
  symbol: String,
  price: Number,
  timestamp: { type: Date, default: Date.now }
});

export const Stock = model('Stock', stockSchema);
