import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Save,
  Loader2,
  BookmarkCheck,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Note, SubjectType, SUBJECT_COLORS } from "../types";

interface AINoteMakerProps {
  onSaveGeneratedNote: (note: Note) => void;
  onNavigateToNotes: () => void;
}

const ALL_SUBJECTS: SubjectType[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "General Knowledge",
];

const SUGGESTED_TOPICS = [
  { topic: "Photosynthesis", subject: "Chemistry" as SubjectType },
  { topic: "Newton's Second Law of Motion", subject: "Physics" as SubjectType },
  { topic: "Binary Search Trees", subject: "Computer Science" as SubjectType },
  { topic: "The Quadratic Formula & Complex Roots", subject: "Mathematics" as SubjectType },
  { topic: "Metaphor vs. Simile in Poetry", subject: "English" as SubjectType },
  { topic: "Plate Tectonics & Continental Drift", subject: "General Knowledge" as SubjectType },
];

export const AINoteMaker: React.FC<AINoteMakerProps> = ({
  onSaveGeneratedNote,
  onNavigateToNotes,
}) => {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState<SubjectType>("Chemistry");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedNote, setGeneratedNote] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          subject,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate notes. Please try again.");
      }

      const data = await res.json();
      if (data.note) {
        setGeneratedNote(data.note);
      } else {
        throw new Error("Invalid response format from AI service.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedNote) return;
    const md = `# ${generatedNote.title} (${generatedNote.subject || subject})

## Simple Explanation
${generatedNote.explanation}

## Important Points
${(generatedNote.importantPoints || []).map((p: string) => `- ${p}`).join("\n")}

## Definitions
${(generatedNote.definitions || [])
  .map((d: any) => `**${d.term}**: ${d.definition}`)
  .join("\n")}

## Key Terms
${(generatedNote.keyTerms || []).join(", ")}

## Summary
${generatedNote.summary}

## Examples
${(generatedNote.examples || []).map((ex: string) => `- ${ex}`).join("\n")}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!generatedNote) return;
    const newNote: Note = {
      id: `ai-note-${Date.now()}`,
      title: generatedNote.title || topic,
      subject: (generatedNote.subject as SubjectType) || subject,
      content: generatedNote.explanation || "",
      explanation: generatedNote.explanation,
      importantPoints: generatedNote.importantPoints || [],
      definitions: generatedNote.definitions || [],
      keyTerms: generatedNote.keyTerms || [],
      summary: generatedNote.summary || "",
      examples: generatedNote.examples || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: ["AI Generated", subject],
    };
    onSaveGeneratedNote(newNote);
    setSaved(true);
  };

  return (
    <div id="ai-note-maker-container" className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by Gemini AI</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Note Maker
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100 leading-relaxed">
            Enter any topic, curriculum concept, or chapter heading. StudyBuddy AI will synthesize crystal-clear explanations, high-yield bullet points, definitions, formulas, and real-world examples in seconds.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Generator Form */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Topic or Concept
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  id="ai-note-topic-input"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis, Binary Search Trees, Newton's Second Law..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Target Subject
              </label>
              <select
                id="ai-note-subject-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {ALL_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Or Try Popular Exam Topics:
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TOPICS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(item.topic);
                    setSubject(item.subject);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  {item.topic}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="ai-generate-notes-btn"
              disabled={loading || !topic.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Study Notes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Notes</span>
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

      {/* Generated Result Card */}
      {generatedNote && (
        <div
          id="ai-generated-note-result"
          className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* Action bar for result */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 mb-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{generatedNote.subject || subject}</span>
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {generatedNote.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="copy-notes-btn"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Notes</span>
                  </>
                )}
              </button>

              <button
                id="save-notes-btn"
                onClick={handleSave}
                disabled={saved}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all shadow-md ${
                  saved
                    ? "bg-emerald-600 shadow-emerald-600/20"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                }`}
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Saved to My Notes</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Notes</span>
                  </>
                )}
              </button>

              {saved && (
                <button
                  onClick={onNavigateToNotes}
                  className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  <span>View All Notes</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Section 1: Simple Explanation */}
          <div className="rounded-2xl bg-indigo-50/40 p-5 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Simple Explanation</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {generatedNote.explanation}
            </p>
          </div>

          {/* Section 2: Important Points */}
          {generatedNote.importantPoints && generatedNote.importantPoints.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                <BookmarkCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Important Points</span>
              </h3>
              <ul className="space-y-2">
                {generatedNote.importantPoints.map((pt: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 3: Definitions */}
          {generatedNote.definitions && generatedNote.definitions.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Definitions</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {generatedNote.definitions.map((def: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                      {def.term}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {def.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Key Terms */}
          {generatedNote.keyTerms && generatedNote.keyTerms.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Key Terms & Vocabulary
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {generatedNote.keyTerms.map((term: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-indigo-100/70 px-2.5 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Worked Examples */}
          {generatedNote.examples && generatedNote.examples.length > 0 && (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>Practical Examples</span>
              </div>
              <div className="space-y-2">
                {generatedNote.examples.map((ex: string, idx: number) => (
                  <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    • {ex}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Short Summary */}
          {generatedNote.summary && (
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Short Revision Summary
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {generatedNote.summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
