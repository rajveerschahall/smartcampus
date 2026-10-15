import React, { useState } from "react";
import { HACKATHON_TEAMS, HackathonTeam } from "./data";
import { card, primary, ghost, Pill, Modal, showToast } from "./ui";
import { Users, UserPlus, Sparkles, Plus, Code, CheckCircle2 } from "lucide-react";

export default function TeamBuilder() {
  const [teams, setTeams] = useState<HackathonTeam[]>(HACKATHON_TEAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [event, setEvent] = useState("Tech Fest 2026");
  const [idea, setIdea] = useState("");
  const [roles, setRoles] = useState("UI/UX Designer, Backend Dev");
  const [maxMembers, setMaxMembers] = useState(4);
  const [joinedTeams, setJoinedTeams] = useState<string[]>(["team-1"]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !idea.trim()) return;

    const newTeam: HackathonTeam = {
      id: `team-${Date.now()}`,
      name,
      event,
      lead: "Rajveer Singh",
      leadRoll: "2433613",
      projectIdea: idea,
      members: ["Rajveer Singh (Lead)"],
      maxMembers,
      openRoles: roles.split(",").map(r => r.trim()).filter(Boolean),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="text-indigo-600 dark:text-indigo-400" size={22} />
            Hackathon Team Builder
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Form multi-disciplinary teams for Tech Fest, Smart India Hackathon & E-Cell challenges.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={primary}>
          <Plus size={16} /> Create Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {teams.map(team => {
          const isMember = joinedTeams.includes(team.id);
          const isFull = team.members.length >= team.maxMembers;

          return (
            <article key={team.id} className={`${card} p-5 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Pill tone="indigo">{team.event}</Pill>
                  <span className="text-xs font-semibold text-slate-500">
                    {team.members.length}/{team.maxMembers} Members
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Lead: <b className="text-slate-700 dark:text-slate-300">{team.lead}</b> ({team.leadRoll})
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-4">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Project Concept:</span>
                  <p className="text-slate-600 dark:text-slate-400">{team.projectIdea}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Current Roster
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {team.members.map(m => (
                      <span key={m} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {team.openRoles.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      Looking For:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {team.openRoles.map(r => (
                        <Pill key={r} tone="amber">{r}</Pill>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {isMember ? (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                    <CheckCircle2 size={15} /> You are on this squad
                  </div>
                ) : isFull ? (
                  <button disabled className={`${ghost} w-full text-xs opacity-60`}>
                    Team is Full
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(team.id, team.name)}
                    className={`${primary} w-full text-xs !py-1.5`}
                  >
                    <UserPlus size={14} /> Request to Join Team
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Form New Hackathon Team"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Team Name
            </label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. CodeKnights, DevMorphers"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event / Hackathon
              </label>
              <select
                value={event}
                onChange={e => setEvent(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              >
                <option>Tech Fest 2026</option>
                <option>Street Sell — E-Cell</option>
                <option>Smart India Hackathon (Internal)</option>
                <option>World Student Day Tech Showcase</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Team Size
              </label>
              <select
                value={maxMembers}
                onChange={e => setMaxMembers(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              >
                <option value={2}>2 Members</option>
                <option value={3}>3 Members</option>
                <option value={4}>4 Members</option>
                <option value={5}>5 Members</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Concept / Problem Statement
            </label>
            <textarea
              required
              value={idea}
              onChange={e => setIdea(e.target.value)}
              rows={3}
              placeholder="Brief description of the application or solution you are building..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Roles You Want to Recruit (comma-separated)
            </label>
            <input
              value={roles}
              onChange={e => setRoles(e.target.value)}
              placeholder="e.g. React Frontend, AI Specialist, Pitch Lead"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className={ghost}>
              Cancel
            </button>
            <button type="submit" className={primary}>
              Publish Team
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
