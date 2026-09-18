import {
  Note,
  StudyTask,
  Achievement,
  AppNotification,
  UserProfile,
  QuizResult,
} from "../types";
import {
  INITIAL_USER,
  INITIAL_NOTES,
  INITIAL_TASKS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_QUIZ_RESULTS,
} from "../data/sampleData";

const KEYS = {
  USER: "studybuddy_user_v1",
  NOTES: "studybuddy_notes_v1",
  TASKS: "studybuddy_tasks_v1",
  QUIZ_RESULTS: "studybuddy_quiz_results_v1",
  ACHIEVEMENTS: "studybuddy_achievements_v1",
  NOTIFICATIONS: "studybuddy_notifications_v1",
  THEME: "studybuddy_theme_v1",
  AUTH: "studybuddy_auth_v1",
};

export const Storage = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER;
  },

  saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  getNotes(): Note[] {
    try {
      const data = localStorage.getItem(KEYS.NOTES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTES;
  },

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  },

  getTasks(): StudyTask[] {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TASKS;
  },

  saveTasks(tasks: StudyTask[]): void {
    try {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  },

  getQuizResults(): QuizResult[] {
    try {
      const data = localStorage.getItem(KEYS.QUIZ_RESULTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_QUIZ_RESULTS;
  },

  saveQuizResult(result: QuizResult): QuizResult[] {
    try {
      const existing = Storage.getQuizResults();
      const updated = [result, ...existing];
      localStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify(updated));

      // Update user stats
      const user = Storage.getUser();
      user.totalStudyHours += Number((result.timeTakenSeconds / 3600).toFixed(2));
      Storage.saveUser(user);

      // Check for quiz achievements
      const achievements = Storage.getAchievements();
      const firstQuiz = achievements.find((a) => a.id === "ach-1");
      if (firstQuiz && !firstQuiz.isUnlocked) {
        firstQuiz.isUnlocked = true;
        firstQuiz.progress = 1;
        firstQuiz.unlockedAt = new Date().toISOString().split("T")[0];
      }
      const tenQuizzes = achievements.find((a) => a.id === "ach-3");
      if (tenQuizzes) {
        tenQuizzes.progress = updated.length;
        if (tenQuizzes.progress >= tenQuizzes.maxProgress && !tenQuizzes.isUnlocked) {
          tenQuizzes.isUnlocked = true;
          tenQuizzes.unlockedAt = new Date().toISOString().split("T")[0];
        }
      }
      Storage.saveAchievements(achievements);

      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ACHIEVEMENTS;
  },

  saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error(e);
    }
  },

  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  },

  saveNotifications(notifications: AppNotification[]): void {
    try {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  },

  getTheme(): "light" | "dark" {
    try {
      const theme = localStorage.getItem(KEYS.THEME);
      if (theme === "dark" || theme === "light") return theme;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (e) {
      console.error(e);
    }
    return "light";
  },

  saveTheme(theme: "light" | "dark"): void {
    try {
      localStorage.setItem(KEYS.THEME, theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      console.error(e);
    }
  },

  getAuth(): { isAuthenticated: boolean; user: { name: string; email: string } | null } {
    try {
      const data = localStorage.getItem(KEYS.AUTH);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {
      isAuthenticated: true, // logged in by default for immediate exploration
      user: {
        name: INITIAL_USER.name,
        email: INITIAL_USER.email,
      },
    };
  },

  saveAuth(auth: { isAuthenticated: boolean; user: { name: string; email: string } | null }): void {
    try {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(auth));
    } catch (e) {
      console.error(e);
    }
  },
};

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const DEFAULT_NOTES_KEY = KEYS.NOTES;
export const DEFAULT_TASKS_KEY = KEYS.TASKS;
export const DEFAULT_STATS_KEY = "studybuddy_stats_v1";
export const DEFAULT_PROFILE_KEY = KEYS.USER;
export const DEFAULT_ACHIEVEMENTS_KEY = KEYS.ACHIEVEMENTS;
export const DEFAULT_QUIZ_HISTORY_KEY = KEYS.QUIZ_RESULTS;
export const DEFAULT_NOTIFICATIONS_KEY = KEYS.NOTIFICATIONS;
export const DEFAULT_THEME_KEY = KEYS.THEME;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export function resetStorageToDefaults(): void {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem(DEFAULT_STATS_KEY);
  } catch (err) {
    console.error("Error clearing storage:", err);
  }
}

