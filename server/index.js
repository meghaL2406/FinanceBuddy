const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

// Firebase Admin initialize karo
const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(firebaseApp);

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ---- Helper: Embedding generate karne wala function ----
async function getEmbedding(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text }] },
      }),
    }
  );
  const data = await response.json();
  return data.embedding.values;
}

// ---- Helper: Cosine Similarity (Movie Recommender wala concept!) ----
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ---- Route 1: Health check (test karne ke liye) ----
app.get("/", (req, res) => {
  res.send("FinanceBuddy AI Backend is running!");
});

// ---- Route 2: Naya transaction ka embedding generate karo ----
app.post("/api/embed-transaction", async (req, res) => {
  try {
    const { transactionId, category, amount, date, description } = req.body;

    if (!transactionId || !category || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const text = `${category} expense of Rs ${amount} on ${date}: ${description || ""}`;
    const embedding = await getEmbedding(text);

    await db.collection("transactions").doc(transactionId).update({ embedding });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---- Route 3: Main Chat endpoint (RAG feature) ----
app.post("/api/chat", async (req, res) => {
  try {
    const { query, userId } = req.body;

    if (!query || !userId) {
      return res.status(400).json({ error: "query and userId are required" });
    }

    // Step 1: User ke sawaal ka embedding banao
    const queryEmbedding = await getEmbedding(query);

    // Step 2: User ke saare transactions Firestore se lao
    const snapshot = await db.collection("transactions").where("userId", "==", userId).get();

    if (snapshot.empty) {
      return res.json({ answer: "Aapke paas abhi koi transaction data nahi hai." });
    }

    // Step 3: Similarity calculate karo har transaction ke liye
    const scored = snapshot.docs.map((doc) => {
      const t = doc.data();
      const similarity = t.embedding ? cosineSimilarity(queryEmbedding, t.embedding) : 0;
      return { ...t, similarity };
    });

    // Step 4: Top 10 most relevant transactions lo
    const topRelevant = scored.sort((a, b) => b.similarity - a.similarity).slice(0, 10);

    const contextText = topRelevant
      .map((t) => `- ${t.date}: ${t.category} - Rs ${t.amount} (${t.description || ""})`)
      .join("\n");

    // Step 5: Gemini ko context + sawaal dekar answer banwao
    const prompt = `You are a personal finance assistant. Based on the following transaction data, answer the user's question concisely and helpfully.

Transactions:
${contextText}

Question: ${query}

Answer:`;

    const genResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const genData = await genResponse.json();

    if (!genData.candidates || !genData.candidates[0]) {
      console.error("Gemini response:", genData);
      return res.status(500).json({ error: "Gemini API se response nahi mila" });
    }

    const answer = genData.candidates[0].content.parts[0].text;

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---- Server start karo ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));