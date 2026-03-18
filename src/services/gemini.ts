import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are VitaLens AI, a specialized medical test interpreter. 
Your goal is to help users understand their medical lab results (blood tests, urine tests, etc.) in plain, accessible language.

GUIDELINES:
1. ALWAYS start with a prominent medical disclaimer: "DISCLAIMER: This AI-generated interpretation is for informational purposes only and is NOT medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for any medical concerns."
2. Explain what each specific test (e.g., CBC, Lipid Panel, HbA1c) measures.
3. Identify values that are outside the provided reference ranges.
4. Provide potential reasons for abnormal results in simple terms, but emphasize that these are possibilities, not diagnoses.
5. Suggest 3-5 specific questions the user should ask their doctor based on these results.
6. Use a professional, empathetic, and clear tone.
7. Format the output using Markdown with clear headings (##), bullet points, and bold text for emphasis.
8. If the input is not a medical test result or is unreadable, politely ask the user to provide clear lab results.
9. Do not speculate on life expectancy or terminal conditions. Focus on explaining the data.`;

export async function interpretMedicalTest(content: string, imageBase64?: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  const parts: any[] = [{ text: content || "Please interpret these medical test results." }];
  
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for more factual/consistent output
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to interpret results. Please try again later.");
  }
}
