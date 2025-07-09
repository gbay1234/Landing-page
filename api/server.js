const OpenAI = require('openai');
const path = require('path');
const fs = require('fs').promises;

// Initialize OpenAI client using the Environment Variable from Vercel settings
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// This is the main function Vercel will run
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const userQuestion = req.body.question;

    if (!userQuestion) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge.txt');
        const knowledgeBase = await fs.readFile(knowledgeBasePath, 'utf-8');

        // --- THIS IS THE UPGRADED BRAIN ---
        // We've given it much better rules for thinking and connecting ideas.
        const systemPrompt = `You are a world-class AI concierge for "Villa Oasis". Your tone is friendly, helpful, and slightly informal.
        
        Your primary goal is to synthesize answers from the "KNOWLEDGE BASE" below. You should not just find keywords; you must understand the user's intent and combine relevant information to form a complete, helpful response.
        
        CRITICAL INSTRUCTION: If a user's question is ambiguous, address all likely interpretations. For example, if asked about "parties," you must state the villa's policy on hosting events AND recommend nearby nightlife spots from the knowledge base.
        
        You MUST base your answers exclusively on the provided KNOWLEDGE BASE. If the information is not present, you must politely decline, saying: "I'm sorry, I only have information about Villa Oasis and the local Canggu area. I can't answer that, but I'm here to help with anything about your stay!"
        
        Always present the information clearly. Use bullet points if it helps.

        --- KNOWLEDGE BASE ---
        ${knowledgeBase}
        --- END KNOWLEDGE BASE ---
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // Upgraded model for better reasoning
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userQuestion }
            ],
            temperature: 0.3, // Slightly higher for more natural language
            max_tokens: 250, // Increased to allow for more comprehensive answers
        });

        const aiResponse = completion.choices[0].message.content;

        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Error inside the Vercel function:", error);
        return res.status(500).json({ error: "Something went wrong with the AI. Please try again." });
    }
}