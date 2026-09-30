import { useEffect, useState } from "react";
import { Check, Timer } from "lucide-react";
import { useStore } from "@/engine/machine";
import { cn } from "@/lib";
import logo from "@/assets/uoi-logo.png";

export const PHASES = ["Tell us", "Evidence", "Assessment", "Decision", "Paid"] as const;

export const mmss = (ms: number) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/** Elapsed time since the visitor started, frozen once paid. */
function useElapsed() {
  const startedAt = useStore((s) => (s.phase === "run" || s.phase === "end" ? s.startedAt : null));
  const paidAt = useStore((s) => s.stamps.paid);
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return startedAt ? mmss((paidAt ?? Date.now()) - startedAt) : "0:00";
}

export function ProgressRail() {
  const current = useStore((s) => (s.phase === "run" || s.phase === "end" ? s.rail : -1));
  const elapsed = useElapsed();
  const pct = (current / (PHASES.length - 1)) * 100;
  return (
    <header className="relative flex h-[96px] shrink-0 items-center gap-8 px-16">
      <div className="flex items-center gap-4">
        <img src={logo} alt="UOI, member of the UOB Group" className="h-12 w-auto" draggable={false} />
        <span className="h-9 w-px bg-line" />
        <span className="leading-tight">
          <span className="ai-text block text-xl font-semibold">See what we see</span>
          <span className="block text-xs text-muted">Try a claim on the phone. Watch UOI's side update live.</span>
        </span>
      </div>

      {/* steps on a single track, centred on the stage */}
      <div className="absolute left-1/2 top-1/2 w-[760px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-[10%] right-[10%] top-[15px] h-[2px] rounded-full bg-page">
          <div className="ai-gradient h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.max(0, pct)}%` }} />
        </div>
        <ol className="relative grid grid-cols-5">
          {PHASES.map((label, i) => {
            const done = i < current || (i === current && i === PHASES.length - 1);
            const active = i === current && !done;
            return (
              <li key={label} className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "num grid h-8 w-8 place-items-center rounded-full text-xs font-semibold",
                    done && "ai-gradient text-white",
                    active && "ai-gradient text-white ring-4 ring-regal/20",
                    !done && !active && "bg-page text-faint ring-1 ring-line"
                  )}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn("text-sm", active ? "font-semibold text-ink" : done ? "text-muted" : "text-faint")}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="ml-auto w-[240px] text-right leading-tight">
        <span className="num flex items-center justify-end gap-1.5 text-xl font-semibold text-ink">
          <Timer size={18} className="text-muted" />
          {elapsed}
        </span>
        <span className="block text-xs text-muted">Time since you started your claim</span>
      </div>
    </header>
  );
}
