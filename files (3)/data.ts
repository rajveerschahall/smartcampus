export type Category = "Hackathons" | "Workshops" | "Cultural";
export interface CampusEvent {
  id: string; title: string; date: string; endDate?: string; category: Category;
  venue: string; tags: string[]; team?: { size: number; filled: number };
}

// Source: Academic Calendar 2026-27 (Odd Sem), Dept. of Computer Applications
export const EVENTS: CampusEvent[] = [
  { id: "e1", title: "Tech Fest: TechTalk, Presentation & Type Master", date: "2026-10-15", category: "Hackathons", venue: "Main Auditorium", tags: ["Debate", "Typing", "Presentation"], team: { size: 4, filled: 2 } },
  { id: "e2", title: "World Student Day Celebrations", date: "2026-10-16", endDate: "2026-10-17", category: "Cultural", venue: "College Ground", tags: ["Celebration", "Students"] },
  { id: "e3", title: "Alumni Talk", date: "2026-10-23", category: "Workshops", venue: "Seminar Hall", tags: ["Career", "Alumni"] },
  { id: "e4", title: "Street Sell by E-Cell", date: "2026-10-28", category: "Workshops", venue: "Campus Plaza", tags: ["Entrepreneurship", "Marketing"], team: { size: 3, filled: 1 } },
  { id: "e5", title: "Green Diwali Celebrations", date: "2026-11-06", category: "Cultural", venue: "College Ground", tags: ["Eco", "Festival"] },
  { id: "e6", title: "AI/ML Workshop with Mr. Kartik Goyal", date: "2026-09-30", category: "Workshops", venue: "Computer Lab 2", tags: ["AI", "ML", "Python"] },
  { id: "e7", title: "CodeQuest", date: "2026-09-16", category: "Hackathons", venue: "Computer Lab 1", tags: ["DSA", "Coding"], team: { size: 2, filled: 1 } },
  { id: "e8", title: "Talent Hunt: Music, Theatre, Dance & Sports", date: "2026-09-22", endDate: "2026-09-25", category: "Cultural", venue: "Main Auditorium", tags: ["Music", "Dance", "Theatre"] },
  { id: "e9", title: "Fresher's Day", date: "2026-09-26", category: "Cultural", venue: "Main Auditorium", tags: ["Fresher", "Fun"] },
  { id: "e10", title: "Tech Titans Quiz", date: "2026-08-27", category: "Hackathons", venue: "Seminar Hall", tags: ["Quiz", "Tech"], team: { size: 3, filled: 3 } },
];

export const FACULTY = [
  "Ms. Ripandeep Kaur", "Er. Amitoj Kaur", "Ms. Loveleen Kaur", "Ms. Iqra Nazir", "Dr. Priya Dhir",
  "Ms. Navjot Kaur", "Ms. Manisha Chawla", "Ms. Gurpreet Kaur", "Mr. Satyam Gautam", "Ms. Anushka Mohal",
  "Ms. Pinky Singh", "Mr. Rahul Soni", "Ms. Rajwant Kaur", "Dr. Surjit Kumar Gandhi",
  "Dr. Amandeep Singh Kalra", "Dr. Rajiv Kumar",
];

export const STUDENTS = [
  { roll: "BCA3C-01", name: "Aarav Sharma", pct: 88 }, { roll: "BCA3C-02", name: "Simran Kaur", pct: 92 },
  { roll: "BCA3C-03", name: "Harpreet Singh", pct: 71 }, { roll: "BCA3C-04", name: "Neha Verma", pct: 84 },
  { roll: "BCA3C-05", name: "Rohan Gill", pct: 66 }, { roll: "BCA3C-06", name: "Jasleen Kaur", pct: 95 },
  { roll: "BCA3C-07", name: "Karan Mehta", pct: 78 }, { roll: "BCA3C-08", name: "Pooja Rani", pct: 74 },
];

export const DL_REQUESTS = [
  { id: 1, student: "Aarav Sharma", event: "CodeQuest", dates: "16 Sep", status: "Pending" },
  { id: 2, student: "Simran Kaur", event: "Talent Hunt (Dance)", dates: "24 Sep", status: "Verified" },
  { id: 3, student: "Rohan Gill", event: "Tech Fest", dates: "15 Oct", status: "Pending" },
  { id: 4, student: "Neha Verma", event: "Street Sell E-Cell", dates: "28 Oct", status: "Pending" },
  { id: 5, student: "Karan Mehta", event: "Industrial Visit / C-DAC", dates: "9-11 Sep", status: "Verified" },
  { id: 6, student: "Pooja Rani", event: "Fresher's Day", dates: "26 Sep", status: "Rejected" },
];
