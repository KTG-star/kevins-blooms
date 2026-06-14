const axios = require('axios');

const GEMINI_TIMEOUT = 25000;

const callGemini = async (contents, system = '') => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is not set in server .env');

    const body = {
        contents,
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {})
    };

    const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        body,
        { timeout: GEMINI_TIMEOUT }
    );

    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
};

const getFlowerRecommendation = async (req, res) => {
    try {
        const { occasion, preference, budget } = req.body;
        const prompt = `You are a flower expert for Kevin's Blooms, a flower delivery shop. 
A customer needs flower recommendations for the following:
- Occasion: ${occasion}
- Preference: ${preference || 'no specific preference'}
- Budget: ${budget || 'no specific budget'}
Suggest 3 flower options with a brief reason for each. Keep it friendly and concise.`;

        const contents = [{ role: 'user', parts: [{ text: prompt }] }];
        const result = await callGemini(contents, 'You are a flower expert for Kevin\'s Blooms, a flower delivery shop.');
        res.json({ success: true, recommendation: result });
    } catch (error) {
        console.error('AI recommendation error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        const formattedHistory = (history || []).flatMap(h => {
            if (h.role === 'user') return [{ role: 'user', parts: [{ text: h.content }] }];
            if (h.role === 'assistant') return [{ role: 'model', parts: [{ text: h.content }] }];
            return [];
        });

        const contents = [...formattedHistory, { role: 'user', parts: [{ text: message }] }];

        const reply = await callGemini(contents, 'You are a helpful assistant for Kelvin\'s Blooms, a flower delivery shop in Nigeria. Answer questions about flowers, orders, delivery, and occasions. Be friendly, warm, and concise.');
        res.json({ success: true, reply });
    } catch (error) {
        console.error('AI chat error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const generateDescription = async (req, res) => {
    try {
        const { flowerName, colors, mood } = req.body;
        const prompt = `Write a short, beautiful, and enticing product description for a flower bouquet called "${flowerName}". 
Colors: ${colors || 'mixed'}. 
Mood/Theme: ${mood || 'general'}. 
Keep it under 60 words, poetic but simple. For Kevin's Blooms flower shop.`;

        const contents = [{ role: 'user', parts: [{ text: prompt }] }];
        const result = await callGemini(contents);
        res.json({ success: true, description: result });
    } catch (error) {
        console.error('AI description error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const generateCardMessage = async (req, res) => {
    try {
        const { sender, recipient, occasion, tone } = req.body;
        const prompt = `Write a short personalized card message for a flower delivery.
From: ${sender}
To: ${recipient}
Occasion: ${occasion}
Tone: ${tone || 'warm and heartfelt'}
Keep it under 40 words. Make it feel genuine and personal.`;

        const contents = [{ role: 'user', parts: [{ text: prompt }] }];
        const result = await callGemini(contents);
        res.json({ success: true, message: result });
    } catch (error) {
        console.error('AI card message error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getFlowerRecommendation,
    chatWithAI,
    generateDescription,
    generateCardMessage
};
