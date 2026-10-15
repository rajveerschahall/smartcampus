import React, { useState } from "react";
import { INITIAL_DUTY_LEAVES, DutyLeaveRequest, EVENTS } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";
import { FileSignature, Plus, CheckCircle, Clock, XCircle, UploadCloud, AlertCircle, ShieldCheck } from "lucide-react";

export default function DutyLeave() {
  const [requests, setRequests] = useState<DutyLeaveRequest[]>(INITIAL_DUTY_LEAVES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [event, setEvent] = useState("Tech Fest 2026");
  const [dates, setDates] = useState("15 Oct 2026");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast("Please provide details of your participation.", "error");
      return;
    }

    const newReq: DutyLeaveRequest = {
      id: `DL-${Date.now().toString().slice(-4)}`,
      studentId: "2433613",
      studentName: "Rajveer Singh",
      event,
      dates,
      type: "Duty Leave",
      status: "Pending",
      reason,
      appliedDate: "Today",
      proofDocument: proof || "Participation_Pass.pdf"
    };

    setRequests([newReq, ...requests]);
    showToast(`Duty Leave application submitted for ${event}!`, "success");
    setIsModalOpen(false);
    setReason("");
    setProof("");
  };

  const statusTone = {
    Verified: "green",
    Pending: "amber",
    Rejected: "red"
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSignature className="text-indigo-600 dark:text-indigo-400" size={22} />
            Duty Leave (DL) Portal
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Apply for attendance waiver for hackathons, sports, or approved college representations.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={primary}>
          <Plus size={16} /> Apply for Duty Leave
        </button>
      </div>

      {/* Workflow Step Banner */}
      <div className={`${card} p-5 bg-gradient-to-r from-indigo-50/60 to-white dark:from-slate-900 dark:to-indigo-950/20`}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
          Official Approval Lifecycle
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">1. Student Submit</span>
            <span className="text-slate-500">Provide registration ticket & event proof.</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">2. Faculty Mentor</span>
            <span className="text-slate-500">Verifies student eligibility & credentials.</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">3. HOD Approval</span>
            <span className="text-slate-500">Department Head grants formal duty signoff.</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">4. Attendance Credit</span>
            <span className="text-slate-500">ERP automates Present mark on roster.</span>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Ref ID</th>
              <th className="px-5 py-3.5 font-semibold">Event & Purpose</th>
              <th className="px-4 py-3.5 font-semibold">Leave Date</th>
              <th className="px-4 py-3.5 font-semibold">Submitted</th>
              <th className="px-4 py-3.5 font-semibold">Proof Document</th>
              <th className="px-5 py-3.5 font-semibold text-right">Approval Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {r.id}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{r.event}</div>
                  <p className="text-xs text-slate-500 mt-0.5">{r.reason}</p>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                  {r.dates}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {r.appliedDate}
                </td>
                <td className="px-4 py-3.5 text-xs">
                  {r.proofDocument ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 cursor-pointer hover:underline">
                      📎 {r.proofDocument}
                    </span>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Pill tone={statusTone[r.status]}>
                    {r.status === "Pending" ? "Pending HOD Signoff" : r.status}
                  </Pill>
                  {r.approvedBy && (
                    <span className="block text-[10px] text-slate-400 mt-0.5">By {r.approvedBy}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Duty Leave Request"
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Official Event
            </label>
            <select
              value={event}
              onChange={e => setEvent(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800"
            >
              {EVENTS.filter(e => e.cat !== "Holiday").map(e => (
                <option key={e.id} value={e.title}>{e.title}</option>
              ))}
              <option value="Inter-University Sports Meet">Inter-University Sports Meet</option>
              <option value="NSS / NCC Camp Representation">NSS / NCC Camp Representation</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date(s) of Absence
              </label>
              <input
                type="text"
                value={dates}
                onChange={e => setDates(e.target.value)}
                placeholder="e.g. 15 Oct 2026 (Full Day)"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Roll No.
              </label>
              <input
                disabled
                value="2433613 (Rajveer Singh)"
                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800/60 opacity-80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Representation Role / Justification
            </label>
            <textarea
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="Explain your participation role, committee or team assignment..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Upload Verification Proof / Invitation
            </label>
            <input
              type="file"
              onChange={e => setProof(e.target.files?.[0]?.name || "DutyLeave_Ticket.pdf")}
              className="w-full text-xs text-slate-500"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className={ghost}>
              Cancel
            </button>
            <button type="submit" className={primary}>
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
