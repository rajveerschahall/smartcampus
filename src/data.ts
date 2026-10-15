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
    email: "nanumahi786@gmail.com",
    password: "Faculty@123",
    role: "Faculty",
    name: "MS. NAVJOT",
    meta: "Assistant Professor • Dept. of Computer Applications • EID: 1708 • GGI (NAAC A+)",
    department: "Department of Computer Applications"
  },
  {
    email: "faculty@smartcampus.demo",
    password: "Faculty@123",
    role: "Faculty",
    name: "MS. NAVJOT",
    meta: "Assistant Professor • Dept. of Computer Applications • EID: 1708 • GGI (NAAC A+)",
    department: "Department of Computer Applications"
  },
  {
    email: "rahul@smartcampus.demo",
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

export type Cat = "Hackathon" | "Workshop" | "Cultural" | "Talk" | "Holiday" | "Exam" | "Industrial Visit" | "Academic";

export interface Ev {
  id: number;
  date: string;
  day?: string;
  title: string;
  cat: Cat;
  month?: "July" | "August" | "September" | "October" | "November" | "December";
  place?: string;
  tags?: string[];
  team?: [number, number];
  description?: string;
  coordinator?: string;
  featured?: boolean;
}

// Official Academic & Events Calendar 2026-27 (Odd Semester) — Real Dataset from Institutional Notification
export const EVENTS: Ev[] = [
  // Flagship National Event
  {
    id: 100,
    date: "2026-10-25",
    day: "Sunday",
    title: "Smart India Hackathon (SIH 2026) — GGI Internal College Hackathon Round",
    cat: "Hackathon",
    month: "October",
    place: "GGI Central Innovation Lab & Tech Center",
    tags: ["SIH", "MoE / AICTE", "National Hackathon", "Cash Prize ₹1 Lakh"],
    team: [6, 6],
    description: "Official internal institutional round for Smart India Hackathon (SIH 2026) mandated by Ministry of Education's Innovation Cell & AICTE. Mandatory 6 members per team including at least 1 female teammate. Top 30 teams will be nominated for National Finals with ₹1,00,000 cash prize per problem statement.",
    coordinator: "Er. Amitoj Kaur / SPOC AICTE Cell",
    featured: true
  },
  // AUGUST
  {
    id: 101,
    date: "2026-07-31",
    day: "Friday",
    title: "Registration for Semester",
    cat: "Academic",
    month: "August",
    place: "Campus Registrar Office / Online ERP",
    tags: ["Enrollment", "Academic"],
    description: "Mandatory odd semester registration and ERP subject validation for all undergraduate batches.",
    coordinator: "Dean Academics"
  },
  {
    id: 102,
    date: "2026-08-03",
    day: "Monday",
    title: "Session Start for Batch G1",
    cat: "Academic",
    month: "August",
    place: "Academic Block 1 & 2",
    tags: ["Lectures", "Orientation"],
    description: "Commencement of regular classroom and laboratory sessions for Batch G1 students.",
    coordinator: "Academic Affairs"
  },
  {
    id: 103,
    date: "2026-08-06",
    day: "Thursday",
    title: "Session Start for Batch G2",
    cat: "Academic",
    month: "August",
    place: "Academic Block 1 & 2",
    tags: ["Lectures", "Orientation"],
    description: "Commencement of regular classroom and practical lab schedules for Batch G2 students.",
    coordinator: "Academic Affairs"
  },
  {
    id: 104,
    date: "2026-08-15",
    day: "Saturday",
    title: "Independence Day Celebrations",
    cat: "Holiday",
    month: "August",
    place: "Central Ground & Flag Mast",
    tags: ["National", "Flag Hoisting"],
    description: "79th Independence Day patriotic flag hoisting ceremony, NCC march past and student address.",
    coordinator: "Student Welfare Committee"
  },
  {
    id: 105,
    date: "2026-08-24",
    day: "Monday",
    title: "Expert Talk — Mr. Jatinder Verma",
    cat: "Talk",
    month: "August",
    place: "Seminar Hall B",
    tags: ["Expert Talk", "Industry Trends", "Tech"],
    description: "Distinguished guest lecture by Mr. Jatinder Verma on enterprise digital architecture and software scaling.",
    coordinator: "Mr. Rahul Soni"
  },
  {
    id: 106,
    date: "2026-08-27",
    day: "Wednesday",
    title: "Tech Titans Quiz Competition",
    cat: "Hackathon",
    month: "August",
    place: "Computer Lab 4",
    tags: ["Quiz", "Tech", "Competitive"],
    team: [2, 3],
    description: "Rapid-fire technical quiz on programming concepts, DSA, logic puzzles, and current IT developments.",
    coordinator: "Ms. Navjot Kaur"
  },
  {
    id: 107,
    date: "2026-08-28",
    day: "Friday",
    title: "Raksha Bandhan*",
    cat: "Holiday",
    month: "August",
    place: "Campus-wide",
    tags: ["Festival", "Holiday"],
    description: "Institutional festival holiday on account of Raksha Bandhan.",
    coordinator: "Admin Office"
  },
  {
    id: 108,
    date: "2026-08-31",
    day: "Monday",
    title: "Expert Talk — Mr. Harpreet Singh",
    cat: "Talk",
    month: "August",
    place: "Auditorium",
    tags: ["Expert Talk", "Cybersecurity", "Cloud"],
    description: "Special expert talk by Mr. Harpreet Singh on cyber threat intelligence and defensive cloud posture.",
    coordinator: "Dr. Priya Dhir"
  },

  // SEPTEMBER
  {
    id: 109,
    date: "2026-09-09",
    day: "Wednesday",
    title: "Industrial Visit — C-DAC (Centre for Development of Advanced Computing)",
    cat: "Industrial Visit",
    month: "September",
    place: "C-DAC Mohali",
    tags: ["C-DAC", "Industrial Visit", "Supercomputing"],
    description: "Official educational excursion to C-DAC Mohali supercomputing center and electronics testing labs.",
    coordinator: "Training & Placement Cell (CRC)"
  },
  {
    id: 110,
    date: "2026-09-10",
    day: "Thursday",
    title: "Industrial Visit — Day 2",
    cat: "Industrial Visit",
    month: "September",
    place: "IT Park Mohali / Chandigarh",
    tags: ["Industry Connect", "Onsite Visit"],
    description: "Day 2 of industrial exposure tour connecting students with agile corporate IT centers.",
    coordinator: "CRC Cell"
  },
  {
    id: 111,
    date: "2026-09-11",
    day: "Friday",
    title: "Industrial Visit — Day 3",
    cat: "Industrial Visit",
    month: "September",
    place: "Technology Manufacturing Hub",
    tags: ["Industry Connect", "Factory Tour"],
    description: "Day 3 industrial plant visit focusing on hardware quality assurance and robotics assembly.",
    coordinator: "CRC Cell"
  },
  {
    id: 112,
    date: "2026-09-15",
    day: "Tuesday",
    title: "Engineer's Day / Departmental Event",
    cat: "Cultural",
    month: "September",
    place: "Main Campus Plaza",
    tags: ["Engineers Day", "Projects Exhibit", "Innovation"],
    description: "Commemorating Bharat Ratna Sir M. Visvesvaraya with working prototype demonstrations and engineering challenges.",
    coordinator: "Dept. of Computer Applications"
  },
  {
    id: 113,
    date: "2026-09-16",
    day: "Wednesday",
    title: "CodeQuest 2026 — Algorithmic Coding Challenge",
    cat: "Hackathon",
    month: "September",
    place: "Advanced Computing Lab",
    tags: ["Coding", "DSA", "Hackathon", "Speed"],
    team: [1, 2],
    description: "4-hour timed competitive coding battle evaluating data structures, time complexity optimization, and clean code.",
    coordinator: "Mr. Rahul Soni"
  },
  {
    id: 114,
    date: "2026-09-17",
    day: "Thursday to Monday",
    title: "Mid Semester Test I (MST-I Exam)",
    cat: "Exam",
    month: "September",
    place: "Examination Halls",
    tags: ["MST-1", "Exam", "Mandatory"],
    description: "University mid-semester written assessments conducted from 17 Sep to 21 Sep 2026 across all course subjects.",
    coordinator: "Controller of Examinations"
  },
  {
    id: 115,
    date: "2026-09-22",
    day: "Tuesday",
    title: "Talent Hunt — Music (Fine Arts)",
    cat: "Cultural",
    month: "September",
    place: "Open Air Amphitheatre",
    tags: ["Music", "Fine Arts", "Talent Hunt"],
    description: "Annual cultural screening for classical singing, western vocals, instrumental orchestra, and fine arts exhibits.",
    coordinator: "Youth Festival Committee"
  },
  {
    id: 116,
    date: "2026-09-23",
    day: "Wednesday",
    title: "Talent Hunt — Theatre / Debate / Literary",
    cat: "Cultural",
    month: "September",
    place: "Auditorium",
    tags: ["Theatre", "Debate", "Elocution"],
    description: "Inter-department dramatic one-act plays, skit showcase, extempore debate, and creative poetry slam.",
    coordinator: "Cultural Club"
  },
  {
    id: 117,
    date: "2026-09-24",
    day: "Thursday",
    title: "Talent Hunt — Dance / Fashion",
    cat: "Cultural",
    month: "September",
    place: "Main Stage",
    tags: ["Bhangra", "Western Dance", "Fashion"],
    description: "Folk dance (Bhangra / Gidha), western choreography, and traditional fashion ensemble auditions.",
    coordinator: "Ms. Pinky Singh"
  },
  {
    id: 118,
    date: "2026-09-25",
    day: "Friday",
    title: "Talent Hunt — Sports Trials",
    cat: "Cultural",
    month: "September",
    place: "Sports Complex",
    tags: ["Athletics", "Cricket", "Badminton"],
    description: "Inter-house athletic trials, football shootouts, volleyball, and university team selections.",
    coordinator: "Director Physical Education"
  },
  {
    id: 119,
    date: "2026-09-26",
    day: "Saturday",
    title: "Fresher's Day 2026 ('Aagaaz')",
    cat: "Cultural",
    month: "September",
    place: "Grand University Lawns",
    tags: ["Fresher", "Celebration", "Mr & Ms Fresher"],
    description: "Grand welcome ceremony for new batches featuring celebrity musical performances, titles, and dinners.",
    coordinator: "Student Council & Dean"
  },
  {
    id: 120,
    date: "2026-09-28",
    day: "Monday",
    title: "Hands-on Technical Workshop",
    cat: "Workshop",
    month: "September",
    place: "Lab B-111",
    tags: ["Workshop", "Development"],
    description: "Technical development boot-camp on full-stack web architectures and containerized deployments.",
    coordinator: "Faculty Coordinator"
  },
  {
    id: 121,
    date: "2026-09-30",
    day: "Tuesday",
    title: "Workshop — Mr. Kartik Goyal (AI / ML Masterclass)",
    cat: "Workshop",
    month: "September",
    place: "Lab B-111",
    tags: ["AI/ML", "Kartik Goyal", "Python", "Transformers"],
    description: "Intensive 6-hour masterclass by Mr. Kartik Goyal building fine-tuned LLM agents and computer vision models.",
    coordinator: "Mr. Kartik Goyal"
  },

  // OCTOBER
  {
    id: 122,
    date: "2026-10-02",
    day: "Friday",
    title: "Gandhi Jayanti",
    cat: "Holiday",
    month: "October",
    place: "Campus-wide",
    tags: ["National Holiday"],
    description: "Gazetted national holiday commemorating Mahatma Gandhi's birth anniversary.",
    coordinator: "Admin Office"
  },
  {
    id: 123,
    date: "2026-10-09",
    day: "Friday",
    title: "Alumni Talk — Career Roadmaps in Tech",
    cat: "Talk",
    month: "October",
    place: "Seminar Hall A",
    tags: ["Alumni", "Mentorship", "Career"],
    description: "Interaction with successful alumni placed at Fortune 500 tech firms on interview strategies and career leaps.",
    coordinator: "Alumni Association"
  },
  {
    id: 1,
    date: "2026-10-15",
    day: "Tuesday",
    title: "Tech Fest (TechTalk Debate, Tech Presentation Challenge, Type Master Challenge)",
    cat: "Hackathon",
    month: "October",
    place: "Main Auditorium & Computing Labs",
    tags: ["Tech Fest", "Debate", "Type Master", "Presentation"],
    team: [2, 4],
    description: "Flagship annual university showdown featuring TechTalk Debate, technical project presentations, and Type Master speed contest with exciting cash prizes and certificates.",
    coordinator: "Mr. Rahul Soni",
    featured: true
  },
  {
    id: 2,
    date: "2026-10-16",
    day: "Friday",
    title: "World Student Day Celebrations (Day 1)",
    cat: "Cultural",
    month: "October",
    place: "Campus Ground",
    tags: ["Kalam Day", "Innovation", "Youth"],
    description: "Commemorating the birth anniversary of Dr. A.P.J. Abdul Kalam with student science models, poster design, and youth conclave.",
    coordinator: "Ms. Navjot Kaur"
  },
  {
    id: 124,
    date: "2026-10-17",
    day: "Saturday",
    title: "World Student Day Celebrations (Day 2)",
    cat: "Cultural",
    month: "October",
    place: "Auditorium",
    tags: ["Celebration", "Excellence Awards"],
    description: "Felicitation of university academic toppers, innovation grant awardees, and cultural performances.",
    coordinator: "Ms. Navjot Kaur"
  },
  {
    id: 7,
    date: "2026-10-20",
    day: "Tuesday",
    title: "Dussehra",
    cat: "Holiday",
    month: "October",
    place: "Campus-wide",
    tags: ["Holiday", "Vijayadashami"],
    description: "Gazetted campus holiday on account of Vijayadashami.",
    coordinator: "Admin Office"
  },
  {
    id: 3,
    date: "2026-10-23",
    day: "Friday",
    title: "Alumni Talk — High Growth Startups vs Big Tech",
    cat: "Talk",
    month: "October",
    place: "Seminar Hall A",
    tags: ["Alumni", "Startups", "Career"],
    description: "Interactive session on startup tech stacks, salary negotiation, and remote engineering opportunities.",
    coordinator: "Dr. Priya Dhir"
  },
  {
    id: 8,
    date: "2026-10-26",
    day: "Monday",
    title: "Birthday of Maharishi Valmiki Ji (RH)",
    cat: "Holiday",
    month: "October",
    place: "Campus-wide",
    tags: ["Holiday", "Restricted Holiday"],
    description: "Gazetted restricted campus holiday.",
    coordinator: "Admin Office"
  },
  {
    id: 4,
    date: "2026-10-28",
    day: "Wednesday",
    title: "Street Sell — E-Cell Entrepreneurship Challenge",
    cat: "Workshop",
    month: "October",
    place: "Campus Plaza & Food Court Lawns",
    tags: ["E-Cell", "Entrepreneurship", "Pitching"],
    team: [2, 4],
    description: "Live commercial marketplace where teams pitch micro-enterprises and generate revenue within a 6-hour sprint.",
    coordinator: "Er. Amitoj Kaur"
  },
  {
    id: 125,
    date: "2026-10-29",
    day: "Thursday",
    title: "Karva Chauth**",
    cat: "Holiday",
    month: "October",
    place: "Campus-wide",
    tags: ["Festival", "Holiday"],
    description: "Institutional festival holiday.",
    coordinator: "Admin Office"
  },

  // NOVEMBER
  {
    id: 126,
    date: "2026-10-30",
    day: "Friday to Thursday (30 Oct to 5 Nov)",
    title: "Mid Semester Test II (MST-II Exam)",
    cat: "Exam",
    month: "November",
    place: "Department Examination Blocks",
    tags: ["MST-2", "Internal Assessment", "Critical"],
    description: "Crucial Mid Semester Test II covering Units III and IV for all university semesters. Vital for 40-mark internal calculation.",
    coordinator: "Academic Registrar"
  },
  {
    id: 5,
    date: "2026-11-06",
    day: "Friday",
    title: "Green Diwali Celebrations",
    cat: "Cultural",
    month: "November",
    place: "Campus Lawns",
    tags: ["Diwali", "Eco-friendly", "Rangoli"],
    description: "Eco-friendly diya lighting, inter-departmental rangoli challenge, and sweets distribution.",
    coordinator: "Ms. Pinky Singh"
  },
  {
    id: 127,
    date: "2026-11-08",
    day: "Sunday",
    title: "Diwali",
    cat: "Holiday",
    month: "November",
    place: "Campus-wide",
    tags: ["Festival", "Holiday"],
    description: "Festival of Lights — Gazetted national festival holiday.",
    coordinator: "Admin Office"
  },
  {
    id: 128,
    date: "2026-11-09",
    day: "Monday",
    title: "Vishkarma Day",
    cat: "Holiday",
    month: "November",
    place: "Campus-wide",
    tags: ["Holiday", "Festivity"],
    description: "Gazetted campus holiday honoring Lord Vishwakarma.",
    coordinator: "Admin Office"
  },
  {
    id: 129,
    date: "2026-11-10",
    day: "Tuesday",
    title: "Diwali Holiday",
    cat: "Holiday",
    month: "November",
    place: "Campus-wide",
    tags: ["Holiday"],
    description: "Extended institutional festival holiday.",
    coordinator: "Admin Office"
  },
  {
    id: 9,
    date: "2026-11-24",
    day: "Tuesday",
    title: "Shri Guru Nanak Dev Jayanti",
    cat: "Holiday",
    month: "November",
    place: "Campus-wide",
    tags: ["Gurpurab", "Holiday"],
    description: "Gazetted sacred festival holiday on account of Parkash Utsav of Sri Guru Nanak Dev Ji.",
    coordinator: "Admin Office"
  },

  // DECEMBER
  {
    id: 10,
    date: "2026-12-25",
    day: "Friday",
    title: "Christmas Day",
    cat: "Holiday",
    month: "December",
    place: "Campus-wide",
    tags: ["Christmas", "Holiday"],
    description: "Gazetted international winter holiday.",
    coordinator: "Admin Office"
  }
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
  isSIH?: boolean;
  sihProblemCode?: string;
  sihCategory?: "Software" | "Hardware";
  hasMandatoryFemaleMember?: boolean;
}

export const HACKATHON_TEAMS: HackathonTeam[] = [
  {
    id: "team-sih-1",
    name: "SIH-AgroTech GGI (Smart India Hackathon)",
    event: "Smart India Hackathon (SIH 2026) — MoE & AICTE",
    lead: "Rajveer Singh",
    leadRoll: "2433613",
    projectIdea: "AI-Driven Hyperlocal Crop Disease Detection & Automated Hindi/Punjabi Voice Advisory for Smallholder Farmers (PS Code: SIH1602).",
    members: [
      "Rajveer Singh (Lead / FullStack)",
      "Simran Kaur (UI/UX & Mobile - Female Teammate)",
      "Aman Verma (Computer Vision / PyTorch)",
      "Harleen Kaur (Data Science / NLP - Female Teammate)",
      "Gaurav Joshi (IoT & Edge Sensor Pipeline)"
    ],
    maxMembers: 6,
    openRoles: ["Cloud & DevOps Architect (AWS/GCP)"],
    isSIH: true,
    sihProblemCode: "SIH1602 (Ministry of Agriculture)",
    sihCategory: "Software",
    hasMandatoryFemaleMember: true
  },
  {
    id: "team-sih-2",
    name: "SIH-SecureEdu Blockchain",
    event: "Smart India Hackathon (SIH 2026) — MoE & AICTE",
    lead: "Navjot Kaur",
    leadRoll: "2433582",
    projectIdea: "Tamper-Proof National Academic Depository & Real-time Degree Verification on Ethereum Layer-2 (PS Code: SIH1428).",
    members: [
      "Navjot Kaur (Lead / Smart Contracts)",
      "Pardeep Singh (Solidity & Web3)",
      "Saneha Gill (Security Auditor & QA)",
      "Prince Kumar (Next.js Frontend)"
    ],
    maxMembers: 6,
    openRoles: ["Cryptography Specialist", "API Gateway Engineer"],
    isSIH: true,
    sihProblemCode: "SIH1428 (Ministry of Education)",
    sihCategory: "Software",
    hasMandatoryFemaleMember: true
  },
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
    id: "notif-lib",
    title: "⚠️ Library Return Alert: 'Database System Concepts' Due in 2 Days",
    time: "10 mins ago",
    category: "Academic",
    read: false,
    linkPage: "library",
    details: "Book due on 16 Oct 2026. Renew book now with 1-click in the Library Portal to avoid ₹5/day overdue penalty fees!"
  },
  {
    id: "notif-place",
    title: "💼 Placement Drive: Google SDE-1 Application Deadline 18 Oct",
    time: "1 hour ago",
    category: "Academic",
    read: false,
    linkPage: "placement",
    details: "CTC ₹18.0 LPA. Minimum 65% aggregate required. 1-Click apply now available in Placement Cell."
  },
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

// -------------------------------------------------------------
// PLACEMENT CELL DATA & TYPES
// -------------------------------------------------------------
export interface PlacementDrive {
  id: string;
  company: string;
  logo: string;
  role: string;
  ctc: string;
  location: string;
  minPercentage: number;
  eligibleBranches: string[];
  selectionRounds: string[];
  deadline: string;
  description: string;
  openings: number;
  bond?: string;
  skills: string[];
  featured?: boolean;
  batch?: string;
  jobProfiles?: string[];
  spoc?: string;
  registrationLink?: string;
  jobType?: string;
  driveDate?: string;
  officialInvitation?: string;
}

export interface PlacementApplication {
  id: string;
  driveId: string;
  company: string;
  role: string;
  appliedDate: string;
  status: "Applied" | "Shortlisted" | "Interview Scheduled" | "Offer Extended" | "Rejected";
  resumeName: string;
  interviewDate?: string;
  feedback?: string;
}

export const PLACEMENT_DRIVES: PlacementDrive[] = [
  // REAL DATASET 1: Vardhman Special Steels Limited (User Verified)
  {
    id: "drive-vardhman",
    company: "Vardhman Special Steels Limited",
    logo: "https://www.google.com/s2/favicons?domain=vardhmansteel.com&sz=128",
    role: "Core Technical & Operations Trainee (CFD / UT / NDT)",
    ctc: "₹2.42 LPA",
    location: "Ludhiana Plant / Kohara Plant, Punjab",
    minPercentage: 55,
    eligibleBranches: ["BBA", "BCA"],
    batch: "2025 & 2026 Batch",
    jobType: "Full Time",
    spoc: "Corporate Relations Cell (CRC), GGI Khanna",
    registrationLink: "https://forms.gle/X4a7zFPQfQMH1Noi7",
    jobProfiles: [
      "CFD (Ludhiana Plant)",
      "UT Testing (Ludhiana Plant)",
      "NDT (Kohara Plant)"
    ],
    selectionRounds: [
      "Google Form Screening (Official CRC Portal)",
      "Technical Aptitude & Domain Assessment",
      "Plant Operations & Personal Interview (CRC GGI)"
    ],
    deadline: "2026-10-25",
    description: "Gulzar Group of Institutes, Khanna, takes this opportunity to invite you to participate in the Campus Placement Drive By Vardhman Special Steels Limited for BBA & BCA 2025 & 2026 Batch. Industrial plant operations, Ultrasonic Testing (UT), Non-Destructive Testing (NDT) & CFD engineering roles.",
    officialInvitation: "Dear TPCs,\n\nGulzar Group of Institutes, Khanna, takes this opportunity to invite you to participate in the Campus Placement Drive By Vardhman Special Steels Limited For BBA & BCA-2025 & 2026 Batch.\n\nCompany Name: Vardhman Special Steels Limited\nBatch: 2025 & 2026\nQualification: BBA / BCA\nJob Type: Full Time\nJob Profile:\n• CFD (Ludhiana Plant)\n• UT Testing (Ludhiana Plant)\n• NDT (Kohara Plant)\nCTC: ₹2.42 LPA\nLocation: Ludhiana\nSPOC: CRC\n\nInterested students can register themselves by using the official registration link.",
    openings: 35,
    skills: ["BCA / BBA Fundamentals", "Quality Testing", "Plant Operations", "Documentation", "NDT / UT Basics"],
    featured: true
  },

  // REAL DATASET 2: Alpha IT Managed Services Pvt. Ltd (User Verified)
  {
    id: "drive-alpha-it",
    company: "Alpha IT Managed Services Pvt. Ltd",
    logo: "https://www.google.com/s2/favicons?domain=alphait.com&sz=128",
    role: "On-Campus Associate Engineer — IT Managed Services",
    ctc: "₹3.8 - ₹4.5 LPA",
    location: "Mohali / GGI Campus Drive",
    minPercentage: 60,
    eligibleBranches: ["B.Tech CSE", "B.Tech IT", "DAIET", "BCA"],
    batch: "2027 Batch",
    driveDate: "14th Oct, 2026 || 10:00 AM",
    jobType: "Full Time (On-Campus Placement Drive)",
    spoc: "CRC (Corporate Relations Cell)",
    selectionRounds: [
      "On-Campus Written Technical Assessment (10:00 AM)",
      "Live Coding & Troubleshooting Round",
      "Technical Panel Interview",
      "HR Offer Rollout"
    ],
    deadline: "2026-10-14",
    description: "On Campus Placement Drive by Alpha IT Managed Services Pvt. Ltd for B.Tech CSE/IT, DAIET & BCA-2027 Batch students. High-performance IT infrastructure support, networking, server operations, and enterprise customer environments.",
    officialInvitation: "Dear TPCs,\n\nGreetings!!\n\nWe are pleased to inform you about the On Campus Placement Drive || Alpha IT Managed Services Pvt. Ltd || 14th Oct, 2026 || 10:00 am || B.Tech CSE/IT & DAIET/BCA-2027 Batch.\n\nReport directly to GGI Placement Auditorium with printed resumes and college ID.",
    openings: 20,
    skills: ["IT Support", "Linux / Windows Systems", "Networking Fundamentals", "Troubleshooting", "Python / SQL Basics"],
    featured: true
  },

  // REAL DATASET 3: Wipronix Technology (User Verified)
  {
    id: "drive-wipronix",
    company: "Wipronix Technology",
    logo: "https://www.google.com/s2/favicons?domain=wipronix.com&sz=128",
    role: "Graduate Engineer Trainee (GET) / Software Trainee",
    ctc: "₹3.5 - ₹4.8 LPA",
    location: "Mohali / Chandigarh Technology Park",
    minPercentage: 60,
    eligibleBranches: ["B.Tech CSE", "B.Tech IT", "DAIET"],
    batch: "2027 Batch",
    jobType: "Full Time Campus Placement",
    spoc: "CRC Placement Desk",
    selectionRounds: [
      "Online Aptitude & Logic Round",
      "Programming Assessment (C++ / Java / Python / Web)",
      "Technical Interview & HR Discussion"
    ],
    deadline: "2026-10-28",
    description: "Campus Placement Drive for B.Tech CSE/IT & DAIET-2027 Batch by Wipronix Technology. Hands-on development across embedded systems, IoT sensors, and modern web application development.",
    officialInvitation: "Wipronix Technology || Campus Placement Drive || B.Tech CSE/IT & DAIET-2027 Batch.\nEligible candidates should register via the T&P Cell portal and prepare for technical screening rounds.",
    openings: 15,
    skills: ["Data Structures", "Web Development", "Python / C++", "Database SQL", "Communication"],
    featured: true
  },

  {
    id: "drive-1",
    company: "Google",
    logo: "https://www.google.com/favicon.ico",
    role: "Software Development Engineer (SDE-1)",
    ctc: "₹18.0 LPA",
    location: "Gurgaon / Bengaluru",
    minPercentage: 65,
    eligibleBranches: ["BCA", "MCA", "B.Tech CSE", "B.Tech IT"],
    batch: "2025 & 2026 Batch",
    selectionRounds: ["Online Coding Test (DSA)", "Technical Interview Round 1", "Technical Interview Round 2", "Googliness & Leadership Fit"],
    deadline: "2026-10-18",
    description: "Build scalable cloud services, distributed backends, and responsive client platforms touching millions of users daily.",
    openings: 5,
    skills: ["Data Structures", "Algorithms", "C++ / Java / Python", "Distributed Systems"],
    featured: true
  },
  {
    id: "drive-2",
    company: "Tata Consultancy Services (TCS)",
    logo: "https://www.tcs.com/favicon.ico",
    role: "TCS Ninja & Digital Cadre",
    ctc: "₹4.5 - ₹7.2 LPA",
    location: "PAN India (Mohali / Noida / Pune)",
    minPercentage: 60,
    eligibleBranches: ["BCA", "MCA", "B.Tech (All Branches)"],
    selectionRounds: ["TCS NQT (Cognitive + Programming)", "Technical Round", "Managerial & HR Round"],
    deadline: "2026-10-22",
    description: "Join India's largest IT multinational. Digital profile offers accelerated career pathways and tech cloud certifications.",
    openings: 45,
    skills: ["Java", "SQL", "Web Technologies", "Problem Solving"],
    featured: true
  },
  {
    id: "drive-3",
    company: "Infosys",
    logo: "https://www.infosys.com/favicon.ico",
    role: "Specialist Programmer & Systems Engineer",
    ctc: "₹6.5 - ₹9.5 LPA",
    location: "Chandigarh / Mohali / Bengaluru",
    minPercentage: 60,
    eligibleBranches: ["BCA", "MCA", "B.Tech CSE"],
    selectionRounds: ["HackWithInfy / Online Assessment", "Technical Interview", "HR Discussion"],
    deadline: "2026-10-25",
    description: "Design and implement digital transformation architectures for enterprise clients across FinTech and e-commerce.",
    openings: 20,
    skills: ["Python", "Cloud Fundamentals", "React", "DBMS"],
    featured: true
  },
  {
    id: "drive-4",
    company: "Wipro Technologies",
    logo: "https://www.wipro.com/favicon.ico",
    role: "Project Engineer (Elite & Turbo)",
    ctc: "₹5.0 - ₹6.5 LPA",
    location: "Noida / Gurugram / Bengaluru",
    minPercentage: 60,
    eligibleBranches: ["BCA", "MCA", "B.Tech CSE/IT"],
    selectionRounds: ["Online Aptitude + Coding", "Technical Evaluation", "HR Round"],
    deadline: "2026-10-30",
    description: "Engineers will work on full-stack web and mobile application delivery, testing automation, and CI/CD operations.",
    openings: 25,
    skills: ["JavaScript", "Node.js", "Java", "REST APIs"],
    featured: false
  },
  {
    id: "drive-5",
    company: "Microsoft",
    logo: "https://www.microsoft.com/favicon.ico",
    role: "Support & Cloud Solution Engineer",
    ctc: "₹14.0 LPA",
    location: "Hyderabad / Bengaluru",
    minPercentage: 70,
    eligibleBranches: ["BCA", "MCA", "B.Tech CSE"],
    selectionRounds: ["Online Assessment", "Technical Screening", "System Design & Azure", "HR Fitment"],
    deadline: "2026-11-05",
    description: "Collaborate with Azure global cloud engineering teams to troubleshoot high-complexity enterprise hybrid cloud architectures.",
    openings: 4,
    skills: ["Networking", "Linux/Windows Internals", "Cloud Azure", "Scripting"],
    featured: true
  },
  {
    id: "drive-6",
    company: "Zomato",
    logo: "https://www.zomato.com/favicon.ico",
    role: "Associate Frontend Engineer",
    ctc: "₹8.5 LPA",
    location: "Gurugram (HQ)",
    minPercentage: 60,
    eligibleBranches: ["BCA", "MCA", "B.Tech (Any)"],
    selectionRounds: ["Machine Coding Round (React)", "Technical Deep-dive", "Culture Fit Interview"],
    deadline: "2026-11-10",
    description: "Create buttery-smooth, high-speed mobile and web experiences for millions of foodies and quick commerce riders.",
    openings: 8,
    skills: ["React", "TypeScript", "Tailwind CSS", "Web Performance"],
    featured: false
  }
];

export const INITIAL_APPLICATIONS: PlacementApplication[] = [
  {
    id: "app-vardhman",
    driveId: "drive-vardhman",
    company: "Vardhman Special Steels Limited",
    role: "Core Technical & Operations Trainee (CFD / UT / NDT)",
    appliedDate: "2026-10-14",
    status: "Applied",
    resumeName: "Rajveer_Singh_Resume_BCA.pdf",
    feedback: "Official Google Form registration submitted to Corporate Relations Cell (CRC). Shortlisted students will report for Ludhiana Plant interviews."
  },
  {
    id: "app-alpha",
    driveId: "drive-alpha-it",
    company: "Alpha IT Managed Services Pvt. Ltd",
    role: "On-Campus Associate Engineer — IT Managed Services",
    appliedDate: "2026-10-14",
    status: "Shortlisted",
    resumeName: "Rajveer_Singh_Resume_BCA.pdf",
    interviewDate: "14th Oct, 2026 || 10:00 AM (Placement Auditorium)",
    feedback: "Hall ticket generated for on-campus written and coding round."
  },
  {
    id: "app-1",
    driveId: "drive-1",
    company: "Google",
    role: "Software Development Engineer (SDE-1)",
    appliedDate: "2026-10-10",
    status: "Shortlisted",
    resumeName: "Rajveer_Singh_Resume_BCA.pdf",
    interviewDate: "2026-10-24 at 11:00 AM (Google Meet)",
    feedback: "Cleared Round 1 resume screening with ATS 88%. Online coding link sent to student email."
  },
  {
    id: "app-2",
    driveId: "drive-2",
    company: "Tata Consultancy Services (TCS)",
    role: "TCS Ninja & Digital Cadre",
    appliedDate: "2026-10-12",
    status: "Applied",
    resumeName: "Rajveer_Singh_Resume_BCA.pdf",
    feedback: "Application acknowledged. Hall ticket for NQT will be generated on 20 Oct."
  }
];

// -------------------------------------------------------------
// DIGITAL NOTICE BOARD DATA & TYPES (FACULTY & STUDENT PORTAL)
// -------------------------------------------------------------
export type NoticeCategory = "Academic" | "Placement" | "Exam" | "Hackathon" | "Holiday" | "Administrative";
export type NoticePriority = "Urgent" | "High" | "Normal";

export interface DigitalNotice {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  category: NoticeCategory;
  priority: NoticePriority;
  postedDate: string;
  targetAudience: string;
  content: string;
  attachmentName?: string;
  attachmentLink?: string;
  circularNo?: string;
  pinned?: boolean;
}

export const INITIAL_DIGITAL_NOTICES: DigitalNotice[] = [
  {
    id: "notice-vardhman",
    title: "📢 Campus Placement Drive: Vardhman Special Steels Limited for BBA & BCA (2025 & 2026 Batch)",
    author: "Training & Placement Cell (CRC)",
    authorRole: "Head Corporate Relations",
    category: "Placement",
    priority: "Urgent",
    postedDate: "14 Oct 2026, 09:30 AM",
    targetAudience: "BBA & BCA (2025 & 2026 Batches)",
    circularNo: "GGI/CRC/2026/OCT-104",
    pinned: true,
    content: "Dear TPCs,\n\nGulzar Group of Institutes, Khanna, takes this opportunity to invite you to participate in the Campus Placement Drive By Vardhman Special Steels Limited For BBA & BCA-2025 & 2026 Batch.\n\n• Company Name: Vardhman Special Steels Limited\n• Batch: 2025 & 2026\n• Qualification: BBA / BCA\n• Job Type: Full Time\n• Job Profile:\n   - CFD (Ludhiana Plant)\n   - UT Testing (Ludhiana Plant)\n   - NDT (Kohara Plant)\n• CTC: ₹2.42 LPA\n• Location: Ludhiana / Kohara Plant\n• SPOC: CRC\n\nInterested students can register themselves using the official registration link below. Ensure accurate details are submitted before deadline.",
    attachmentName: "Registration_Google_Form_Link",
    attachmentLink: "https://forms.gle/X4a7zFPQfQMH1Noi7"
  },
  {
    id: "notice-alpha",
    title: "💼 On-Campus Placement Drive: Alpha IT Managed Services Pvt. Ltd || 14th Oct, 2026 || 10:00 AM",
    author: "Corporate Relations Cell (CRC)",
    authorRole: "Placement Officer",
    category: "Placement",
    priority: "Urgent",
    postedDate: "13 Oct 2026, 04:00 PM",
    targetAudience: "B.Tech CSE/IT, DAIET & BCA-2027 Batch",
    circularNo: "GGI/CRC/2026/OCT-102",
    pinned: true,
    content: "Dear TPCs,\n\nGreetings!!\n\nWe are pleased to inform you about the On Campus Placement Drive || Alpha IT Managed Services Pvt. Ltd || 14th Oct, 2026 || 10:00 am || B.Tech CSE/IT & DAIET/BCA-2027 Batch.\n\nAll registered students are required to report at 10:00 AM sharp in Auditorium Block B with 2 hard copies of resumes, original ID cards, and formal dress code. Written assessment begins at 10:30 AM.",
    attachmentName: "Alpha_IT_Candidate_Roster.pdf"
  },
  {
    id: "notice-wipronix",
    title: "⚡ Campus Placement Drive: Wipronix Technology || B.Tech CSE/IT & DAIET-2027 Batch",
    author: "CRC Placement Desk",
    authorRole: "Assistant Director CRC",
    category: "Placement",
    priority: "High",
    postedDate: "12 Oct 2026, 11:15 AM",
    targetAudience: "B.Tech CSE/IT & DAIET (2027 Batch)",
    circularNo: "GGI/CRC/2026/OCT-98",
    pinned: false,
    content: "Wipronix Technology || Campus Placement Drive || B.Tech CSE/IT & DAIET-2027 Batch.\n\nProfiles offered: Graduate Engineer Trainee (GET) & Software Development Trainee. Eligible students must submit their profiles on the Placement Portal by 20th Oct 2026. Online technical evaluation link will be dispatched to shortlisted candidates."
  },
  {
    id: "notice-sih",
    title: "🏆 Smart India Hackathon (SIH 2026) — Institutional Internal Screening & Team Registration",
    author: "Er. Amitoj Kaur",
    authorRole: "SPOC AICTE Innovation Cell & E-Cell Lead",
    category: "Hackathon",
    priority: "Urgent",
    postedDate: "11 Oct 2026, 02:00 PM",
    targetAudience: "All Engineering & Computing Students (BCA, MCA, B.Tech)",
    circularNo: "GGI/HACK/SIH-2026/01",
    pinned: true,
    content: "Official call for entries for Smart India Hackathon (SIH 2026) — Government of India, Ministry of Education (MoE) & AICTE.\n\nMandatory Rules:\n1. Team size must be exactly 6 students from GGI.\n2. Each team MUST include at least 1 female teammate (AICTE compliance).\n3. Internal evaluation will shortlist top teams for the National Grand Finale with ₹1 Lakh cash prize per problem statement.\n\nUse the Hackathon Team Builder on SmartCampus to create and join SIH teams before 22 Oct 2026."
  },
  {
    id: "notice-mst2",
    title: "📝 Mid Semester Test II (MST-II) Date Sheet Announced: 30 Oct to 05 Nov 2026",
    author: "MS. NAVJOT",
    authorRole: "Assistant Professor & Examination In-Charge",
    category: "Exam",
    priority: "High",
    postedDate: "10 Oct 2026, 10:00 AM",
    targetAudience: "All BCA, MCA & B.Tech Batches",
    circularNo: "GGI/EXAM/MST2-2026",
    pinned: false,
    content: "All students are informed that Mid Semester Test II (MST-II) is scheduled from 30 Oct 2026 to 05 Nov 2026. MST-II syllabus covers Units III and IV. MST-II marks are critical for the 40-mark continuous internal evaluation. Students with attendance below 75% must contact subject coordinators immediately."
  },
  {
    id: "notice-techfest",
    title: "🚀 GGI Tech Fest: TechTalk Debate, Presentation & Type Master Challenge — 15 Oct 2026",
    author: "Mr. Rahul Soni",
    authorRole: "Assistant Professor & Tech Club Convener",
    category: "Hackathon",
    priority: "High",
    postedDate: "09 Oct 2026, 12:30 PM",
    targetAudience: "All Campus Departments",
    circularNo: "GGI/FEST/2026-TF1",
    pinned: false,
    content: "Annual GGI Tech Fest showdown takes place on 15 Oct 2026 in Main Auditorium and Computer Center. Events include:\n• TechTalk Debate (Inter-departmental)\n• Tech Presentation Challenge (Emerging Tech & AI)\n• Type Master Speed Challenge (Speed & Accuracy)\n\nE-passes with dynamic HMAC-SHA256 rotation are now live on your Events Hub. Duty leave will be automatically credited."
  }
];

// -------------------------------------------------------------
// DIGITAL LIBRARY & FINE PREVENTION SYSTEM
// -------------------------------------------------------------
export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  accessionNo: string;
  issueDate: string;
  dueDate: string; // YYYY-MM-DD
  coverTone: string;
  renewalsLeft: number;
  maxRenewals: number;
  returnedDate?: string;
  subjectCode: string;
}

