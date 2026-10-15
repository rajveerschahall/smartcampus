import React, { useState } from "react";
import { HACKATHON_TEAMS, HackathonTeam } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";
import {
  Users,
  UserPlus,
  Sparkles,
  Plus,
  Code,
  CheckCircle2,
  Trophy,
  ShieldCheck,
  Search,
  Filter,
  AlertCircle
} from "lucide-react";

export default function TeamBuilder() {
  const [teams, setTeams] = useState<HackathonTeam[]>(HACKATHON_TEAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterEvent, setFilterEvent] = useState<string>("All");

  // Form State
  const [name, setName] = useState("");
  const [event, setEvent] = useState("Smart India Hackathon (SIH 2026) — MoE & AICTE");
  const [problemCode, setProblemCode] = useState("SIH1602");
  const [category, setCategory] = useState<"Software" | "Hardware">("Software");
  const [idea, setIdea] = useState("");
  const [roles, setRoles] = useState("Cloud DevOps, Mobile App Dev, Pitch Lead");
  const [maxMembers, setMaxMembers] = useState(6);
  const [joinedTeams, setJoinedTeams] = useState<string[]>(["team-sih-1", "team-1"]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !idea.trim()) return;

    const isSIH = event.includes("Smart India Hackathon");

    const newTeam: HackathonTeam = {
      id: `team-${Date.now()}`,
      name: name.trim(),
      event,
      lead: "Rajveer Singh",
      leadRoll: "2433613",
      projectIdea: idea.trim(),
      members: ["Rajveer Singh (Lead / FullStack)"],
      maxMembers: isSIH ? 6 : maxMembers,
      openRoles: roles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      isSIH,
      sihProblemCode: isSIH ? problemCode : undefined,
      sihCategory: isSIH ? category : undefined,
      hasMandatoryFemaleMember: isSIH ? true : undefined
    };

    setTeams([newTeam, ...teams]);
    setJoinedTeams([...joinedTeams, newTeam.id]);
    showToast(`Team "${name}" created successfully!`, "success");
    setIsModalOpen(false);
    setName("");
    setIdea("");
  };

  const handleApply = (teamId: string, teamName: string) => {
    if (joinedTeams.includes(teamId)) {
      showToast(`Already a member of ${teamName}!`, "info");
      return;
    }
    setJoinedTeams([...joinedTeams, teamId]);
    showToast(`Application sent to join ${teamName}! Team lead will review your profile.`, "success");
  };

  const filteredTeams = teams.filter((t) => {
    if (filterEvent === "All") return true;
    if (filterEvent === "SIH") return t.isSIH || t.event.includes("Smart India Hackathon");
    return t.event.includes(filterEvent);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            Hackathon Squad & Team Builder
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Form multi-disciplinary squads for Smart India Hackathon (SIH 2026), Tech Fest, and E-Cell challenges.
          </p>
        </div>
        <button
          onClick={() => {
            setEvent("Smart India Hackathon (SIH 2026) — MoE & AICTE");
            setMaxMembers(6);
            setIsModalOpen(true);
          }}
          className={`${primary} !py-2 !px-3.5 text-xs flex items-center gap-2`}
        >
          <Plus size={16} /> Create Hackathon Team
        </button>
      </div>

      {/* SIH Compliance Alert Box */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-200 dark:border-amber-900/40 p-4 text-xs text-slate-800 dark:text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
            <Trophy size={18} />
          </div>
          <div>
            <h4 className="font-bold text-amber-950 dark:text-amber-200">
              Smart India Hackathon (SIH 2026) AICTE Mandatory Guidelines
            </h4>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              1. Each squad MUST have exactly <b>6 student members</b>.<br />
              2. <b>At least 1 female teammate is strictly mandatory</b> per Ministry of Education compliance.
            </p>
          </div>
        </div>
        <button
          onClick={() => setFilterEvent("SIH")}
          className="shrink-0 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 text-xs transition"
        >
          View SIH Squads
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: "All", label: "All Hackathons" },
          { id: "SIH", label: "🏆 Smart India Hackathon (SIH)" },
          { id: "Tech Fest", label: "Tech Fest 2026" },
          { id: "Street Sell", label: "E-Cell Street Sell" }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterEvent(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterEvent === f.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Teams Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => {
          const isMember = joinedTeams.includes(team.id);
          const isFull = team.members.length >= team.maxMembers;
          const isSIH = team.isSIH || team.event.includes("Smart India Hackathon");

          return (
            <article
              key={team.id}
              className={`${card} p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                isSIH
                  ? "border-amber-300/80 dark:border-amber-700/60 ring-1 ring-amber-400/20"
                  : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Pill tone={isSIH ? "amber" : "indigo"}>
                    {isSIH ? "🏆 SIH 2026 Squad" : team.event}
                  </Pill>
                  <span className="text-xs font-semibold text-slate-500">
                    {team.members.length}/{team.maxMembers} Members
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-500 mb-2.5">
                  Lead: <b className="text-slate-700 dark:text-slate-300">{team.lead}</b> ({team.leadRoll})
                </p>

                {isSIH && team.sihProblemCode && (
                  <div className="mb-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800">
                    <Trophy size={12} className="text-amber-600" />
                    Problem Statement: {team.sihProblemCode}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                    Project Concept:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    {team.projectIdea}
                  </p>
                </div>

                <div className="space-y-1.5 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Current Squad Roster ({team.members.length}/{team.maxMembers})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {team.members.map((m) => (
                      <span
                        key={m}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                          m.includes("Female")
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {team.openRoles.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      Looking For:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {team.openRoles.map((r) => (
                        <Pill key={r} tone="amber">
                          {r}
                        </Pill>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {isMember ? (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                    <CheckCircle2 size={15} /> You are in this squad
                  </div>
                ) : isFull ? (
                  <button disabled className={`${ghost} w-full text-xs opacity-60`}>
                    Squad is Full (6/6)
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(team.id, team.name)}
                    className={`${primary} w-full text-xs !py-1.5`}
                  >
                    <UserPlus size={14} /> Request to Join Squad
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Create Team Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Register New Hackathon Squad"
        >
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Squad / Team Name *
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SIH-Innovators GGI, ByteBusters"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event / Hackathon
                </label>
                <select
                  value={event}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEvent(val);
                    if (val.includes("Smart India Hackathon")) {
                      setMaxMembers(6);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option>Smart India Hackathon (SIH 2026) — MoE & AICTE</option>
                  <option>Tech Fest 2026</option>
                  <option>Street Sell — E-Cell</option>
                  <option>CodeQuest 2026</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Squad Size
                </label>
                <select
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Number(e.target.value))}
                  disabled={event.includes("Smart India Hackathon")}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value={6}>6 Members (Mandatory for SIH)</option>
                  <option value={4}>4 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={2}>2 Members</option>
                </select>
              </div>
            </div>

            {event.includes("Smart India Hackathon") && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                  <Trophy size={14} className="text-amber-600" />
                  SIH Mandatory Configuration
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Problem Statement Code:</label>
                    <input
                      value={problemCode}
                      onChange={(e) => setProblemCode(e.target.value)}
                      placeholder="e.g. SIH1602 / SIH1428"
                      className="w-full rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 p-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Category Track:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as "Software" | "Hardware")}
                      className="w-full rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 p-1.5 text-xs"
                    >
                      <option value="Software">Software Edition</option>
                      <option value="Hardware">Hardware Edition</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Project Concept / Proposed Solution *
              </label>
              <textarea
                required
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={3}
                placeholder="Brief summary of your prototype, architecture, and technology stack..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Roles You Want to Recruit (comma-separated)
              </label>
              <input
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
                placeholder="e.g. AI Specialist, Female UI/UX Teammate, DevOps"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className={ghost}>
                Cancel
              </button>
              <button type="submit" className={primary}>
                Publish Squad
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
