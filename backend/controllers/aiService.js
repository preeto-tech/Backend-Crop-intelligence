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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

/**
 * Advanced FarmIQ AI Assistant Chat endpoint.
 * Supports multilingual text, conversational history, and image (vision) analysis.
 */
async function chatWithAI(req, res) {
    try {
        const { message, imageBase64, history } = req.body;

        if (!message && !imageBase64) {
            return res.status(400).json({ message: 'Message or image is required' });
        }

        // Use gemini-2.5-flash as default, switching from gemini-3 to avoid leaked key issues
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: `You are FarmIQ AI, an advanced, highly professional, multilingual agricultural assistant.
Your goal is to assist farmers with crop management, disease detection, market trends, and general agricultural advice.

Capabilities & Rules:
1. Multilingual Support: Always respond in the language the user speaks.
2. Image Analysis (Vision): If the user uploads an image, analyze it carefully to detect diseases or measure health, and provide actionable remedies.
3. Tone: Professional, empathetic, accurate, and easy to understand for a farmer.
4. Scope: Limit your answers to agriculture, farming, crop intelligence, logistics, and weather.

WIDGET INSTRUCTIONS:
To make the UI rich, when you provide specific types of data, ALWAYS wrap them in the following custom tags exactly as shown. 

For Disease Diagnosis (especially from images):
<WIDGET_DIAGNOSIS>
Disease: [Name of disease]
Severity: [Low/Medium/Critical]
Treatment: [Actionable treatment]
</WIDGET_DIAGNOSIS>

For Crop/Weather Recommendations:
<WIDGET_CROP>
Crop: [Crop Name]
Season: [Ideal Season]
Recommendation: [Short advice]
</WIDGET_CROP>

For standard text, just reply normally. Combine text and widgets logically.`
        });

        // Initialize chat with optional history. History format: [{role: 'user', parts: [{text: '...'}]}, {role: 'model', ...}]
        const chat = model.startChat({
            history: history || []
        });

        // Construct message parts (handling optional image)
        const msgParts = [];
        if (imageBase64) {
            // Extract mime type and base64 data
            const mimeTypeMatch = imageBase64.match(/data:(.*?);base64/);
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
            const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

            msgParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            });
        }

        if (message) {
            msgParts.push(message);
        }

        // Send message and get response
        const result = await chat.sendMessage(msgParts);
        const responseText = result.response.text();

        res.json({ reply: responseText });

    } catch (error) {
        console.error("Error in AI chat:", error);
        res.status(500).json({ message: 'Failed to process AI chat response', error: error.message });
    }
}

module.exports = { generateAIExpertAnswer, parseSellIntent, chatWithAI };
