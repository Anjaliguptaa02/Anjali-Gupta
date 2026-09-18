import React, { useState, useEffect } from "react";
import {
  ActiveTab,
  Note,
  StudyTask,
  UpcomingExam,
  QuizResult,
  UserProfile,
  UserStats,
  Achievement,
  NotificationItem,
} from "./types";
import {
  loadFromStorage,
  saveToStorage,
  DEFAULT_NOTES_KEY,
  DEFAULT_TASKS_KEY,
  DEFAULT_STATS_KEY,
  DEFAULT_PROFILE_KEY,
  DEFAULT_ACHIEVEMENTS_KEY,
  DEFAULT_QUIZ_HISTORY_KEY,
  DEFAULT_NOTIFICATIONS_KEY,
  DEFAULT_THEME_KEY,
  resetStorageToDefaults,
} from "./utils/storage";
import {
  SAMPLE_NOTES,
  SAMPLE_TASKS,
  SAMPLE_UPCOMING_EXAMS,
  SAMPLE_ACHIEVEMENTS,
  SAMPLE_QUIZ_RESULTS,
  SAMPLE_NOTIFICATIONS,
  DEFAULT_STUDENT_PROFILE,
  DEFAULT_USER_STATS,
} from "./data/sampleData";
import { Navbar } from "./components/Navbar";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { DashboardView } from "./components/DashboardView";
import { NotesSection } from "./components/NotesSection";
import { AINoteMaker } from "./components/AINoteMaker";
import { QuizSection } from "./components/QuizSection";
import { StudyPlanner } from "./components/StudyPlanner";
import { StudyBotChat } from "./components/StudyBotChat";
import { ProgressSection } from "./components/ProgressSection";
import { ProfileSection } from "./components/ProfileSection";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { AuthModal } from "./components/AuthModal";
import { NoteModal } from "./components/NoteModal";
import { playChime } from "./utils/audio";

