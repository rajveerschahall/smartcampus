export type Role = "Student" | "Faculty" | "Admin";

export interface User {
  email: string;
  password: string;
  role: Role;
  name: string;
  meta: string;
  avatar?: string;
  rollNo?: string;
  department?: string;
  section?: string;
  year?: string;
}

export const DEMO_USERS: User[] = [
  {
    email: "student@smartcampus.demo",
    password: "Student@123",
    role: "Student",
    name: "Rajveer Singh",
    meta: "BCA • Year 3 • Sec C • Roll 2433613",
    rollNo: "2433613",
    department: "Dept. of Computer Applications",
    section: "Section C",
    year: "3rd Year (Semester 5)"
  },
  {
    email: "faculty@smartcampus.demo",
    password: "Faculty@123",
    role: "Faculty",
    name: "Mr. Rahul Soni",
    meta: "Assistant Professor • Dept. of Computer Applications",
    department: "Dept. of Computer Applications"
  },
  {
    email: "admin@smartcampus.demo",
    password: "Admin@123",
    role: "Admin",
    name: "Admin Office",
    meta: "Academic Registrar & Dean Office • GGI Khanna, Ludhiana"
  },
];

export type Cat = "Hackathon" | "Workshop" | "Cultural" | "Talk" | "Holiday";

export interface Ev {
  id: number;
  date: string;
  title: string;
  cat: Cat;
  place?: string;
  tags?: string[];
  team?: [number, number];
  description?: string;
  coordinator?: string;
}

// Academic Calendar 2026-27 (odd semester), Dept. of Computer Applications
export const EVENTS: Ev[] = [
  {
    id: 1,
    date: "2026-10-15",
    title: "Tech Fest — TechTalk Debate, Presentation & Type Master",
    cat: "Hackathon",
    place: "Main Auditorium",
    tags: ["Debate", "Typing", "Presentation"],
    team: [2, 4],
    description: "Annual university flagship tech showdown featuring speed typing, technical presentations and open debate rounds.",
    coordinator: "Mr. Rahul Soni"
  },
  {
    id: 2,
    date: "2026-10-16",
    title: "World Student Day Celebrations",
    cat: "Cultural",
    place: "Campus Ground",
    tags: ["Celebration", "Youth", "Innovation"],
    description: "Commemorating the birth anniversary of Dr. A.P.J. Abdul Kalam with student project exhibits and cultural dances.",
    coordinator: "Ms. Navjot Kaur"
  },
  {
    id: 3,
    date: "2026-10-23",
    title: "Alumni Talk — From Campus to Big Tech",
    cat: "Talk",
    place: "Seminar Hall",
    tags: ["Career", "Networking", "Industry"],
    description: "Interactive session with batch of 2021 alumni working at Microsoft and Amazon on campus placements prep.",
    coordinator: "Dr. Priya Dhir"
  },
  {
    id: 4,
    date: "2026-10-28",
    title: "Street Sell — E-Cell Entrepreneurship Challenge",
    cat: "Workshop",
    place: "Campus Plaza",
    tags: ["Entrepreneurship", "Pitching", "Sales"],
    team: [1, 3],
    description: "Seed capital pitching contest and live pop-up stall marketplace on campus grounds.",
    coordinator: "Er. Amitoj Kaur"
  },
  {
    id: 5,
    date: "2026-11-06",
    title: "Green Diwali Celebrations & Eco-Diya Drive",
    cat: "Cultural",
    place: "Campus Lawns",
    tags: ["Eco", "Festivity", "Rangoli"],
    description: "Eco-friendly light celebrations, inter-department rangoli contest and musical evening.",
    coordinator: "Ms. Pinky Singh"
  },
  {
    id: 6,
    date: "2026-09-28",
    title: "Workshop on Generative AI & Deep Learning",
    cat: "Workshop",
    place: "Lab B-111",
    tags: ["AI/ML", "Python", "Transformers"],
    description: "Hands-on workshop building fine-tuned agents and PyTorch pipelines.",
    coordinator: "Mr. Kartik Goyal"
  },
  {
    id: 7,
    date: "2026-10-20",
    title: "Dussehra",
    cat: "Holiday",
    description: "Gazetted campus holiday on account of Vijayadashami."
  },
  {
    id: 8,
    date: "2026-10-26",
    title: "Birthday of Maharishi Valmiki Ji",
    cat: "Holiday",
    description: "Gazetted campus holiday."
  },
  {
    id: 9,
    date: "2026-11-24",
    title: "Shri Guru Nanak Dev Jayanti",
    cat: "Holiday",
    description: "Gazetted campus holiday on Gurpurab."
  },
  {
    id: 10,
    date: "2026-12-25",
    title: "Christmas Day",
    cat: "Holiday",
    description: "Gazetted campus holiday."
  },
];

