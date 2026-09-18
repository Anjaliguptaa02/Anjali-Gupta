import React, { useState } from "react";
import {
  HelpCircle,
  Play,
  Sparkles,
  Trophy,
  Clock,
  History,
  CheckCircle2,
  BookOpen,
  Filter,
} from "lucide-react";
import { QuizQuestion, QuizResult, SubjectType } from "../types";
import { SAMPLE_QUIZZES } from "../data/sampleData";
import { QuizPlayer } from "./QuizPlayer";
import { QuizResultsView } from "./QuizResultsView";
import { AIQuizGenerator } from "./AIQuizGenerator";
import { formatSecondsToTime } from "../utils/storage";

interface QuizSectionProps {
  quizHistory: QuizResult[];
  onSaveQuizResult: (result: QuizResult) => void;
  onBackToDashboard: () => void;
  initialLaunchConfig?: {
    subject: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    questions: QuizQuestion[];
  } | null;
}

const ALL_SUBJECTS: SubjectType[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "General Knowledge",
];

export const QuizSection: React.FC<QuizSectionProps> = ({
  quizHistory,
  onSaveQuizResult,
  onBackToDashboard,
  initialLaunchConfig,
}) => {
  // Navigation tabs within Quiz: "presets", "custom", "ai-generator", "history"
  const [activeQuizTab, setActiveQuizTab] = useState<"presets" | "ai-generator" | "history">("presets");

  // Custom configuration states
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>("Physics");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [selectedCount, setSelectedCount] = useState<number>(5);

  // Active quiz session states
  const [activeSession, setActiveSession] = useState<{
    subject: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    questions: QuizQuestion[];
  } | null>(initialLaunchConfig || null);

  const [activeResult, setActiveResult] = useState<QuizResult | null>(null);

  const handleStartPreset = (quizKey: string) => {
    const preset = SAMPLE_QUIZZES[quizKey];
    if (preset) {
      setActiveResult(null);
      setActiveSession({
        subject: preset.subject,
        topic: preset.topic,
        difficulty: preset.difficulty,
        questions: preset.questions,
      });
    }
  };

  const handleStartCustomQuiz = () => {
    // Pick or filter questions matching subject and difficulty or fallback to available
    const allSampleQuestions: QuizQuestion[] = [];
    Object.values(SAMPLE_QUIZZES).forEach((q) => {
      if (q.subject === selectedSubject) {
        allSampleQuestions.push(...q.questions);
      }
    });

    // Fallback if none match exactly
    const pool = allSampleQuestions.length > 0 ? allSampleQuestions : SAMPLE_QUIZZES["physics-1"].questions;
    const questionsToTake = pool.slice(0, selectedCount);

    setActiveResult(null);
    setActiveSession({
      subject: selectedSubject,
      topic: `${selectedSubject} Practice Quiz`,
      difficulty: selectedDifficulty,
      questions: questionsToTake,
    });
  };

  const handleStartAIGenerated = (
    subject: string,
    topic: string,
    difficulty: "Easy" | "Medium" | "Hard",
    questions: QuizQuestion[]
  ) => {
    setActiveResult(null);
    setActiveSession({
      subject,
      topic,
      difficulty,
      questions,
    });
  };

  const handleQuizComplete = (result: QuizResult) => {
    onSaveQuizResult(result);
    setActiveSession(null);
    setActiveResult(result);
  };

  const handleTryAgain = () => {
    if (activeResult) {
      // Find matching preset or recreate session
      const sample = Object.values(SAMPLE_QUIZZES).find(
        (s) => s.topic === activeResult.topic
      );
      if (sample) {
        setActiveResult(null);
        setActiveSession({
          subject: sample.subject,
          topic: sample.topic,
          difficulty: sample.difficulty,
          questions: sample.questions,
        });
      } else if (activeResult.userAnswers) {
        // Recreate from userAnswers
        const restoredQuestions: QuizQuestion[] = activeResult.userAnswers.map((ua) => ({
          id: ua.questionId,
          question: ua.questionText,
          options: ua.options,
          correctAnswer: ua.correctAnswer,
          explanation: ua.explanation,
        }));
        setActiveResult(null);
        setActiveSession({
          subject: activeResult.subject,
          topic: activeResult.topic,
          difficulty: activeResult.difficulty,
          questions: restoredQuestions,
        });
      }
    }
  };

  // If in active quiz gameplay
  if (activeSession) {
    return (
      <QuizPlayer
        subject={activeSession.subject}
        topic={activeSession.topic}
        difficulty={activeSession.difficulty}
        questions={activeSession.questions}
        onComplete={handleQuizComplete}
        onExit={() => setActiveSession(null)}
      />
    );
  }

  // If viewing quiz results
  if (activeResult) {
    return (
      <QuizResultsView
        result={activeResult}
        onTryAgain={handleTryAgain}
        onBackToDashboard={onBackToDashboard}
      />
    );
  }

  return (
    <div id="quiz-section-container" className="space-y-8 max-w-6xl mx-auto">
      {/* Quiz Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Quiz & Assessment Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test your knowledge, review explanations, and practice under timed exam conditions.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800 self-start">
          <button
            onClick={() => setActiveQuizTab("presets")}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeQuizTab === "presets"
                ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Practice Tests
          </button>
          <button
            onClick={() => setActiveQuizTab("ai-generator")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeQuizTab === "ai-generator"
                ? "bg-white text-purple-600 shadow-xs dark:bg-slate-900 dark:text-purple-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Generator</span>
          </button>
          <button
            onClick={() => setActiveQuizTab("history")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeQuizTab === "history"
                ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>History ({quizHistory.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRESETS & CUSTOM CONFIG */}
      {activeQuizTab === "presets" && (
        <div className="space-y-8">
          {/* Quick Custom Builder Form */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Configure a Custom Practice Quiz</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as SubjectType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {ALL_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Question Count
                </label>
                <select
                  value={selectedCount}
                  onChange={(e) => setSelectedCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value={3}>3 Questions (Express)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={10}>10 Questions (Comprehensive)</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end">
              <button
                id="start-custom-quiz-btn"
                onClick={handleStartCustomQuiz}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-105"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Start Practice Quiz</span>
              </button>
            </div>
          </div>

          {/* Preset Subject Quizzes Grid */}
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              Curated Curriculum Practice Tests
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(SAMPLE_QUIZZES).map(([key, qz]) => (
                <div
                  key={key}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {qz.subject}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {qz.difficulty}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {qz.topic}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {qz.questions.length} questions • ~{qz.questions.length} minutes
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      id={`preset-quiz-${key}`}
                      onClick={() => handleStartPreset(key)}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Take Test</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI QUIZ GENERATOR */}
      {activeQuizTab === "ai-generator" && (
        <AIQuizGenerator onStartQuizWithQuestions={handleStartAIGenerated} />
      )}

      {/* TAB 3: QUIZ HISTORY */}
      {activeQuizTab === "history" && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Completed Quiz History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All saved quiz scores and performance metrics are stored locally.
              </p>
            </div>
          </div>

          {quizHistory.length === 0 ? (
            <div className="py-12 text-center">
              <Trophy className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No quizzes completed yet
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Take a practice test or generate one with AI to track your mastery.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {quizHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveResult(item)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.topic}
                      </h4>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{new Date(item.completedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{formatSecondsToTime(item.timeTakenSeconds)} taken</span>
                      <span>•</span>
                      <span>{item.correctAnswers} / {item.totalQuestions} Correct</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-lg font-extrabold ${
                          item.scorePercentage >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : item.scorePercentage >= 60
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {item.scorePercentage}%
                      </span>
                      <span className="block text-[10px] text-slate-400">Score</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      View Review →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
