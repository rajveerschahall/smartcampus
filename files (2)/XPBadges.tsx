import React from "react";
import { BADGES, LEADERBOARD } from "./data";
import { card, Pill, primary } from "./ui";
import { Trophy, Award, Flame, Star, Sparkles, CheckCircle2, Lock } from "lucide-react";

export default function XPBadges() {
  const currentXP = 1240;
  const nextLevelXP = 1500;
  const progressPct = Math.round((currentXP / nextLevelXP) * 100);

  return (
    <div className="space-y-6">
      {/* Level Banner */}
      <div className={`${card} p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white relative overflow-hidden`}>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/5 rounded-l-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">Level 4 — Campus Prodigy</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-bold uppercase">
                  Top Tier
                </span>
              </div>
              <p className="text-indigo-200 text-sm mt-0.5">
                Rajveer Singh • BCA Year 3 • Ranked #3 in Department
              </p>
            </div>
          </div>

          <div className="md:text-right">
            <span className="text-3xl font-extrabold tracking-tight">{currentXP.toLocaleString()}</span>
            <span className="text-indigo-200 text-sm ml-1 font-medium">/ {nextLevelXP} XP</span>
            <p className="text-xs text-indigo-200 mt-1">260 XP needed for Level 5 "Campus Legend"</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5 relative z-10">
          <div className="flex justify-between text-xs font-semibold text-indigo-200">
            <span>Progress to Next Rank</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-3 w-full bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Badges Collection */}
        <section className={`${card} p-5 lg:col-span-3 space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award size={18} className="text-indigo-600" /> Unlocked Badges & Achievements
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {BADGES.filter(b => b.unlocked).length} of {BADGES.length} Unlocked
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {BADGES.map(b => (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  b.unlocked
                    ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-indigo-400"
                    : "border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-60"
                }`}
              >
                <div className="text-2xl p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                  {b.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {b.title}
                    </h4>
                    {b.unlocked ? (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 size={11} /> {b.date}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Lock size={10} /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
            <span className="text-indigo-900 dark:text-indigo-300 font-medium">
              💡 Tip: Participate in Tech Fest 2026 to unlock <b>+500 XP</b> and the <b>Dean's Trophy</b> badge.
            </span>
          </div>
        </section>

        {/* Department Leaderboard */}
        <section className={`${card} p-5 lg:col-span-2 space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" /> Dept. Leaderboard
            </h3>
            <span className="text-xs text-slate-500 font-medium">BCA Year 3</span>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {LEADERBOARD.map(user => (
              <li
                key={user.roll}
                className={`py-3 flex items-center justify-between gap-2 px-2 rounded-lg transition-colors ${
                  user.isCurrent ? "bg-indigo-50/80 dark:bg-indigo-950/50 font-bold" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1
                        ? "bg-amber-400 text-amber-950"
                        : user.rank === 2
                        ? "bg-slate-300 text-slate-800"
                        : user.rank === 3
                        ? "bg-amber-600 text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {user.rank}
                  </span>
                  <div>
                    <span className="text-slate-900 dark:text-slate-100 block text-xs font-semibold">
                      {user.name} {user.isCurrent && " (You)"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Roll {user.roll} • {user.badge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {user.xp}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-normal">XP</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
