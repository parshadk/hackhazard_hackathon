import express from "express";

import { isAuth } from "../middleware/isAuth";
import groqController from "../controllers/qroq";

const router = express.Router();

router.post("/quiz",groqController.generateQuiz);
router.post("/explain",isAuth, groqController.explainConcept);
router.post("/sentiment",isAuth, groqController.analyzeSentiment);
router.post("/challenge",isAuth, groqController.generateChallenge);

export default router;