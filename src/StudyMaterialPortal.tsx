import React, { useState } from "react";
import {
  BookOpen,
  Download,
  FileText,
  Filter,
  Search,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Sparkles,
  UserCheck,
  FolderOpen,
  ArrowDownToLine,
  Eye,
  Plus
} from "lucide-react";
import { INITIAL_ERP_MATERIALS, ErpStudyMaterial } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";

export default function StudyMaterialPortal({ isFaculty = false }: { isFaculty?: boolean }) {
  const [materials, setMaterials] = useState<ErpStudyMaterial[]>(INITIAL_ERP_MATERIALS);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [unitFilter, setUnitFilter] = useState("All");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState<ErpStudyMaterial | null>(null);

  // Form states for faculty upload
  const [title, setTitle] = useState("");
  const [subjectCode, setSubjectCode] = useState("UGCA1929");
  const [unit, setUnit] = useState<ErpStudyMaterial["unit"]>("Unit I");
  const [type, setType] = useState<ErpStudyMaterial["type"]>("Notes");
  const [fileName, setFileName] = useState("");

  const handleDownload = (mat: ErpStudyMaterial) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === mat.id ? { ...m, downloadCount: m.downloadCount + 1 } : m))
    );
    showToast(`Downloading "${mat.title}" (${mat.fileSize})...`, "success");
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName) {
      showToast("Please provide a title and select a PDF document.", "error");
      return;
    }

    const subjectMap: Record<string, string> = {
      UGCA1929: "Programming in PHP",
      UGCA1930: "Programming in PHP Laboratory",
      UGCA1931: "Software Engineering",
      UGCA1935: "Data Mining & Data Warehousing",
      UGCA1936: "Cloud Computing",
      "BCA-GEN": "BCA General Scheme"
    };

    const newMat: ErpStudyMaterial = {
      id: `mat-${Date.now()}`,
      title,
      subjectCode,
      subjectName: subjectMap[subjectCode] || "Computer Applications",
      unit,
      type,
      fileSize: "4.2 MB",
      facultyName: "Ms. Navjot Kaur",
      uploadDate: "2026-10-14",
      downloadCount: 0,
      fileUrl: `/docs/${fileName}`
    };

    setMaterials([newMat, ...materials]);
    showToast(`Study material "${title}" synced with College ERP repository!`, "success");
    setUploadModalOpen(false);
    setTitle("");
    setFileName("");
  };

  const filtered = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      m.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      m.facultyName.toLowerCase().includes(search.toLowerCase());
    const matchesSub = subjectFilter === "All" || m.subjectCode === subjectFilter;
    const matchesUnit = unitFilter === "All" || m.unit === unitFilter;
    return matchesSearch && matchesSub && matchesUnit;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
            ERP Study Material & Curricula Repository
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Verified lecture notes, lecture slide decks, official BCA syllabus, and question banks synced directly with GGI ERP.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-md transition self-start sm:self-auto"
        >
          <UploadCloud size={16} />
          Upload New Material (Faculty ERP)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes by topic, unit, or faculty name (e.g. PHP Sessions, Navjot Kaur, Agile)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 font-semibold"
          >
            <option value="All">All Subjects</option>
            <option value="UGCA1929">PHP (UGCA1929)</option>
            <option value="UGCA1930">PHP Lab (UGCA1930)</option>
            <option value="UGCA1931">Software Eng (UGCA1931)</option>
            <option value="UGCA1935">Data Mining (UGCA1935)</option>
            <option value="UGCA1936">Cloud Computing (UGCA1936)</option>
            <option value="BCA-GEN">General Scheme</option>
          </select>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 font-semibold"
          >
            <option value="All">All Units & Types</option>
            <option value="Unit I">Unit I</option>
            <option value="Unit II">Unit II</option>
            <option value="Unit III">Unit III</option>
            <option value="Unit IV">Unit IV</option>
            <option value="Lab Manual">Lab Manuals</option>
            <option value="Question Bank">Question Banks</option>
            <option value="Full Syllabus">Syllabus Handouts</option>
          </select>
        </div>
      </div>

      {/* Materials List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((mat) => (
          <div
            key={mat.id}
            className={`${card} p-5 flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-md border border-slate-200 dark:border-slate-800`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                  {mat.subjectCode} • {mat.unit}
                </span>
                <Pill tone={mat.type === "Notes" ? "indigo" : mat.type === "Slides" ? "purple" : "green"}>
                  {mat.type}
                </Pill>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                  {mat.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{mat.subjectName}</p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Uploaded by:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{mat.facultyName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Date & Size:</span>
                  <span>{mat.uploadDate} • {mat.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{mat.downloadCount} students</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setPreviewModal(mat)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Eye size={14} /> Preview
              </button>
              <button
                onClick={() => handleDownload(mat)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2 text-xs font-bold text-white transition shadow-sm"
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal (Faculty ERP Sync) */}
      {uploadModalOpen && (
        <Modal
          isOpen={uploadModalOpen}
          title="Upload Study Material — GGI ERP Sync"
          onClose={() => setUploadModalOpen(false)}
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Material Title & Topic Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PHP Database Connectivity with PDO & Prepared Statements"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <select
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="UGCA1929">Programming in PHP (UGCA1929)</option>
                  <option value="UGCA1930">Programming in PHP Lab (UGCA1930)</option>
                  <option value="UGCA1931">Software Engineering (UGCA1931)</option>
                  <option value="UGCA1935">Data Mining (UGCA1935)</option>
                  <option value="UGCA1936">Cloud Computing (UGCA1936)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit Tag *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="Unit I">Unit I</option>
                  <option value="Unit II">Unit II</option>
                  <option value="Unit III">Unit III</option>
                  <option value="Unit IV">Unit IV</option>
                  <option value="Lab Manual">Lab Manual</option>
                  <option value="Question Bank">Question Bank</option>
                  <option value="Full Syllabus">Full Syllabus Handout</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Material Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="Notes">Lecture Notes (PDF)</option>
                  <option value="Slides">Presentation Slides (PPT/PDF)</option>
                  <option value="Lab Manual">Lab Exercise Sheet</option>
                  <option value="Question Bank">MST Model Questions</option>
                  <option value="Syllabus">Course Handout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Document (.PDF) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.pptx,.docx"
                  required
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Sync with College ERP
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Preview Modal */}
      {previewModal && (
        <Modal
          isOpen={!!previewModal}
          title={`Document Preview — ${previewModal.subjectCode}`}
          onClose={() => setPreviewModal(null)}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 text-center space-y-3">
              <div className="w-16 h-20 mx-auto rounded-lg bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 grid place-items-center text-red-500 font-bold text-sm">
                PDF
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {previewModal.title}
              </h4>
              <p className="text-xs text-slate-500">
                Uploaded by {previewModal.facultyName} • {previewModal.unit} • {previewModal.fileSize}
              </p>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 text-left border border-slate-100 dark:border-slate-700">
                <p className="font-semibold mb-1 text-slate-800 dark:text-slate-200">Table of Contents / Key Units:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Unit Overview and Behavioral Objectives</li>
                  <li>Core theoretical foundations & real-world architectures</li>
                  <li>Lab practice assignments & code samples</li>
                  <li>Revision questions for Mid-Semester Exam (MST)</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewModal(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(previewModal);
                  setPreviewModal(null);
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Download PDF ({previewModal.fileSize})
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
