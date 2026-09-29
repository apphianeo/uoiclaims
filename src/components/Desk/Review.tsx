import { AnimatePresence, motion } from "framer-motion";
import { Check, MousePointer2, Timer } from "lucide-react";
import { actions, payableOf, useStore } from "@/engine/machine";
import { cn, sgd } from "@/lib";

const clock = (t?: number) =>
  t ? new Date(t).toLocaleTimeString("en-SG", { hour: "numeric", minute: "2-digit" }).toLowerCase() : "";

/** Officer review as a status timeline: what already happened, the checks, and the one
    action left, with "Approve & pay" sitting inside that step. */
export function Review() {
  const review = useStore((s) => s.review)!;
  const scenario = useStore((s) => s.scenario);
  const lines = useStore((s) => s.lines);
  const stamps = useStore((s) => s.stamps);
  const staff = useStore((s) => s.staff);
  const payable = payableOf(lines, scenario.assessment.excess);
  const list = scenario.review.checklist;
  const checksDone = review.checked >= list.length;
  const section = scenario.assessment.section.split(",")[0];

  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative flex min-h-0 flex-col overflow-hidden rounded-lg bg-page px-6 pb-5 pt-5 text-ink shadow-card"
    >
      <h3 className="text-lg font-semibold">Officer review</h3>

      <ol className="mt-4 flex-1">
        <Step done title="Claim submitted" time={clock(stamps.submitted)}>
          From the customer's phone, with {scenario.evidence.docs.length} documents
        </Step>
        <Step done title="Assessed" time={clock(stamps.assessed)}>
          {section} applied · {sgd(payable)} payable
        </Step>
        <Step done={checksDone} current={!checksDone} title="Checks">
          <ul className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
            {list.map((item, i) => {
              const ok = i < review.checked;
              return (
                <li key={item} className={cn("flex items-center gap-1.5 text-xs transition-colors", ok ? "text-ink" : "text-faint")}>
                  <motion.span
                    animate={ok ? { scale: [0.6, 1.2, 1] } : { scale: 1 }}
                    className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full", ok ? "bg-success text-white" : "bg-surface")}
                  >
                    {ok && <Check size={10} strokeWidth={3.5} />}
                  </motion.span>
                  {item}
                </li>
              );
            })}
          </ul>
        </Step>
        <Step
          last
          done={review.approved}
          current={checksDone && !review.approved}
          title={review.approved ? "Approved by Rachel Lim" : "Waiting for approval"}
          time={clock(stamps.reviewed)}
        >
          {!review.approved && (
            <>
              <p>
                AI recommends paying <b className="num font-semibold text-ink">{sgd(payable)}</b>. Every line follows {section}.
              </p>
              <div className="relative mt-3">
                <button
                  data-approve
                  disabled={!checksDone || !staff}
                  onClick={() => actions.approve()}
                  className={cn(
                    "num h-12 w-full rounded-full text-base font-semibold text-white transition",
                    checksDone ? "bg-primary shadow-pop" : "bg-primary/35",
                    review.cursor && "scale-[0.98]"
                  )}
                >
                  Approve & pay {sgd(payable)}
                </button>
                {/* Scripted cursor: glides to the button and clicks */}
                <AnimatePresence>
                  {review.cursor && (
                    <motion.span
                      className="pointer-events-none absolute left-1/2 top-4 z-10 text-ink drop-shadow"
                      initial={{ x: 220, y: 70, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1, scale: [1, 1, 0.8, 1] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.3, ease: "easeInOut", scale: { times: [0, 0.75, 0.85, 1], duration: 1.3 } }}
                    >
                      <MousePointer2 size={32} fill="white" strokeWidth={1.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-2xs text-muted">
            <Timer size={12} />
            {staff && checksDone && !review.approved
              ? "Staff mode: waiting for a UOI team member to approve"
              : "Review time: 40 seconds. Everything was already organised."}
          </p>
        </Step>
      </ol>

      {/* Approval stamp */}
      <AnimatePresence>
        {review.approved && (
          <motion.div
            initial={{ opacity: 0, scale: 1.8, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="pointer-events-none absolute right-8 top-5 rounded-[10px] border-[3px] border-success bg-page/90 px-5 py-2 text-center text-success"
          >
            <p className="text-lg font-bold">Approved</p>
            <p className="text-xs font-medium">by Rachel Lim</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Step({
  title,
  time,
  done,
  current,
  last,
  children,
}: {
  title: string;
  time?: string;
  done?: boolean;
  current?: boolean;
  last?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative flex gap-3 pb-4">
      {!last && <span className={cn("absolute left-[11px] top-7 bottom-0 w-[2px]", done ? "bg-success/40" : "bg-line")} />}
      <span
        className={cn(
          "relative mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
          done && "bg-success text-white",
          current && "bg-page ring-2 ring-primary",
          !done && !current && "bg-surface ring-1 ring-line"
        )}
      >
        {done ? <Check size={14} strokeWidth={3} /> : current && <span className="live-pulse h-2 w-2 rounded-full bg-primary" />}
      </span>
      <div className="min-w-0 flex-1 text-sm text-muted">
        <div className="flex items-baseline justify-between gap-3">
          <span className={cn("text-base font-semibold", done || current ? "text-ink" : "text-faint")}>{title}</span>
          {time && <span className="num text-xs text-faint">{time}</span>}
        </div>
        {children}
      </div>
    </li>
  );
}
