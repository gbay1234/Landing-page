import OpenAI from 'openai';
import path from 'path';
import { promises as fs } from 'fs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const history = req.body.history;
    if (!history || history.length === 0) {
        return res.status(400).json({ error: 'Chat history is required.' });
    }

    try {
        // This is the simple approach: read the whole file every time.
        // It's feasible now because our knowledge.txt is much shorter.
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge.txt');
        const knowledgeBase = await fs.readFile(knowledgeBasePath, 'utf-8');

        const systemPrompt = `You are a friendly and direct AI concierge for 'Villa Oasis'. Your answers MUST be based ONLY on the KNOWLEDGE BASE provided below.
        
        - Keep answers concise and to the point.
        - If a user asks for an ACTION or SERVICE (e.g., "book a massage," "remove a gecko," "arrange a tour"), you MUST redirect them to the staff WhatsApp number provided in the knowledge base.
        - If you cannot find the answer in the knowledge base, politely say: "Sorry, I couldn't find information on that. Please feel free to ask another question or contact the villa staff."

        --- KNOWLEDGE BASE ---
        ${knowledgeBase}
        --- END KNOWLEDGE BASE ---
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Using the cheap and reliable model
            messages: [
                { role: "system", content: systemPrompt },
                ...history
            ],
            temperature: 0.1,
            max_tokens: 150,
        });

        const aiResponse = completion.choices[0].message.content;

        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Error inside the Vercel function:", error);
        return res.status(500).json({ error: "Something went wrong. Please try again." });
    }
}