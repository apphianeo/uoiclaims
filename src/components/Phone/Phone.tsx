import { Paperclip } from "lucide-react";

/** Customer phone. Milestone 1: static frame and placeholder conversation. */
export function Phone() {
  return (
    <div className="relative h-[860px] w-[420px] rounded-[56px] bg-device p-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.35)]">
      <div className="flex h-full flex-col overflow-hidden rounded-[44px] bg-surface">
        {/* status bar */}
        <div className="num flex h-11 shrink-0 items-end justify-between px-8 pb-1 text-xs font-semibold">
          <span>9:41</span>
          <span className="absolute left-1/2 top-5 h-7 w-28 -translate-x-1/2 rounded-full bg-device" />
          <span>5G</span>
        </div>

        {/* app header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-semibold text-brand-ink">
            UOI
          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold">UOI Claims</div>
            <div className="text-xs text-muted">Travel insurance · TRV-2026-084512</div>
          </div>
        </div>

        {/* conversation */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-5 text-base">
          <Bubble from="ai">That sounds really stressful. Let's get this sorted together. First, are you somewhere safe?</Bubble>
          <Bubble from="me">Yes, I'm at my hotel</Bubble>
          <Bubble from="ai">Good. I'm glad you're safe. When did it happen?</Bubble>
        </div>

        {/* chips */}
        <div className="flex shrink-0 items-start gap-2 border-t border-line px-4 py-4">
          <div className="flex flex-1 flex-wrap gap-2">
            {["Today", "Yesterday", "2+ days ago"].map((c) => (
              <button key={c} className="h-12 rounded-full border border-brand/30 px-4 text-base font-medium text-brand">
                {c}
              </button>
            ))}
          </div>
          <span className="grid h-12 w-8 shrink-0 place-items-center text-faint">
            <Paperclip size={20} />
          </span>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: "ai" | "me"; children: React.ReactNode }) {
  return from === "ai" ? (
    <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-bubble-ai px-4 py-3">{children}</p>
  ) : (
    <p className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-bubble-me px-4 py-3 text-bubble-me-ink">{children}</p>
  );
}
