process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Error:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Promise:", err);
});
// 🔹 Load env

require("dotenv").config();

// 🔹 Imports
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

// 🔹 Init app
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Init Groq
const openai = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("AI Placement Cracker Server is running ✅");
});

/* ======================================
   🚀 FULL PREP
====================================== */
app.post("/generate", async (req, res) => {
  console.log("🔥 Request received");

  const { role, company, weakArea } = req.body;

  if (!role || !company) {
    return res.json({ result: "⚠️ Missing input" });
  }

  console.log("⏳ Sending request to Groq...");

  let prompt = `
Role: ${role}
Company: ${company}

Give SHORT output.

Q1:
A1:
Q2:
A2:
Q3:
A3:

TIPS:
- Tip 1
- Tip 2

SELECTION SCORE:
75/100
`;

  if (weakArea) {
    prompt += `
IMPROVEMENT:
- ${weakArea}: Tip 1
- ${weakArea}: Tip 2
`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
    });

    console.log("✅ Got response");

    return res.json({
      result:
        response.choices?.[0]?.message?.content || "⚠️ No output from AI",
    });

  } catch (error) {
    console.error("❌ ERROR:", error.message);

    return res.json({
      result: "⚠️ API failed. Try again.",
    });
  }
});

/* ======================================
   ⚡ QUICK REVISION
====================================== */
app.post("/quick-revision", async (req, res) => {
  const { role, company } = req.body;

  if (!role || !company) {
    return res.json({ result: "⚠️ Missing input" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: `Give quick revision for ${role} at ${company} in 3 questions + 3 tips`,
        },
      ],
      max_tokens: 800,
    });

    return res.json({
      result:
        response.choices?.[0]?.message?.content || "⚠️ No output",
    });

  } catch (error) {
    console.error("❌ ERROR:", error.message);

    return res.json({
      result: "⚠️ Quick revision failed",
    });
  }
});

/* ======================================
   🔥 START SERVER
====================================== */
const PORT = 3000;

console.log("✅ Reached before server start");
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
setInterval(() => {}, 1000);