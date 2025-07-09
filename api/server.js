// This is the Vercel-native way to write a serverless function.
const OpenAI = require('openai');
const path = require('path');
const fs = require('fs').promises;

// Initialize OpenAI client using the Environment Variable from Vercel settings
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// This is the main function Vercel will run
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const userQuestion = req.body.question;

    if (!userQuestion) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        // This is the CRITICAL FIX:
        // It correctly finds the knowledge.txt file in the project's root folder,
        // no matter where Vercel is running this function from.
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge.txt');
        const knowledgeBase = await fs.readFile(knowledgeBasePath, 'utf-8');

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

        // Send the successful response back
        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        // If anything goes wrong, log it for debugging and send an error
        console.error("Error inside the Vercel function:", error);
        return res.status(500).json({ error: "Something went wrong with the AI. Please try again." });
    }
}