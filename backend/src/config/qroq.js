
const Groq = require("groq-sdk");
require("dotenv").config();

class GroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateQuiz(topic, level, previousMistakes = []) {
    const prompt = `Generate a personalized finance quiz about ${topic} for a ${level} level student. 
    Previous mistakes to focus on: ${previousMistakes.join(', ')}. 
    Format: Return a JSON with 3 questions, each having: question, options (array), correctAnswer, and explanation.`;

    const completion = await this.groq.chat.completions.create({
      model: "deepseek-r1-distill-qwen-32b",
      messages: [
        {
          role: "system",
          content: "You are an educational finance assistant creating personalized quizzes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  async explainConcept(concept, level) {
    const completion = await this.groq.chat.completions.create({
      model: "deepseek-r1-distill-qwen-32b",
      messages: [
        {
          role: "system",
          content: "You are a finance tutor explaining concepts in simple terms.",
        },
        {
          role: "user",
          content: `Explain ${concept} in simple terms for a ${level} level student.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  }

  async analyzeMarketSentiment(newsData) {
    const completion = await this.groq.chat.completions.create({
      model: "deepseek-r1-distill-qwen-32b",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst providing market insights.",
        },
        {
          role: "user",
          content: `Analyze this market news and provide insights: ${JSON.stringify(newsData)}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  }

  async generateChallenge(currentEvent) {
    const completion = await this.groq.chat.completions.create({
      model: "deepseek-r1-distill-qwen-32b",
      messages: [
        {
          role: "system",
          content: "You are creating educational finance challenges based on current events.",
        },
        {
          role: "user",
          content: `Create a financial challenge based on this event: ${currentEvent}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  }
}

module.exports = new GroqService();
