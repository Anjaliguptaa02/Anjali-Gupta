import React, { useState } from "react";
import { X, Lock, Mail, User, Sparkles, CheckCircle2 } from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("Grade 12 — STEM & Pre-Engineering");
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      setResetSent(true);
      return;
    }

    onLoginSuccess({
      name: name.trim() || (mode === "signup" ? "Student Explorer" : "Anjali Gupta"),
      email: email.trim() || "anjali.student@studybuddy.ai",
      gradeOrCourse: grade,
    });
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      name: "Anjali Gupta",
      email: "anjali.student@studybuddy.ai",
      gradeOrCourse: "Grade 12 — STEM & Pre-Engineering",
    });
    onClose();
  };

  return (
    <div
      id="auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-3 shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {mode === "login" && "Welcome back to StudyBuddy"}
            {mode === "signup" && "Create your Student Account"}
            {mode === "forgot" && "Reset your password"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === "login" && "Log in to track study hours, notes, and quiz achievements."}
            {mode === "signup" && "Start mastering your subjects with AI-powered study tools."}
            {mode === "forgot" && "Enter your email address to receive recovery instructions."}
          </p>
        </div>

        {/* One-Click Quick Demo Login */}
        {mode !== "forgot" && (
          <div className="mb-5">
            <button
              type="button"
              id="quick-demo-login-btn"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 py-2.5 px-4 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300 transition-colors shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Continue with Demo Student Profile</span>
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-400 dark:bg-slate-900">or enter credentials</span>
              </div>
            </div>
          </div>
        )}

        {resetSent ? (
          <div className="rounded-2xl bg-emerald-50 p-6 text-center dark:bg-emerald-950/40">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400 mb-2" />
            <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Check your inbox</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
              We have sent a demo password reset link to {email || "your email"}.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setMode("login");
              }}
              className="mt-4 text-xs font-bold text-emerald-800 dark:text-emerald-300 underline"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grade or Academic Program
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. Grade 11 / Pre-Med"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              id="auth-submit-btn"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors mt-2"
            >
              {mode === "login" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {mode === "forgot" && "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Toggle Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
