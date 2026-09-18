import React, { useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Target,
  Clock,
  Flame,
  Trophy,
  Save,
  LogOut,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { UserProfile, UserStats, Achievement } from "../types";

interface ProfileSectionProps {
  profile: UserProfile;
  stats: UserStats;
  achievements: Achievement[];
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  onResetAllData: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  stats,
  achievements,
  onUpdateProfile,
  onLogout,
  onResetAllData,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [grade, setGrade] = useState(profile.gradeOrCourse);
  const [dailyGoalHours, setDailyGoalHours] = useState(profile.dailyGoalHours);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim() || profile.name,
      email: email.trim() || profile.email,
      gradeOrCourse: grade.trim() || profile.gradeOrCourse,
      dailyGoalHours: Number(dailyGoalHours) || 3,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div id="profile-section-container" className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-3xl font-extrabold text-white shadow-lg shadow-indigo-500/25">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {profile.name}
              </h1>
              <span className="inline-flex items-center gap-1 self-center sm:self-auto rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Level 4 Scholar</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.email} • {profile.gradeOrCourse}
            </p>
            <p className="text-xs text-slate-400">
              Member since {new Date(profile.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-xs text-slate-400 block font-medium">Study Streak</span>
            <span className="text-xl font-extrabold text-amber-500">
              🔥 {stats.streakDays} Days
            </span>
          </div>

          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-xs text-slate-400 block font-medium">Study Hours</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {stats.totalStudyHours}h
            </span>
          </div>

          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-xs text-slate-400 block font-medium">Quiz Accuracy</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.quizAccuracy}%
            </span>
          </div>

          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-xs text-slate-400 block font-medium">Badges</span>
            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
              {unlockedCount} / {achievements.length}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
          Student Preferences & Academic Goals
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Grade or Course Program
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Grade 12 — STEM & Pre-Engineering"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Daily Study Goal (Hours)
              </label>
              <input
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✓ Preferences updated successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Changes persist locally in your browser storage.
              </span>
            )}

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-105"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset Data or Sign Out */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Account Actions
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out (Switch Account)</span>
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Reset all notes, tasks, and quiz scores back to initial sample content?"
                )
              ) {
                onResetAllData();
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