export interface LibraryCatalogBook {
  id: string;
  title: string;
  author: string;
  subjectCode: string;
  shelf: string;
  totalCopies: number;
  availableCopies: number;
  category: "Computer Science" | "Programming" | "Database & Cloud" | "Software Engineering" | "General";
}

export const INITIAL_BORROWED_BOOKS: BorrowedBook[] = [
  {
    id: "borrow-1",
    title: "Database System Concepts (6th Edition)",
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    isbn: "978-0073523323",
    accessionNo: "GGI-LIB-BCA-0428",
    issueDate: "2026-10-02",
    dueDate: "2026-10-16", // 2 days from Oct 14
    coverTone: "from-blue-600 to-indigo-800",
    renewalsLeft: 2,
    maxRenewals: 2,
    subjectCode: "UGCA1930"
  },
  {
    id: "borrow-2",
    title: "Programming with PHP and MySQL",
    author: "Steven Holzner",
    isbn: "978-0070680142",
    accessionNo: "GGI-LIB-BCA-0711",
    issueDate: "2026-10-06",
    dueDate: "2026-10-20", // 6 days from Oct 14
    coverTone: "from-purple-600 to-violet-900",
    renewalsLeft: 1,
    maxRenewals: 2,
    subjectCode: "UGCA1929"
  },
  {
    id: "borrow-3",
    title: "Computer System Architecture",
    author: "M. Morris Mano",
    isbn: "978-8120304178",
    accessionNo: "GGI-LIB-BCA-0192",
    issueDate: "2026-09-08",
    dueDate: "2026-09-22",
    coverTone: "from-slate-600 to-slate-800",
    renewalsLeft: 0,
    maxRenewals: 2,
    returnedDate: "2026-09-21",
    subjectCode: "UGCA1902"
  }
];

