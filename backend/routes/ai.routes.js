const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/symptoms", async (req, res) => {
  const { symptoms } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `I have the following symptoms: ${symptoms}. What could be the issue?`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // required by OpenRouter
          "X-Title": "Medical AI App", // optional
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("🧠 AI API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI response failed." });
  }
});

module.exports = router;
