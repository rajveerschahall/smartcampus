import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  FileText,
  UserCheck,
  PartyPopper,
  Users,
  FileSignature,
  Award,
  Trophy,
  Settings as SettingsIcon,
  Search,
  Bell,
  Sun,
  Moon,
  Bot,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  CalendarDays,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LucideIcon,
  Briefcase,
  BookOpen,
  BookMarked,
  Clock,
  ChevronDown,
  ChevronRight,
  Camera,
  AlertTriangle,
  Wrench,
  CheckSquare,
  BarChart3,
  Megaphone
} from "lucide-react";

import { DEMO_USERS, User as UserModel, INITIAL_NOTIFICATIONS, CampusNotification } from "./data";
import Dashboard from "./Dashboard";
import Timetable from "./Timetable";
import Attendance from "./Attendance";
import Marks from "./Marks";
import Assignments from "./Assignments";
import Appointments from "./Appointments";
import Events from "./Events";
import TeamBuilder from "./TeamBuilder";
import DutyLeave from "./DutyLeave";
import Certificates from "./Certificates";
import XPBadges from "./XPBadges";
import Settings from "./Settings";
import Admin from "./Admin";
import FacultyPortal from "./FacultyPortal";
import PlacementPortal from "./PlacementPortal";
import LibraryPortal from "./LibraryPortal";
import StudyMaterialPortal from "./StudyMaterialPortal";
import EventParticipation from "./EventParticipation";
import CommandPalette from "./CommandPalette";
import NotificationsModal from "./NotificationsModal";
import AiAssistantModal from "./AiAssistantModal";
import DigitalBoard from "./DigitalBoard";
import GgiLogoSticker from "./GgiLogoSticker";
import { card, primary, ghost, Pill, ToastContainer, showToast } from "./ui";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  subItems?: { id: string; label: string }[];
}

export interface NavGroup {
  g: string;
  items: NavItem[];
}

