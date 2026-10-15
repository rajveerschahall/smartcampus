import React, { useState } from "react";
import { INITIAL_APPOINTMENTS, Appointment, FACULTY } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";
import { UserCheck, Clock, Calendar, MapPin, Video, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faculty, setFaculty] = useState(FACULTY[0]);
  const [date, setDate] = useState("2026-10-18");
  const [slot, setSlot] = useState("11:30 AM");
  const [topic, setTopic] = useState("");

  const timeSlots = ["09:30 AM", "10:15 AM", "11:30 AM", "01:00 PM", "02:30 PM", "03:15 PM", "04:00 PM"];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast("Please provide an agenda or discussion topic.", "error");
      return;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      studentName: "Rajveer Singh",
      facultyName: faculty,
      date: new Date(date + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      timeSlot: slot,
      topic,
      status: "Pending",
      location: "Faculty Office B-205 / Virtual Meet"
    };

    setAppointments([newApt, ...appointments]);
    showToast(`15-min slot requested with ${faculty}!`, "success");
    setIsModalOpen(false);
    setTopic("");
  };

  const statusTone = {
    Approved: "green",
    Pending: "amber",
    Completed: "slate",
    Cancelled: "red",
  } as const;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="text-indigo-600 dark:text-indigo-400" size={22} />
            Faculty 1-on-1 Appointments
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Book 15-minute guidance slots for doubt resolution, project architecture, or mentorship.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={primary}>
          <Plus size={16} /> Book New Slot
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {appointments.map(apt => (
          <div key={apt.id} className={`${card} p-5 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {apt.facultyName}
                </span>
                <Pill tone={statusTone[apt.status]}>{apt.status}</Pill>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                {apt.topic}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 my-3">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Calendar size={14} className="text-indigo-500" />
                  <span>{apt.date}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Clock size={14} className="text-indigo-500" />
                  <span>{apt.timeSlot} (15m)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-500 truncate max-w-[200px]">
                <MapPin size={13} /> {apt.location}
              </span>
              {apt.status === "Approved" && (
                <a
                  href="#meet"
                  onClick={(e) => { e.preventDefault(); showToast("Connecting to Google Meet room...", "info"); }}
                  className="flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
                >
                  <Video size={13} /> Join Meet
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book 15-Minute Faculty Slot"
      >
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Faculty Member
            </label>
            <select
              value={faculty}
              onChange={e => setFaculty(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800"
            >
              {FACULTY.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min="2026-10-14"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                15-Min Available Slot
              </label>
              <select
                value={slot}
                onChange={e => setSlot(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800"
              >
                {timeSlots.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Topic or Agenda
            </label>
            <textarea
              required
              value={topic}
              onChange={e => setTopic(e.target.value)}
              rows={3}
              placeholder="E.g. Review Docker container setup for Cloud Computing project..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className={ghost}>
              Cancel
            </button>
            <button type="submit" className={primary}>
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
