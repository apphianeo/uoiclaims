import { FileText } from "lucide-react";
import { sgd } from "@/lib";

/** Officer workbench. Milestone 1: static layout with placeholder content. */

const FIELDS: { label: string; value?: string }[] = [
  { label: "Customer safe", value: "Yes, at hotel" },
  { label: "Date of incident", value: "12 Nov 2026" },
  { label: "Location" },
  { label: "Items taken" },
  { label: "Police report" },
];

const LINES = [
  { item: "Wallet", claimed: 250, rule: "Receipt provided", eligible: 250 },
  { item: "Cash", claimed: 300, rule: "Cash limit S$200", eligible: 200, limited: true },
  { item: "Passport replacement", claimed: 150, rule: "Receipt provided", eligible: 150 },
  { item: "Phone", claimed: 900, rule: "No receipt: up to S$100 per item", eligible: 100, limited: true },
];

export function Desk() {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">UOI Claims Workbench</h2>
        <div className="flex items-center gap-3">
          <span className="text-right leading-tight">
            <span className="block text-base font-medium">Rachel Lim</span>
            <span className="block text-xs text-muted">Claims officer</span>
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">RL</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.1fr] gap-5">
        {/* claim file */}
        <section className="flex flex-col rounded-lg border border-line bg-surface">
          <div className="border-b border-line px-6 py-4">
            <h3 className="text-lg font-semibold">Claim file</h3>
            <p className="text-sm text-live">Built from your conversation</p>
          </div>
          <dl className="flex-1 divide-y divide-line px-6">
            {FIELDS.map((f) => (
              <div key={f.label} className="flex h-14 items-center justify-between gap-4">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className={f.value ? "text-base font-medium" : "text-sm text-faint"}>{f.value ?? "Waiting for answer"}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* document viewer */}
        <section className="flex flex-col rounded-lg border border-line bg-sunken">
          <div className="flex items-center justify-between border-b border-line bg-surface px-6 py-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Documents</h3>
            <span className="text-sm text-muted">0 of 3 received</span>
          </div>
          <div className="grid flex-1 place-items-center text-faint">
            <div className="flex flex-col items-center gap-2">
              <FileText size={32} strokeWidth={1.5} />
              <span className="text-sm">Documents appear here as they're attached</span>
            </div>
          </div>
        </section>
      </div>

      {/* assessment */}
      <section className="rounded-lg border border-line bg-surface">
        <div className="flex items-baseline justify-between border-b border-line px-6 py-3">
          <h3 className="text-lg font-semibold">Assessment</h3>
          <span className="text-sm text-muted">Section 5, Loss of personal belongings and travel documents</span>
        </div>
        <table className="num w-full text-base">
          <thead className="text-left text-sm text-muted">
            <tr>
              <th className="px-6 py-2 font-normal">Item</th>
              <th className="px-3 py-2 text-right font-normal">Claimed</th>
              <th className="px-6 py-2 font-normal">Rule applied</th>
              <th className="px-6 py-2 text-right font-normal">Eligible</th>
            </tr>
          </thead>
          <tbody>
            {LINES.map((l) => (
              <tr key={l.item} className="border-t border-line">
                <td className="px-6 py-2">{l.item}</td>
                <td className="px-3 py-2 text-right text-muted">{sgd(l.claimed)}</td>
                <td className="px-6 py-2">
                  <span className={l.limited ? "rounded-sm bg-limit-soft px-2 py-0.5 text-limit" : ""}>{l.rule}</span>
                </td>
                <td className="px-6 py-2 text-right font-medium">{sgd(l.eligible)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
