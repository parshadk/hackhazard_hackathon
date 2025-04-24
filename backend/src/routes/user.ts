import express from "express";
import {
  forgotPassword,
  loginUser,
  myProfile,
  register,
  resetPassword,
  verifyUser,
  changePassword,
  updateProfile,
  getPaymentHistory
} from "../controllers/user";
import { isAuth } from "../middleware/isAuth";
import { addProgress, getYourProgress } from "../controllers/course";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/forgot", forgotPassword);
router.post("/user/reset", resetPassword);
router.post("/user/progress", isAuth, addProgress);
router.get("/user/progress", isAuth, getYourProgress);
router.post("/user/change-password", isAuth, changePassword);
router.put("/user/profile", isAuth, updateProfile);
router.get('/user/payment-history', isAuth, getPaymentHistory);

export default router;
