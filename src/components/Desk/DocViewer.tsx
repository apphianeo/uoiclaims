import { AlertCircle, Check, Clock } from "lucide-react";
import { DOCS } from "@/data/preview";
import { cn } from "@/lib";

/** Document viewer: a rendered document with the AI's extracted fields boxed. */
export function DocViewer() {
  return (
    <section className="flex min-h-0 flex-col rounded-lg bg-surface shadow-pop">
      <header className="flex items-center justify-between px-6 pb-3 pt-5">
        <h3 className="text-lg font-semibold">Evidence</h3>
        <span className="num text-xs text-muted">1 of 4 received</span>
      </header>

      <div className="flex gap-2 px-6 pb-4">
        {DOCS.map((d) => (
          <span
            key={d.name}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-full px-3 text-xs",
              d.state === "read" && "bg-info font-medium text-primary",
              d.state === "waiting" && "bg-page text-faint",
              d.state === "missing" && "bg-caution-bg text-caution"
            )}
          >
            {d.state === "read" ? <Check size={13} strokeWidth={2.5} /> : d.state === "missing" ? <AlertCircle size={13} /> : <Clock size={13} />}
            {d.name}
          </span>
        ))}
      </div>

      {/* document canvas */}
      <div className="relative mx-6 mb-6 flex-1 overflow-hidden rounded bg-page p-5">
        <div className="relative mx-auto h-full max-w-[520px] rounded-sm bg-surface px-8 py-6 shadow-[0_2px_12px_rgb(0_0_0/0.08)]">
          <div className="flex items-start justify-between border-b border-line pb-3">
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-wide">Tourist Police Division</p>
              <p className="text-2xs text-muted">Royal Thai Police · Report of loss</p>
            </div>
            <span className="num text-2xs text-muted">No. TPB-26-118204</span>
          </div>

          <div className="mt-6 space-y-6 text-xs">
            <Extract label="Date filed">
              <Row k="Date of report" v="12 November 2026, 21:40" />
            </Extract>
            <Extract label="Location">
              <Row k="Place of incident" v="Sukhumvit Soi 11, Bangkok" />
            </Extract>
            <Row k="Complainant" v="Tan Wei Ling (Singapore)" />
            <Extract label="Items reported">
              <Row k="Property lost" v="Wallet, cash THB 7,500, mobile phone" />
            </Extract>
            <div className="space-y-2 pt-1">
              <div className="h-2 w-full rounded-full bg-line" />
              <div className="h-2 w-11/12 rounded-full bg-line" />
              <div className="h-2 w-3/4 rounded-full bg-line" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-2">
      <span className="text-muted">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

/** A gradient box around text the AI pulled out, with a label naming the field it fed. */
function Extract({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -inset-x-2 -inset-y-1.5 rounded-[6px] border-[1.5px] border-regal/70 bg-regal/[0.06]" />
      <span className="ai-gradient absolute -left-2 -top-[22px] rounded-t-[4px] px-1.5 text-[10px] font-semibold leading-[16px] text-white">
        {label}
      </span>
      <div className="relative">{children}</div>
    </div>
  );
}
