
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionType, Difficulty } from "../types";

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAssessmentQuestions = async (
  jobTitle: string,
  jobDesc: string,
  difficulty: Difficulty,
  numQuestions: number,
  isCoding: boolean
) => {
  const ai = getAiClient();
  const modelName = "gemini-3-pro-preview";
  
  const prompt = `
    Role: Senior Technical Assessment Engineer.
    Goal: Generate a professional technical assessment for the role of "${jobTitle}" based on this JD: "${jobDesc}".
    
    CRITICAL CONSTRAINTS:
    1. Count: You MUST generate exactly ${numQuestions} questions.
    2. Score: The total sum of "marks" for all ${numQuestions} questions MUST equal exactly 100.
    3. Type Distribution:
       - If isCoding is true (${isCoding}), include at least 1-2 CODING questions worth 20-40 marks each.
       - Include 1-2 SUBJECTIVE questions worth 10-15 marks each.
       - The remaining questions must be MCQs worth 2-5 marks each.
       - Adjust individual marks to hit EXACTLY 100 in total.
    
    4. Difficulty: ${difficulty}.
    5. Relevance: All questions must be strictly relevant to the technologies mentioned in the JD.
    
    Return ONLY a JSON array.
  `;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: ["MCQ", "SUBJECTIVE", "CODING"] },
        text: { type: Type.STRING },
        marks: { type: Type.NUMBER },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING }
            },
            required: ["id", "text"]
          }
        },
        correctOptionId: { type: Type.STRING },
        rubric: { type: Type.STRING },
        initialCode: { type: Type.STRING },
        testCases: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              input: { type: Type.STRING },
              expectedOutput: { type: Type.STRING }
            }
          }
        }
      },
      required: ["type", "text", "marks"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI response was empty.");
    
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Invalid response format.");
    
    return parsed;
  } catch (error) {
    console.error("AI Generation Failed:", error);
    throw error;
  }
};

export const evaluateAssessment = async (
  jobTitle: string,
  jobDesc: string,
  resumeText: string,
  questions: any[],
  answers: Record<string, string>,
  timeTakenMinutes: number
) => {
  const ai = getAiClient();
  const prompt = `
    Evaluate this assessment for the role: "${jobTitle}".
    JD Context: "${jobDesc}"
    Candidate Resume Summary: "${resumeText}"
    Time Taken: ${timeTakenMinutes} minutes.
    
    Assessment Results: ${JSON.stringify(questions.map(q => ({
      id: q.id,
      text: q.text,
      userAns: answers[q.id] || "No Answer",
      correct: q.correctOptionId,
      max: q.marks,
      type: q.type
    })))}

    Task:
    1. Calculate marks for each question.
    2. Detect Suspicious Activity:
       - If completion > 80% but score < 15%, flag "Guesswork Detected".
       - If candidate resume is completely unrelated to job role, flag "Resume-JD Mismatch".
    3. Provide "evaluations" array with "correctAnswer" text for mistakes.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      totalScore: { type: Type.NUMBER },
      isSuspicious: { type: Type.BOOLEAN },
      suspiciousReason: { type: Type.STRING },
      feedback: { type: Type.STRING },
      evaluations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionId: { type: Type.STRING },
            isCorrect: { type: Type.BOOLEAN },
            marksObtained: { type: Type.NUMBER },
            aiFeedback: { type: Type.STRING },
            correctAnswer: { type: Type.STRING }
          }
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Evaluation Failed:", error);
    throw error;
  }
};
