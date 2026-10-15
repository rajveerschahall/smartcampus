import React, { useState, useEffect } from "react";
import { Search, X, Calendar, BookOpen, User, Trophy, ShieldCheck, ArrowRight, Sun, Moon, LogOut } from "lucide-react";
import { SUBJECTS, FACULTY, EVENTS, DEMO_USERS, User as UserModel } from "./data";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onSwitchUser: (user: UserModel) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate, onSwitchUser, dark, setDark }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const pages = [
    { id: "dashboard", title: "Dashboard", category: "Navigation", desc: "Overview & summary" },
    { id: "timetable", title: "Timetable", category: "Navigation", desc: "Weekly period schedule" },
    { id: "attendance", title: "Attendance & Bunk Calc", category: "Navigation", desc: "Subject percentages & calculations" },
    { id: "marks", title: "Marks & Grades", category: "Navigation", desc: "MST scores & SGPA progress" },
    { id: "assignments", title: "Assignments Portal", category: "Navigation", desc: "Coursework submissions" },
    { id: "appointments", title: "1-on-1 Appointments", category: "Navigation", desc: "Faculty consultation slots" },
    { id: "events", title: "Campus Events & Passes", category: "Navigation", desc: "Hackathons & dynamic QR passes" },
    { id: "team", title: "Team Builder", category: "Navigation", desc: "Find hackathon teammates" },
    { id: "dl", title: "Duty Leave (DL)", category: "Navigation", desc: "Attendance waiver requests" },
    { id: "certs", title: "E-Certificates Vault", category: "Navigation", desc: "Verifiable digital credentials" },
    { id: "xp", title: "XP & Leaderboard", category: "Navigation", desc: "Badges and student ranks" },
    { id: "settings", title: "Account Settings", category: "Navigation", desc: "Alerts and profile" },
  ];

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));

  const filteredSubjects = Object.entries(SUBJECTS).filter(
    ([code, name]) => code.toLowerCase().includes(q) || name.toLowerCase().includes(q)
  );

  const filteredFaculty = FACULTY.filter(f => f.toLowerCase().includes(q));

  const filteredEvents = EVENTS.filter(e => e.title.toLowerCase().includes(q));

  const handleSelectPage = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, page name, subject or professor..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="rounded border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Pages */}
          {filteredPages.length > 0 && (
            <div>
              <span className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Modules & Pages
              </span>
              <div className="space-y-0.5 mt-1">
                {filteredPages.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPage(p.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm block">
                        {p.title}
                      </span>
                      <span className="text-slate-500 text-xs">{p.desc}</span>
                    </div>
                    <ArrowRight size={14} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <span className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quick Actions & Personas
            </span>
            <div className="space-y-0.5 mt-1">
              <button
                onClick={() => {
                  setDark(!dark);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  {dark ? <Sun size={15} /> : <Moon size={15} />}
                  Toggle Theme ({dark ? "Light" : "Dark"})
                </span>
                <span className="text-slate-400 text-[11px]">Instant switch</span>
              </button>

              {DEMO_USERS.map(u => (
                <button
                  key={u.role}
                  onClick={() => {
                    onSwitchUser(u);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <User size={14} className="text-indigo-500" />
                    Switch User: <b>{u.name}</b> ({u.role})
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold">Switch Persona</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subjects matching */}
          {filteredSubjects.length > 0 && query.trim() !== "" && (
            <div>
              <span className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Matching Courses
              </span>
              <div className="space-y-0.5 mt-1">
                {filteredSubjects.map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => handleSelectPage("attendance")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">{name}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{code}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">View Attendance →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
