import express from "express";

import { isAuth } from "../middleware/isAuth.js";
import groqController from "../controllers/qroq.js";

const router = express.Router();

router.post("/quiz", isAuth,groqController.generateQuiz);
router.post("/explain",isAuth, groqController.explainConcept);
router.post("/sentiment",isAuth, groqController.analyzeSentiment);
router.post("/challenge",isAuth, groqController.generateChallenge);

export default router;