import React, { useState, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Trash2,
  GraduationCap,
  Clock,
  Award,
  Users
} from "lucide-react";
import { ATTENDANCE, SUBJECTS, EVENTS, TIMETABLE, INITIAL_BORROWED_BOOKS, PLACEMENT_DRIVES, User as UserModel } from "./data";
import { primary, ghost, Pill } from "./ui";

interface Message {
  sender: "bot" | "user";
  text: string;
  action?: { label: string; page: string };
  badge?: string;
}

export default function AiAssistantModal({
  isOpen,
  onClose,
  onNavigate,
  user
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  user?: UserModel | null;
}) {
  const isFaculty = user?.role === "Faculty";

  const getInitialMessages = (): Message[] => {
    if (isFaculty) {
      return [
        {
          sender: "bot",
          text: `Sat Sri Akal, Prof. ${user?.name || "Navjot"}! I am CampusGenie, your Faculty ERP Copilot. I have live access to your BCA Section C timetable, 32 students attendance status, defaulters list, internal marks lock deadlines, and AICTE ATAL FDP records. How can I assist you with academic administration today?`,
          badge: `Faculty: ${user?.name || "MS. NAVJOT"} (EID 1708)`
        }
      ];
    }
    return [
      {
        sender: "bot",
        text: "Sat Sri Akal, Rajveer! I'm CampusGenie, your GGI Smart AI Assistant. I have live access to your attendance (82%), library books due, placement drives (Google ₹18 LPA), and assignment deadlines. How can I assist you right now?",
        badge: "Student: Rajveer Singh (BCA 3-C)"
      }
    ];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Re-initialize message context when persona switches
  useEffect(() => {
    setMessages(getInitialMessages());
  }, [user?.role, user?.email]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const facultyQuickPrompts = [
    "Aaj ke lectures aur room number?",
    "Attendance defaulters list (< 75%)",
    "Internal marks calculation formula",
    "FDP application status (ATAL AI Pune)",
    "Teacher adjustment / substitution slot"
  ];

  const studentQuickPrompts = [
    "Meri attendance kitni hai?",
    "Library book kab submit karni hai?",
    "Placement drive ki last date kab hai?",
    "Kal kaunsa exam ya class hai?",
    "Fine kitna lagega agar date nikal gayi?"
  ];

  const quickPrompts = isFaculty ? facultyQuickPrompts : studentQuickPrompts;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase().trim();
      let botReply: Message;

      if (isFaculty) {
        // --- FACULTY RESPONSES ---
        if (q.includes("lecture") || q.includes("class") || q.includes("room") || q.includes("schedule") || q.includes("aaj") || q.includes("today")) {
          botReply = {
            sender: "bot",
            text: "Prof. Navjot, aapka aaj ka institutional schedule:\n• Period 1 & 2: Programming in PHP Laboratory (Room C-201 • 09:30 AM – 11:00 AM)\n• Period 4: Software Engineering Theory (Room B-204 • 12:45 PM – 01:30 PM)\n• Period 6: Student Consultation & Doubt Desk (Cabin B-205 • 02:15 PM).\n\nTotal 4 periods assigned today.",
            action: { label: "View Weekly Schedule", page: "faculty-timetable" },
            badge: "Faculty Schedule"
          };
        } else if (q.includes("defaulter") || q.includes("attendance") || q.includes("shortage") || q.includes("75") || q.includes("absent")) {
          botReply = {
            sender: "bot",
            text: "⚠️ BCA Section C (32 Students) Defaulter Analysis:\nCurrently 3 students are below 75% examination eligibility:\n1) Prem Kumar (2433600) — 16/27 (59.3%)\n2) Raghav Sharma (2433610) — 17/27 (63.0%)\n3) Om Parkash (2433590) — 18/27 (66.7%)\n\nAutomated warning alerts have been logged, and student parent contact slips are available on the roster desk.",
            action: { label: "Open 32-Student Roster", page: "faculty-track-students" },
            badge: "Shortage Alert"
          };
        } else if (q.includes("mark") || q.includes("internal") || q.includes("mst") || q.includes("formula") || q.includes("calculate")) {
          botReply = {
            sender: "bot",
            text: "📊 Continuous Internal Assessment (40 Marks) Distribution Formula:\n• MST Score (24 Marks): Best of MST-I (24) & MST-II (24) normalized.\n• Practical/PDF Assignments (10 Marks): Evaluated out of 10 for timely submissions.\n• Classroom Attendance (6 Marks): Scale: ≥85% = 6M, ≥80% = 5M, ≥75% = 4M, <75% = 0M.\n\nLocked marks auto-sync with University ERP server.",
            action: { label: "Calculate & Enter Marks", page: "faculty-calculate-internal" },
            badge: "Assessment Guidelines"
          };
        } else if (q.includes("fdp") || q.includes("atal") || q.includes("research") || q.includes("pune") || q.includes("paper")) {
          botReply = {
            sender: "bot",
            text: "🎓 Your FDP & Research Application Portfolio:\n• AICTE ATAL FDP: 'Generative AI & LLM Systems' at PICT Pune (App ID: 1774003396) — Status: APPROVED (Duty Leave granted for 5 days offline).\n• Manipal University Jaipur FDP: Scheduled 18–22 Nov 2026.\n• Scopus Research Paper: Under review in IEEE Transactions on Learning Technologies.",
            action: { label: "Open FDP Tracker", page: "faculty-portal" },
            badge: "ATAL FDP Approved"
          };
        } else if (q.includes("adjustment") || q.includes("extra") || q.includes("leave") || q.includes("substitute") || q.includes("slot")) {
          botReply = {
            sender: "bot",
            text: "Aap Teacher Adjustment portal se kisi bhi colleague faculty (e.g. Mr. Rahul Soni ya Dr. Priya Dhir) ko substitute lecture delegate kar sakte hain, ya Saturday remedial extra lecture book kar sakte hain Room B-204 mein. Current Casual Leave Balance: 12 Days remaining.",
            action: { label: "Teacher Adjustment Desk", page: "faculty-teacher-adjustment" },
            badge: "HR & Staff"
          };
        } else {
          botReply = {
            sender: "bot",
            text: "Prof. Navjot, I can assist you with your 32-student attendance roster, MST micro-analysis, internal marks lock deadlines, extra lecture timetable adjustments, or ATAL FDP records. What would you like to review?",
            action: { label: "Open Faculty ERP Dashboard", page: "faculty-portal" }
          };
        }
      } else {
        // --- STUDENT RESPONSES ---
        if (
          q.includes("attendance") ||
          q.includes("hazri") ||
          q.includes("meri attendance") ||
          q.includes("bunk") ||
          q.includes("php attendance")
        ) {
          botReply = {
            sender: "bot",
            text: "Aapki overall biometric attendance 82.1% hai (147 out of 179 lectures attended). Programming in PHP mein 86% hai, lekin Cloud Computing (UGCA1936) mein 51.9% hai jo 75% examination threshold se neeche hai! 75% cross karne ke liye aapko agle 4 consecutive lectures attend karne honge.",
            action: { label: "Open Attendance & Bunk Calculator", page: "attendance" },
            badge: "Attendance Alert"
          };
        } else if (
          q.includes("library") ||
          q.includes("book") ||
          q.includes("kitab") ||
          q.includes("due date") ||
          q.includes("fine") ||
          q.includes("fees") ||
          q.includes("renew")
        ) {
          botReply = {
            sender: "bot",
            text: "📚 Aapke paas currently 2 books issued hain: \n1) 'Database System Concepts' ki due date 16 Oct 2026 hai (sirf 2 din bache hain!). \n2) 'Programming with PHP' ki due date 20 Oct 2026 hai. \n\n⚠️ Library Rule: Due date nikalne par ₹5/day penalty lagti hai. Lekin aap Library Portal par jaakar '1-Click Renew' kar sakte hain jisse 7 din aur mil jayenge aur bilkul koi extra fees nahi lagegi!",
            action: { label: "Open Library Portal (Renew Free)", page: "library" },
            badge: "Fee Prevention Warning"
          };
        } else if (
          q.includes("placement") ||
          q.includes("job") ||
          q.includes("drive") ||
          q.includes("package") ||
          q.includes("google") ||
          q.includes("tcs") ||
          q.includes("lpa")
        ) {
          botReply = {
            sender: "bot",
            text: "💼 Current active placement drives: \n• Google (SDE-1 • ₹18.0 LPA) — Last date: 18 Oct 2026 (Min 65% req) \n• TCS (Ninja/Digital • ₹4.5 - ₹7.2 LPA) — Last date: 22 Oct 2026 \n• Infosys (Specialist • ₹6.5 LPA) — Last date: 25 Oct 2026 \n\nAapka aggregate 78% hai isliye aap in sabhi mein eligible hain. Naye portal mein pehle Specialization Preference Form (Tech/Non-Tech • Full Stack / AI & ML) bharein aur 1-Click Apply karein!",
            action: { label: "Go to Placement Portal", page: "placement" },
            badge: "Recruitment Active"
          };
        } else if (
          q.includes("exam") ||
          q.includes("mst") ||
          q.includes("test") ||
          q.includes("datesheet") ||
          q.includes("marks")
        ) {
          botReply = {
            sender: "bot",
            text: "Mid-Semester Test II (MST-2) 30 Oct se 05 Nov 2026 tak schedule hai. Syllabus mein Unit III aur Unit IV aayenge. Model question banks ERP Study Material section mein upload ho chuke hain.",
            action: { label: "View ERP Study Materials", page: "study-materials" },
            badge: "Academic Calendar"
          };
        } else if (
          q.includes("class") ||
          q.includes("kal") ||
          q.includes("tomorrow") ||
          q.includes("lecture") ||
          q.includes("schedule") ||
          q.includes("timetable")
        ) {
          botReply = {
            sender: "bot",
            text: "Aapka schedule: Programming in PHP Laboratory with Ms. Navjot Kaur (Room C-201) Period 1 & 2 mein hai, followed by Software Engineering in Room B-104. Faculty se 15-min doubt clearing slot bhi book kar sakte hain.",
            action: { label: "Open Full Timetable", page: "timetable" }
          };
        } else if (
          q.includes("assignment") ||
          q.includes("upload") ||
          q.includes("pdf") ||
          q.includes("submit")
        ) {
          botReply = {
            sender: "bot",
            text: "Cloud Computing Assignment 3 submission portal khula hai (due in 18 hours). Naye portal mein drag-and-drop PDF upload hai (Max size 10MB). Upload ke baad instant verification receipt aur preview milta hai.",
            action: { label: "Submit Assignment PDF", page: "assignments" }
          };
        } else if (q.includes("event") || q.includes("participate") || q.includes("feedback") || q.includes("pass")) {
          botReply = {
            sender: "bot",
            text: "Tech Fest 2026 (Debate, Presentation & Typing Master) ke liye Event Hub khula hai. Aap naye Event Participation sub-menu se General Details, Participant Profile, Attendance, Test Marks aur Teacher/Admin Feedback submit kar sakte hain!",
            action: { label: "Open Event Participation", page: "events" },
            badge: "Event Hub"
          };
        } else {
          botReply = {
            sender: "bot",
            text: "I am connected to your live GGI ERP records. You can ask me about your subject-wise attendance, library book return dates and fines, placement recruitment drives, or timetable schedule!",
            action: { label: "Open Main Dashboard", page: "dashboard" }
          };
        }
      }

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:items-end p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[620px] max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur-md font-bold text-white shadow-inner">
                <Bot size={22} />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-none">CampusGenie AI</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                  {isFaculty ? "Faculty Copilot" : "Student Assistant"}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                {isFaculty ? "Connected to BCA-3C ERP & ATAL FDP System" : "Connected to Live GGI Student Academic ERP"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Assistant"
            className="rounded-xl p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Persona Indicator Banner */}
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-indigo-600 dark:text-indigo-400" />
            Active Session: <b>{user?.name || (isFaculty ? "MS. NAVJOT" : "Rajveer Singh")}</b> ({user?.role || "Student"})
          </span>
          <span className="font-mono text-[11px] text-slate-500">Gulzar Group of Institutes</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} animate-in fade-in duration-150`}
            >
              {m.badge && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 ml-1">
                  {m.badge}
                </span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none shadow-md font-medium"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 whitespace-pre-line"
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
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition shadow-sm text-xs"
                >
                  <span>{m.action.label}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs italic p-2">
              <Bot size={14} className="animate-spin text-indigo-600" />
              <span>CampusGenie is analyzing ERP records...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            {isFaculty ? "Recommended Faculty Inquiries:" : "Quick Questions for Rajveer:"}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isFaculty ? "Ask about attendance defaulters, marks entry, timetable..." : "Poocho attendance, library due date, placement..."}
            className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`${primary} !py-2.5 !px-3 disabled:opacity-40`}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
