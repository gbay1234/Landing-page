const express = require('express');
const OpenAI = require('openai');
const fs = require('fs').promises;
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/ask-ai', async (req, res) => {
    const userQuestion = req.body.question;

    if (!userQuestion) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        const knowledgeBase = await fs.readFile('knowledge.txt', 'utf-8');

        const systemPrompt = `You are a helpful and friendly AI concierge for "Villa Oasis".
        Your role is to answer guest questions based *only* on the information provided in the "KNOWLEDGE BASE" below.
        - If the answer is in the knowledge base, provide it directly and concisely.
        - If the guest asks for something not in the knowledge base (e.g., "what is the capital of France?"), you MUST politely say, "I'm sorry, I only have information about Villa Oasis. I can't answer that."
        - Do not make up information. Do not use any external knowledge.
        - Be friendly and use a conversational tone.

        --- KNOWLEDGE BASE ---
        ${knowledgeBase}
        --- END KNOWLEDGE BASE ---
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userQuestion }
            ],
            temperature: 0.2,
            max_tokens: 150,
        });

        const aiResponse = completion.choices[0].message.content;

        res.json({ answer: aiResponse });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Something went wrong with the AI. Please try again." });
    }
});

// This part is only for local testing, Vercel will handle it automatically.
// If you want to test on your computer, run `node server.js` in your terminal.
if (process.env.NODE_ENV !== 'production') {
    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is running for local testing at http://localhost:${port}`);
    });
}

module.exports = app;