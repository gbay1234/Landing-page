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
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge.txt');
        const knowledgeBase = await fs.readFile(knowledgeBasePath, 'utf-8');

        const systemPrompt = `You are a friendly and direct AI concierge for 'Villa Oasis'. Your answers MUST be based ONLY on the KNOWLEDGE BASE provided below.

        **Core Instructions:**
        - Keep answers concise and to the point.
        - If you cannot find the answer in the knowledge base, politely say: "Sorry, I couldn't find information on that. Please feel free to ask another question or contact the villa staff."
        - If a user asks for an ACTION or a manual service that requires staff intervention (e.g., "remove a gecko," "fix the AC"), you MUST redirect them to the staff WhatsApp number provided in the knowledge base.

        **Interactive Button Rules:**
        You can embed special HTML buttons in your responses to guide the user. Use them ONLY in the following situations:

        1.  **For Bookable Services/Experiences:** If a user's query is about **requesting, booking, or inquiring about any bookable service or experience** (e.g., 'can I get a massage?', 'how do I book a tour?', 'I want a private chef', 'yoga session prices', 'scooter rental'), first provide a brief answer based on the knowledge base, and then *always* include this exact HTML button at the end of your response:
            \`<button class="ai-action-btn" data-action="navigate-extras">Book an Experience</button>\`

        2.  **For Location Recommendations:** If the user asks for recommendations on places to go like restaurants, bars, or beaches, first provide the recommendations from the knowledge base, and then include this exact HTML button at the end of your response:
            \`<button class="ai-action-btn" data-action="navigate-explore">Explore Our Picks</button>\`

        3.  **For Booking/Availability Questions:** If the user asks about booking the villa, availability, extending their stay, or changing dates, provide a helpful response and include this exact HTML button:
            \`<button class="ai-action-btn" data-action="check-dates">Check Availability</button>\`
            
        Do NOT create your own buttons or use them for any other purpose.

        --- KNOWLEDGE BASE ---
        ${knowledgeBase}
        --- END KNOWLEDGE BASE ---
        `;

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
        console.error("Error inside the Vercel function:", error);
        return res.status(500).json({ error: "Something went wrong. Please try again." });
    }
}