import React from "react";
import { Star, Trash2, Edit3, Calendar, Tag, BookOpen } from "lucide-react";
import { Note, SUBJECT_COLORS } from "../types";

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const color = SUBJECT_COLORS[note.subject] || SUBJECT_COLORS["General Knowledge"];
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      id={`note-card-${note.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 transition-all cursor-pointer"
      onClick={() => onView(note)}
    >
      {/* Top row: Subject badge & Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${color.badge}`}>
          <BookOpen className="h-3 w-3" />
          <span>{note.subject}</span>
        </span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleFavorite(note.id)}
            title={note.isFavorite ? "Remove favorite" : "Mark as favorite"}
            className="rounded-lg p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Star
              className={`h-4 w-4 ${
                note.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400"
              }`}
            />
          </button>
          <button
            onClick={() => onEdit(note)}
            title="Edit note"
            className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            title="Delete note"
            className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title & Preview */}
      <div className="flex-1">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {note.title}
        </h3>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {note.explanation || note.content}
        </p>
      </div>

      {/* Tags if present */}
      {note.tags && note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              <Tag className="h-2.5 w-2.5" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {/* Bottom info */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
          Read full notes →
        </span>
      </div>
    </div>
  );
};
