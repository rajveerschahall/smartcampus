// Sidebar structure copied from the college ERP teacher panel
export interface MenuGroup { title: string; items: { id: string; label: string }[] }
export const TOP = [{ id: "dashboard", label: "Dashboard" }, { id: "profile", label: "My Profile" }];
export const GROUPS: MenuGroup[] = [
  { title: "Academic Affairs", items: [
    { id: "timetable", label: "View Timetable" }, { id: "extra", label: "Extra Lecture" }, { id: "mst", label: "MST Micro Analysis" },
    { id: "internal", label: "Calculate Internal" }, { id: "upload", label: "Upload Material" }, { id: "uploads", label: "My Uploads" },
    { id: "schemes", label: "List Schemes and Syllabus" }, { id: "handout", label: "Upload Course Handout" },
    { id: "handouts", label: "Course Handouts" }, { id: "calendar", label: "View Academic Calendar" } ] },
  { title: "Student Affairs", items: [{ id: "track", label: "Track Student Record" }] },
  { title: "Staff Attendance & Leave", items: [
    { id: "attendance-analysis", label: "Attendance Analysis" }, { id: "adjustments", label: "Teacher Adjustments" }, { id: "od", label: "OD Inbox" },
    { id: "tasks", label: "Task Manager" }, { id: "face", label: "Register Face Samples" }, { id: "capture", label: "Student Attendance Capture Status" } ] },
  { title: "Notifications & Announcements", items: [{ id: "notifications", label: "Notifications" }, { id: "events", label: "Events" }] },
  { title: "Student Discipline", items: [{ id: "incident", label: "Report Incident" }, { id: "incidents", label: "My Incident Reports" }] },
  { title: "Repair & Maintenance", items: [{ id: "problem", label: "Report a Problem" }, { id: "requests", label: "My Requests" }] },
];
