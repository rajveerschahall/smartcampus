import { useMemo, useState } from "react";
import { DL_REQUESTS, FACULTY, STUDENTS } from "./data";

type Mark = "P" | "A" | "L";
const card = "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900";
const pill: Record<string, string> = {
  Verified: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Pending: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export default function Faculty() {
  const [tab, setTab] = useState<"attendance" | "dl" | "directory">("attendance");
  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800" role="tablist">
        {([["attendance", "Mark attendance"], ["dl", "Duty leave approvals"], ["directory", "Faculty directory"]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${tab === k ? "border-indigo-600 text-indigo-700 dark:text-indigo-400" : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400"}`}>{l}</button>
        ))}
      </div>
      {tab === "attendance" && <ManualAttendance />}
      {tab === "dl" && <DutyLeave />}
      {tab === "directory" && <Directory />}
    </div>
  );
}

function ManualAttendance() {
  const [subject, setSubject] = useState("Web Technologies");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState<Record<string, Mark>>(() => Object.fromEntries(STUDENTS.map((s) => [s.roll, "P" as Mark])));
  const [saved, setSaved] = useState(false);
  const count = (m: Mark) => Object.values(marks).filter((v) => v === m).length;
  const set = (roll: string, m: Mark) => { setMarks({ ...marks, [roll]: m }); setSaved(false); };
  const all = (m: Mark) => { setMarks(Object.fromEntries(STUDENTS.map((s) => [s.roll, m]))); setSaved(false); };

  return (
    <div className={card}>
      <div className="flex flex-wrap items-end gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
        <label className="text-sm">Subject
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block rounded-lg border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700">
            {["Web Technologies", "Software Engineering", "Data Mining", "Cloud Computing"].map((s) => <option key={s}>{s}</option>)}
          </select></label>
        <label className="text-sm">Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block rounded-lg border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" /></label>
        <div className="ml-auto flex gap-2">
          <button onClick={() => all("P")} className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Mark all present</button>
          <button onClick={() => setSaved(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md">Save attendance</button>
        </div>
      </div>
      <div className="flex gap-6 px-5 py-3 text-sm" aria-live="polite">
        <span className="text-emerald-700 dark:text-emerald-400">Present: {count("P")}</span>
        <span className="text-red-700 dark:text-red-400">Absent: {count("A")}</span>
        <span className="text-amber-700 dark:text-amber-400">Duty leave: {count("L")}</span>
        {saved && <span className="ml-auto font-medium text-emerald-700 dark:text-emerald-400">Saved for {subject}, {date}</span>}
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {STUDENTS.map((s) => (
          <li key={s.roll} className="flex flex-wrap items-center gap-3 px-5 py-3">
            <div className="min-w-0 flex-1"><p className="font-medium">{s.name}</p><p className="text-xs text-slate-500">{s.roll}</p></div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.pct < 75 ? pill.Rejected : pill.Verified}`}>{s.pct}%{s.pct < 75 ? " low" : ""}</span>
            <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700" role="group" aria-label={`Attendance for ${s.name}`}>
              {([["P", "Present"], ["A", "Absent"], ["L", "DL"]] as const).map(([m, l]) => (
                <button key={m} aria-pressed={marks[s.roll] === m} onClick={() => set(s.roll, m)}
                  className={`px-3 py-1.5 text-sm ${marks[s.roll] === m ? (m === "P" ? "bg-emerald-600 text-white" : m === "A" ? "bg-red-600 text-white" : "bg-amber-500 text-slate-900") : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{l}</button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DutyLeave() {
  const [rows, setRows] = useState(DL_REQUESTS);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const per = 4;
  const filtered = useMemo(() => rows.filter((r) => (status === "All" || r.status === status) && (r.student + r.event).toLowerCase().includes(q.toLowerCase())), [rows, q, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / per));
  const view = filtered.slice((page - 1) * per, page * per);
  const act = (id: number, s: string) => setRows(rows.map((r) => (r.id === id ? { ...r, status: s } : r)));

  return (
    <div className={card}>
      <div className="flex flex-wrap gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search student or event" aria-label="Search"
          className="w-64 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-700" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter status" className="rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
          {["All", "Pending", "Verified", "Rejected"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-600 dark:text-slate-400"><tr>{["Student", "Event", "Date", "Status", "Actions"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {view.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 font-medium">{r.student}</td><td className="px-4 py-3">{r.event}</td><td className="px-4 py-3">{r.dates}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pill[r.status]}`}>{r.status === "Pending" ? "Pending DL approval" : r.status}</span></td>
                <td className="px-4 py-3">{r.status === "Pending" ? (
                  <div className="flex gap-2">
                    <button onClick={() => act(r.id, "Verified")} className="rounded-md bg-emerald-600 px-2.5 py-1 text-white hover:bg-emerald-700">Approve</button>
                    <button onClick={() => act(r.id, "Rejected")} className="rounded-md border border-slate-300 px-2.5 py-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">Reject</button>
                  </div>) : <span className="text-slate-400">Done</span>}</td>
              </tr>
            ))}
            {!view.length && <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">No requests match. Clear the search or change the status filter.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
        <span className="text-slate-500">Page {page} of {pages}</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40 dark:border-slate-700">Previous</button>
          <button disabled={page === pages} onClick={() => setPage(page + 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40 dark:border-slate-700">Next</button>
        </div>
      </div>
    </div>
  );
}

function Directory() {
  const [q, setQ] = useState("");
  const list = FACULTY.filter((f) => f.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search faculty" aria-label="Search faculty" className="w-64 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-700" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((f) => (
          <div key={f} className={`${card} p-4 transition hover:-translate-y-0.5 hover:shadow-md`}>
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">{f.replace(/^(Ms\.|Mr\.|Dr\.|Er\.)\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
            <p className="font-medium">{f}</p><p className="text-xs text-slate-500">Dept. of Computer Applications</p>
            <button className="mt-3 text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-400">Book 15-min slot</button>
          </div>
        ))}
        {!list.length && <p className="col-span-full py-10 text-center text-slate-500">No faculty found for "{q}".</p>}
      </div>
    </div>
  );
}
