// Teacher-side demo data (separate from student data)
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export type Day = (typeof DAYS)[number];
export interface Slot { id: string; period: number; subject: string; cls: string; room: string }

export const TIMETABLE: Record<Day, Slot[]> = {
  Mon: [
    { id: "m1", period: 1, subject: "Programming in PHP", cls: "BCA 3-C", room: "B-204" },
    { id: "m3", period: 3, subject: "Programming in PHP", cls: "BCA 3-B", room: "B-104" },
    { id: "m7", period: 7, subject: "Programming in PHP", cls: "BCA 3-A", room: "B-202" },
  ],
  Tue: [{ id: "t2", period: 2, subject: "PHP Laboratory", cls: "BCA 3-C", room: "C-201" }, { id: "t4", period: 4, subject: "PHP Laboratory", cls: "BCA 3-B", room: "C-401" }],
  Wed: [{ id: "w1", period: 1, subject: "Programming in PHP", cls: "BCA 3-C", room: "B-204" }],
  Thu: [{ id: "h1", period: 1, subject: "PHP Laboratory", cls: "BCA 3-C", room: "C-201" }, { id: "h2", period: 2, subject: "PHP Laboratory", cls: "BCA 3-C", room: "C-201" }],
  Fri: [{ id: "f5", period: 5, subject: "Programming in PHP", cls: "BCA 3-B", room: "B-104" }],
};

export const FEEDBACK_TO = ["Teacher", "Admin"];

export const PARTICIPATION_TABS = [
  "General Details", "Profile", "FDPs", "Applied FDPs", "Attendance", "Assessment",
  "Feedback", "Important Documents", "Test Marks", "Certificate",
] as const;

export const PANEL_DATA: Record<string, string[]> = {
  "General Details": ["Participant: Ms. Navjot Kaur", "Department: Computer Applications", "Designation: Assistant Professor"],
  Profile: ["Employee ID: 1708", "Email: navjot@example.edu", "Phone: add in profile"],
  FDPs: ["ATAL Offline: Applied AI (5-10 Oct 2026)", "Design Sub-thrust: Lifestyle Accessories (26-31 Oct 2026)"],
  "Applied FDPs": ["Applied AI: Emerging Trends (Application 1774003266) - Applied", "Innovation in Lifestyle Accessories - Pending"],
  Attendance: ["Day 1: Present", "Day 2: Present", "Day 3: Absent"],
  Assessment: ["Quiz 1: 8/10", "Mini project: Submitted"],
  "Important Documents": ["Joining letter.pdf", "Event permission.pdf"],
  "Test Marks": ["Test 1: 18/20", "Test 2: 16/20"],
  Certificate: ["Certificate unlocks after the event ends and attendance is 75% or more."],
};

export const GENERIC: Record<string, { cols: string[]; rows: string[][] }> = {
  mst: { cols: ["Class", "Subject", "Average", "Below 40%"], rows: [["BCA 3-C", "PHP", "21/30", "4"], ["BCA 3-B", "PHP", "19/30", "7"]] },
  internal: { cols: ["Class", "Attendance", "MST", "Assignment", "Total"], rows: [["BCA 3-C", "5", "21", "9", "35/40"], ["BCA 3-B", "4", "19", "8", "31/40"]] },
  uploads: { cols: ["File", "Class", "Uploaded"], rows: [["PHP Unit 1 notes.pdf", "BCA 3-C", "02 Sep"], ["Lab manual.pdf", "BCA 3-B", "10 Sep"]] },
  schemes: { cols: ["Course", "Scheme", "Year"], rows: [["Programming in PHP", "BCA 2024", "2026-27"], ["PHP Laboratory", "BCA 2024", "2026-27"]] },
  handouts: { cols: ["Course", "Status"], rows: [["Programming in PHP", "Uploaded"], ["PHP Laboratory", "Pending"]] },
  track: { cols: ["Roll no", "Student", "Attendance", "CGPA"], rows: [["BCA3C-03", "Harpreet Singh", "71%", "7.2"], ["BCA3C-05", "Rohan Gill", "66%", "6.4"]] },
  "attendance-analysis": { cols: ["Month", "Classes held", "Marked", "Pending"], rows: [["Sep", "42", "42", "0"], ["Oct", "18", "16", "2"]] },
  adjustments: { cols: ["Date", "Period", "Swapped with", "Status"], rows: [["16 Oct", "3", "Ms. Loveleen Kaur", "Pending"], ["20 Oct", "1", "Mr. Rahul Soni", "Approved"]] },
  od: { cols: ["Student", "Event", "Dates", "Status"], rows: [["Aarav Sharma", "CodeQuest", "16 Sep", "Pending"], ["Simran Kaur", "Talent Hunt", "24 Sep", "Approved"]] },
  tasks: { cols: ["Task", "Due", "Status"], rows: [["Submit MST I marks", "21 Sep", "Done"], ["Upload handout", "20 Oct", "Pending"]] },
  capture: { cols: ["Class", "Date", "Status"], rows: [["BCA 3-C", "14 Oct", "Captured"], ["BCA 3-B", "14 Oct", "Not captured"]] },
  notifications: { cols: ["Message", "Date"], rows: [["MST II starts on 30 Oct", "13 Oct"], ["Tech Fest on 15 Oct", "12 Oct"]] },
  incidents: { cols: ["Student", "Incident", "Date", "Status"], rows: [["Roll BCA3B-11", "Late to lab", "05 Oct", "Open"]] },
  requests: { cols: ["Issue", "Location", "Status"], rows: [["Projector not working", "B-204", "In progress"], ["Broken chair", "C-201", "Resolved"]] },
};
