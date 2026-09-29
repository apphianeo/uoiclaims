import { useSyncExternalStore } from "react";
import type { Chip, Doc, Line, Question, Scenario } from "./types";
import { SCENARIOS } from "@/scenarios";

/* ─────────────────────────────── State ─────────────────────────────── */

export type Phase = "attract" | "picker" | "run" | "end";

export type Msg =
  | { id: number; from: "ai" | "me"; kind: "text"; text: string }
  | { id: number; from: "me"; kind: "doc"; doc: Doc }
  | { id: number; from: "ai"; kind: "read"; doc: Doc }
  | { id: number; from: "ai"; kind: "assessment" }
  | { id: number; from: "ai"; kind: "callback"; time: string };

export type Prompt =
  | { type: "chips"; q: Question; selected: string[] }
  | { type: "tray"; docs: Doc[]; attached: string[]; busy: boolean }
  | { type: "decision"; canAddDoc: boolean }
  | null;

export type FieldVal = { value: string; source: "chat" | "doc"; sourceLabel: string; at: number };
export type LineState = Line & { prev?: { rule: string; eligible: number } };
export type Rect = { x: number; y: number; w: number; h: number };

/** Something travelling from the phone to the desk. */
export type Flight = { id: number; text: string; icon: "chat" | "doc"; from: Rect; to: string };

export type State = {
  phase: Phase;
  ghost: boolean;
  scenario: Scenario;
  rail: number;
  startedAt: number | null;
  messages: Msg[];
  typing: boolean;
  prompt: Prompt;
  fields: Record<string, FieldVal>;
  flight: Flight | null;
  received: string[];
  activeDoc: string | null;
  lines: LineState[] | null;
  prevPayable: number | null;
  callback: boolean;
  review: null | { checked: number; cursor: boolean; approved: boolean };
  paid: boolean;
  stamps: { submitted?: number; assessed?: number; reviewed?: number; paid?: number };
  staff: boolean;
};

const fresh = (scenario: Scenario, phase: Phase, ghost = false): State => ({
  phase,
  ghost,
  scenario,
  rail: 0,
  startedAt: null,
  messages: [],
  typing: false,
  prompt: null,
  fields: {},
  flight: null,
  received: [],
  activeDoc: null,
  lines: null,
  prevPayable: null,
  callback: false,
  review: null,
  paid: false,
  stamps: {},
  staff: state?.staff ?? false,
});

let state: State;
state = fresh(SCENARIOS[0], "attract", true);
const listeners = new Set<() => void>();

export const getState = () => state;
function set(patch: Partial<State> | ((s: State) => Partial<State>)) {
  state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => select(state));
}

/* ──────────────────────────── Derived values ─────────────────────────── */

export const payableOf = (lines: LineState[] | null, excess: number) =>
  lines ? Math.max(0, lines.reduce((s, l) => s + l.eligible, 0) - excess) : 0;

export const scenarioById = (id: string) => SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];


/** All documents a scenario can show, in evidence-list order. */
export const allDocs = (s: Scenario) => [...s.evidence.docs, s.evidence.missing];

/* ─────────────────────────────── Timing ─────────────────────────────── */

// One place to tune pacing. Ghost (attract loop) runs faster.
const T = {
  typingBase: 450,
  typingPerChar: 11,
  typingMax: 1300,
  afterMsg: 350,
  flight: 850,
  docOpen: 550,
  fieldStagger: 380,
  checklistTick: 520,
  cursor: 1500,
  callHold: 3200,
  endDelay: 5500,
};

/* ─────────────────────────────── Director ─────────────────────────────── */

class Cancelled extends Error {}
let runId = 0;
let msgId = 0;
let waiter: { kind: string; resolve: (v: any) => void; reject: (e: any) => void } | null = null;

function cancelRun() {
  runId++;
  waiter?.reject(new Cancelled());
  waiter = null;
}

function sleep(ms: number, id: number) {
  const k = state.ghost ? 0.55 : 1;
  return new Promise<void>((res, rej) =>
    setTimeout(() => (id === runId ? res() : rej(new Cancelled())), ms * k)
  );
}

function waitFor<T>(kind: string, id: number): Promise<T> {
  if (id !== runId) return Promise.reject(new Cancelled());
  return new Promise<T>((resolve, reject) => {
    waiter = { kind, resolve, reject };
  });
}

function resolveWaiter(kind: string, value?: unknown) {
  if (waiter?.kind !== kind) return false;
  const w = waiter;
  waiter = null;
  w.resolve(value);
  return true;
}

/** Measure an element in stage coordinates (the stage is scaled). */
export function stageRect(el: Element | null): Rect | null {
  const stage = document.querySelector("[data-stage]");
  if (!el || !stage) return null;
  const s = stage.getBoundingClientRect();
  const k = s.width / 1920;
  const r = el.getBoundingClientRect();
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}

