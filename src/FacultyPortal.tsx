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
  ArrowRight,
  GraduationCap,
  Layers,
  Wrench,
  AlertOctagon,
  Camera,
  Briefcase,
  ChevronRight,
  Eye,
  BookMarked,
  ClipboardCheck,
  ExternalLink
} from "lucide-react";
import { card, primary, ghost, danger, success, secondary, Pill, Modal, showToast } from "./ui";
import {
  INITIAL_FDPS,
  FDPProgram,
  FACULTY_WEEKLY_TIMETABLE,
  FacultyScheduleSlot
} from "./data";

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
    timestamp: "14 Oct 2026, 09:50 AM",
    facultyId: "EID-1708",
    facultyName: "MS. NAVJOT",
    action: "ATTENDANCE_BATCH_SYNC",
    details: "Synchronized lecture attendance for BCA 3-C PHP Lab Period 1 & 2 (26 Present, 6 Absent/DL).",
    signatureHash: "HMAC-SHA256:7b92f4e89a12c3d4",
    type: "Attendance"
  },
  {
    id: "LOG-901",
    timestamp: "12 Oct 2026, 04:30 PM",
    facultyId: "EID-1708",
    facultyName: "MS. NAVJOT",
    action: "MARKS_UPDATE_CONFIRMED",
    details: "Locked MST-I scores for Section C (Programming in PHP). Highest: 24 (Prince Kumar, Saloni).",
    signatureHash: "HMAC-SHA256:4a12e87c9f33b102",
    type: "Marks"
  },
  {
    id: "LOG-900",
    timestamp: "11 Oct 2026, 11:45 AM",
    facultyId: "EID-1708",
    facultyName: "MS. NAVJOT",
    action: "APPOINTMENT_APPROVED",
    details: "Confirmed 15-min consultation slot for Rajveer Singh (2433613) on PHP PDO Sessions.",
    signatureHash: "HMAC-SHA256:1e44f8902a77bc31",
    type: "Appointment"
  }
];

