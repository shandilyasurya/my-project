import dotenv from "dotenv";
dotenv.config();

import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";
import { GoogleGenAI } from "@google/genai"; // ✅ New official SDK

// ✅ Initialize Gemini client with API key from .env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const Message = async (req, res) => {
  try {
    const { text } = req.body;

    // ❌ If user sends empty text
    if (!text?.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }

    // Save user message in DB
    const user = await User.create({
      sender: "user",
      text,
    });

    // ✅ Predefined responses
    const botResponses = {
      "hello": "Hi, how can I help you today?",
      "hi": "Hello there! How’s it going?",
      "hey": "Hey! What’s up?",
      "good morning": "Good morning! Hope your day starts bright ☀️",
      "good afternoon": "Good afternoon! How’s your day going?",
      "good evening": "Good evening! How was your day?",
      "good night": "Good night 🌙 Sweet dreams!",
      "how are you": "I'm just a bot, but I'm doing great! What about you?",
      "thank you": "You’re welcome! Always happy to help 😇",
      "bye": "Goodbye! Take care and have a great day 👋",
      "what is python": "Python is a high-level programming language known for its simplicity and versatility.",
      "what is ai": "Artificial Intelligence enables machines to learn and solve problems like humans.",
      "tell me a joke": "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "help": "I can chat, explain coding, answer GK questions, and tell jokes! Try me 😄",
      "version": "I’m ChatBot v2.1 — smarter, faster, and friendlier 🧠✨",
    };

    // Normalize user text
    const normalizedText = text.toLowerCase().trim();

    // Default to predefined response
    let botResponse = botResponses[normalizedText];

    // ⚙️ If no predefined answer, use Gemini 2.5
    if (!botResponse) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash", // ✅ Newest fast model
          contents: [
            {
              role: "user",
              parts: [{ text }],
            },
          ],
          config: {
            thinkingConfig: {
              thinkingBudget: 0, // Disable "thinking" mode for faster replies
            },
          },
        });

        // ✅ Safely extract model output
        botResponse =
          response.output_text ||
          response.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Hmm, I’m not sure about that!";
      } catch (geminiError) {
        console.error("Gemini API Error:", geminiError);
        botResponse =
          "Sorry, I couldn’t process that right now. Try again later!";
      }
    }

    // Save bot message
    const bot = await Bot.create({
      sender: "bot",
      text: botResponse,
    });

    // ✅ Return chatbot response
    return res.status(200).json({
      userMessage: user.text,
      botMessage: bot.text,
    });
  } catch (error) {
    console.error("Error in Message Controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
