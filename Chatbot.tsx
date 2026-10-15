import { useState } from "react";
export type Role = "teacher" | "student";

const REPLIES: Record<Role, [RegExp, string][]> = {
  teacher: [
    [/attendance/i, "Open Dashboard, pick the period under Today's Classes and tap Take Attendance. Mark Present, Absent or DL for each student, then Save."],
    [/timetable/i, "Go to Academic Affairs > View Timetable. You can add or remove your own periods for each day."],
    [/extra|lecture/i, "Use Academic Affairs > Extra Lecture to book a class slot and notify the students."],
    [/event/i, "Open Notifications & Announcements > Events. Use Add event to create one, and the arrow on a card to see participation details."],
    [/leave|adjust|od/i, "Staff Attendance & Leave has Teacher Adjustments and OD Inbox for approvals."],
  ],
  student: [
    [/attendance/i, "Your attendance is on the dashboard ring. Keep it at 75% or above to stay eligible for exams."],
    [/timetable/i, "Your class timetable is under Academic. Teachers update it when periods change."],
    [/event|register/i, "Open the Event Portal, choose an event and tap Register now, or join a team if it needs one."],
    [/dl|duty/i, "Apply for duty leave from Duty Leave after registering for an event. Your faculty approves it."],
    [/placement|company/i, "Companies register first. Once approved, drives show up and you can apply."],
  ],
};

export default function Chatbot({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [log, setLog] = useState<{ from: "me" | "bot"; msg: string }[]>([
    { from: "bot", msg: role === "teacher" ? "Hi! Ask me about attendance, timetable, events or leave." : "Hi! Ask me about attendance, events, duty leave or placements." },
  ]);
  const send = () => {
    if (!text.trim()) return;
    const hit = REPLIES[role].find(([re]) => re.test(text));
    setLog([...log, { from: "me", msg: text }, { from: "bot", msg: hit ? hit[1] : "I can help with the menu options. Try asking about attendance, timetable or events." }]);
    setText("");
  };
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-3 flex h-80 w-72 flex-col rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <p className="border-b border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-800">{role === "teacher" ? "Faculty assistant" : "Student assistant"}</p>
          <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm" aria-live="polite">
            {log.map((m, i) => <p key={i} className={`max-w-[85%] rounded-lg px-3 py-2 ${m.from === "me" ? "ml-auto bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800"}`}>{m.msg}</p>)}
          </div>
          <div className="flex gap-2 border-t border-slate-200 p-2 dark:border-slate-800">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} aria-label="Message" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-transparent px-2 py-1.5 text-sm dark:border-slate-700" />
            <button onClick={send} className="rounded-lg bg-indigo-600 px-3 text-sm text-white">Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Toggle chatbot" className="ml-auto grid h-12 w-12 place-items-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:-translate-y-0.5">{open ? "x" : "AI"}</button>
    </div>
  );
}
