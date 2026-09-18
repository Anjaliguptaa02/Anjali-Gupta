import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  HelpCircle,
  BarChart3,
  Search,
  Moon,
  Sun,
  Bell,
  User,
  Menu,
  X,
  Timer as TimerIcon,
  Flame,
  FileText,
  Bot,
} from "lucide-react";
import { ActiveTab, AppNotification, NotificationItem, UserProfile } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  theme?: "light" | "dark";
  toggleTheme?: () => void;
  openSearch?: () => void;
  onOpenSearch?: () => void;
  openAuth?: () => void;
  onOpenAuthModal?: () => void;
  user?: UserProfile;
  profile?: UserProfile;
  userName?: string;
  streakDays?: number;
  notifications?: (AppNotification | NotificationItem)[];
  markNotificationRead?: (id: string) => void;
  onMarkNotificationsRead?: () => void;
  clearAllNotifications?: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  theme,
  toggleTheme,
  openSearch,
  onOpenSearch,
  openAuth,
  onOpenAuthModal,
  user,
  profile,
  userName,
  streakDays,
  notifications = [],
  markNotificationRead,
  onMarkNotificationsRead,
  clearAllNotifications,
  isAuthenticated = true,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Safe user resolution
  const activeUser: UserProfile = user || profile || {
    name: userName || "Student Scholar",
    email: "student@studybuddy.ai",
    avatarUrl: "",
    gradeOrCourse: "Grade 12 — STEM & Pre-Engineering",
    currentStreakDays: streakDays ?? 6,
    dailyStudyGoalHours: 4,
    preferredSubjects: [],
    todayStudiedMinutes: 165,
    totalStudyHours: 42.5,
    lastStudyDate: new Date().toISOString().split("T")[0],
    pomodoroSessionsCompleted: 14,
  };

  const currentStreak = activeUser.currentStreakDays ?? streakDays ?? 6;
  const currentTheme = isDarkMode !== undefined ? (isDarkMode ? "dark" : "light") : theme || "light";

  const handleToggleTheme = () => {
    if (setIsDarkMode) {
      setIsDarkMode((prev) => !prev);
    } else if (toggleTheme) {
      toggleTheme();
    }
  };

  const handleSearch = onOpenSearch || openSearch || (() => {});
  const handleAuth = onOpenAuthModal || openAuth || (() => {});
  const handleClearNotifications = onMarkNotificationsRead || clearAllNotifications || (() => {});

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "home", label: "Home", icon: Sparkles },
    { id: "notes", label: "Notes", icon: BookOpen },
    { id: "quiz", label: "Quiz", icon: HelpCircle },
    { id: "planner", label: "Study Planner", icon: CheckSquare },
    { id: "assistant", label: "AI Assistant", icon: Bot },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <div
          id="nav-logo"
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                StudyBuddy
              </span>
              <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                AI
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 hidden sm:block">
              Study Smarter, Not Harder
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Search, Streak, Theme, Notifs, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            id="nav-search-btn"
            onClick={handleSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Search notes and tasks (Cmd + K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden md:inline rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Streak indicator badge */}
          <div
            id="nav-streak-badge"
            onClick={() => setActiveTab("progress")}
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50 cursor-pointer hover:scale-105 transition-transform"
            title="Current study streak"
          >
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{currentStreak}d Streak</span>
          </div>

          {/* Theme Toggle */}
          <button
            id="nav-theme-toggle"
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
          >
            {currentTheme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="nav-notifications-btn"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notifOpen && (
              <div
                id="notifications-panel"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                      {unreadCount} new
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearNotifications}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 my-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead && markNotificationRead(notif.id)}
                        className={`py-3 px-2 flex items-start gap-3 rounded-lg cursor-pointer transition-colors ${
                          notif.read
                            ? "opacity-60 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                            : "bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50"
                        }`}
                      >
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{notif.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {notif.time || (notif as any).timestamp || "Recent"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                id="nav-user-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 pl-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">
                  {activeUser.name ? activeUser.name.split(" ")[0] : "Student"}
                </span>
                {activeUser.avatarUrl ? (
                  <img
                    src={activeUser.avatarUrl}
                    alt={activeUser.name || "Student Avatar"}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-600/30"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-xs">
                    {(activeUser.name || "S").charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userDropdownOpen && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {activeUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{activeUser.email}</p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                      {activeUser.gradeOrCourse}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab("profile");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg text-left"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Student Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("progress");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg text-left"
                    >
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      <span>Progress & Badges</span>
                    </button>
                    <button
                      onClick={() => {
                        if (onLogout) onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-left"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={handleAuth}
              className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab("profile");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("ai-notes");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 text-xs font-bold"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>AI Note Maker</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
