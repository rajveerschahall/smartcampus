import React, { useEffect, useState } from "react";
import { MapPin, X, CalendarX, Users, Download, ShieldCheck, Check, Sparkles } from "lucide-react";
import { EVENTS, Ev } from "./data";
import { card, primary, ghost, Pill, showToast } from "./ui";

const TABS = ["All Events", "Hackathons", "Workshops", "Cultural", "My Registrations"] as const;

const map: Record<string, string> = {
  Hackathons: "Hackathon",
  Workshops: "Workshop",
  Cultural: "Cultural"
};

const grad: Record<string, string> = {
  Hackathon: "from-indigo-600 via-indigo-700 to-sky-600",
  Workshop: "from-emerald-600 via-teal-600 to-teal-700",
  Cultural: "from-amber-500 via-orange-500 to-rose-600",
  Talk: "from-slate-700 via-slate-800 to-slate-900",
  Holiday: "from-slate-400 to-slate-500"
};

function QrModal({ ev, onClose }: { ev: Ev; onClose: () => void }) {
  const [t, setT] = useState(30);
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    const i = setInterval(() => {
      setT((v) => {
        if (v <= 1) {
          setSeed((s) => s + 1);
          return 30;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);

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
          Anti-screenshot token rotates continuously. Present this at the check-in desk.
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

export default function Events() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All Events");
  const [reg, setReg] = useState<number[]>([1, 4]); // Rajveer pre-registered for Tech Fest & Street Sell
  const [qr, setQr] = useState<Ev | null>(null);

  const toggleRegister = (id: number, title: string) => {
    if (reg.includes(id)) {
      setReg(reg.filter((x) => x !== id));
      showToast(`Cancelled registration for ${title}`, "info");
    } else {
      setReg([...reg, id]);
      showToast(`Successfully registered for ${title}! Dynamic pass generated.`, "success");
    }
  };

  const list = EVENTS.filter((e) => e.cat !== "Holiday").filter(
    (e) =>
      tab === "All Events" ||
      (tab === "My Registrations" ? reg.includes(e.id) : e.cat === map[tab])
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={22} />
            Campus Events & Hackathons
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Register for technical symposiums, get dynamic anti-spoofing QR passes and earn XP.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-1"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {t} {t === "My Registrations" && `(${reg.length})`}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className={`${card} p-12 text-center`}>
          <div className="flex flex-col items-center gap-3">
            <CalendarX className="text-slate-400" size={32} />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">No events found</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              You haven't registered for any events yet. Check out upcoming hackathons and workshops!
            </p>
            <button className={`${primary} mt-2`} onClick={() => setTab("All Events")}>
              Browse All Events
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((e) => {
            const joined = reg.includes(e.id);
            const d = new Date(e.date);

            return (
              <article key={e.id} className={`${card} overflow-hidden flex flex-col justify-between group`}>
                <div>
                  <div className={`relative h-28 bg-gradient-to-br ${grad[e.cat]} p-3 text-white flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        {e.cat}
                      </span>
                      {joined && (
                        <span className="rounded-md bg-emerald-500 text-white px-2 py-0.5 text-xs font-semibold flex items-center gap-1 shadow">
                          <Check size={12} /> Registered
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-sm bg-black/30 backdrop-blur-sm self-start px-2 py-1 rounded">
                      {d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                      {e.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin size={13} className="text-indigo-500 shrink-0" />
                      {e.place || "GGI Campus Auditorium"}
                    </p>
                    {e.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {e.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {e.tags?.map((t) => (
                        <Pill key={t} tone="indigo">{t}</Pill>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-3 pt-3 flex gap-2">
                  {joined ? (
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
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Users size={13} /> {e.team[0]}–{e.team[1]}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {qr && <QrModal ev={qr} onClose={() => setQr(null)} />}
    </div>
  );
}
