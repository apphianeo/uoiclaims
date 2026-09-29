import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, ShieldCheck, Smartphone } from "lucide-react";
import { payableOf, useStore, type LineState } from "@/engine/machine";
import { AiTag } from "@/components/Shared/Ai";
import { cn, sgd } from "@/lib";

/* The same assessment, rendered on both sides from the same state.
   Desk: rules, clause references and a confidence note. Phone: plain language. */

function useAssessment() {
  const lines = useStore((s) => s.lines);
  const prevPayable = useStore((s) => s.prevPayable);
  const a = useStore((s) => s.scenario.assessment);
  const subtotal = lines?.reduce((s, l) => s + l.eligible, 0) ?? 0;
  return { lines, a, subtotal, payable: payableOf(lines, a.excess), prevPayable };
}

/** An amount that shows its old value struck through after a change. */
function Amount({ value, prev, className, gradient }: { value: number; prev?: number | null; className?: string; gradient?: boolean }) {
  const changed = prev != null && prev !== value;
  return (
    <span className={cn("num inline-flex items-baseline justify-end gap-2", className)}>
      {changed && <span className="text-[0.8em] font-normal text-faint line-through">{sgd(prev!)}</span>}
      <motion.span
        key={value}
        className={cn("inline-block", gradient && "ai-text")}
        initial={changed ? { scale: 1.3, opacity: 0.3 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {sgd(value)}
      </motion.span>
    </span>
  );
}

const LimitNote = ({ l, size = 13 }: { l: LineState; size?: number }) =>
  l.limited ? <Info size={size} className="shrink-0" /> : <Check size={size} strokeWidth={2.5} className="shrink-0" />;

/* ───────────────────────────── Desk ───────────────────────────── */

export function AssessmentCard() {
  const { lines, a, subtotal, payable, prevPayable } = useAssessment();
  const backed = lines?.filter((l) => l.backed).length ?? 0;
  const first = useStore((s) => s.scenario.customer.first);

  return (
    <section className="relative min-h-[196px] overflow-hidden rounded-lg bg-page text-ink shadow-card">
      {/* AI-produced: a thin brand-gradient edge once the assessment exists */}
      {lines && <span className="ai-gradient absolute inset-x-0 top-0 z-10 h-[3px]" />}
      <AnimatePresence mode="wait" initial={false}>
        {!lines ? (
          <motion.div key="empty" exit={{ opacity: 0 }} className="flex h-[196px] flex-col items-center justify-center gap-2 text-faint">
            <span className="text-lg font-semibold text-muted">Assessment</span>
            <span className="text-sm">Appears here, and on the customer's phone, once the evidence is in.</span>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-[1fr_300px]"
          >
            <div className="min-w-0">
              <header className="flex items-center justify-between gap-4 px-6 pb-3 pt-4">
                <div className="flex min-w-0 items-baseline gap-3">
                  <h3 className="text-lg font-semibold">Assessment</h3>
                  <span className="truncate text-2xs text-muted">{a.section}</span>
                </div>
                <AiTag icon={Smartphone} className="whitespace-nowrap">Same card on the phone</AiTag>
              </header>
              <table className="num w-full text-sm">
                <thead className="text-left text-2xs text-muted">
                  <tr className="border-y border-line">
                    <th className="py-2 pl-6 font-medium">Item</th>
                    <th className="px-3 py-2 text-right font-medium">Claimed</th>
                    <th className="px-3 py-2 font-medium">Rule applied</th>
                    <th className="px-3 py-2 font-medium">Clause</th>
                    <th className="py-2 pl-3 pr-6 text-right font-medium">Eligible</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l) => (
                    <tr key={l.id} className={cn("border-b border-line last:border-0 transition-colors duration-700", l.prev && "bg-info/50")}>
                      <td className="whitespace-nowrap py-2 pl-6 font-medium">{l.item}</td>
                      <td className="px-3 py-2 text-right text-muted">{sgd(l.claimed)}</td>
                      <td className="px-3 py-2">
                        {l.prev && <span className="mr-2 text-xs text-faint line-through">{l.prev.rule}</span>}
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-[6px] px-2 py-0.5",
                            l.limited ? "bg-caution-bg font-medium text-caution" : "text-ink"
                          )}
                        >
                          <LimitNote l={l} /> {l.rule}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted">§{l.clause}</td>
                      <td className="whitespace-nowrap py-2 pl-3 pr-6 text-right text-base font-semibold">
                        <Amount value={l.eligible} prev={l.prev?.eligible} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="num flex flex-col bg-surface/60 px-6 py-4">
              <p className="mb-3 flex items-start gap-1.5 text-2xs leading-snug text-success">
                <ShieldCheck size={14} className="shrink-0" /> Condition met: {a.condition.toLowerCase()}
              </p>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Eligible total</dt>
                  <dd className="font-medium">
                    <Amount value={subtotal} prev={prevPayable != null ? prevPayable + a.excess : null} />
                  </dd>
                </div>
                {a.excess > 0 && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-muted">Excess</dt>
                      <dd className="font-medium">−{sgd(a.excess)}</dd>
                    </div>
                    <p className="text-2xs leading-snug text-faint">Excess: the first {sgd(a.excess)} of any claim, which you pay yourself.</p>
                  </>
                )}
              </dl>
              <div className="mt-auto border-t border-line pt-3">
                <p className="text-xs text-muted">Payable to {first}</p>
                <Amount value={payable} prev={prevPayable} gradient className="text-[42px] font-bold leading-none tracking-tight" />
                <div className="mt-3 flex items-center gap-2 text-2xs text-muted">
                  <span className="flex gap-0.5">
                    {lines.map((l) => (
                      <span key={l.id} className={l.backed ? "ai-gradient h-1.5 w-5 rounded-full" : "h-1.5 w-5 rounded-full bg-chip"} />
                    ))}
                  </span>
                  {backed === lines.length
                    ? "High confidence · every amount backed by documents"
                    : `High confidence · ${lines.length - backed} amount${lines.length - backed > 1 ? "s" : ""} without proof, lower limit applied`}
                </div>
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ───────────────────────────── Phone ───────────────────────────── */

export function PhoneAssessment() {
  const { lines, a, payable, prevPayable } = useAssessment();
  if (!lines) return null;
  return (
    <div data-phone-assessment className="relative w-full overflow-hidden rounded-[20px] bg-page shadow-card ring-1 ring-regal/20">
      <span className="ai-gradient absolute inset-x-0 top-0 h-[3px]" />
      <div className="ai-tint flex items-center justify-between px-4 py-2.5">
        <span className="text-sm font-semibold">Your assessment</span>
        <span className="text-2xs font-medium text-primary">Same as UOI sees</span>
      </div>
      <ul className="divide-y divide-line px-4">
        {lines.map((l) => (
          <li key={l.id} className={cn("py-2.5 transition-colors duration-700", l.prev && "-mx-4 bg-info/50 px-4")}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium">{l.item}</span>
              <Amount value={l.eligible} prev={l.prev?.eligible} className="text-base font-semibold" />
            </div>
            <div className={cn("mt-0.5 flex items-center gap-1.5 text-xs", l.limited ? "text-caution" : "text-muted")}>
              <LimitNote l={l} size={12} />
              <span>
                {l.plain} <span className="num text-faint">You claimed {sgd(l.claimed)}.</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="num space-y-1 border-t border-line bg-surface/70 px-4 py-3 text-sm">
        {a.excess > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-muted">Excess</span>
              <span>−{sgd(a.excess)}</span>
            </div>
            <p className="text-2xs leading-snug text-faint">The first {sgd(a.excess)} of any claim, which you pay yourself.</p>
          </>
        )}
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-semibold">You'll receive</span>
          <Amount value={payable} prev={prevPayable} gradient className="text-2xl font-bold" />
        </div>
      </div>
    </div>
  );
}
