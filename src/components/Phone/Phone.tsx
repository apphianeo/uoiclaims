import { Lock } from "lucide-react";
import { AiOrb } from "@/components/Shared/Ai";

/** Customer phone. Milestone 1: static frame and placeholder conversation. */
export function Phone() {
  return (
    <div className="relative h-[880px] w-[430px] rounded-[60px] bg-page p-[11px] shadow-pop ring-1 ring-device">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[50px] bg-surface">
        {/* status bar */}
        <div className="num relative flex h-12 shrink-0 items-end justify-between bg-surface px-9 pb-1.5 text-xs font-semibold text-ink">
          <span>9:41</span>
          <span className="absolute left-1/2 top-3 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-ink" />
          <span>5G</span>
        </div>

        {/* app header */}
        <div className="flex shrink-0 items-center gap-3 bg-surface px-5 pb-4 pt-3">
          <AiOrb size={44} />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-base font-semibold text-ink">UOI Claims assistant</div>
            <div className="flex items-center gap-1.5 text-xs text-success">
              <span className="live-pulse h-1.5 w-1.5 rounded-full bg-success" /> Shared live with your claims officer
            </div>
          </div>
        </div>

        {/* policy context */}
        <div className="mx-4 mt-4 flex items-center justify-between rounded-full bg-page px-4 py-2.5 text-xs text-ink shadow-card">
          <span className="font-medium">UOI Travel Insurance</span>
          <span className="num text-muted">TRV-2026-084512</span>
        </div>

        {/* conversation */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-4 text-base text-ink">
          <Bubble from="ai">That sounds really stressful. Let's get this sorted together. First, are you somewhere safe?</Bubble>
          <Bubble from="me">Yes, I'm at my hotel</Bubble>
          <Bubble from="ai">Good, I'm glad you're safe. When did it happen?</Bubble>
        </div>

        {/* chips */}
        <div className="shrink-0 bg-surface px-4 pb-8 pt-2">
          <div className="flex flex-wrap gap-2">
            {["Today", "Yesterday", "2+ days ago"].map((c) => (
              <button
                key={c}
                className="h-12 rounded-full bg-page px-5 text-base font-medium text-primary shadow-card ring-1 ring-primary/20 active:bg-info"
              >
                {c}
              </button>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-2xs text-faint">
            <Lock size={12} /> Tap an answer. Your officer sees the same claim file.
          </p>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: "ai" | "me"; children: React.ReactNode }) {
  return from === "ai" ? (
    <p className="max-w-[86%] rounded-[20px] rounded-bl-[6px] bg-page px-4 py-3 shadow-card">{children}</p>
  ) : (
    <p className="max-w-[86%] self-end rounded-[20px] rounded-br-[6px] bg-primary px-4 py-3 text-white">{children}</p>
  );
}
