import React from "react";
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Calendar,
  Bot,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Timer,
  Play,
  Award,
} from "lucide-react";
import {
  UserProfile,
  UserStats,
  Note,
  StudyTask,
  UpcomingExam,
  QuizResult,
  ActiveTab,
  SUBJECT_COLORS,
} from "../types";
import { DashboardCard } from "./DashboardCard";
import { NoteCard } from "./NoteCard";

interface DashboardViewProps {
  profile: UserProfile;
  stats: UserStats;
  notes: Note[];
  tasks: StudyTask[];
  exams: UpcomingExam[];
  quizHistory: QuizResult[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectNote: (note: Note) => void;
  onToggleTask: (id: string) => void;
  onToggleNoteFavorite: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  stats,
  notes,
  tasks,
  exams,
  quizHistory,
  setActiveTab,
  onSelectNote,
  onToggleTask,
  onToggleNoteFavorite,
  onDeleteNote,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const completedTasksCount = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasksCount = tasks.filter((t) => t.status === "Pending").length;
  const recentNotes = notes.slice(0, 3);
  const latestQuiz = quizHistory[0];

  // Daily goal calculation
  const goalHours = profile.dailyGoalHours || 3.0;
  const todayHours = stats.todayStudyHours || 2.5;
  const goalPercent = Math.min(100, Math.round((todayHours / goalHours) * 100));

  return (
    <div id="dashboard-main-view" className="space-y-8 max-w-6xl mx-auto">
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-10 text-white shadow-xl shadow-indigo-600/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Welcome back, {profile.name}!</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Study Smarter, <br className="hidden sm:inline" />
            Not Harder
          </h1>

          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed max-w-xl">
            Empower your academic journey with instant AI note synthesis, personalized quiz practice, Pomodoro focus cycles, and structured study planning.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              id="hero-start-studying-btn"
              onClick={() => setActiveTab("planner")}
              className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-xs sm:text-sm font-extrabold text-indigo-700 shadow-md hover:bg-indigo-50 transition-all hover:scale-105"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Studying</span>
            </button>

            <button
              id="hero-try-ai-btn"
              onClick={() => setActiveTab("assistant")}
              className="flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:bg-white/30 transition-all"
            >
              <Bot className="h-4 w-4" />
              <span>Try AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -right-12 -top-12 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 h-64 w-64 rounded-full bg-blue-300/20 blur-2xl pointer-events-none" />
      </div>

      {/* 2. STATS & PROGRESS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Study Hours vs Goal */}
        <DashboardCard
          id="kpi-study-hours"
          title="Today's Study Hours"
          value={`${todayHours}h`}
          subtitle={`Daily Target: ${goalHours}h (${goalPercent}%)`}
          icon={Clock}
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-50 dark:bg-blue-950/50"
          badge={goalPercent >= 100 ? "Goal Reached! 🎉" : `${goalHours - todayHours}h left`}
          badgeColor="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
          onClick={() => setActiveTab("planner")}
        />

        {/* Study Streak */}
        <DashboardCard
          id="kpi-streak"
          title="Study Streak"
          value={`${stats.streakDays} Days`}
          subtitle="Keep up daily momentum"
          icon={Flame}
          iconColor="text-amber-500"
          bgColor="bg-amber-50 dark:bg-amber-950/50"
          badge="🔥 Hot Streak"
          badgeColor="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
          onClick={() => setActiveTab("progress")}
        />

        {/* Tasks Progress */}
        <DashboardCard
          id="kpi-tasks"
          title="Completed / Pending Tasks"
          value={`${completedTasksCount} / ${tasks.length}`}
          subtitle={`${pendingTasksCount} pending tasks remaining`}
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-50 dark:bg-emerald-950/50"
          badge={`${Math.round((completedTasksCount / Math.max(tasks.length, 1)) * 100)}% Done`}
          badgeColor="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
          onClick={() => setActiveTab("planner")}
        />

        {/* Quiz Performance */}
        <DashboardCard
          id="kpi-quiz-score"
          title="Quiz Mastery"
          value={`${stats.quizAccuracy}%`}
          subtitle={latestQuiz ? `Latest: ${latestQuiz.scorePercentage}% in ${latestQuiz.subject}` : "Based on completed tests"}
          icon={HelpCircle}
          iconColor="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-50 dark:bg-purple-950/50"
          badge={`${stats.quizzesCompleted} Quizzes`}
          badgeColor="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
          onClick={() => setActiveTab("quiz")}
        />
      </div>

      {/* 3. QUICK STUDY TOOLS BAR */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Quick Study Tools
          </h2>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Instant Access
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="quick-tool-ai-notes"
            onClick={() => setActiveTab("ai-notes")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-indigo-950/40 transition-all text-center group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              AI Note Maker
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Topic synthesis
            </span>
          </button>

          <button
            id="quick-tool-studybot"
            onClick={() => setActiveTab("assistant")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-indigo-950/40 transition-all text-center group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 mb-2 group-hover:scale-110 transition-transform">
              <Bot className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              StudyBot Chat
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Instant academic tutor
            </span>
          </button>

          <button
            id="quick-tool-quiz"
            onClick={() => setActiveTab("quiz")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-indigo-950/40 transition-all text-center group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300 mb-2 group-hover:scale-110 transition-transform">
              <HelpCircle className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Practice Quiz
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Timed tests & AI quiz
            </span>
          </button>

          <button
            id="quick-tool-pomodoro"
            onClick={() => setActiveTab("planner")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-indigo-950/40 transition-all text-center group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300 mb-2 group-hover:scale-110 transition-transform">
              <Timer className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Pomodoro Timer
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              25m focus cycles
            </span>
          </button>
        </div>
      </div>

      {/* 4. MAIN TWO-COLUMN SECTION: TASKS & EXAMS + RECENT NOTES */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols): Upcoming Tasks & Upcoming Exams */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tasks */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Today's Study Schedule
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("planner")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                View Full Planner →
              </button>
            </div>

            <div className="space-y-2.5">
              {todayTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No tasks scheduled for today. Click Planner to schedule sessions.
                </p>
              ) : (
                todayTasks.map((task) => {
                  const isDone = task.status === "Completed";
                  const color = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS["General Knowledge"];

                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10 opacity-70"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={`h-5 w-5 ${
                            isDone
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-xs sm:text-sm font-bold text-slate-900 dark:text-white ${
                              isDone ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {task.topic}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{task.startTime} - {task.endTime}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                              {task.priority} Priority
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${color.badge}`}>
                        {task.subject}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Exams Countdown */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Upcoming Exam Deadlines
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Next 30 Days
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {exams.map((exam) => {
                const color = SUBJECT_COLORS[exam.subject] || SUBJECT_COLORS["General Knowledge"];
                return (
                  <div
                    key={exam.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${color.badge}`}>
                        {exam.subject}
                      </span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                        {exam.daysRemaining} days left
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {exam.examName}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(exam.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Today's Goal Ring & Recent Notes */}
        <div className="space-y-6">
          {/* Daily Goal Gauge Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Today's Goal Gauge
              </h3>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {goalPercent}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Studied: <strong>{todayHours} hrs</strong></span>
                <span>Target: <strong>{goalHours} hrs</strong></span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                {goalPercent >= 100
                  ? "🎉 Daily target achieved! Outstanding dedication."
                  : `Just ${(goalHours - todayHours).toFixed(1)} hours left to hit your goal.`}
              </p>
            </div>
          </div>

          {/* Recent Notes Preview */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Recent Notes
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("notes")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                All Notes →
              </button>
            </div>

            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 hover:bg-indigo-50/50 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {note.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 line-clamp-1 transition-colors">
                    {note.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {note.explanation || note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
