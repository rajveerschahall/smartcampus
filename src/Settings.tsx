import React, { useState } from "react";
import { User } from "./data";
import { card, primary, ghost, Pill, showToast } from "./ui";
import { Settings as SettingsIcon, Bell, Shield, User as UserIcon, Moon, Smartphone, Check } from "lucide-react";

export default function Settings({ user, dark, setDark }: { user: User; dark: boolean; setDark: (d: boolean) => void }) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [waAlerts, setWaAlerts] = useState(true);
  const [attendanceWarningAlert, setAttendanceWarningAlert] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [phone, setPhone] = useState("+91 98765 43210");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Notification preferences updated successfully!", "success");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) {
      showToast("Please enter current and new password.", "error");
      return;
    }
    showToast("Password changed securely!", "success");
    setOldPass("");
    setNewPass("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="text-indigo-600 dark:text-indigo-400" size={22} />
          Account & Campus Preferences
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage your student profile, alert channels and institutional authentication settings.
        </p>
      </div>

      {/* Student Profile Card */}
      <section className={`${card} p-5 space-y-4`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {user.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
              <Pill tone="indigo">{user.role}</Pill>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{user.meta}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Department</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {user.department || "Dept. of Computer Applications"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Registration Roll Number</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {user.rollNo || "2433613"}
            </span>
          </div>
        </div>
      </section>

      {/* Notification Channels */}
      <section className={`${card} p-5`}>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1 flex items-center gap-2">
          <Bell size={18} className="text-indigo-600" /> Smart Alert Channels
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Choose where you want to receive critical attendance drop warnings and deadline pings.
        </p>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  Attendance Drop Alerts (&lt; 75%)
                </span>
                <span className="text-xs text-slate-500">
                  Instant push ping whenever biometric attendance in any subject drops below 75%.
                </span>
              </div>
              <input
                type="checkbox"
                checked={attendanceWarningAlert}
                onChange={e => setAttendanceWarningAlert(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  Assignment Due Reminders (24h prior)
                </span>
                <span className="text-xs text-slate-500">
                  Daily deadline digest for coursework submissions.
                </span>
              </div>
              <input
                type="checkbox"
                checked={assignmentReminders}
                onChange={e => setAssignmentReminders(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  WhatsApp Notifications
                </span>
                <span className="text-xs text-slate-500">
                  Receive verified campus passes & Duty Leave signoffs on {phone}
                </span>
              </div>
              <input
                type="checkbox"
                checked={waAlerts}
                onChange={e => setWaAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>

          <button type="submit" className={primary}>
            Save Notification Settings
          </button>
        </form>
      </section>

      {/* Security & Password */}
      <section className={`${card} p-5`}>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1 flex items-center gap-2">
          <Shield size={18} className="text-indigo-600" /> Security & Passwords
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Update your student portal login credentials.
        </p>

        <form onSubmit={handlePasswordChange} className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={oldPass}
              onChange={e => setOldPass(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="sm:col-span-2 pt-2">
            <button type="submit" className={ghost}>
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