export default function App() {
  // App state with local persistence
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage<UserProfile>(DEFAULT_PROFILE_KEY, DEFAULT_STUDENT_PROFILE)
  );

  const [stats, setStats] = useState<UserStats>(() =>
    loadFromStorage<UserStats>(DEFAULT_STATS_KEY, DEFAULT_USER_STATS)
  );

  const [notes, setNotes] = useState<Note[]>(() =>
    loadFromStorage<Note[]>(DEFAULT_NOTES_KEY, SAMPLE_NOTES)
  );

  const [tasks, setTasks] = useState<StudyTask[]>(() =>
    loadFromStorage<StudyTask[]>(DEFAULT_TASKS_KEY, SAMPLE_TASKS)
  );

  const [exams] = useState<UpcomingExam[]>(SAMPLE_UPCOMING_EXAMS);

  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    loadFromStorage<Achievement[]>(DEFAULT_ACHIEVEMENTS_KEY, SAMPLE_ACHIEVEMENTS)
  );

  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() =>
    loadFromStorage<QuizResult[]>(DEFAULT_QUIZ_HISTORY_KEY, SAMPLE_QUIZ_RESULTS)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage<NotificationItem[]>(DEFAULT_NOTIFICATIONS_KEY, SAMPLE_NOTIFICATIONS)
  );

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(DEFAULT_THEME_KEY);
    return saved === "dark";
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState<Note | null>(null);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem(DEFAULT_THEME_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(DEFAULT_THEME_KEY, "light");
    }
  }, [isDarkMode]);

  // Persist core data whenever state updates
  useEffect(() => {
    saveToStorage(DEFAULT_PROFILE_KEY, profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage(DEFAULT_STATS_KEY, stats);
  }, [stats]);

  useEffect(() => {
    saveToStorage(DEFAULT_NOTES_KEY, notes);
  }, [notes]);

  useEffect(() => {
    saveToStorage(DEFAULT_TASKS_KEY, tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage(DEFAULT_ACHIEVEMENTS_KEY, achievements);
  }, [achievements]);

  useEffect(() => {
    saveToStorage(DEFAULT_QUIZ_HISTORY_KEY, quizHistory);
  }, [quizHistory]);

  useEffect(() => {
    saveToStorage(DEFAULT_NOTIFICATIONS_KEY, notifications);
  }, [notifications]);

  // Keyboard shortcut: CMD+K or CTRL+K opens global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check achievements unlocker helper
  const unlockAchievement = (badgeId: string) => {
    setAchievements((prev) =>
      prev.map((badge) => {
        if (badge.id === badgeId && !badge.unlocked) {
          playChime("complete");
          // Add in-app notification
          const newNotification: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: `🏆 Badge Unlocked: ${badge.title}`,
            message: badge.description,
            time: "Just now",
            read: false,
            type: "achievement",
          };
          setNotifications((nList) => [newNotification, ...nList]);
          return {
            ...badge,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          };
        }
        return badge;
      })
    );
  };

  // Handlers for Notes
  const handleAddNote = (newNote: Note) => {
    setNotes((prev) => [newNote, ...prev]);
    unlockAchievement("first-note");
  };

  const handleUpdateNote = (updated: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (modalNote?.id === id) setModalNote(null);
    }
  };

  const handleToggleNoteFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  // Handlers for Study Tasks
  const handleAddTask = (taskData: Omit<StudyTask, "id">) => {
    const newTask: StudyTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" }
          : t
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers for Pomodoro Session Completion
  const handlePomodoroComplete = (minutesStudied: number) => {
    const hoursAdded = Number((minutesStudied / 60).toFixed(1));
    setStats((prev) => {
      const updatedTotal = Number((prev.totalStudyHours + hoursAdded).toFixed(1));
      const updatedToday = Number((prev.todayStudyHours + hoursAdded).toFixed(1));
      const updatedWeekly = prev.weeklyStudyHours.map((item, idx) =>
        idx === prev.weeklyStudyHours.length - 1
          ? { ...item, hours: Number((item.hours + hoursAdded).toFixed(1)) }
          : item
      );
      return {
        ...prev,
        totalStudyHours: updatedTotal,
        todayStudyHours: updatedToday,
        weeklyStudyHours: updatedWeekly,
      };
    });

    // Check night owl badge (if after 8 PM = hour >= 20)
    const currentHour = new Date().getHours();
    if (currentHour >= 20 || currentHour < 5) {
      unlockAchievement("night-owl");
    }
  };

  // Handlers for Quiz Completion
  const handleSaveQuizResult = (result: QuizResult) => {
    setQuizHistory((prev) => [result, ...prev]);

    setStats((prev) => {
      const newTotal = prev.quizzesCompleted + 1;
      const newAccuracy = Math.round(
        (prev.quizAccuracy * prev.quizzesCompleted + result.scorePercentage) / newTotal
      );
      return {
        ...prev,
        quizzesCompleted: newTotal,
        quizAccuracy: newAccuracy,
      };
    });

    if (result.scorePercentage >= 80) {
      unlockAchievement("quiz-master");
    }
  };

  // Question asked to StudyBot
  const handleStudyBotQuestionAsked = () => {
    unlockAchievement("fast-learner");
  };

  // Demo Login & Sign Out
  const handleLoginSuccess = (userData: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...userData,
    }));
  };

  const handleLogout = () => {
    if (window.confirm("Log out of demo student session?")) {
      setIsAuthModalOpen(true);
    }
  };

  const handleResetAllData = () => {
    resetStorageToDefaults();
    setProfile(DEFAULT_STUDENT_PROFILE);
    setStats(DEFAULT_USER_STATS);
    setNotes(SAMPLE_NOTES);
    setTasks(SAMPLE_TASKS);
    setAchievements(SAMPLE_ACHIEVEMENTS);
    setQuizHistory(SAMPLE_QUIZ_RESULTS);
    setNotifications(SAMPLE_NOTIFICATIONS);
    setActiveTab("home");
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        user={profile}
        profile={profile}
        streakDays={stats.streakDays}
        notifications={notifications}
        onOpenSearch={() => setIsSearchOpen(true)}
        openSearch={() => setIsSearchOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        openAuth={() => setIsAuthModalOpen(true)}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        clearAllNotifications={handleMarkNotificationsRead}
        isAuthenticated={true}
        onLogout={handleLogout}
      />

      {/* Main Content View with Active Tab Switcher */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        {activeTab === "home" && (
          <DashboardView
            profile={profile}
            stats={stats}
            notes={notes}
            tasks={tasks}
            exams={exams}
            quizHistory={quizHistory}
            setActiveTab={setActiveTab}
            onSelectNote={(note) => setModalNote(note)}
            onToggleTask={handleToggleTask}
            onToggleNoteFavorite={handleToggleNoteFavorite}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === "notes" && (
          <NotesSection
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onToggleFavorite={handleToggleNoteFavorite}
            onNavigateToAINotes={() => setActiveTab("ai-notes")}
          />
        )}

        {activeTab === "ai-notes" && (
          <AINoteMaker
            onSaveGeneratedNote={handleAddNote}
            onNavigateToNotes={() => setActiveTab("notes")}
          />
        )}

        {activeTab === "quiz" && (
          <QuizSection
            quizHistory={quizHistory}
            onSaveQuizResult={handleSaveQuizResult}
            onBackToDashboard={() => setActiveTab("home")}
          />
        )}

        {activeTab === "planner" && (
          <StudyPlanner
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTaskStatus={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onSessionComplete={handlePomodoroComplete}
          />
        )}

        {activeTab === "assistant" && (
          <StudyBotChat onIncrementQuestionCount={handleStudyBotQuestionAsked} />
        )}

        {activeTab === "progress" && (
          <ProgressSection
            stats={stats}
            achievements={achievements}
            quizHistory={quizHistory}
            notes={notes}
          />
        )}

        {activeTab === "profile" && (
          <ProfileSection
            profile={profile}
            stats={stats}
            achievements={achievements}
            onUpdateProfile={setProfile}
            onLogout={handleLogout}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile/tablets) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notes={notes}
        tasks={tasks}
        onSelectNote={(note) => setModalNote(note)}
        setActiveTab={setActiveTab}
      />

      {/* Auth Modal (Login / Sign Up / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Single Note Reader/Editor Modal */}
      {modalNote && (
        <NoteModal
          note={modalNote}
          isOpen={Boolean(modalNote)}
          onClose={() => setModalNote(null)}
          onSave={(updated) => {
            handleUpdateNote(updated);
            setModalNote(null);
          }}
          onDelete={handleDeleteNote}
          onToggleFavorite={handleToggleNoteFavorite}
        />
      )}
    </div>
  );
}
