import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MatchResult {
  taskerId: string;
  score: number;
  reasons: string[];
}

export class MatchingService {
  /**
   * AI-Powered Matching Engine
   * Calculates compatibility between a task and available taskers
   */
  static async calculateMatch(taskDescription: string, taskers: any[]): Promise<MatchResult[]> {
    if (!process.env.GEMINI_API_KEY) return [];

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Rank these taskers for the following task based on skill match and experience.
        
        Task: ${taskDescription}
        
        Taskers: ${JSON.stringify(taskers.map(t => ({ id: t.id, skills: t.skills, bio: t.bio })))}
        
        Return a JSON array of objects with taskerId, score (0-100), and reasons (array of strings).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                taskerId: { type: Type.STRING },
                score: { type: Type.NUMBER },
                reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["taskerId", "score", "reasons"]
            }
          }
        }
      });

      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Matching AI Error:", error);
      return [];
    }
  }

  /**
   * Dynamic Pricing Engine
   * Suggests a price based on demand, complexity, and urgency
   */
  static async suggestPricing(taskDescription: string, category: string): Promise<{ suggestedPrice: number, surgeMultiplier: number }> {
    if (!process.env.GEMINI_API_KEY) return { suggestedPrice: 50, surgeMultiplier: 1.0 };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this task and suggest a fair price and surge multiplier based on complexity and typical market demand for the category.
        
        Task: ${taskDescription}
        Category: ${category}
        
        Return JSON with suggestedPrice (number) and surgeMultiplier (number, 1.0-2.5).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedPrice: { type: Type.NUMBER },
              surgeMultiplier: { type: Type.NUMBER }
            },
            required: ["suggestedPrice", "surgeMultiplier"]
          }
        }
      });

      return JSON.parse(response.text || '{"suggestedPrice": 50, "surgeMultiplier": 1.0}');
    } catch (error) {
      console.error("Pricing AI Error:", error);
      return { suggestedPrice: 50, surgeMultiplier: 1.0 };
    }
  }

  /**
   * Predictive Booking Suggestions
   * Predicts what a user might need next based on their history
   */
  static async predictNeeds(userHistory: any[]): Promise<string[]> {
    if (!process.env.GEMINI_API_KEY || userHistory.length === 0) return ["Cleaning", "Furniture Assembly"];

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this user's task history, predict 3 types of tasks they might need next.
        
        History: ${JSON.stringify(userHistory)}
        
        Return a JSON array of strings (task categories).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Prediction AI Error:", error);
      return ["Cleaning", "Furniture Assembly"];
    }
  }
}
