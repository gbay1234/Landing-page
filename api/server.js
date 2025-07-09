const OpenAI = require('openai');
const path = require('path');
const fs = require('fs').promises;
const Fuse = require('fuse.js');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Load and prepare knowledge base once
let fuse;

(async () => {
    const knowledgeBasePath = path.join(process.cwd(), 'knowledge.txt');
    const rawKnowledge = await fs.readFile(knowledgeBasePath, 'utf-8');
    const chunks = rawKnowledge.split(/\n(?=🔑|🕒|📶|🧼|🛌|❄️|🏊|🍳|📺|🧘|🛵|🍽|🛍|🧳|👔|🐜|🧭|🧠|🌅|💍|🧾|🔧|🧚|👽|📅|🕐|🏠)/).map(k => k.trim());
    fuse = new Fuse(chunks, {
        includeScore: true,
        threshold: 0.3,
    });
})();

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const history = req.body.history;
    if (!history || history.length === 0) {
        return res.status(400).json({ error: 'Chat history is required.' });
    }

    const latestUserMessage = history.filter(msg => msg.role === 'user').pop()?.content || '';

    try {
        const relevantChunks = fuse.search(latestUserMessage).slice(0, 4).map(result => result.item).join('\n\n');

        const systemPrompt = `You are a friendly and direct AI concierge for 'Villa Oasis'. Your answers MUST be based ONLY on the provided information below.

- Keep answers concise and to the point.
- If a user asks for an ACTION or SERVICE (e.g., "book a massage," "remove a gecko," "arrange a tour"), redirect them to the WhatsApp number listed.
- If you can't find the answer, say: "Sorry, I couldn't find information on that. Please contact the villa staff."

--- INFO SNIPPETS ---
${relevantChunks}
--- END ---`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
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
        console.error("AI Concierge Error:", error);
        return res.status(500).json({ error: "Internal error. Try again soon." });
    }
}
