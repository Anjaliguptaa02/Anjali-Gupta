import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with telemetry header as required by skill
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

function withTimeout<T>(promise: Promise<T>, ms = 12000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI call timed out after " + ms + "ms")), ms)
    ),
  ]);
}


// 1. Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: "StudyBuddy AI",
  });
});

// 2. AI Note Maker endpoint
app.post("/api/ai/notes", async (req: Request, res: Response) => {
  try {
    const { topic, subject = "General Knowledge" } = req.body;
    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return res.status(400).json({ error: "Topic is required." });
    }

    const ai = getGemini();

    if (!ai) {
      // Fallback high-quality curated note generator if API key is missing
      const fallbackNote = generateFallbackNote(topic.trim(), subject);
      return res.json({ note: fallbackNote, source: "fallback" });
    }

    const prompt = `You are an expert educator. Create comprehensive, beautifully structured study notes on the topic: "${topic.trim()}" for the subject "${subject}".
Return a strict JSON object with exactly the following structure:
{
  "title": "Clear, concise title",
  "subject": "${subject}",
  "explanation": "A crystal-clear, student-friendly 2-3 paragraph explanation simplifying the core concept.",
  "importantPoints": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3",
    "Key takeaway point 4",
    "Key takeaway point 5"
  ],
  "definitions": [
    { "term": "Term 1", "definition": "Clear concise definition" },
    { "term": "Term 2", "definition": "Clear concise definition" },
    { "term": "Term 3", "definition": "Clear concise definition" }
  ],
  "keyTerms": ["Term 1", "Term 2", "Term 3", "Term 4"],
  "summary": "A concise 2-3 sentence executive summary for quick revision before an exam.",
  "examples": [
    "Real-world application or worked example 1",
    "Real-world application or worked example 2"
  ]
}
Do not include markdown formatting or backticks around the json. Only return the raw json object.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a master educational tutor. Always return well-formed JSON matching the user schema.",
        },
      }),
      10000
    );

    const responseText = response.text || "{}";
    try {
      const parsed = JSON.parse(responseText);
      return res.json({ note: parsed, source: "gemini" });
    } catch {
      // Clean possible fences
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json({ note: parsed, source: "gemini" });
    }
  } catch (err: any) {
    console.error("Error generating notes:", err);
    // Graceful fallback to avoid leaving user with error
    const { topic = "General Study", subject = "General Knowledge" } = req.body || {};
    const fallback = generateFallbackNote(String(topic), String(subject));
    return res.json({ note: fallback, source: "fallback", warning: "Used offline backup due to API delay." });
  }
});

// 3. AI StudyBot Chat endpoint
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  try {
    const { message, history = [], subject } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGemini();

    if (!ai) {
      return res.json({
        reply: generateFallbackChatReply(message, subject),
        source: "fallback",
      });
    }

    // Build context contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h.role === "user" || h.role === "model") {
          contents.push({
            role: h.role,
            parts: [{ text: h.content }],
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const systemInstruction = `You are StudyBot, an expert, enthusiastic, and highly supportive AI educational assistant for students.
Your mission is to make learning joyful, intuitive, and effective.
Guidelines:
1. Explain complex topics in simple, accessible language without patronizing.
2. Use relatable everyday analogies, step-by-step numbered steps, and bullet points.
3. For math or science, show formulas clearly with explanations of each variable.
4. When asked for questions or quizzes, provide challenging yet fair questions with answer keys.
5. Provide encouragement, mnemonic memory tricks, and quick study tips.
${subject ? `The student is currently studying: ${subject}.` : ""}
Keep answers formatted in clean Markdown.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
        },
      }),
      10000
    );

    const replyText = response.text || "I'm sorry, I couldn't generate a response. Could you rephrase your question?";
    return res.json({ reply: replyText, source: "gemini" });
  } catch (err: any) {
    console.error("Error in study chat:", err);
    return res.json({
      reply: generateFallbackChatReply(req.body.message, req.body.subject),
      source: "fallback",
    });
  }
});

