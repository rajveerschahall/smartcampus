import { useState } from "react";
import { BookOpen, CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard, Menu, Moon, Sun, Users } from "lucide-react";
import Events from "./Events";
import Faculty from "./Faculty";

const NAV = [
  { group: "Academic", items: [{ id: "dash", label: "Dashboard", icon: LayoutDashboard }, { id: "faculty", label: "Faculty Panel", icon: ClipboardCheck }, { id: "marks", label: "Marks & Grades", icon: GraduationCap }, { id: "assign", label: "Assignments", icon: BookOpen }] },
  { group: "Campus Life", items: [{ id: "events", label: "Event Portal", icon: CalendarDays }, { id: "team", label: "Team Builder", icon: Users }] },
];

export default function App() {
  const [page, setPage] = useState("events");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const title = NAV.flatMap((g) => g.items).find((i) => i.id === page)?.label;

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <aside className={`${collapsed ? "w-16" : "w-64"} shrink-0 border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900`}>
          <div className="flex items-center gap-3 p-4">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-semibold text-white">FA</div>
            {!collapsed && <div><p className="text-sm font-semibold">Faculty Demo</p><span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">Faculty</span></div>}
          </div>
          <nav className="px-2">
            {NAV.map((g) => (
              <div key={g.group} className="mb-4">
                {!collapsed && <p className="px-3 pb-1 text-xs font-medium text-slate-500">{g.group}</p>}
                {g.items.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setPage(id)} title={label} aria-current={page === id ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm ${page === id ? "bg-indigo-50 font-medium text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                    <Icon size={18} />{!collapsed && label}
                  </button>))}
              </div>))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <button aria-label="Toggle sidebar" onClick={() => setCollapsed(!collapsed)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><Menu size={18} /></button>
            <input aria-label="Search" placeholder="Search events, subjects, faculty (Ctrl+K)" className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            <button aria-label="Toggle theme" onClick={() => setDark(!dark)} className="ml-auto rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {page === "events" || page === "team" ? <Events /> : page === "faculty" ? <Faculty /> : <p className="text-slate-600 dark:text-slate-400">This page uses your existing module.</p>}
          </main>
        </div>
      </div>
    </div>
  );
}
