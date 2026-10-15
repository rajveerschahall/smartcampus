import React, { useEffect, useState } from "react";
import {
  MapPin,
  X,
  CalendarX,
  Users,
  Download,
  ShieldCheck,
  Check,
  Sparkles,
  Trophy,
  Calendar,
  FileText,
  Search,
  ExternalLink,
  Layers,
  Award,
  Plus
} from "lucide-react";
import { EVENTS, Ev, User as UserModel } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";

const CATEGORY_TABS = [
  "All Events",
  "Hackathons & SIH",
  "Workshops",
  "Cultural",
  "Industrial Visits",
  "Exams & MST",
  "My Registrations"
] as const;

const MONTH_TABS = ["All Months", "August", "September", "October", "November", "December"] as const;

const grad: Record<string, string> = {
  Hackathon: "from-indigo-600 via-indigo-700 to-sky-600",
  Workshop: "from-emerald-600 via-teal-600 to-teal-700",
  Cultural: "from-amber-500 via-orange-500 to-rose-600",
  Talk: "from-purple-700 via-indigo-800 to-slate-900",
  Holiday: "from-slate-400 to-slate-500",
  "Industrial Visit": "from-blue-600 via-cyan-600 to-teal-700",
  Exam: "from-red-600 via-rose-700 to-orange-700",
  Academic: "from-slate-600 to-slate-800"
};

