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

        // --- THIS IS THE NEW, MORE CONCISE BRAIN ---
        // These rules force the AI to be short and to the point.
        const systemPrompt = `You are a hyper-efficient and friendly AI concierge for 'Villa Oasis'. Your primary goal is to provide clear, concise, and direct answers. Get straight to the point and avoid conversational fluff.

        You MUST answer questions using ONLY the information from the KNOWLEDGE BASE provided below. Do not use external knowledge.

        Formatting is critical:
        - For any list of items (e.g., restaurant recommendations, amenities, tour options), you MUST use a simple bulleted list (\`- Item\`).
        - Use bold (\`**text**\`) only for highlighting key terms like names or passwords.

        Do not use chatty, conversational filler. For example, do not start answers with 'Of course!', 'Absolutely!', or 'I can certainly help with that!'. Just provide the answer.

        If the information is not present in the KNOWLEDGE BASE, you must politely decline, saying: "Sorry, I only have information about Villa Oasis. I can't answer that."
        
        --- KNOWLEDGE BASE ---
        ${knowledgeBase}
        --- END KNOWLEDGE BASE ---
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userQuestion }
            ],
            temperature: 0.1, // Lowered temperature for more directness
            max_tokens: 150,  // Reduced tokens to encourage shorter answers
        });

        const aiResponse = completion.choices[0].message.content;

        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Error inside the Vercel function:", error);
        return res.status(500).json({ error: "Something went wrong with the AI. Please try again." });
    }
}