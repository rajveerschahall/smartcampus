import React, { useState } from "react";
import { Bot, X, Send, Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";
import { ATTENDANCE, SUBJECTS, EVENTS, TIMETABLE } from "./data";
import { primary, ghost } from "./ui";

interface Message {
  sender: "bot" | "user";
  text: string;
  action?: { label: string; page: string };
}

export default function AiAssistantModal({
  isOpen,
  onClose,
  onNavigate
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Sat Sri Akal, Rajveer! I'm CampusGenie, your smart GGI AI assistant. How can I help you today with attendance, duty leaves, exams, or events?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "What is my attendance in PHP?",
    "When is my next class?",
    "How to apply for Duty Leave?",
    "Show upcoming hackathons"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { sender: "user", text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let botReply: Message = {
        sender: "bot",
        text: "I can assist you with your academic schedule, grades, duty leave or event registrations. Try clicking one of the suggested prompts!"
      };

      if (q.includes("php") || q.includes("ugca1929") || q.includes("attendance")) {
        botReply = {
          sender: "bot",
          text: "Your current attendance in Programming in PHP (UGCA1929) is 68.2% (15 out of 22 lectures attended). This is below the 75% examination threshold! You need to attend the next 3 consecutive lectures to reach 75%.",
          action: { label: "Open Bunk & Attendance Calculator", page: "attendance" }
        };
      } else if (q.includes("class") || q.includes("next") || q.includes("timetable") || q.includes("schedule")) {
        botReply = {
          sender: "bot",
          text: "Today you have Cloud Computing (UGCA1936) with Mr. Rahul Soni in Room B-205 at 12:40 PM, followed by Programming in Java with Ms. Anushka Mohal in Room B-104 at 2:30 PM.",
          action: { label: "View Full Week Timetable", page: "timetable" }
        };
      } else if (q.includes("duty") || q.includes("leave") || q.includes("dl")) {
        botReply = {
          sender: "bot",
          text: "To apply for Duty Leave: 1) Go to the Duty Leave Portal, 2) Select your event (e.g., Tech Fest), 3) Upload your ticket pass/invitation, 4) Submit for mentor & HOD verification. Approved DLs automatically update your biometric attendance!",
          action: { label: "Go to Duty Leave Portal", page: "dl" }
        };
      } else if (q.includes("hackathon") || q.includes("event") || q.includes("tech fest")) {
        botReply = {
          sender: "bot",
          text: "Tech Fest 2026 is coming up on October 15 in the Main Auditorium! Competitions include TechTalk Debate, Presentation & Type Master. Don't forget your dynamic HMAC QR ticket pass.",
          action: { label: "Open Event Portal", page: "events" }
        };
      } else if (q.includes("mst") || q.includes("grade") || q.includes("marks") || q.includes("sgpa")) {
        botReply = {
          sender: "bot",
          text: "Your cumulative CGPA is 8.57 with zero backlogs! Your predicted SGPA for Semester 5 is 8.85 based on your MST-I performance (21/24 in PHP, 23/24 in Java Lab). MST-II commences on 30 October 2026.",
          action: { label: "Check Detailed Scorecard", page: "marks" }
        };
      }

      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end p-4 sm:p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md h-[550px] rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-indigo-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">CampusGenie AI</h3>
              <p className="text-[11px] text-indigo-100">GGI Campus Intelligent Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
              {m.action && (
                <button
                  onClick={() => {
                    onNavigate(m.action!.page);
                    onClose();
                  }}
                  className="mt-1.5 inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-[11px]"
                >
                  {m.action.label} <ArrowRight size={12} />
                </button>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 max-w-[80px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Prompt Chips */}
        <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto bg-slate-50/60 dark:bg-slate-900/60 text-[11px]">
          {quickPrompts.map(p => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="shrink-0 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask CampusGenie anything..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
