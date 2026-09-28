// Static preview content for the milestone 1 layout. Replaced by the scenario
// engine (src/scenarios/*.ts) from milestone 2.

export type PreviewField = { label: string; value?: string; source?: string; from?: "chat" | "doc" };

export const FIELDS: PreviewField[] = [
  { label: "Customer safe", value: "Yes, at hotel", source: "Chat · 9:41", from: "chat" },
  { label: "Date of incident", value: "12 Nov 2026", source: "Chat · 9:42", from: "chat" },
  { label: "Location", value: "Bangkok, Thailand", source: "Police report", from: "doc" },
  { label: "Items taken" },
  { label: "Police report" },
];

export const DOCS = [
  { name: "Police report", state: "read" as const },
  { name: "Wallet receipt", state: "waiting" as const },
  { name: "Passport receipt", state: "waiting" as const },
  { name: "Phone receipt", state: "missing" as const },
];

export type Line = { item: string; claimed: number; rule: string; clause: string; eligible: number; limited?: boolean; note?: string };

export const LINES: Line[] = [
  { item: "Wallet", claimed: 250, rule: "Receipt provided", clause: "5.1", eligible: 250 },
  { item: "Cash", claimed: 300, rule: "Cash limit S$200", clause: "5.3(b)", eligible: 200, limited: true, note: "Cash is covered up to S$200 per trip." },
  { item: "Passport replacement", claimed: 150, rule: "Receipt provided", clause: "5.4", eligible: 150 },
  { item: "Phone", claimed: 900, rule: "No receipt: up to S$100 per item", clause: "5.2(c)", eligible: 100, limited: true, note: "Without proof of purchase, each item is capped at S$100." },
];

export const EXCESS = 100;