export default function FacultyPortal({
  requestedAction,
  onNav
}: {
  requestedAction?: string;
  onNav?: (p: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<
    | "classes"
    | "timetable"
    | "roster"
    | "marks"
    | "calendar"
    | "fdp"
    | "academicModules"
    | "adminStaff"
    | "notices"
    | "submissions"
    | "appointments"
    | "audit"
  >("classes");

  // State
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Extra lecture / custom timetable state
  const [extraLectureModalOpen, setExtraLectureModalOpen] = useState(false);
  const [extraDay, setExtraDay] = useState("Saturday");
  const [extraPeriod, setExtraPeriod] = useState("Period 3 (11:15 AM - 12:00 PM)");
  const [extraRoom, setExtraRoom] = useState("Room B-204");
  const [extraSubject, setExtraSubject] = useState("Programming in PHP (UGCA1929)");
  const [extraTopic, setExtraTopic] = useState("Remedial: PDO Prepared Statements & Security");

  // Course handout state
  const [courseHandoutModalOpen, setCourseHandoutModalOpen] = useState(false);
  const [handoutDeliverables, setHandoutDeliverables] = useState("Units 1-4 Complete Lecture Deliverables, 14 Lab Programs, CO-PO Attainment Map");

  // Task manager modal state
  const [taskManagerModalOpen, setTaskManagerModalOpen] = useState(false);

  // Navigation sync from sidebar
  React.useEffect(() => {
    if (!requestedAction) return;
    switch (requestedAction) {
      case "faculty-profile":
        setActiveTab("classes");
        break;

      case "faculty-timetable":
        setActiveTab("timetable");
        break;

      case "faculty-timetable-set":
        setActiveTab("classes");
        setExtraLectureModalOpen(true);
        break;

      case "faculty-mst":
      case "faculty-mst-analysis":
        setActiveTab("marks");
        showToast("MST-I Micro Analysis: 28/32 passed (87.5% passing index).", "info");
        break;

      case "faculty-internal":
      case "faculty-calculate-internal":
        setActiveTab("marks");
        showToast("Continuous internal assessment calculation loaded (40 Marks).", "info");
        break;

      case "faculty-material":
      case "faculty-upload-material":
      case "faculty-my-uploads":
        setActiveTab("submissions");
        showToast("ERP Course Material & Submission Tracker loaded.", "info");
        break;

      case "faculty-schemes":
        setActiveTab("academicModules");
        showToast("Syllabus Schemes & Lecture Planners opened.", "info");
        break;

      case "faculty-course-handout":
        setCourseHandoutModalOpen(true);
        break;

      case "faculty-calendar":
      case "faculty-academic-calendar":
      case "faculty-staff-attendance":
      case "faculty-attendance-analysis":
        setActiveTab("calendar");
        showToast("Attendance & Academic Calendar loaded.", "info");
        break;

      case "faculty-student-record":
      case "faculty-track-students":
        setActiveTab("roster");
        showToast("Student Academic Roster (32 Students) opened.", "info");
        break;

      case "faculty-adjustment":
      case "faculty-teacher-adjustment":
        setActiveTab("adminStaff");
        showToast("Teacher Adjustment Desk opened.", "info");
        break;

      case "faculty-op-index":
        setActiveTab("adminStaff");
        showToast("Faculty OP Index & Key Performance metrics loaded.", "info");
        break;

      case "faculty-attendance-capture":
      case "faculty-capture-status":
        setActiveTab("adminStaff");
        showToast("Biometric Student Attendance Capture Status loaded.", "info");
        break;

      case "faculty-task-manager":
        setTaskManagerModalOpen(true);
        break;

      case "faculty-face-samples":
      case "faculty-register-face":
        setActiveTab("adminStaff");
        setFaceRegModalOpen(true);
        break;

      case "faculty-notifications":
      case "faculty-notification":
        setActiveTab("notices");
        break;

      case "faculty-events":
        setActiveTab("adminStaff");
        break;

      case "faculty-discipline-report":
      case "faculty-report-incident":
        setActiveTab("adminStaff");
        setIncidentModalOpen(true);
        break;

      case "faculty-discipline-history":
      case "faculty-my-incidents":
        setActiveTab("adminStaff");
        showToast("Disciplinary Incidents History loaded.", "info");
        break;

      case "faculty-maintenance-report":
      case "faculty-report-problem":
        setActiveTab("adminStaff");
        setRepairModalOpen(true);
        break;

      case "faculty-maintenance-history":
      case "faculty-my-problem":
        setActiveTab("adminStaff");
        showToast("Campus Repair & Maintenance History loaded.", "info");
        break;

      default:
        setActiveTab("classes");
        break;
    }
  }, [requestedAction]);

  // Weekly Timetable Day selection
  const [selectedDay, setSelectedDay] = useState<
    "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
  >("Monday");

  // FDP Tracker states
  const [fdpList, setFdpList] = useState<FDPProgram[]>(INITIAL_FDPS);
  const [fdpFilterType, setFdpFilterType] = useState<string>("All");
  const [fdpFilterMonth, setFdpFilterMonth] = useState<string>("All");

  // ERP & Staff Administration states
  const [activeErpModal, setActiveErpModal] = useState<string | null>(null);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [incidentRoll, setIncidentRoll] = useState("2433600");
  const [incidentSeverity, setIncidentSeverity] = useState<"Minor" | "Moderate" | "Critical">("Minor");
  const [incidentDesc, setIncidentDesc] = useState("");
  const [incidentLogs, setIncidentLogs] = useState([
    { id: "INC-101", roll: "2433600", student: "PREM KUMAR", date: "10 Oct 2026", reason: "Repeated unexcused late attendance in PHP Lab Period 2", severity: "Minor", status: "Parent Advised" },
    { id: "INC-102", roll: "2433619", student: "Ranvir Singh", date: "08 Oct 2026", reason: "Found using mobile device during MST-1 test session", severity: "Moderate", status: "Warning Issued" }
  ]);

  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [repairLocation, setRepairLocation] = useState("Lab B-201 (PHP Lab)");
  const [repairDesc, setRepairDesc] = useState("");
  const [repairRequests, setRepairRequests] = useState([
    { id: "REQ-401", location: "Lab B-201", issue: "Ceiling Projector HDMI port loose contact", date: "12 Oct 2026", status: "In Progress" },
    { id: "REQ-402", location: "Cabin B-205", issue: "LAN Port Ethernet speed drops intermittently", date: "09 Oct 2026", status: "Resolved ✓" }
  ]);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Duty Leave (FDP)");
  const [leaveReason, setLeaveReason] = useState("");
  const [faceRegModalOpen, setFaceRegModalOpen] = useState(false);
  const [faceRegistered, setFaceRegistered] = useState(true);

  // Notice Broadcast states
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeAudience, setNoticeAudience] = useState("BCA (Sec C)");
  const [noticeBody, setNoticeBody] = useState("");
  const [isUrgentAlert, setIsUrgentAlert] = useState(false);
  const [broadcasts, setBroadcasts] = useState([
    {
      id: "not-1",
      title: "PHP Lab External Viva & File Submission Deadline",
      audience: "BCA (Sec C)",
      body: "All students must submit signed lab files for Exercises 1-12 before Friday 3:00 PM.",
      date: "13 Oct 2026",
      urgent: true
    },
    {
      id: "not-2",
      title: "Mid-Semester Test II Syllabus Notification",
      audience: "BCA (Sec C & B)",
      body: "Syllabus covers Unit III (Sessions & PDO) and Unit IV (API Integration). Model paper posted in ERP.",
      date: "11 Oct 2026",
      urgent: false
    }
  ]);

  // Submission Status Tracker state
  const [submissionsList, setSubmissionsList] = useState([
    { roll: "2433613", name: "Rajveer Singh", task: "PHP Sessions & Auth Assignment", status: "Submitted On Time", date: "14 Oct 2026", grade: "A+" },
    { roll: "2433602", name: "Prince Kumar", task: "PHP Sessions & Auth Assignment", status: "Submitted On Time", date: "13 Oct 2026", grade: "A" },
    { roll: "2433582", name: "Navjot Kaur", task: "PHP Sessions & Auth Assignment", status: "Submitted On Time", date: "14 Oct 2026", grade: "A+" },
    { roll: "2433590", name: "Om Parkash", task: "PHP Sessions & Auth Assignment", status: "Late Submission", date: "14 Oct 2026", grade: "B" },
    { roll: "2433600", name: "PREM KUMAR", task: "PHP Sessions & Auth Assignment", status: "Pending", date: "—", grade: "—" },
    { roll: "2433619", name: "Ranvir Singh", task: "PHP Sessions & Auth Assignment", status: "Pending", date: "—", grade: "—" }
  ]);

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
      facultyId: "EID-1708",
      facultyName: "MS. NAVJOT",
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
      {/* Top Banner / Authentic GGI NAAC A+ Faculty Profile */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-blue-800/40">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 border-2 border-white/20 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
            M
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[11px] font-bold tracking-wide uppercase">
                GGI NAAC Grade A+
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-mono font-bold">
                EID: 1708
              </span>
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                <ShieldCheck size={14} /> Biometric & ERP Synced
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              MS. NAVJOT <span className="text-sm font-semibold text-blue-300 font-sans">(MMS Navjot)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Assistant Professor • Department of Computer Applications • Contact: <a href="mailto:nanumahi786@gmail.com" className="text-blue-300 underline font-mono">nanumahi786@gmail.com</a>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Course Incharge: <b>Programming in PHP (UGCA1929)</b> & <b>PHP Laboratory (UGCA1930)</b> • Gulzar Group of Institutes, Khanna
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => showToast("Password Change request logged in GGI ERP Security.", "info")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 transition-all backdrop-blur-md"
          >
            <Edit3 size={13} /> Change Password
          </button>
          <button
            onClick={() => setAdminSecurityModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 transition-all backdrop-blur-md"
            title="Institutional RBAC Boundary"
          >
            <Lock size={14} className="text-amber-400" />
            <span>Admin Desk</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              ADMIN ONLY
            </span>
          </button>

          <button
            onClick={() => {
              showToast("Exporting Section C Master Roll Sheet (32 Students)...", "info");
              logAudit("REGISTER_EXPORTED", "Exported complete class grade and attendance sheet for 32 students.", "Student");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
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
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
          {[
            { id: "classes", label: "Today's Classes", icon: Calendar, badge: "4 Periods" },
            { id: "timetable", label: "Weekly Timetable", icon: Clock, badge: "Mon–Fri" },
            { id: "fdp", label: "FDP & Research Tracker", icon: GraduationCap, badge: "ATAL AI" },
            { id: "roster", label: "Student Roster & Marking", icon: Users, badge: `${activeStudents.length} Students` },
            { id: "marks", label: "Exam Marks Entry", icon: Award, badge: "MST-I" },
            { id: "calendar", label: "Attendance Calendar", icon: CheckCheck, badge: "Oct 2026" },
            { id: "academicModules", label: "ERP Academic Affairs", icon: BookOpen, badge: "10 Tools" },
            { id: "adminStaff", label: "Staff & Discipline", icon: Wrench, badge: "HR/Admin" },
            { id: "notices", label: "Notice Broadcast", icon: FileText, badge: broadcasts.length },
            {
              id: "submissions",
              label: "Submission Tracker",
              icon: FileSpreadsheet,
              badge: `${submissionsList.filter((s) => s.status.includes("Submitted")).length}/6`
            },
            {
              id: "appointments",
              label: "Appointments",
              icon: Clock,
              badge: appointments.filter((a) => a.status === "Pending").length
            },
            { id: "audit", label: "Audit Log", icon: History, badge: auditLogs.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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

      {/* TAB 0: TODAY'S CLASSES & SCHEDULE (from GGI ERP Screenshot Page 1) */}
      {activeTab === "classes" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className={`${card} p-5 space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="text-indigo-600" size={20} />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Today's Classes (2026-10-14)
                  </h3>
                </div>
                <span className="text-xs font-mono bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg text-indigo-700 dark:text-indigo-300 font-semibold">
                  Wednesday • 4 Lectures
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    period: "Period 1",
                    subject: "Programming in PHP Laboratory",
                    branch: "Bachelor of Computer Applications 3-C",
                    room: "C-201",
                    batch: "Lab Group G1",
                    time: "09:00 AM – 09:50 AM"
                  },
                  {
                    period: "Period 2",
                    subject: "Programming in PHP Laboratory",
                    branch: "Bachelor of Computer Applications 3-C",
                    room: "C-201",
                    batch: "Lab Group G1",
                    time: "09:50 AM – 10:40 AM"
                  },
                  {
                    period: "Period 4",
                    subject: "Programming in PHP Laboratory",
                    branch: "Bachelor of Computer Applications 3-B",
                    room: "C-401",
                    batch: "Lab Group G2",
                    time: "11:30 AM – 12:20 PM"
                  },
                  {
                    period: "Period 5",
                    subject: "Programming in PHP Laboratory",
                    branch: "Bachelor of Computer Applications 3-B",
                    room: "C-401",
                    batch: "Lab Group G2",
                    time: "12:20 PM – 01:10 PM"
                  }
                ].map((cls, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                          {cls.period}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">({cls.time})</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {cls.subject}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {cls.branch} • <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">[{cls.room}]</span> • {cls.batch}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("roster");
                        showToast(`Opened Roster for ${cls.subject} (${cls.branch})`, "info");
                      }}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition whitespace-nowrap self-start sm:self-auto"
                    >
                      Take Attendance
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar from Photo 1 */}
          <div className="space-y-4">
            <div className={`${card} p-5 space-y-3`}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" /> Faculty Quick Actions
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Take Today's Attendance", action: () => setActiveTab("roster") },
                  { label: "Notice Broadcast to Class", action: () => setActiveTab("notices") },
                  { label: "Assignment Submission Tracker", action: () => setActiveTab("submissions") },
                  { label: "Monthly Attendance Calendar", action: () => setActiveTab("calendar") },
                  { label: "Enter MST & Internal Marks", action: () => setActiveTab("marks") }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={act.action}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center justify-between"
                  >
                    <span>{act.label}</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-4.5 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">
                Course Coordinator Note
              </span>
              <p className="text-xs leading-relaxed">
                Programming in PHP Lab (UGCA1930) mid-semester files must be verified by Friday 5:00 PM for all BCA 3-C batches.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: WEEKLY TIMETABLE SCHEDULE (GGI ERP Timetable - Pages 2, 3, 4) */}
      {activeTab === "timetable" && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className={`${card} p-5 space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Weekly Teaching & Lab Timetable Schedule
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic Session 2026-27 • Department of Computer Applications • Faculty: MS. NAVJOT (EID: 1708)
                </p>
              </div>

              {/* Day Selection Tabs with Class Badges */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
                {(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const).map((day) => {
                  const slots = FACULTY_WEEKLY_TIMETABLE[day] || [];
                  const activeCount = slots.filter((s) => s.status !== "Research / Off").length;
                  const isSelected = selectedDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <span>{day.substring(0, 3).toUpperCase()}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {activeCount} classes
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timetable Period Cards for Selected Day */}
            <div className="space-y-3">
              {(FACULTY_WEEKLY_TIMETABLE[selectedDay] || []).map((slot, idx) => {
                const isOff = slot.status === "Research / Off";
                const isLab = slot.status === "Lab Session";
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isOff
                        ? "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 opacity-80"
                        : isLab
                        ? "border-purple-200 dark:border-purple-900/50 bg-purple-50/30 dark:bg-purple-950/20 hover:border-purple-300"
                        : "border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 hover:border-blue-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md ${
                            isOff
                              ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              : isLab
                              ? "bg-purple-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {slot.period}
                        </span>
                        <span className="text-xs text-slate-500 font-mono font-medium">
                          {slot.time}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOff
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : isLab
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          }`}
                        >
                          {slot.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {slot.subject} <span className="font-mono text-xs font-normal text-slate-500">({slot.subjectCode})</span>
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {slot.classGroup} • Room:{" "}
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          [{slot.room}]
                        </span>
                      </p>
                    </div>

                    {!isOff ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab("roster");
                            showToast(`Opened student attendance roster for ${slot.classGroup}`, "info");
                          }}
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition whitespace-nowrap"
                        >
                          Take Attendance
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Departmental Research & Off Period</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: FACULTY DEVELOPMENT PROGRAMS (FDP) & ATAL TRACKER (Screenshot Page 6) */}
      {activeTab === "fdp" && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className={`${card} p-5 space-y-4`}>
            {/* Header with participant email */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-blue-600" size={20} />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Faculty Development Programs (FDP) & ATAL AI Initiatives
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Participant: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">nanumahi786@gmail.com</span> • MS. NAVJOT (Assistant Professor)
                </p>
              </div>

              {/* Filters matching Screenshot Page 6 */}
              <div className="flex items-center gap-2 flex-wrap">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Select FDP Type
                  </label>
                  <select
                    value={fdpFilterType}
                    onChange={(e) => setFdpFilterType(e.target.value)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <option value="All">All Types</option>
                    <option value="ATAL Offline">ATAL Offline</option>
                    <option value="FDP Offline">FDP Offline</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Select Month
                  </label>
                  <select
                    value={fdpFilterMonth}
                    onChange={(e) => setFdpFilterMonth(e.target.value)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <option value="All">All Months</option>
                    <option value="October 2026">October 2026</option>
                  </select>
                </div>

                <div className="self-end">
                  <button
                    onClick={() => showToast("Opening AICTE ATAL FDP Application Portal...", "info")}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus size={13} /> Apply New FDP
                  </button>
                </div>
              </div>
            </div>

            {/* FDP Cards Grid matching Screenshot Page 6 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fdpList
                .filter((f) => {
                  if (fdpFilterType !== "All" && f.mode !== fdpFilterType) return false;
                  return true;
                })
                .map((fdp) => (
                  <div
                    key={fdp.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                          {fdp.mode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            fdp.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {fdp.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                          {fdp.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          Application No: <span className="font-bold text-slate-800 dark:text-slate-200">{fdp.applicationNo}</span>
                        </p>
                      </div>

                      {/* Date Box with Starts / Ends */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Starts</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{fdp.startDate}</span>
                        </div>
                        <div className="border-l border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Ends</span>
                          <span className="text-xs font-bold text-red-600 dark:text-red-400">{fdp.endDate}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="text-slate-500">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Institute:</span>{" "}
                          {fdp.institute}
                        </p>
                        <p className="text-slate-500">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Thrust Area:</span>{" "}
                          {fdp.thrustArea}
                        </p>
                        <p className="text-slate-500">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Sub-thrust:</span>{" "}
                          <span className="font-medium text-slate-800 dark:text-slate-200">{fdp.subThrustArea}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      {fdp.status === "Completed" ? (
                        <button
                          onClick={() => showToast(`Downloading ATAL Certificate for ${fdp.title}...`, "success")}
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Download size={13} /> Verified Certificate
                        </button>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">Session In-Progress</span>
                      )}

                      {/* Red circle plus icon matching Screenshot Page 6 */}
                      <button
                        onClick={() => showToast(`FDP Details for Application ${fdp.applicationNo}: Approved by Department HOD.`, "info")}
                        className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center font-bold text-base shadow-sm transition"
                        title="View Full FDP Dossier"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: GGI ERP ACADEMIC & STUDENT AFFAIRS MODULES (Screenshots Pages 1-5) */}
      {activeTab === "academicModules" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Academic Affairs Section */}
            <div className={`${card} p-5 space-y-4`}>
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <BookOpen className="text-blue-600" size={20} />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Academic Affairs (GGI ERP Module)
                  </h3>
                  <p className="text-xs text-slate-500">Course Schemes, Syllabus, & Lecture Planners</p>
                </div>
              </div>

              <div className="grid gap-2">
                {[
                  { title: "View Timetable", desc: "Master schedule across all BCA sections", action: () => setActiveTab("timetable") },
                  { title: "Extra Lecture Scheduling", desc: "Book remedial lectures in Room B-204 or C-201", action: () => showToast("Extra Lecture booked for Saturday 10:00 AM.", "success") },
                  { title: "MST Micro Analysis", desc: "Question-wise scores & Course Outcome (CO) mapping", action: () => showToast("MST-1 Micro Analysis report generated for PHP.", "info") },
                  { title: "Calculate Internal", desc: "Automated 40-mark internal assessment evaluator", action: () => setActiveTab("marks") },
                  { title: "Upload Material", desc: "Upload lecture slides & syllabus to Central ERP", action: () => showToast("Study Material Uploader synced with College Repository.", "info") },
                  { title: "My Uploads", desc: "6 lecture PDFs currently hosted on student portal", action: () => showToast("Viewing 6 active ERP lecture handouts.", "info") },
                  { title: "List Schemes and Syllabus", desc: "BCA 5th Sem Complete Curricula (2026–27)", action: () => showToast("Downloaded BCA Scheme & Syllabus PDF.", "success") },
                  { title: "Upload Course Handout", desc: "Publish updated weekly course deliverables", action: () => showToast("Course Handout for UGCA1929 uploaded.", "success") },
                  { title: "View Academic Calendar", desc: "Semester examination dates & gazetted holidays", action: () => showToast("Mid-Sem Test II scheduled: 30 Oct - 05 Nov.", "info") }
                ].map((mod, i) => (
                  <button
                    key={i}
                    onClick={mod.action}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition">
                        {mod.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{mod.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 transition" />
                  </button>
                ))}
              </div>
            </div>

            {/* Student Affairs Section */}
            <div className={`${card} p-5 space-y-4`}>
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Users className="text-purple-600" size={20} />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Student Affairs & Attendance Desk
                  </h3>
                  <p className="text-xs text-slate-500">Student tracking, biometric capture & OD inbox</p>
                </div>
              </div>

              <div className="grid gap-2">
                {[
                  { title: "Track Student Record", desc: "360° academic history for BCA Section C", action: () => setActiveTab("roster") },
                  { title: "Student Attendance Capture Status", desc: "Biometric face recognition reconciliation", action: () => showToast("All 32 biometric attendance logs reconciled.", "success") },
                  { title: "Attendance Analysis", desc: "Batch attendance trends and shortage alerts", action: () => setActiveTab("calendar") },
                  { title: "Teacher Adjustments", desc: "Delegate lecture or swap slots with colleague", action: () => showToast("Teacher Adjustment request submitted to HOD.", "info") },
                  { title: "OD Inbox (Duty Leave)", desc: "2 pending duty leave verifications from students", action: () => showToast("Navigating to Duty Leave verification inbox.", "info") },
                  { title: "Task Manager", desc: "Pending internal marks lock & question paper draft", action: () => showToast("Task completed: Question paper submitted.", "success") },
                  { title: "Register Face Samples", desc: "Biometric capture for AI attendance cameras", action: () => setFaceRegModalOpen(true) }
                ].map((mod, i) => (
                  <button
                    key={i}
                    onClick={mod.action}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-purple-600 transition">
                        {mod.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{mod.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-purple-600 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ADMINISTRATIVE & STAFF TOOLS (Screenshots Pages 1-5) */}
      {activeTab === "adminStaff" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Staff Attendance & Leave */}
            <div className={`${card} p-5 space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-blue-600" size={20} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Staff Attendance & Leave Desk
                    </h3>
                    <p className="text-xs text-slate-500">Employee ID: 1708 • MS. NAVJOT</p>
                  </div>
                </div>
                <button
                  onClick={() => setLeaveModalOpen(true)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 transition"
                >
                  Apply Leave / OD
                </button>
              </div>

              {/* Leave Balances */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Casual Leave</span>
                  <span className="text-lg font-black text-blue-600">8 Days</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Medical Leave</span>
                  <span className="text-lg font-black text-emerald-600">5 Days</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Duty Leave (FDP)</span>
                  <span className="text-lg font-black text-purple-600">4 Days</span>
                </div>
              </div>

              {/* Biometric Punch Logs */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Today's Biometric Punch Status</h4>
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>In-Punch: <b>08:52 AM</b> (Main Campus Biometric Terminal #02)</span>
                  </div>
                  <Pill tone="green">Present • On Time</Pill>
                </div>
              </div>
            </div>

            {/* Register Face Samples & Biometrics */}
            <div className={`${card} p-5 space-y-4`}>
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Camera className="text-indigo-600" size={20} />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Biometric Face Samples Registry
                  </h3>
                  <p className="text-xs text-slate-500">AI Campus Security & Classroom Attendance Cameras</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Biometric Facial Embedding:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold">
                    Active (100% Match)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Registered with 12 angular vector samples for contactless attendance verification at Lab B-201 and Department Gate.
                </p>
                <button
                  onClick={() => setFaceRegModalOpen(true)}
                  className="w-full rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 py-2 text-xs font-bold transition"
                >
                  Re-capture Biometric Face Samples
                </button>
              </div>
            </div>

            {/* Student Discipline (Screenshot Page 3 & 4) */}
            <div className={`${card} p-5 space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="text-red-600" size={20} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Student Discipline Management
                    </h3>
                    <p className="text-xs text-slate-500">Report & track behavioral incidents</p>
                  </div>
                </div>
                <button
                  onClick={() => setIncidentModalOpen(true)}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 transition"
                >
                  Report Incident
                </button>
              </div>

              <div className="space-y-2">
                {incidentLogs.map((inc) => (
                  <div key={inc.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {inc.student} ({inc.roll})
                      </span>
                      <Pill tone={inc.severity === "Minor" ? "amber" : "red"}>{inc.severity}</Pill>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{inc.reason}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Date: {inc.date}</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Status: {inc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repair & Maintenance (Screenshot Page 4) */}
            <div className={`${card} p-5 space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="text-amber-600" size={20} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Repair & Maintenance Helpdesk
                    </h3>
                    <p className="text-xs text-slate-500">Classroom, Lab, and Office IT Infrastructure</p>
                  </div>
                </div>
                <button
                  onClick={() => setRepairModalOpen(true)}
                  className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 transition"
                >
                  Report Problem
                </button>
              </div>

              <div className="space-y-2">
                {repairRequests.map((req) => (
                  <div key={req.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{req.location}</span>
                      <Pill tone={req.status.includes("Resolved") ? "green" : "amber"}>{req.status}</Pill>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{req.issue}</p>
                    <span className="text-[11px] text-slate-400 block pt-1">Ticket Date: {req.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* TAB 4: DAILY ATTENDANCE CALENDAR (from GGI ERP Screenshot Page 5) */}
      {activeTab === "calendar" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCheck size={20} className="text-emerald-600" />
                Daily Attendance Calendar — October 2026
              </h3>
              <p className="text-xs text-slate-500">
                Click any day to review lecture logs, biometric verification status, and batch percentages.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" /> &gt;85% (High)</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-amber-500 inline-block" /> 75-84%</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-500 inline-block" /> &lt;75% (Shortage)</span>
            </div>
          </div>

          <div className={`${card} p-5 overflow-x-auto`}>
            <div className="min-w-[650px]">
              <div className="grid grid-cols-7 gap-2 pb-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-2 pt-3">
                {/* Simulated October 2026 calendar */}
                {[
                  { d: 1, pct: 92, status: "high", count: 4 },
                  { d: 2, pct: 0, status: "holiday", count: 0, note: "Gandhi Jayanti" },
                  { d: 3, pct: 88, status: "high", count: 3 },
                  { d: 4, pct: 0, status: "weekend", count: 0 },
                  { d: 5, pct: 85, status: "high", count: 4 },
                  { d: 6, pct: 78, status: "med", count: 4 },
                  { d: 7, pct: 89, status: "high", count: 4 },
                  { d: 8, pct: 91, status: "high", count: 3 },
                  { d: 9, pct: 84, status: "med", count: 4 },
                  { d: 10, pct: 72, status: "low", count: 2 },
                  { d: 11, pct: 0, status: "weekend", count: 0 },
                  { d: 12, pct: 88, status: "high", count: 4 },
                  { d: 13, pct: 93, status: "high", count: 4 },
                  { d: 14, pct: 90, status: "today", count: 4, isToday: true },
                  { d: 15, pct: 0, status: "future", count: 4, note: "Tech Fest" },
                  { d: 16, pct: 0, status: "future", count: 4 },
                  { d: 17, pct: 0, status: "future", count: 2 },
                  { d: 18, pct: 0, status: "weekend", count: 0 },
                  { d: 19, pct: 0, status: "future", count: 4 },
                  { d: 20, pct: 0, status: "holiday", count: 0, note: "Dussehra" },
                  { d: 21, pct: 0, status: "future", count: 4 },
                  { d: 22, pct: 0, status: "future", count: 4 },
                  { d: 23, pct: 0, status: "future", count: 4 },
                  { d: 24, pct: 0, status: "future", count: 2 },
                  { d: 25, pct: 0, status: "weekend", count: 0 },
                  { d: 26, pct: 0, status: "future", count: 4 },
                  { d: 27, pct: 0, status: "future", count: 4 },
                  { d: 28, pct: 0, status: "future", count: 4 },
                  { d: 29, pct: 0, status: "future", count: 4 },
                  { d: 30, pct: 0, status: "future", count: 4, note: "MST-2 Starts" },
                  { d: 31, pct: 0, status: "future", count: 2 }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (item.pct > 0 || item.isToday) {
                        setActiveTab("roster");
                        showToast(`Viewing session attendance for Oct ${item.d}`, "info");
                      }
                    }}
                    className={`h-20 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      item.isToday
                        ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/50"
                        : "border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40"
                    } ${item.pct > 0 || item.isToday ? "cursor-pointer hover:shadow-sm" : ""}`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${item.isToday ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}`}>
                        {item.d}
                      </span>
                      {item.isToday && <span className="text-[9px] font-bold uppercase text-indigo-600">Today</span>}
                      {item.note && <span className="text-[9px] text-amber-600 font-semibold truncate max-w-[50px]">{item.note}</span>}
                    </div>

                    {item.pct > 0 ? (
                      <div className="flex items-center gap-1.5 self-center">
                        <div
                          className={`w-7 h-7 rounded-full grid place-items-center text-white text-[10px] font-bold ${
                            item.pct >= 85 ? "bg-emerald-500" : item.pct >= 75 ? "bg-amber-500" : "bg-red-500"
                          }`}
                        >
                          {item.pct}%
                        </div>
                      </div>
                    ) : item.status === "holiday" ? (
                      <span className="text-[10px] text-center text-amber-600 font-semibold">Holiday</span>
                    ) : item.status === "weekend" ? (
                      <span className="text-[10px] text-center text-slate-400 font-medium">Sunday</span>
                    ) : (
                      <span className="text-[10px] text-center text-slate-400">—</span>
                    )}

                    <span className="text-[9px] text-center text-slate-400">
                      {item.count > 0 ? `${item.count} classes` : "No classes"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NOTICE BROADCAST (as per PPT specification) */}
      {activeTab === "notices" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Compose Notice Form */}
            <div className={`${card} p-5 space-y-4`}>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText size={18} className="text-indigo-600" />
                  Broadcast Class Announcement
                </h3>
                <p className="text-xs text-slate-500">
                  Transmit priority circulars, lab deadlines, and test notices directly to student dashboards.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!noticeTitle || !noticeBody) return;
                  const newB = {
                    id: `not-${Date.now()}`,
                    title: noticeTitle,
                    audience: noticeAudience,
                    body: noticeBody,
                    date: "Today, 14 Oct 2026",
                    urgent: isUrgentAlert
                  };
                  setBroadcasts([newB, ...broadcasts]);
                  showToast(`Notice "${noticeTitle}" broadcasted to ${noticeAudience}!`, "success");
                  logAudit("NOTICE_BROADCAST", `Sent notice to ${noticeAudience}: ${noticeTitle}`, "Student");
                  setNoticeTitle("");
                  setNoticeBody("");
                  setIsUrgentAlert(false);
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Section / Audience *
                  </label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900 font-semibold"
                  >
                    <option value="BCA (Sec C)">BCA (Section C) • 32 Students</option>
                    <option value="BCA (Sec B)">BCA (Section B) • 28 Students</option>
                    <option value="BCA (Sec C & B)">All BCA 3rd Year (Sec C & B)</option>
                    <option value="MCA 1st Year">MCA 1st Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder="e.g. PHP Lab File Submission Deadline Extended"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Body *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={noticeBody}
                    onChange={(e) => setNoticeBody(e.target.value)}
                    placeholder="Provide full instructions, room location, or required submission format..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="urgentAlert"
                    checked={isUrgentAlert}
                    onChange={(e) => setIsUrgentAlert(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="urgentAlert" className="text-xs font-bold text-amber-700 dark:text-amber-400 cursor-pointer">
                    Mark as Urgent Priority Alert (Triggers Instant Push Notification)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow-md transition"
                >
                  Broadcast Announcement
                </button>
              </form>
            </div>

            {/* Broadcast History */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>Recent Class Broadcasts</span>
                <span className="text-xs text-slate-500 font-normal">{broadcasts.length} Active</span>
              </h4>

              <div className="space-y-3">
                {broadcasts.map((b) => (
                  <div
                    key={b.id}
                    className={`${card} p-4 space-y-2 border ${
                      b.urgent ? "border-amber-400 dark:border-amber-800 bg-amber-50/20" : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">{b.title}</h5>
                          {b.urgent && (
                            <span className="rounded bg-red-100 dark:bg-red-950 px-1.5 py-0.5 text-[9px] font-bold text-red-700 dark:text-red-300 uppercase">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Audience: <b>{b.audience}</b> • {b.date}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{b.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SUBMISSION STATUS TRACKER (as per PPT specification) */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileSpreadsheet size={20} className="text-indigo-600" />
                Assignment Submission Status Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Track which students submitted assignments on time, late, or are still pending for Programming in PHP (UGCA1929).
              </p>
            </div>
            <button
              onClick={() => showToast("Exporting assignment grading records (CSV)...", "info")}
              className={`${ghost} text-xs`}
            >
              <Download size={14} /> Export Submissions CSV
            </button>
          </div>

          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Roll No</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Assignment Task</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Submitted On</th>
                  <th className="px-4 py-3 font-semibold text-center">Score / Grade</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {submissionsList.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-300">{sub.roll}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{sub.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{sub.task}</td>
                    <td className="px-4 py-3">
                      <Pill
                        tone={
                          sub.status === "Submitted On Time"
                            ? "green"
                            : sub.status === "Late Submission"
                            ? "amber"
                            : "red"
                        }
                      >
                        {sub.status}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{sub.date}</td>
                    <td className="px-4 py-3 text-center font-bold text-indigo-600 dark:text-indigo-400">{sub.grade}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => showToast(`Opening submitted PDF preview for ${sub.name}...`, "info")}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        View PDF
                      </button>
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

      {/* MODAL 6: REPORT INCIDENT MODAL */}
      <Modal
        isOpen={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
        title="Report Student Disciplinary Incident — GGI Proctor Office"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const stud = students.find((s) => s.rollNo === incidentRoll);
            const newInc = {
              id: `INC-${Math.floor(100 + Math.random() * 900)}`,
              roll: incidentRoll,
              student: stud?.name || "Student",
              date: "Today",
              reason: incidentDesc || "Unexcused violation reported by faculty",
              severity: incidentSeverity,
              status: "Under Proctor Review"
            };
            setIncidentLogs([newInc, ...incidentLogs]);
            showToast(`Incident reported for ${stud?.name} (${incidentRoll}) and sent to Proctor.`, "error");
            logAudit("DISCIPLINE_INCIDENT_REPORTED", `Reported ${incidentSeverity} incident for ${incidentRoll}: ${incidentDesc}`, "Student");
            setIncidentModalOpen(false);
            setIncidentDesc("");
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student *
            </label>
            <select
              value={incidentRoll}
              onChange={(e) => setIncidentRoll(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              {activeStudents.map((s) => (
                <option key={s.rollNo} value={s.rollNo}>
                  {s.name} ({s.rollNo}) — {s.branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Incident Severity Level *
            </label>
            <select
              value={incidentSeverity}
              onChange={(e) => setIncidentSeverity(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="Minor">Minor (Late arrival, uniform/ID violation)</option>
              <option value="Moderate">Moderate (Disturbance in class, unapproved device use)</option>
              <option value="Critical">Critical (Academic dishonesty / exam malpractice)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Incident Details & Observations *
            </label>
            <textarea
              required
              rows={3}
              value={incidentDesc}
              onChange={(e) => setIncidentDesc(e.target.value)}
              placeholder="Provide exact details, date/time, and witness statements..."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setIncidentModalOpen(false)} className={ghost}>
              Cancel
            </button>
            <button type="submit" className={danger}>
              Submit Incident Report
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 7: REPORT REPAIR & MAINTENANCE MODAL */}
      <Modal
        isOpen={repairModalOpen}
        onClose={() => setRepairModalOpen(false)}
        title="Report Campus Infrastructure Problem — GGI Estate & IT"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newReq = {
              id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
              location: repairLocation,
              issue: repairDesc || "Classroom hardware issue",
              date: "Today",
              status: "Dispatched to Tech Team"
            };
            setRepairRequests([newReq, ...repairRequests]);
            showToast(`Maintenance ticket logged for ${repairLocation}.`, "success");
            logAudit("MAINTENANCE_TICKET_LOGGED", `Logged maintenance request for ${repairLocation}: ${repairDesc}`, "Student");
            setRepairModalOpen(false);
            setRepairDesc("");
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Location / Room No *
            </label>
            <input
              type="text"
              required
              value={repairLocation}
              onChange={(e) => setRepairLocation(e.target.value)}
              placeholder="e.g. Lab B-201, Room C-401, Cabin B-205"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Issue Description & Equipment Type *
            </label>
            <textarea
              required
              rows={3}
              value={repairDesc}
              onChange={(e) => setRepairDesc(e.target.value)}
              placeholder="e.g. Projector HDMI port broken, AC cooling malfunction, or LAN switch offline..."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setRepairModalOpen(false)} className={ghost}>
              Cancel
            </button>
            <button type="submit" className={primary}>
              Log Maintenance Ticket
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 8: APPLY LEAVE & OD MODAL */}
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Apply Leave / Duty Leave (OD) — Faculty Desk"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast(`Leave application (${leaveType}) submitted to HOD Computer Applications.`, "success");
            logAudit("LEAVE_APPLICATION_SUBMITTED", `Applied for ${leaveType}: ${leaveReason}`, "Student");
            setLeaveModalOpen(false);
            setLeaveReason("");
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Leave Category *
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="Duty Leave (FDP)">Duty Leave (OD for FDP / Conference / Research)</option>
              <option value="Casual Leave">Casual Leave (CL)</option>
              <option value="Medical Leave">Medical Leave (ML)</option>
              <option value="Academic Leave">Academic Leave (University Evaluation / Exam Duty)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose / Supporting Note *
            </label>
            <textarea
              required
              rows={3}
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              placeholder="Mention FDP application ID, university circular, or reason..."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setLeaveModalOpen(false)} className={ghost}>
              Cancel
            </button>
            <button type="submit" className={primary}>
              Submit to HOD
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 9: BIOMETRIC FACE SAMPLE CAPTURE */}
      <Modal
        isOpen={faceRegModalOpen}
        onClose={() => setFaceRegModalOpen(false)}
        title="Biometric Face Sample Capture — AI Campus Vision"
      >
        <div className="space-y-4 text-center">
          <div className="relative mx-auto w-64 h-64 rounded-2xl bg-slate-900 border-2 border-indigo-500 overflow-hidden flex flex-col items-center justify-center text-white shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-indigo-500/20" />
            <Camera size={44} className="text-indigo-400 mb-2 animate-pulse" />
            <p className="text-xs font-semibold">AI Facial Detection Active</p>
            <p className="text-[10px] text-slate-400">Position face within the bounding frame</p>
            {/* Visual scan line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-indigo-400 shadow-[0_0_10px_#818cf8] animate-bounce" />
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
            <p className="font-bold">✓ 12/12 Facial Vector Landmarks Matched</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
              Target Profile: MS. NAVJOT (EID: 1708) • Confidence Score: 99.4%
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setFaceRegModalOpen(false)} className={ghost}>
              Close
            </button>
            <button
              onClick={() => {
                showToast("Biometric face vector updated and synced to classroom cameras!", "success");
                logAudit("BIOMETRIC_FACE_REGISTERED", "Updated 12-point facial vector for contactless attendance.", "Student");
                setFaceRegModalOpen(false);
              }}
              className={primary}
            >
              Save & Sync Biometrics
            </button>
          </div>
        </div>
      </Modal>

      {/* Extra Lecture & Custom Timetable Modal */}
      {extraLectureModalOpen && (
        <Modal
          isOpen={extraLectureModalOpen}
          title="Schedule Teacher Timetable & Extra Remedial Lecture"
          onClose={() => setExtraLectureModalOpen(false)}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Book special remedial classes or adjust weekly timetable slots for BCA Section C.
            </p>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Day:</label>
                <select
                  value={extraDay}
                  onChange={(e) => setExtraDay(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
                >
                  <option value="Saturday">Saturday (Remedial Day)</option>
                  <option value="Monday">Monday Extra Slot</option>
                  <option value="Wednesday">Wednesday Zero Period</option>
                  <option value="Friday">Friday Zero Period</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Period:</label>
                <select
                  value={extraPeriod}
                  onChange={(e) => setExtraPeriod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
                >
                  <option value="Period 3 (11:15 AM - 12:00 PM)">Period 3 (11:15 AM - 12:00 PM)</option>
                  <option value="Period 5 (01:30 PM - 02:15 PM)">Period 5 (01:30 PM - 02:15 PM)</option>
                  <option value="Period 6 (02:15 PM - 03:00 PM)">Period 6 (02:15 PM - 03:00 PM)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Classroom / Lab:</label>
                  <input
                    value={extraRoom}
                    onChange={(e) => setExtraRoom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject:</label>
                  <input
                    value={extraSubject}
                    onChange={(e) => setExtraSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Topic / Agenda:</label>
                <input
                  value={extraTopic}
                  onChange={(e) => setExtraTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setExtraLectureModalOpen(false)} className={ghost}>
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`Extra lecture scheduled for ${extraDay} in ${extraRoom}! Automated notification sent to BCA-3C.`, "success");
                  logAudit("EXTRA_LECTURE_SCHEDULED", `Booked remedial session for ${extraSubject} in ${extraRoom} on ${extraDay}.`, "Attendance");
                  setExtraLectureModalOpen(false);
                }}
                className={primary}
              >
                Confirm Timetable Slot
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Course Handout Deliverables Modal */}
      {courseHandoutModalOpen && (
        <Modal
          isOpen={courseHandoutModalOpen}
          title="Upload Course Handout & Deliverables"
          onClose={() => setCourseHandoutModalOpen(false)}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Publish semester course plan, weekly milestones, and reference reading list for institutional compliance.
            </p>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Course Code & Name:</label>
                <input
                  readOnly
                  value="UGCA1929 — Programming in PHP (Theory + Lab)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Course Deliverables & Plan Summary:</label>
                <textarea
                  value={handoutDeliverables}
                  onChange={(e) => setHandoutDeliverables(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setCourseHandoutModalOpen(false)} className={ghost}>
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast("Course handout published to Central ERP repository!", "success");
                  logAudit("COURSE_HANDOUT_PUBLISHED", "Uploaded weekly deliverables for UGCA1929.", "Student");
                  setCourseHandoutModalOpen(false);
                }}
                className={primary}
              >
                Publish Handout PDF
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Faculty Task Manager Modal */}
      {taskManagerModalOpen && (
        <Modal
          isOpen={taskManagerModalOpen}
          title="Faculty Academic Task Manager"
          onClose={() => setTaskManagerModalOpen(false)}
        >
          <div className="space-y-3 text-xs">
            {[
              { task: "Lock MST-1 Marks on University Portal", due: "15 Oct 2026", done: true },
              { task: "Submit ATAL FDP Completion Report & Certificates", due: "20 Oct 2026", done: false },
              { task: "Submit Question Bank for MST-II (Units III & IV)", due: "24 Oct 2026", done: false },
              { task: "Conduct Monthly Shortage Review for Detained Students", due: "28 Oct 2026", done: false }
            ].map((t, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className={`font-bold block ${t.done ? "line-through text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
                    {t.task}
                  </span>
                  <span className="text-[11px] text-slate-400">Due: {t.due}</span>
                </div>
                <Pill tone={t.done ? "green" : "amber"}>
                  {t.done ? "Completed ✓" : "Pending"}
                </Pill>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button onClick={() => setTaskManagerModalOpen(false)} className={primary}>
                Close Tasks
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