export const LIBRARY_CATALOG: LibraryCatalogBook[] = [
  {
    id: "cat-1",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    subjectCode: "UGCA1931",
    shelf: "Stack 4 • Shelf B-12",
    totalCopies: 8,
    availableCopies: 3,
    category: "Software Engineering"
  },
  {
    id: "cat-2",
    title: "Computer Networks (5th Edition)",
    author: "Andrew S. Tanenbaum, David J. Wetherall",
    subjectCode: "UGCA1936",
    shelf: "Stack 2 • Shelf C-04",
    totalCopies: 12,
    availableCopies: 5,
    category: "Computer Science"
  },
  {
    id: "cat-3",
    title: "Data Mining: Concepts and Techniques",
    author: "Jiawei Han, Micheline Kamber, Jian Pei",
    subjectCode: "UGCA1935",
    shelf: "Stack 3 • Shelf A-09",
    totalCopies: 6,
    availableCopies: 2,
    category: "Database & Cloud"
  },
  {
    id: "cat-4",
    title: "Operating System Concepts",
    author: "Peter B. Galvin, Greg Gagne",
    subjectCode: "UGCA1911",
    shelf: "Stack 1 • Shelf D-15",
    totalCopies: 10,
    availableCopies: 0,
    category: "Computer Science"
  },
  {
    id: "cat-5",
    title: "Introduction to Algorithms (CLRS 3rd Edition)",
    author: "Cormen, Leiserson, Rivest, Stein",
    subjectCode: "UGCA1915",
    shelf: "Stack 2 • Shelf A-01",
    totalCopies: 15,
    availableCopies: 4,
    category: "Programming"
  },
  {
    id: "cat-6",
    title: "Let Us C (17th Edition)",
    author: "Yashavant Kanetkar",
    subjectCode: "UGCA1901",
    shelf: "Stack 1 • Shelf B-03",
    totalCopies: 20,
    availableCopies: 11,
    category: "Programming"
  }
];

