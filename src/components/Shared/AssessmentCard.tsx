import { Info, ShieldCheck } from "lucide-react";
import { EXCESS, LINES } from "@/data/preview";
import { AiTag } from "@/components/Shared/Ai";
import { sgd } from "@/lib";

/** Assessment card, desk variant. The phone gets a plain-language variant of the same lines. */
export function AssessmentCard() {
  const subtotal = LINES.reduce((s, l) => s + l.eligible, 0);
  const payable = subtotal - EXCESS;

  return (
    <section className="grid grid-cols-[1fr_320px] overflow-hidden rounded-lg bg-page text-ink">
      <div className="min-w-0">
        <header className="flex items-center justify-between gap-4 px-6 pb-3 pt-5">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Assessment</h3>
            <AiTag>Same card on the customer's phone</AiTag>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-success">
            <ShieldCheck size={15} /> Section 5 · Theft reported to police within 24 hours
          </span>
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
            {LINES.map((l) => (
              <tr key={l.item} className="border-b border-line last:border-0">
                <td className="py-2.5 pl-6 font-medium">{l.item}</td>
                <td className="px-3 py-2.5 text-right text-muted">{sgd(l.claimed)}</td>
                <td className="px-3 py-2.5">
                  {l.limited ? (
                    <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-caution-bg px-2 py-0.5 font-medium text-caution">
                      <Info size={13} /> {l.rule}
                    </span>
                  ) : (
                    l.rule
                  )}
                </td>
                <td className="px-3 py-2.5 text-xs text-muted">§{l.clause}</td>
                <td className="py-2.5 pl-3 pr-6 text-right text-base font-semibold">{sgd(l.eligible)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* totals */}
      <aside className="num flex flex-col bg-surface/60 px-6 py-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Eligible total</dt>
            <dd className="font-medium">{sgd(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Excess</dt>
            <dd className="font-medium">−{sgd(EXCESS)}</dd>
          </div>
          <p className="text-2xs leading-snug text-faint">Excess: the first S$100 of any claim, which you pay yourself.</p>
        </dl>
        <div className="mt-auto border-t border-line pt-4">
          <p className="text-xs text-muted">Payable to Wei Ling</p>
          <p className="ai-text text-[44px] font-bold leading-none tracking-tight">{sgd(payable)}</p>
          <div className="mt-3 flex items-center gap-2 text-2xs text-muted">
            <span className="flex gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={i < 3 ? "ai-gradient h-1.5 w-5 rounded-full" : "h-1.5 w-5 rounded-full bg-chip"} />
              ))}
            </span>
            High confidence · 3 of 4 lines backed by documents
          </div>
        </div>
      </aside>
    </section>
  );
}
