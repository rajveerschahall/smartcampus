import React from "react";
import { CampusNotification } from "./data";
import { X, Check, Bell, AlertTriangle, FileText, Calendar, Award } from "lucide-react";
import { Pill } from "./ui";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CampusNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<CampusNotification[]>>;
  onNavigate: (page: string) => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  setNotifications,
  onNavigate
}: NotificationsModalProps) {
  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Attendance":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "Academic":
        return <FileText size={16} className="text-indigo-500" />;
      case "Event":
        return <Calendar size={16} className="text-purple-500" />;
      default:
        return <Award size={16} className="text-emerald-500" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-slate-950/40 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Campus Notifications</h3>
            <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[11px] font-bold">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markRead(n.id);
                if (n.linkPage) {
                  onNavigate(n.linkPage);
                  onClose();
                }
              }}
              className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                !n.read ? "bg-indigo-50/40 dark:bg-indigo-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {getCategoryIcon(n.category)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs ${!n.read ? "font-bold text-slate-900 dark:text-slate-100" : "font-medium text-slate-700 dark:text-slate-300"} truncate`}>
                    {n.title}
                  </h4>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {n.details}
                </p>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  {n.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