// -------------------------------------------------------------
// ERP STUDY MATERIAL & SYLLABUS LIBRARY
// -------------------------------------------------------------
export interface ErpStudyMaterial {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  unit: "Unit I" | "Unit II" | "Unit III" | "Unit IV" | "Full Syllabus" | "Lab Manual" | "Question Bank";
  type: "Notes" | "Slides" | "Syllabus" | "Lab Manual" | "Question Bank";
  fileSize: string;
  facultyName: string;
  uploadDate: string;
  downloadCount: number;
  fileUrl: string;
}

export const INITIAL_ERP_MATERIALS: ErpStudyMaterial[] = [
  {
    id: "mat-1",
    title: "PHP Session Management, Cookies & Database Connectivity",
    subjectCode: "UGCA1929",
    subjectName: "Programming in PHP",
    unit: "Unit III",
    type: "Notes",
    fileSize: "3.4 MB",
    facultyName: "Ms. Navjot Kaur",
    uploadDate: "2026-10-11",
    downloadCount: 142,
    fileUrl: "/docs/php-unit3-sessions.pdf"
  },
  {
    id: "mat-2",
    title: "PHP Laboratory Assignment Exercises & Code Solutions",
    subjectCode: "UGCA1930",
    subjectName: "Programming in PHP Laboratory",
    unit: "Lab Manual",
    type: "Lab Manual",
    fileSize: "5.8 MB",
    facultyName: "Ms. Navjot Kaur",
    uploadDate: "2026-10-04",
    downloadCount: 218,
    fileUrl: "/docs/php-lab-manual-bca3.pdf"
  },
  {
    id: "mat-3",
    title: "Agile Scrum Methodology, Sprint Planning & Jira Workflows",
    subjectCode: "UGCA1931",
    subjectName: "Software Engineering",
    unit: "Unit II",
    type: "Slides",
    fileSize: "4.1 MB",
    facultyName: "Er. Amitoj Kaur",
    uploadDate: "2026-10-09",
    downloadCount: 110,
    fileUrl: "/docs/se-unit2-agile.pdf"
  },
  {
    id: "mat-4",
    title: "Data Warehouse Schemas: Star vs Snowflake Architecture",
    subjectCode: "UGCA1935",
    subjectName: "Data Mining & Data Warehousing",
    unit: "Unit I",
    type: "Notes",
    fileSize: "2.9 MB",
    facultyName: "Dr. Priya Dhir",
    uploadDate: "2026-09-28",
    downloadCount: 89,
    fileUrl: "/docs/dm-unit1-dwh.pdf"
  },
  {
    id: "mat-5",
    title: "AWS EC2, S3, IAM Roles & Cloud Virtualization Deep Dive",
    subjectCode: "UGCA1936",
    subjectName: "Cloud Computing",
    unit: "Unit II",
    type: "Slides",
    fileSize: "6.2 MB",
    facultyName: "Mr. Rahul Soni",
    uploadDate: "2026-10-01",
    downloadCount: 165,
    fileUrl: "/docs/cloud-unit2-aws.pdf"
  },
  {
    id: "mat-6",
    title: "Mid-Semester Test II Model Question Bank with Solutions",
    subjectCode: "UGCA1929",
    subjectName: "Programming in PHP",
    unit: "Question Bank",
    type: "Question Bank",
    fileSize: "1.8 MB",
    facultyName: "Ms. Navjot Kaur",
    uploadDate: "2026-10-13",
    downloadCount: 195,
    fileUrl: "/docs/mst2-model-questions.pdf"
  },
  {
    id: "mat-7",
    title: "BCA 5th Semester Complete Academic Scheme & Syllabus 2026-27",
    subjectCode: "BCA-GEN",
    subjectName: "BCA Semester 5 Curricula",
    unit: "Full Syllabus",
    type: "Syllabus",
    fileSize: "1.2 MB",
    facultyName: "Office of Academic Affairs (GGI)",
    uploadDate: "2026-08-01",
    downloadCount: 340,
    fileUrl: "/docs/bca-sem5-syllabus.pdf"
  }
];

