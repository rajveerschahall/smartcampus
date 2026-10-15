import React, { useState } from "react";
import { ATTENDANCE, SUBJECTS } from "./data";
import { card, Pill, pctTone, primary, ghost } from "./ui";
import { CheckCircle2, AlertTriangle, XCircle, Calculator, TrendingUp, ShieldAlert, BookOpen } from "lucide-react";

export default function Attendance() {
  const [filter, setFilter] = useState<"all" | "safe" | "warning">("all");
  const [includeDutyLeave, setIncludeDutyLeave] = useState(false);
  const [calcSubject, setCalcSubject] = useState<string>("UGCA1936");
  const [targetPercent, setTargetPercent] = useState<number>(75);

  // Overall attendance calculation
  const totalAttended = ATTENDANCE.reduce((sum, r) => sum + r[1] + (includeDutyLeave ? 1 : 0), 0);
  const totalLectures = ATTENDANCE.reduce((sum, r) => sum + r[2], 0);
  const overallPct = +((totalAttended / totalLectures) * 100).toFixed(1);

  // Filtered rows
  const rows = ATTENDANCE.map(([code, p, t]) => {
    const adjustedP = p + (includeDutyLeave ? 1 : 0);
    const pct = +((adjustedP / t) * 100).toFixed(1);
    const neededFor75 = Math.max(0, Math.ceil((0.75 * t - adjustedP) / 0.25));
    const safeBunks = Math.max(0, Math.floor((adjustedP - 0.75 * t) / 0.75));
    return {
      code,
      name: SUBJECTS[code] || code,
      present: adjustedP,
      total: t,
      pct,
      neededFor75,
      safeBunks,
    };
  }).filter((item) => {
    if (filter === "safe") return item.pct >= 75;
    if (filter === "warning") return item.pct < 75;
    return true;
  });

  // Selected subject for target calculator
  const selectedItem = rows.find(r => r.code === calcSubject) || rows[0];
  const denom = Math.max(0.01, 1 - (targetPercent / 100));
  const customTargetNeeded = Math.max(0, Math.ceil(( (targetPercent / 100) * selectedItem.total - selectedItem.present ) / denom));
  const targetBunks = Math.max(0, Math.floor((selectedItem.present - (targetPercent / 100) * selectedItem.total) / (targetPercent / 100)));

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${card} p-5 relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Aggregate</span>
            <Pill tone={pctTone(overallPct)}>{overallPct >= 75 ? "Eligible for Exams" : "Detention Warning"}</Pill>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{overallPct}%</span>
            <span className="text-xs text-slate-500 font-medium">({totalAttended}/{totalLectures} lectures)</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${overallPct >= 75 ? "bg-emerald-500" : overallPct >= 65 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(100, overallPct)}%` }}
            />
          </div>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subjects on Track</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {rows.filter(r => r.pct >= 75).length} <span className="text-sm font-normal text-slate-500">of {rows.length}</span>
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Safe above 75% threshold</p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shortage Warnings</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {rows.filter(r => r.pct < 75).length} <span className="text-sm font-normal text-slate-500">subjects</span>
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">Requires immediate recovery</p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duty Leave Impact</span>
            <TrendingUp size={18} className="text-indigo-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Include Approved DL</span>
            <input 
              type="checkbox"
              id="dutyLeaveToggle"
              checked={includeDutyLeave}
              onChange={(e) => setIncludeDutyLeave(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <label htmlFor="dutyLeaveToggle" className="text-xs text-slate-500 mt-2 block cursor-pointer">
            {includeDutyLeave ? "✓ Adjusted with 1 DL credit per course" : "Showing raw classroom biometric data"}
          </label>
        </div>
      </div>

      {/* Interactive Attendance Goal Calculator */}
      <section className={`${card} p-5 bg-gradient-to-r from-indigo-50/50 via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
              <Calculator size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Smart Bunk & Attendance Recovery Calculator
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Simulate how many upcoming lectures you need to attend consecutively to achieve your target percentage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subject</label>
              <select
                value={calcSubject}
                onChange={e => setCalcSubject(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {rows.map(r => (
                  <option key={r.code} value={r.code}>{r.code} — {r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Target %</label>
              <select
                value={targetPercent}
                onChange={e => setTargetPercent(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value={75}>75% (Minimum Passing)</option>
                <option value={80}>80% (Safe Target)</option>
                <option value={85}>85% (Distinction)</option>
                <option value={90}>90% (Exam Exemption)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculator Output */}
        <div className="mt-4 p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-700 dark:text-indigo-400">{selectedItem.name}:</span>
            <span className="text-slate-600 dark:text-slate-300">
              Currently at <b>{selectedItem.pct}%</b> ({selectedItem.present}/{selectedItem.total})
            </span>
          </div>
          <div>
            {selectedItem.pct >= targetPercent ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Target met! You can safely miss <b>{targetBunks}</b> lecture{targetBunks === 1 ? "" : "s"} and maintain {targetPercent}%.
              </span>
            ) : (
              <span className="text-red-700 dark:text-red-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert size={16} /> Attend next <b>{customTargetNeeded}</b> lectures consecutively to hit {targetPercent}%.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filter === "all" ? "bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}
          >
            All Subjects ({ATTENDANCE.length})
          </button>
          <button
            onClick={() => setFilter("safe")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filter === "safe" ? "bg-white dark:bg-slate-900 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
          >
            Safe ≥ 75%
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filter === "warning" ? "bg-white dark:bg-slate-900 shadow-sm text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`}
          >
            Shortage &lt; 75%
          </button>
        </div>
        <span className="text-xs text-slate-500">University Mandatory: 75% for appearing in end-term exams</span>
      </div>

      {/* Main Detailed Attendance Table */}
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Subject & Code</th>
              <th className="px-4 py-3.5 font-semibold text-center">Attended / Total</th>
              <th className="px-4 py-3.5 font-semibold">Percentage</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold text-right">Guidance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((r) => (
              <tr key={r.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-600 shrink-0" />
                    {r.name}
                  </div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-6">
                    {r.code}
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-mono font-medium text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{r.present}</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-slate-500">{r.total}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${r.pct >= 75 ? "bg-emerald-500" : r.pct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, r.pct)}%` }}
                      />
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{r.pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Pill tone={pctTone(r.pct)}>
                    {r.pct >= 75 ? "Eligible" : r.pct >= 60 ? "Warning" : "Critical"}
                  </Pill>
                </td>
                <td className="px-5 py-4 text-right text-xs">
                  {r.pct >= 75 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      Can miss {r.safeBunks} class{r.safeBunks === 1 ? "" : "es"}
                    </span>
                  ) : (
                    <span className="text-red-700 dark:text-red-400 font-semibold">
                      Must attend next {r.neededFor75} class{r.neededFor75 === 1 ? "" : "es"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
