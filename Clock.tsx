import { useEffect, useState } from "react";
export default function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="text-right leading-tight" aria-label="Current time">
      <p className="font-mono text-sm font-semibold tabular-nums">{now.toLocaleTimeString("en-IN", { hour12: true })}</p>
      <p className="text-xs text-slate-500">{now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
    </div>
  );
}
