import React, { useState } from "react";
import { Sparkles, Loader2, Play, CheckCircle2 } from "lucide-react";
import { QuizQuestion, SubjectType } from "../types";

interface AIQuizGeneratorProps {
  onStartQuizWithQuestions: (
    subject: string,
    topic: string,
    difficulty: "Easy" | "Medium" | "Hard",
    questions: QuizQuestion[]
  ) => void;
}

const ALL_SUBJECTS: SubjectType[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "General Knowledge",
];

export const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({
  onStartQuizWithQuestions,
}) => {
  const [subject, setSubject] = useState<SubjectType>("Physics");
  const [topic, setTopic] = useState("Motion & Kinematics");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[] | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedQuestions(null);

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic: topic.trim(),
          questionCount,
          difficulty,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate quiz from AI.");
      }

      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
      } else {
        throw new Error("No questions returned by AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartNow = () => {
    if (generatedQuestions && generatedQuestions.length > 0) {
      onStartQuizWithQuestions(subject, topic, difficulty, generatedQuestions);
    }
  };

  return (
    <div id="ai-quiz-generator-container" className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Test Generator</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Quiz Generator
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100 leading-relaxed">
            Create customized, curriculum-aligned multiple-choice practice tests on any topic and difficulty level in seconds with Gemini.
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Subject
              </label>
              <select
                id="ai-quiz-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {ALL_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Specific Topic
              </label>
              <input
                type="text"
                id="ai-quiz-topic"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Motion, Photosynthesis, Quadratic Equations, Trees..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`rounded-xl py-2.5 text-xs font-bold border transition-all ${
                      questionCount === cnt
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`rounded-xl py-2.5 text-xs font-bold border transition-all ${
                      difficulty === diff
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/20"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="generate-ai-quiz-btn"
              disabled={loading || !topic.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating {questionCount} Exam Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* Generated Ready Card */}
      {generatedQuestions && generatedQuestions.length > 0 && (
        <div
          id="ai-quiz-ready-preview"
          className="rounded-3xl border border-indigo-200 bg-indigo-50/50 p-6 sm:p-8 dark:border-indigo-900/50 dark:bg-indigo-950/30 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Quiz Generated Successfully!
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {generatedQuestions.length} multiple-choice questions ready on{" "}
                <strong>{topic}</strong> ({subject} • {difficulty})
              </p>
            </div>

            <button
              id="start-ai-generated-quiz-btn"
              onClick={handleStartNow}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Start Quiz Immediately</span>
            </button>
          </div>

          {/* Quick Preview of First Question */}
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
              Sample Question Preview (1 of {generatedQuestions.length})
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {generatedQuestions[0].question}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {generatedQuestions[0].options.map((opt, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  <span className="font-bold mr-1.5 text-indigo-600 dark:text-indigo-400">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