export const MST = [
  { name: "Mid Semester Test I", from: "2026-09-17", to: "2026-09-21", status: "Completed" },
  { name: "Mid Semester Test II", from: "2026-10-30", to: "2026-11-05", status: "Upcoming" },
];

export const FACULTY = [
  "Mr. Rahul Soni",
  "Ms. Navjot Kaur",
  "Ms. Pinky Singh",
  "Ms. Anushka Mohal",
  "Er. Amitoj Kaur",
  "Dr. Priya Dhir",
  "Ms. Ripandeep Kaur",
  "Ms. Loveleen Kaur",
  "Ms. Iqra Nazir",
  "Ms. Manisha Chawla",
  "Ms. Gurpreet Kaur",
  "Mr. Satyam Gautam",
  "Ms. Rajwant Kaur",
  "Dr. Surjit Kumar Gandhi",
  "Dr. Amandeep Singh Kalra",
  "Dr. Rajiv Kumar"
];

export const PERIODS = [
  "9:00–9:55",
  "9:55–10:50",
  "10:50–11:45",
  "11:45–12:40",
  "12:40–1:35",
  "2:30–3:25",
  "3:25–4:20"
];

export type Slot = [string, string, string] | null; // [code, faculty, room]

export const TIMETABLE: Record<string, Slot[]> = {
  Monday: [
    ["UGCA1929", "Ms. Navjot Kaur", "B-204"],
    ["VACAP501", "Parveen Singh", "B-204"],
    ["UGCA1931", "Ms. Pinky Singh", "B-203"],
    null,
    ["UGCA1936", "Mr. Rahul Soni", "B-205"],
    ["UGCA1932", "Ms. Anushka Mohal", "B-104"],
    null
  ],
  Tuesday: [
    ["VACAP501", "Parveen Singh", "B-201"],
    ["UGCA1936", "Mr. Rahul Soni", "B-111"],
    ["VACDS502", "Shivam Sharma", "C-303C"],
    ["UGCA1929", "Ms. Navjot Kaur", "B-203"],
    null,
    null,
    null
  ],
  Wednesday: [
    ["UGCA1930", "Ms. Navjot Kaur", "C-201 (Lab)"],
    ["UGCA1930", "Ms. Navjot Kaur", "C-201 (Lab)"],
    ["VACDS502", "Shivam Sharma", "C-303C"],
    null,
    ["UGCA1931", "Ms. Pinky Singh", "B-203"],
    ["UGCA1932", "Ms. Anushka Mohal", "B-104"],
    null
  ],
  Thursday: [
    ["UGCA1942", "Mr. Rahul Soni", "C-303C (Lab)"],
    ["UGCA1942", "Mr. Rahul Soni", "C-303C (Lab)"],
    ["UGCA1931", "Ms. Pinky Singh", "B-105"],
    ["UGCA1932", "Ms. Anushka Mohal", "B-201"],
    ["UGCA1936", "Mr. Rahul Soni", "B-202"],
    ["UGCA1938", "Ms. Anushka Mohal", "C-401 (Lab)"],
    ["UGCA1938", "Ms. Anushka Mohal", "C-401 (Lab)"]
  ],
  Friday: [
    ["UGCA1931", "Ms. Pinky Singh", "B-202"],
    null,
    ["UGCA1936", "Mr. Rahul Soni", "B-105"],
    null,
    ["UGCA1929", "Ms. Navjot Kaur", "B-111"],
    ["UGCA1932", "Ms. Anushka Mohal", "B-104"],
    null
  ],
};

