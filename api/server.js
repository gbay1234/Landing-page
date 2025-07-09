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

    const history = req.body.history;

    if (!history || history.length === 0) {
        return res.status(400).json({ error: 'Chat history is required.' });
    }

    try {
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge.txt');
        const knowledgeBase = await fs.readFile(knowledgeBasePath, 'utf-8');

        // --- THE UPGRADED BRAIN WITH ACTION REDIRECTION ---
        const systemPrompt = `You are a hyper-efficient and friendly AI concierge for 'Villa Oasis'. Your primary goal is to provide clear, concise, and direct answers based ONLY on the KNOWLEDGE BASE.

        --- NEW RULE: ACTION & SERVICE REQUESTS ---
        You MUST distinguish between a request for INFORMATION (e.g., "Do you have massages?") and a request for an ACTION/SERVICE (e.g., "Can you book me a massage?" or "Please remove the gecko").

        - For INFORMATION requests, answer directly from the knowledge base.
        - For ACTION/SERVICE requests, you MUST respond by redirecting them to the staff's WhatsApp. Your response should follow this format: "I can certainly help with that. To [summarize the user's request], please contact the villa staff on WhatsApp at [WhatsApp number from knowledge base] and they will assist you right away."
        
        Examples:
        - If user asks "Can you remove it?", you should find the WhatsApp number and respond: "I can certainly help with that. To have the gecko removed, please contact the villa staff on WhatsApp at +62 812 3456 7890 and they will assist you right away."
        - If user asks "I want to book a tour to Ubud", you should respond: "I can certainly help with that. To book the Ubud tour, please contact the villa staff on WhatsApp at +62 812 3456 7890 and they will assist you right away."
        
        --- GENERAL RULES ---
        - Get straight to the point and avoid conversational fluff.
        - Use bulleted lists (\`- Item\`) for lists and bold (\`**text**\`) for key terms.
        - If you cannot answer based on the knowledge base, say: "Sorry, I only have information about Villa Oasis. I can't answer that."
        
        --- KNOWLEDGE BASE ---
        ${knowledgeBase}
        --- END KNOWLEDGE BASE ---
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                ...history
            ],
            temperature: 0.2, // Slightly increased for better natural language on redirection
            max_tokens: 180,
        });

        const aiResponse = completion.choices[0].message.content;

        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Error inside the Vercel function:", error);
        return res.status(500).json({ error: "Something went wrong with the AI. Please try again." });
    }
}