// 4. AI Quiz Generator endpoint
app.post("/api/ai/quiz", async (req: Request, res: Response) => {
  try {
    const { subject = "General Knowledge", topic = "General Science", questionCount = 5, difficulty = "Medium" } = req.body;
    const count = Math.min(Math.max(parseInt(questionCount, 10) || 5, 3), 15);

    const ai = getGemini();

    if (!ai) {
      const fallbackQuestions = generateFallbackQuiz(subject, topic, count, difficulty);
      return res.json({ questions: fallbackQuestions, source: "fallback" });
    }

    const prompt = `Create an interactive multiple-choice quiz about "${topic}" in "${subject}".
Difficulty: ${difficulty}.
Total questions: ${count}.
Return a strict JSON array of question objects matching this exact structure:
[
  {
    "id": "q1",
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0, // integer 0, 1, 2, or 3 representing the zero-indexed index in the options array
    "explanation": "Detailed explanation of why this answer is correct and why other options are incorrect."
  }
]
Requirements:
- Exactly 4 options per question.
- correctAnswer must be an integer between 0 and 3.
- Questions must be educational, accurate, and test conceptual understanding.
- Only return the raw JSON array.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a specialized examination board creator. Return only valid JSON arrays.",
        },
      }),
      10000
    );

    const responseText = response.text || "[]";
    try {
      const parsed = JSON.parse(responseText);
      const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
      return res.json({ questions, source: "gemini" });
    } catch {
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
      return res.json({ questions, source: "gemini" });
    }
  } catch (err: any) {
    console.error("Error generating quiz:", err);
    const fallbackQuestions = generateFallbackQuiz(
      req.body.subject || "General",
      req.body.topic || "General",
      req.body.questionCount || 5,
      req.body.difficulty || "Medium"
    );
    return res.json({ questions: fallbackQuestions, source: "fallback" });
  }
});

// Fallback Generators for resilient offline testing
function generateFallbackNote(topic: string, subject: string) {
  const cleanTopic = topic.trim();
  return {
    title: `Key Principles of ${cleanTopic}`,
    subject: subject || "General Knowledge",
    explanation: `${cleanTopic} is a fundamental concept in ${subject}. It provides the theoretical and empirical foundation for understanding how related systems interact, transform, and maintain equilibrium. When studying ${cleanTopic}, it is crucial to first understand its core assumptions, key variables, and how theoretical equations or rules map to real-world observation.`,
    importantPoints: [
      `Primary governing rule: ${cleanTopic} relies on conserved properties and predictable state transitions.`,
      `Critical parameters include initial conditions, reaction rate/efficiency, and boundary constraints.`,
      `Common student pitfall: confusing correlation with causality when examining trends.`,
      `Practical utility: Used heavily across modern industry and applied science to optimize processes.`,
      `Exam key tip: Always define all variables and state units when answering test questions.`,
    ],
    definitions: [
      {
        term: `${cleanTopic}`,
        definition: `The structured phenomenon or concept defining behavior and interactions within ${subject}.`,
      },
      {
        term: "Equilibrium / Steady State",
        definition: "A condition in which all competing influences or forces are balanced, resulting in a stable state.",
      },
      {
        term: "System Efficiency",
        definition: "The ratio of useful output energy or product to the total input supplied.",
      },
    ],
    keyTerms: [cleanTopic, "State Function", "Gradient", "Conservation", "Equilibrium"],
    summary: `${cleanTopic} provides the core conceptual lens for analyzing processes in ${subject}. Mastering its fundamental definitions and mathematical relationships ensures high scoring on upcoming exams.`,
    examples: [
      `Real-world application: Modeling dynamic behavior in environmental and technological systems.`,
      `Laboratory demonstration: Measuring change in output metrics as controlled inputs vary incrementally.`,
    ],
  };
}

function generateFallbackChatReply(message: string, subject?: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("newton") || lower.includes("second law")) {
    return `### 🚀 Newton's Second Law of Motion Explained Simply

Newton's Second Law states that **the acceleration of an object depends directly upon the net force acting upon it, and inversely upon the mass of the object**.

#### The Core Formula:
$$\\mathbf{F = ma}$$
* **F** = Net Force (measured in Newtons, $N$)
* **m** = Mass of the object (measured in kilograms, $kg$)
* **a** = Acceleration (measured in meters per second squared, $m/s^2$)

---

#### 💡 The Intuitive Analogy:
Think of pushing a shopping cart:
1. **Empty Cart (Small Mass):** You give it a gentle push (small force), and it zooms forward quickly (high acceleration).
2. **Full Cart Loaded with Bricks (Large Mass):** You push with the exact same force, but it barely budges (low acceleration). To make it accelerate fast, you must push with immense strength (large force).

---

#### 📝 Key Takeaways for Your Exam:
* If you double the force on an object, its acceleration **doubles**.
* If you double the mass of an object, its acceleration **is cut in half**.
* Direction matters: Acceleration always happens in the **exact direction** of the net force!`;
  }

  if (lower.includes("photosynthesis")) {
    return `### 🌿 Photosynthesis Made Simple

**Photosynthesis** is the process by which green plants and certain organisms transform sunlight into chemical energy (food).

#### 🧪 The Chemical Equation:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light Energy} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$
*(Carbon Dioxide + Water + Sunlight $\\rightarrow$ Glucose + Oxygen)*

---

#### 🍃 The Two Main Stages:
1. **Light-Dependent Reactions (in the Thylakoids):**
   * Chlorophyll absorbs sunlight.
   * Water molecules ($H_2O$) are split, producing Oxygen ($O_2$) as a byproduct.
   * Energy-carrier molecules (ATP and NADPH) are created.
2. **The Calvin Cycle / Light-Independent Reactions (in the Stroma):**
   * Plants use the ATP & NADPH from step 1 to convert Carbon Dioxide ($CO_2$) into **Glucose** (sugar for the plant).

---

#### 🧠 Quick Memory Trick:
Remember **P.L.A.N.T.**: **P**hotons + **L**iquid ($H_2O$) + **A**ir ($CO_2$) = **N**utrition + **T**asty Oxygen!`;
  }

  if (lower.includes("javascript") || lower.includes("10 questions") || lower.includes("js")) {
    return `### 💻 10 Essential JavaScript Practice Questions

Here are 10 high-yield questions covering fundamental to intermediate JavaScript concepts:

1. **What is the difference between \`let\`, \`const\`, and \`var\`?** (Scope & hoisting differences)
2. **What does the \`=== \` (strict equality) operator check compared to \`==\`?**
3. **What is a Closure in JavaScript, and why is it useful?**
4. **Explain how the JavaScript Event Loop works.** (Call Stack, Task Queue, Microtask Queue)
5. **What is the difference between \`null\` and \`undefined\`?**
6. **How do Arrow Functions \`() => {}\` differ from regular function declarations regarding \`this\`?**
7. **What is a Promise, and what are its three possible states?** (Pending, Fulfilled, Rejected)
8. **What does \`Array.prototype.map()\` return compared to \`Array.prototype.forEach()\`?**
9. **Explain Destructuring assignment for arrays and objects with a code example.**
10. **What is event bubbling and how can you stop it with \`event.stopPropagation()\`?**

Would you like me to explain the detailed solution for any specific question above?`;
  }

  return `### 📚 StudyBot Answer: ${message.slice(0, 60)}...

Great question${subject ? ` in **${subject}**` : ""}! Here is a structured breakdown to help you master this concept:

1. **Fundamental Definition:**
   The topic revolves around how fundamental rules govern interactions and system states. Understanding the baseline definitions prevents confusion during multi-step exam questions.

2. **Key Concepts to Remember:**
   * Break the problem down into given variables and required targets.
   * Verify dimensional units or contextual assumptions before proceeding.
   * Relate theoretical principles back to empirical examples.

3. **Active Recall Study Tip:**
   Try explaining this concept in your own words to an imaginary study partner without looking at your notes for 2 minutes!

Would you like me to generate a 3-question practice quiz, give you a real-world analogy, or summarize this into flashcard bullet points?`;
}

function generateFallbackQuiz(subject: string, topic: string, count: number, difficulty: string) {
  const sampleBank = [
    {
      id: "q1",
      question: `In ${subject}, what is the primary fundamental principle governing ${topic}?`,
      options: [
        "Conservation of energy and systemic equilibrium",
        "Random unbounded fluctuation",
        "Static non-interacting components",
        "Instantaneous infinite velocity",
      ],
      correctAnswer: 0,
      explanation: "Systems in nature follow conservation laws and strive towards thermodynamic and energetic equilibrium.",
    },
    {
      id: "q2",
      question: `Which of the following best describes the core variable when analyzing ${topic}?`,
      options: [
        "Arbitrary constants with no dimensional units",
        "Measurable rate of change over time or space",
        "Independent hypothetical conjecture",
        "Uncalibrated sensory impressions",
      ],
      correctAnswer: 1,
      explanation: "Analyzing the rate of change allows scientists and engineers to model system trajectories precisely.",
    },
    {
      id: "q3",
      question: `When applying ${topic} to practical problem solving, what is the most critical first step?`,
      options: [
        "Guessing the final magnitude",
        "Identifying known parameters, constraints, and target units",
        "Skipping boundary conditions",
        "Assuming zero resistance or external influences without verification",
      ],
      correctAnswer: 1,
      explanation: "Listing given values, identifying constraints, and unit consistency is standard rigorous methodology.",
    },
    {
      id: "q4",
      question: `What distinguishes a ${difficulty}-level question in ${subject} regarding this topic?`,
      options: [
        "Synthesizing multiple interacting principles simultaneously",
        "Only testing pure surface-level recall of single words",
        "Ignoring mathematical rigor",
        "Using invalid physical assumptions",
      ],
      correctAnswer: 0,
      explanation: "Higher level questions require connecting theoretical relationships to concrete multi-step problem sets.",
    },
    {
      id: "q5",
      question: `Which metric provides the most reliable evaluation of performance in ${topic}?`,
      options: [
        "Repeatable empirical validation against standard controls",
        "Subjective personal preference",
        "Unverified anecdotes",
        "Single uncontrolled trial",
      ],
      correctAnswer: 0,
      explanation: "Empirical validation with reproducible experiments is the cornerstone of scientific and academic study.",
    },
  ];

  return sampleBank.slice(0, count);
}

// 5. Mount Vite middleware or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyBuddy AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