export const SUBJECTS: Record<string, string> = {
  UGCA1929: "Programming in PHP",
  UGCA1930: "PHP Laboratory",
  UGCA1931: "Data Warehouse & Mining",
  UGCA1932: "Programming in Java",
  UGCA1936: "Cloud Computing",
  UGCA1938: "Java Laboratory",
  UGCA1942: "Cloud Computing Lab",
  VACAP501: "Aptitude-II / Soft Skill-V",
  VACDS502: "Full Stack Web Development"
};

// [SubjectCode, Present, Total]
export const ATTENDANCE: [string, number, number][] = [
  ["UGCA1929", 15, 22],
  ["UGCA1930", 13, 18],
  ["UGCA1931", 19, 28],
  ["UGCA1932", 17, 28],
  ["UGCA1936", 14, 27],
  ["UGCA1938", 6, 12],
  ["UGCA1942", 4, 8],
  ["VACAP501", 5, 13],
  ["VACDS502", 9, 16],
];

export interface Assignment {
  id: string;
  title: string;
  code: string;
  due: number;
  start: number;
  totalMarks: number;
  submitted?: boolean;
  submittedAt?: string;
  grade?: string;
  remarks?: string;
  description: string;
}

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-1",
    title: "Cloud Computing — Architecture Case Study (AWS vs GCP)",
    code: "UGCA1936",
    due: Date.now() + 1000 * 60 * 60 * 20, // 20 hrs left
    start: Date.now() - 1000 * 60 * 60 * 100,
    totalMarks: 20,
    submitted: false,
    description: "Submit a 5-page case study analyzing serverless container orchestration (ECS vs Cloud Run) with pricing tradeoffs."
  },
  {
    id: "asg-2",
    title: "Java Lab — Complete Experiment Record File (Exp 1–8)",
    code: "UGCA1938",
    due: Date.now() + 1000 * 60 * 60 * 60, // 60 hrs left
    start: Date.now() - 1000 * 60 * 60 * 60,
    totalMarks: 25,
    submitted: false,
    description: "Complete PDF file with verified code outputs for Multithreading, Socket Programming, and JDBC Connectivity."
  },
  {
    id: "asg-3",
    title: "PHP Mini Project — E-Commerce Catalog with Session Auth",
    code: "UGCA1929",
    due: Date.now() + 1000 * 60 * 60 * 24 * 9, // 9 days left
    start: Date.now() - 1000 * 60 * 60 * 24 * 3,
    totalMarks: 30,
    submitted: false,
    description: "Repository link and zipped source code of a responsive PHP PDO backend connected to MySQL with session cookies."
  },
  {
    id: "asg-4",
    title: "Data Warehouse & Mining — ETL Pipeline with Apriori",
    code: "UGCA1931",
    due: Date.now() - 1000 * 60 * 60 * 48,
    start: Date.now() - 1000 * 60 * 60 * 180,
    totalMarks: 20,
    submitted: true,
    submittedAt: "2 days ago",
    grade: "19/20",
    remarks: "Excellent implementation of association rule mining and clear confidence charts.",
    description: "Demonstrate Association Rule Mining algorithm on supermarket dataset."
  }
];

export interface SubjectMarks {
  code: string;
  mst1: number; // out of 24
  mst2: number; // out of 24 (or expected)
  assignmentMarks: number; // out of 10
  attendanceMarks: number; // out of 6
  totalInternal: number; // out of 40
  gradeLetter: string;
}

