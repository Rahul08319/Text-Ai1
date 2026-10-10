import { GoogleGenAI } from "@google/genai";

export const getEffectiveApiKey = (customKey?: string): string => {
  if (customKey && customKey.trim()) {
    return customKey.trim();
  }
  try {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // ignore localStorage error in restricted frames
  }
  return (process.env.API_KEY || (process.env as any).GEMINI_API_KEY || '').trim();
};

export async function* streamGenerateText(
  prompt: string,
  temperature: number,
  topP: number,
  model: string,
  customApiKey?: string,
  systemInstruction?: string
): AsyncGenerator<string, void, unknown> {
  const apiKey = getEffectiveApiKey(customApiKey);
  
  if (!apiKey) {
    throw new Error(
      "Gemini API Key not found. Please click the 🔑 key icon in the navigation bar to enter your API key, or add GEMINI_API_KEY to .env.local."
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const config: Record<string, any> = {
      temperature,
      topP,
      maxOutputTokens: 4096,
    };

    if (systemInstruction && systemInstruction.trim()) {
      config.systemInstruction = systemInstruction.trim();
    }

    const stream = await ai.models.generateContentStream({
      model: model || 'gemini-2.5-flash',
      contents: prompt,
      config,
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error in streamGenerateText:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}
