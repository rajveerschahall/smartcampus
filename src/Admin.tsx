import React, { useEffect, useRef, useState } from "react";
import { Search, ScanLine, X, Check, ShieldCheck, Download, Users, FileCheck, Plus, Trash2 } from "lucide-react";
import { INITIAL_DUTY_LEAVES, DutyLeaveRequest, FACULTY, User as UserModel } from "./data";
import { card, primary, ghost, Pill, Empty, Modal, showToast } from "./ui";

const tone = { Verified: "green", Pending: "amber", Rejected: "red" } as const;

export interface TeacherRecord {
  id: string;
  eid: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  subject: string;
  cabin: string;
  active: boolean;
  dateJoined: string;
}

const INITIAL_TEACHERS: TeacherRecord[] = [
  {
    id: "tch-1",
    eid: "EID-1708",
    name: "MS. NAVJOT (MMS Navjot)",
    designation: "Assistant Professor",
    department: "Department of Computer Applications",
    email: "nanumahi786@gmail.com",
    phone: "+91 98721 34567",
    subject: "Programming in PHP (UGCA1929 & UGCA1930 Lab)",
    cabin: "Cabin B-205",
    active: true,
    dateJoined: "12 Aug 2021"
  },
  {
    id: "tch-2",
    eid: "EID-1612",
    name: "Mr. Jatinder Verma",
    designation: "Assistant Professor & Industry Liaison",
    department: "Department of Computer Applications",
    email: "jatinder.v@ggi.ac.in",
    phone: "+91 98144 56789",
    subject: "Data Structures & Algorithms (UGCA1912)",
    cabin: "Cabin C-102",
    active: true,
    dateJoined: "15 Jan 2020"
  },
  {
    id: "tch-3",
    eid: "EID-1540",
    name: "Mr. Harpreet Singh",
    designation: "Associate Professor & HOD",
    department: "Department of Computer Applications",
    email: "harpreet.s@ggi.ac.in",
    phone: "+91 98888 12345",
    subject: "Cloud Architecture & Distributed Systems",
    cabin: "Cabin B-201",
    active: true,
    dateJoined: "10 Jul 2018"
  },
  {
    id: "tch-4",
    eid: "EID-1801",
    name: "Mr. Rahul Soni",
    designation: "Assistant Professor",
    department: "Department of Computer Science & Engineering",
    email: "rahul.soni@ggi.ac.in",
    phone: "+91 97790 98765",
    subject: "Database Management Systems & SQL",
    cabin: "Cabin C-304",
    active: true,
    dateJoined: "01 Sep 2022"
  },
  {
    id: "tch-5",
    eid: "EID-1792",
    name: "Mr. Kartik Goyal",
    designation: "Assistant Professor (AI/ML Lead)",
    department: "Department of AI & Data Science",
    email: "kartik.g@ggi.ac.in",
    phone: "+91 95012 34567",
    subject: "Machine Learning & Neural Networks",
    cabin: "Cabin B-105",
    active: true,
    dateJoined: "05 Nov 2021"
  }
];

const TEACHERS_STORAGE_KEY = "ggi_admin_teachers_v1";

