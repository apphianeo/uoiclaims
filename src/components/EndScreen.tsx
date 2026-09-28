import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { actions, otherScenario, payableOf, useStore } from "@/engine/machine";
import { mmss } from "@/components/Shared/ProgressRail";
import { sgd } from "@/lib";

const clock = (t?: number) =>
  t ? new Date(t).toLocaleTimeString("en-SG", { hour: "numeric", minute: "2-digit", second: "2-digit" }).toLowerCase() : "";

/** Closing screen: the visitor's own timeline, and the message. */
export function EndScreen() {
  const phase = useStore((s) => s.phase);
  const stamps = useStore((s) => s.stamps);
  const startedAt = useStore((s) => s.startedAt) ?? 0;
  const scenario = useStore((s) => s.scenario);
  const paid = useStore((s) => payableOf(s.lines, s.scenario.assessment.excess));
  const steps = [
    { label: "Submitted", t: stamps.submitted },
    { label: "Assessed", t: stamps.assessed },
    { label: "Reviewed", t: stamps.reviewed },
    { label: "Paid", t: stamps.paid },
  ];

  return (
    <AnimatePresence>
      {phase === "end" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 grid place-items-center bg-night/60 backdrop-blur-[3px]"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            className="w-[1040px] rounded-xl bg-page px-16 py-14 text-center shadow-pop ring-1 ring-line"
          >
            <p className="num text-base text-muted">
              {sgd(paid)} paid to {scenario.customer.first} in {mmss((stamps.paid ?? 0) - startedAt)}
            </p>
            <h1 className="ai-text mt-2 text-[64px] font-bold leading-tight tracking-tight">Same file. Same reasons. Same day.</h1>

            <ol className="relative mx-auto mt-12 grid max-w-[820px] grid-cols-4">
              <span className="ai-gradient absolute left-[12.5%] right-[12.5%] top-[19px] h-[2px]" />
              {steps.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.18 }}
                  className="relative flex flex-col items-center gap-2"
                >
                  <span className="ai-gradient grid h-10 w-10 place-items-center rounded-full text-white">
                    <Check size={18} strokeWidth={3} />
                  </span>
                  <span className="text-base font-semibold text-ink">{s.label}</span>
                  <span className="num text-sm text-muted">{clock(s.t)}</span>
                  <span className="num text-2xs text-faint">+{mmss((s.t ?? startedAt) - startedAt)}</span>
                </motion.li>
              ))}
            </ol>

            <div className="mt-12 flex justify-center gap-3">
              <button
                onClick={() => actions.start(otherScenario(scenario).id)}
                className="h-14 rounded-full bg-primary px-10 text-lg font-semibold text-white shadow-pop"
              >
                Try the other scenario
              </button>
              <button
                onClick={() => actions.reset()}
                className="flex h-14 items-center gap-2 rounded-full bg-page px-8 text-lg font-medium text-primary ring-1 ring-primary/25"
              >
                <RotateCcw size={18} /> Start over
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
