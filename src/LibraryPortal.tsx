import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  Clock,
  RotateCcw,
  CheckCircle2,
  Search,
  BookmarkCheck,
  ShieldAlert,
  Info,
  DollarSign,
  ArrowRight,
  Sparkles,
  BookMarked
} from "lucide-react";
import {
  INITIAL_BORROWED_BOOKS,
  LIBRARY_CATALOG,
  BorrowedBook,
  LibraryCatalogBook
} from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";

export default function LibraryPortal() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>(INITIAL_BORROWED_BOOKS);
  const [catalog, setCatalog] = useState<LibraryCatalogBook[]>(LIBRARY_CATALOG);
  const [activeTab, setActiveTab] = useState<"borrowed" | "catalog" | "rules">("borrowed");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [reserveModal, setReserveModal] = useState<LibraryCatalogBook | null>(null);

  // Reference date: Current semester October 14, 2026
  const TODAY = new Date("2026-10-14T12:00:00");

  const getDaysDiff = (dueDateStr: string) => {
    const due = new Date(dueDateStr + "T12:00:00");
    const diffTime = due.getTime() - TODAY.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateFine = (dueDateStr: string, returnedDateStr?: string) => {
    if (returnedDateStr) {
      const due = new Date(dueDateStr + "T12:00:00");
      const ret = new Date(returnedDateStr + "T12:00:00");
      const diffDays = Math.ceil((ret.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays * 5 : 0;
    }
    const daysLeft = getDaysDiff(dueDateStr);
    if (daysLeft < 0) {
      return Math.abs(daysLeft) * 5; // ₹5 per day
    }
    return 0;
  };

  const handleRenew = (bookId: string) => {
    setBorrowedBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        if (b.renewalsLeft <= 0) {
          showToast("Maximum renewal limit (2 times) reached for this book.", "error");
          return b;
        }

        // Add 7 days to current due date safely across timezones
        const currentDue = new Date(b.dueDate + "T12:00:00");
        currentDue.setDate(currentDue.getDate() + 7);
        const y = currentDue.getFullYear();
        const m = String(currentDue.getMonth() + 1).padStart(2, "0");
        const d = String(currentDue.getDate()).padStart(2, "0");
        const newDueDateStr = `${y}-${m}-${d}`;

        showToast(`"${b.title}" renewed successfully! New due date: ${newDueDateStr}. No late fees charged!`, "success");

        return {
          ...b,
          dueDate: newDueDateStr,
          renewalsLeft: b.renewalsLeft - 1
        };
      })
    );
  };

  const handleReturn = (bookId: string) => {
    setBorrowedBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        showToast(`Book "${b.title}" returned to circulation desk. Receipt generated!`, "info");
        return {
          ...b,
          returnedDate: "2026-10-14"
        };
      })
    );
  };

  const handleReserve = (book: LibraryCatalogBook) => {
    if (book.availableCopies <= 0) {
      showToast(`Copy reserved! You will be notified when a copy is returned to ${book.shelf}.`, "info");
    } else {
      showToast(`Hold placed on "${book.title}". Please collect from ${book.shelf} within 24 hours.`, "success");
      setCatalog((prev) =>
        prev.map((c) => (c.id === book.id ? { ...c, availableCopies: c.availableCopies - 1 } : c))
      );
    }
    setReserveModal(null);
  };

  const activeLoans = borrowedBooks.filter((b) => !b.returnedDate);
  const totalFine = activeLoans.reduce((acc, b) => acc + calculateFine(b.dueDate), 0);
  const dueSoonCount = activeLoans.filter((b) => {
    const days = getDaysDiff(b.dueDate);
    return days >= 0 && days <= 3;
  }).length;

  const urgentBook = activeLoans.find((b) => {
    const days = getDaysDiff(b.dueDate);
    return days >= 0 && days <= 2;
  });

  const filteredCatalog = catalog.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
            Digital Library & Fine Prevention Desk
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track issued books, automatic due date alerts, instant 1-click renewals, and avoid overdue penalties.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("borrowed")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "borrowed"
                ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            My Books ({activeLoans.length})
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "catalog"
                ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Browse Catalog
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "rules"
                ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Fine Rules & Policy
          </button>
        </div>
      </div>

      {/* Critical Proactive Fee-Prevention Alert Banner */}
      {urgentBook && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 shadow-sm dark:border-amber-700/60 dark:bg-amber-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-white font-bold shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm">
                    Fee Prevention Alert: Book Return Due in {getDaysDiff(urgentBook.dueDate)} Days!
                  </h4>
                  <span className="rounded-full bg-amber-200/70 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                    Avoid ₹5/day fine
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-amber-900/90 dark:text-amber-300">
                  <strong className="font-semibold">{urgentBook.title}</strong> is due on{" "}
                  <strong>
                    {new Date(urgentBook.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </strong>
                  . Return the book or click "Renew Book" below to extend 7 days for free so no extra fees are charged.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleRenew(urgentBook.id)}
                disabled={urgentBook.renewalsLeft <= 0}
                className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
              >
                1-Click Renew (+7 Days)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${card} p-4 flex items-center gap-3.5`}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <BookMarked size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Borrowed Books</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {activeLoans.length} <span className="text-xs font-normal text-slate-400">/ 4 max quota</span>
            </p>
          </div>
        </div>

        <div className={`${card} p-4 flex items-center gap-3.5`}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Due Within 3 Days</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {dueSoonCount} <span className="text-xs font-normal text-slate-400">action required</span>
            </p>
          </div>
        </div>

        <div className={`${card} p-4 flex items-center gap-3.5`}>
          <div
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
              totalFine === 0
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Current Overdue Penalty</p>
            <p
              className={`text-xl font-bold ${
                totalFine === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              ₹{totalFine}.00
            </p>
          </div>
        </div>

        <div className={`${card} p-4 flex items-center gap-3.5`}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Lifetime On-Time Returns</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              100% <span className="text-xs font-normal text-slate-400">(Clean record)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "borrowed" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              My Current Loans & Return Tracking
            </h3>
            <span className="text-xs text-slate-500">
              Today: 14 Oct 2026 • Automatic renewals enabled
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {borrowedBooks.map((b) => {
              const daysLeft = getDaysDiff(b.dueDate);
              const isReturned = !!b.returnedDate;
              const fine = calculateFine(b.dueDate, b.returnedDate);

              let statusTone: "green" | "amber" | "red" = "green";
              let statusLabel = `${daysLeft} days remaining`;

              if (isReturned) {
                statusTone = "green";
                statusLabel = "Returned On Time";
              } else if (daysLeft < 0) {
                statusTone = "red";
                statusLabel = `Overdue by ${Math.abs(daysLeft)} days (Fine: ₹${fine})`;
              } else if (daysLeft <= 3) {
                statusTone = "amber";
                statusLabel = `Due in ${daysLeft} days • Renew Now!`;
              }

              return (
                <div
                  key={b.id}
                  className={`${card} p-5 flex flex-col justify-between transition-all hover:shadow-md border ${
                    !isReturned && daysLeft <= 2
                      ? "border-amber-400/80 dark:border-amber-700/80"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                          {b.accessionNo} • {b.subjectCode}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug mt-0.5">
                          {b.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">Author(s): {b.author}</p>
                      </div>
                      <Pill tone={statusTone}>{statusLabel}</Pill>
                    </div>

                    {/* Timeline dates */}
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Issue Date</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {new Date(b.issueDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          {isReturned ? "Returned On" : "Return Due Date"}
                        </span>
                        <span
                          className={`font-semibold ${
                            !isReturned && daysLeft <= 3 ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {new Date(isReturned ? b.returnedDate! : b.dueDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Fine and Renewal Info */}
                    <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                      <span>Renewals Left: <strong className="text-slate-800 dark:text-slate-200">{b.renewalsLeft} / {b.maxRenewals}</strong></span>
                      <span>Late Fee Accrued: <strong className={fine > 0 ? "text-red-600" : "text-emerald-600"}>₹{fine}.00</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isReturned ? (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleRenew(b.id)}
                        disabled={b.renewalsLeft <= 0}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                        title="Extend due date by 7 days to avoid late fees"
                      >
                        <RotateCcw size={14} />
                        Renew (+7 Days)
                      </button>
                      <button
                        onClick={() => handleReturn(b.id)}
                        className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Return Book
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 size={14} />
                        Completed & Checked In Without Any Fines
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Catalog Search & Reservation Tab */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog by title, author, or subject code (e.g. UGCA1929)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Programming">Programming</option>
              <option value="Database & Cloud">Database & Cloud</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCatalog.map((book) => {
              const isAvailable = book.availableCopies > 0;
              return (
                <div key={book.id} className={`${card} p-4 flex flex-col justify-between space-y-3`}>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {book.subjectCode}
                      </span>
                      <Pill tone={isAvailable ? "green" : "red"}>
                        {isAvailable ? `${book.availableCopies} Copies Available` : "Checked Out"}
                      </Pill>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1 leading-snug">
                      {book.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">By {book.author}</p>
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 font-mono">
                      📍 {book.shelf}
                    </p>
                  </div>

                  <button
                    onClick={() => setReserveModal(book)}
                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 py-2 text-xs font-semibold transition"
                  >
                    {isAvailable ? "Reserve This Book" : "Join Waitlist"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rules & Late Fee Policy Tab */}
      {activeTab === "rules" && (
        <div className={`${card} p-6 space-y-4`}>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                GGI Central Library Issue & Fee Prevention Policy
              </h3>
              <p className="text-xs text-slate-500">Official circulation desk regulations for BCA / MCA / B.Tech students</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" /> Loan Period & Quota
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Students can borrow up to <strong>4 books simultaneously</strong> using their Smart Identity Card.</li>
                <li>Standard borrowing period is <strong>14 consecutive calendar days</strong>.</li>
                <li>Reference books and rare journals must be consulted inside the central reading hall only.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <DollarSign size={16} className="text-amber-600" /> Overdue Fee & How To Avoid It
              </h4>
              <ul className="text-xs text-amber-900/90 dark:text-amber-300 space-y-1.5 list-disc pl-4">
                <li><strong>Overdue Penalty:</strong> ₹5.00 per book per day begins strictly the morning after the due date.</li>
                <li><strong>Free Renewals:</strong> You are granted <strong>2 renewals (+7 days each)</strong> before the due date.</li>
                <li><strong>Tip:</strong> Always check your AI Deadline Tracker and Notification Bell to renew 2 days before the date!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Confirmation Modal */}
      {reserveModal && (
        <Modal
          isOpen={!!reserveModal}
          title="Confirm Book Reservation"
          onClose={() => setReserveModal(null)}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              You are placing a hold request for:
            </p>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 space-y-1">
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{reserveModal.title}</p>
              <p className="text-xs text-slate-500">Author: {reserveModal.author}</p>
              <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">Location: {reserveModal.shelf}</p>
            </div>
            <p className="text-[11px] text-slate-500">
              Reserved books are held at the circulation desk for 24 hours before returning to general circulation.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setReserveModal(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReserve(reserveModal)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Confirm Hold
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
