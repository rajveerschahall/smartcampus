import React, { useEffect, useRef, useState } from "react";
import { Search, ScanLine, X, Check, ShieldCheck, Download, Users, FileCheck } from "lucide-react";
import { INITIAL_DUTY_LEAVES, DutyLeaveRequest, FACULTY } from "./data";
import { card, primary, ghost, Pill, Empty, showToast } from "./ui";

const tone = { Verified: "green", Pending: "amber", Rejected: "red" } as const;

function Scanner({ onClose }: { onClose: () => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let s: MediaStream;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } })
      .then(m => {
        s = m;
        if (v.current) v.current.srcObject = m;
      })
      .catch(() => setErr("Camera not available — demo mode active."));

    return () => {
      s?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleSimulate = () => {
    setOk(true);
    showToast("QR verified! Entry granted for Rajveer Singh (Tech Fest).", "success");
  };

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white p-5 shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200"
      role="dialog"
      aria-label="QR scanner"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ScanLine size={18} className="text-indigo-600" /> Live QR Gate Check-in
        </h3>
        <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
        <video ref={v} autoPlay playsInline muted className="h-full w-full object-cover" />
        <div
          className={`absolute inset-10 rounded-xl border-4 transition-colors duration-300 ${
            ok ? "border-emerald-400" : "border-white/80"
          }`}
        />
        {!ok && <div className="absolute inset-x-10 top-1/2 h-0.5 animate-pulse bg-indigo-400" />}
        {err && <p className="absolute bottom-3 left-3 right-3 text-center text-xs text-slate-300 bg-black/60 py-1 rounded">{err}</p>}
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm font-medium" aria-live="polite">
        {ok ? (
          <span className="text-emerald-600 flex items-center gap-1.5 font-bold">
            <Check size={18} /> Verified: Rajveer Singh • Tech Fest 2026 (Debate Captain)
          </span>
        ) : (
          <span className="text-slate-600 dark:text-slate-400">
            Point camera at student's rotating HMAC QR code.
          </span>
        )}
      </p>

      <div className="mt-4 flex gap-2">
        <button className={`${primary} flex-1`} onClick={handleSimulate}>
          Simulate Successful Check-In
        </button>
        {ok && (
          <button className={ghost} onClick={() => setOk(false)}>
            Reset
          </button>
        )}
      </div>
    </aside>
  );
}

export default function Admin() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<DutyLeaveRequest[]>(INITIAL_DUTY_LEAVES);
  const [scan, setScan] = useState(false);
  const [page, setPage] = useState(1);

  const f = rows.filter(r =>
    (r.studentName + r.studentId + r.event + r.reason).toLowerCase().includes(q.toLowerCase())
  );
  const per = 4;
  const pages = Math.max(1, Math.ceil(f.length / per));

  const setStatus = (id: string, status: "Verified" | "Pending" | "Rejected") => {
    setRows(rows.map(r => (r.id === id ? { ...r, status, approvedBy: "Admin Office" } : r)));
    showToast(`Request ${id} marked as ${status}!`, status === "Verified" ? "success" : "info");
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={22} />
            Administrative Office & Faculty Verification Console
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage Duty Leave verification queue, live event gates check-in and faculty records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className={primary} onClick={() => setScan(true)}>
            <ScanLine size={16} /> Open QR Gate Scanner
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <span className="sr-only">Search</span>
          <input
            value={q}
            onChange={e => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search student name, roll number, or event..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900 shadow-sm"
          />
        </label>
        <button
          onClick={() => showToast("Exporting duty leave audit sheet (CSV)...", "info")}
          className={ghost}
        >
          <Download size={15} /> Export Audit Log
        </button>
      </div>

      {/* Duty Leave Table */}
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              {["Student", "Request Type", "Event & Reason", "Date", "Status", "Action"].map(h => (
                <th key={h} className="px-5 py-3.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {f.slice((page - 1) * per, page * per).map(r => (
              <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="px-5 py-4">
                  <b className="font-semibold text-slate-900 dark:text-slate-100">{r.studentName}</b>
                  <br />
                  <span className="text-xs font-mono text-slate-500">Roll: {r.studentId}</span>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                  {r.type}
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200">{r.event}</div>
                  <span className="text-xs text-slate-500 line-clamp-1">{r.reason}</span>
                </td>
                <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {r.dates}
                </td>
                <td className="px-5 py-4">
                  <Pill tone={tone[r.status]}>
                    {r.status === "Pending" ? "Pending Signoff" : r.status}
                  </Pill>
                </td>
                <td className="px-5 py-4 text-right">
                  {r.status === "Pending" ? (
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        className={`${ghost} !py-1 !px-2.5 text-xs text-red-600 hover:text-red-700`}
                        onClick={() => setStatus(r.id, "Rejected")}
                      >
                        Reject
                      </button>
                      <button
                        className={`${primary} !py-1 !px-3 text-xs`}
                        onClick={() => setStatus(r.id, "Verified")}
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {f.length === 0 && (
          <Empty
            icon={<Search size={22} />}
            title="No student records found"
            hint="Try searching a different student name or roll number."
          />
        )}

        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-5 py-3 text-xs">
          <span className="text-slate-500">
            Page {page} of {pages} ({f.length} total records)
          </span>
          <div className="flex gap-2">
            <button
              className={`${ghost} !py-1 text-xs`}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button
              className={`${ghost} !py-1 text-xs`}
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Department Faculty Directory */}
      <section className={`${card} p-5 space-y-3`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
            <Users size={18} className="text-indigo-600" />
            Department Faculty Directory ({FACULTY.length})
          </h3>
          <span className="text-xs text-slate-500">Dept. of Computer Applications</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {FACULTY.map(n => (
            <span
              key={n}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {n}
            </span>
          ))}
        </div>
      </section>

      {scan && <Scanner onClose={() => setScan(false)} />}
    </div>
  );
}
