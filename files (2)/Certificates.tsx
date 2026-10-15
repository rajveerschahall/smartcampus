import React, { useState } from "react";
import { CERTIFICATES, CertificateItem } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";
import { Award, ShieldCheck, Download, Share2, CheckCircle2, Eye, Printer, ExternalLink } from "lucide-react";

export default function Certificates() {
  const [certs, setCerts] = useState<CertificateItem[]>(CERTIFICATES);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const handleDownload = (cert: CertificateItem) => {
    showToast(`Downloading verified credential: ${cert.id}.pdf`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="text-indigo-600 dark:text-indigo-400" size={22} />
            Digital Credentials & E-Certificates
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tamper-proof verifiable campus credentials backed by digital cryptographic signatures.
          </p>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {certs.map(c => (
          <article key={c.id} className={`${card} p-5 flex flex-col justify-between group relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {c.id}
                </span>
                <Pill tone="green">
                  <ShieldCheck size={12} className="mr-1 inline" /> Verified
                </Pill>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1.5 group-hover:text-indigo-600 transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-slate-500 mb-2">{c.event} • {c.date}</p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Standing / Merit:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{c.gradeOrRank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Awarded To:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{c.issuedTo} ({c.rollNo})</span>
                </div>
              </div>

              <p className="font-mono text-[10px] text-slate-400 truncate">
                hash: {c.verificationHash}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex gap-2">
              <button
                onClick={() => setSelectedCert(c)}
                className={`${primary} flex-1 text-xs !py-1.5`}
              >
                <Eye size={13} /> View Certificate
              </button>
              <button
                onClick={() => handleDownload(c)}
                className={`${ghost} !py-1.5 px-3 text-xs`}
                title="Download PDF"
              >
                <Download size={13} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Official Certificate Modal */}
      {selectedCert && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCert(null)}
          title="Official Institutional E-Certificate"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {/* Certificate Print Preview Sheet */}
            <div className="relative border-8 border-double border-indigo-900/30 dark:border-indigo-400/30 p-8 rounded-xl bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-center shadow-lg">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600 mb-2">
                <Award size={28} />
              </div>

              <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-900 dark:text-indigo-300">
                GULZAR GROUP OF INSTITUTES, KHANNA
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
                Accredited NAAC A+ • Approved by AICTE, New Delhi
              </p>

              <h1 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-1">
                Certificate of Achievement
              </h1>
              <p className="text-xs text-slate-500 italic mb-5">This is proudly presented to</p>

              <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-indigo-300 underline-offset-8 mb-3">
                {selectedCert.issuedTo}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Roll No: <b>{selectedCert.rollNo}</b> • Dept. of Computer Applications
              </p>

              <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
                for outstanding participation and securing <b>{selectedCert.gradeOrRank}</b> in <b>{selectedCert.event}</b> organized at GGI Khanna campus on {selectedCert.date}.
              </p>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-serif italic font-semibold text-slate-800 dark:text-slate-200">
                    Dr. Priya Dhir
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Head of Department</span>
                </div>
                <div>
                  <div className="font-serif italic font-semibold text-slate-800 dark:text-slate-200">
                    Dr. Rajiv Kumar
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Director Academics</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Certificate Ref: {selectedCert.id}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-sans font-semibold">
                  <ShieldCheck size={12} /> Digitally Signed
                </span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => window.print()} className={ghost}>
                <Printer size={14} /> Print Certificate
              </button>
              <button onClick={() => handleDownload(selectedCert)} className={primary}>
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
