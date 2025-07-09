const OpenAI = require('openai');
const path = require('path');
const fs = require('fs').promises;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper function for the math (dot product similarity)
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
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
        // --- STEP 1: EMBEDDING-BASED RETRIEVAL ---
        
        // 1. Load our pre-generated smart index
        const embeddingsPath = path.join(process.cwd(), 'knowledge_embeddings.json');
        const knowledgeEmbeddings = JSON.parse(await fs.readFile(embeddingsPath, 'utf-8'));

        // 2. Convert the user's question into an embedding vector
        const questionEmbeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: userQuestion,
        });
        const questionEmbedding = questionEmbeddingResponse.data[0].embedding;

        // 3. Compare the question vector to all paragraph vectors
        const scoredChunks = knowledgeEmbeddings.map(chunk => ({
            content: chunk.content,
            score: cosineSimilarity(questionEmbedding, chunk.embedding),
        }));

        // 4. Sort by similarity and get the most relevant content
        scoredChunks.sort((a, b) => b.score - a.score);
        const relevantContext = scoredChunks.slice(0, 4)
            .filter(chunk => chunk.score > 0.4) // Filter out irrelevant results
            .map(chunk => chunk.content)
            .join('\n\n');

        // --- STEP 2: GENERATION (Unchanged) ---
        const systemPrompt = `You are a hyper-efficient AI concierge for 'Villa Oasis'. Your goal is to provide clear, concise answers based ONLY on the "RELEVANT CONTEXT" provided below.
        - Analyze the conversation history for context.
        - Formulate your answer using the "RELEVANT CONTEXT".
        - If the context is empty or insufficient, politely decline: "Sorry, I couldn't find specific information on that. You can try rephrasing, or contact staff for more help."
        - For action requests, redirect to WhatsApp: +62 812 3456 7890.
        - Be direct. Use bullet points for lists.
        --- RELEVANT CONTEXT ---
        ${relevantContext}
        --- END RELEVANT CONTEXT ---
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: systemPrompt }, ...history],
            temperature: 0.2,
            max_tokens: 250,
        });

        const aiResponse = completion.choices[0].message.content;
        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Error inside the Vercel function:", error);
        return res.status(500).json({ error: "Something went wrong with the AI. Please try again." });
    }
}