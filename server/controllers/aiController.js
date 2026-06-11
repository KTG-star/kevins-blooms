const callAI = async (prompt) => {
    const response = await fetch("https://cc.freemodel.dev/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.FREEMODEL_API_KEY,
            "anthropic-version": "2023-06-01",
            "User-Agent": "ClaudeCode/0.29.0"
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    return data.content[0].text;
};

// 1. Flower Recommendations
const getFlowerRecommendation = async (req, res) => {
    try {
        const { occasion, preference, budget } = req.body;
        const prompt = `You are a flower expert for Kevin's Blooms, a flower delivery shop. 
        A customer needs flower recommendations for the following:
        - Occasion: ${occasion}
        - Preference: ${preference || "no specific preference"}
        - Budget: ${budget || "no specific budget"}
        Suggest 3 flower options with a brief reason for each. Keep it friendly and concise.`;

        const result = await callAI(prompt);
        res.json({ success: true, recommendation: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Chatbot
const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        const messages = [
            ...(history || []),
            { role: "user", content: message }
        ];

        const response = await fetch("https://cc.freemodel.dev/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.FREEMODEL_API_KEY,
                "anthropic-version": "2023-06-01",
                "User-Agent": "ClaudeCode/0.29.0"
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1024,
                system: "You are a helpful assistant for Kevin's Blooms, a flower delivery shop in Nigeria. Answer questions about flowers, orders, delivery, and occasions. Be friendly, warm, and concise.",
                messages
            })
        });

        const data = await response.json();
        res.json({ success: true, reply: data.content[0].text });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Bouquet Description Generator
const generateDescription = async (req, res) => {
    try {
        const { flowerName, colors, mood } = req.body;
        const prompt = `Write a short, beautiful, and enticing product description for a flower bouquet called "${flowerName}". 
        Colors: ${colors || "mixed"}. 
        Mood/Theme: ${mood || "general"}. 
        Keep it under 60 words, poetic but simple. For Kevin's Blooms flower shop.`;

        const result = await callAI(prompt);
        res.json({ success: true, description: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Personalized Card Message
const generateCardMessage = async (req, res) => {
    try {
        const { sender, recipient, occasion, tone } = req.body;
        const prompt = `Write a short personalized card message for a flower delivery.
        From: ${sender}
        To: ${recipient}
        Occasion: ${occasion}
        Tone: ${tone || "warm and heartfelt"}
        Keep it under 40 words. Make it feel genuine and personal.`;

        const result = await callAI(prompt);
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
