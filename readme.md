# 💰 EduFinance

**EduFinance** is a gamified financial literacy platform built to help students learn, engage, and grow in personal finance through interactive content, real-time insights, and AI-driven experiences. This project was built for a hackathon and focuses on intuitive learning and accessibility using cutting-edge tools like **Groq AI** and **Fluvio**.

---

## 🚀 Features Overview

### 📊 Dashboard
- Welcomes the user with a personalized message.
- Displays an **XP bar**, **user level**, **enrolled courses**, and **suggested content**.
- Gamifies the learning process with rewards on course completion.

---

### 📚 Courses
- Lists all available finance courses.
- Shows an **enrolled badge** for joined courses.
- Users can purchase new courses via **Razorpay** integration.
- After each lecture completion, users earn **+25 XP**.
- Unlock lectures post-purchase for immersive learning.

---

### 🤖 AI Quiz *(MVP Feature using Groq AI + LLaMA)*
- Instantly generate a **5-question quiz** using **Groq AI**.
- Questions are tailored to user-selected finance topics.
- Built using **LLaMA models running on Groq** for ultra-fast response time.

---

### 🧠 Explain With AI *(MVP Feature using Groq AI + LLaMA)*
- An **AI-powered finance tutor chatbot**.
- Built with **Groq + LLaMA** to assist students in learning difficult financial topics in simple terms.
- Ask any finance-related question and receive quick, accurate, and educational answers.

---

### 📈 Live Updates *(MVP Feature using Fluvio + Infinyon Cloud)*
- Shows **real-time stock prices** for top companies like **AAPL, GOOGL, NFLX** and more.
- Displays **live financial news headlines**.
- View **stock history** with a **line chart** visualizing recent price movements.
- Powered by **Fluvio** streaming to produce and consume real-time data from **Infinyon Cloud**.

---

### 👤 Profile
- Users can **update their name and password**.
- Displays **email** and **XP level**.
- Email is fixed for account integrity.

---

### 📄 Transaction History
- Displays a detailed history of all **course purchases**.
- Allows users to **generate and download PDF receipts** for purchases.

---

## 🔧 Tech Stack

| Category       | Tech Used                          |
|-------------   |------------------------------------|
| Frontend       | React, Vite, Tailwind CSS          |
| Backend        | Node.js, Express, Mongoose         |
| Realtime       | Fluvio, Infinyon Cloud             |
| AI Engine      | Groq AI + LLaMA                    |
| Payments       | Razorpay                           |
| Auth           | JWT token based                    |
| UI libraries   | ShadCN & Lucide-React              | 

---

## 🔥 MVP Highlights

### Groq AI Integration
- **Groq + LLaMA** models enable lightning-fast AI responses.
- Used in both **AI Quiz** and **AI Chatbot** features.
- Makes the platform **smarter**, **faster**, and **student-focused**.

### Fluvio Integration
- Real-time financial data streaming.
- Fetches stock prices and finance news into **Fluvio topics**, served live to the frontend.
- Built with **Infinyon Cloud** infrastructure for seamless streaming.

---

## 💡 Hackathon Note

This project was built in a limited timeframe for a **hackathon**, and focuses on demonstrating the power of:
- **AI-first learning experiences**
- **Real-time financial data delivery**
- **Gamification for engagement**

---

## 📸 Screenshots

> _Coming soon..._

---

## ✨ Future Enhancements
- Leaderboards for top learners.
- Gamified daily challenges.
- Enhanced PDF report with course analytics.
- Personalized course recommendations with AI.

---
