# SmartCampus — GGI Khanna (React 19 + TypeScript + Tailwind CSS)

Unified Academic, Attendance, Duty Leave, Events & Examination Portal for **Gulzar Group of Institutes, Khanna, Punjab**.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 👥 Demo Logins

| Persona | Email | Password | Role & Details |
| :--- | :--- | :--- | :--- |
| **Student** | `student@smartcampus.demo` | `Student@123` | **Rajveer Singh** (BCA • Year 3 • Sec C • Roll 2433613) |
| **Faculty** | `faculty@smartcampus.demo` | `Faculty@123` | **Mr. Rahul Soni** (Dept. of Computer Applications) |
| **Admin** | `admin@smartcampus.demo` | `Admin@123` | **Admin Office** (Academic Registrar & Dean Office) |

---

## 🌟 Modules Implemented & Connected

### 1. Academic Modules
- **Dashboard (`Dashboard.tsx`)**: Circular attendance progress ring, live assignment countdowns, next event alert, total XP card, today's schedule with day selector, 15-min faculty booking widget.
- **Timetable (`Timetable.tsx`)**: Full weekly timetable (Periods 1–7), interactive day view, lecture details modal, lunch break indicators, and print view.
- **Attendance & Bunk Calc (`Attendance.tsx`)**: Biometric attendance records, threshold alerts (<75%), and an interactive **Bunk & Recovery Calculator** ("How many classes can I miss?" / "How many classes must I attend to hit 75%?").
- **Marks & Grades (`Marks.tsx`)**: MST-I & MST-II scores, continuous internal assessment breakdown (out of 40), SGPA/CGPA progression across all 5 semesters.
- **Assignments (`Assignments.tsx`)**: Submit coursework with simulated file upload (PDF/ZIP), repository link, feedback view with marks and faculty remarks.
- **Faculty Appointments (`Appointments.tsx`)**: Book 15-minute 1-on-1 guidance slots with faculty members, select dates and times, view Google Meet links.

### 2. Campus Life Modules
- **Events & Dynamic Passes (`Events.tsx`)**: Filter events (Hackathons, Workshops, Cultural), event registration, and **Anti-Spoofing Dynamic Rotating QR Pass** with 30s HMAC-SHA256 tokens and animated countdown ring.
- **Team Builder (`TeamBuilder.tsx`)**: Multi-disciplinary hackathon squad builder (Tech Fest, Smart India Hackathon). Create squads, recruit roles (Frontend, Backend, AI/ML, Pitcher), request to join teams.
- **Duty Leave (`DutyLeave.tsx`)**: Formal Duty Leave (DL) application workflow, upload proof document, multi-step approval tracker (Student -> Mentor -> HOD -> Attendance Adjustment).
- **E-Certificates Vault (`Certificates.tsx`)**: Verifiable tamper-proof institutional e-certificates with official seal, cryptographic hash, printable modal, and PDF download simulation.

### 3. Personal & Management Modules
- **XP & Leaderboard (`XPBadges.tsx`)**: Student gamification level (Level 4 Campus Prodigy, 1,240 XP), achievement badges collection, and department leaderboard.
- **Account Settings (`Settings.tsx`)**: Student profile information, notification channel preferences (WhatsApp, email, attendance alerts), and security password change.
- **Admin Console (`Admin.tsx`)**: Duty leave verification queue (Approve/Reject), live gate scanner with camera feed / simulation, student search, audit export.
- **Faculty Portal (`FacultyPortal.tsx`)**: Mark class attendance with present/absent toggles, grade student assignments, review appointment requests.

### 4. Cross-Cutting Senior Developer Features
- **⌘K Command Palette (`CommandPalette.tsx`)**: Keyboard-driven quick jump to any page, course, or action.
- **Campus Notifications (`NotificationsModal.tsx`)**: Real-time campus alert drawer with unread counter.
- **CampusGenie AI Assistant (`AiAssistantModal.tsx`)**: Floating AI bot answering attendance queries, timetable questions, and duty leave guidance.
- **Dark Mode**: Complete high-contrast dark theme with persistence.
- **Mobile Responsive Drawer**: Mobile hamburger menu for small screens.
- **Toast Notifications (`ToastContainer`)**: Instant feedback on every user action.
