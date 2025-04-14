import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const dbUri = process.env.DB;
if (!dbUri) throw new Error("DB URI not defined!");
await mongoose.connect(dbUri);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};