const STUDENT_NAV: NavGroup[] = [
  {
    g: "Academic Portal",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "digital-board", label: "Digital Notice Board", icon: Megaphone },
      { id: "timetable", label: "Timetable & Classes", icon: CalendarDays },
      { id: "attendance", label: "Attendance & Bunk Calc", icon: CalendarCheck },
      { id: "marks", label: "Marks & Grades", icon: GraduationCap },
      { id: "assignments", label: "PDF Assignments", icon: FileText },
      { id: "study-materials", label: "ERP Study Material", icon: BookOpen },
    ],
  },
  {
    g: "Career & Placement",
    items: [
      { id: "placement", label: "Placement Cell (Jobs)", icon: Briefcase },
    ],
  },
  {
    g: "Library & Desk",
    items: [
      { id: "library", label: "Digital Library (Fine Alert)", icon: BookMarked },
      { id: "appointments", label: "Teacher Appointment Desk", icon: UserCheck },
    ],
  },
  {
    g: "Events & Campus Life",
    items: [
      { id: "events", label: "Events Hub & Passes", icon: PartyPopper },
      {
        id: "event-general-details",
        label: "Event Participation Hub",
        icon: Sparkles,
        subItems: [
          { id: "event-general-details", label: "General Details" },
          { id: "event-profile", label: "Participant Profile" },
          { id: "event-fdps", label: "FDP Programs" },
          { id: "event-applied-fdps", label: "Applied FDPs" },
          { id: "event-attendance", label: "Event Attendance" },
          { id: "event-assessment", label: "Assessment Tasks" },
          { id: "event-feedback", label: "Event Feedback" },
          { id: "event-important-docs", label: "Important Documents" },
          { id: "event-test-marks", label: "Test Marks" },
          { id: "event-certificate", label: "Certificates Vault" },
          { id: "event-teacher-feedback", label: "Feedback for Teacher/Admin" },
        ],
      },
      { id: "team", label: "Hackathon Teams", icon: Users },
      { id: "dl", label: "Duty Leave (DL)", icon: FileSignature },
      { id: "certs", label: "E-Certificates Vault", icon: Award },
    ],
  },
  {
    g: "Personal",
    items: [
      { id: "xp", label: "XP & Leaderboard", icon: Trophy },
      { id: "settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

const FACULTY_NAV: NavGroup[] = [
  {
    g: "Campus Portals",
    items: [
      { id: "dashboard", label: "Campus Dashboard", icon: LayoutDashboard },
      { id: "digital-board", label: "Digital Notice Board (Broadcast)", icon: Megaphone },
      { id: "faculty-profile", label: "Faculty Master ERP", icon: Users },
    ],
  },
  {
    g: "Academic Affairs",
    items: [
      { id: "faculty-timetable", label: "View Timetable", icon: CalendarDays },
      { id: "faculty-timetable-set", label: "Set Timetable & Extra Lectures", icon: CalendarCheck },
      { id: "faculty-mst", label: "MST Micro Analysis", icon: BarChart3 },
      { id: "faculty-internal", label: "Calculate Internal (40M)", icon: GraduationCap },
      { id: "faculty-material", label: "Upload Material", icon: BookOpen },
      { id: "faculty-schemes", label: "My Uploads & Schemes / Syllabus", icon: FileText },
      { id: "faculty-course-handout", label: "Upload Course Handout", icon: FileSignature },
      { id: "faculty-calendar", label: "View Academic Calendar", icon: CalendarDays },
    ],
  },
  {
    g: "Student Affairs",
    items: [
      { id: "faculty-student-record", label: "Track Student Record (32)", icon: Users },
      { id: "appointments", label: "Teacher Appointment Desk", icon: UserCheck },
    ],
  },
  {
    g: "Staff Attendance & Leave",
    items: [
      { id: "faculty-staff-attendance", label: "Attendance Analysis", icon: CalendarCheck },
      { id: "faculty-adjustment", label: "Teacher Adjustment", icon: UserCheck },
      { id: "faculty-op-index", label: "OP Index", icon: Award },
    ],
  },
  {
    g: "Staff Operations & Tools",
    items: [
      { id: "faculty-task-manager", label: "Task Manager", icon: CheckSquare },
      { id: "faculty-face-samples", label: "Register Face Samples", icon: Camera },
      { id: "faculty-attendance-capture", label: "Student Attendance Capture Status", icon: UserCheck },
    ],
  },
  {
    g: "Campus Life & Placement",
    items: [
      { id: "placement", label: "Placement Cell Drives", icon: Briefcase },
      { id: "events", label: "Events Hub & Passes", icon: PartyPopper },
    ],
  },
  {
    g: "Student Discipline",
    items: [
      { id: "faculty-discipline-report", label: "Report Incident", icon: AlertTriangle },
      { id: "faculty-discipline-history", label: "My Incident Report", icon: FileText },
    ],
  },
  {
    g: "Repair & Maintenance",
    items: [
      { id: "faculty-maintenance-report", label: "Report a Problem", icon: Wrench },
      { id: "faculty-maintenance-history", label: "My Problem", icon: CheckSquare },
    ],
  },
  {
    g: "Personal",
    items: [
      { id: "settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

const ADMIN_NAV: NavGroup[] = [
  {
    g: "Administration",
    items: [
      { id: "manage", label: "Verification Console", icon: ShieldCheck },
      { id: "digital-board", label: "Digital Notice Board Broadcast", icon: Megaphone },
      { id: "placement", label: "Placement Drives Admin", icon: Briefcase },
      { id: "library", label: "Library Circulation Desk", icon: BookMarked },
      { id: "study-materials", label: "ERP Repository Admin", icon: BookOpen },
      { id: "timetable", label: "Master Timetable", icon: CalendarDays },
      { id: "events", label: "Manage Events", icon: PartyPopper },
      { id: "settings", label: "Admin Settings", icon: SettingsIcon },
    ],
  },
];

function Login({ onLogin }: { onLogin: (u: UserModel) => void }) {
  const [e, setE] = useState("student@smartcampus.demo");
  const [p, setP] = useState("Student@123");
  const [err, setErr] = useState("");

  const submit = () => {
    const u = DEMO_USERS.find((x) => x.email === e && x.password === p);
    if (u) {
      onLogin(u);
    } else {
      setErr("Invalid email or password. Please use the demo credentials below.");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 p-12 text-white lg:flex relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-3">
            <GgiLogoSticker size="md" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">GULZAR GROUP OF INSTITUTES</h1>
              <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Khanna, Ludhiana GT Road • NAAC A+ Accredited</p>
            </div>
          </div>
        </div>

        <div className="max-w-md space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/20">
            <Sparkles size={14} className="text-amber-300" /> Next-Gen Smart Campus ERP
          </div>
          <h2 className="text-4xl font-extrabold leading-tight">
            One Unified Campus Portal for Students, Faculty & Admin.
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Real-time biometric attendance tracker, automated Duty Leave (DL) workflow, rotating HMAC-SHA256 event passes, hackathon team builder, and grade analytics in one place.
          </p>
        </div>

        <div className="text-xs text-indigo-200 flex items-center justify-between border-t border-white/10 pt-4">
          <span>Developed with Senior-Grade Engineering</span>
          <span>Version 3.4.0 (Production)</span>
        </div>
      </div>

      <main className="grid place-items-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className={`${card} w-full max-w-md space-y-5 p-8 shadow-xl`}>
          <div className="flex items-center gap-3">
            <GgiLogoSticker size="sm" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Welcome Back</h2>
              <p className="text-xs text-slate-500">Sign in with institutional credentials to access your portal</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Campus Email
              <input
                type="email"
                value={e}
                onChange={(x) => setE(x.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
              <input
                type="password"
                value={p}
                onChange={(x) => setP(x.target.value)}
                onKeyDown={(x) => x.key === "Enter" && submit()}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          {err && (
            <p role="alert" className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-800">
              {err}
            </p>
          )}

          <button onClick={submit} className={`${primary} w-full !py-2.5 text-sm font-semibold`}>
            Sign In to SmartCampus
          </button>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 p-3.5 text-xs dark:bg-slate-900/60 space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px] uppercase tracking-wider">
              Quick One-Click Demo Personas:
            </span>
            <div className="space-y-1.5">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  onClick={() => {
                    setE(u.email);
                    setP(u.password);
                    onLogin(u);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{u.role}: {u.name}</span>
                    <span className="text-[10px] text-slate-400 block">{u.email}</span>
                  </div>
                  <Pill tone={u.role === "Student" ? "indigo" : u.role === "Faculty" ? "purple" : "green"}>
                    Login As
                  </Pill>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<UserModel | null>(DEMO_USERS[0]); // Default logged in as Student Rajveer Singh
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(true); // Desktop sidebar expand
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile drawer
  const [eventDropdownOpen, setEventDropdownOpen] = useState(true); // Event participation sub-menu
  const [dark, setDark] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const [notifications, setNotifications] = useState<CampusNotification[]>(INITIAL_NOTIFICATIONS);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Sync dark class with document element
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  if (!user) {
    return (
      <div className={dark ? "dark" : ""}>
        <Login
          onLogin={(u) => {
            setUser(u);
            setPage(u.role === "Student" ? "dashboard" : u.role === "Faculty" ? "faculty-profile" : "manage");
            showToast(`Logged in as ${u.name} (${u.role})!`, "success");
          }}
        />
        <ToastContainer />
      </div>
    );
  }

  const currentNav =
    user.role === "Student"
      ? STUDENT_NAV
      : user.role === "Faculty"
      ? FACULTY_NAV
      : ADMIN_NAV;

  const allNavItems: { id: string; label: string }[] = currentNav.flatMap((g) =>
    g.items.flatMap((item) => [
      { id: item.id, label: item.label },
      ...(item.subItems ? item.subItems.map((sub) => ({ id: sub.id, label: sub.label })) : []),
    ])
  );

  const renderContent = () => {
    if (page === "digital-board" || page === "faculty-notifications") {
      return <DigitalBoard user={user} onNav={setPage} />;
    }
    if (page.startsWith("faculty-")) {
      return <FacultyPortal requestedAction={page} onNav={setPage} />;
    }
    if (page.startsWith("event-")) {
      return <EventParticipation subView={page} onNav={setPage} />;
    }

    switch (page) {
      case "dashboard":
        return <Dashboard onNav={setPage} />;
      case "digital-board":
        return <DigitalBoard user={user} onNav={setPage} />;
      case "timetable":
        return <Timetable />;
      case "attendance":
        return <Attendance />;
      case "marks":
        return <Marks />;
      case "assignments":
        return <Assignments />;
      case "appointments":
        return <Appointments />;
      case "events":
        return <Events user={user} />;
      case "team":
        return <TeamBuilder />;
      case "dl":
        return <DutyLeave />;
      case "certs":
        return <Certificates />;
      case "placement":
        return <PlacementPortal user={user} />;
      case "library":
        return <LibraryPortal />;
      case "study-materials":
        return <StudyMaterialPortal isFaculty={user.role === "Faculty" || user.role === "Admin"} />;
      case "xp":
        return <XPBadges />;
      case "settings":
        return <Settings user={user} dark={dark} setDark={setDark} />;
      case "manage":
        return <Admin user={user} />;
      case "faculty-portal":
        return <FacultyPortal requestedAction="faculty-profile" onNav={setPage} />;
      default:
        return <Dashboard onNav={setPage} />;
    }
  };

  const handleNavClick = (id: string) => {
    setPage(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* Desktop Sticky Sidebar */}
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white p-3 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 md:flex ${
            open ? "w-64" : "w-20"
          }`}
        >
          {/* Institution Header with GGI Sticker */}
          <div className="mb-4 flex items-center gap-3 p-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <GgiLogoSticker size="sm" />
            {open && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Pill tone={user.role === "Student" ? "indigo" : user.role === "Faculty" ? "purple" : "green"}>
                    {user.role}
                  </Pill>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-4 overflow-y-auto pr-1" aria-label="Main Navigation">
            {currentNav.map((g) => (
              <div key={g.g} className="space-y-1">
                {open && (
                  <p className="px-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {g.g}
                  </p>
                )}
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const isParentActive = page === item.id || (item.subItems && item.subItems.some((s) => s.id === page));

                  if (item.subItems) {
                    return (
                      <div key={item.id} className="space-y-1">
                        <div
                          onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition-all ${
                            isParentActive
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                          title={!open ? item.label : undefined}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon size={18} className="shrink-0 text-amber-500" />
                            {open && <span className="truncate">{item.label}</span>}
                          </div>
                          {open && (
                            <span className="p-0.5 text-slate-400">
                              {eventDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                          )}
                        </div>

                        {/* Collapsible Sub-menu items */}
                        {open && eventDropdownOpen && (
                          <div className="ml-4 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-1 py-1 animate-in fade-in duration-200">
                            {item.subItems.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => handleNavClick(sub.id)}
                                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all text-left ${
                                  page === sub.id
                                    ? "bg-indigo-600 text-white font-semibold shadow-xs"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60"
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${page === sub.id ? "bg-white" : "bg-slate-400 dark:bg-slate-600"}`} />
                                <span className="truncate">{sub.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      aria-current={page === item.id}
                      title={!open ? item.label : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        page === item.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      {open && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <button
              onClick={() => {
                setUser(null);
                showToast("Signed out successfully.", "info");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition"
            >
              <LogOut size={18} className="shrink-0" />
              {open && "Sign Out"}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 bg-white dark:bg-slate-900 h-full p-4 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <GgiLogoSticker size="sm" />
                    <div>
                      <h4 className="font-bold text-xs">{user.name}</h4>
                      <Pill tone="indigo">{user.role}</Pill>
                    </div>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {currentNav.map((g) => (
                    <div key={g.g} className="space-y-1">
                      <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g.g}</p>
                      {g.items.map((item) => {
                        const Icon = item.icon;
                        if (item.subItems) {
                          return (
                            <div key={item.id} className="space-y-1">
                              <div
                                onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <div className="flex items-center gap-3">
                                  <Icon size={17} className="text-amber-500" />
                                  <span>{item.label}</span>
                                </div>
                                <span className="p-0.5 text-slate-400">
                                  {eventDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </span>
                              </div>
                              {eventDropdownOpen && (
                                <div className="ml-4 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-1 py-1">
                                  {item.subItems.map((sub) => (
                                    <button
                                      key={sub.id}
                                      onClick={() => handleNavClick(sub.id)}
                                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all text-left ${
                                        page === sub.id
                                          ? "bg-indigo-600 text-white font-semibold"
                                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                      }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${page === sub.id ? "bg-white" : "bg-slate-400"}`} />
                                      <span className="truncate">{sub.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold ${
                              page === item.id
                                ? "bg-indigo-600 text-white"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <Icon size={17} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </nav>
              </div>

              <button
                onClick={() => {
                  setUser(null);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-red-600 p-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Application Area */}
        <div className="min-w-0 flex-1 flex flex-col">
          {/* Top Sticky Header */}
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle sidebar"
              className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:block"
            >
              {open ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>

            {/* College Logo Sticker in Navbar */}
            <div
              onClick={() => setPage("dashboard")}
              className="flex items-center gap-2.5 cursor-pointer group pr-2 border-r border-slate-200 dark:border-slate-800"
              title="Gulzar Group of Institutes, Khanna"
            >
              <GgiLogoSticker size="sm" />
              <div className="hidden lg:block leading-tight select-none">
                <span className="text-[11px] font-black tracking-tight text-slate-900 dark:text-slate-100 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  GULZAR GROUP OF INSTITUTES
                </span>
                <span className="text-[9px] font-bold text-slate-400 block -mt-0.5">
                  Khanna • NAAC A+ Campus
                </span>
              </div>
            </div>

            {/* Global Search Bar (Triggers ⌘K Command Palette) */}
            <div
              onClick={() => setCmdOpen(true)}
              className="relative max-w-md flex-1 cursor-pointer"
            >
              <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-12 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-between">
                <span>Search pages, courses, professors, events...</span>
                <kbd className="rounded border border-slate-300 px-1.5 py-0.5 text-[10px] text-slate-500 dark:border-slate-600 dark:text-slate-400 font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Top Right Utilities */}
            <div className="ml-auto flex items-center gap-2">
              {/* Live Digital Clock Widget (Requirement #1 & #4 - Always Visible) */}
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 shadow-inner">
                <Clock size={13} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <span className="font-mono font-bold tracking-wider">
                  {currentTime.toLocaleTimeString("en-IN", { hour12: true })}
                </span>
              </div>

              {/* Floating AI Assistant Header Toggle */}
              <button
                onClick={() => setBotOpen(true)}
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition shadow-sm"
              >
                <Bot size={14} className="text-indigo-600" />
                <span>AI Chat</span>
              </button>

              {/* Role Switcher Pill Dropdown */}
              <select
                value={user.email}
                onChange={(e) => {
                  const targetUser = DEMO_USERS.find((u) => u.email === e.target.value);
                  if (targetUser) {
                    setUser(targetUser);
                    setPage(
                      targetUser.role === "Student"
                        ? "dashboard"
                        : targetUser.role === "Faculty"
                        ? "faculty-profile"
                        : "manage"
                    );
                    showToast(`Switched view to ${targetUser.name} (${targetUser.role})`, "info");
                  }
                }}
                className="hidden sm:block rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
              >
                <option value="student@smartcampus.demo">Student: Rajveer Singh</option>
                <option value="nanumahi786@gmail.com">Faculty: MS. NAVJOT (MMS Navjot • EID 1708)</option>
                <option value="faculty@smartcampus.demo">Faculty: MS. NAVJOT (GGI NAAC A+)</option>
                <option value="rahul@smartcampus.demo">Faculty: Mr. Rahul Soni</option>
                <option value="admin@smartcampus.demo">Admin Office (Registrar)</option>
              </select>

              {/* Notification Bell */}
              <button
                onClick={() => setNotifOpen(true)}
                aria-label="Open notifications"
                className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                <Bell size={18} />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  setDark(!dark);
                  showToast(`Theme changed to ${!dark ? "Dark" : "Light"} Mode`, "info");
                }}
                aria-label="Toggle theme"
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>

          {/* Main Content Body */}
          <main className="flex-1 space-y-4 p-4 md:p-6 max-w-7xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {allNavItems.find((i) => i.id === page)?.label ?? "Dashboard"}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {user.meta} • Semester 5 (2026–27)
                </p>
              </div>
            </div>

            {/* Active Page View Component */}
            {renderContent()}
          </main>
        </div>

        {/* Floating AI Campus Assistant Button */}
        <button
          onClick={() => setBotOpen(true)}
          aria-label="Open CampusGenie AI assistant"
          title="CampusGenie AI Assistant"
          className="fixed bottom-6 right-6 z-40 grid h-13 w-13 p-3.5 place-items-center rounded-2xl bg-indigo-600 text-white shadow-xl transition-all duration-200 hover:-translate-y-1 hover:bg-indigo-700 active:translate-y-0"
        >
          <Bot size={24} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
        </button>

        {/* Command Palette Modal */}
        <CommandPalette
          isOpen={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onNavigate={handleNavClick}
          onSwitchUser={(u) => {
            setUser(u);
            setPage(u.role === "Student" ? "dashboard" : u.role === "Faculty" ? "faculty-profile" : "manage");
          }}
          dark={dark}
          setDark={setDark}
        />

        {/* Notification Drawer Modal */}
        <NotificationsModal
          isOpen={notifOpen}
          onClose={() => setNotifOpen(false)}
          notifications={notifications}
          setNotifications={setNotifications}
          onNavigate={handleNavClick}
        />

        {/* AI Assistant Chat Modal with Role-Aware Intelligence */}
        <AiAssistantModal
          isOpen={botOpen}
          onClose={() => setBotOpen(false)}
          onNavigate={handleNavClick}
          user={user}
        />

        {/* Toast feedback system */}
        <ToastContainer />
      </div>
    </div>
  );
}
