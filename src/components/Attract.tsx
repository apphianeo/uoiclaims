import { AnimatePresence, motion } from "framer-motion";
import { Luggage, Wallet } from "lucide-react";
import { SCENARIOS } from "@/scenarios";
import { actions, useStore } from "@/engine/machine";
import { AiOrb } from "@/components/Shared/Ai";

const ICONS = { wallet: Wallet, luggage: Luggage };

/** Idle loop overlay and scenario picker. The ghost claim plays underneath. */
export function Attract() {
  const phase = useStore((s) => s.phase);
  const show = phase === "attract" || phase === "picker";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="attract"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-50 grid place-items-center bg-night/55 backdrop-blur-[3px]"
          onClick={() => phase === "attract" && actions.openPicker()}
        >
          <motion.div
            layout
            className="flex w-[880px] flex-col items-center rounded-xl bg-page/95 px-16 py-14 text-center shadow-pop ring-1 ring-line"
            onClick={(e) => e.stopPropagation()}
          >
            <AiOrb size={64} />
            <AnimatePresence mode="wait" initial={false}>
              {phase === "attract" ? (
                <motion.div key="hello" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink">
                    Your claim, our view
                    <br />
                    <span className="text-primary">on the same screen</span>
                  </h1>
                  <p className="mx-auto mt-4 max-w-[600px] text-lg text-muted">
                    Make a travel claim on the phone on the left. On the right, you'll see exactly what your UOI claims officer sees, as it happens.
                  </p>
                  <button
                    onClick={() => actions.openPicker()}
                    className="mt-9 h-16 rounded-full bg-primary px-12 text-xl font-semibold text-white shadow-pop"
                  >
                    Start a claim
                  </button>
                </motion.div>
              ) : (
                <motion.div key="pick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full">
                  <h2 className="mt-6 text-2xl font-bold text-ink">What happened on your trip?</h2>
                  <p className="mt-2 text-base text-muted">Pick one. It takes about two minutes.</p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {SCENARIOS.map((s) => {
                      const Icon = ICONS[s.picker.icon];
                      return (
                        <button
                          key={s.id}
                          onClick={() => actions.start(s.id)}
                          className="flex flex-col items-start gap-4 rounded-lg bg-surface p-6 text-left ring-1 ring-line transition hover:ring-primary/40 active:scale-[0.98]"
                        >
                          <span className="grid h-12 w-12 place-items-center rounded-[12px] bg-info text-primary">
                            <Icon size={24} />
                          </span>
                          <span>
                            <span className="block text-lg font-semibold leading-snug text-ink">{s.picker.label}</span>
                            <span className="mt-1 block text-sm text-muted">{s.picker.hint}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => actions.reset()} className="mt-6 h-12 px-6 text-sm text-muted">
                    Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
