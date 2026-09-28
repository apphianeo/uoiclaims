import { Check } from "lucide-react";
import { cn } from "@/lib";
import logo from "@/assets/uoi-logo.png";

export const PHASES = ["Tell us", "Evidence", "Assessment", "Decision", "Paid"] as const;

type Props = { current: number; elapsed: string };

export function ProgressRail({ current, elapsed }: Props) {
  const pct = (current / (PHASES.length - 1)) * 100;
  return (
    <header className="relative flex h-[84px] shrink-0 items-center gap-8 px-10">
      <div className="flex items-center gap-4">
        <span className="grid h-12 place-items-center rounded-sm bg-surface px-3">
          <img src={logo} alt="UOI, member of the UOB Group" className="h-9 w-auto" draggable={false} />
        </span>
        <span className="leading-tight">
          <span className="block text-lg font-semibold text-night-ink">See what we see</span>
          <span className="block text-xs text-night-muted">One claim file, shared by you and UOI</span>
        </span>
      </div>

      {/* steps on a single track; the filled part carries the brand gradient */}
      <div className="relative mx-auto w-[820px]">
        <div className="absolute left-[10%] right-[10%] top-[15px] h-[2px] rounded-full bg-night-line">
          <div className="ai-gradient h-full rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <ol className="relative grid grid-cols-5">
          {PHASES.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={label} className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "num grid h-8 w-8 place-items-center rounded-full text-xs font-semibold",
                    done && "ai-gradient text-white",
                    active && "bg-surface text-primary ring-4 ring-regal/30",
                    !done && !active && "border border-night-line bg-night text-night-muted"
                  )}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn("text-sm", active ? "font-semibold text-night-ink" : done ? "text-night-ink/80" : "text-night-muted")}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="w-[240px] text-right leading-tight">
        <span className="num block text-xl font-semibold text-night-ink">{elapsed}</span>
        <span className="block text-xs text-night-muted">Your claim so far</span>
      </div>
    </header>
  );
}
