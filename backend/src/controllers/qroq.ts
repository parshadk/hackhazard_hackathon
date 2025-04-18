//@ts-ignore
import groqService from "../config/qroq.js";

const generateQuiz = async (req:any, res:any) => {
  const { topic, level, previousMistakes } = req.body;
  try {
    const quiz = await groqService.generateQuiz(topic, level, previousMistakes);
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
};

const explainConcept = async (req:any, res:any) => {
  const { concept, level } = req.body;
  try {
    const explanation = await groqService.explainConcept(concept, level);
    res.status(200).json({ explanation });
  } catch (error) {
    console.error("Error explaining concept:", error);
    res.status(500).json({ error: "Failed to explain concept" });
  }
};

const analyzeSentiment = async (req:any, res:any) => {
  const { newsData } = req.body;
  try {
    const sentiment = await groqService.analyzeMarketSentiment(newsData);
    res.status(200).json({ sentiment });
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
};

const generateChallenge = async (req:any, res:any) => {
  const { currentEvent } = req.body;
  try {
    const challenge = await groqService.generateChallenge(currentEvent);
    res.status(200).json({ challenge });
  } catch (error) {
    console.error("Error generating challenge:", error);
    res.status(500).json({ error: "Failed to generate challenge" });
  }
};

export default {
  generateQuiz,
  explainConcept,
  analyzeSentiment,
  generateChallenge,
};
