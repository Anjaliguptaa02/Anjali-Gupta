import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  LayoutDashboard,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { QuizResult } from "../types";
import { formatSecondsToTime } from "../utils/storage";

interface QuizResultsViewProps {
  result: QuizResult;
  onTryAgain: () => void;
  onBackToDashboard: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  result,
  onTryAgain,
  onBackToDashboard,
}) => {
  const isHighScorer = result.scorePercentage >= 80;

  useEffect(() => {
    if (isHighScorer) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isHighScorer]);

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: "Grade A+ (Outstanding!)", color: "text-emerald-600 dark:text-emerald-400" };
    if (pct >= 80) return { label: "Grade A (Excellent Work)", color: "text-indigo-600 dark:text-indigo-400" };
    if (pct >= 70) return { label: "Grade B (Good Effort)", color: "text-blue-600 dark:text-blue-400" };
    if (pct >= 50) return { label: "Grade C (Keep Practicing)", color: "text-amber-600 dark:text-amber-400" };
    return { label: "Needs Review", color: "text-rose-600 dark:text-rose-400" };
  };

  const grade = getGrade(result.scorePercentage);

  return (
    <div id="quiz-results-view" className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3">
      {/* Score Summary Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/25">
          <Trophy className="h-10 w-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Quiz Completed!
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {result.topic} • {result.subject}
        </p>
        <p className={`mt-2 text-base font-extrabold ${grade.color}`}>
          {grade.label}
        </p>

        {/* Metric Badges Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Score
            </span>
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {result.correctAnswers}/{result.totalQuestions}
            </span>
          </div>

          <div className="rounded-2xl bg-emerald-50/70 p-4 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Correct</span>
            </div>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {result.correctAnswers}
            </span>
          </div>

          <div className="rounded-2xl bg-rose-50/70 p-4 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              <XCircle className="h-3.5 w-3.5" />
              <span>Wrong</span>
            </div>
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {result.wrongAnswers}
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" />
              <span>Time</span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatSecondsToTime(result.timeTakenSeconds)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            id="try-again-btn"
            onClick={onTryAgain}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-105"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <button
            id="back-to-dashboard-btn"
            onClick={onBackToDashboard}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Answer Explanations Review */}
      {result.userAnswers && result.userAnswers.length > 0 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>Detailed Answer Explanations</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Review all {result.userAnswers.length} questions
            </span>
          </div>

          <div className="space-y-6">
            {result.userAnswers.map((ans, idx) => (
              <div
                key={ans.questionId || idx}
                className={`rounded-2xl p-5 border transition-colors ${
                  ans.isCorrect
                    ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/50 dark:bg-emerald-950/10"
                    : "border-rose-200 bg-rose-50/20 dark:border-rose-900/50 dark:bg-rose-950/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {ans.questionText}
                    </h4>
                  </div>
                  {ans.isCorrect ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
                      <Check className="h-3 w-3" />
                      <span>Correct</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex-shrink-0">
                      <X className="h-3 w-3" />
                      <span>Incorrect</span>
                    </span>
                  )}
                </div>

                {/* Options list */}
                <div className="grid gap-2 sm:grid-cols-2 my-3">
                  {ans.options.map((opt, optIdx) => {
                    const isUserChoice = ans.selectedOption === optIdx;
                    const isRightChoice = ans.correctAnswer === optIdx;

                    let optStyle = "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
                    if (isRightChoice) {
                      optStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-600";
                    } else if (isUserChoice && !ans.isCorrect) {
                      optStyle = "border-rose-500 bg-rose-50 text-rose-900 line-through dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-600";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center justify-between rounded-xl border p-2.5 text-xs ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isRightChoice && (
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-2" />
                        )}
                        {isUserChoice && !ans.isCorrect && (
                          <X className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {ans.explanation && (
                  <div className="mt-3 rounded-xl bg-slate-100/80 p-3 text-xs text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-700/60">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      Explanation:
                    </strong>
                    {ans.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
