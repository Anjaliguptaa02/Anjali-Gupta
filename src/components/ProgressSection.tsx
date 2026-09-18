import React from "react";
import {
  Trophy,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Lock,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { UserStats, Achievement, QuizResult, Note, SUBJECT_COLORS } from "../types";
import { DashboardCard } from "./DashboardCard";

interface ProgressSectionProps {
  stats: UserStats;
  achievements: Achievement[];
  quizHistory: QuizResult[];
  notes: Note[];
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  stats,
  achievements,
  quizHistory,
  notes,
}) => {
  // Weekly hours max for relative graph bar heights
  const maxWeeklyHours = Math.max(...stats.weeklyStudyHours.map((d) => d.hours), 4);

  // Subject notes distribution
  const subjectCounts: Record<string, number> = {};
  notes.forEach((n) => {
    subjectCounts[n.subject] = (subjectCounts[n.subject] || 0) + 1;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div id="progress-section-container" className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Study Progress & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed breakdown of your study consistency, quiz mastery, and unlocked badges.
        </p>
      </div>

      {/* KPI Stats Top Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          id="stat-total-study-hours"
          title="Total Study Hours"
          value={`${stats.totalStudyHours}h`}
          subtitle="Focused revision time"
          icon={Clock}
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-50 dark:bg-blue-950/50"
          badge="+3.5h this week"
          badgeColor="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        />

        <DashboardCard
          id="stat-streak-counter"
          title="Study Streak"
          value={`${stats.streakDays} Days`}
          subtitle="Daily learning momentum"
          icon={Flame}
          iconColor="text-amber-500"
          bgColor="bg-amber-50 dark:bg-amber-950/50"
          badge="🔥 Active"
          badgeColor="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
        />

        <DashboardCard
          id="stat-quiz-accuracy"
          title="Quiz Accuracy"
          value={`${stats.quizAccuracy}%`}
          subtitle={`Across ${stats.quizzesCompleted} completed tests`}
          icon={Trophy}
          iconColor="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-50 dark:bg-emerald-950/50"
          badge="High Yield"
          badgeColor="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
        />

        <DashboardCard
          id="stat-badges-unlocked"
          title="Badges Earned"
          value={`${unlockedCount} / ${achievements.length}`}
          subtitle="Gamified milestones"
          icon={Award}
          iconColor="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-50 dark:bg-purple-950/50"
          badge="Level 4 Scholar"
          badgeColor="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
        />
      </div>

      {/* Visual Charts: Weekly Graph & Subject Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Study Hours Bar Graph (Tailwind responsive bar chart) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Weekly Study Hours</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged Pomodoro and focused revision hours per day
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
              Last 7 Days
            </span>
          </div>

          <div className="flex h-52 items-end justify-between gap-2 pt-6 px-2">
            {stats.weeklyStudyHours.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.hours / maxWeeklyHours) * 100));
              const isToday = idx === stats.weeklyStudyHours.length - 1;

              return (
                <div key={item.day} className="flex flex-col items-center flex-1 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden flex items-end h-full">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        isToday
                          ? "bg-gradient-to-t from-indigo-600 to-purple-600"
                          : "bg-indigo-500/80 group-hover:bg-indigo-600"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span
                    className={`mt-2 text-xs font-bold ${
                      isToday
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject-Wise Notes & Activity Breakdown */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Subject Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Curriculum distribution in your notes
          </p>

          <div className="space-y-3">
            {Object.entries(subjectCounts).map(([subject, count]) => {
              const color = SUBJECT_COLORS[subject as any] || SUBJECT_COLORS["General Knowledge"];
              const pct = Math.round((count / Math.max(notes.length, 1)) * 100);

              return (
                <div key={subject} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {subject}
                    </span>
                    <span className="font-semibold text-slate-400">
                      {count} notes ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${color.accent}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GAMIFICATION / BADGES SECTION */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Student Badges & Achievements</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unlock academic milestones by making notes, maintaining study streaks, and acing tests.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
            {unlockedCount} / {achievements.length} Badges Unlocked
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
                badge.unlocked
                  ? "border-amber-200 bg-amber-50/20 dark:border-amber-900/50 dark:bg-amber-950/10 shadow-xs"
                  : "border-slate-200/70 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl flex-shrink-0 shadow-xs ${
                    badge.unlocked
                      ? "bg-amber-100 dark:bg-amber-950/70 text-amber-600"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {badge.title}
                    </h4>
                    {badge.unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        <Lock className="h-3 w-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {badge.description}
                  </p>
                  {badge.unlockedAt && (
                    <span className="block text-[10px] text-slate-400 mt-2">
                      Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Recent Academic Activity</span>
        </h3>

        <div className="space-y-3">
          {quizHistory.slice(0, 3).map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="h-4 w-4 text-amber-500" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Completed Quiz: {q.topic}
                  </span>
                  <span className="text-slate-400 block">
                    {q.subject} • {q.scorePercentage}% Score ({q.correctAnswers}/{q.totalQuestions})
                  </span>
                </div>
              </div>
              <span className="text-slate-400 font-medium">
                {new Date(q.completedAt).toLocaleDateString()}
              </span>
            </div>
          ))}

          {notes.slice(0, 2).map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Created Note: {n.title}
                  </span>
                  <span className="text-slate-400 block">{n.subject}</span>
                </div>
              </div>
              <span className="text-slate-400 font-medium">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
