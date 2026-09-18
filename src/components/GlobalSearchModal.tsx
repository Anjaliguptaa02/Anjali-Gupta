import React, { useState, useMemo, useEffect } from "react";
import { Search, X, BookOpen, HelpCircle, Calendar, ArrowRight } from "lucide-react";
import { Note, StudyTask, ActiveTab } from "../types";
import { SAMPLE_QUIZZES } from "../data/sampleData";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  tasks: StudyTask[];
  onSelectNote: (note: Note) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  notes,
  tasks,
  onSelectNote,
  setActiveTab,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return { notes: [], quizzes: [], tasks: [] };
    const q = query.toLowerCase();

    const matchingNotes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
    );

    const matchingTasks = tasks.filter(
      (t) =>
        t.topic.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
    );

    const quizzesList = Object.entries(SAMPLE_QUIZZES).map(([id, qz]) => ({
      id,
      ...qz,
    }));

    const matchingQuizzes = quizzesList.filter(
      (qz) =>
        qz.topic.toLowerCase().includes(q) ||
        qz.subject.toLowerCase().includes(q) ||
        qz.questions.some((item) => item.question.toLowerCase().includes(q))
    );

    return {
      notes: matchingNotes.slice(0, 5),
      quizzes: matchingQuizzes.slice(0, 4),
      tasks: matchingTasks.slice(0, 4),
    };
  }, [query, notes, tasks]);

  if (!isOpen) return null;

  const totalResults = results.notes.length + results.quizzes.length + results.tasks.length;

  return (
    <div
      id="global-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative flex items-center border-b border-slate-200 px-4 dark:border-slate-800">
          <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, subjects, quiz topics, tasks..."
            className="w-full bg-transparent px-3 py-4 text-base text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="ml-2 hidden rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-400 dark:bg-slate-800 sm:inline-block">
            ESC to close
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Type to start searching StudyBuddy AI
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "Calculus", "Newton", "Binary Search", or "English".
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-slate-500">
                No matching results found for "{query}".
              </p>
              <button
                onClick={() => {
                  setActiveTab("ai-notes");
                  onClose();
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
              >
                <span>Generate Notes for "{query}" with AI</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Notes Results */}
              {results.notes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Notes ({results.notes.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => {
                          onSelectNote(note);
                          onClose();
                        }}
                        className="group flex items-center justify-between rounded-xl p-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                            {note.title}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {note.subject} • {note.content.slice(0, 60)}...
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 dark:text-slate-600 dark:group-hover:text-indigo-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz Topics */}
              {results.quizzes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Quizzes ({results.quizzes.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        onClick={() => {
                          setActiveTab("quiz");
                          onClose();
                        }}
                        className="group flex items-center justify-between rounded-xl p-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                            {quiz.topic}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {quiz.subject} • {quiz.questions.length} questions • {quiz.difficulty}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          Take Quiz →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Planner Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Study Tasks ({results.tasks.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setActiveTab("planner");
                          onClose();
                        }}
                        className="group flex items-center justify-between rounded-xl p-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                            {task.topic}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {task.subject} • {task.startTime} - {task.endTime} • Priority: {task.priority}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