export const MARKS_DATA: SubjectMarks[] = [
  { code: "UGCA1929", mst1: 21, mst2: 22, assignmentMarks: 9, attendanceMarks: 4, totalInternal: 35, gradeLetter: "A" },
  { code: "UGCA1930", mst1: 22, mst2: 23, assignmentMarks: 10, attendanceMarks: 5, totalInternal: 37, gradeLetter: "A+" },
  { code: "UGCA1931", mst1: 20, mst2: 21, assignmentMarks: 9, attendanceMarks: 4, totalInternal: 34, gradeLetter: "A" },
  { code: "UGCA1932", mst1: 18, mst2: 20, assignmentMarks: 8, attendanceMarks: 4, totalInternal: 31, gradeLetter: "B+" },
  { code: "UGCA1936", mst1: 17, mst2: 19, assignmentMarks: 8, attendanceMarks: 3, totalInternal: 29, gradeLetter: "B" },
  { code: "UGCA1938", mst1: 23, mst2: 24, assignmentMarks: 10, attendanceMarks: 5, totalInternal: 39, gradeLetter: "O" },
  { code: "UGCA1942", mst1: 22, mst2: 23, assignmentMarks: 9, attendanceMarks: 4, totalInternal: 36, gradeLetter: "A+" },
  { code: "VACAP501", mst1: 19, mst2: 21, assignmentMarks: 8, attendanceMarks: 3, totalInternal: 31, gradeLetter: "B+" },
  { code: "VACDS502", mst1: 23, mst2: 24, assignmentMarks: 10, attendanceMarks: 4, totalInternal: 38, gradeLetter: "A+" },
];

export interface DutyLeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  event: string;
  dates: string;
  type: string;
  status: "Verified" | "Pending" | "Rejected";
  reason: string;
  appliedDate: string;
  proofDocument?: string;
  approvedBy?: string;
}

export const INITIAL_DUTY_LEAVES: DutyLeaveRequest[] = [
  {
    id: "DL-101",
    studentId: "2433613",
    studentName: "Rajveer Singh",
    event: "Tech Fest 2026",
    dates: "15 Oct 2026",
    type: "Duty Leave",
    status: "Pending",
    reason: "Selected as debate team captain for Inter-College TechTalk.",
    appliedDate: "12 Oct 2026",
    proofDocument: "Event_Pass_TF26.pdf"
  },
  {
    id: "DL-102",
    studentId: "2433613",
    studentName: "Rajveer Singh",
    event: "E-Cell Street Sell Challenge",
    dates: "28 Oct 2026",
    type: "Duty Leave",
    status: "Verified",
    reason: "Representing BCA department in campus startup kiosk contest.",
    appliedDate: "05 Oct 2026",
    proofDocument: "ECell_Nomination.pdf",
    approvedBy: "HOD Dept of Computer Applications"
  },
  {
    id: "DL-103",
    studentId: "2433620",
    studentName: "Simran Kaur",
    event: "CodeQuest Hackathon",
    dates: "02 Oct 2026",
    type: "Certificate",
    status: "Verified",
    reason: "1st Runner Up in 24-hr Coding Sprint.",
    appliedDate: "03 Oct 2026",
    approvedBy: "Dean Academics"
  },
  {
    id: "DL-104",
    studentId: "2433641",
    studentName: "Aman Verma",
    event: "Street Sell",
    dates: "28 Oct 2026",
    type: "Duty Leave",
    status: "Pending",
    reason: "E-Cell Marketing lead stall manager.",
    appliedDate: "10 Oct 2026"
  },
  {
    id: "DL-105",
    studentId: "2433662",
    studentName: "Karan Mehta",
    event: "Tech Fest",
    dates: "15 Oct 2026",
    type: "Duty Leave",
    status: "Rejected",
    reason: "Did not submit signed faculty recommendation slip.",
    appliedDate: "08 Oct 2026",
    approvedBy: "Admin Office"
  }
];

