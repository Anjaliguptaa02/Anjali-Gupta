import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Star,
  Sparkles,
  Filter,
  FileText,
  Tag,
} from "lucide-react";
import { Note, SubjectType, SUBJECT_COLORS } from "../types";
import { NoteCard } from "./NoteCard";
import { NoteModal } from "./NoteModal";

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateToAINotes: () => void;
}

const ALL_SUBJECTS: (SubjectType | "All")[] = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "General Knowledge",
];

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onToggleFavorite,
  onNavigateToAINotes,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Active view/edit modal
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);

  // New note blank state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState<SubjectType>("Mathematics");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (onlyFavorites && !n.isFavorite) return false;
      if (selectedSubject !== "All" && n.subject !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchSubject = n.subject.toLowerCase().includes(q);
        const matchContent = n.content.toLowerCase().includes(q);
        const matchTags = n.tags && n.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSubject && !matchContent && !matchTags) return false;
      }
      return true;
    });
  }, [notes, selectedSubject, searchQuery, onlyFavorites]);

  const handleCreateNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const parsedTags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const noteToAdd: Note = {
      id: `manual-note-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      content: newContent.trim(),
      explanation: newContent.trim(),
      tags: parsedTags.length > 0 ? parsedTags : [newSubject],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    };

    onAddNote(noteToAdd);
    setNewTitle("");
    setNewContent("");
    setNewTags("");
    setIsNewNoteModalOpen(false);
  };

  return (
    <div id="notes-section-container" className="space-y-8 max-w-6xl mx-auto">
      {/* Header with Title & Quick Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Study Notes & Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, revise, search, and manage comprehensive notes for all your academic subjects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="ai-generate-notes-nav-btn"
            onClick={onNavigateToAINotes}
            className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Note Maker</span>
          </button>

          <button
            id="add-manual-note-btn"
            onClick={() => setIsNewNoteModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="notes-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by title, topic, or keyword..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Favorite Toggle Filter */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all border ${
              onlyFavorites
                ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Star
              className={`h-4 w-4 ${
                onlyFavorites ? "fill-amber-400 text-amber-400" : "text-slate-400"
              }`}
            />
            <span>Favorites</span>
          </button>
        </div>

        {/* Subject Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Subject:
          </span>
          {ALL_SUBJECTS.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No notes found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedSubject !== "All" || onlyFavorites
              ? "Try adjusting your search query or subject filters."
              : "Start by generating notes with the AI Note Maker or creating a new manual note."}
          </p>
          <button
            onClick={onNavigateToAINotes}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Notes with AI</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onView={(n) => setSelectedNote(n)}
              onEdit={(n) => setSelectedNote(n)}
              onDelete={onDeleteNote}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* View & Edit Note Modal */}
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          isOpen={Boolean(selectedNote)}
          onClose={() => setSelectedNote(null)}
          onSave={(updated) => {
            onUpdateNote(updated);
            setSelectedNote(null);
          }}
          onDelete={onDeleteNote}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {/* Create New Note Modal */}
      {isNewNoteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setIsNewNoteModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
              Create New Note
            </h3>

            <form onSubmit={handleCreateNewNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Fundamental Theorem of Calculus"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as SubjectType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {ALL_SUBJECTS.filter((s) => s !== "All").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Content / Explanations
                </label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your study notes, definitions, formulas, or summaries..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Exam Prep, Calculus, Derivatives"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewNoteModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
