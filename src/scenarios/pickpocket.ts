import type { Scenario } from "@/engine/types";

// Hero scenario. All figures and policy wording are illustrative.
export const pickpocket: Scenario = {
  id: "pickpocket",
  picker: { label: "My wallet and phone were pickpocketed", hint: "Bangkok, Thailand", icon: "wallet" },
  customer: { name: "Wei Ling Tan", first: "Wei Ling" },
  policy: { name: "UniTravel", number: "TRV-2026-084512", period: "8–16 Nov 2026", destination: "Thailand" },
  claimRef: "CLM-2026-11-0412",

  fields: [
    { key: "safe", label: "Customer safe" },
    { key: "date", label: "Date of incident" },
    { key: "place", label: "Location" },
    { key: "items", label: "Items taken" },
    { key: "police", label: "Police report" },
    { key: "filed", label: "Report filed" },
    { key: "cash", label: "Cash reported" },
    { key: "wallet", label: "Wallet" },
    { key: "passport", label: "Passport replacement" },
    { key: "phone", label: "Phone" },
  ],

  opener: ["That sounds really stressful. Let's get this sorted together."],

  questions: [
    {
      id: "safe",
      ask: "First, are you somewhere safe?",
      chips: [
        { id: "hotel", label: "Yes, I'm at my hotel", value: "Yes, at hotel" },
        { id: "friends", label: "Yes, with friends", value: "Yes, with friends" },
      ],
      field: "safe",
      ack: "Good, I'm glad you're safe.",
    },
    {
      id: "date",
      ask: "When did it happen?",
      chips: [
        { id: "today", label: "Today", value: "12 Nov 2026" },
        { id: "yesterday", label: "Yesterday", value: "11 Nov 2026" },
        { id: "earlier", label: "2+ days ago", value: "On or before 10 Nov" },
      ],
      field: "date",
      ack: "Thanks. That's within your travel dates, so you're covered.",
    },
    {
      id: "place",
      ask: "Where did it happen?",
      chips: [
        { id: "bkk", label: "Bangkok, Thailand" },
        { id: "cnx", label: "Chiang Mai, Thailand" },
        { id: "else", label: "Elsewhere" },
      ],
      field: "place",
      ack: "Got it.",
    },
    {
      id: "items",
      ask: "What was taken?",
      chips: [
        { id: "wallet", label: "Wallet" },
        { id: "cash", label: "Cash" },
        { id: "passport", label: "Passport" },
        { id: "phone", label: "Phone" },
      ],
      multi: { preselect: ["wallet", "cash", "passport", "phone"], confirm: "Next" },
      field: "items",
      ack: "I'm sorry, that's a lot to lose at once. We'll go through each one.",
    },
    {
      id: "police",
      ask: "Have you made a police report?",
      chips: [
        { id: "yes", label: "Yes", value: "Yes, filed" },
        { id: "no", label: "Not yet", value: "Filed with Tourist Police" },
      ],
      field: "police",
      ack: { yes: "That's the most important document, so well done." },
      detour: {
        no: [
          "For theft, we need a police report made within 24 hours.",
          "The nearest Tourist Police station is on Sukhumvit Road, about 10 minutes from you. You can also call 1155.",
          "Let's carry on as if you've just picked it up.",
        ],
      },
    },
  ],

  evidence: {
    ask: "Now a few documents. Please attach your police report, wallet receipt and passport replacement receipt.",
    docs: [
      {
        id: "police",
        name: "Police report",
        kind: "form",
        header: { title: "Tourist Police Division", subtitle: "Royal Thai Police · Report of loss", ref: "No. TPB-26-118204" },
        rows: [
          { k: "Date of report", v: "12 November 2026, 21:40", field: "filed", tag: "Report filed" },
          { k: "Place of incident", v: "Sukhumvit Soi 11, Bangkok", field: "place", tag: "Location" },
          { k: "Complainant", v: "Tan Wei Ling (Singapore)" },
          { k: "Property lost", v: "Wallet, cash THB 7,500, passport, mobile phone", field: "cash", tag: "Cash reported" },
        ],
        confirm: "Police report received. Filed in Bangkok on 12 Nov, lists wallet, cash, passport and phone.",
        fills: [
          { field: "filed", value: "12 Nov, 21:40" },
          { field: "cash", value: "THB 7,500 (S$300)" },
        ],
      },
      {
        id: "wallet",
        name: "Wallet receipt",
        kind: "receipt",
        header: { title: "Tan & Co. Leathergoods", subtitle: "Tax invoice · Singapore", ref: "INV 20394" },
        rows: [
          { k: "Date", v: "3 March 2026" },
          { k: "Item", v: "Bifold leather wallet" },
          { k: "Total paid", v: "S$250.00", field: "wallet", tag: "Wallet" },
        ],
        confirm: "Wallet receipt received. S$250, bought in March 2026.",
        fills: [{ field: "wallet", value: "S$250 · receipt" }],
      },
      {
        id: "passport",
        name: "Passport replacement receipt",
        kind: "receipt",
        header: { title: "Embassy of Singapore, Bangkok", subtitle: "Receipt · Replacement passport", ref: "OR 77-5512" },
        rows: [
          { k: "Date", v: "13 November 2026" },
          { k: "Applicant", v: "Tan Wei Ling" },
          { k: "Fee paid", v: "S$150.00", field: "passport", tag: "Passport replacement" },
        ],
        confirm: "Passport replacement receipt received. S$150, paid in Bangkok on 13 Nov.",
        fills: [{ field: "passport", value: "S$150 · receipt" }],
      },
    ],
    missing: {
      id: "phone",
      name: "Phone receipt",
      kind: "receipt",
      header: { title: "Gadget Hub", subtitle: "Tax invoice · Singapore", ref: "INV 88120" },
      rows: [
        { k: "Date", v: "2 January 2026" },
        { k: "Item", v: "Smartphone, 256 GB" },
        { k: "Total paid", v: "S$900.00", field: "phone", tag: "Phone" },
      ],
      confirm: "Phone receipt received. S$900, bought in January 2026.",
      fills: [{ field: "phone", value: "S$900 · receipt" }],
    },
    missingNote:
      "I don't see a receipt for your phone. I can still include it, but without proof of purchase the limit is lower. You can add it any time.",
    missingFill: { field: "phone", value: "S$900 · no receipt" },
  },

  assessment: {
    section: "Section 5, Loss of personal belongings and travel documents",
    condition: "Theft reported to police within 24 hours",
    intro: "Here's your assessment. Your UOI claims officer sees exactly the same thing.",
    excess: 100,
    lines: [
      { id: "wallet", item: "Wallet", claimed: 250, rule: "Receipt provided", plain: "Covered in full. You sent the receipt.", clause: "5.1", eligible: 250, backed: true },
      { id: "cash", item: "Cash", claimed: 300, rule: "Cash limit S$200", plain: "Cash is covered up to S$200.", clause: "5.3(b)", eligible: 200, limited: true, backed: true },
      { id: "passport", item: "Passport replacement", claimed: 150, rule: "Receipt provided", plain: "Covered in full. You sent the receipt.", clause: "5.4", eligible: 150, backed: true },
      { id: "phone", item: "Phone", claimed: 900, rule: "No receipt: up to S$100 per item", plain: "Without a receipt, each item is covered up to S$100.", clause: "5.2(c)", eligible: 100, limited: true, backed: false },
    ],
  },

  addDoc: {
    ask: "Sure. Attach your phone receipt and I'll update the assessment.",
    lineId: "phone",
    update: { rule: "Receipt provided, per-item limit S$500", plain: "With a receipt, each item is covered up to S$500.", eligible: 500, backed: true },
    after: "That lifts your phone to S$500, the most we cover per item. Your total is updated on both screens.",
  },

  callback: {
    time: "4:15 pm today",
    after: "Thanks for speaking with us. Your claim is being reviewed now.",
  },

  review: {
    checklist: [
      "Policy active 8–16 Nov 2026",
      "Incident within travel period",
      "Police report within 24 hours",
      "Amounts match documents",
      "Limits applied per Section 5",
    ],
  },
};
