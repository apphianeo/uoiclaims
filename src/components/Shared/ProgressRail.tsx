import { cn } from "@/lib";

export const PHASES = ["Tell us", "Evidence", "Assessment", "Decision", "Paid"] as const;

type Props = { current: number; elapsed: string };

export function ProgressRail({ current, elapsed }: Props) {
  return (
    <header className="flex h-[72px] items-center gap-10 border-b border-line bg-surface px-10">
      <div className="flex items-baseline gap-3">
        <span className="text-lg font-semibold tracking-tight text-brand">UOI</span>
        <span className="text-sm text-muted">Claims, side by side</span>
      </div>

      <ol className="mx-auto flex items-center gap-2">
        {PHASES.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex items-center gap-2">
              {i > 0 && <span className={cn("h-px w-10", done || active ? "bg-brand" : "bg-line")} />}
              <span
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full px-4 text-sm",
                  active && "bg-brand text-brand-ink font-medium",
                  done && "text-brand font-medium",
                  !done && !active && "text-faint"
                )}
              >
                <span
                  className={cn(
                    "num grid h-6 w-6 place-items-center rounded-full text-xs",
                    active ? "bg-brand-ink/15" : done ? "bg-brand-soft" : "border border-line"
                  )}
                >
                  {i + 1}
                </span>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <span className="num w-20 text-right text-lg font-medium text-muted" aria-label="Time elapsed">
        {elapsed}
      </span>
    </header>
  );
}
