const genAI = async (prompt, system = '') => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is not set in server .env');

    const contents = [{ role: 'user', parts: [{ text: prompt }] }];
    const body = system ? { contents, systemInstruction: { parts: [{ text: system }] } } : { contents };

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Gemini API error');
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

        const result = await genAI(prompt);
        res.json({ success: true, recommendation: result });
    } catch (error) {
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

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction: {
                        parts: [{ text: 'You are a helpful assistant for Kevin\'s Blooms, a flower delivery shop in Nigeria. Answer questions about flowers, orders, delivery, and occasions. Be friendly, warm, and concise.' }]
                    }
                })
            }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Gemini API error');
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        res.json({ success: true, reply });
    } catch (error) {
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

        const result = await genAI(prompt);
        res.json({ success: true, description: result });
    } catch (error) {
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

        const result = await genAI(prompt);
        res.json({ success: true, message: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getFlowerRecommendation,
    chatWithAI,
    generateDescription,
    generateCardMessage
};
