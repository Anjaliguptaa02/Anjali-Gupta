import React, { useState } from "react";
import {
  X,
  Star,
  Copy,
  Check,
  Edit3,
  Save,
  BookOpen,
  Calendar,
  Sparkles,
  Lightbulb,
  BookmarkCheck,
  HelpCircle,
} from "lucide-react";
import { Note, SubjectType, SUBJECT_COLORS } from "../types";

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const ALL_SUBJECTS: SubjectType[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "General Knowledge",
];

export const NoteModal: React.FC<NoteModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onToggleFavorite,
}) => {
  if (!isOpen || !note) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit states
  const [title, setTitle] = useState(note.title);
  const [subject, setSubject] = useState<SubjectType>(note.subject);
  const [content, setContent] = useState(note.content);
  const [explanation, setExplanation] = useState(note.explanation || "");
  const [summary, setSummary] = useState(note.summary || "");

  const handleCopyMarkdown = () => {
    const md = `# ${note.title} (${note.subject})
${note.explanation || note.content}

## Important Points
${note.importantPoints ? note.importantPoints.map((p) => `- ${p}`).join("\n") : ""}

## Definitions
${note.definitions ? note.definitions.map((d) => `**${d.term}**: ${d.definition}`).join("\n") : ""}

## Key Terms
${note.keyTerms ? note.keyTerms.join(", ") : ""}

## Summary
${note.summary || ""}

## Examples
${note.examples ? note.examples.map((e) => `- ${e}`).join("\n") : ""}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    const updated: Note = {
      ...note,
      title: title.trim() || note.title,
      subject,
      content: content.trim() || note.content,
      explanation: explanation.trim() || note.explanation,
      summary: summary.trim() || note.summary,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
    setIsEditing(false);
  };

  const color = SUBJECT_COLORS[note.subject] || SUBJECT_COLORS["General Knowledge"];

  return (
    <div
      id="note-view-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-8 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${color.badge}`}>
              <BookOpen className="h-3.5 w-3.5" />
              <span>{note.subject}</span>
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(note.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(note.id)}
                className="rounded-lg p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={note.isFavorite ? "Favorited" : "Mark favorite"}
              >
                <Star
                  className={`h-4 w-4 ${
                    note.isFavorite ? "fill-amber-400 text-amber-400" : ""
                  }`}
                />
              </button>
            )}
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              title="Copy formatted note"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Notes</span>
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isEditing ? "Cancel" : "Edit"}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {ALL_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Simple Explanation / Main Content
                </label>
                <textarea
                  rows={4}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Summary
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Title */}
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {note.title}
                </h2>
              </div>

              {/* Simple Explanation */}
              <div className="rounded-2xl bg-indigo-50/40 p-5 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Simple Explanation</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {note.explanation || note.content}
                </p>
              </div>

              {/* Important Points */}
              {note.importantPoints && note.importantPoints.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    <BookmarkCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Important Points</span>
                  </h4>
                  <ul className="space-y-2">
                    {note.importantPoints.map((pt, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Definitions Grid */}
              {note.definitions && note.definitions.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Key Definitions</span>
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {note.definitions.map((def, i) => (
                      <div
                        key={i}
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

              {/* Key Terms Chips */}
              {note.keyTerms && note.keyTerms.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Key Vocabulary
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {note.keyTerms.map((term, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-indigo-100/70 px-2.5 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              {note.examples && note.examples.length > 0 && (
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>Worked Examples & Applications</span>
                  </div>
                  <div className="space-y-2">
                    {note.examples.map((ex, i) => (
                      <p key={i} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        • {ex}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Revision Summary */}
              {note.summary && (
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Quick Revision Summary
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {note.summary}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
