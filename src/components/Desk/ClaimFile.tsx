import { motion } from "framer-motion";
import { FileText, MessageSquare } from "lucide-react";
import { useStore } from "@/engine/machine";
import { AiTag } from "@/components/Shared/Ai";

/** The officer's claim file. Every field lands here from the chat or a document. */
export function ClaimFile() {
  const scenario = useStore((s) => s.scenario);
  const fields = useStore((s) => s.fields);
  const filled = scenario.fields.filter((f) => fields[f.key]).length;

  return (
    <section className="flex min-h-0 flex-col rounded-lg bg-page shadow-card">
      <header className="flex items-start justify-between gap-4 px-6 pb-3 pt-5">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-ink">Claim file</h3>
          <p className="num truncate text-xs text-muted">
            {scenario.claimRef} · {scenario.customer.name}
          </p>
        </div>
        <AiTag className="whitespace-nowrap">Built from your conversation</AiTag>
      </header>

      <div className="mx-6 mb-2 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
          <motion.div
            className="ai-gradient h-full rounded-full"
            animate={{ width: `${(filled / scenario.fields.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <span className="num whitespace-nowrap text-xs text-muted">
          {filled} of {scenario.fields.length} fields
        </span>
      </div>

      <dl className="grid flex-1 auto-rows-min grid-cols-2 gap-x-2 px-3 pb-3">
        {scenario.fields.map((f) => {
          const v = fields[f.key];
          return (
            <div key={f.key} data-field={f.key} className="relative flex h-[58px] items-center rounded-sm px-3">
              {v ? (
                <>
                  {/* the landing flash: the answer arrives here */}
                  <motion.span
                    key={v.value}
                    className="absolute inset-0 rounded-sm bg-regal/15"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                  />
                  <span className="ai-gradient absolute bottom-3 left-0 top-3 w-[3px] rounded-full" />
                  <div className="relative min-w-0 flex-1 leading-tight">
                    <dt className="flex items-center justify-between gap-2 text-2xs text-muted">
                      <span className="truncate">{f.label}</span>
                      <span className="flex shrink-0 items-center gap-1 text-faint" title={v.sourceLabel}>
                        {v.source === "doc" ? <FileText size={11} /> : <MessageSquare size={11} />}
                        {v.source === "doc" ? "Document" : "Chat"}
                      </span>
                    </dt>
                    <motion.dd
                      key={v.value}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="truncate text-[16px] font-semibold text-ink"
                    >
                      {v.value}
                    </motion.dd>
                  </div>
                </>
              ) : (
                <div className="leading-tight">
                  <dt className="text-2xs text-faint">{f.label}</dt>
                  <dd className="shimmer mt-1.5 h-3 w-32 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
