import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, Bell, Coffee, BookOpen } from "lucide-react";
import { playChime } from "../utils/audio";
import { formatSecondsToTime } from "../utils/storage";

interface PomodoroTimerProps {
  onSessionComplete?: (minutesStudied: number) => void;
}

type Mode = "study" | "shortBreak" | "longBreak";

const MODE_CONFIG = {
  study: { label: "Deep Study", minutes: 25, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
  shortBreak: { label: "Short Break", minutes: 5, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  longBreak: { label: "Long Break", minutes: 15, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<Mode>("study");
  const [timeLeft, setTimeLeft] = useState<number>(MODE_CONFIG.study.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  const initialDuration = MODE_CONFIG[mode].minutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((initialDuration - timeLeft) / initialDuration) * 100));

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      playChime("alert");

      if (mode === "study") {
        setCompletedCycles((c) => c + 1);
        if (onSessionComplete) {
          onSessionComplete(25);
        }
        // If 4 study sessions done, suggest long break
        if ((completedCycles + 1) % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
      } else {
        switchMode("study");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, completedCycles, onSessionComplete]);

  const switchMode = (newMode: Mode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIG[newMode].minutes * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODE_CONFIG[mode].minutes * 60);
  };

  return (
    <div id="pomodoro-timer-card" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-center">
      {/* Mode Selector Tabs */}
      <div className="inline-flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800 mb-6">
        <button
          onClick={() => switchMode("study")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            mode === "study"
              ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>25m Study</span>
        </button>
        <button
          onClick={() => switchMode("shortBreak")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            mode === "shortBreak"
              ? "bg-white text-emerald-600 shadow-xs dark:bg-slate-900 dark:text-emerald-400"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Coffee className="h-3.5 w-3.5" />
          <span>5m Short Break</span>
        </button>
        <button
          onClick={() => switchMode("longBreak")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            mode === "longBreak"
              ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Coffee className="h-3.5 w-3.5" />
          <span>15m Long Break</span>
        </button>
      </div>

      {/* Big Circular Clock Display */}
      <div className="relative mx-auto my-4 flex h-60 w-60 items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            className={`transition-all duration-500 ease-linear ${
              mode === "study"
                ? "stroke-indigo-600 dark:stroke-indigo-400"
                : mode === "shortBreak"
                ? "stroke-emerald-500 dark:stroke-emerald-400"
                : "stroke-blue-500 dark:stroke-blue-400"
            }`}
            strokeWidth="6"
            strokeDasharray={276.46}
            strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Clock Numbers */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
            {formatSecondsToTime(timeLeft)}
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${MODE_CONFIG[mode].color}`}>
            {MODE_CONFIG[mode].label}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          id="pomodoro-toggle-btn"
          onClick={toggleTimer}
          className={`flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 ${
            isActive
              ? "bg-amber-600 shadow-amber-600/20 hover:bg-amber-700"
              : "bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-700"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Start Timer</span>
            </>
          )}
        </button>

        <button
          id="pomodoro-reset-btn"
          onClick={resetTimer}
          title="Reset timer"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-xs"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={() => playChime("alert")}
          title="Test audio chime"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-xs"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      {/* Cycles Counter */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Bell className="h-3.5 w-3.5 text-slate-400" />
          <span>Sound alert chimes upon session completion</span>
        </div>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Cycles Completed: <strong>{completedCycles}</strong>
        </span>
      </div>
    </div>
  );
};
