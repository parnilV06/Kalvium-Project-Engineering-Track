import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/explain-code", async (req, res) => {
  try {
    const { code, problem } = req.body || {};

    // Validate required input
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Code is required." });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "Server is missing OPENROUTER_API_KEY." });
    }

    const prompt = `You are a DSA tutor.

Given the following code and Leetcode problem, return the SAME code with inline comments.

Rules:

* Do NOT change the code
* Add comments only on important lines
* Explain WHY the logic exists, not just what it does
* Keep comments short (max 1-2 lines)
* Use simple, beginner-friendly language

Code:
${code}

Problem:
${problem || ""}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        // Optional but helpful identifiers for OpenRouter
        "X-Title": "DSA Code Commenter"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({
        error: "AI service failed.",
        details: errorText
      });
    }

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(502).json({ error: "AI service returned an empty response." });
    }

    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
