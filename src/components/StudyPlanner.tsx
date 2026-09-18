import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  AlertTriangle,
  Timer,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { StudyTask, SubjectType, SUBJECT_COLORS } from "../types";
import { PomodoroTimer } from "./PomodoroTimer";
import { playChime } from "../utils/audio";

interface StudyPlannerProps {
  tasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, "id">) => void;
  onToggleTaskStatus: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSessionComplete?: (minutesStudied: number) => void;
}

const ALL_SUBJECTS: SubjectType[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "General Knowledge",
];

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  tasks,
  onAddTask,
  onToggleTaskStatus,
  onDeleteTask,
  onSessionComplete,
}) => {
  const [activeTab, setActiveTab] = useState<"today" | "all" | "pomodoro">("today");
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr);
  const [subject, setSubject] = useState<SubjectType>("Mathematics");
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("17:00");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onAddTask({
      date,
      subject,
      topic: topic.trim(),
      startTime,
      endTime,
      priority,
      status: "Pending",
    });

    setTopic("");
    setShowAddModal(false);
  };

  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const completedToday = todayTasks.filter((t) => t.status === "Completed").length;

  const handleToggle = (id: string) => {
    playChime("complete");
    onToggleTaskStatus(id);
  };

  return (
    <div id="study-planner-container" className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Study Planner & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize daily tasks, track completion status, and run focused Pomodoro intervals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab("today")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "today"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Today's Tasks
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Weekly Schedule
            </button>
            <button
              onClick={() => setActiveTab("pomodoro")}
              className={`flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "pomodoro"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Timer className="h-3.5 w-3.5" />
              <span>Pomodoro</span>
            </button>
          </div>

          <button
            id="add-task-open-btn"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* TODAY'S TASKS VIEW */}
      {activeTab === "today" && (
        <div className="space-y-6">
          {/* Progress summary banner */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Daily Progress
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {completedToday} of {todayTasks.length} tasks completed today
                </h2>
              </div>
              <div className="w-full sm:w-64">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
                    style={{
                      width: `${todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Task items list */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            {todayTasks.length === 0 ? (
              <div className="py-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No study sessions scheduled for today!
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Add Task" above to plan what you want to study.
                </p>
              </div>
            ) : (
              todayTasks.map((task) => {
                const color = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS["General Knowledge"];
                const isDone = task.status === "Completed";
                return (
                  <div
                    key={task.id}
                    id={`task-row-${task.id}`}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                      isDone
                        ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10 opacity-75"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggle(task.id)}
                        className="rounded-lg p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title={isDone ? "Mark Pending" : "Mark Completed"}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="h-6 w-6 text-slate-400 hover:text-indigo-600" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold text-slate-900 dark:text-white ${
                              isDone ? "line-through text-slate-400 dark:text-slate-500" : ""
                            }`}
                          >
                            {task.topic}
                          </h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${color.badge}`}
                          >
                            {task.subject}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.startTime} - {task.endTime}
                          </span>
                          <span>•</span>
                          <span
                            className={`font-semibold ${
                              task.priority === "High"
                                ? "text-rose-500"
                                : task.priority === "Medium"
                                ? "text-amber-500"
                                : "text-emerald-500"
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* WEEKLY SCHEDULE OVERVIEW */}
      {activeTab === "all" && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              All Planned Study Sessions
            </h2>
            <span className="text-xs text-slate-400">
              Total {tasks.length} tasks scheduled
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const color = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS["General Knowledge"];
              const isDone = task.status === "Completed";
              return (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border ${
                    isDone
                      ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10 opacity-75"
                      : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(task.id)}
                      className="rounded-lg p-1 text-slate-400 hover:text-indigo-600"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          {task.date}
                        </span>
                        <h4
                          className={`text-sm font-bold text-slate-900 dark:text-white ${
                            isDone ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {task.topic}
                        </h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${color.badge}`}>
                          {task.subject}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {task.startTime} - {task.endTime} • {task.priority} Priority
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="self-end sm:self-center p-1.5 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* POMODORO TIMER VIEW */}
      {activeTab === "pomodoro" && (
        <div className="max-w-xl mx-auto">
          <PomodoroTimer onSessionComplete={onSessionComplete} />
        </div>
      )}

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
              Schedule New Study Task
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Topic or Objective
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Practice Integration by Parts (10 problems)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {ALL_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Low", "Medium", "High"] as const).map((pri) => (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setPriority(pri)}
                      className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                        priority === pri
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
