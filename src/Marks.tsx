import React, { useState } from "react";
import { MARKS_DATA, SUBJECTS, MST } from "./data";
import { card, Pill, ghost, primary } from "./ui";
import { GraduationCap, Award, BarChart3, TrendingUp, Calendar, FileText, CheckCircle } from "lucide-react";

export default function Marks() {
  const [selectedSemester, setSelectedSemester] = useState<number>(5);

  const semesters = [
    { sem: 1, sgpa: 8.20, status: "Passed", credits: 22 },
    { sem: 2, sgpa: 8.45, status: "Passed", credits: 24 },
    { sem: 3, sgpa: 8.70, status: "Passed", credits: 23 },
    { sem: 4, sgpa: 8.65, status: "Passed", credits: 22 },
    { sem: 5, sgpa: 8.85, status: "Ongoing", credits: 24, predicted: true },
  ];

  const currentCGPA = 8.57;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${card} p-5 relative overflow-hidden bg-gradient-to-br from-indigo-50/70 to-white dark:from-slate-900 dark:to-indigo-950/20`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumulative CGPA</span>
            <Pill tone="indigo">Top 5%</Pill>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{currentCGPA}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Out of 10.0 scale • First Division with Distinction</p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expected Sem 5 SGPA</span>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">8.85</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Based on MST-I + Internal continuous evaluation</p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Credits Earned</span>
            <Award size={18} className="text-indigo-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">91 <span className="text-sm font-normal text-slate-500">/ 138</span></p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Zero backlogs • Consistent academic standing</p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next MST Schedule</span>
            <Calendar size={18} className="text-purple-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{MST[1].name}</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">30 Oct – 05 Nov 2026</p>
        </div>
      </div>

      {/* Semester Progression Chart Bar */}
      <section className={`${card} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600" /> Semester-wise SGPA Progression
          </h3>
          <span className="text-xs text-slate-500 font-medium">BCA Batch 2024–2027</span>
        </div>

        <div className="grid grid-cols-5 gap-3 pt-4">
          {semesters.map((s) => (
            <div
              key={s.sem}
              onClick={() => setSelectedSemester(s.sem)}
              className={`cursor-pointer rounded-xl p-3 border text-center transition-all ${
                selectedSemester === s.sem
                  ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <span className="text-xs text-slate-500 block mb-1">Sem {s.sem}</span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{s.sgpa}</span>
              <div className="mt-2 flex justify-center">
                <Pill tone={s.predicted ? "amber" : "green"}>{s.status}</Pill>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Semester Continuous Internal Assessment Breakdown */}
      <section className={`${card} overflow-hidden`}>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Continuous Internal Assessment (Semester 5)
            </h3>
            <p className="text-xs text-slate-500">
              MST-I (24) • MST-II (24 best of two normalized) • Assignments (10) • Attendance (6) • Total Internal (40)
            </p>
          </div>
          <button className={ghost} onClick={() => window.print()}>
            <FileText size={15} /> Download Scorecard
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Subject</th>
                <th className="px-4 py-3.5 font-semibold text-center">MST-I (24)</th>
                <th className="px-4 py-3.5 font-semibold text-center">MST-II (24)</th>
                <th className="px-4 py-3.5 font-semibold text-center">Assignments (10)</th>
                <th className="px-4 py-3.5 font-semibold text-center">Attendance (6)</th>
                <th className="px-4 py-3.5 font-semibold text-center">Internal (40)</th>
                <th className="px-5 py-3.5 font-semibold text-right">Grade Letter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MARKS_DATA.map((m) => (
                <tr key={m.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {SUBJECTS[m.code] || m.code}
                    </div>
                    <div className="text-xs font-mono text-slate-500">{m.code}</div>
                  </td>
                  <td className="px-4 py-3.5 text-center font-semibold text-slate-800 dark:text-slate-200">
                    {m.mst1}
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-400">
                    {m.mst2} <span className="text-[10px] text-slate-400">(Proj)</span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-800 dark:text-slate-200">
                    {m.assignmentMarks}
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-800 dark:text-slate-200">
                    {m.attendanceMarks}
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-indigo-700 dark:text-indigo-400">
                    {m.totalInternal} / 40
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Pill tone={m.gradeLetter === "O" || m.gradeLetter === "A+" ? "green" : "indigo"}>
                      Grade {m.gradeLetter}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
