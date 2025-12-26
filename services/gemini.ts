import { GoogleGenerativeAI } from '@google/generative-ai';

// Use Expo Public Env Variable
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("Missing EXPO_PUBLIC_GEMINI_API_KEY. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export interface NutritionData {
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    description: string;
}

export interface Recipe {
    title: string;
    calories: number;
    time: string;
    tags: string[];
    description: string;
    ingredients: string[];
    instructions: string[];
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
}

export const analyzeImage = async (base64Image: string): Promise<NutritionData> => {
    // Use flash model for speed and efficiency
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this food image. Identify the food name (concise), total calories, protein (g), carbs (g), and fat (g). 
    Return strictly JSON format ONLY. Do not include markdown formatting like \`\`\`json.
    Structure: { "foodName": string, "calories": number, "protein": number, "carbs": number, "fat": number, "description": string }`;

    try {
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        // Fallback or re-throw
        throw new Error("Failed to analyze image");
    }
}

export const generateRecipes = async (preference: string): Promise<Recipe[]> => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Suggest 3 healthy recipes for a ${preference} diet.
    Return strictly JSON array format ONLY. No markdown.
    Each object must have: 
    - title (string)
    - calories (number)
    - time (string, e.g. "20 min")
    - tags (string array, e.g. ["High Protein"])
    - description (short string)
    - ingredients (string array with quantities)
    - instructions (string array, step by step)
    - macros (object with protein, carbs, fat as numbers)
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Recipe Error:", error);
        return [];
    }
};
