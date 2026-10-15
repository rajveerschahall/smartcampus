import React, { useState, useEffect } from "react";
import {
  Bell,
  Megaphone,
  Pin,
  Calendar,
  User,
  ExternalLink,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Trash2,
  Sparkles,
  Share2,
  FileText,
  Briefcase,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Send
} from "lucide-react";
import { DigitalNotice, INITIAL_DIGITAL_NOTICES, NoticeCategory, NoticePriority, User as UserModel } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";

const STORAGE_KEY = "ggi_campus_digital_notices";

export default function DigitalBoard({
  user,
  onNav
}: {
  user?: UserModel | null;
  onNav?: (p: string) => void;
}) {
  const isFacultyOrAdmin = user?.role === "Faculty" || user?.role === "Admin";

  const [notices, setNotices] = useState<DigitalNotice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error(err);
    }
    return INITIAL_DIGITAL_NOTICES;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNotice, setActiveNotice] = useState<DigitalNotice | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form State for Faculty to post notice
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<NoticeCategory>("Academic");
  const [newPriority, setNewPriority] = useState<NoticePriority>("High");
  const [newAudience, setNewAudience] = useState("All Students & Batches");
  const [newAuthor, setNewAuthor] = useState(user?.name || "MS. NAVJOT (Assistant Professor)");
  const [newContent, setNewContent] = useState("");
  const [newAttachmentLink, setNewAttachmentLink] = useState("");
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newPin, setNewPin] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveNotices = (updated: DigitalNotice[]) => {
    setNotices(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFacultyOrAdmin) {
      showToast("Access Denied: Only Faculty and Admin members are authorized to post institutional notices.", "error");
      setCreateModalOpen(false);
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      showToast("Please provide both title and notice announcement body.", "error");
      return;
    }

    const created: DigitalNotice = {
      id: `notice-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      authorRole: user?.role === "Faculty" ? "Faculty Coordinator" : user?.role === "Admin" ? "Office of the Registrar" : "Department Lead",
      category: newCategory,
      priority: newPriority,
      postedDate: `Today, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`,
      targetAudience: newAudience.trim(),
      circularNo: `GGI/CIRCULAR/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      pinned: newPin,
      content: newContent.trim(),
      attachmentLink: newAttachmentLink.trim() || undefined,
      attachmentName: newAttachmentName.trim() || (newAttachmentLink ? "Official_Attachment_Link" : undefined)
    };

    const next = [created, ...notices];
    saveNotices(next);
    showToast(`Notice broadcasted successfully to all students on the Digital Board!`, "success");
    setCreateModalOpen(false);

    // Reset form
    setNewTitle("");
    setNewContent("");
    setNewAttachmentLink("");
    setNewAttachmentName("");
  };

  const handleDeleteNotice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFacultyOrAdmin) {
      showToast("Access Denied: Only Faculty/Admin can delete circulars.", "error");
      return;
    }
    const filtered = notices.filter((n) => n.id !== id);
    saveNotices(filtered);
    showToast("Notice removed from Digital Board.", "info");
    if (activeNotice?.id === id) setActiveNotice(null);
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFacultyOrAdmin) {
      showToast("Access Denied: Only faculty can pin/unpin circulars.", "info");
      return;
    }
    const updated = notices.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    saveNotices(updated);
    showToast("Notice pin state updated.", "info");
  };

  const filteredNotices = notices.filter((n) => {
    const matchCat = selectedCategory === "All" || n.category === selectedCategory || (selectedCategory === "Pinned" && n.pinned);
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = ["All", "Pinned", "Placement", "Exam", "Hackathon", "Academic", "Holiday"];

  const getCategoryIcon = (cat: NoticeCategory) => {
    switch (cat) {
      case "Placement":
        return <Briefcase size={14} className="text-purple-600" />;
      case "Exam":
        return <FileText size={14} className="text-amber-600" />;
      case "Hackathon":
        return <Trophy size={14} className="text-indigo-600" />;
      case "Academic":
        return <GraduationCap size={14} className="text-emerald-600" />;
      default:
        return <Megaphone size={14} className="text-slate-600" />;
    }
  };

  const getPriorityPill = (p: NoticePriority) => {
    switch (p) {
      case "Urgent":
        return <Pill tone="red">🔴 Urgent Alert</Pill>;
      case "High":
        return <Pill tone="amber">⚠️ Important</Pill>;
      default:
        return <Pill tone="indigo">ℹ️ Circular</Pill>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Electronic Digital Board Header Display */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-2xl border border-slate-800">
        {/* Glow backdrop grid */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-950/80 px-3 py-1 text-xs font-bold text-red-400 border border-red-700/60 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              LIVE GGI DIGITAL NOTICE BOARD
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Institutional Digital Display & Circulars
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time authoritative notices published by Faculty, Training & Placement Cell (CRC), Dean Academics, and Controller of Examinations for all enrolled students.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Live Clock Terminal */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 px-4 shadow-inner text-left font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={11} className="text-emerald-400 animate-pulse" /> Official Campus Time
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {currentTime.toLocaleTimeString("en-IN", { hour12: true })}
              </div>
              <div className="text-[10px] text-slate-400">
                {currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>

            {/* Post Notice Action (Restricted strictly to Faculty and Admin) */}
            {isFacultyOrAdmin ? (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all transform active:scale-95"
              >
                <Plus size={16} />
                <span>✍️ Post New Notice (Faculty Desk)</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-xs font-semibold text-slate-300 shadow">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Official Notice Board (Student View Only)</span>
              </div>
            )}
          </div>
        </div>

        {/* Urgent Live Ticker Bar */}
        <div className="mt-6 rounded-xl bg-slate-900/70 border border-slate-800/80 p-2.5 px-3 flex items-center gap-3 text-xs overflow-hidden">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
            <Megaphone size={12} /> Flash Update:
          </span>
          <div className="truncate text-slate-300">
            {notices.find((n) => n.pinned)?.title || "Check official notices below for placement drives and MST examinations."}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === c
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {c === "Pinned" ? "📌 Pinned Alerts" : c}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars, faculty, batch..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredNotices.length === 0 ? (
          <div className={`${card} p-12 text-center col-span-2 space-y-3`}>
            <Bell size={36} className="mx-auto text-slate-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No matching circulars found</h3>
            <p className="text-xs text-slate-500">Try modifying your search or select "All" categories.</p>
            <button onClick={() => setSelectedCategory("All")} className={ghost}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredNotices.map((n) => {
            const isPinned = n.pinned;
            return (
              <article
                key={n.id}
                onClick={() => setActiveNotice(n)}
                className={`${card} p-5 flex flex-col justify-between cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md relative overflow-hidden group`}
              >
                {isPinned && (
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                    <div className="absolute transform rotate-45 bg-indigo-600 text-white font-bold text-[9px] py-0.5 right-[-35px] top-[14px] w-[120px] text-center shadow-xs">
                      PINNED
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {getCategoryIcon(n.category)}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {n.category}
                      </span>
                    </div>
                    {getPriorityPill(n.priority)}
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {n.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {n.content}
                  </p>

                  {/* Target Audience Pill */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-slate-400 font-medium">Eligible / Audience:</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-100 dark:border-indigo-900/40">
                      {n.targetAudience}
                    </span>
                  </div>

                  {/* Direct Link Tag if Google Form exists */}
                  {n.attachmentLink && (
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] flex items-center justify-between">
                      <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        Direct Registration Link Available
                      </span>
                      <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-1">
                        Open <ExternalLink size={11} />
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {n.author[0]}
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{n.author}</span>
                      <span className="text-[10px] text-slate-400">{n.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isFacultyOrAdmin && (
                      <button
                        onClick={(e) => handleTogglePin(n.id, e)}
                        title={n.pinned ? "Unpin notice" : "Pin notice"}
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Pin size={14} className={n.pinned ? "text-indigo-600 fill-indigo-600" : ""} />
                      </button>
                    )}
                    {isFacultyOrAdmin && (
                      <button
                        onClick={(e) => handleDeleteNotice(n.id, e)}
                        title="Delete Notice"
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Notice Detail Modal */}
      {activeNotice && (
        <Modal
          isOpen={!!activeNotice}
          title={activeNotice.category + " Circular"}
          onClose={() => setActiveNotice(null)}
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {getPriorityPill(activeNotice.priority)}
                <span className="font-mono text-slate-400 text-[11px]">
                  Ref: {activeNotice.circularNo || "GGI/CIRCULAR/2026/OFFICIAL"}
                </span>
              </div>
              <span className="text-slate-400">{activeNotice.postedDate}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {activeNotice.title}
              </h3>
              <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issued By:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeNotice.author}</span>
                  <span className="text-slate-500 text-[11px]"> ({activeNotice.authorRole})</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Audience:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{activeNotice.targetAudience}</span>
                </div>
              </div>
            </div>

            {/* Circular Content Body */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300 font-sans text-xs">
              {activeNotice.content}
            </div>

            {/* Action Buttons & Google Form Links */}
            {activeNotice.attachmentLink && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                    Official Registration Portal / Form:
                  </span>
                  <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-mono break-all">
                    {activeNotice.attachmentLink}
                  </span>
                </div>
                <a
                  href={activeNotice.attachmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${primary} shrink-0 !py-2 !px-3 text-xs flex items-center gap-1.5`}
                >
                  Open Official Link <ExternalLink size={13} />
                </a>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  window.print();
                }}
                className={`${ghost} text-xs flex items-center gap-1.5`}
              >
                <Printer size={14} /> Print Circular
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast("Notice link copied to clipboard!", "success");
                }}
                className={`${ghost} text-xs flex items-center gap-1.5`}
              >
                <Share2 size={14} /> Share Notice
              </button>

              <button onClick={() => setActiveNotice(null)} className={primary}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Faculty Modal: Post New Notice */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          title="Broadcast Circular to Digital Notice Board"
          onClose={() => setCreateModalOpen(false)}
        >
          <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
              <Sparkles size={16} className="shrink-0" />
              <span>
                Notices posted here are immediately visible to all students on the live Digital Notice Board.
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Circular Title / Subject *
              </label>
              <input
                required
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Urgent: Campus Placement Drive by Vardhman Special Steels Limited"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as NoticeCategory)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                >
                  <option value="Placement">💼 Placement & CRC</option>
                  <option value="Exam">📝 Exam & MST</option>
                  <option value="Hackathon">🏆 Hackathon & Events</option>
                  <option value="Academic">🎓 Academic Affairs</option>
                  <option value="Holiday">🎉 Holiday & Festival</option>
                  <option value="Administrative">🏛️ Administrative</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as NoticePriority)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                >
                  <option value="Urgent">🔴 Urgent Alert</option>
                  <option value="High">⚠️ Important</option>
                  <option value="Normal">ℹ️ Normal Circular</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Target Audience</label>
                <input
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  placeholder="e.g. BBA & BCA-2025 & 2026 Batch"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Faculty / Author Name</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. MS. NAVJOT / CRC SPOC"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Official Notice Details / Message *
              </label>
              <textarea
                required
                rows={5}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write full circular instructions, reporting time, eligibility, company CTC, requirements..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Registration / Document Link (Optional)
              </label>
              <input
                type="url"
                value={newAttachmentLink}
                onChange={(e) => setNewAttachmentLink(e.target.value)}
                placeholder="e.g. https://forms.gle/X4a7zFPQfQMH1Noi7"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinNotice"
                checked={newPin}
                onChange={(e) => setNewPin(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <label htmlFor="pinNotice" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Pin this notice to top of Digital Board
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setCreateModalOpen(false)} className={ghost}>
                Cancel
              </button>
              <button type="submit" className={`${primary} flex items-center gap-2`}>
                <Send size={14} /> Broadcast Notice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
