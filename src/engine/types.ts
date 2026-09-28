// Scenario content types. Everything a scenario needs lives in data that
// matches these types; the UI renders whatever a scenario provides.

/** A slot in the officer's claim file. */
export type FieldDef = { key: string; label: string };

export type Chip = {
  id: string;
  label: string;
  /** What lands in the claim file. Defaults to the label. */
  value?: string;
};

export type Question = {
  id: string;
  /** The AI's question. */
  ask: string;
  chips: Chip[];
  /** Multi-select: which chips start selected, and the confirm button text. */
  multi?: { preselect: string[]; confirm: string };
  /** Claim file field this answer fills. */
  field: string;
  /** Acknowledgement after the answer. Per chip, or one for all. */
  ack?: string | Record<string, string>;
  /** Extra AI messages for particular chips (e.g. "Not yet" on a police report). */
  detour?: Record<string, string[]>;
};

export type DocRow = {
  k: string;
  v: string;
  /** Claim file field this row was extracted into. Draws a highlight and connector. */
  field?: string;
  /** Label on the highlight box. */
  tag?: string;
};

export type Doc = {
  id: string;
  /** Full name, used in chat and the evidence list. */
  name: string;
  kind: "form" | "receipt" | "photo";
  header: { title: string; subtitle: string; ref?: string };
  rows: DocRow[];
  /** Photo documents: the image (bundled asset URL) ... */
  image?: string;
  /** ... and marked-up regions, as percentages of the image. */
  marks?: { x: number; y: number; w: number; h: number; tag: string; field?: string }[];
  /** AI's plain-words confirmation once attached. */
  confirm: string;
  /** Claim file values this document provides. */
  fills: { field: string; value: string }[];
};

export type Line = {
  id: string;
  item: string;
  claimed: number;
  /** Desk wording. */
  rule: string;
  /** Phone wording: one plain sentence. */
  plain: string;
  clause: string;
  eligible: number;
  /** A policy limit reduced the amount. */
  limited?: boolean;
  /** Supported by a document. Drives the confidence note. */
  backed: boolean;
};

export type Scenario = {
  id: string;
  picker: { label: string; hint: string; icon: "wallet" | "luggage" };
  customer: { name: string; first: string };
  policy: { name: string; number: string; period: string };
  claimRef: string;
  fields: FieldDef[];
  opener: string[];
  questions: Question[];
  evidence: {
    ask: string;
    docs: Doc[];
    /** The document that is missing at first. */
    missing: Doc;
    /** AI names what's missing without blocking progress. */
    missingNote: string;
    /** Claim file value to show while it's missing. */
    missingFill: { field: string; value: string };
  };
  assessment: {
    section: string;
    condition: string;
    intro: string;
    lines: Line[];
    excess: number;
  };
  /** "Add a document" branch: attaching the missing document changes one line. */
  addDoc: { ask: string; lineId: string; update: Partial<Line>; after: string };
  callback: { time: string; after: string };
  review: { checklist: string[] };
};
