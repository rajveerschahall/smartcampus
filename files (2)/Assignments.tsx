import React, { useState, useEffect } from "react";
import { INITIAL_ASSIGNMENTS, Assignment, SUBJECTS } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";
import { FileText, Clock, UploadCloud, CheckCircle2, AlertCircle, FileCheck, ExternalLink, Calendar } from "lucide-react";

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [filter, setFilter] = useState<"all" | "pending" | "submitted">("pending");
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
  const [fileName, setFileName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModal) return;

    setAssignments(prev =>
      prev.map(a =>
        a.id === submitModal.id
          ? {
              ...a,
              submitted: true,
              submittedAt: "Just now",
              remarks: "Submitted successfully. Awaiting faculty evaluation."
            }
          : a
      )
    );

    showToast(`Assignment "${submitModal.title.split("—")[0]}" submitted successfully!`, "success");
    setSubmitModal(null);
    setFileName("");
    setGithubUrl("");
    setNotes("");
  };

  const filtered = assignments.filter(a => {
    if (filter === "pending") return !a.submitted;
    if (filter === "submitted") return a.submitted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={22} />
            Academic Assignment Portal
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Submit coursework, track deadline countdowns and view faculty evaluation feedback.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filter === "pending" ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"}`}
          >
            Pending ({assignments.filter(a => !a.submitted).length})
          </button>
          <button
            onClick={() => setFilter("submitted")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filter === "submitted" ? "bg-white dark:bg-slate-900 shadow-sm text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"}`}
          >
            Submitted ({assignments.filter(a => a.submitted).length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filter === "all" ? "bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}
          >
            All ({assignments.length})
          </button>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(a => {
          const leftMs = a.due - now;
          const hoursLeft = Math.max(0, Math.floor(leftMs / (1000 * 60 * 60)));
          const daysLeft = Math.floor(hoursLeft / 24);
          const isOverdue = leftMs <= 0 && !a.submitted;

          return (
            <article key={a.id} className={`${card} p-5 flex flex-col justify-between group`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {a.code}
                  </span>
                  {a.submitted ? (
                    <Pill tone="green">Submitted</Pill>
                  ) : isOverdue ? (
                    <Pill tone="red">Overdue</Pill>
                  ) : hoursLeft < 24 ? (
                    <Pill tone="red">{hoursLeft}h remaining</Pill>
                  ) : (
                    <Pill tone="amber">{daysLeft}d remaining</Pill>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1.5 group-hover:text-indigo-600 transition-colors">
                  {a.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  {SUBJECTS[a.code] || a.code} • Max {a.totalMarks} Marks
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                  {a.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    Due: {new Date(a.due).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {a.grade && (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Grade: {a.grade}
                    </span>
                  )}
                </div>

                {a.submitted ? (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                    <button 
                      onClick={() => setSelectedAsg(a)}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View Details & Remarks
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSubmitModal(a)}
                    className={`${primary} w-full !py-1.5 text-xs mt-1`}
                  >
                    <UploadCloud size={14} /> Submit Assignment
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Submission Dialog Modal */}
      {submitModal && (
        <Modal
          isOpen={true}
          onClose={() => setSubmitModal(null)}
          title={`Submit: ${submitModal.title}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-2">{submitModal.description}</p>
              <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 text-xs text-indigo-800 dark:text-indigo-300">
                Course: <b>{SUBJECTS[submitModal.code]} ({submitModal.code})</b> • Max Marks: <b>{submitModal.totalMarks}</b>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Upload Document (PDF, ZIP, DOCX)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                <UploadCloud className="mx-auto text-slate-400 mb-1" size={26} />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {fileName || "Drag and drop your file or click to browse"}
                </p>
                <input
                  type="file"
                  onChange={e => setFileName(e.target.files?.[0]?.name || "CaseStudy_Solution.pdf")}
                  className="mt-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Repository / Live Demo URL (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/rajveer/smartcampus-project"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Notes to Faculty (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Added architectural trade-off diagrams on page 4..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setSubmitModal(null)} className={ghost}>
                Cancel
              </button>
              <button type="submit" className={primary}>
                Confirm & Submit
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assignment Details / Feedback Modal */}
      {selectedAsg && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAsg(null)}
          title={selectedAsg.title}
        >
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
              <span className="font-semibold text-emerald-800 dark:text-emerald-200 block">Status: Submitted & Evaluated</span>
              <span className="text-emerald-700 dark:text-emerald-300">Submitted {selectedAsg.submittedAt}</span>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Assignment Brief</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{selectedAsg.description}</p>
            </div>

            {selectedAsg.grade && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500">Score Awarded</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{selectedAsg.grade}</span>
                </div>
                {selectedAsg.remarks && (
                  <div>
                    <span className="text-xs text-slate-400 block mt-2">Faculty Evaluation Remarks:</span>
                    <p className="text-xs text-slate-700 dark:text-slate-200 italic mt-0.5">"{selectedAsg.remarks}"</p>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setSelectedAsg(null)} className={`${primary} w-full`}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
