// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const isArabic = /[\u0600-\u06FF]/.test(text);
  const prompt = isArabic
    ? `لخص هذا المقال بالعربية:\n\n${text}`
    : `Summarize this article in English:\n\n${text}`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // يمكنك تغييره لاحقاً
          "X-Title": "Article Summarizer",
        },
      }
    );

    const result = response.data.choices?.[0]?.message?.content;
    res.json({ summary: result || "لم يتم التوصل إلى ملخص." });
  } catch (error) {
    console.error("خطأ أثناء طلب التلخيص:", error.message);
    res.status(500).json({ error: "فشل في التلخيص، حاول لاحقًا." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
