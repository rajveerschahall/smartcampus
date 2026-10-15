import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
  UploadCloud,
  Users,
  X,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Code2,
  Cpu,
  Layers,
  Settings,
  Plus,
  Trash2
} from "lucide-react";
import {
  PLACEMENT_DRIVES,
  INITIAL_APPLICATIONS,
  PlacementDrive,
  PlacementApplication,
  User as UserModel
} from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";

const DRIVES_STORAGE_KEY = "ggi_campus_placement_drives_v2";

export default function PlacementPortal({ user }: { user?: UserModel | null }) {
  const isTeacher = user?.role === "Faculty";

  const [drives, setDrives] = useState<PlacementDrive[]>(() => {
    try {
      const saved = localStorage.getItem(DRIVES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return PLACEMENT_DRIVES;
  });

  const saveDrives = (next: PlacementDrive[]) => {
    setDrives(next);
    try {
      localStorage.setItem(DRIVES_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Teacher Placement Drive Add Modal & Form State
  const [addDriveModalOpen, setAddDriveModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newCtc, setNewCtc] = useState("₹2.42 LPA");
  const [newLocation, setNewLocation] = useState("Ludhiana Plant / Kohara Plant, Punjab");
  const [newMinPercentage, setNewMinPercentage] = useState(55);
  const [newBatch, setNewBatch] = useState("2025 & 2026 Batch");
  const [newEligibleBranches, setNewEligibleBranches] = useState("BBA, BCA");
  const [newJobType, setNewJobType] = useState("Full Time");
  const [newDriveDate, setNewDriveDate] = useState("14th Oct, 2026 || 10:00 am");
  const [newDeadline, setNewDeadline] = useState("2026-10-25");
  const [newSpoc, setNewSpoc] = useState("CRC Desk (Gulzar Group of Institutes)");
  const [newRegistrationLink, setNewRegistrationLink] = useState("https://forms.gle/X4a7zFPQfQMH1Noi7");
  const [newSkills, setNewSkills] = useState("Aptitude, Core Technical, Testing, Communication");
  const [newJobProfiles, setNewJobProfiles] = useState("CFD (Ludhiana Plant), UT Testing (Ludhiana Plant), NDT (Kohara Plant)");
  const [newDescription, setNewDescription] = useState("");
  const [newOfficialInvitation, setNewOfficialInvitation] = useState("");

  const handleAddDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher) {
      showToast("Access Denied: Only teachers/faculty can add placement drives.", "error");
      return;
    }
    if (!newCompany.trim() || !newRole.trim()) {
      showToast("Please provide company name and job role.", "error");
      return;
    }

    const branches = newEligibleBranches.split(",").map((s) => s.trim()).filter(Boolean);
    const skills = newSkills.split(",").map((s) => s.trim()).filter(Boolean);
    const profiles = newJobProfiles.split(",").map((s) => s.trim()).filter(Boolean);

    const createdDrive: PlacementDrive = {
      id: `drive-${Date.now()}`,
      company: newCompany.trim(),
      logo: `https://www.google.com/s2/favicons?domain=${newCompany.toLowerCase().replace(/[^a-z0-9]/g, "")}.com&sz=128`,
      role: newRole.trim(),
      ctc: newCtc.trim() || "₹2.42 LPA",
      location: newLocation.trim() || "Ludhiana Plant, Punjab",
      minPercentage: Number(newMinPercentage) || 55,
      eligibleBranches: branches.length ? branches : ["BCA", "BBA"],
      selectionRounds: ["Registration & Profile Screening", "Written / Technical Assessment", "HR & Plant Technical Interview"],
      deadline: newDeadline || "2026-10-25",
      description: newDescription.trim() || `On-campus recruitment drive by ${newCompany.trim()} for ${newBatch}.`,
      openings: 30,
      skills: skills.length ? skills : ["Aptitude", "Technical Basics"],
      featured: true,
      batch: newBatch.trim() || "2025 & 2026 Batch",
      jobProfiles: profiles.length ? profiles : [newRole.trim()],
      spoc: newSpoc.trim() || "CRC Desk",
      registrationLink: newRegistrationLink.trim() || "https://forms.gle/X4a7zFPQfQMH1Noi7",
      jobType: newJobType || "Full Time",
      driveDate: newDriveDate.trim() || "14th Oct, 2026",
      officialInvitation: newOfficialInvitation.trim() || `Dear TPCs, Gulzar Group of Institutes takes this opportunity to invite eligible students for ${newCompany.trim()} placement drive.`
    };

    const next = [createdDrive, ...drives];
    saveDrives(next);
    showToast(`Placement Drive for ${createdDrive.company} (${createdDrive.role}) published successfully!`, "success");

    // Reset Form
    setNewCompany("");
    setNewRole("");
    setNewDescription("");
    setNewOfficialInvitation("");
    setAddDriveModalOpen(false);
  };

  const handleDeleteDrive = (id: string, compName: string) => {
    if (!isTeacher) {
      showToast("Access Denied: Only teachers/faculty can remove placement drives.", "error");
      return;
    }
    const next = drives.filter((d) => d.id !== id);
    saveDrives(next);
    showToast(`Placement drive for ${compName} removed from campus portal.`, "info");
  };

  const [applications, setApplications] = useState<PlacementApplication[]>(INITIAL_APPLICATIONS);
  const [activeTab, setActiveTab] = useState<"drives" | "applications" | "resume">("drives");
  const [search, setSearch] = useState("");
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState(true);
  const [resumeFileName, setResumeFileName] = useState("Rajveer_Singh_Resume_BCA.pdf");
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("All");

  // Registration & Domain Preference Form state (User Requirement #3)
  const [isRegistered, setIsRegistered] = useState(true);
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [careerTrack, setCareerTrack] = useState<"Tech" | "Non-Tech">("Tech");
  const [domainField, setDomainField] = useState("Full Stack Web Development");
  const [preferredRole, setPreferredRole] = useState("Software Development Engineer (SDE-1)");
  const [techStack, setTechStack] = useState("React.js, TypeScript, Node.js, Python, MySQL, Git");
  const [githubUrl, setGithubUrl] = useState("https://github.com/rajveer-singh");
  const [targetCtc, setTargetCtc] = useState("₹8.0 LPA – ₹18.0 LPA");

  // Student profile mock: Rajveer Singh has 78% aggregate (BCA)
  const studentPercentage = 78;

  const handleApply = (drive: PlacementDrive) => {
    if (!isRegistered) {
      showToast("Please complete your Placement Registration & Domain Selection first!", "error");
      setRegModalOpen(true);
      return;
    }

    // Check if already applied
    if (applications.some((a) => a.driveId === drive.id)) {
      showToast(`You have already applied for ${drive.company}. Check Application Tracker!`, "info");
      return;
    }

    if (studentPercentage < drive.minPercentage) {
      showToast(`Eligibility requirement not met (Requires ${drive.minPercentage}%, your aggregate is ${studentPercentage}%).`, "error");
      return;
    }

    const newApp: PlacementApplication = {
      id: `app-${Date.now()}`,
      driveId: drive.id,
      company: drive.company,
      role: drive.role,
      appliedDate: "2026-10-14",
      status: "Applied",
      resumeName: resumeFileName,
      feedback: `Candidate registered for ${careerTrack} (${domainField}). Application submitted successfully to Corporate Relations Cell.`
    };

    setApplications([newApp, ...applications]);
    showToast(`1-Click Applied to ${drive.company} (${drive.role}) under ${careerTrack} (${domainField})!`, "success");
    setSelectedDrive(null);
  };

  const handleSaveRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    setRegModalOpen(false);
    showToast(`Placement registration saved! Registered as ${careerTrack} Specialist (${domainField}).`, "success");
  };

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.role.toLowerCase().includes(search.toLowerCase()) ||
      d.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Placement Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="text-indigo-600 dark:text-indigo-400" size={24} />
            Placement & Corporate Relations Cell
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Exclusive campus recruitment drives, 1-click eligibility check, ATS resume parsing and drive status tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isTeacher && (
            <button
              onClick={() => setAddDriveModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-3.5 py-2 text-xs shadow-md transition shrink-0"
            >
              <Plus size={15} />
              <span>➕ Add Placement Company / Drive (CRC Desk)</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("drives")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === "drives"
                  ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Open Drives ({drives.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === "applications"
                  ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              My Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === "resume"
                  ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              ATS Resume Vault
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Placement Registration & Domain Selection Card (User Requirement #3) */}
      <div className={`${card} p-4 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border-indigo-200 dark:border-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
            <Cpu size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Campus Drive Specialization Profile: {careerTrack} ({domainField})
              </h3>
              <Pill tone={isRegistered ? "green" : "amber"}>
                {isRegistered ? "Verified Candidate" : "Registration Required"}
              </Pill>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Registered Role: <b>{preferredRole}</b> • Target Bracket: <b>{targetCtc}</b> • Skills: {techStack}
            </p>
          </div>
        </div>

        <button
          onClick={() => setRegModalOpen(true)}
          className={`${primary} text-xs !py-2 shrink-0`}
        >
          <Settings size={14} /> Edit Career Domain & Track
        </button>
      </div>

      {/* Placement Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${card} p-4 flex items-center gap-3.5`}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Companies</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {drives.length} Drives <span className="text-xs font-normal text-slate-400">(6 eligible)</span>
            </p>
          </div>
        </div>

        <div className={`${card} p-4 flex items-center gap-3.5`}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Highest Package Offered</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹18.0 LPA <span className="text-xs font-normal text-slate-400">(Google SDE)</span>
            </p>
          </div>
        </div>

        <div className={`${card} p-4 flex items-center gap-3.5`}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <FileCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Applications Submitted</p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
              {applications.length} Drives <span className="text-xs font-normal text-slate-400">(1 shortlisted)</span>
            </p>
          </div>
        </div>

        <div className={`${card} p-4 flex items-center gap-3.5`}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Your Student Aggregate</p>
            <p className="text-xl font-bold text-sky-700 dark:text-sky-300">
              {studentPercentage}% <span className="text-xs font-normal text-emerald-600 font-semibold">(Eligible for all)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tab 1: Active Drives */}
      {activeTab === "drives" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search companies, technical roles, or skills (e.g. Vardhman, Alpha IT, Wipronix)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            {isTeacher && (
              <button
                onClick={() => setAddDriveModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2.5 text-xs shadow-sm transition shrink-0"
              >
                <Plus size={14} />
                <span>Add Recruiting Company</span>
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDrives.map((drive) => {
              const hasApplied = applications.some((a) => a.driveId === drive.id);
              const isEligible = studentPercentage >= drive.minPercentage;

              return (
                <div
                  key={drive.id}
                  className={`${card} p-5 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md border border-slate-200 dark:border-slate-800 relative overflow-hidden`}
                >
                  {drive.featured && (
                    <div className="absolute -right-12 top-5 rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 px-12 py-0.5 text-[9px] font-bold text-white shadow-sm uppercase tracking-wider">
                      Featured
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3 pr-6">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                          {drive.company}
                        </h4>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {drive.role}
                        </p>
                      </div>
                      <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {drive.ctc}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {drive.location}
                      </span>
                      <span>•</span>
                      {drive.batch && (
                        <>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            Batch: {drive.batch}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {drive.driveDate ? drive.driveDate : `Deadline: ${drive.deadline}`}
                      </span>
                    </div>

                    {drive.jobProfiles && drive.jobProfiles.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Plant Job Profiles:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {drive.jobProfiles.map((jp) => (
                            <span
                              key={jp}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 text-[11px]"
                            >
                              • {jp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {drive.description}
                    </p>

                    {drive.spoc && (
                      <div className="text-[11px] text-slate-500">
                        Institutional SPOC: <span className="font-bold text-slate-700 dark:text-slate-300">{drive.spoc}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Key Skills Evaluated:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {drive.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-slate-400">Min. Criteria:</span>{" "}
                      <span className={isEligible ? "font-bold text-emerald-600" : "font-bold text-red-500"}>
                        {drive.minPercentage}% Aggregate
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {drive.registrationLink && (
                        <a
                          href={drive.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 px-2.5 py-1.5 text-xs font-bold hover:bg-purple-100 transition flex items-center gap-1"
                        >
                          Google Form <ExternalLink size={12} />
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedDrive(drive)}
                        className={`${ghost} !py-1.5 !px-2.5 text-xs`}
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleApply(drive)}
                        disabled={hasApplied || !isEligible}
                        className={`${primary} !py-1.5 !px-3 text-xs disabled:opacity-50`}
                      >
                        {hasApplied ? "Applied ✓" : "1-Click Apply"}
                      </button>

                      {isTeacher && (
                        <button
                          onClick={() => handleDeleteDrive(drive.id, drive.company)}
                          title={`Delete drive for ${drive.company}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Applications Tracker */}
      {activeTab === "applications" && (
        <div className={`${card} p-5 space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Your Placement Applications Status Tracker
            </h3>
            <span className="text-xs text-slate-500">
              Updated by Corporate Relations Cell (CRC)
            </span>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {app.company}
                    </h4>
                    <span className="text-slate-500">•</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{app.role}</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Applied on: {app.appliedDate} • Attached Resume: <span className="font-mono text-indigo-600">{app.resumeName}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 italic mt-1 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    CRC Feedback: "{app.feedback}"
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Pill tone={app.status === "Shortlisted" ? "green" : app.status === "Interview Scheduled" ? "indigo" : "amber"}>
                    {app.status}
                  </Pill>
                  <button
                    onClick={() => setResumeModalOpen(true)}
                    className={`${ghost} !py-1 !px-2 text-xs`}
                  >
                    View Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: ATS Resume Vault */}
      {activeTab === "resume" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className={`${card} p-5 space-y-4`}>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Primary Institutional Placement Resume
            </h3>
            <p className="text-xs text-slate-500">
              This verified resume PDF is automatically transmitted when you use 1-Click Apply for on-campus drives.
            </p>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-indigo-600" size={24} />
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{resumeFileName}</p>
                  <p className="text-[11px] text-slate-500">ATS Score: 94/100 • Updated Oct 12, 2026</p>
                </div>
              </div>
              <button
                onClick={() => setResumeModalOpen(true)}
                className={`${primary} !py-1.5 !px-3 text-xs`}
              >
                Preview PDF
              </button>
            </div>
          </div>

          <div className={`${card} p-5 space-y-4`}>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Upload Updated Version
            </h3>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2">
              <UploadCloud size={28} className="mx-auto text-indigo-600" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Drag and drop your updated PDF resume
              </p>
              <p className="text-[10px] text-slate-400">PDF documents only (Max 5MB)</p>
              <button
                onClick={() => showToast("Resume updated to Rajveer_Singh_Resume_v2.pdf!", "success")}
                className={`${ghost} text-xs mt-2`}
              >
                Select New File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Career Track & Domain Registration Modal (User Requirement #3) */}
      {regModalOpen && (
        <Modal
          isOpen={regModalOpen}
          title="Placement Registration & Career Specialization Form"
          onClose={() => setRegModalOpen(false)}
        >
          <form onSubmit={handleSaveRegistration} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                1. Select Primary Career Track:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCareerTrack("Tech")}
                  className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${
                    careerTrack === "Tech"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-600"
                  }`}
                >
                  <Code2 size={16} /> Tech Track (Software & Cloud)
                </button>
                <button
                  type="button"
                  onClick={() => setCareerTrack("Non-Tech")}
                  className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${
                    careerTrack === "Non-Tech"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-600"
                  }`}
                >
                  <Briefcase size={16} /> Non-Tech Track (Analyst/Operations)
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                2. Choose Domain Specialization Field:
              </label>
              {careerTrack === "Tech" ? (
                <select
                  value={domainField}
                  onChange={(e) => setDomainField(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="Full Stack Web Development">Full Stack Web Development (React, Node, TypeScript)</option>
                  <option value="AI & Machine Learning">AI & Machine Learning (Python, PyTorch, GenAI)</option>
                  <option value="Cloud & DevOps Engineering">Cloud & DevOps Engineering (AWS, Docker, K8s)</option>
                  <option value="Cyber Security & Forensics">Cyber Security & Forensics</option>
                  <option value="Data Science & Big Data Analytics">Data Science & Big Data Analytics</option>
                  <option value="Mobile App Development">Mobile App Development (Flutter, React Native)</option>
                </select>
              ) : (
                <select
                  value={domainField}
                  onChange={(e) => setDomainField(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                >
                  <option value="Product Management">Product Management & Associate PM</option>
                  <option value="Business Analytics & BI">Business Analytics & BI (SQL, Tableau, Excel)</option>
                  <option value="HR & Talent Acquisition">HR & Talent Acquisition</option>
                  <option value="Digital Marketing & Growth">Digital Marketing & Growth Strategy</option>
                </select>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                3. Preferred Designation / Role Title:
              </label>
              <input
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target CTC Bracket:
                </label>
                <input
                  value={targetCtc}
                  onChange={(e) => setTargetCtc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  GitHub / Portfolio Link:
                </label>
                <input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Core Technologies & Tools:
              </label>
              <input
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRegModalOpen(false)}
                className={ghost}
              >
                Cancel
              </button>
              <button type="submit" className={primary}>
                Save & Unlock 1-Click Drives
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Drive Details Modal */}
      {selectedDrive && (
        <Modal
          isOpen={!!selectedDrive}
          title={`${selectedDrive.company} — Drive Specifications`}
          onClose={() => setSelectedDrive(null)}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="font-bold text-base text-slate-900 dark:text-slate-100 block">{selectedDrive.role}</span>
                <span className="text-indigo-600 font-semibold">{selectedDrive.location}</span>
              </div>
              <span className="text-base font-extrabold text-emerald-600">{selectedDrive.ctc}</span>
            </div>

            {selectedDrive.officialInvitation && (
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                  Official Invitation Circular (Training & Placement Cell):
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                  {selectedDrive.officialInvitation}
                </p>
              </div>
            )}

            {selectedDrive.jobProfiles && selectedDrive.jobProfiles.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Designated Plant Job Profiles:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDrive.jobProfiles.map((jp) => (
                    <span
                      key={jp}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200"
                    >
                      ✓ {jp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligible Batch:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedDrive.batch || "2025, 2026 & 2027 Batches"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">SPOC / Coordinator:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedDrive.spoc || "CRC Cell (GGI Khanna)"}
                </span>
              </div>
            </div>

            {selectedDrive.registrationLink && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-900 dark:text-purple-200 block">
                    Official Google Form Link:
                  </span>
                  <span className="text-[11px] text-purple-700 dark:text-purple-400 font-mono break-all">
                    {selectedDrive.registrationLink}
                  </span>
                </div>
                <a
                  href={selectedDrive.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${primary} shrink-0 !py-1.5 !px-3 text-xs flex items-center gap-1.5`}
                >
                  Open Form <ExternalLink size={13} />
                </a>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedDrive(null)} className={ghost}>
                Close
              </button>
              <button onClick={() => handleApply(selectedDrive)} className={primary}>
                Submit 1-Click Application
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Resume Preview Modal */}
      {resumeModalOpen && (
        <Modal
          isOpen={resumeModalOpen}
          title="Resume Preview — PDF Viewer"
          onClose={() => setResumeModalOpen(false)}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-slate-800 dark:text-slate-200 space-y-4 font-sans text-xs shadow-inner">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold">RAJVEER SINGH</h3>
                <p className="text-slate-500">BCA 3rd Year • Gulzar Group of Institutes, Khanna</p>
                <p className="text-slate-500">Email: rajveer.singh@smartcampus.demo • Phone: +91 98765-43210</p>
              </div>

              <div>
                <h4 className="font-bold text-indigo-600 uppercase text-[11px]">Academic Qualifications</h4>
                <p className="mt-1">Bachelor of Computer Applications (2024–2027) • Aggregate: 78.4% (First Class with Distinction)</p>
              </div>

              <div>
                <h4 className="font-bold text-indigo-600 uppercase text-[11px]">Technical Skills</h4>
                <p className="mt-1">Languages: TypeScript, JavaScript, Python, PHP, C++</p>
                <p>Frameworks & Tools: React.js, Next.js, Tailwind CSS, MySQL, Git, Docker, AWS S3</p>
              </div>

              <div>
                <h4 className="font-bold text-indigo-600 uppercase text-[11px]">Featured Projects</h4>
                <p className="font-semibold mt-1">SmartCampus ERP & Academic Attendance Portal</p>
                <p className="text-slate-500">Full-stack campus portal with dynamic anti-spoofing QR tickets, attendance calculation, and placement tracker.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setResumeModalOpen(false)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Placement Drive / Company Modal (CRC Faculty Desk Exclusive) */}
      {addDriveModalOpen && (
        <Modal
          isOpen={addDriveModalOpen}
          title="➕ Add New Placement Drive / Recruiting Company (CRC Faculty Desk)"
          onClose={() => setAddDriveModalOpen(false)}
        >
          <form onSubmit={handleAddDrive} className="space-y-4">
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 p-3 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <Briefcase size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>
                <b>Faculty / CRC Desk Authority:</b> Published placement drives will immediately appear in the student portal for eligibility checking, 1-click apply, and official Google Form registrations.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Vardhman Special Steels Limited"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Core Technical Trainee (CFD / UT / NDT)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Offered CTC / Salary Package
                </label>
                <input
                  type="text"
                  value={newCtc}
                  onChange={(e) => setNewCtc(e.target.value)}
                  placeholder="e.g. ₹2.42 LPA or ₹4.50 LPA"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job / Plant Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Ludhiana Plant / Kohara Plant, Punjab"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Eligible Batches
                </label>
                <input
                  type="text"
                  value={newBatch}
                  onChange={(e) => setNewBatch(e.target.value)}
                  placeholder="e.g. 2025 & 2026 Batch"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Eligible Qualifications / Branches (comma-separated)
                </label>
                <input
                  type="text"
                  value={newEligibleBranches}
                  onChange={(e) => setNewEligibleBranches(e.target.value)}
                  placeholder="e.g. BBA, BCA, B.Tech CSE/IT"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Minimum Aggregate Percentage (%)
                </label>
                <input
                  type="number"
                  min={35}
                  max={100}
                  value={newMinPercentage}
                  onChange={(e) => setNewMinPercentage(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional SPOC Coordinator
                </label>
                <input
                  type="text"
                  value={newSpoc}
                  onChange={(e) => setNewSpoc(e.target.value)}
                  placeholder="e.g. CRC Desk / Prof. Jatinder Verma"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Drive Date / Schedule
                </label>
                <input
                  type="text"
                  value={newDriveDate}
                  onChange={(e) => setNewDriveDate(e.target.value)}
                  placeholder="e.g. 14th Oct, 2026 || 10:00 am"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Application Deadline Date
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Google Form Registration Link
              </label>
              <input
                type="url"
                value={newRegistrationLink}
                onChange={(e) => setNewRegistrationLink(e.target.value)}
                placeholder="https://forms.gle/X4a7zFPQfQMH1Noi7"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono text-purple-700 dark:text-purple-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specific Plant Profiles / Tracks (comma-separated)
              </label>
              <input
                type="text"
                value={newJobProfiles}
                onChange={(e) => setNewJobProfiles(e.target.value)}
                placeholder="CFD (Ludhiana Plant), UT Testing (Ludhiana Plant), NDT (Kohara Plant)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Key Skills Evaluated (comma-separated)
              </label>
              <input
                type="text"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                placeholder="Technical Aptitude, Testing, Quality Control, Communication"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Description & Drive Details
              </label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Vardhman Special Steels Limited is India's leading producer of special and alloy steels. Looking for proactive candidates..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setAddDriveModalOpen(false)} className={ghost}>
                Cancel
              </button>
              <button type="submit" className={primary}>
                <span>Publish Placement Drive (CRC)</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
