const OpenAI = require('openai');
const path = require('path');
const fs = require('fs').promises;
const Fuse = require('fuse.js');
const nlp = require('compromise');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// --- THIS IS THE CORE OF THE COST-SAVING LOGIC ---
// This function reads the knowledge base and prepares it for searching.
// It splits the large text into smaller, searchable chunks (paragraphs).
async function getSearchableKnowledge() {
    const knowledgeBasePath = path.join(process.cwd(), 'knowledge.txt');
    const knowledgeBase = await fs.readFile(knowledgeBasePath, 'utf-8');
    // Split the knowledge base by double newlines (paragraphs) and filter out empty ones.
    const chunks = knowledgeBase.split(/\n\s*\n/).map(chunk => chunk.trim()).filter(Boolean);
    return chunks;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const history = req.body.history;
    if (!history || history.length === 0) {
        return res.status(400).json({ error: 'Chat history is required.' });
    }

    const userQuestion = history[history.length - 1].content;

    try {
        // --- STEP 1: RETRIEVAL (The cheap part) ---
        const knowledgeChunks = await getSearchableKnowledge();
        
        // Use Fuse.js to perform a fuzzy search on the chunks
        const fuse = new Fuse(knowledgeChunks, { includeScore: true, threshold: 0.5 });
        const searchResults = fuse.search(userQuestion);

        // Get the top 3-4 most relevant chunks of text.
        const relevantContext = searchResults.slice(0, 4).map(result => result.item).join('\n\n');

        // --- STEP 2: GENERATION (The now much cheaper part) ---
        const systemPrompt = `You are a hyper-efficient AI concierge for 'Villa Oasis'. Your goal is to provide clear, concise answers based ONLY on the "RELEVANT CONTEXT" provided below.

        - First, analyze the user's conversation history for context.
        - Then, formulate your answer using the "RELEVANT CONTEXT".
        - If the provided context is insufficient to answer the question, you MUST politely decline by saying: "Sorry, I couldn't find specific information on that. You can try rephrasing, or contact staff for more help."
        - For action/service requests (e.g., "book a massage"), redirect them to the staff's WhatsApp: +62 812 3456 7890.
        - Be direct and avoid conversational fluff. Use bullet points for lists.
        
        --- RELEVANT CONTEXT ---
        ${relevantContext}
        --- END RELEVANT CONTEXT ---
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                ...history // We still send history for conversational context
            ],
            temperature: 0.2,
            max_tokens: 200,
        });

        const aiResponse = completion.choices[0].message.content;

        return res.status(200).json({ answer: aiResponse });

    } catch (error)
    {
        console.error("Error inside the Vercel RAG function:", error);
        return res.status(500).json({ error: "Something went wrong with the AI. Please try again." });
    }
}