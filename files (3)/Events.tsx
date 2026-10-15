import { useEffect, useState } from "react";
import { CampusEvent, EVENTS } from "./data";

const TABS = ["All Events", "Hackathons", "Workshops", "Cultural", "My Registrations"] as const;
const banner: Record<string, string> = { Hackathons: "bg-indigo-600", Workshops: "bg-emerald-700", Cultural: "bg-amber-600" };
const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default function Events() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All Events");
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState<string[]>([]);
  const [joined, setJoined] = useState<string[]>([]);
  const [filled, setFilled] = useState<Record<string, number>>(Object.fromEntries(EVENTS.map((e) => [e.id, e.team?.filled ?? 0])));
  const [toast, setToast] = useState("");

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const list = EVENTS.filter((e) => tab === "All Events" || (tab === "My Registrations" ? registered.includes(e.id) || joined.includes(e.id) : e.category === tab))
    .sort((a, b) => a.date.localeCompare(b.date));

  const register = (e: CampusEvent) => { setRegistered([...registered, e.id]); say(`Registered for ${e.title}`); };
  const join = (e: CampusEvent) => { setJoined([...joined, e.id]); setFilled({ ...filled, [e.id]: filled[e.id] + 1 }); say(`You joined a team for ${e.title}`); };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${tab === t ? "border-indigo-600 text-indigo-700 dark:text-indigo-400" : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400"}`}>{t}</button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="h-32 bg-slate-200 dark:bg-slate-800" /><div className="space-y-3 p-4"><div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" /></div>
          </div>))}

        {!loading && list.map((e) => {
          const isReg = registered.includes(e.id), isJoined = joined.includes(e.id);
          const full = e.team ? filled[e.id] >= e.team.size : false;
          return (
            <article key={e.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className={`flex h-32 items-end justify-between p-4 text-white ${banner[e.category]}`}>
                <span className="rounded-md bg-black/25 px-2 py-1 text-xs font-medium">{e.category}</span>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-900">{fmt(e.date)}{e.endDate ? ` - ${fmt(e.endDate)}` : ""}</span>
              </div>
              <div className="space-y-3 p-4">
                <h3 className="font-semibold leading-snug">{e.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{e.venue}</p>
                <div className="flex flex-wrap gap-1.5">{e.tags.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{t}</span>)}</div>
                {e.team ? (
                  <button disabled={full || isJoined} onClick={() => join(e)} className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-slate-700 dark:disabled:text-slate-300">
                    {isJoined ? "Team joined" : full ? "Team full" : `Team Builder (${filled[e.id]}/${e.team.size} spots filled)`}
                  </button>
                ) : (
                  <button disabled={isReg} onClick={() => register(e)} className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-emerald-100 disabled:text-emerald-800 dark:disabled:bg-emerald-950 dark:disabled:text-emerald-300">
                    {isReg ? "Registered" : "Register now"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {!loading && !list.length && (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
          <p className="font-medium">Nothing here yet</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Register for an event or join a team and it will show up here.</p>
          <button onClick={() => setTab("All Events")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Browse all events</button>
        </div>
      )}
      {toast && <div role="status" className="fixed bottom-6 right-6 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg dark:bg-white dark:text-slate-900">{toast}</div>}
    </div>
  );
}
