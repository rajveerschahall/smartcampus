import React, { useState } from "react";
import { TIMETABLE, PERIODS, SUBJECTS, Slot } from "./data";
import { card, Pill, ghost, primary } from "./ui";
import { Clock, Calendar, MapPin, User, Info, Printer } from "lucide-react";

export default function Timetable() {
  const days = Object.keys(TIMETABLE);
  const currentDayIndex = new Date().getDay();
  const defaultDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDayIndex];
  const initialActiveDay = days.includes(defaultDay) ? defaultDay : "Monday";

  const [activeDay, setActiveDay] = useState<string>(initialActiveDay);
  const [selectedSlot, setSelectedSlot] = useState<{ slot: [string, string, string]; period: string } | null>(null);

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="text-indigo-600 dark:text-indigo-400" size={22} />
            Academic Weekly Timetable
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Odd Semester 2026–27 • BCA Section C • Room B-204 & Labs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()} 
            className={ghost}
            title="Print Schedule"
          >
            <Printer size={16} /> Print Timetable
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeDay === d
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Selected Day Timeline View */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TIMETABLE[activeDay]?.map((slot: Slot, index: number) => {
          const time = PERIODS[index];
          if (!slot) {
            return (
              <div
                key={index}
                className={`${card} p-4 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">Period {index + 1}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
                </div>
                <div className="my-6 text-center text-sm font-medium text-slate-400">
                  {index === 3 ? "🥗 Lunch / Recess Break" : "Free Lecture / Self Study"}
                </div>
                <div className="text-[11px] text-slate-400 text-right">No assigned room</div>
              </div>
            );
          }

          const [code, faculty, room] = slot;
          const isLab = room.toLowerCase().includes("lab");

          return (
            <div
              key={index}
              onClick={() => setSelectedSlot({ slot, period: time })}
              className={`${card} p-4.5 cursor-pointer relative overflow-hidden group hover:border-indigo-400 dark:hover:border-indigo-600`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${isLab ? "bg-purple-600" : "bg-indigo-600"}`} />
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Period {index + 1}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                {SUBJECTS[code] || code}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3 font-mono">
                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-semibold">{code}</span>
                {isLab && <Pill tone="purple">Practical Lab</Pill>}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 truncate max-w-[130px]" title={faculty}>
                  <User size={13} className="text-slate-400" /> {faculty}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <MapPin size={13} className="text-slate-400" /> {room}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Weekly Master Grid */}
      <section className={`${card} p-5 overflow-hidden`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Info size={16} className="text-indigo-600" /> Weekly Master Grid Overview
          </h3>
          <span className="text-xs text-slate-500">Scroll horizontally for all periods</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-300 w-24">Day</th>
                {PERIODS.map((p, i) => (
                  <th key={p} className="p-2 text-center font-medium text-slate-600 dark:text-slate-400">
                    <span className="font-semibold block text-slate-900 dark:text-slate-100">P{i + 1}</span>
                    <span className="text-[10px] text-slate-500">{p}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {days.map((d) => (
                <tr key={d} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-900">
                    {d}
                  </td>
                  {TIMETABLE[d]?.map((s: Slot, i: number) => (
                    <td key={i} className="p-1.5 align-top">
                      {s ? (
                        <div className="rounded-lg p-2 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 text-slate-900 dark:text-slate-200">
                          <b className="text-[11px] block truncate text-indigo-700 dark:text-indigo-300">{s[0]}</b>
                          <p className="text-[10px] truncate text-slate-600 dark:text-slate-400">{s[1]}</p>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            {s[2]}
                          </span>
                        </div>
                      ) : (
                        <div className="h-full min-h-[50px] rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                          {i === 3 ? "Break" : "—"}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Slot details modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedSlot(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Lecture Detail</span>
              <button onClick={() => setSelectedSlot(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {SUBJECTS[selectedSlot.slot[0]] || selectedSlot.slot[0]}
              </h3>
              <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{selectedSlot.slot[0]}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-xs text-slate-500 block">Faculty Incharge</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSlot.slot[1]}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-xs text-slate-500 block">Classroom / Lab</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSlot.slot[2]}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300">
                Timing: <b>{selectedSlot.period}</b> • Attendance criteria requires 75% minimum presence.
              </div>
            </div>
            <button className={`${primary} w-full mt-5`} onClick={() => setSelectedSlot(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
