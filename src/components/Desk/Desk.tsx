import { ClaimFile } from "./ClaimFile";
import { DocViewer } from "./DocViewer";
import { AssessmentCard } from "@/components/Shared/AssessmentCard";

/** Officer workbench: claim file, evidence, and the shared assessment. */
export function Desk() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl bg-surface p-6">
      <div className="flex items-center justify-between px-2">
        <div className="leading-tight">
          <h2 className="text-xl font-semibold text-ink">UOI Claims Workbench</h2>
          <p className="text-xs text-muted">What your claims officer sees, right now</p>
        </div>
        <div className="flex items-center gap-3 rounded-full bg-page py-1.5 pl-1.5 pr-5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-chip text-sm font-semibold text-ink">RL</span>
          <span className="leading-tight">
            <span className="block text-sm font-medium text-ink">Rachel Lim</span>
            <span className="block text-2xs text-muted">Claims officer · Travel</span>
          </span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.12fr] gap-4">
        <ClaimFile />
        <DocViewer />
      </div>

      <AssessmentCard />
    </div>
  );
}
