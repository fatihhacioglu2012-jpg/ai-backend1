import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cors from "cors";
app.use(cors({
  origin: "*", // tüm sitelerden gelen isteğe izin verir
}));



const app = express();
app.use(cors());
app.use(express.json());
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 dakika
  max: 20, // 1 dakikada max 20 istek
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla istek attın. Lütfen biraz bekle." }
});

app.use(limiter);


app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: req.body.messages
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

app.listen(3000, () => console.log("Server running"));
