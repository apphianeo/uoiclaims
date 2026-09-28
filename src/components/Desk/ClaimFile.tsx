import { FileText, MessageSquare } from "lucide-react";
import { FIELDS } from "@/data/preview";
import { AiTag } from "@/components/Shared/Ai";

export function ClaimFile() {
  const filled = FIELDS.filter((f) => f.value).length;
  return (
    <section className="flex min-h-0 flex-col rounded-lg bg-page">
      <header className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
        <div>
          <h3 className="text-lg font-semibold text-ink">Claim file</h3>
          <p className="num text-xs text-muted">CLM-2026-11-0412 · Wei Ling Tan</p>
        </div>
        <AiTag>Built from your conversation</AiTag>
      </header>

      <div className="mx-6 mb-2 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
          <div className="ai-gradient h-full rounded-full" style={{ width: `${(filled / FIELDS.length) * 100}%` }} />
        </div>
        <span className="num text-xs text-muted">
          {filled} of {FIELDS.length} fields
        </span>
      </div>

      <dl className="flex-1 px-3 pb-3">
        {FIELDS.map((f) =>
          f.value ? (
            <div key={f.label} className="relative flex h-[62px] items-center justify-between gap-4 rounded-sm px-3">
              <span className="ai-gradient absolute bottom-3 left-0 top-3 w-[3px] rounded-full" />
              <div className="leading-tight">
                <dt className="text-xs text-muted">{f.label}</dt>
                <dd className="text-base font-semibold text-ink">{f.value}</dd>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-2xs text-muted">
                {f.from === "doc" ? <FileText size={12} /> : <MessageSquare size={12} />}
                {f.source}
              </span>
            </div>
          ) : (
            <div key={f.label} className="flex h-[62px] items-center justify-between gap-4 px-3">
              <div className="leading-tight">
                <dt className="text-xs text-faint">{f.label}</dt>
                <dd className="shimmer mt-1.5 h-3 w-40 rounded-full" />
              </div>
              <span className="text-2xs text-faint">Waiting for answer</span>
            </div>
          )
        )}
      </dl>
    </section>
  );
}
