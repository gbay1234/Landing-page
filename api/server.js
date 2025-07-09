const OpenAI = require('openai');
const path = require('path');
const fs = require('fs').promises;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    // --- THE BIG CHANGE IS HERE: We now expect a 'history' array ---
    const history = req.body.history;

    if (!history || history.length === 0) {
        return res.status(400).json({ error: 'Chat history is required.' });
    }

    try {
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge.txt');
        const knowledgeBase = await fs.readFile(knowledgeBasePath, 'utf-8');

        const systemPrompt = `You are a hyper-efficient and friendly AI concierge for 'Villa Oasis'. Your primary goal is to provide clear, concise, and direct answers. Get straight to the point and avoid conversational fluff.
        You MUST answer questions using ONLY the information from the KNOWLEDGE BASE provided below. Do not use external knowledge.
        Formatting is critical: Use bulleted lists (\`- Item\`) for lists and bold (\`**text**\`) for key terms.
        Do not use chatty, conversational filler. Just provide the answer.
        If the information is not present in the KNOWLEDGE BASE, you must politely decline, saying: "Sorry, I only have information about Villa Oasis. I can't answer that."
        --- KNOWLEDGE BASE ---
        ${knowledgeBase}
        --- END KNOWLEDGE BASE ---
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            // We pass the system prompt AND the entire chat history
            messages: [
                { role: "system", content: systemPrompt },
                ...history // This includes all past user and assistant messages
            ],
            temperature: 0.1,
            max_tokens: 150,
        });

        const aiResponse = completion.choices[0].message.content;

        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Error inside the Vercel function:", error);
        return res.status(500).json({ error: "Something went wrong with the AI. Please try again." });
    }
}