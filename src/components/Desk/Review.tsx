import { AnimatePresence, motion } from "framer-motion";
import { Check, MousePointer2, Sparkles, Timer } from "lucide-react";
import { actions, payableOf, useStore } from "@/engine/machine";
import { cn, sgd } from "@/lib";

/** Officer review: the AI's recommendation, a short checklist, and approval. */
export function Review() {
  const review = useStore((s) => s.review)!;
  const scenario = useStore((s) => s.scenario);
  const lines = useStore((s) => s.lines);
  const staff = useStore((s) => s.staff);
  const payable = payableOf(lines, scenario.assessment.excess);
  const list = scenario.review.checklist;
  const ready = review.checked >= list.length;

  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative flex min-h-0 flex-col overflow-hidden rounded-lg bg-page px-6 pb-5 pt-5 text-ink shadow-card"
    >
      <h3 className="text-lg font-semibold">Officer review</h3>

      <div className="ai-tint mt-3 rounded px-4 py-3">
        <p className="flex items-center gap-1.5 text-xs font-medium text-regal">
          <Sparkles size={13} /> AI recommendation
        </p>
        <p className="num mt-1 text-xl font-semibold">Approve and pay {sgd(payable)}</p>
        <p className="text-xs text-muted">Every line follows {scenario.assessment.section.split(",")[0]}. Nothing needs a second look.</p>
      </div>

      <ul className="mt-3 space-y-1.5">
        {list.map((item, i) => {
          const done = i < review.checked;
          return (
            <li key={item} className={cn("flex items-center gap-3 text-sm transition-colors", done ? "text-ink" : "text-faint")}>
              <motion.span
                animate={done ? { scale: [0.6, 1.15, 1] } : { scale: 1 }}
                className={cn("grid h-6 w-6 place-items-center rounded-full", done ? "bg-success text-white" : "bg-surface")}
              >
                {done && <Check size={14} strokeWidth={3} />}
              </motion.span>
              {item}
            </li>
          );
        })}
      </ul>

      <div className="relative mt-auto pt-3">
        <button
          data-approve
          disabled={!ready || review.approved || !staff}
          onClick={() => actions.approve()}
          className={cn(
            "num h-14 w-full rounded-full text-lg font-semibold text-white transition",
            ready ? "bg-primary shadow-pop" : "bg-primary/35",
            review.cursor && "scale-[0.98]"
          )}
        >
          Approve & pay {sgd(payable)}
        </button>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-2xs text-muted">
          <Timer size={13} />
          {staff && ready && !review.approved
            ? "Staff mode: waiting for a UOI team member to approve"
            : "Review time: 40 seconds. Everything was already organised."}
        </p>

        {/* Scripted cursor: glides to the button and clicks */}
        <AnimatePresence>
          {review.cursor && (
            <motion.span
              className="pointer-events-none absolute left-1/2 top-9 z-10 text-ink drop-shadow"
              initial={{ x: 260, y: 90, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: [1, 1, 0.8, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: "easeInOut", scale: { times: [0, 0.75, 0.85, 1], duration: 1.3 } }}
            >
              <MousePointer2 size={34} fill="white" strokeWidth={1.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Approval stamp */}
      <AnimatePresence>
        {review.approved && (
          <motion.div
            initial={{ opacity: 0, scale: 1.8, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="pointer-events-none absolute right-8 top-16 rounded-[10px] border-[3px] border-success bg-page/90 px-5 py-2 text-center text-success"
          >
            <p className="text-lg font-bold">Approved</p>
            <p className="text-xs font-medium">by Rachel Lim</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
