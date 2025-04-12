import mongoose from "mongoose";

import { User } from "./User";
import { Lesson } from "./Lesson";
import { LessonProgress } from "./LessonProgress";
import { Quiz } from "./Quiz";
import { GroqPromptHistory } from "./GroqPromptHistory";
import { TokenTransaction } from "./TokenTransaction";
import { FluvioNews } from "./FluvioNews";

export const Models = {
  User,
  Lesson,
  LessonProgress,
  Quiz,
  GroqPromptHistory,
  TokenTransaction,
  FluvioNews,
};


export {
  User,
  Lesson,
  LessonProgress,
  Quiz,
  GroqPromptHistory,
  TokenTransaction,
  FluvioNews,
};
