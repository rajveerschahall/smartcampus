import React, { useEffect, useState } from "react";
import { CalendarCheck, FileText, Trophy, CalendarDays, Clock, ArrowRight, Sparkles, UserCheck, ShieldCheck, Plus } from "lucide-react";
import { ATTENDANCE, INITIAL_ASSIGNMENTS, EVENTS, TIMETABLE, PERIODS, SUBJECTS, FACULTY } from "./data";
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

function Deadline({ a, onNav }: { a: (typeof INITIAL_ASSIGNMENTS)[number]; onNav: (s: string) => void }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const left = a.due - now;
  const used = Math.min(100, Math.max(0, ((now - a.start) / (a.due - a.start)) * 100));
  const h = Math.max(0, Math.floor(left / 36e5));
  const color = left < 24 * 36e5 ? "bg-red-600" : left < 72 * 36e5 ? "bg-amber-500" : "bg-emerald-600";

  return (
    <li className="space-y-1.5 cursor-pointer hover:opacity-80 transition" onClick={() => onNav("assignments")}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
          {a.title}
        </span>
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          {h >= 48 ? `${Math.floor(h / 24)}d left` : `${h}h left`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" role="progressbar">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${used}%` }} />
      </div>
    </li>
  );
}

export default function Dashboard({ onNav }: { onNav: (s: string) => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
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

  const nextEvent = EVENTS.filter(e => e.cat !== "Holiday" && new Date(e.date) >= new Date())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];

  const [bookingFaculty, setBookingFaculty] = useState(FACULTY[0]);
  const [slot, setSlot] = useState<string | null>("11:30");
  const [status, setStatus] = useState<"Pending" | "Approved" | null>(null);

  const handleBookSlot = () => {
    if (!slot) return;
    setStatus("Pending");
    showToast(`15-min consultation requested with ${bookingFaculty} at ${slot}!`, "success");
  };

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
      label: "Overall Biometric Attendance",
      node: (
        <div className="flex items-center gap-3">
          <Ring pct={pct} />
          <div>
            <Pill tone={pctTone(pct)}>{pct < 75 ? "Below 75%" : "On Track"}</Pill>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">{P}/{T} lectures attended</p>
            <button onClick={() => onNav("attendance")} className="text-xs font-semibold text-indigo-600 hover:underline mt-1 block">
              Calculate Bunks →
            </button>
          </div>
        </div>
      ),
    },
    {
      icon: <FileText size={18} className="text-indigo-600" />,
      label: "Pending Assignments",
      node: (
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {INITIAL_ASSIGNMENTS.filter(a => !a.submitted).length}
            </p>
            <span className="text-xs text-slate-500">courseworks active</span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">1 due in less than 24 hours</p>
          <button onClick={() => onNav("assignments")} className="text-xs font-semibold text-indigo-600 hover:underline mt-2 block">
            Submit coursework →
          </button>
        </div>
      ),
    },
    {
      icon: <CalendarDays size={18} className="text-purple-600" />,
      label: "Upcoming Flagship Event",
      node: (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
            {nextEvent?.title}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Pill tone="indigo">
              {nextEvent && new Date(nextEvent.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </Pill>
            <span className="text-xs text-slate-500 font-medium">{nextEvent?.place}</span>
          </div>
          <button onClick={() => onNav("events")} className="text-xs font-semibold text-indigo-600 hover:underline mt-2 block">
            View Dynamic Pass →
          </button>
        </div>
      ),
    },
    {
      icon: <Trophy size={18} className="text-amber-500" />,
      label: "Campus Level & XP",
      node: (
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              1,240
            </p>
            <span className="text-sm font-semibold text-slate-500">XP</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Level 4 Campus Prodigy (Rank #3)</p>
          <button onClick={() => onNav("xp")} className="text-xs font-semibold text-indigo-600 hover:underline mt-2 block">
            View Leaderboard →
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0">Quick Jump:</span>
        <button onClick={() => onNav("dl")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <ShieldCheck size={13} className="text-indigo-600" /> Apply Duty Leave
        </button>
        <button onClick={() => onNav("team")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <Sparkles size={13} className="text-amber-500" /> Hackathon Team Builder
        </button>
        <button onClick={() => onNav("marks")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <Trophy size={13} className="text-emerald-500" /> MST Marks & Grades
        </button>
        <button onClick={() => onNav("certs")} className={`${ghost} !py-1 !px-2.5 whitespace-nowrap`}>
          <Trophy size={13} className="text-purple-500" /> E-Certificates Vault
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(m => (
          <div key={m.label} className={`${card} p-5 flex flex-col justify-between`}>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {m.icon}
              {m.label}
            </p>
            {m.node}
          </div>
        ))}
      </div>

      {/* Today's Schedule + Deadlines */}
      <div className="grid gap-5 lg:grid-cols-5">
        <section className={`${card} p-5 lg:col-span-3 flex flex-col justify-between`}>
          <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-base">
                <Clock size={18} className="text-indigo-600" />
                Class Schedule
              </h2>
              {/* Day filter selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(d => (
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

        {/* Deadlines Section */}
        <section className={`${card} p-5 lg:col-span-2 flex flex-col justify-between`}>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <FileText size={18} className="text-amber-500" />
                Active Deadlines
              </h2>
              <span className="text-xs text-slate-500">Auto-synced</span>
            </div>
            <ul className="space-y-4">
              {INITIAL_ASSIGNMENTS.filter(a => !a.submitted).slice(0, 3).map(a => (
                <Deadline key={a.title} a={a} onNav={onNav} />
              ))}
            </ul>
          </div>

          <button
            className={`${ghost} mt-4 w-full text-xs`}
            onClick={() => onNav("assignments")}
          >
            Open All Assignments Portal
          </button>
        </section>
      </div>

      {/* Book a 15-min slot quick widget */}
      <section className={`${card} p-5`}>
        <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <UserCheck size={18} className="text-indigo-600" />
              Quick Faculty Consultation Booking
            </h2>
            <p className="text-xs text-slate-500">
              Need instant doubt clearing? Book an upcoming 15-minute slot.
            </p>
          </div>
          {status && <Pill tone={status === "Pending" ? "amber" : "green"}>{status}</Pill>}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Select Professor</label>
            <select
              value={bookingFaculty}
              onChange={e => setBookingFaculty(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 font-medium"
              aria-label="Faculty"
            >
              {FACULTY.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Available 15-Min Slots</label>
            <div className="flex flex-wrap gap-2">
              {["10:00", "10:15", "11:30", "02:30", "03:15"].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSlot(t)}
                  aria-pressed={slot === t}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    slot === t
                      ? "border-indigo-600 bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {t}
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
            View My Bookings
          </button>
        </div>
      </section>
    </div>
  );
}