const now = () => Date.now();
const clock = (t: number) =>
  new Date(t).toLocaleTimeString("en-SG", { hour: "numeric", minute: "2-digit" }).replace(" ", " ").toLowerCase();

type DistOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never;

function push(m: DistOmit<Msg, "id">) {
  set((s) => ({ messages: [...s.messages, { ...m, id: ++msgId } as Msg] }));
}

function run(scenario: Scenario, ghost: boolean) {
  return script(scenario, ghost).catch((e) => {
    if (!(e instanceof Cancelled)) throw e;
  });
}

async function script(scenario: Scenario, ghost: boolean) {
  cancelRun();
  const id = runId;
  state = fresh(scenario, ghost ? "attract" : "run", ghost);
  set({ startedAt: now() });

  const S = (ms: number) => sleep(ms, id);

  const say = async (text: string) => {
    set({ typing: true });
    await S(Math.min(T.typingMax, T.typingBase + text.length * T.typingPerChar));
    set({ typing: false });
    push({ from: "ai", kind: "text", text });
    await S(T.afterMsg);
  };

  const fly = async (text: string, icon: Flight["icon"], from: Rect | null, to: string) => {
    if (from) {
      set({ flight: { id: ++msgId, text, icon, from, to } });
      await S(T.flight);
      set({ flight: null });
    }
  };

  const fill = (field: string, value: string, source: FieldVal["source"], sourceLabel: string) =>
    set((s) => ({ fields: { ...s.fields, [field]: { value, source, sourceLabel, at: now() } } }));

  /** Ghost mode picks for itself after a beat, so the attract loop plays on its own. */
  const input = async <T>(kind: string, auto: () => T): Promise<T> => {
    if (!ghost) return waitFor<T>(kind, id);
    await S(900);
    return auto();
  };

  const attach = async (doc: Doc, from: Rect | null) => {
    push({ from: "me", kind: "doc", doc });
    await fly(doc.name, "doc", from, "viewer");
    set((s) => ({ received: [...s.received, doc.id], activeDoc: doc.id }));
    await S(T.docOpen);
    for (const f of doc.fills) {
      fill(f.field, f.value, "doc", doc.name);
      await S(T.fieldStagger);
    }
    // Confirm in plain words, with the same values the officer now sees.
    set({ typing: true });
    await S(Math.min(T.typingMax, T.typingBase + doc.confirm.length * T.typingPerChar));
    set({ typing: false });
    push({ from: "ai", kind: "read", doc });
    await S(T.afterMsg + 400);
  };

  /** Show a tray of documents and wait until each one is attached. */
  const tray = async (docs: Doc[]) => {
    set({ prompt: { type: "tray", docs, attached: [], busy: false } });
    for (let i = 0; i < docs.length; i++) {
      const pick = await input<{ docId: string; from: Rect | null }>("attach", () => {
        const d = docs[i];
        return { docId: d.id, from: stageRect(document.querySelector(`[data-tray="${d.id}"]`)) };
      });
      const doc = docs.find((d) => d.id === pick.docId)!;
      set((s) => s.prompt?.type === "tray" ? { prompt: { ...s.prompt, attached: [...s.prompt.attached, doc.id], busy: true } } : {});
      await attach(doc, pick.from);
      set((s) => s.prompt?.type === "tray" ? { prompt: { ...s.prompt, busy: false } } : {});
    }
    set({ prompt: null });
  };

  /* ── 1. Tell us ── */
  for (const m of scenario.opener) await say(m);

  for (const q of scenario.questions) {
    await say(q.ask);
    set({ prompt: { type: "chips", q, selected: q.multi?.preselect ?? [] } });
    const ans = await input<{ chips: Chip[]; from: Rect | null }>("answer", () => {
      const ids = q.multi?.preselect ?? [q.chips[0].id];
      const sel = q.multi ? `[data-confirm]` : `[data-chip="${ids[0]}"]`;
      return { chips: q.chips.filter((c) => ids.includes(c.id)), from: stageRect(document.querySelector(sel)) };
    });
    set({ prompt: null });

    const label = ans.chips.map((c) => c.label).join(", ");
    const value = q.multi ? label : ans.chips[0].value ?? ans.chips[0].label;
    push({ from: "me", kind: "text", text: label });
    await fly(value, "chat", ans.from, q.field);
    fill(q.field, value, "chat", `Chat · ${clock(now())}`);
    await S(250);

    const chipId = ans.chips[0].id;
    for (const m of q.detour?.[chipId] ?? []) await say(m);
    const ack = typeof q.ack === "string" ? q.ack : q.ack?.[chipId];
    if (ack) await say(ack);
  }

  /* ── 2. Evidence ── */
  set({ rail: 1 });
  await say(scenario.evidence.ask);
  await tray(scenario.evidence.docs);
  await say(scenario.evidence.missingNote);
  fill(scenario.evidence.missingFill.field, scenario.evidence.missingFill.value, "chat", "Declared in chat");
  set({ stamps: { submitted: now() } });
  await S(600);

  /* ── 3. Assessment ── */
  set({ rail: 2 });
  await say(scenario.assessment.intro);
  set((s) => ({ lines: scenario.assessment.lines.map((l) => ({ ...l })), stamps: { ...s.stamps, assessed: now() } }));
  push({ from: "ai", kind: "assessment" });
  await S(1200);

  if (ghost) {
    // Attract loop: hold on the finished file, then start again.
    await S(5000);
    void run(scenario, true);
    return;
  }

  /* ── 4. Decision ── */
  set({ rail: 3 });
  let canAddDoc = true;
  for (;;) {
    set({ prompt: { type: "decision", canAddDoc } });
    const choice = await waitFor<"accept" | "add" | "talk">("decide", id);
    set({ prompt: null });
    const payable = payableOf(state.lines, scenario.assessment.excess);

    if (choice === "accept") {
      push({ from: "me", kind: "text", text: `Accept S$${payable.toLocaleString("en-SG")}` });
      await S(300);
      break;
    }

    if (choice === "add") {
      canAddDoc = false;
      push({ from: "me", kind: "text", text: "Add a document" });
      await say(scenario.addDoc.ask);
      await tray([scenario.evidence.missing]);
      const { lineId, update } = scenario.addDoc;
      set((s) => ({
        prevPayable: payableOf(s.lines, scenario.assessment.excess),
        lines: s.lines!.map((l) => (l.id === lineId ? { ...l, ...update, prev: { rule: l.rule, eligible: l.eligible } } : l)),
      }));
      await S(700);
      await say(scenario.addDoc.after);
      continue;
    }

    // talk
    push({ from: "me", kind: "text", text: "Talk to someone" });
    set({ callback: true });
    await S(500);
    push({ from: "ai", kind: "callback", time: scenario.callback.time });
    await S(T.callHold);
    await say(scenario.callback.after);
    break;
  }

  /* ── 5. Officer review ── */
  set({ review: { checked: 0, cursor: false, approved: false } });
  if (!state.callback) await say("Rachel is reviewing your claim now. It won't take long.");
  for (let i = 1; i <= scenario.review.checklist.length; i++) {
    await S(T.checklistTick);
    set((s) => ({ review: { ...s.review!, checked: i } }));
  }
  await S(400);
  if (state.staff) {
    await waitFor("approve", id);
  } else {
    set((s) => ({ review: { ...s.review!, cursor: true } }));
    await S(T.cursor);
  }
  set((s) => ({ review: { ...s.review!, cursor: false, approved: true }, stamps: { ...s.stamps, reviewed: now() } }));
  await S(1400);

  /* ── 6. Paid ── */
  const paidAmount = payableOf(state.lines, scenario.assessment.excess);
  set((s) => ({ rail: 4, paid: true, stamps: { ...s.stamps, paid: now() } }));
  await S(900);
  await say(`All done. S$${paidAmount.toLocaleString("en-SG")} is in your account. Take care, ${scenario.customer.first}.`);
  await S(T.endDelay);
  set({ phase: "end" });
}