export interface CertificateItem {
  id: string;
  title: string;
  issuedTo: string;
  rollNo: string;
  event: string;
  date: string;
  category: string;
  verificationHash: string;
  gradeOrRank: string;
  issuer: string;
}

export const CERTIFICATES: CertificateItem[] = [
  {
    id: "GGI-CERT-2026-081",
    title: "Certificate of Merit — CodeQuest Hackathon",
    issuedTo: "Rajveer Singh",
    rollNo: "2433613",
    event: "CodeQuest 2026 (24-Hour Hackathon)",
    date: "03 Oct 2026",
    category: "Technical",
    verificationHash: "SHA256:7f4a8b9e1c2d03a456fe890123",
    gradeOrRank: "1st Runner Up (Smart Campus AI Track)",
    issuer: "Dean of Academics & Head of Innovation"
  },
  {
    id: "GGI-CERT-2026-044",
    title: "Certificate of Completion — Generative AI Bootcamp",
    issuedTo: "Rajveer Singh",
    rollNo: "2433613",
    event: "Workshop on GenAI & Deep Learning",
    date: "29 Sep 2026",
    category: "Workshop",
    verificationHash: "SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a",
    gradeOrRank: "Distinction (Grade A+)",
    issuer: "Dept. of Computer Applications"
  },
  {
    id: "GGI-CERT-2026-012",
    title: "Certificate of Appreciation — Alumni Talk Organizer",
    issuedTo: "Rajveer Singh",
    rollNo: "2433613",
    event: "Industry Connect Alumni Talk",
    date: "14 Aug 2026",
    category: "Leadership",
    verificationHash: "SHA256:9c8b7a6f5e4d3c2b1a0f9e8d7c",
    gradeOrRank: "Volunteer Lead",
    issuer: "Training & Placement Cell, GGI Khanna"
  }
];

export interface HackathonTeam {
  id: string;
  name: string;
  event: string;
  lead: string;
  leadRoll: string;
  projectIdea: string;
  members: string[];
  maxMembers: number;
  openRoles: string[];
}

export const HACKATHON_TEAMS: HackathonTeam[] = [
  {
    id: "team-1",
    name: "ByteBusters",
    event: "Tech Fest — TechTalk & App Showcase",
    lead: "Rajveer Singh",
    leadRoll: "2433613",
    projectIdea: "AI-Powered Smart Attendance & Campus Micro-Credential Verification system with dynamic QR.",
    members: ["Rajveer Singh (Lead / FullStack)", "Simran Kaur (UI/UX)"],
    maxMembers: 4,
    openRoles: ["FastAPI Backend Developer", "Pitcher & Presentation Lead"]
  },
  {
    id: "team-2",
    name: "NeuralNet Titans",
    event: "Tech Fest 2026",
    lead: "Aman Verma",
    leadRoll: "2433641",
    projectIdea: "Low-latency OCR and question solver for campus library textbooks.",
    members: ["Aman Verma", "Gaurav Joshi", "Pooja Sharma"],
    maxMembers: 4,
    openRoles: ["PyTorch / HuggingFace Specialist"]
  },
  {
    id: "team-3",
    name: "GreenCampus IoT",
    event: "Street Sell — E-Cell",
    lead: "Harleen Kaur",
    leadRoll: "2433655",
    projectIdea: "Solar-powered smart phone charging benches with biodegradable kiosk stall.",
    members: ["Harleen Kaur", "Navneet Sandhu"],
    maxMembers: 3,
    openRoles: ["Hardware / Arduino Prototyper"]
  }
];

