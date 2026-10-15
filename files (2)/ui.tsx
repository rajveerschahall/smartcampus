import React, { ReactNode } from "react";
import { X } from "lucide-react";

export const card = "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-200 hover:shadow-md";
export const btn = "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";
export const primary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800`;
export const secondary = `${btn} bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700`;
export const ghost = `${btn} border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800`;
export const danger = `${btn} bg-red-600 text-white hover:bg-red-700 active:bg-red-800`;
export const success = `${btn} bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800`;

const tones: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950/70 dark:text-emerald-300 dark:ring-emerald-500/30",
  emerald: "bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950/70 dark:text-emerald-300 dark:ring-emerald-500/30",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950/70 dark:text-amber-300 dark:ring-amber-500/30",
  red: "bg-red-50 text-red-800 ring-red-600/20 dark:bg-red-950/70 dark:text-red-300 dark:ring-red-500/30",
  slate: "bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  indigo: "bg-indigo-50 text-indigo-800 ring-indigo-600/20 dark:bg-indigo-950/70 dark:text-indigo-300 dark:ring-indigo-500/30",
  purple: "bg-purple-50 text-purple-800 ring-purple-600/20 dark:bg-purple-950/70 dark:text-purple-300 dark:ring-purple-500/30",
  sky: "bg-sky-50 text-sky-800 ring-sky-600/20 dark:bg-sky-950/70 dark:text-sky-300 dark:ring-sky-500/30",
};

export const Pill = ({ tone = "slate", children, className = "" }: { tone?: keyof typeof tones; children: ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone] || tones.slate} ${className}`}>
    {children}
  </span>
);

export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`} />
);

export const Empty = ({ icon, title, hint, action }: { icon: ReactNode; title: string; hint: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center gap-2 py-12 text-center">
    <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      {icon}
    </div>
    <p className="font-semibold text-slate-900 dark:text-slate-100">{title}</p>
    <p className="max-w-xs text-sm text-slate-600 dark:text-slate-400">{hint}</p>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export const pctTone = (p: number): keyof typeof tones => (p >= 75 ? "green" : p >= 60 ? "amber" : "red");

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; maxWidth?: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true" onClick={onClose}>
      <div className={`relative w-full ${maxWidth} rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800`} onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Global lightweight Toast dispatch mechanism
export interface ToastMessage {
  id: string;
  title: string;
  type?: "success" | "error" | "info";
}

let toastListeners: Array<(toasts: ToastMessage[]) => void> = [];
let currentToasts: ToastMessage[] = [];

export function showToast(title: string, type: "success" | "error" | "info" = "success") {
  const newToast: ToastMessage = { id: Math.random().toString(), title, type };
  currentToasts = [...currentToasts, newToast];
  toastListeners.forEach(listener => listener(currentToasts));
  setTimeout(() => {
    currentToasts = currentToasts.filter(t => t.id !== newToast.id);
    toastListeners.forEach(listener => listener(currentToasts));
  }, 3500);
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  React.useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter(l => l !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-xl text-sm font-medium text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom-2 duration-200">
          <span className={`h-2.5 w-2.5 rounded-full ${t.type === "error" ? "bg-red-500" : t.type === "info" ? "bg-indigo-500" : "bg-emerald-500"}`} />
          <span>{t.title}</span>
        </div>
      ))}
    </div>
  );
}
