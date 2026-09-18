import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  User,
  Copy,
  Check,
  BookOpen,
  ArrowDown,
  RotateCcw,
} from "lucide-react";
import { ChatMessage, SubjectType } from "../types";

interface StudyBotChatProps {
  currentSubject?: SubjectType;
  onIncrementQuestionCount?: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What is Newton's second law?",
  "Explain photosynthesis in simple words.",
  "Give me 10 questions about JavaScript.",
  "How do I remember the difference between Mitosis and Meiosis?",
  "Solve a quadratic equation step by step with an example.",
  "What is the difference between active and passive voice?",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-bot",
    role: "model",
    content: `Hello! 👋 I'm **StudyBot**, your dedicated AI learning companion.
    
Ask me any question about your classes, homework problems, math formulas, science concepts, or essay outlines. I'll explain things step-by-step in clear, student-friendly terms!

Try clicking one of the suggested questions below or type anything you're curious about! 🚀`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

export const StudyBotChat: React.FC<StudyBotChatProps> = ({
  currentSubject,
  onIncrementQuestionCount,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("studybuddy_chat_history_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MESSAGES;
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem("studybuddy_chat_history_v1", JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (onIncrementQuestionCount) {
      onIncrementQuestionCount();
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          subject: currentSubject,
        }),
      });

      if (!res.ok) {
        throw new Error("Could not reach StudyBot server.");
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        content: data.reply || "I'm sorry, I couldn't generate an answer right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: "model",
        content: "Oops! I hit a temporary network hiccup. Please try asking again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setMessages(INITIAL_MESSAGES);
      localStorage.removeItem("studybuddy_chat_history_v1");
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="studybot-chat-container" className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                StudyBot AI Assistant
              </h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Patient, step-by-step academic tutor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="clear-chat-btn"
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
            title="Clear Chat Conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold flex-shrink-0 shadow-xs ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 rounded-tr-none"
                    : "bg-slate-100/90 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                }`}
              >
                {/* Content formatting */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                <div
                  className={`mt-2 flex items-center justify-between gap-4 text-[10px] ${
                    isUser ? "text-indigo-200" : "text-slate-400"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing animation indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs flex-shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 p-4 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  StudyBot is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Carousel */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          <span>Suggested Questions:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(q)}
              className="flex-shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-2xs whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            id="studybot-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask StudyBot anything (e.g. 'Explain photosynthesis in simple words')..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            id="studybot-send-btn"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-all flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
