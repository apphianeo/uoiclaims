import { AnimatePresence, motion } from "framer-motion";
import { PhoneCall } from "lucide-react";
import { useStore } from "@/engine/machine";
import { ClaimFile } from "./ClaimFile";
import { DocViewer } from "./DocViewer";
import { Review } from "./Review";
import { AssessmentCard } from "@/components/Shared/AssessmentCard";

/** Officer workbench: claim file, evidence (or review), and the shared assessment. */
export function Desk() {
  const callback = useStore((s) => s.callback);
  const reviewing = useStore((s) => !!s.review);

  return (
    <div className="flex h-full flex-col gap-6 rounded-xl bg-surface/80 p-7 shadow-pop ring-1 ring-page backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="shrink-0 leading-tight">
          <h2 className="text-xl font-semibold text-ink">UOI Claims Workbench</h2>
          <p className="text-xs text-muted">What your claims officer sees, right now</p>
        </div>

        <AnimatePresence>
          {callback && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-w-0 items-center gap-2 rounded-full bg-info px-4 py-2 text-xs text-primary"
            >
              <PhoneCall size={16} className="shrink-0" />
              <span>
                <b className="font-semibold">Callback requested.</b> Rachel has the full claim file, so you won't need to repeat anything.
              </span>
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex shrink-0 items-center gap-3 rounded-full bg-page py-1.5 pl-1.5 pr-5 shadow-card">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-info text-sm font-semibold text-primary">RL</span>
          <span className="leading-tight">
            <span className="block text-sm font-medium text-ink">Rachel Lim</span>
            <span className="block text-2xs text-muted">Claims officer · Travel</span>
          </span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-6">
        <ClaimFile />
        {reviewing ? <Review /> : <DocViewer />}
      </div>

      <AssessmentCard />
    </div>
  );
}
