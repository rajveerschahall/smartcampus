import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  FileText,
  Trophy,
  CalendarDays,
  Clock,
  ArrowRight,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Plus,
  Briefcase,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Award,
  Megaphone
} from "lucide-react";
import {
  ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  EVENTS,
  TIMETABLE,
  PERIODS,
  SUBJECTS,
  FACULTY,
  INITIAL_BORROWED_BOOKS,
  PLACEMENT_DRIVES,
  INITIAL_DIGITAL_NOTICES
} from "./data";
import GgiLogoSticker from "./GgiLogoSticker";
import { card, primary, ghost, Pill, Skeleton, pctTone, showToast } from "./ui";

const Ring = ({ pct }: { pct: number }) => {
  const r = 34;
  const c = 2 * Math.PI * r;
  const col = pct >= 75 ? "#059669" : pct >= 60 ? "#d97706" : "#dc2626";

  return (
    <svg width="88" height="88" role="img" aria-label={`Attendance ${pct}%`}>
      <circle cx="44" cy="44" r={r} fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-800" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={col}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="49" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-[15px] font-bold">
        {pct}%
      </text>
    </svg>
  );
};

export default function Dashboard({ onNav }: { onNav: (s: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(t);
      clearInterval(clockInterval);
    };
  }, []);

  const P = ATTENDANCE.reduce((s, r) => s + r[1], 0);
  const T = ATTENDANCE.reduce((s, r) => s + r[2], 0);
  const pct = +((P / T) * 100).toFixed(1);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = daysOfWeek[new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState<string>(
    ["Saturday", "Sunday"].includes(currentDayName) ? "Monday" : currentDayName
  );

  const todaySchedule = (TIMETABLE[selectedDay] ?? [])
    .map((s, i) => (s ? { p: i, s } : null))
    .filter(Boolean) as { p: number; s: [string, string, string] }[];


  const [bookingFaculty, setBookingFaculty] = useState(FACULTY[0]);
  const [slot, setSlot] = useState<string | null>("11:30");
  const [status, setStatus] = useState<"Pending" | "Approved" | null>(null);

  const handleBookSlot = () => {
    if (!slot) return;
    setStatus("Pending");
    showToast(`15-min consultation requested with ${bookingFaculty} at ${slot}!`, "success");
  };

  // Unified Multi-Source Deadlines (Assignments, Library Books, Placement, Exams)
  const unifiedDeadlines = [
    {
      id: "d-asg",
      title: "Cloud Computing Case Study (UGCA1936)",
      category: "Assignment",
      targetPage: "assignments",
      dueMs: Date.now() + 18 * 3600 * 1000, // 18 hours left
      totalDurationMs: 7 * 24 * 3600 * 1000,
      urgentNotice: "Submit now to avoid penalty!"
    },
    {
      id: "d-lib",
      title: "Library Book: Database System Concepts",
      category: "Library Return",
      targetPage: "library",
      dueMs: Date.now() + 48 * 3600 * 1000, // 2 days left
      totalDurationMs: 14 * 24 * 3600 * 1000,
      urgentNotice: "Renew to avoid ₹5/day fine!"
    },
    {
      id: "d-drive",
      title: "Google SDE-1 Recruitment Drive (₹18 LPA)",
      category: "Placement",
      targetPage: "placement",
      dueMs: Date.now() + 4 * 24 * 3600 * 1000, // 4 days left
      totalDurationMs: 10 * 24 * 3600 * 1000,
      urgentNotice: "Min 65% aggregate required"
    },
    {
      id: "d-exam",
      title: "Mid-Semester Test II (MST-2) Begins",
      category: "Exam",
      targetPage: "marks",
      dueMs: Date.now() + 12 * 24 * 3600 * 1000, // 12 days left
      totalDurationMs: 30 * 24 * 3600 * 1000,
      urgentNotice: "Units III & IV Syllabus"
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
        <Skeleton className="h-64 sm:col-span-2" />
        <Skeleton className="h-64 sm:col-span-2" />
      </div>
    );
  }

  const metrics = [
    {
      icon: <CalendarCheck size={18} className="text-emerald-600" />,
      label: "Biometric Attendance",
      node: (
        <div className="flex items-center gap-3">
          <Ring pct={pct} />
          <div>
            <Pill tone={pctTone(pct)}>{pct < 75 ? "Below 75%" : "On Track"}</Pill>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              {P}/{T} lectures attended
            </p>
            <button
              onClick={() => onNav("attendance")}
              className="text-xs font-semibold text-indigo-600 hover:underline mt-1 block"
            >
              Bunk Calculator →
            </button>
          </div>
        </div>
      )
    },
    {
      icon: <BookOpen size={18} className="text-indigo-600" />,
      label: "Library Fee Prevention",
      node: (
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              ₹0.00
            </p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Zero Fine</span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
            1 book due in 2 days (Renew Free)
          </p>
          <button
            onClick={() => onNav("library")}
            className="text-xs font-semibold text-indigo-600 hover:underline mt-2 block"
          >
            Open Library Desk →
          </button>
        </div>
      )
    },
    {
      icon: <Briefcase size={18} className="text-purple-600" />,
      label: "Placement Cell Drives",
      node: (
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              6 Drives
            </p>
            <span className="text-xs font-semibold text-slate-500">Eligible</span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mt-1">
            Top CTC: ₹18.0 LPA (Google SDE)
          </p>
          <button
            onClick={() => onNav("placement")}
            className="text-xs font-semibold text-indigo-600 hover:underline mt-2 block"
          >
            1-Click Apply →
          </button>
        </div>
      )
    },
    {
      icon: <Trophy size={18} className="text-amber-500" />,
      label: "Campus Level & XP",
      node: (
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              1,240
            </p>
            <span className="text-sm font-semibold text-slate-500">XP</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Level 4 Campus Prodigy (Rank #3)
          </p>
          <button
            onClick={() => onNav("xp")}
            className="text-xs font-semibold text-indigo-600 hover:underline mt-2 block"
          >
            View Leaderboard →
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Live Digital Clock & Campus Greeting Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <GgiLogoSticker size="md" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-indigo-100">
                GGI KHANNA • NAAC A+
              </span>
              <span className="text-xs text-indigo-200">
                Academic Term 2026–27 (Odd Semester)
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Welcome back, Rajveer Singh!
            </h2>
            <p className="text-xs text-indigo-100 max-w-xl">
              Department of Computer Applications • BCA Year 3 (Section C) • Roll No: 2433613
            </p>
          </div>
        </div>

        {/* Live Digital Clock Widget */}
        <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3.5 text-right shrink-0 flex flex-col items-start md:items-end">
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 flex items-center gap-1.5">
            <Clock size={12} className="text-amber-300 animate-pulse" /> Live Campus Clock
          </span>
          <div className="text-2xl font-mono font-bold tracking-wider mt-0.5 text-white">
            {currentTime.toLocaleTimeString("en-IN", { hour12: true })}
          </div>
          <span className="text-[11px] text-indigo-200">
            {currentTime.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </span>
        </div>
      </div>

      {/* Live Digital Notice Board Broadcast Widget */}
      <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-blue-50/90 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/40 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Megaphone size={20} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  Live Digital Notice Board
                </span>
                <span className="text-[10px] rounded-full bg-indigo-200 dark:bg-indigo-900 px-2 py-0.5 font-bold text-indigo-800 dark:text-indigo-300">
                  Faculty Broadcast
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                Vardhman Special Steels (CFD/UT/NDT) & Alpha IT Placement Drives announced by CRC!
              </p>
            </div>
          </div>
          <button
            onClick={() => onNav("digital-board")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-bold shadow-md transition shrink-0"
          >
            <span>Open Notice Board</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0">Quick Modules:</span>
        <button onClick={() => onNav("digital-board")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800`}>
          <Megaphone size={13} className="text-indigo-600" /> Digital Notice Board
        </button>
        <button onClick={() => onNav("placement")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <Briefcase size={13} className="text-purple-600" /> Placement Cell (Jobs)
        </button>
        <button onClick={() => onNav("event-general-details")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <Sparkles size={13} className="text-amber-500" /> Event General Details
        </button>
        <button onClick={() => onNav("events")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <Sparkles size={13} className="text-pink-500" /> Events Hub & Calendar
        </button>
        <button onClick={() => onNav("team")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <Sparkles size={13} className="text-emerald-600" /> SIH Hackathon Teams
        </button>
        <button onClick={() => onNav("library")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <BookOpen size={13} className="text-amber-500" /> Library Desk
        </button>
        <button onClick={() => onNav("dl")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <ShieldCheck size={13} className="text-emerald-500" /> Apply Duty Leave
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className={`${card} p-5 flex flex-col justify-between`}>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {m.icon}
              {m.label}
            </p>
            {m.node}
          </div>
        ))}
      </div>

      {/* Today's Schedule + AI Deadline Tracker */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Class Schedule Section */}
        <section className={`${card} p-5 lg:col-span-3 flex flex-col justify-between`}>
          <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-base">
                <Clock size={18} className="text-indigo-600" />
                Class Schedule & Lectures
              </h2>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-2 py-0.5 rounded font-medium transition ${
                      selectedDay === d
                        ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300 font-semibold"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {todaySchedule.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No classes scheduled for {selectedDay}. Enjoy the break!
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {todaySchedule.map(({ p, s }) => (
                  <li key={p} className="flex items-center gap-3 py-3 text-sm">
                    <span className="w-24 text-xs font-mono font-medium text-slate-500 shrink-0">
                      {PERIODS[p]}
                    </span>
                    <span className="flex-1 min-w-0">
                      <b className="font-semibold text-slate-900 dark:text-slate-100 truncate block">
                        {SUBJECTS[s[0]] || s[0]}
                      </b>
                      <span className="text-xs text-slate-500">{s[1]}</span>
                    </span>
                    <Pill tone="indigo">{s[2]}</Pill>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className={`${primary} mt-4 self-start`}
            onClick={() => onNav("timetable")}
          >
            View Full Week Timetable <ArrowRight size={14} />
          </button>
        </section>

        {/* AI Deadline Tracker (Dynamic Colors: Green -> Amber -> Red) */}
        <section className={`${card} p-5 lg:col-span-2 flex flex-col justify-between`}>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                AI Deadline Tracker
              </h2>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded text-indigo-700 dark:text-indigo-300">
                Auto-Monitored
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Real-time countdown with dynamic color alerts for coursework, library returns, and job drives:
            </p>

            <ul className="space-y-4">
              {unifiedDeadlines.map((item) => {
                const diffMs = item.dueMs - Date.now();
                const hoursLeft = Math.max(0, Math.floor(diffMs / 36e5));
                const daysLeft = Math.floor(hoursLeft / 24);

                // Progress calculation
                const progressPct = Math.min(100, Math.max(10, 100 - (diffMs / item.totalDurationMs) * 100));

                // Color shift: <24h -> Red, <72h -> Amber, >72h -> Green
                let colorClass = "bg-emerald-600";
                let textBadgeClass = "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950";
                if (diffMs <= 24 * 36e5) {
                  colorClass = "bg-red-600";
                  textBadgeClass = "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 font-bold animate-pulse";
                } else if (diffMs <= 72 * 36e5) {
                  colorClass = "bg-amber-500";
                  textBadgeClass = "text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 font-semibold";
                }

                return (
                  <li
                    key={item.id}
                    onClick={() => onNav(item.targetPage)}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition space-y-2 bg-slate-50/50 dark:bg-slate-900/40"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                        {item.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${textBadgeClass}`}>
                        {hoursLeft < 24 ? `${hoursLeft}h left (Urgent!)` : `${daysLeft}d left`}
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Tag: {item.category}</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{item.urgentNotice}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => onNav("assignments")}
              className={`${ghost} text-xs flex-1`}
            >
              Assignments
            </button>
            <button
              onClick={() => onNav("library")}
              className={`${ghost} text-xs flex-1`}
            >
              Library Portal
            </button>
          </div>
        </section>
      </div>

      {/* Book a 15-min slot quick widget */}
      <section className={`${card} p-5`}>
        <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <UserCheck size={18} className="text-indigo-600" />
              Quick Faculty Consultation Booking Desk
            </h2>
            <p className="text-xs text-slate-500">
              Need instant doubt clearing? Book an upcoming 15-minute slot with your department professor.
            </p>
          </div>
          {status && <Pill tone={status === "Pending" ? "amber" : "green"}>{status}</Pill>}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Select Professor
            </label>
            <select
              value={bookingFaculty}
              onChange={(e) => setBookingFaculty(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 font-medium"
              aria-label="Faculty"
            >
              {FACULTY.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Available 15-Min Slots (Today)
            </label>
            <div className="flex flex-wrap gap-2">
              {["10:00", "10:15", "11:30", "02:30", "03:15"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSlot(t)}
                  aria-pressed={slot === t}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    slot === t
                      ? "border-indigo-600 bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {t} AM/PM
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            disabled={!slot}
            onClick={handleBookSlot}
            className={`${primary} disabled:opacity-50 text-xs`}
          >
            Confirm 15-min Slot Request
          </button>
          <button
            onClick={() => onNav("appointments")}
            className={`${ghost} text-xs`}
          >
            View My Bookings Desk
          </button>
        </div>
      </section>
    </div>
  );
}
