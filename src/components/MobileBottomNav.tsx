import React from "react";
import { Home, BookOpen, HelpCircle, Calendar, User } from "lucide-react";
import { ActiveTab } from "../types";

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "notes", label: "Notes", icon: BookOpen },
    { id: "quiz", label: "Quiz", icon: HelpCircle },
    { id: "planner", label: "Planner", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <div className={`relative p-1 rounded-lg ${isActive ? "bg-indigo-50 dark:bg-indigo-950/60" : ""}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] leading-none tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
