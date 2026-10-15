import React, { useState, useMemo } from "react";
import {
  UserCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  FileText,
  Check,
  X,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Lock,
  History,
  Download,
  RefreshCw,
  Calendar,
  CheckCheck,
  FileSpreadsheet,
  Info,
  Sparkles,
  TrendingUp,
  Award,
  Video,
  UserX,
  ArrowRight
} from "lucide-react";
import { card, primary, ghost, danger, success, secondary, Pill, Modal, showToast } from "./ui";

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Duty Leave";

export interface StudentRecord {
  srNo: number;
  rollNo: string;
  name: string;
  email: string;
  branch: string;
  todayStatus: AttendanceStatus;
  attendedLectures: number;
  totalLectures: number;
  mstMarks: number; // Max 24
  internalMarks: number; // Max 40
  active: boolean;
}

export interface AppointmentItem {
  id: string;
  studentName: string;
  rollNo: string;
  timeSlot: string;
  date: string;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected";
  mode: "Offline (Cabin B-205)" | "Google Meet";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  facultyId: string;
  facultyName: string;
  action: string;
  details: string;
  signatureHash: string;
  type: "Attendance" | "Marks" | "Student" | "Appointment";
}

// Pre-loaded dataset of 32 students
const INITIAL_STUDENTS: StudentRecord[] = [
  { srNo: 1, rollNo: "2433582", name: "Navjot Kaur", email: "navjot.k@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 24, totalLectures: 27, mstMarks: 21, internalMarks: 36, active: true },
  { srNo: 2, rollNo: "2433588", name: "Nleya Ishmael M", email: "ishmael.n@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 22, totalLectures: 27, mstMarks: 19, internalMarks: 33, active: true },
  { srNo: 3, rollNo: "2433590", name: "Om Parkash", email: "om.parkash@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Absent", attendedLectures: 18, totalLectures: 27, mstMarks: 16, internalMarks: 28, active: true },
  { srNo: 4, rollNo: "2433593", name: "Pardeep Singh", email: "pardeep.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 25, totalLectures: 27, mstMarks: 22, internalMarks: 38, active: true },
  { srNo: 5, rollNo: "2433596", name: "Prabhdeep Singh", email: "prabhdeep.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 23, totalLectures: 27, mstMarks: 20, internalMarks: 34, active: true },
  { srNo: 6, rollNo: "2433597", name: "Prabhjeet Singh", email: "prabhjeet.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Late", attendedLectures: 21, totalLectures: 27, mstMarks: 18, internalMarks: 31, active: true },
  { srNo: 7, rollNo: "2433599", name: "Pratik Rai", email: "pratik.rai@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 26, totalLectures: 27, mstMarks: 23, internalMarks: 39, active: true },
  { srNo: 8, rollNo: "2433600", name: "PREM KUMAR", email: "prem.kumar@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Absent", attendedLectures: 16, totalLectures: 27, mstMarks: 15, internalMarks: 26, active: true },
  { srNo: 9, rollNo: "2433601", name: "Prince", email: "prince@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 24, totalLectures: 27, mstMarks: 20, internalMarks: 35, active: true },
  { srNo: 10, rollNo: "2433602", name: "Prince Kumar", email: "prince.kumar@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 26, totalLectures: 27, mstMarks: 24, internalMarks: 40, active: true },
  { srNo: 11, rollNo: "2433604", name: "Prithvi", email: "prithvi@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Duty Leave", attendedLectures: 22, totalLectures: 27, mstMarks: 19, internalMarks: 32, active: true },
  { srNo: 12, rollNo: "2433605", name: "Puneet Singh", email: "puneet.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 25, totalLectures: 27, mstMarks: 22, internalMarks: 37, active: true },
  { srNo: 13, rollNo: "2433608", name: "Rajbeer Singh", email: "rajbeer.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 23, totalLectures: 27, mstMarks: 20, internalMarks: 33, active: true },
  { srNo: 14, rollNo: "2433610", name: "Rajinder Kaur", email: "rajinder.k@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 25, totalLectures: 27, mstMarks: 21, internalMarks: 36, active: true },
  { srNo: 15, rollNo: "2433611", name: "Raju Kumar", email: "raju.k@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Late", attendedLectures: 19, totalLectures: 27, mstMarks: 17, internalMarks: 29, active: true },
  { srNo: 16, rollNo: "2433612", name: "Rajveer Kaur", email: "rajveer.k@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 24, totalLectures: 27, mstMarks: 21, internalMarks: 35, active: true },
  { srNo: 17, rollNo: "2433613", name: "Rajveer Singh", email: "rajveer.singh@smartcampus.demo", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 14, totalLectures: 27, mstMarks: 17, internalMarks: 29, active: true },
  { srNo: 18, rollNo: "2433618", name: "Ranjodh Singh", email: "ranjodh.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 23, totalLectures: 27, mstMarks: 20, internalMarks: 34, active: true },
  { srNo: 19, rollNo: "2433619", name: "Ranvir Singh", email: "ranvir.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Absent", attendedLectures: 17, totalLectures: 27, mstMarks: 16, internalMarks: 27, active: true },
  { srNo: 20, rollNo: "2433621", name: "Ravi Shah Sonar", email: "ravi.shah@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 24, totalLectures: 27, mstMarks: 21, internalMarks: 35, active: true },
  { srNo: 21, rollNo: "2433622", name: "Ravinder Singh", email: "ravinder.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Duty Leave", attendedLectures: 22, totalLectures: 27, mstMarks: 19, internalMarks: 32, active: true },
  { srNo: 22, rollNo: "2433624", name: "Rishikesh Kumar", email: "rishikesh.k@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 25, totalLectures: 27, mstMarks: 22, internalMarks: 38, active: true },
  { srNo: 23, rollNo: "2433627", name: "Riya Sen", email: "riya.sen@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 26, totalLectures: 27, mstMarks: 23, internalMarks: 39, active: true },
  { srNo: 24, rollNo: "2433628", name: "Robinpreet Singh Dhillon", email: "robinpreet.s@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 24, totalLectures: 27, mstMarks: 20, internalMarks: 34, active: true },
  { srNo: 25, rollNo: "2433629", name: "Rohit Kumar", email: "rohit.k1@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 22, totalLectures: 27, mstMarks: 18, internalMarks: 31, active: true },
  { srNo: 26, rollNo: "2433630", name: "Rohit Kumar", email: "rohit.k2@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Absent", attendedLectures: 15, totalLectures: 27, mstMarks: 14, internalMarks: 25, active: true },
  { srNo: 27, rollNo: "2433631", name: "Sachin Kumar", email: "sachin.k1@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 25, totalLectures: 27, mstMarks: 22, internalMarks: 37, active: true },
  { srNo: 28, rollNo: "2433632", name: "Sachin Kumar", email: "sachin.k2@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 23, totalLectures: 27, mstMarks: 19, internalMarks: 32, active: true },
  { srNo: 29, rollNo: "2433634", name: "Saloni", email: "saloni@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 26, totalLectures: 27, mstMarks: 24, internalMarks: 39, active: true },
  { srNo: 30, rollNo: "2433636", name: "Saneha Gill", email: "saneha.gill@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 25, totalLectures: 27, mstMarks: 23, internalMarks: 38, active: true },
  { srNo: 31, rollNo: "2433637", name: "Sangeeta Kumari", email: "sangeeta.k@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 24, totalLectures: 27, mstMarks: 21, internalMarks: 35, active: true },
  { srNo: 32, rollNo: "2433638", name: "Sania", email: "sania@ggi.ac.in", branch: "BCA (Sec C)", todayStatus: "Present", attendedLectures: 25, totalLectures: 27, mstMarks: 22, internalMarks: 37, active: true }
];

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: "APT-2026-01",
    studentName: "Rajveer Singh",
    rollNo: "2433613",
    date: "14 Oct 2026",
    timeSlot: "11:30 AM – 11:45 AM",
    purpose: "Cloud Computing architecture review (AWS ECS vs Cloud Run) & Docker compose debugging.",
    status: "Approved",
    mode: "Offline (Cabin B-205)"
  },
  {
    id: "APT-2026-02",
    studentName: "Navjot Kaur",
    rollNo: "2433582",
    date: "15 Oct 2026",
    timeSlot: "02:30 PM – 02:45 PM",
    purpose: "MST-I evaluation doubt resolution in Cloud Storage replication policies.",
    status: "Pending",
    mode: "Offline (Cabin B-205)"
  },
  {
    id: "APT-2026-03",
    studentName: "PREM KUMAR",
    rollNo: "2433600",
    date: "16 Oct 2026",
    timeSlot: "03:15 PM – 03:30 PM",
    purpose: "Attendance shortage advisory and remedial lecture planning.",
    status: "Pending",
    mode: "Google Meet"
  },
  {
    id: "APT-2026-04",
    studentName: "Prince Kumar",
    rollNo: "2433602",
    date: "12 Oct 2026",
    timeSlot: "10:15 AM – 10:30 AM",
    purpose: "Hackathon project mentorship & research paper publication outline.",
    status: "Approved",
    mode: "Offline (Cabin B-205)"
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-902",
    timestamp: "13 Oct 2026, 09:15 AM",
    facultyId: "FAC-RAHUL-SONI-091",
    facultyName: "Mr. Rahul Soni",
    action: "ATTENDANCE_BATCH_SYNC",
    details: "Synchronized lecture attendance for UGCA1936 Period 5 (28 Present, 4 Absent/DL).",
    signatureHash: "HMAC-SHA256:7b92f4e89a12c3d4",
    type: "Attendance"
  },
  {
    id: "LOG-901",
    timestamp: "12 Oct 2026, 04:30 PM",
    facultyId: "FAC-RAHUL-SONI-091",
    facultyName: "Mr. Rahul Soni",
    action: "MARKS_UPDATE_CONFIRMED",
    details: "Locked MST-I scores for Section C (Cloud Computing). Highest: 24 (Prince Kumar).",
    signatureHash: "HMAC-SHA256:4a12e87c9f33b102",
    type: "Marks"
  },
  {
    id: "LOG-900",
    timestamp: "11 Oct 2026, 11:45 AM",
    facultyId: "FAC-RAHUL-SONI-091",
    facultyName: "Mr. Rahul Soni",
    action: "APPOINTMENT_APPROVED",
    details: "Confirmed 15-min consultation slot for Rajveer Singh (2433613).",
    signatureHash: "HMAC-SHA256:1e44f8902a77bc31",
    type: "Appointment"
  }
];

export default function FacultyPortal() {
  const [activeTab, setActiveTab] = useState<"roster" | "marks" | "appointments" | "audit">("roster");

  // State
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterThreshold, setFilterThreshold] = useState<"all" | "shortage" | "present" | "absent">("all");

  // Modals
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [newRollNo, setNewRollNo] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBranch, setNewBranch] = useState("BCA (Sec C)");

  const [editStudentModal, setEditStudentModal] = useState<StudentRecord | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<StudentRecord | null>(null);

  const [rescheduleModal, setRescheduleModal] = useState<AppointmentItem | null>(null);
  const [newSlotTime, setNewSlotTime] = useState("10:00 AM – 10:15 AM");

  const [adminSecurityModal, setAdminSecurityModal] = useState(false);

  // Helper to append audit log
  const logAudit = (action: string, details: string, type: AuditLogEntry["type"]) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      facultyId: "FAC-RAHUL-SONI-091",
      facultyName: "Mr. Rahul Soni",
      action,
      details,
      signatureHash: `HMAC-SHA256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      type
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Metrics
  const activeStudents = useMemo(() => students.filter(s => s.active), [students]);
  const presentCount = activeStudents.filter(s => s.todayStatus === "Present").length;
  const absentCount = activeStudents.filter(s => s.todayStatus === "Absent").length;
  const lateCount = activeStudents.filter(s => s.todayStatus === "Late").length;
  const dlCount = activeStudents.filter(s => s.todayStatus === "Duty Leave").length;

  const shortageStudents = useMemo(() => {
    return activeStudents.filter(s => {
      const pct = (s.attendedLectures / s.totalLectures) * 100;
      return pct < 75;
    });
  }, [activeStudents]);

  const classAvgMST = (
    activeStudents.reduce((sum, s) => sum + s.mstMarks, 0) / (activeStudents.length || 1)
  ).toFixed(1);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return activeStudents.filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const pct = (s.attendedLectures / s.totalLectures) * 100;
      if (filterThreshold === "shortage") return pct < 75;
      if (filterThreshold === "present") return s.todayStatus === "Present";
      if (filterThreshold === "absent") return s.todayStatus === "Absent";
      return true;
    });
  }, [activeStudents, searchQuery, filterThreshold]);

  // Attendance Handlers
  const handleSetStatus = (rollNo: string, status: AttendanceStatus) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.rollNo === rollNo) {
          const wasPresent = s.todayStatus === "Present";
          const nowPresent = status === "Present" || status === "Duty Leave";
          const diff = nowPresent && !wasPresent ? 1 : !nowPresent && wasPresent ? -1 : 0;
          return {
            ...s,
            todayStatus: status,
            attendedLectures: Math.max(0, Math.min(s.totalLectures, s.attendedLectures + diff))
          };
        }
        return s;
      })
    );

    const student = students.find(s => s.rollNo === rollNo);
    logAudit(
      "ATTENDANCE_STATUS_CHANGED",
      `Marked ${student?.name} (${rollNo}) as ${status}`,
      "Attendance"
    );
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        todayStatus: status,
        attendedLectures:
          status === "Present" || status === "Duty Leave"
            ? s.totalLectures
            : Math.max(0, s.attendedLectures - 1)
      }))
    );
    showToast(`All ${activeStudents.length} students marked as ${status}!`, "success");
    logAudit(
      "BATCH_ATTENDANCE_OVERRIDE",
      `All active students marked as ${status} for today's lecture.`,
      "Attendance"
    );
  };

  // Marks Handlers with strict bounds validation
  const handleUpdateMarks = (rollNo: string, field: "mstMarks" | "internalMarks", rawVal: string) => {
    const num = Number(rawVal);
    const maxVal = field === "mstMarks" ? 24 : 40;

    if (isNaN(num)) {
      showToast("Please enter a valid numeric mark.", "error");
      return;
    }

    if (num < 0) {
      showToast("Marks cannot be negative.", "error");
      return;
    }

    if (num > maxVal) {
      showToast(`Marks cannot exceed the maximum limit of ${maxVal}.`, "error");
      return;
    }

    setStudents(prev =>
      prev.map(s => (s.rollNo === rollNo ? { ...s, [field]: num } : s))
    );

    const s = students.find(x => x.rollNo === rollNo);
    logAudit(
      "MARKS_INLINE_UPDATE",
      `Updated ${field === "mstMarks" ? "MST-I" : "Internal"} score for ${s?.name} (${rollNo}) to ${num}/${maxVal}.`,
      "Marks"
    );
  };

  // Student CRUD
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRollNo.trim() || !newName.trim()) {
      showToast("Roll number and name are required.", "error");
      return;
    }

    if (students.some(s => s.rollNo.trim() === newRollNo.trim())) {
      showToast(`Student with Roll No. ${newRollNo} already exists in the roster!`, "error");
      return;
    }

    const nextSr = Math.max(...students.map(s => s.srNo), 0) + 1;
    const newStudent: StudentRecord = {
      srNo: nextSr,
      rollNo: newRollNo.trim(),
      name: newName.trim(),
      email: newEmail.trim() || `${newRollNo.trim()}@ggi.ac.in`,
      branch: newBranch,
      todayStatus: "Present",
      attendedLectures: 20,
      totalLectures: 27,
      mstMarks: 18,
      internalMarks: 32,
      active: true
    };

    setStudents(prev => [...prev, newStudent]);
    showToast(`Student ${newName} (${newRollNo}) enrolled successfully!`, "success");
    logAudit("STUDENT_ENROLLED", `Added new student record: ${newName} (${newRollNo})`, "Student");

    setAddStudentModalOpen(false);
    setNewRollNo("");
    setNewName("");
    setNewEmail("");
  };

  const handleEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudentModal) return;

    setStudents(prev =>
      prev.map(s => (s.rollNo === editStudentModal.rollNo ? editStudentModal : s))
    );

    showToast(`Updated student profile for ${editStudentModal.name}!`, "success");
    logAudit("STUDENT_PROFILE_EDITED", `Modified bio for ${editStudentModal.name} (${editStudentModal.rollNo})`, "Student");
    setEditStudentModal(null);
  };

  const handleDeleteStudent = () => {
    if (!confirmDeleteModal) return;

    setStudents(prev =>
      prev.map(s => (s.rollNo === confirmDeleteModal.rollNo ? { ...s, active: false } : s))
    );

    showToast(`Deactivated ${confirmDeleteModal.name} from active roster.`, "info");
    logAudit("STUDENT_DEACTIVATED", `Removed ${confirmDeleteModal.name} (Roll ${confirmDeleteModal.rollNo}) with faculty confirmation.`, "Student");
    setConfirmDeleteModal(null);
  };

  // Appointment Actions
  const handleApproveApt = (apt: AppointmentItem) => {
    setAppointments(prev =>
      prev.map(a => (a.id === apt.id ? { ...a, status: "Approved" } : a))
    );
    showToast(`1-on-1 slot confirmed for ${apt.studentName}!`, "success");
    logAudit("APPOINTMENT_APPROVED", `Approved consultation for ${apt.studentName} at ${apt.timeSlot}.`, "Appointment");
  };

  const handleRejectApt = (apt: AppointmentItem) => {
    setAppointments(prev =>
      prev.map(a => (a.id === apt.id ? { ...a, status: "Rejected" } : a))
    );
    showToast(`Declined request for ${apt.studentName}.`, "info");
    logAudit("APPOINTMENT_REJECTED", `Rejected consultation request from ${apt.studentName}.`, "Appointment");
  };

  const handleRescheduleApt = () => {
    if (!rescheduleModal) return;
    setAppointments(prev =>
      prev.map(a =>
        a.id === rescheduleModal.id
          ? { ...a, timeSlot: newSlotTime, status: "Approved" }
          : a
      )
    );
    showToast(`Rescheduled slot to ${newSlotTime} and sent invite to student!`, "success");
    logAudit("APPOINTMENT_RESCHEDULED", `Rescheduled ${rescheduleModal.studentName} to ${newSlotTime}.`, "Appointment");
    setRescheduleModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / RBAC Role Boundary Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold tracking-wide uppercase">
              Role: Faculty Member
            </span>
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <ShieldCheck size={14} /> Biometric & ERP Synced
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Mr. Rahul Soni — Departmental Portal
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Assistant Professor • Dept. of Computer Applications • Course Incharge: <b>UGCA1936 (Cloud Computing)</b>
          </p>
        </div>

        {/* Admin Oversight Guard Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAdminSecurityModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 transition-all backdrop-blur-md"
            title="Institutional RBAC Boundary"
          >
            <Lock size={14} className="text-amber-400" />
            <span>Add New Faculty / Staff</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              ADMIN ONLY
            </span>
          </button>

          <button
            onClick={() => {
              showToast("Exporting Section C Master Register (CSV)...", "info");
              logAudit("REGISTER_EXPORTED", "Exported complete class grade and attendance sheet.", "Student");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
          >
            <Download size={14} /> Export Roll Sheet
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className={`${card} p-4.5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Enrolled</span>
            <Users size={16} className="text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {activeStudents.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">BCA Section C</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <Check size={12} /> 100% Verified Roll Numbers
          </span>
        </div>

        <div className={`${card} p-4.5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Today's Presence</span>
            <CheckCheck size={16} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {presentCount}
            </span>
            <span className="text-xs text-slate-400">/ {activeStudents.length} students</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            {((presentCount / (activeStudents.length || 1)) * 100).toFixed(0)}% attendance today
          </span>
        </div>

        <div className={`${card} p-4.5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Shortage Warnings</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">
              {shortageStudents.length}
            </span>
            <span className="text-xs text-amber-600 font-semibold">&lt; 75% Criteria</span>
          </div>
          <button
            onClick={() => {
              setActiveTab("roster");
              setFilterThreshold("shortage");
            }}
            className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline mt-2 text-left"
          >
            View Flagged List →
          </button>
        </div>

        <div className={`${card} p-4.5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Class MST Average</span>
            <TrendingUp size={16} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600">
              {classAvgMST}
            </span>
            <span className="text-xs text-slate-400">/ 24 Max Marks</span>
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-2">
            Unit I & II Syllabus
          </span>
        </div>

        <div className={`${card} p-4.5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Consultation Queue</span>
            <Clock size={16} className="text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {appointments.filter(a => a.status === "Pending").length}
            </span>
            <span className="text-xs text-slate-400">Pending review</span>
          </div>
          <button
            onClick={() => setActiveTab("appointments")}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-2 text-left"
          >
            Review Requests →
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 dark:border-slate-800 pb-1">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: "roster", label: "Student Roster & Attendance", icon: Users, badge: activeStudents.length },
            { id: "marks", label: "Marks Entry & Evaluation", icon: Award, badge: "MST-I" },
            {
              id: "appointments",
              label: "Appointment Requests",
              icon: Clock,
              badge: appointments.filter(a => a.status === "Pending").length
            },
            { id: "audit", label: "Activity Audit Log", icon: History, badge: auditLogs.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === "roster" && (
          <button onClick={() => setAddStudentModalOpen(true)} className={`${primary} !py-2 text-xs font-bold`}>
            <Plus size={15} /> Add New Student
          </button>
        )}
      </div>

      {/* TAB 1: STUDENT ROSTER & ATTENDANCE */}
      {activeTab === "roster" && (
        <div className="space-y-4">
          {/* Quick Actions & Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by student name or roll number..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs dark:border-slate-700 dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterThreshold("all")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterThreshold === "all"
                      ? "bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-slate-100"
                      : "text-slate-500"
                  }`}
                >
                  All ({activeStudents.length})
                </button>
                <button
                  onClick={() => setFilterThreshold("shortage")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterThreshold === "shortage"
                      ? "bg-amber-500 text-white shadow font-bold"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  &lt;75% Shortage ({shortageStudents.length})
                </button>
                <button
                  onClick={() => setFilterThreshold("present")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterThreshold === "present"
                      ? "bg-emerald-600 text-white shadow font-bold"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  Present ({presentCount})
                </button>
                <button
                  onClick={() => setFilterThreshold("absent")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterThreshold === "absent"
                      ? "bg-red-600 text-white shadow font-bold"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Absent ({absentCount})
                </button>
              </div>

              {/* Batch Attendance Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleMarkAll("Present")}
                  className={`${ghost} !py-1.5 !px-2.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40`}
                  title="Mark All Present"
                >
                  <CheckCheck size={14} /> Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll("Absent")}
                  className={`${ghost} !py-1.5 !px-2.5 text-xs font-semibold text-slate-500`}
                  title="Reset / Mark Absent"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Responsive Table */}
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-3.5 font-bold w-14">Sr.</th>
                  <th className="px-4 py-3.5 font-bold">Roll No.</th>
                  <th className="px-4 py-3.5 font-bold">Student Name</th>
                  <th className="px-4 py-3.5 font-bold text-center">Today's Status</th>
                  <th className="px-4 py-3.5 font-bold text-center">Biometric Attd. %</th>
                  <th className="px-4 py-3.5 font-bold text-center">MST-I (24)</th>
                  <th className="px-4 py-3.5 font-bold text-center">Internal (40)</th>
                  <th className="px-4 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map(student => {
                  const pct = +((student.attendedLectures / student.totalLectures) * 100).toFixed(1);
                  const isShortage = pct < 75;

                  return (
                    <tr
                      key={student.rollNo}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isShortage ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-slate-400">
                        {student.srNo}
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                        {student.rollNo}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {student.name}
                          {isShortage && (
                            <span title="Attendance below 75% exam cutoff">
                              <AlertTriangle size={13} className="text-amber-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block">{student.email}</span>
                      </td>

                      {/* Daily Attendance Buttons: P, A, L, DL */}
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => handleSetStatus(student.rollNo, "Present")}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                              student.todayStatus === "Present"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                            title="Present"
                          >
                            P
                          </button>
                          <button
                            onClick={() => handleSetStatus(student.rollNo, "Absent")}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                              student.todayStatus === "Absent"
                                ? "bg-red-600 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                            title="Absent"
                          >
                            A
                          </button>
                          <button
                            onClick={() => handleSetStatus(student.rollNo, "Late")}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                              student.todayStatus === "Late"
                                ? "bg-amber-500 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                            title="Late Arrival"
                          >
                            L
                          </button>
                          <button
                            onClick={() => handleSetStatus(student.rollNo, "Duty Leave")}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                              student.todayStatus === "Duty Leave"
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                            title="Duty Leave Waiver"
                          >
                            DL
                          </button>
                        </div>
                      </td>

                      {/* Attendance % Ring / Indicator */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-14 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 75 ? "bg-emerald-500" : pct >= 65 ? "bg-amber-500" : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono font-bold text-xs ${
                              pct >= 75 ? "text-emerald-600" : pct >= 65 ? "text-amber-600" : "text-red-600 font-extrabold"
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {student.attendedLectures}/{student.totalLectures} Lecd.
                        </span>
                      </td>

                      {/* MST Marks with Inline Input */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="24"
                          defaultValue={student.mstMarks}
                          onBlur={e => handleUpdateMarks(student.rollNo, "mstMarks", e.target.value)}
                          className="w-14 text-center font-mono font-bold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Internal Assessment */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="40"
                          defaultValue={student.internalMarks}
                          onBlur={e => handleUpdateMarks(student.rollNo, "internalMarks", e.target.value)}
                          className="w-14 text-center font-mono font-bold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditStudentModal(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Edit Student Details"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteModal(student)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                            title="Deactivate Student Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="p-10 text-center space-y-2">
                <Users size={28} className="mx-auto text-slate-400" />
                <p className="font-bold text-slate-800 dark:text-slate-200">No students found matching query</p>
                <p className="text-xs text-slate-400">Try clearing the search query or changing attendance filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MARKS ENTRY & EVALUATION */}
      {activeTab === "marks" && (
        <div className="space-y-4">
          <div className={`${card} p-5 bg-gradient-to-r from-purple-50/50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/20`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <Award className="text-purple-600" size={20} />
                  Continuous Internal Assessment & MST Evaluation Engine
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Cloud Computing (UGCA1936) • Odd Semester 2026 • Max MST: 24 • Max Internal: 40
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast("All marks verified and synced with University Examination Board!", "success");
                    logAudit("MARKS_BATCH_SYNC", "Locked continuous evaluation marks for Section C.", "Marks");
                  }}
                  className={primary}
                >
                  <CheckCheck size={16} /> Finalize & Lock Marks
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class Highest</span>
                <span className="font-bold text-emerald-600 text-sm">24 / 24 (Prince Kumar)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class Average</span>
                <span className="font-bold text-purple-600 text-sm">{classAvgMST} / 24</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Passing Rate (&gt;40%)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">96.8% (31/32 Passed)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Remedial Flagged</span>
                <span className="font-bold text-red-600 text-sm">1 Student (Rohit Kumar)</span>
              </div>
            </div>
          </div>

          {/* Quick inline marks table */}
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Sr.</th>
                  <th className="px-4 py-3 font-semibold">Roll No.</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold text-center">MST-I (Max 24)</th>
                  <th className="px-4 py-3 font-semibold text-center">Assignments (Max 10)</th>
                  <th className="px-4 py-3 font-semibold text-center">Attendance Wtg (Max 6)</th>
                  <th className="px-4 py-3 font-semibold text-center">Total Internal (Max 40)</th>
                  <th className="px-4 py-3 font-semibold text-right">Predicted Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeStudents.map(student => {
                  const assignmentScore = Math.min(10, Math.round((student.internalMarks / 40) * 10));
                  const attdScore = Math.min(6, Math.round(((student.attendedLectures / student.totalLectures) * 6)));
                  const computedTotal = Math.min(40, student.internalMarks);
                  const grade = computedTotal >= 36 ? "O (Outstanding)" : computedTotal >= 32 ? "A+ (Excellent)" : computedTotal >= 28 ? "A (Very Good)" : "B+ (Good)";

                  return (
                    <tr key={student.rollNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono text-slate-400">{student.srNo}</td>
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700 dark:text-indigo-400">{student.rollNo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{student.name}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="24"
                          defaultValue={student.mstMarks}
                          onBlur={e => handleUpdateMarks(student.rollNo, "mstMarks", e.target.value)}
                          className="w-16 text-center font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                        {assignmentScore} / 10
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                        {attdScore} / 6
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-purple-700 dark:text-purple-400">
                        {computedTotal} / 40
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Pill tone={computedTotal >= 32 ? "green" : computedTotal >= 28 ? "indigo" : "amber"}>
                          {grade}
                        </Pill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPOINTMENT REQUESTS QUEUE */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Clock size={20} className="text-sky-600" />
                Student 1-on-1 Consultation Queue
              </h3>
              <p className="text-xs text-slate-500">
                15-minute scheduled blocks for project guidance, doubt clearing, or mentorship.
              </p>
            </div>
            <Pill tone="indigo">
              {appointments.filter(a => a.status === "Pending").length} Pending Requests
            </Pill>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {appointments.map(apt => (
              <div
                key={apt.id}
                className={`${card} p-5 flex flex-col justify-between border-slate-200 dark:border-slate-800`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {apt.rollNo}
                    </span>
                    <Pill
                      tone={
                        apt.status === "Approved"
                          ? "green"
                          : apt.status === "Pending"
                          ? "amber"
                          : "red"
                      }
                    >
                      {apt.status}
                    </Pill>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {apt.studentName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={13} /> {apt.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Clock size={13} /> {apt.timeSlot}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Discussion Agenda:</span>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{apt.purpose}"</p>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    {apt.mode.includes("Google Meet") ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Video size={13} /> Google Meet Video Room
                      </span>
                    ) : (
                      <span>📍 Location: Faculty Cabin B-205</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between gap-2">
                  {apt.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleRejectApt(apt)}
                        className={`${ghost} flex-1 text-xs text-red-600 hover:text-red-700`}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setRescheduleModal(apt)}
                        className={`${ghost} flex-1 text-xs`}
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleApproveApt(apt)}
                        className={`${primary} flex-1 text-xs`}
                      >
                        Approve Slot
                      </button>
                    </>
                  ) : apt.status === "Approved" ? (
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Confirmed on Faculty Calendar
                      </span>
                      <button
                        onClick={() => setRescheduleModal(apt)}
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        Change Time
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Request has been declined.</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY AUDIT LOG */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <History size={20} className="text-indigo-600" />
                Immutable Faculty Activity Audit Log
              </h3>
              <p className="text-xs text-slate-500">
                Cryptographically signed ledger of all attendance modifications, mark overrides, and roster changes.
              </p>
            </div>
            <button
              onClick={() => showToast("Exporting cryptographic security trail (JSON)...", "info")}
              className={`${ghost} text-xs`}
            >
              <Download size={14} /> Export Cryptographic Trail
            </button>
          </div>

          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Log ID</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Action Trigger</th>
                  <th className="px-4 py-3 font-semibold">Audit Details</th>
                  <th className="px-4 py-3 font-semibold font-mono text-right">HMAC Signature Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-300">{log.id}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <Pill
                        tone={
                          log.type === "Attendance"
                            ? "green"
                            : log.type === "Marks"
                            ? "purple"
                            : log.type === "Student"
                            ? "indigo"
                            : "sky"
                        }
                      >
                        {log.action}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{log.details}</td>
                    <td className="px-4 py-3 text-right font-mono text-[10px] text-slate-400">
                      {log.signatureHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW STUDENT */}
      <Modal
        isOpen={addStudentModalOpen}
        onClose={() => setAddStudentModalOpen(false)}
        title="Enroll New Student to Roster"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Roll Number *
              </label>
              <input
                required
                value={newRollNo}
                onChange={e => setNewRollNo(e.target.value)}
                placeholder="e.g. 2433639"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Branch & Section *
              </label>
              <input
                required
                value={newBranch}
                onChange={e => setNewBranch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student Full Name *
            </label>
            <input
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Simranjeet Singh"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="e.g. simranjeet@ggi.ac.in"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>Next sequential Sr. No. <b>{Math.max(...students.map(s => s.srNo), 0) + 1}</b> will be automatically assigned upon creation.</span>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setAddStudentModalOpen(false)} className={ghost}>
              Cancel
            </button>
            <button type="submit" className={primary}>
              Enroll Student
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT STUDENT */}
      {editStudentModal && (
        <Modal
          isOpen={true}
          onClose={() => setEditStudentModal(null)}
          title={`Edit Student: ${editStudentModal.name}`}
        >
          <form onSubmit={handleEditStudent} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Roll Number
                </label>
                <input
                  disabled
                  value={editStudentModal.rollNo}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-800/60 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Branch / Section
                </label>
                <input
                  value={editStudentModal.branch}
                  onChange={e => setEditStudentModal({ ...editStudentModal, branch: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                required
                value={editStudentModal.name}
                onChange={e => setEditStudentModal({ ...editStudentModal, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editStudentModal.email}
                onChange={e => setEditStudentModal({ ...editStudentModal, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setEditStudentModal(null)} className={ghost}>
                Cancel
              </button>
              <button type="submit" className={primary}>
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: CONFIRM DELETE / DEACTIVATE */}
      {confirmDeleteModal && (
        <Modal
          isOpen={true}
          onClose={() => setConfirmDeleteModal(null)}
          title="Confirm Student Deactivation"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
              <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-red-900 dark:text-red-300">
                <p className="font-bold">Are you sure you want to deactivate this student?</p>
                <p className="mt-1">
                  Student: <b>{confirmDeleteModal.name}</b> (Roll No: <b>{confirmDeleteModal.rollNo}</b>).
                </p>
                <p className="mt-1 text-[11px] text-red-700 dark:text-red-400">
                  This will archive their academic records and remove them from active biometric roll calls. An audit trail entry will be permanently recorded.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDeleteModal(null)} className={ghost}>
                Cancel
              </button>
              <button onClick={handleDeleteStudent} className={danger}>
                Confirm Deactivation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: RESCHEDULE APPOINTMENT */}
      {rescheduleModal && (
        <Modal
          isOpen={true}
          onClose={() => setRescheduleModal(null)}
          title={`Reschedule Consultation: ${rescheduleModal.studentName}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Select an alternative 15-minute slot for {rescheduleModal.studentName} ({rescheduleModal.rollNo}).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Available Open Slots
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "09:30 AM – 09:45 AM",
                  "10:00 AM – 10:15 AM",
                  "11:45 AM – 12:00 PM",
                  "02:30 PM – 02:45 PM",
                  "03:30 PM – 03:45 PM",
                  "04:00 PM – 04:15 PM"
                ].map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setNewSlotTime(slot)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                      newSlotTime === slot
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setRescheduleModal(null)} className={ghost}>
                Cancel
              </button>
              <button onClick={handleRescheduleApt} className={primary}>
                Confirm Reschedule
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 5: ADMIN ROLE BOUNDARY SECURITY ADVISORY */}
      <Modal
        isOpen={adminSecurityModal}
        onClose={() => setAdminSecurityModal(false)}
        title="RBAC Security Policy: Restricted Permission"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Lock className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div className="text-xs text-amber-900 dark:text-amber-300 space-y-1.5">
              <p className="font-bold">Faculty Role Boundary Enforced (ISO/IEC 27001 Compliance)</p>
              <p>
                <b>"Add New Faculty / Staff"</b> and system role allocation permissions are strictly restricted to the <b>Institution Administrator (Admin Office)</b>.
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-400">
                As a faculty member, you have full write access to manage student rosters, marks, and appointment bookings, but staff provisioning requires elevated Admin credentials.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">How to access:</span>
            <p>1. Use the top-right persona switcher and select <b>"Admin: Admin Office"</b>.</p>
            <p>2. Or sign in with email <code>admin@smartcampus.demo</code>.</p>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setAdminSecurityModal(false)} className={primary}>
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