// -------------------------------------------------------------
// FACULTY DEVELOPMENT PROGRAMS (FDP) TRACKER (As per GGI Portal Screenshot)
// -------------------------------------------------------------
export interface FDPProgram {
  id: string;
  title: string;
  applicationNo: string;
  mode: "ATAL Offline" | "FDP Offline" | "Online";
  startDate: string;
  endDate: string;
  institute: string;
  thrustArea: string;
  subThrustArea: string;
  status: "Completed" | "Ongoing" | "Upcoming";
  appliedDate: string;
  certificateUrl?: string;
}

export const INITIAL_FDPS: FDPProgram[] = [
  {
    id: "fdp-1",
    title: "Applied AI: Emerging Trends, Tools, and Societal Applications",
    applicationNo: "1774003396",
    mode: "ATAL Offline",
    startDate: "Oct 5, 2026",
    endDate: "Oct 10, 2026",
    appliedDate: "Sep 15, 2026",
    institute: "SCTR'S PUNE INSTITUTE OF COMPUTER TECHNOLOGY",
    thrustArea: "Engineering and Management",
    subThrustArea: "Advanced Computing (Supercomputing, AI, Quantum Computing)",
    status: "Completed",
    certificateUrl: "/docs/fdp-cert-atal-ai.pdf"
  },
  {
    id: "fdp-2",
    title: "Product Innovation & UI/UX Accessibility in FinTech Systems",
    applicationNo: "1774004589",
    mode: "FDP Offline",
    startDate: "Oct 26, 2026",
    endDate: "Oct 31, 2026",
    appliedDate: "Sep 22, 2026",
    institute: "MANIPAL ACADEMY OF HIGHER EDUCATION",
    thrustArea: "Design and Media Sub Thrust Area",
    subThrustArea: "Lifestyle Accessory Design & Modern User Interfaces",
    status: "Upcoming"
  },
  {
    id: "fdp-3",
    title: "Clean Energy Integration & Sustainable Computing Systems",
    applicationNo: "1774005120",
    mode: "FDP Offline",
    startDate: "Oct 5, 2026",
    endDate: "Oct 10, 2026",
    appliedDate: "Aug 28, 2026",
    institute: "GYAN GANGA INSTITUTE OF TECHNOLOGY & SCIENCES",
    thrustArea: "Engineering and Management",
    subThrustArea: "Sustainable Clean Energy, Green Cloud Infrastructures & Climate Change",
    status: "Completed"
  }
];

