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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

module.exports = { generateAIExpertAnswer };