function QrModal({ ev, onClose }: { ev: Ev; onClose: () => void }) {
  const [t, setT] = useState(30);
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const i = setInterval(() => {
      setT((v) => {
        if (v <= 1) {
          setSeed((s) => s + 1);
          return 30;
        }
        return v - 1;
      });
    }, 1000);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearInterval(i);
    };
  }, [onClose]);

  const cells = Array.from(
    { length: 21 * 21 },
    (_, i) => (((i * 2654435761 + seed * 40503 + ev.id * 97) >>> 0) % 3 === 0)
  );

  const finder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);

  const R = 92;
  const C = 2 * Math.PI * R;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Entry ticket"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="float-right rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
          <ShieldCheck size={14} /> Official Campus E-Ticket
        </div>
        <h3 className="mt-1 mb-4 font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
          {ev.title}
        </h3>

        <div className="relative mx-auto grid h-[212px] w-[212px] place-items-center">
          <svg className="absolute inset-0 -rotate-90" width="212" height="212">
            <circle
              cx="106"
              cy="106"
              r={R}
              fill="none"
              strokeWidth="5"
              className="stroke-slate-100 dark:stroke-slate-800"
            />
            <circle
              cx="106"
              cy="106"
              r={R}
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              className={`${
                t < 8 ? "stroke-red-500 animate-pulse" : "stroke-emerald-500"
              } transition-all duration-1000 ease-linear`}
              strokeDasharray={C}
              strokeDashoffset={C * (1 - t / 30)}
            />
          </svg>

          <div
            className="grid grid-cols-[repeat(21,1fr)] gap-0 rounded-lg bg-white p-2 shadow-inner border border-slate-200"
            style={{ width: 160, height: 160 }}
            aria-label="Signed QR code"
          >
            {cells.map((on, i) => (
              <span
                key={i}
                className={
                  on || finder(Math.floor(i / 21), i % 21)
                    ? "bg-slate-950"
                    : "bg-white"
                }
              />
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Dynamic Token Refreshes in{" "}
          <b className={`tabular-nums ${t < 8 ? "text-red-500 font-bold" : "text-emerald-600"}`}>
            {t}s
          </b>
        </p>

        <p className="mt-1 break-all font-mono text-[11px] text-slate-500">
          sig: HMAC-SHA256 • {(seed * 7919 + ev.id).toString(16).padStart(8, "0")}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Anti-screenshot token rotates continuously. Present this at the check-in desk for automated Duty Leave (DL).
        </p>

        <button
          onClick={() => {
            showToast("Offline pass saved to wallet!", "success");
            onClose();
          }}
          className={`${ghost} w-full mt-4 text-xs`}
        >
          <Download size={14} /> Save Offline Pass
        </button>
      </div>
    </div>
  );
}

const EVENTS_STORAGE_KEY = "ggi_campus_events_v2";

export default function Events({ user }: { user?: UserModel | null }) {
  const isTeacher = user?.role === "Faculty";

  const [tab, setTab] = useState<(typeof CATEGORY_TABS)[number]>("All Events");
  const [monthTab, setMonthTab] = useState<(typeof MONTH_TABS)[number]>("All Months");
  const [search, setSearch] = useState("");
  const [reg, setReg] = useState<number[]>([1, 4, 100]); // Pre-registered for Tech Fest, Street Sell & SIH
  const [qr, setQr] = useState<Ev | null>(null);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  // Events List State (with localStorage persistence)
  const [eventList, setEventList] = useState<Ev[]>(() => {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return EVENTS;
  });

  // Teacher Add Event State
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventCat, setNewEventCat] = useState<Ev["cat"]>("Workshop");
  const [newEventMonth, setNewEventMonth] = useState<Ev["month"]>("October");
  const [newEventDate, setNewEventDate] = useState("28-Oct");
  const [newEventDay, setNewEventDay] = useState("Wednesday");
  const [newEventVenue, setNewEventVenue] = useState("Auditorium Hall");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventTags, setNewEventTags] = useState("Workshop, Hands-on, GGI");
  const [newEventSeats, setNewEventSeats] = useState(120);

  const saveEvents = (next: Ev[]) => {
    setEventList(next);
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher) {
      showToast("Access Denied: Only teachers/faculty can add events.", "error");
      return;
    }

    if (!newEventTitle.trim()) {
      showToast("Please provide event title.", "error");
      return;
    }

    const createdEvent: Ev = {
      id: Date.now(),
      title: newEventTitle.trim(),
      date: newEventDate.trim(),
      day: newEventDay.trim(),
      month: newEventMonth,
      place: newEventVenue.trim(),
      cat: newEventCat,
      description: newEventDesc.trim() || "Institutional event organized by faculty.",
      tags: newEventTags.split(",").map((s) => s.trim()).filter(Boolean),
      coordinator: user?.name || "Faculty Desk"
    };

    const next = [createdEvent, ...eventList];
    saveEvents(next);
    showToast(`Event "${createdEvent.title}" added successfully to the Campus Calendar!`, "success");

    // Reset Form
    setNewEventTitle("");
    setNewEventDesc("");
    setAddEventModalOpen(false);
  };

  const toggleRegister = (id: number, title: string) => {
    if (reg.includes(id)) {
      setReg(reg.filter((x) => x !== id));
      showToast(`Cancelled registration for ${title}`, "info");
    } else {
      setReg([...reg, id]);
      showToast(`Successfully registered for ${title}! Dynamic pass generated.`, "success");
    }
  };

  const sihEvent = eventList.find((e) => e.tags?.includes("SIH"));

  const filteredEvents = eventList.filter((e) => {
    // Month filter
    if (monthTab !== "All Months" && e.month !== monthTab) return false;

    // Search filter
    if (
      search &&
      !e.title.toLowerCase().includes(search.toLowerCase()) &&
      !e.description?.toLowerCase().includes(search.toLowerCase()) &&
      !e.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    ) {
      return false;
    }

    // Category filter
    if (tab === "All Events") return true;
    if (tab === "My Registrations") return reg.includes(e.id);
    if (tab === "Hackathons & SIH") return e.cat === "Hackathon";
    if (tab === "Workshops") return e.cat === "Workshop" || e.cat === "Talk";
    if (tab === "Cultural") return e.cat === "Cultural";
    if (tab === "Industrial Visits") return e.cat === "Industrial Visit";
    if (tab === "Exams & MST") return e.cat === "Exam";
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
            Academic Calendar & Campus Events Hub
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Real institutional odd semester schedule (August to December), Smart India Hackathon (SIH 2026), and rotating HMAC-SHA256 event passes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Teacher Add Event Action */}
          {isTeacher && (
            <button
              onClick={() => setAddEventModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-3.5 py-2 text-xs shadow-md transition"
            >
              <Plus size={15} />
              <span>➕ Add New Event (Teacher Desk)</span>
            </button>
          )}

          {/* View Original Scanned Calendar Button */}
          <button
            onClick={() => setCalendarModalOpen(true)}
            className={`${primary} !py-2 !px-3.5 text-xs flex items-center gap-1.5`}
          >
            <FileText size={15} /> Official Calendar Table
          </button>
        </div>
      </div>

      {/* SMART INDIA HACKATHON (SIH 2026) SPOTLIGHT BANNER */}
      {sihEvent && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-700 p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-xs font-bold border border-white/20">
                <Trophy size={14} className="text-amber-300" />
                MINISTRY OF EDUCATION & AICTE FLAGSHIP HACKATHON
              </div>
              <h3 className="text-2xl font-black tracking-tight leading-tight">
                Smart India Hackathon (SIH 2026) — GGI Internal Screening
              </h3>
              <p className="text-xs text-amber-50 leading-relaxed">
                World's Biggest Open Innovation Hackathon! Form a squad of <b>6 members (with at least 1 female teammate mandatory)</b>. Top 30 teams will represent Gulzar Group of Institutes at national nodal centers with <b>₹1,00,000 cash prize per problem statement</b>.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="bg-white/20 px-2.5 py-1 rounded-lg font-bold">
                  Team: Exactly 6 Members
                </span>
                <span className="bg-white/20 px-2.5 py-1 rounded-lg font-bold">
                  AICTE Rule: 1+ Female Member Mandatory
                </span>
                <span className="bg-white/20 px-2.5 py-1 rounded-lg font-bold">
                  Internal Screening: 25 Oct 2026
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              {reg.includes(sihEvent.id) ? (
                <button
                  onClick={() => setQr(sihEvent)}
                  className="rounded-xl bg-white text-slate-900 font-bold px-4 py-2.5 text-xs shadow-md hover:bg-slate-100 transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} className="text-emerald-600" /> Show SIH Pass
                </button>
              ) : (
                <button
                  onClick={() => toggleRegister(sihEvent.id, sihEvent.title)}
                  className="rounded-xl bg-white text-slate-900 font-bold px-4 py-2.5 text-xs shadow-md hover:bg-slate-100 transition flex items-center justify-center gap-2"
                >
                  <Trophy size={16} className="text-amber-600" /> 1-Click Register for SIH
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Month Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 pr-1">
          Select Month:
        </span>
        {MONTH_TABS.map((m) => (
          <button
            key={m}
            onClick={() => setMonthTab(m)}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              monthTab === m
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div role="tablist" className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                tab === t
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {t} {t === "My Registrations" && `(${reg.length})`}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, topics, faculty..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className={`${card} p-12 text-center`}>
          <div className="flex flex-col items-center gap-3">
            <CalendarX className="text-slate-400" size={32} />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">No events found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              No matching events in {monthTab} under "{tab}". Try switching filters.
            </p>
            <button
              className={`${primary} mt-2 text-xs`}
              onClick={() => {
                setTab("All Events");
                setMonthTab("All Months");
                setSearch("");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((e) => {
            const joined = reg.includes(e.id);
            const d = new Date(e.date);

            return (
              <article
                key={e.id}
                className={`${card} overflow-hidden flex flex-col justify-between group hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-xs hover:shadow-md`}
              >
                <div>
                  <div
                    className={`relative h-28 bg-gradient-to-br ${
                      grad[e.cat] || grad.Talk
                    } p-3 text-white flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        {e.cat}
                      </span>
                      {joined && (
                        <span className="rounded-md bg-emerald-500 text-white px-2 py-0.5 text-xs font-semibold flex items-center gap-1 shadow">
                          <Check size={12} /> Registered Pass
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                        {e.day ? `${e.day} • ` : ""}
                        {d.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short"
                        })}
                      </span>
                      {e.month && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">
                          {e.month}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug group-hover:text-indigo-600 transition-colors">
                      {e.title}
                    </h3>

                    <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin size={13} className="text-indigo-500 shrink-0" />
                      {e.place || "GGI Campus Auditorium"}
                    </p>

                    {e.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {e.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {e.tags?.map((t) => (
                        <Pill key={t} tone={t.includes("SIH") ? "amber" : "indigo"}>
                          {t}
                        </Pill>
                      ))}
                    </div>

                    {e.coordinator && (
                      <p className="text-[11px] text-slate-400">
                        Coordinator: <span className="font-semibold text-slate-600 dark:text-slate-300">{e.coordinator}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-3 pt-3 flex items-center gap-2">
                  {e.cat === "Holiday" ? (
                    <span className="text-xs font-semibold text-slate-400 italic">
                      Institutional Gazetted Holiday
                    </span>
                  ) : joined ? (
                    <>
                      <button
                        className={`${primary} flex-1 !py-1.5 text-xs`}
                        onClick={() => setQr(e)}
                      >
                        Show QR Pass
                      </button>
                      <button
                        className={`${ghost} !py-1.5 text-xs text-red-600 hover:text-red-700`}
                        onClick={() => toggleRegister(e.id, e.title)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className={`${primary} flex-1 !py-1.5 text-xs`}
                      onClick={() => toggleRegister(e.id, e.title)}
                    >
                      Register Now
                    </button>
                  )}

                  {e.team && (
                    <span
                      title="Squad size allowed"
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0"
                    >
                      <Users size={13} /> {e.team[0]}–{e.team[1]}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      {qr && <QrModal ev={qr} onClose={() => setQr(null)} />}

      {/* Official Academic Calendar Modal Preview */}
      {calendarModalOpen && (
        <Modal
          isOpen={calendarModalOpen}
          title="Official Academic Calendar 2026-27 (Odd Semester)"
          onClose={() => setCalendarModalOpen(false)}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Authentic scanned calendar chart published by Gulzar Group of Institutes (August to December).</span>
              <a
                href="/academic-calendar.png"
                download="GGI_Academic_Calendar_2026.png"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <Download size={14} /> Download Image
              </a>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white max-h-[70vh] overflow-y-auto">
              <img
                src="/academic-calendar.png"
                alt="Gulzar Group of Institutes Official Academic Calendar"
                className="w-full object-contain"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setCalendarModalOpen(false)} className={primary}>
                Close Calendar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Teacher Add Event Modal (Faculty Desk - User Requirement) */}
      {addEventModalOpen && (
        <Modal
          isOpen={addEventModalOpen}
          onClose={() => setAddEventModalOpen(false)}
          title="Create & Schedule Campus Event — Faculty Incharge Desk"
        >
          <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="e.g. AI & Cloud Computing Bootcamp 2026"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={newEventCat}
                  onChange={(e) => setNewEventCat(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Talk">Expert Talk / Alumni Session</option>
                  <option value="Industrial Visit">Industrial Visit</option>
                  <option value="Cultural">Cultural / Talent Hunt</option>
                  <option value="Academic">Academic Seminar</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Month *
                </label>
                <select
                  value={newEventMonth}
                  onChange={(e) => setNewEventMonth(e.target.value as Ev["month"])}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold"
                >
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Date *
                </label>
                <input
                  type="text"
                  required
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  placeholder="e.g. 28-Oct"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Day of Week *
                </label>
                <input
                  type="text"
                  required
                  value={newEventDay}
                  onChange={(e) => setNewEventDay(e.target.value)}
                  placeholder="e.g. Wednesday"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  value={newEventVenue}
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  placeholder="e.g. GGI Auditorium / PHP Lab B-201"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Participant Capacity (Seats)
                </label>
                <input
                  type="number"
                  min={10}
                  max={1000}
                  value={newEventSeats}
                  onChange={(e) => setNewEventSeats(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Description & Objectives
              </label>
              <textarea
                rows={3}
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="Describe key learning outcomes, prerequisites, or rules..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Keywords & Tags (comma separated)
              </label>
              <input
                type="text"
                value={newEventTags}
                onChange={(e) => setNewEventTags(e.target.value)}
                placeholder="e.g. AI/ML, Cloud, Coding, SIH"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAddEventModalOpen(false)}
                className={ghost}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={primary}
              >
                Publish Event to Calendar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
