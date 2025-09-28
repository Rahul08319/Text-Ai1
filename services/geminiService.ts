
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function* streamGenerateText(
    prompt: string,
    temperature: number,
    topP: number,
    model: string
): AsyncGenerator<string, void, unknown> {
    try {
        const stream = await ai.models.generateContentStream({
            model: model,
            contents: prompt,
            config: {
                temperature,
                topP,
                maxOutputTokens: 2048, // Corresponds to Hugging Face `max_length`
            },
        });

        for await (const chunk of stream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error in streamGenerateText:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
}
