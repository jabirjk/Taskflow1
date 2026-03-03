import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getGeminiModel = () => {
  return ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Hello",
  });
};

export default ai;
