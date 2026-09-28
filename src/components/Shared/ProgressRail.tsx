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
        <img src={logo} alt="UOI, member of the UOB Group" className="h-12 w-auto" draggable={false} />
        <span className="h-9 w-px bg-line" />
        <span className="leading-tight">
          <span className="ai-text block text-xl font-semibold">See what we see</span>
          <span className="block text-xs text-muted">One claim file, shared by you and UOI</span>
        </span>
      </div>

      {/* steps on a single track; the filled part carries the brand gradient */}
      <div className="relative mx-auto w-[820px]">
        <div className="absolute left-[10%] right-[10%] top-[15px] h-[2px] rounded-full bg-page">
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
                    active && "bg-primary text-white ring-4 ring-primary/15",
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

      <div className="w-[240px] text-right leading-tight">
        <span className="num block text-xl font-semibold text-ink">{elapsed}</span>
        <span className="block text-xs text-muted">Your claim so far</span>
      </div>
    </header>
  );
}
