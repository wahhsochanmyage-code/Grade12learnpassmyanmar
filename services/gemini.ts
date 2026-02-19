
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AI_PERSONA } from "../constants";

// Fix: Direct initialization with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAITeacherResponse = async (
  prompt: string, 
  images: string[] = [], 
  context: string = ""
): Promise<string> => {
  // Fix: Call generateContent directly and await its result
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: `${AI_PERSONA}\nContext: ${context}\n\nQuestion: ${prompt}` },
        ...images.map(img => ({
          inlineData: {
            mimeType: 'image/jpeg',
            data: img.split(',')[1] || img
          }
        }))
      ]
    },
    config: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    }
  });

  return response.text || "Sorry, I couldn't process that.";
};

export const generateExam = async (subjectName: string, chapterTitle: string, images: string[]) => {
  // Fix: Call generateContent directly and await its result
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { text: `Based on the attached lesson images for G12 ${subjectName} - ${chapterTitle}, generate a strict exam with 5 multiple choice questions and 2 short answer questions. Output in JSON format.` },
        ...images.map(img => ({
          inlineData: {
            mimeType: 'image/jpeg',
            data: img.split(',')[1] || img
          }
        }))
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                marks: { type: Type.NUMBER }
              },
              required: ["id", "question", "correctAnswer", "marks"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });

  return JSON.parse(response.text || '{"questions": []}');
};
