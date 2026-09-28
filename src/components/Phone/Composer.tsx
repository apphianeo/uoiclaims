import { AnimatePresence, motion } from "framer-motion";
import { Check, FileImage, FileText, Lock, Phone as PhoneIcon, Plus, Receipt } from "lucide-react";
import { actions, payableOf, useStore } from "@/engine/machine";
import type { Doc } from "@/engine/types";
import { cn, sgd } from "@/lib";

/** Bottom of the phone: whatever the visitor can do right now. */
export function Composer() {
  const prompt = useStore((s) => s.prompt);
  const lines = useStore((s) => s.lines);
  const excess = useStore((s) => s.scenario.assessment.excess);
  const key = prompt ? (prompt.type === "chips" ? prompt.q.id : prompt.type) : "none";

  return (
    <div className="shrink-0 bg-surface px-4 pb-7 pt-2">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
        >
          {prompt?.type === "chips" && (
            <>
              {prompt.q.multi && <p className="mb-2 text-xs text-muted">Select all that apply</p>}
              <div className="flex flex-wrap gap-2">
                {prompt.q.chips.map((c) => {
                  const on = prompt.q.multi && prompt.selected.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      data-chip={c.id}
                      onClick={(e) => actions.pickChip(c.id, e.currentTarget)}
                      className={cn(
                        "flex h-12 items-center gap-1.5 rounded-full px-5 text-base font-medium shadow-card ring-1 transition-colors",
                        on ? "bg-primary text-white ring-primary" : "bg-page text-primary ring-primary/20 active:bg-info"
                      )}
                    >
                      {on && <Check size={16} strokeWidth={3} />}
                      {c.label}
                    </button>
                  );
                })}
              </div>
              {prompt.q.multi && (
                <button
                  data-confirm
                  disabled={!prompt.selected.length}
                  onClick={(e) => actions.confirmMulti(e.currentTarget)}
                  className="mt-3 h-12 w-full rounded-full bg-primary text-base font-semibold text-white disabled:opacity-40"
                >
                  {prompt.q.multi.confirm}
                </button>
              )}
              <PrivacyNote />
            </>
          )}

          {prompt?.type === "tray" && (
            <>
              <p className="mb-2 text-xs text-muted">Tap each document to attach it</p>
              <div className="flex items-stretch gap-2">
                {prompt.docs.map((d) => (
                  <TrayDoc key={d.id} doc={d} attached={prompt.attached.includes(d.id)} busy={prompt.busy} />
                ))}
              </div>
            </>
          )}

          {prompt?.type === "decision" && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => actions.decide("accept")}
                className="num h-14 rounded-full bg-primary text-lg font-semibold text-white shadow-pop"
              >
                Accept {sgd(payableOf(lines, excess))}
              </button>
              <div className="flex gap-2">
                {prompt.canAddDoc && (
                  <button
                    onClick={() => actions.decide("add")}
                    className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-page text-base font-medium text-primary shadow-card ring-1 ring-primary/20"
                  >
                    <Plus size={18} /> Add a document
                  </button>
                )}
                <button
                  onClick={() => actions.decide("talk")}
                  className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-page text-base font-medium text-primary shadow-card ring-1 ring-primary/20"
                >
                  <PhoneIcon size={17} /> Talk to someone
                </button>
              </div>
            </div>
          )}

          {!prompt && <div className="h-12 rounded-full bg-page/70 ring-1 ring-line" />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const DOC_ICON = { form: FileText, receipt: Receipt, photo: FileImage };

function TrayDoc({ doc, attached, busy }: { doc: Doc; attached: boolean; busy: boolean }) {
  const Icon = DOC_ICON[doc.kind];
  return (
    <button
      data-tray={doc.id}
      disabled={attached || busy}
      onClick={(e) => actions.attachDoc(doc.id, e.currentTarget)}
      className={cn(
        "relative flex min-h-[118px] min-w-0 flex-1 flex-col items-center justify-start gap-2 rounded-lg px-2 pb-3 pt-4 text-center shadow-card ring-1 transition",
        attached ? "bg-info/60 ring-primary/30" : "bg-page ring-line active:scale-[0.97]",
        busy && !attached && "opacity-60"
      )}
    >
      <span className={cn("grid h-12 w-10 shrink-0 place-items-center rounded-[8px]", attached ? "bg-primary text-white" : "bg-surface text-primary")}>
        {attached ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
      </span>
      <span className="line-clamp-2 text-xs font-medium leading-tight text-ink">{doc.name}</span>
      <span className={cn("text-2xs", attached ? "text-primary" : "text-faint")}>{attached ? "Attached" : "Tap to attach"}</span>
    </button>
  );
}

function PrivacyNote() {
  return (
    <p className="mt-3 flex items-center gap-1.5 text-2xs text-faint">
      <Lock size={12} /> Your officer sees the same claim file.
    </p>
  );
}
