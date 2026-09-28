import { Lock } from "lucide-react";
import { AiOrb } from "@/components/Shared/Ai";

/** Customer phone. Milestone 1: static frame and placeholder conversation. */
export function Phone() {
  return (
    <div className="relative h-[880px] w-[430px] rounded-[60px] bg-device p-[11px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8),0_0_0_1px_rgb(255_255_255/0.08)_inset]">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[50px] bg-page">
        {/* status bar */}
        <div className="num relative flex h-12 shrink-0 items-end justify-between bg-surface px-9 pb-1.5 text-xs font-semibold">
          <span>9:41</span>
          <span className="absolute left-1/2 top-3 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-device" />
          <span>5G</span>
        </div>

        {/* app header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-line bg-surface px-5 pb-4 pt-3">
          <AiOrb size={44} />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-base font-semibold">UOI Claims assistant</div>
            <div className="flex items-center gap-1.5 text-xs text-success">
              <span className="live-pulse h-1.5 w-1.5 rounded-full bg-success" /> Shared live with your claims officer
            </div>
          </div>
        </div>

        {/* policy context */}
        <div className="mx-4 mt-4 flex items-center justify-between rounded-sm bg-surface px-4 py-2.5 text-xs shadow-card">
          <span className="font-medium">UOI Travel Insurance</span>
          <span className="num text-muted">TRV-2026-084512</span>
        </div>

        {/* conversation */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-4 text-base">
          <Bubble from="ai">That sounds really stressful. Let's get this sorted together. First, are you somewhere safe?</Bubble>
          <Bubble from="me">Yes, I'm at my hotel</Bubble>
          <Bubble from="ai">Good, I'm glad you're safe. When did it happen?</Bubble>
        </div>

        {/* chips */}
        <div className="shrink-0 border-t border-line bg-surface px-4 pb-8 pt-4">
          <div className="flex flex-wrap gap-2">
            {["Today", "Yesterday", "2+ days ago"].map((c) => (
              <button
                key={c}
                className="h-12 rounded-xl border border-primary/40 bg-surface px-5 text-base font-medium text-primary active:bg-info"
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
    <p className="max-w-[86%] rounded-lg rounded-bl-[4px] bg-surface px-4 py-3 shadow-card">{children}</p>
  ) : (
    <p className="max-w-[86%] self-end rounded-lg rounded-br-[4px] bg-primary px-4 py-3 text-white">{children}</p>
  );
}