// -------------------------------------------------------------
// FACULTY WEEKLY TIMETABLE (As per GGI ERP Screenshot Pages 2, 3, 4)
// -------------------------------------------------------------
export interface FacultyScheduleSlot {
  period: string;
  time: string;
  subject: string;
  subjectCode: string;
  classGroup: string;
  room: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  status: "Active" | "Research / Off" | "Lab Session";
}

export const FACULTY_WEEKLY_TIMETABLE: Record<string, FacultyScheduleSlot[]> = {
  Monday: [
    { period: "P1", time: "09:00 AM – 09:50 AM", subject: "Programming in PHP", subjectCode: "UGCA1929", classGroup: "Bachelor of Computer Applications 3-C", room: "B-204", day: "Monday", status: "Active" },
    { period: "P3", time: "10:40 AM – 11:30 AM", subject: "Programming in PHP", subjectCode: "UGCA1929", classGroup: "Bachelor of Computer Applications 3-B", room: "B-104", day: "Monday", status: "Active" },
    { period: "P7", time: "02:30 PM – 03:20 PM", subject: "Programming in PHP", subjectCode: "UGCA1929", classGroup: "Bachelor of Computer Applications 3-A", room: "B-202", day: "Monday", status: "Active" }
  ],
  Tuesday: [
    { period: "P2", time: "09:50 AM – 10:40 AM", subject: "Programming in PHP Laboratory", subjectCode: "UGCA1930", classGroup: "Bachelor of Computer Applications 3-C", room: "B-201", day: "Tuesday", status: "Lab Session" },
    { period: "Off", time: "11:30 AM – 01:00 PM", subject: "Departmental Research & Mentorship", subjectCode: "RES-501", classGroup: "Faculty Cabin B-205", room: "Cabin B-205", day: "Tuesday", status: "Research / Off" },
    { period: "P6", time: "01:40 PM – 02:30 PM", subject: "Web Technologies & Open Source", subjectCode: "UGCA1929", classGroup: "Bachelor of Computer Applications 3-B", room: "B-104", day: "Tuesday", status: "Active" }
  ],
  Wednesday: [
    { period: "P1", time: "09:00 AM – 09:50 AM", subject: "Programming in PHP Laboratory", subjectCode: "UGCA1930", classGroup: "Bachelor of Computer Applications 3-C", room: "C-201", day: "Wednesday", status: "Lab Session" },
    { period: "P2", time: "09:50 AM – 10:40 AM", subject: "Programming in PHP Laboratory", subjectCode: "UGCA1930", classGroup: "Bachelor of Computer Applications 3-C", room: "C-201", day: "Wednesday", status: "Lab Session" },
    { period: "Off", time: "10:40 AM – 11:30 AM", subject: "Off-period / Research & Mentoring", subjectCode: "RES-502", classGroup: "Faculty Cabin", room: "Cabin B-205", day: "Wednesday", status: "Research / Off" },
    { period: "P4", time: "11:30 AM – 12:20 PM", subject: "Programming in PHP Laboratory", subjectCode: "UGCA1930", classGroup: "Bachelor of Computer Applications 3-B", room: "C-401", day: "Wednesday", status: "Lab Session" },
    { period: "P5", time: "12:20 PM – 01:10 PM", subject: "Programming in PHP Laboratory", subjectCode: "UGCA1930", classGroup: "Bachelor of Computer Applications 3-B", room: "C-401", day: "Wednesday", status: "Lab Session" }
  ],
  Thursday: [
    { period: "P1", time: "09:00 AM – 09:50 AM", subject: "Programming in PHP", subjectCode: "UGCA1929", classGroup: "Bachelor of Computer Applications 3-C", room: "B-204", day: "Thursday", status: "Active" },
    { period: "P2", time: "09:50 AM – 10:40 AM", subject: "Programming in PHP", subjectCode: "UGCA1929", classGroup: "Bachelor of Computer Applications 3-C", room: "B-204", day: "Thursday", status: "Active" },
    { period: "P4", time: "11:30 AM – 12:20 PM", subject: "Programming in PHP Laboratory", subjectCode: "UGCA1930", classGroup: "Bachelor of Computer Applications 3-C", room: "C-201", day: "Thursday", status: "Lab Session" },
    { period: "P5", time: "12:20 PM – 01:10 PM", subject: "Programming in PHP Laboratory", subjectCode: "UGCA1930", classGroup: "Bachelor of Computer Applications 3-C", room: "C-201", day: "Thursday", status: "Lab Session" }
  ],
  Friday: [
    { period: "P1", time: "09:00 AM – 09:50 AM", subject: "Programming in PHP", subjectCode: "UGCA1929", classGroup: "Bachelor of Computer Applications 3-B", room: "B-104", day: "Friday", status: "Active" },
    { period: "Off", time: "10:00 AM – 12:30 PM", subject: "Departmental Accreditation & NAAC Review", subjectCode: "NAAC-A+", classGroup: "Conference Hall", room: "Admin Block", day: "Friday", status: "Research / Off" },
    { period: "P6", time: "01:40 PM – 02:30 PM", subject: "Remedial & Tutorial Session", subjectCode: "UGCA1929", classGroup: "Bachelor of Computer Applications 3-C", room: "B-204", day: "Friday", status: "Active" }
  ]
};


