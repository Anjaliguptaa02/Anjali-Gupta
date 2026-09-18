export type SubjectType =
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "Computer Science"
  | "English"
  | "General Knowledge";

export const SUBJECT_COLORS: Record<SubjectType, { bg: string; text: string; border: string; badge: string }> = {
  "Mathematics": {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  },
  "Physics": {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  },
  "Chemistry": {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  "Computer Science": {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
  },
  "English": {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  },
  "General Knowledge": {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  },
};

export interface Note {
  id: string;
  title: string;
  subject: SubjectType;
  content: string;
  explanation?: string;
  importantPoints?: string[];
  definitions?: { term: string; definition: string }[];
  keyTerms?: string[];
  summary?: string;
  examples?: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
}

export interface QuizResult {
  id: string;
  subject: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  userAnswers: {
    questionId: string;
    questionText: string;
    selectedOption: number;
    correctAnswer: number;
    options: string[];
    isCorrect: boolean;
    explanation: string;
  }[];
}

export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface StudyTask {
  id: string;
  subject: SubjectType;
  topic: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  priority: TaskPriority;
  status: TaskStatus;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  iconName?: string;
  unlocked?: boolean;
  isUnlocked?: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  category?: "quiz" | "study" | "task" | "notes";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time?: string;
  timestamp?: string;
  read: boolean;
  type?: "task" | "quiz" | "goal" | "achievement" | "exam";
}

export type AppNotification = NotificationItem;

export interface UpcomingExam {
  id: string;
  subject: SubjectType;
  examName: string;
  date: string;
  daysRemaining: number;
}

export interface UserStats {
  totalStudyHours: number;
  todayStudyHours: number;
  streakDays: number;
  quizzesCompleted: number;
  quizAccuracy: number;
  weeklyStudyHours: { day: string; hours: number }[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  gradeOrCourse: string;
  preferredSubjects?: SubjectType[];
  dailyStudyGoalHours?: number;
  dailyGoalHours?: number;
  todayStudiedMinutes?: number;
  totalStudyHours?: number;
  currentStreakDays?: number;
  lastStudyDate?: string;
  pomodoroSessionsCompleted?: number;
  joinedDate?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export type ActiveTab =
  | "home"
  | "dashboard"
  | "notes"
  | "ai-notes"
  | "quiz"
  | "ai-quiz"
  | "planner"
  | "pomodoro"
  | "assistant"
  | "progress"
  | "achievements"
  | "profile";
