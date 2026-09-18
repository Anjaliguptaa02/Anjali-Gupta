import React, { useState, useEffect } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { QuizQuestion, QuizResult } from "../types";
import { formatSecondsToTime } from "../utils/storage";
import { playChime } from "../utils/audio";

interface QuizPlayerProps {
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  subject,
  topic,
  difficulty,
  questions,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(questions.length * 60); // 1 minute per question

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playChime("alert");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    playChime("complete");

    let correctCount = 0;
    const userAnswers = questions.map((q, idx) => {
      const chosen = selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1;
      const isCorrect = chosen === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        questionText: q.question,
        selectedOption: chosen,
        correctAnswer: q.correctAnswer,
        options: q.options,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);

    const result: QuizResult = {
      id: `quiz-res-${Date.now()}`,
      subject,
      topic,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      scorePercentage: scorePct,
      timeTakenSeconds: secondsElapsed,
      completedAt: new Date().toISOString(),
      difficulty,
      userAnswers,
    };

    onComplete(result);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div id="quiz-player-container" className="max-w-3xl mx-auto space-y-6">
      {/* Top Status Bar: Quiz Header, Timer & Exit */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            {subject} • {difficulty}
          </span>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {topic}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Countdown Clock */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Clock className={`h-4 w-4 ${timeRemaining < 60 ? "text-rose-500 animate-pulse" : "text-indigo-600 dark:text-indigo-400"}`} />
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              <span className={timeRemaining < 60 ? "text-rose-600 dark:text-rose-400" : ""}>
                {formatSecondsToTime(timeRemaining)}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to exit? Your progress won't be saved.")) {
                onExit();
              }
            }}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Pill Track */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>
            {answeredCount} of {questions.length} Answered
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {questions.map((_, i) => {
            const isAnswered = selectedAnswers[i] !== undefined;
            const isCurrent = i === currentIndex;
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 flex-1 min-w-[20px] rounded-full transition-all ${
                  isCurrent
                    ? "bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600"
                    : isAnswered
                    ? "bg-indigo-300 dark:bg-indigo-700"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Current Question Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-sm font-extrabold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex-shrink-0">
            {currentIndex + 1}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="grid gap-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedAnswers[currentIndex] === optIdx;
            return (
              <button
                key={optIdx}
                id={`quiz-option-${optIdx}`}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/30 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-100"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm font-medium">{option}</span>
                </div>

                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons: Previous, Next, Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            id="quiz-prev-btn"
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrevious}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIndex < questions.length - 1 ? (
              <button
                id="quiz-next-btn"
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                id="quiz-submit-btn"
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-105"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
