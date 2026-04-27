import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/analyze", async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    const prompt = `
You are an AI job assistant.

Analyze the resume and job description.

Return in clean format:

MATCH SCORE: (percentage)

MATCHING SKILLS:
- skill 1
- skill 2

MISSING SKILLS:
- skill 1
- skill 2

IMPROVEMENTS:
- suggestion 1
- suggestion 2

COVER LETTER:
(write short professional cover letter)

HR EMAIL:
(write short email)


Resume:
${resume}

Job Description:
${jobDescription}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      result: data.response
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Ollama error. Make sure Ollama is running."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});