export interface Appointment {
  id: string;
  studentName: string;
  facultyName: string;
  date: string;
  timeSlot: string;
  topic: string;
  status: "Pending" | "Approved" | "Completed" | "Cancelled";
  location: string;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    studentName: "Rajveer Singh",
    facultyName: "Mr. Rahul Soni",
    date: "14 Oct 2026",
    timeSlot: "11:30 AM",
    topic: "Cloud Computing Minor Project architecture feedback & Docker setup.",
    status: "Approved",
    location: "Faculty Cabin B-205 / Google Meet"
  },
  {
    id: "apt-2",
    studentName: "Rajveer Singh",
    facultyName: "Ms. Navjot Kaur",
    date: "16 Oct 2026",
    timeSlot: "2:30 PM",
    topic: "PHP PDO Session authentication and SQL Injection defense review.",
    status: "Pending",
    location: "Lab B-111"
  }
];

export interface CampusNotification {
  id: string;
  title: string;
  time: string;
  category: "Academic" | "Event" | "Attendance" | "Admin";
  read: boolean;
  linkPage?: string;
  details: string;
}

export const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: "notif-1",
    title: "Attendance Warning: Cloud Computing below 75%",
    time: "2 hours ago",
    category: "Attendance",
    read: false,
    linkPage: "attendance",
    details: "Your current attendance in UGCA1936 is 51.9%. You need to attend the next 4 consecutive lectures to exceed 75%."
  },
  {
    id: "notif-2",
    title: "Assignment Due in 20 Hours: Cloud Computing Case Study",
    time: "4 hours ago",
    category: "Academic",
    read: false,
    linkPage: "assignments",
    details: "Submission portal closes tomorrow at 5:00 PM on the portal."
  },
  {
    id: "notif-3",
    title: "Duty Leave Request for E-Cell Street Sell Verified",
    time: "Yesterday",
    category: "Admin",
    read: false,
    linkPage: "dl",
    details: "HOD has verified your DL. Your attendance for 28 Oct 2026 has been marked as Present (Duty Leave)."
  },
  {
    id: "notif-4",
    title: "Tech Fest 2026 Registrations Close in 48 Hours",
    time: "Yesterday",
    category: "Event",
    read: true,
    linkPage: "events",
    details: "Sign up for TechTalk debate and speed typing before spots fill up."
  },
  {
    id: "notif-5",
    title: "Mid Semester Test II dates released (30 Oct – 05 Nov)",
    time: "2 days ago",
    category: "Academic",
    read: true,
    linkPage: "marks",
    details: "Date-sheet published on the notice board. Syllabus includes Units III & IV."
  }
];

export const BADGES = [
  { id: "b1", title: "Code Samurai", desc: "Top 3 rank in 24-hr Hackathon", icon: "⚔️", unlocked: true, date: "Oct 2026" },
  { id: "b2", title: "Early Bird", desc: "Submitted 5 assignments 24h before deadline", icon: "⚡", unlocked: true, date: "Sep 2026" },
  { id: "b3", title: "Attendance Titan", desc: "Maintained 90%+ in 3 consecutive subjects", icon: "🛡️", unlocked: true, date: "Aug 2026" },
  { id: "b4", title: "Event Pioneer", desc: "Participated in 4+ campus clubs & events", icon: "🌟", unlocked: true, date: "Oct 2026" },
  { id: "b5", title: "GenAI Master", desc: "Completed PyTorch & Transformers bootcamp", icon: "🧠", unlocked: true, date: "Sep 2026" },
  { id: "b6", title: "Dean's List", desc: "Attain SGPA >= 9.0 in current semester", icon: "👑", unlocked: false, date: "In Progress" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Harpreet Singh", roll: "2433602", xp: 1480, badge: "Grandmaster" },
  { rank: 2, name: "Simran Kaur", roll: "2433620", xp: 1350, badge: "Master" },
  { rank: 3, name: "Rajveer Singh", roll: "2433613", xp: 1240, badge: "Campus Prodigy", isCurrent: true },
  { rank: 4, name: "Aman Verma", roll: "2433641", xp: 1120, badge: "Tech Pioneer" },
  { rank: 5, name: "Harleen Kaur", roll: "2433655", xp: 990, badge: "Rising Star" },
  { rank: 6, name: "Karan Mehta", roll: "2433662", xp: 820, badge: "Apprentice" },
];
