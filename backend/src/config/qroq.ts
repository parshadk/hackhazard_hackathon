
const Groq = require("groq-sdk");
require("dotenv").config();

class GroqService {
  groq: any;
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateQuiz(topic:any, level:any) {

    const prompt = `Generate a personalized finance quiz about Finance, SIps, Investments for a intermediate level student. return an array with  5 questions objects, each having:id, question labeled as text , options (array), correctAnswer.
    Don't include any additional text or explanations. The quiz should be in the following format:
     "quiz":[
          {
            id: "1",
            text: "What is compound interest?",
            options: [
              "Interest calculated only on the initial principal",
              "Interest calculated on the initial principal and accumulated interest",
              "A fixed interest rate that never changes",
              "Interest that is only paid at the end of a loan term",
            ],
            correctAnswer: 1,
          },] 
    
    `;

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
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
      temperature: 0.8,
      max_tokens: 2048,
    });

    return completion.choices[0].message.content
  }

  async explainConcept(question:any) {
    const systemMessage = `
      You are a Finance Educator bot. You answer any personal‑finance or investment question clearly and accurately.
      If the user’s question is not about personal finance or investing, respond exactly:  Please ask me only personal finance or investment questions.
      
      `
    const completion = await this.groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:systemMessage,
        },
        {
          role: "user",
          content: `Explain ${question} in simple terms for a student.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 1024,
    });
    return completion.choices[0].message.content;
  }

  async analyzeMarketSentiment(newsData:any) {
    const completion = await this.groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
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

  async generateChallenge(currentEvent:any) {
    const completion = await this.groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
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
