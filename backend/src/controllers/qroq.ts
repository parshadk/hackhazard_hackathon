//@ts-ignore
import groqService from "../config/qroq.js";
function sanitizeCompletion(raw:any) {
  const start = raw.indexOf("```");
  if (start === -1) {
    return raw.trim();
  }
  const afterStart = raw.indexOf("\n", start);
  const end = raw.indexOf("```", afterStart);
  if (end === -1) {
    return raw.slice(afterStart).trim();
  }
  let between = raw.slice(afterStart, end);

  between = between.replace(/^\s*(json|javascript)\s*/, "");

  return between.trim();
}
const generateQuiz = async (req:any, res:any) => {
  // const { topic, level } = req.body;
  // if (!topic){
  //   let topic = "Finance";
  // }
  // if (!level){
  //   let level = "Intermediate";
  // }
  const raw = await groqService.generateQuiz();
  const cleaned = sanitizeCompletion(raw);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse quiz:", cleaned,error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
  res.status(200).json(parsed);
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
