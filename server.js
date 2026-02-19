import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

// CORS ayarı
app.use(cors({
  origin: "*" // tüm sitelerden gelen isteğe izin verir
}));

app.use(express.json());

// Rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 dakika
  max: 20, // 1 dakikada max 20 istek
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla istek attın. Lütfen biraz bekle." }
});
app.use(limiter);

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // eski model yerine desteklenen model
        messages: req.body.messages
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Port ayarı Render uyumlu
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
