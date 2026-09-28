import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Clock, FileText } from "lucide-react";
import { actions, allDocs, useStore } from "@/engine/machine";
import type { Doc } from "@/engine/types";
import { cn } from "@/lib";

/** Evidence viewer: the attached document, with the AI's extracted fields boxed. */
export function DocViewer() {
  const scenario = useStore((s) => s.scenario);
  const received = useStore((s) => s.received);
  const activeDoc = useStore((s) => s.activeDoc);
  const missingNamed = useStore((s) => !!s.fields[s.scenario.evidence.missingFill.field]);
  const docs = allDocs(scenario);
  const active = docs.find((d) => d.id === activeDoc);

  return (
    <section className="flex min-h-0 flex-col rounded-lg bg-page text-ink shadow-card">
      <header className="flex items-center justify-between px-6 pb-3 pt-5">
        <h3 className="text-lg font-semibold">Evidence</h3>
        <span className="num text-xs text-muted">
          {received.length} of {docs.length} received
        </span>
      </header>

      <div className="flex gap-1.5 px-6 pb-4">
        {docs.map((d) => {
          const state = received.includes(d.id) ? "read" : d.id === scenario.evidence.missing.id && missingNamed ? "missing" : "waiting";
          return (
            <button
              key={d.id}
              onClick={() => actions.showDoc(d.id)}
              className={cn(
                "flex h-8 min-w-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs transition-colors",
                state === "read" && (d.id === activeDoc ? "bg-primary font-medium text-white" : "bg-info font-medium text-primary"),
                state === "waiting" && "bg-surface text-faint",
                state === "missing" && "bg-caution-bg text-caution"
              )}
            >
              {state === "read" ? <Check size={13} strokeWidth={2.5} /> : state === "missing" ? <AlertCircle size={13} /> : <Clock size={13} />}
              <span className="truncate">{d.name}</span>
            </button>
          );
        })}
      </div>

      <div data-drop="viewer" className="relative mx-6 mb-6 flex-1 overflow-hidden rounded bg-surface p-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-full"
            >
              <Paper doc={active} />
            </motion.div>
          ) : (
            <motion.div key="empty" exit={{ opacity: 0 }} className="grid h-full place-items-center text-faint">
              <div className="flex flex-col items-center gap-2">
                <FileText size={30} strokeWidth={1.5} />
                <span className="text-sm">Documents open here as they're attached</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** A document rendered as paper. Stays white whatever the theme. */
function Paper({ doc }: { doc: Doc }) {
  return (
    <div className="relative mx-auto h-full max-w-[520px] overflow-hidden rounded-sm bg-white px-8 py-5 text-neutral-900 shadow-[0_6px_24px_rgb(0_40_100/0.10)]">
      <div className="flex items-start justify-between border-b border-neutral-200 pb-3">
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wide">{doc.header.title}</p>
          <p className="text-2xs text-neutral-500">{doc.header.subtitle}</p>
        </div>
        {doc.header.ref && <span className="num text-2xs text-neutral-500">{doc.header.ref}</span>}
      </div>

      {doc.kind === "photo" ? (
        <Photo doc={doc} />
      ) : (
        <div className="mt-7 space-y-7 text-xs">
          {doc.rows.map((r, i) => {
            const row = (
              <div className="grid grid-cols-[130px_1fr] gap-2">
                <span className="text-neutral-500">{r.k}</span>
                <span className="font-medium">{r.v}</span>
              </div>
            );
            return r.field ? (
              <Extract key={i} field={r.field} tag={r.tag ?? ""} delay={0.5 + i * 0.25}>
                {row}
              </Extract>
            ) : (
              <div key={i}>{row}</div>
            );
          })}
          <div className="space-y-2 pt-1">
            <div className="h-2 w-full rounded-full bg-neutral-200" />
            <div className="h-2 w-11/12 rounded-full bg-neutral-200" />
          </div>
        </div>
      )}
    </div>
  );
}

/** A gradient box around text the AI pulled out, labelled with the field it fed. */
function Extract({ field, tag, delay, children }: { field: string; tag: string; delay: number; children: React.ReactNode }) {
  return (
    <div className="relative">
      <motion.div
        data-extract={field}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.35 }}
        className="absolute -inset-x-2 -inset-y-1.5 rounded-[6px] border-[1.5px] border-regal/70 bg-regal/[0.06]"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.35 }}
        className="ai-gradient absolute -left-2 -top-[22px] rounded-t-[4px] px-1.5 text-[10px] font-semibold leading-[16px] text-white"
      >
        {tag}
      </motion.span>
      <div className="relative">{children}</div>
    </div>
  );
}

/** Photo evidence: portrait photos side by side, each with the AI's marked-up regions. */
function Photo({ doc }: { doc: Doc }) {
  return (
    <div className="mt-4 flex justify-center gap-3">
      {doc.photos?.map((p, pi) => (
        <div key={pi} className="relative aspect-[3/4] h-[270px] overflow-hidden rounded-[8px] bg-neutral-200">
          <img src={p.src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
          {p.marks.map((m, i) => (
            <motion.div
              key={i}
              data-extract={m.field}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (pi + i) * 0.35, duration: 0.35 }}
              className="absolute rounded-[6px] border-2 border-white bg-regal/15 shadow-[0_0_0_2px_rgb(var(--regal))]"
              style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%` }}
            >
              {/* label sits above the box, or below it when the box is near the top edge */}
              <span
                className={cn(
                  "ai-gradient absolute left-0 whitespace-nowrap rounded-[4px] px-1.5 text-[10px] font-semibold leading-[16px] text-white",
                  m.y < 20 ? "top-full mt-1" : "-top-[20px]"
                )}
              >
                {m.tag}
              </span>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
