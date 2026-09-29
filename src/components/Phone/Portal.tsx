import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { actions, useStore } from "@/engine/machine";
import logo from "@/assets/uoi-logo.png";
import { CarIcon, TravelIcon } from "./PolicyIcons";

/** UOI customer portal home, signed in. The claim starts from the travel policy card,
    so the assistant already knows who the customer is and what they're covered for.
    Styled after the customer portal (apphianeo/customerportal). */
export function Portal() {
  const scenario = useStore((s) => s.scenario);
  const { customer, policy } = scenario;
  // Two letters from the name she goes by ("Wei Ling" -> "WL")
  const initials = customer.first
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

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
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-success">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-success text-white">
          <Check size={11} strokeWidth={3.5} />
        </span>
        Signed in with Singpass
      </p>

      <p className="mt-7 text-sm font-semibold text-ink">Your coverage</p>

      {/* The policy the claim is about */}
      <div className="mt-3 rounded-lg bg-page p-4 shadow-card ring-1 ring-primary/15">
        <PolicyRow icon={<TravelIcon />} name={policy.name} number={policy.number} detail={`${policy.destination} · ${policy.period}`} />
        <button
          data-portal-claim
          onClick={(e) => actions.startClaim(e.currentTarget)}
          className="mt-4 h-12 w-full rounded-full bg-primary text-base font-semibold text-white shadow-pop active:scale-[0.98]"
        >
          Make a claim
        </button>
      </div>

      {/* Another policy, same card layout as above */}
      <div className="mt-3 rounded-lg bg-page p-4 shadow-card">
        <PolicyRow icon={<CarIcon />} name="UniCar" number="PNF320104124A23" detail="Private car · Renews Mar 2027" />
        <span className="mt-4 flex h-12 w-full items-center justify-center rounded-full text-base font-medium text-primary ring-1 ring-primary/25">
          View policy
        </span>
      </div>

      <p className="mt-auto text-center text-2xs text-faint">UOI customer portal</p>
    </motion.div>
  );
}

/** One policy: filled icon, name with status pill, number and detail. Same layout on every card. */
function PolicyRow({ icon, name, number, detail }: { icon: React.ReactNode; name: string; number: string; detail: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-info text-primary">{icon}</span>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-ink">{name}</span>
          <span className="rounded-full bg-success-bg px-2 py-0.5 text-2xs font-medium text-success">In force</span>
        </div>
        <span className="num mt-1 block text-xs text-muted">{number}</span>
        <span className="mt-0.5 block text-xs text-muted">{detail}</span>
      </div>
    </div>
  );
}
