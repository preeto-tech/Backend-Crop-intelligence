const { GoogleGenAI } = require("@google/genai");

// Fetch mandi data for reference (mocked or fetched from mandiController logic)
const getMandiReference = async () => {
    // In a real scenario, we might call the same logic as mandiController.getData
    // For now, we'll return a helpful subset or just indicate it's available.
    return "Current Mandi Prices show a stable trend for Wheat around ₹2,200/quintal and a slight decrease in Tomato prices.";
};

const getAIAdvice = async (req, res) => {
    try {
        const { question, crop, location } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const mandiData = await getMandiReference();

        const prompt = `
            You are an expert Agricultural Advisor. You are helping another human expert answer a farmer's question.
            
            FARMER CONTEXT:
            Location: ${location || 'India'}
            Related Crop: ${crop || 'General Agriculture'}
            
            FARMER'S QUESTION:
            "${question}"
            
            DATA REFERENCE (Mandi Prices):
            ${mandiData}
            
            TASK:
            1. Analyze the question.
            2. Provide 3-4 professional, technical, and actionable points for the expert to use in their answer. Each of around 2lines max.
            3. Keep the tone professional, helpful, and scientific.
            
            RESPONSE FORMAT:
            Provide only the points, no conversational filler.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({ advice: response.text });
    } catch (err) {
        console.error('AI Advice Error:', err);
        res.status(500).json({ message: "Failed to generate AI advice", error: err.message });
    }
};

module.exports = { getAIAdvice };
