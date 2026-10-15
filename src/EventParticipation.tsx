import React, { useState, useEffect } from "react";
import {
  PartyPopper,
  Info,
  User,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  FileText,
  FileCheck,
  Award,
  MessageSquare,
  Star,
  Download,
  Send,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Edit3,
  Save,
  Printer,
  QrCode,
  RotateCcw
} from "lucide-react";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";
import { FACULTY, EVENTS, CERTIFICATES } from "./data";
import GgiLogoSticker from "./GgiLogoSticker";

export type EventSubView =
  | "event-general-details"
  | "event-profile"
  | "event-fdps"
  | "event-applied-fdps"
  | "event-attendance"
  | "event-assessment"
  | "event-feedback"
  | "event-important-docs"
  | "event-test-marks"
  | "event-certificate"
  | "event-teacher-feedback";

interface TeacherFeedback {
  id: string;
  targetType: "Teacher" | "Admin";
  targetName: string;
  rating: number;
  category: string;
  comments: string;
  submittedAt: string;
  studentName: string;
}

export default function EventParticipation({
  subView = "event-general-details",
  onNav
}: {
  subView?: EventSubView | string;
  onNav: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<string>(subView);

  // Sync when subView prop changes from navigation sidebar
  React.useEffect(() => {
    if (subView) setActiveTab(subView);
  }, [subView]);

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState<"Teacher" | "Admin">("Teacher");
  const [selectedFaculty, setSelectedFaculty] = useState(FACULTY[0]);
  const [rating, setRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState("Teaching Methodology & Subject Clarity");
  const [comments, setComments] = useState("");
  const [feedbacks, setFeedbacks] = useState<TeacherFeedback[]>([
    {
      id: "fb-1",
      targetType: "Teacher",
      targetName: "Ms. Navjot Kaur",
      rating: 5,
      category: "Practical Lab Mentorship",
      comments: "Exceptional guidance in PHP MySQL Lab sessions and query debugging.",
      submittedAt: "10 Oct 2026",
      studentName: "Rajveer Singh"
    },
    {
      id: "fb-2",
      targetType: "Admin",
      targetName: "Admin Office (Registrar)",
      rating: 4,
      category: "Duty Leave Verification Speed",
      comments: "Duty leave verification was processed within 24 hours for Tech Fest.",
      submittedAt: "12 Oct 2026",
      studentName: "Rajveer Singh"
    }
  ]);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      showToast("Please provide detailed feedback comments.", "error");
      return;
    }

    const newFb: TeacherFeedback = {
      id: `fb-${Date.now()}`,
      targetType: feedbackType,
      targetName: feedbackType === "Teacher" ? selectedFaculty : "GGI Academic Administration",
      rating,
      category: feedbackCategory,
      comments,
      submittedAt: "Today, 14 Oct 2026",
      studentName: "Rajveer Singh"
    };

    setFeedbacks([newFb, ...feedbacks]);
    showToast(`Feedback submitted successfully for ${newFb.targetName}!`, "success");
    setComments("");
  };

  // General Details State (Allows writing Name, Department, Domain, Branch, Roll No, etc.)
  const GENERAL_DETAILS_KEY = "ggi_student_event_general_details";
  const [generalDetails, setGeneralDetails] = useState({
    name: "Rajveer Singh",
    rollNo: "2433613",
    department: "Dept. of Computer Applications",
    branch: "BCA (Bachelor of Computer Applications)",
    domain: "Full Stack Web Development & AI Agents",
    semester: "Semester 5 (3rd Year)",
    section: "Section C",
    email: "student@smartcampus.demo",
    phone: "+91 98765 43210",
    targetEvent: "Tech Fest 2026 (TechTalk Debate, Presentation & Type Master)",
    projectTitle: "AI-Powered Smart Attendance & Campus Micro-Credential Verification System",
    teamRole: "Team Captain / Lead Developer"
  });

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(GENERAL_DETAILS_KEY);
      if (saved) setGeneralDetails(JSON.parse(saved));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSaveGeneralDetails = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(GENERAL_DETAILS_KEY, JSON.stringify(generalDetails));
    } catch (err) {
      console.error(err);
    }
    showToast("General Details updated and saved successfully!", "success");
  };

  const handleResetGeneralDetails = () => {
    const defaultData = {
      name: "Rajveer Singh",
      rollNo: "2433613",
      department: "Dept. of Computer Applications",
      branch: "BCA (Bachelor of Computer Applications)",
      domain: "Full Stack Web Development & AI Agents",
      semester: "Semester 5 (3rd Year)",
      section: "Section C",
      email: "student@smartcampus.demo",
      phone: "+91 98765 43210",
      targetEvent: "Tech Fest 2026 (TechTalk Debate, Presentation & Type Master)",
      projectTitle: "AI-Powered Smart Attendance & Campus Micro-Credential Verification System",
      teamRole: "Team Captain / Lead Developer"
    };
    setGeneralDetails(defaultData);
    try {
      localStorage.setItem(GENERAL_DETAILS_KEY, JSON.stringify(defaultData));
    } catch (err) {
      console.error(err);
    }
    showToast("Reset to institutional profile defaults.", "info");
  };

  const navTabs = [
    { id: "event-general-details", label: "General Details (Editable)", icon: Edit3 },
    { id: "event-profile", label: "Participant Profile", icon: User },
    { id: "event-fdps", label: "FDPs Catalog", icon: GraduationCap },
    { id: "event-applied-fdps", label: "Applied FDPs", icon: FileCheck },
    { id: "event-attendance", label: "Event Attendance", icon: CalendarCheck },
    { id: "event-assessment", label: "Assessment Rubric", icon: Sparkles },
    { id: "event-feedback", label: "Event Feedback", icon: MessageSquare },
    { id: "event-important-docs", label: "Important Docs", icon: FileText },
    { id: "event-test-marks", label: "Test Marks", icon: Award },
    { id: "event-certificate", label: "E-Certificates", icon: ShieldCheck },
    { id: "event-teacher-feedback", label: "Feedback for Teacher/Admin", icon: Star }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PartyPopper className="text-indigo-600 dark:text-indigo-400" size={24} />
            Campus Events & Participation Hub
          </h2>
          <p className="text-xs text-slate-500">
            Official participation lifecycle: details, attendance, evaluations, certificates & institutional feedback.
          </p>
        </div>
        <button onClick={() => onNav("events")} className={primary}>
          <PartyPopper size={15} /> View All Event Passes
        </button>
      </div>

      {/* Horizontal Sub-Navigation Tab Strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL DETAILS (EDITABLE FORM + LIVE PASS PREVIEW) */}
      {activeTab === "event-general-details" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left 7 Cols: Editable Details Form */}
            <div className={`${card} p-5 lg:col-span-7 space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <Edit3 size={18} /> Student General Details & Registration Form
                </div>
                <button
                  type="button"
                  onClick={handleResetGeneralDetails}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset Defaults
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Update your official identity, department, specialization domain, branch, and roll number for campus events, hackathons, and symposiums.
              </p>

              <form onSubmit={handleSaveGeneralDetails} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Full Student Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={generalDetails.name}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, name: e.target.value })}
                      placeholder="e.g. Rajveer Singh"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      University Roll Number *
                    </label>
                    <input
                      required
                      type="text"
                      value={generalDetails.rollNo}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, rollNo: e.target.value })}
                      placeholder="e.g. 2433613"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 font-mono font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Department *
                    </label>
                    <input
                      required
                      type="text"
                      value={generalDetails.department}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, department: e.target.value })}
                      placeholder="e.g. Dept. of Computer Applications"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Branch */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Branch / Degree *
                    </label>
                    <input
                      required
                      type="text"
                      value={generalDetails.branch}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, branch: e.target.value })}
                      placeholder="e.g. BCA / B.Tech CSE / MCA"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Domain (Demain) */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block flex items-center justify-between">
                      <span>Domain / Technical Specialization (Demain) *</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">Web / AI / Cloud / IoT</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={generalDetails.domain}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, domain: e.target.value })}
                      placeholder="e.g. Full Stack Web Development & AI Agents"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Semester & Section */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Semester & Year
                    </label>
                    <input
                      type="text"
                      value={generalDetails.semester}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, semester: e.target.value })}
                      placeholder="e.g. 5th Semester (3rd Year)"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Section
                    </label>
                    <input
                      type="text"
                      value={generalDetails.section}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, section: e.target.value })}
                      placeholder="e.g. Section C"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Campus Email ID
                    </label>
                    <input
                      type="email"
                      value={generalDetails.email}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, email: e.target.value })}
                      placeholder="e.g. student@smartcampus.demo"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Contact Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={generalDetails.phone}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  {/* Event Selection */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Selected Event / Competition
                    </label>
                    <input
                      type="text"
                      value={generalDetails.targetEvent}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, targetEvent: e.target.value })}
                      placeholder="e.g. Tech Fest 2026 / Smart India Hackathon 2026"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  {/* Project Title & Role */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Project / Innovation Title
                    </label>
                    <input
                      type="text"
                      value={generalDetails.projectTitle}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, projectTitle: e.target.value })}
                      placeholder="e.g. AI-Powered Smart Campus Verification"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Team Role / Designation
                    </label>
                    <input
                      type="text"
                      value={generalDetails.teamRole}
                      onChange={(e) => setGeneralDetails({ ...generalDetails, teamRole: e.target.value })}
                      placeholder="e.g. Team Lead / FullStack Developer"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    Changes persist locally across portal sessions.
                  </span>
                  <button type="submit" className={`${primary} flex items-center gap-1.5`}>
                    <Save size={15} /> Save & Update Details
                  </button>
                </div>
              </form>
            </div>

            {/* Right 5 Cols: Live Digital Event Badge / Pass Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-5 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
                {/* Gloss flare */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative space-y-4">
                  {/* Badge Header with GGI sticker logo */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <GgiLogoSticker size="sm" />
                    <Pill tone="green">Verified Participant</Pill>
                  </div>

                  {/* Profile info preview */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
                      {generalDetails.name[0] || "S"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-extrabold text-white truncate">
                        {generalDetails.name || "Student Name"}
                      </h4>
                      <p className="text-xs text-indigo-300 font-mono">
                        Roll No: {generalDetails.rollNo || "—"}
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                        {generalDetails.branch || "—"} • {generalDetails.section || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Highlighted Spec / Domain */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      <span>Department:</span>
                      <span className="text-indigo-300 truncate max-w-[170px] text-right font-medium">
                        {generalDetails.department}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      <span>Domain (Demain):</span>
                      <span className="text-emerald-300 font-bold truncate max-w-[170px] text-right">
                        {generalDetails.domain}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      <span>Target Event:</span>
                      <span className="text-amber-300 truncate max-w-[170px] text-right">
                        {generalDetails.targetEvent}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      <span>Project Concept:</span>
                      <span className="text-white truncate max-w-[170px] text-right">
                        {generalDetails.projectTitle}
                      </span>
                    </div>
                  </div>

                  {/* HMAC Hash & Security Stamp */}
                  <div className="pt-2 flex items-center justify-between text-[10px] text-indigo-300 font-mono">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-400" /> Duty Leave: Pre-Approved
                    </span>
                    <span>HMAC-SHA256:OK</span>
                  </div>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2 text-xs font-bold text-white transition flex items-center justify-center gap-2"
                  >
                    <Printer size={14} /> Print Event Pass
                  </button>
                </div>
              </div>

              {/* Quick Official Guidelines Notice */}
              <div className={`${card} p-4 space-y-2 text-xs`}>
                <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                  <Info size={15} /> Reporting & DL Policy
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Present this verified digital pass at the entrance scanner desk. Once verified, biometric attendance is automatically updated as <b>Duty Leave (DL)</b> for all scheduled lectures.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE */}
      {activeTab === "event-profile" && (
        <div className={`${card} p-6 max-w-2xl space-y-4`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Rajveer Singh</h3>
                <Pill tone="indigo">Verified Participant</Pill>
              </div>
              <p className="text-xs text-slate-500 font-mono">Roll No: 2433613 • BCA Year 3 (Section C)</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Gulzar Group of Institutes (Khanna, Punjab)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block">Team Lead Role:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">CodeCrafters Captain</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block">Primary Specialization:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">Full Stack & Debate</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block">Duty Leave Status:</span>
              <span className="font-bold text-emerald-600">Approved by HOD</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block">Biometric QR Hash:</span>
              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">HMAC-SHA256-VALID</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 & 4: FDPS & APPLIED FDPS */}
      {(activeTab === "event-fdps" || activeTab === "event-applied-fdps") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Faculty & Student Development Programs (FDPs)
            </h3>
            <span className="text-xs text-indigo-600 font-semibold">AICTE ATAL & Academic Workshops</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className={`${card} p-4 space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  GenAI & LLM Application Engineering
                </span>
                <Pill tone="green">Applied</Pill>
              </div>
              <p className="text-xs text-slate-500">PICT Pune • AICTE ATAL Academy (5 Days Hands-on)</p>
              <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Application ID: 1774003396</span>
                <span className="text-emerald-600 font-semibold">Approved for Attendance Credit</span>
              </div>
            </div>

            <div className={`${card} p-4 space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Cloud Native Microservices Architecture
                </span>
                <Pill tone="indigo">Upcoming</Pill>
              </div>
              <p className="text-xs text-slate-500">Manipal University Jaipur • Hybrid Workshop</p>
              <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Dates: 18 Nov – 22 Nov 2026</span>
                <button onClick={() => showToast("Nomination requested!", "success")} className="text-indigo-600 font-bold hover:underline">
                  Apply Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ATTENDANCE */}
      {activeTab === "event-attendance" && (
        <div className={`${card} p-5 space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Event Biometric Gate Check-in Logs
            </h3>
            <Pill tone="green">100% Present</Pill>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase">
              <tr>
                <th className="py-2">Event Title</th>
                <th className="py-2">Check-in Time</th>
                <th className="py-2">Gate Scanner</th>
                <th className="py-2">DL Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">Tech Fest Inauguration</td>
                <td className="py-3 font-mono">08:52 AM</td>
                <td className="py-3">Main Auditorium Cam-01</td>
                <td className="py-3"><Pill tone="green">Present (Credited)</Pill></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">Debate Prelims Session</td>
                <td className="py-3 font-mono">01:15 PM</td>
                <td className="py-3">Seminar Hall Desk</td>
                <td className="py-3"><Pill tone="green">Present (Credited)</Pill></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: ASSESSMENT */}
      {activeTab === "event-assessment" && (
        <div className={`${card} p-5 space-y-4`}>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Event Judging Rubric & Performance Assessment
          </h3>
          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block">Technical Depth:</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">9.5 / 10</span>
              <p className="text-[11px] text-emerald-600 mt-1">Excellent clarity on PHP MySQL architecture.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block">Presentation & Rhetoric:</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">9.0 / 10</span>
              <p className="text-[11px] text-emerald-600 mt-1">Strong argument structuring in debate rounds.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block">Overall Standing:</span>
              <span className="text-lg font-bold text-indigo-600">1st Position</span>
              <p className="text-[11px] text-indigo-600 mt-1">Recommended for Gold Merit Certificate.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: EVENT FEEDBACK */}
      {activeTab === "event-feedback" && (
        <div className={`${card} p-5 max-w-xl space-y-4`}>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Event Participant Experience Feedback
          </h3>
          <p className="text-xs text-slate-500">Help the organizing committee improve future campus hackathons.</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Event Logistics & Lab Quality
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => showToast(`Rated ${s} stars!`, "success")} className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 hover:scale-110 transition">
                    <Star size={18} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="What did you enjoy most about the event? (e.g. Speed typing testing, debate rounds)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs"
              rows={3}
            />
            <button onClick={() => showToast("Event feedback recorded! Thank you.", "success")} className={primary}>
              Submit Event Feedback
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: IMPORTANT DOCUMENTS */}
      {activeTab === "event-important-docs" && (
        <div className={`${card} p-5 space-y-4`}>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Important Event & Academic Documents
          </h3>
          <div className="space-y-2">
            {[
              { name: "TechFest_2026_Rulebook_Debate.pdf", size: "1.4 MB", date: "10 Oct 2026" },
              { name: "Duty_Leave_Undertaking_Signed.pdf", size: "840 KB", date: "12 Oct 2026" },
              { name: "Event_Pass_HMAC_Verification_Slip.pdf", size: "520 KB", date: "14 Oct 2026" }
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-indigo-600" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">{d.name}</span>
                    <span className="text-[11px] text-slate-400">{d.size} • Uploaded {d.date}</span>
                  </div>
                </div>
                <button onClick={() => showToast(`Downloading ${d.name}...`, "success")} className={`${ghost} !py-1 !px-2.5`}>
                  <Download size={13} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: TEST MARKS */}
      {activeTab === "event-test-marks" && (
        <div className={`${card} p-5 space-y-4`}>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Event Coding & Test Marks Breakdown
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">Round 1: Speed Typing Master</span>
                <span className="text-[11px] text-slate-500">68 WPM with 99.2% Accuracy</span>
              </div>
              <span className="text-sm font-bold text-emerald-600">48 / 50</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">Round 2: Technical Debate Presentation</span>
                <span className="text-[11px] text-slate-500">Rebuttal score & audience voting</span>
              </div>
              <span className="text-sm font-bold text-emerald-600">46 / 50</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: CERTIFICATES */}
      {activeTab === "event-certificate" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Verifiable E-Certificates Vault
            </h3>
            <button onClick={() => onNav("certs")} className="text-xs text-indigo-600 font-bold hover:underline">
              Open Full Vault →
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {CERTIFICATES.slice(0, 2).map((c) => (
              <div key={c.id} className={`${card} p-4 space-y-2 border-indigo-200 dark:border-indigo-800`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600">{c.id}</span>
                  <Pill tone="green"><ShieldCheck size={11} className="mr-0.5 inline" /> Verified</Pill>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{c.title}</h4>
                <p className="text-xs text-slate-500">{c.event} • Standing: <b>{c.gradeOrRank}</b></p>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">{c.verificationHash}</span>
                  <button onClick={() => showToast(`Downloading ${c.id}.pdf`, "success")} className={`${primary} !py-1 !px-2.5 text-xs`}>
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 11: FEEDBACK FOR TEACHER OR ADMIN (User Requirement #2) */}
      {activeTab === "event-teacher-feedback" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Feedback Submission Form */}
          <div className={`${card} p-5 space-y-4`}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Star className="text-amber-500" size={18} />
                Submit Feedback for Teacher or Admin
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Constructive feedback submitted here is routed to Department HOD and Academic Office.
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackType("Teacher")}
                    className={`py-2 rounded-xl font-bold border transition ${
                      feedbackType === "Teacher"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Faculty / Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType("Admin")}
                    className={`py-2 rounded-xl font-bold border transition ${
                      feedbackType === "Admin"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    College Administration
                  </button>
                </div>
              </div>

              {feedbackType === "Teacher" ? (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Faculty:
                  </label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
                  >
                    {FACULTY.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Administrative Wing:
                  </label>
                  <input
                    readOnly
                    value="GGI Academic Affairs & Registrar Office"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-600"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Rating:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1.5 text-amber-500 hover:scale-110 transition"
                    >
                      <Star size={20} fill={s <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {rating} of 5 Stars ({rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : "Needs Attention"})
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Evaluation Dimension:
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
                >
                  <option value="Teaching Methodology & Subject Clarity">Teaching Methodology & Subject Clarity</option>
                  <option value="Lab Guidance & Query Debugging">Lab Guidance & Query Debugging</option>
                  <option value="Timely Internal Assessment & Marks Feedback">Timely Internal Assessment & Marks Feedback</option>
                  <option value="Duty Leave / OD Approval Responsiveness">Duty Leave / OD Approval Responsiveness</option>
                  <option value="Mentorship & Placement Career Guidance">Mentorship & Placement Career Guidance</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Detailed Observations / Feedback:
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share specific examples or suggestions..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button type="submit" className={`${primary} w-full !py-2.5`}>
                <Send size={14} /> Submit Confidential Institutional Review
              </button>
            </form>
          </div>

          {/* Feedback History Ledger */}
          <div className={`${card} p-5 space-y-4`}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Feedback Ledger & Acknowledgements
              </h3>
              <p className="text-xs text-slate-500">Official log of submitted reviews and their action status.</p>
            </div>

            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {fb.targetName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={13} fill="currentColor" /> {fb.rating}.0
                    </div>
                  </div>
                  <Pill tone={fb.targetType === "Teacher" ? "purple" : "indigo"}>
                    {fb.category}
                  </Pill>
                  <p className="text-slate-600 dark:text-slate-300 italic">
                    "{fb.comments}"
                  </p>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span>By: {fb.studentName}</span>
                    <span>{fb.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