/* ─────────────────────────────── Actions ─────────────────────────────── */

export const actions = {
  /** Back to the idle attract loop. */
  reset() {
    void run(SCENARIOS[0], true);
  },
  openPicker() {
    cancelRun();
    state = fresh(state.scenario, "picker");
    set({});
  },
  start(scenarioId: string) {
    void run(scenarioById(scenarioId), false);
  },
  pickChip(chipId: string, el: Element | null) {
    const p = state.prompt;
    if (p?.type !== "chips") return;
    if (p.q.multi) {
      const selected = p.selected.includes(chipId) ? p.selected.filter((c) => c !== chipId) : [...p.selected, chipId];
      set({ prompt: { ...p, selected } });
      return;
    }
    resolveWaiter("answer", { chips: p.q.chips.filter((c) => c.id === chipId), from: stageRect(el) });
  },
  confirmMulti(el: Element | null) {
    const p = state.prompt;
    if (p?.type !== "chips" || !p.selected.length) return;
    resolveWaiter("answer", { chips: p.q.chips.filter((c) => p.selected.includes(c.id)), from: stageRect(el) });
  },
  attachDoc(docId: string, el: Element | null) {
    resolveWaiter("attach", { docId, from: stageRect(el) });
  },
  decide(choice: "accept" | "add" | "talk") {
    resolveWaiter("decide", choice);
  },
  approve() {
    resolveWaiter("approve");
  },
  showDoc(docId: string) {
    if (state.received.includes(docId)) set({ activeDoc: docId });
  },
  toggleStaff() {
    set({ staff: !state.staff });
  },
};

// Start the attract loop on load.
void run(state.scenario, true);
