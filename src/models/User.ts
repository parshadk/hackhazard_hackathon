import mongoose, { Schema, model, Document } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
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
  { timestamps: true }
);

export const User = model('User', userSchema);

export default User;
