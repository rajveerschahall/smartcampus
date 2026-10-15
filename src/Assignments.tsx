import React, { useState, useEffect } from "react";
import { INITIAL_ASSIGNMENTS, Assignment, SUBJECTS } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";
import {
  FileText,
  Clock,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ExternalLink,
  Calendar,
  Eye,
  Download,
  AlertTriangle,
  Sparkles,
  Check
} from "lucide-react";

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [filter, setFilter] = useState<"all" | "pending" | "submitted">("pending");
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
  const [previewPdfModal, setPreviewPdfModal] = useState<Assignment | null>(null);

  // Upload Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const validateAndSetFile = (file: File) => {
    setFileError("");
    // Strict PDF validation
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setFileError("Invalid format! Only official .PDF documents are accepted.");
      showToast("Validation Error: File must be in .pdf format.", "error");
      return false;
    }

    // 10MB Limit
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError("File exceeds 10MB limit! Please compress your PDF before uploading.");
      showToast("Validation Error: PDF exceeds 10MB limit.", "error");
      return false;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModal) return;

    if (!fileName) {
      setFileError("Please attach your assignment PDF before submitting.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    // Simulated multi-stage upload progress
    setTimeout(() => setUploadProgress(45), 250);
    setTimeout(() => setUploadProgress(80), 550);
    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);

      const timestamp = new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === submitModal.id
            ? {
                ...a,
                submitted: true,
                submittedAt: `Today, ${timestamp}`,
                remarks: "Submitted on time. Awaiting faculty evaluation by Ms. Navjot Kaur."
              }
            : a
        )
      );

      showToast(`Assignment "${submitModal.title.split("—")[0]}" submitted successfully!`, "success");
      setSubmitModal(null);
      setSelectedFile(null);
      setFileName("");
      setFileSize("");
      setGithubUrl("");
      setNotes("");
      setUploadProgress(0);
    }, 900);
  };

  const filtered = assignments.filter((a) => {
    if (filter === "pending") return !a.submitted;
    if (filter === "submitted") return a.submitted;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={22} />
            Academic Assignment Portal & PDF Submission
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Strict .PDF format validation (Max 10MB), automated deadline countdown, and instant submission receipt.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filter === "pending"
                ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Pending ({assignments.filter((a) => !a.submitted).length})
          </button>
          <button
            onClick={() => setFilter("submitted")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filter === "submitted"
                ? "bg-white dark:bg-slate-900 shadow-sm text-emerald-700 dark:text-emerald-300"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Submitted ({assignments.filter((a) => a.submitted).length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filter === "all"
                ? "bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            All ({assignments.length})
          </button>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => {
          const leftMs = a.due - now;
          const hoursLeft = Math.max(0, Math.floor(leftMs / (1000 * 60 * 60)));
          const daysLeft = Math.floor(hoursLeft / 24);
          const isOverdue = leftMs <= 0 && !a.submitted;
          const isUrgent = leftMs > 0 && leftMs <= 24 * 3600 * 1000 && !a.submitted;

          return (
            <article
              key={a.id}
              className={`${card} p-5 flex flex-col justify-between group transition hover:shadow-md border ${
                isUrgent ? "border-amber-400 dark:border-amber-700" : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {a.code}
                  </span>
                  {a.submitted ? (
                    <Pill tone="green">Submitted ✓</Pill>
                  ) : isOverdue ? (
                    <Pill tone="red">Overdue</Pill>
                  ) : isUrgent ? (
                    <Pill tone="amber">Due in {hoursLeft}h</Pill>
                  ) : (
                    <Pill tone="indigo">{daysLeft} days left</Pill>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug mb-1">
                  {a.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3">{SUBJECTS[a.code] || a.code}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {a.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar size={13} />
                    Due:{" "}
                    {new Date(a.due).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                  {a.grade && (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Score: {a.grade}
                    </span>
                  )}
                </div>

                {a.submitted ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewPdfModal(a)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Eye size={14} /> View Submitted PDF
                    </button>
                    <button
                      onClick={() => setSelectedAsg(a)}
                      className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    >
                      Feedback
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSubmitModal(a);
                      setFileError("");
                      setFileName("");
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2 text-xs font-bold text-white transition shadow-sm"
                  >
                    <UploadCloud size={15} /> Upload Assignment PDF
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Upload Modal (Strict PDF Drag & Drop with Progress) */}
      {submitModal && (
        <Modal
          isOpen={!!submitModal}
          title={`Upload Submission — ${submitModal.code}`}
          onClose={() => {
            if (!isUploading) setSubmitModal(null);
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {submitModal.title}
              </h4>
              <p className="text-xs text-slate-500">
                Course: {SUBJECTS[submitModal.code] || submitModal.code} • Target: Ms. Navjot Kaur (HOD Dept. of Computer Applications)
              </p>
            </div>

            {/* Drag & Drop Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Upload Solution (.PDF only, Max 10MB) *
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40"
                    : fileName
                    ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40"
                }`}
              >
                <input
                  type="file"
                  id="pdfFileInput"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) validateAndSetFile(file);
                  }}
                />

                {fileName ? (
                  <div className="space-y-2">
                    <div className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                      <FileCheck size={26} />
                    </div>
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{fileName}</p>
                    <p className="text-xs text-slate-500">File size: {fileSize} • Ready to submit</p>
                    <label
                      htmlFor="pdfFileInput"
                      className="inline-block text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline"
                    >
                      Change file
                    </label>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                      <UploadCloud size={26} />
                    </div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      Drag & drop your PDF file here, or{" "}
                      <label htmlFor="pdfFileInput" className="text-indigo-600 dark:text-indigo-400 underline cursor-pointer">
                        browse
                      </label>
                    </p>
                    <p className="text-xs text-slate-400">Strictly .PDF files up to 10MB</p>
                  </div>
                )}
              </div>

              {fileError && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-semibold">
                  <AlertCircle size={14} /> {fileError}
                </p>
              )}
            </div>

            {/* Optional Links & Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Repository / Live Demo Link (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/rajveer/php-session-project"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notes for Faculty (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Attached test case output on page 5 and ER diagram on page 2."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Uploading PDF Document...</span>
                  <span className="text-indigo-600">{uploadProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setSubmitModal(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-md disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Confirm & Submit PDF"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Submitted PDF Preview Modal */}
      {previewPdfModal && (
        <Modal
          isOpen={!!previewPdfModal}
          title={`Submitted Document — ${previewPdfModal.code}`}
          onClose={() => setPreviewPdfModal(null)}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {previewPdfModal.title}
                </h4>
                <p className="text-xs text-slate-500">
                  Submitted: {previewPdfModal.submittedAt} • Student: Rajveer Singh (BCA 3-C)
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <Check size={14} /> Official Receipt
              </span>
            </div>

            {/* PDF Viewer Mockup */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-xs text-slate-400">
                <span>Document: Assignment_Submission_UGCA1929.pdf</span>
                <span>Page 1 of 4 • Verified PDF Signature</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100 font-sans">
                  GULZAR GROUP OF INSTITUTES, KHANNA
                </p>
                <p className="text-slate-500 font-sans">Department of Computer Applications • BCA Semester 5</p>
                <div className="h-0.5 bg-slate-200 dark:bg-slate-800 my-2" />
                <p>/* ------------------------------------------------------------- */</p>
                <p>/* Subject: Programming in PHP Laboratory (UGCA1930)              */</p>
                <p>/* Assignment 3: Session Management & PDO Prepared Statements     */</p>
                <p>/* Student: Rajveer Singh (Roll: 2433613 • Sec C)                 */</p>
                <p>/* ------------------------------------------------------------- */</p>
                <p className="text-slate-500 italic mt-2 font-sans">
                  [Verified Code & Diagram Execution Logs Included in Uploaded Document]
                </p>
              </div>
            </div>

            {previewPdfModal.remarks && (
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                <Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Faculty Evaluation Feedback:</strong>
                  <p className="mt-0.5">{previewPdfModal.remarks}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewPdfModal(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast("Downloading your submitted assignment copy...", "success");
                  setPreviewPdfModal(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                <Download size={14} /> Download Copy
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Feedback Modal */}
      {selectedAsg && (
        <Modal
          isOpen={!!selectedAsg}
          title={selectedAsg.title}
          onClose={() => setSelectedAsg(null)}
        >
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
              <span className="font-semibold text-emerald-800 dark:text-emerald-200 block">
                Status: Submitted & Evaluated
              </span>
              <span className="text-emerald-700 dark:text-emerald-300">
                Submitted on {selectedAsg.submittedAt}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Assignment Brief</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                {selectedAsg.description}
              </p>
            </div>

            {selectedAsg.grade && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500">Score Awarded</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedAsg.grade}
                  </span>
                </div>
                {selectedAsg.remarks && (
                  <div>
                    <span className="text-xs text-slate-400 block mt-2">Faculty Evaluation Remarks:</span>
                    <p className="text-xs text-slate-700 dark:text-slate-200 italic mt-0.5">
                      "{selectedAsg.remarks}"
                    </p>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setSelectedAsg(null)} className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
