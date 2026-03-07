const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate an AI Expert answer for a community forum question.
 * @param {string} title  - Question title
 * @param {string} body   - Question body
 * @param {string} cropName - Optional linked crop name
 * @param {string} category - Forum category
 * @returns {Promise<string>} AI-generated answer text
 */
async function generateAIExpertAnswer({ title, body, cropName, category }) {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const context = cropName ? `The question is related to the crop: "${cropName}".` : '';
    const catCtx = category ? `Category: ${category}.` : '';

    const prompt = `You are "AI Expert", a highly experienced agricultural expert and agronomist working on a farming community platform in India. A farmer has posted the following question in the community forum.

${catCtx} ${context}

Question Title: "${title}"

Question Details:
"${body}"

Please provide a helpful, practical, and easy-to-understand answer for this farmer. 
- Use bullet points where applicable.
- Include specific recommendations (fertilizer doses, pesticide names, timing, etc.) when relevant.
- Keep the tone friendly and supportive.
- Limit your answer to 250-350 words.
- End with an encouraging note.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * Parses a farmer's natural language sell request into structured JSON using Gemini.
 */
async function parseSellIntent(req, res) {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: `You are a specialized agricultural AI assistant. 
Your task is to parse the user's natural language input (which could be in Hindi, Hinglish, or English) about selling their crops.
Extract the following information:
1. crop: The name of the crop (translate to standard English name, e.g., "gehu" -> "Wheat", "chawal" -> "Rice").
2. quantity: The amount they want to sell, WITH units (e.g., "500kg", "2 quintals"). Keep the units.
3. location: The location where they are selling from or dropping off (e.g., "Delhi", "Chandigarh"). 

If any information is missing, infer to the best of your ability or return null for that field.
You MUST output ONLY valid JSON in this exact format:
{
  "crop": "crop name or null",
  "quantity": "quantity with units or null",
  "location": "location name or null"
}
Do not wrap it in markdown code blocks. Just output the raw JSON string.`
        });

        const result = await model.generateContent(prompt);
        let textRes = result.response.text().trim();

        let parsedJSON;
        try {
            parsedJSON = JSON.parse(textRes);
        } catch (e) {
            // Fallback: strip potential markdown blocks in case model still outputs them
            const cleaned = textRes.replace(/```json/gi, '').replace(/```/g, '').trim();
            parsedJSON = JSON.parse(cleaned);
        }

        res.json(parsedJSON);
    } catch (error) {
        console.error("Error parsing sell intent with AI:", error);
        res.status(500).json({ message: 'Failed to process AI parsing' });
    }
}

module.exports = { generateAIExpertAnswer, parseSellIntent };
