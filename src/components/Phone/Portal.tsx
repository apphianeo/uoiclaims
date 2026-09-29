import { motion } from "framer-motion";
import { BadgeCheck, Car, ChevronRight, Plane } from "lucide-react";
import { actions, useStore } from "@/engine/machine";
import logo from "@/assets/uoi-logo.png";

/** UOI customer portal home, signed in. The claim starts from the travel policy card,
    so the assistant already knows who the customer is and what they're covered for.
    Styled after the customer portal (apphianeo/customerportal). */
export function Portal() {
  const scenario = useStore((s) => s.scenario);
  const { customer, policy } = scenario;
  const initials = customer.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 bottom-0 top-12 z-10 flex flex-col bg-surface px-5 pb-8"
    >
      <div className="flex items-center justify-between py-3">
        <img src={logo} alt="UOI" className="h-8 w-auto" draggable={false} />
        <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-info text-sm font-semibold text-primary">{initials}</span>
      </div>

      <p className="mt-3 text-2xl font-semibold text-ink">Good evening, {customer.first}</p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-success">
        <BadgeCheck size={14} /> Signed in with Singpass
      </p>

      <p className="mt-7 text-sm font-semibold text-ink">Your coverage</p>

      {/* The policy the claim is about */}
      <div className="mt-3 rounded-lg bg-page p-4 shadow-card ring-1 ring-primary/15">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-info text-primary">
            <Plane size={20} />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center justify-between gap-2">
              <span className="text-base font-semibold text-ink">{policy.name}</span>
              <span className="rounded-full bg-success-bg px-2 py-0.5 text-2xs font-medium text-success">In force</span>
            </div>
            <span className="num mt-1 block text-xs text-muted">{policy.number}</span>
            <span className="mt-0.5 block text-xs text-muted">
              {policy.destination} · {policy.period}
            </span>
          </div>
        </div>
        <button
          data-portal-claim
          onClick={(e) => actions.startClaim(e.currentTarget)}
          className="mt-4 h-12 w-full rounded-full bg-primary text-base font-semibold text-white shadow-pop active:scale-[0.98]"
        >
          Make a claim
        </button>
      </div>

      {/* Another policy, for realism */}
      <div className="mt-3 flex items-center gap-3 rounded-lg bg-page p-4 opacity-70 shadow-card">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-surface text-muted">
          <Car size={20} />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <span className="block text-base font-semibold text-ink">UniCar</span>
          <span className="num mt-1 block text-xs text-muted">PNF320104124A23 · In force</span>
        </div>
        <ChevronRight size={18} className="text-faint" />
      </div>

      <p className="mt-auto text-center text-2xs text-faint">UOI customer portal</p>
    </motion.div>
  );
}