function Scanner({ onClose }: { onClose: () => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;
    let s: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } })
      .then(m => {
        if (!active) {
          m.getTracks().forEach(t => t.stop());
          return;
        }
        s = m;
        if (v.current) v.current.srcObject = m;
      })
      .catch(() => {
        if (active) setErr("Camera not available — demo mode active.");
      });

    return () => {
      active = false;
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

export default function Admin({ user }: { user?: UserModel | null }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<DutyLeaveRequest[]>(INITIAL_DUTY_LEAVES);
  const [scan, setScan] = useState(false);
  const [page, setPage] = useState(1);

  // Faculty Management State (Admin exclusive responsibility)
  const [teachers, setTeachers] = useState<TeacherRecord[]>(() => {
    try {
      const saved = localStorage.getItem(TEACHERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TEACHERS;
  });

  const [teacherSearch, setTeacherSearch] = useState("");
  const [addTeacherModalOpen, setAddTeacherModalOpen] = useState(false);

  // New Teacher Form State
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEid, setNewTeacherEid] = useState("");
  const [newTeacherDesig, setNewTeacherDesig] = useState("Assistant Professor");
  const [newTeacherDept, setNewTeacherDept] = useState("Department of Computer Applications");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [newTeacherPhone, setNewTeacherPhone] = useState("+91 ");
  const [newTeacherSubject, setNewTeacherSubject] = useState("");
  const [newTeacherCabin, setNewTeacherCabin] = useState("Cabin B-206");

  const saveTeachers = (next: TeacherRecord[]) => {
    setTeachers(next);
    try {
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = !user?.role || user?.role === "Admin";

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role && user.role !== "Admin") {
      showToast("Access Denied: Only Administrative Officers can provision teachers.", "error");
      return;
    }
    if (!newTeacherName.trim() || !newTeacherEid.trim() || !newTeacherEmail.trim()) {
      showToast("Please enter teacher name, EID, and email.", "error");
      return;
    }

    if (teachers.some(t => t.eid.trim().toLowerCase() === newTeacherEid.trim().toLowerCase())) {
      showToast(`Teacher with EID ${newTeacherEid} is already registered!`, "error");
      return;
    }

    const newTeacher: TeacherRecord = {
      id: `tch-${Date.now()}`,
      eid: newTeacherEid.trim().toUpperCase(),
      name: newTeacherName.trim(),
      designation: newTeacherDesig,
      department: newTeacherDept,
      email: newTeacherEmail.trim(),
      phone: newTeacherPhone.trim() || "+91 98000 00000",
      subject: newTeacherSubject.trim() || "UGCA Elective Subject",
      cabin: newTeacherCabin.trim() || "Faculty Block Cabin",
      active: true,
      dateJoined: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    };

    const next = [newTeacher, ...teachers];
    saveTeachers(next);
    showToast(`Teacher ${newTeacher.name} (${newTeacher.eid}) provisioned successfully!`, "success");

    // Reset form
    setNewTeacherName("");
    setNewTeacherEid("");
    setNewTeacherEmail("");
    setNewTeacherSubject("");
    setAddTeacherModalOpen(false);
  };

  const handleRemoveTeacher = (id: string, name: string) => {
    if (user?.role && user.role !== "Admin") {
      showToast("Access Denied: Only Administrative Officers can deactivate teachers.", "error");
      return;
    }
    const next = teachers.filter(t => t.id !== id);
    saveTeachers(next);
    showToast(`Teacher ${name} deactivated from staff roster.`, "info");
  };

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.eid.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.department.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
  );

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

      {/* Faculty & Teacher Provisioning Console (Admin Exclusive - User Requirement) */}
      <section className={`${card} p-5 space-y-4 border-2 border-indigo-200 dark:border-indigo-900/60`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
              <Users size={20} className="text-indigo-600" />
              Faculty & Teacher Staff Provisioning Console
            </h3>
            <p className="text-xs text-slate-500">
              Admin Exclusive Authority: Enroll new faculty, assign course codes, and configure biometric staff profiles.
            </p>
          </div>
          <button
            onClick={() => setAddTeacherModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md transition shrink-0"
          >
            <Plus size={15} />
            <span>➕ Add New Teacher / Faculty</span>
          </button>
        </div>

        {/* Teacher Search & Quick Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={teacherSearch}
              onChange={(e) => setTeacherSearch(e.target.value)}
              placeholder="Search teacher by name, EID, or department..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-xs"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold">Total Faculty: <b>{teachers.length}</b></span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">Active: {teachers.filter(t => t.active).length}</span>
          </div>
        </div>

        {/* Teachers Directory Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">EID</th>
                <th className="px-4 py-3">Teacher Name</th>
                <th className="px-4 py-3">Designation & Department</th>
                <th className="px-4 py-3">Assigned Subjects</th>
                <th className="px-4 py-3">Contact & Cabin</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                    {t.eid}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{t.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{t.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{t.designation}</span>
                    <span className="text-[10px] text-slate-500">{t.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium text-[11px]">
                      {t.subject}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    <div>{t.cabin}</div>
                    <div className="text-[10px] text-slate-400">{t.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={t.active ? "green" : "red"}>
                      {t.active ? "Active Faculty" : "On Leave"}
                    </Pill>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemoveTeacher(t.id, t.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      title="Deactivate / Remove Teacher"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    No faculty found matching "{teacherSearch}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add New Teacher Modal */}
      {addTeacherModalOpen && (
        <Modal
          isOpen={addTeacherModalOpen}
          onClose={() => setAddTeacherModalOpen(false)}
          title="Add New Faculty Member — GGI HR & Admin Desk"
        >
          <form onSubmit={handleAddTeacher} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="e.g. Dr. Jaspreet Singh"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Employee ID (EID) *
                </label>
                <input
                  type="text"
                  required
                  value={newTeacherEid}
                  onChange={(e) => setNewTeacherEid(e.target.value)}
                  placeholder="e.g. EID-1825"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Designation *
                </label>
                <select
                  value={newTeacherDesig}
                  onChange={(e) => setNewTeacherDesig(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold"
                >
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                  <option value="Lecturer / Lab Instructor">Lecturer / Lab Instructor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department *
                </label>
                <select
                  value={newTeacherDept}
                  onChange={(e) => setNewTeacherDept(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold"
                >
                  <option value="Department of Computer Applications">Department of Computer Applications (BCA/MCA)</option>
                  <option value="Department of Computer Science & Engineering">Department of Computer Science & Engineering (B.Tech CSE)</option>
                  <option value="Department of Artificial Intelligence & Data Science">Department of AI & Data Science</option>
                  <option value="Department of Business Administration">Department of Business Administration (BBA/MBA)</option>
                  <option value="Department of Mechanical Engineering">Department of Mechanical Engineering</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  placeholder="e.g. jaspreet.s@ggi.ac.in"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={newTeacherPhone}
                  onChange={(e) => setNewTeacherPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Subject / Laboratory Code *
                </label>
                <input
                  type="text"
                  required
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                  placeholder="e.g. Cloud Computing (UGCA1928)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Faculty Cabin / Office Location
                </label>
                <input
                  type="text"
                  value={newTeacherCabin}
                  onChange={(e) => setNewTeacherCabin(e.target.value)}
                  placeholder="e.g. Cabin B-206"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAddTeacherModalOpen(false)}
                className={ghost}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={primary}
              >
                Enroll & Provision Teacher
              </button>
            </div>
          </form>
        </Modal>
      )}

      {scan && <Scanner onClose={() => setScan(false)} />}
    </div>
  );
}
