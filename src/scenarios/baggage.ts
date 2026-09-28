import type { Scenario } from "@/engine/types";

// Second scenario, from the original brief. All figures are illustrative.
export const baggage: Scenario = {
  id: "baggage",
  picker: { label: "My suitcase was damaged on my flight", hint: "Bangkok to Singapore", icon: "luggage" },
  customer: { name: "Wei Ling Tan", first: "Wei Ling" },
  policy: { name: "UOI Travel Insurance", number: "TRV-2026-084512", period: "8–16 Nov 2026" },
  claimRef: "CLM-2026-11-0419",

  fields: [
    { key: "flight", label: "Flight" },
    { key: "damage", label: "Damage" },
    { key: "reported", label: "Reported to airline" },
    { key: "photo", label: "Photo evidence" },
    { key: "pir", label: "Airline report" },
    { key: "repair", label: "Repair estimate" },
    { key: "receipt", label: "Purchase receipt" },
  ],

  opener: ["Sorry to hear your suitcase didn't make it through in one piece. Let's get it covered."],

  questions: [
    {
      id: "flight",
      ask: "Which flight were you on?",
      chips: [
        { id: "sq708", label: "SQ 708 from Bangkok", value: "SQ 708, Bangkok to Singapore" },
        { id: "other", label: "Another flight", value: "Another flight" },
      ],
      field: "flight",
      ack: "Thanks. That's within your travel dates.",
    },
    {
      id: "damage",
      ask: "What's the damage?",
      chips: [
        { id: "wheel", label: "Broken wheel and handle" },
        { id: "shell", label: "Cracked shell" },
        { id: "both", label: "Both" },
      ],
      field: "damage",
      ack: "That's frustrating after a long trip.",
    },
    {
      id: "reported",
      ask: "Did you report it to the airline at the airport?",
      chips: [
        { id: "yes", label: "Yes, I have the report", value: "Yes, at Changi" },
        { id: "no", label: "Not yet", value: "Filed with airline" },
      ],
      field: "reported",
      ack: { yes: "Perfect, that's the key document." },
      detour: {
        no: [
          "We need a damage report from the airline. It's usually made at the baggage desk before you leave the airport.",
          "If you've already left, the airline can still take one within 7 days.",
          "Let's carry on as if you have it.",
        ],
      },
    },
  ],

  evidence: {
    ask: "Now two documents. Please attach a photo of the suitcase and the airline's damage report.",
    docs: [
      {
        id: "photo",
        name: "Photo of suitcase",
        kind: "photo",
        header: { title: "IMG_2031.jpg", subtitle: "Taken 16 Nov 2026, Changi Airport" },
        rows: [],
        marks: [
          { x: 10, y: 66, w: 26, h: 26, tag: "Broken wheel", field: "photo" },
          { x: 38, y: 2, w: 30, h: 22, tag: "Bent handle", field: "damage" },
        ],
        confirm: "Photo received. It shows a broken wheel and a bent handle, which matches what you told me.",
        fills: [{ field: "photo", value: "Matches your description" }],
      },
      {
        id: "pir",
        name: "Airline damage report",
        kind: "form",
        header: { title: "Baggage services, Changi Airport", subtitle: "Property irregularity report", ref: "SIN-SQ-48213" },
        rows: [
          { k: "Flight", v: "SQ 708, BKK to SIN", field: "flight", tag: "Flight" },
          { k: "Date filed", v: "16 November 2026, 07:55", field: "pir", tag: "Airline report" },
          { k: "Damage noted", v: "Wheel detached, handle bent" },
          { k: "Repair estimate", v: "S$150.00", field: "repair", tag: "Repair estimate" },
        ],
        confirm: "Airline damage report received. Filed at Changi on 16 Nov, estimates the repair at S$150.",
        fills: [
          { field: "pir", value: "16 Nov, 07:55" },
          { field: "repair", value: "S$150" },
        ],
      },
    ],
    missing: {
      id: "receipt",
      name: "Suitcase receipt",
      kind: "receipt",
      header: { title: "Travel Goods Co.", subtitle: "Tax invoice · Singapore", ref: "INV 51207" },
      rows: [
        { k: "Date", v: "18 March 2024" },
        { k: "Item", v: "Hard-shell suitcase, 69 cm" },
        { k: "Total paid", v: "S$420.00", field: "receipt", tag: "Purchase receipt" },
      ],
      confirm: "Suitcase receipt received. S$420, bought in March 2024.",
      fills: [{ field: "receipt", value: "S$420 · Mar 2024" }],
    },
    missingNote:
      "I don't see a purchase receipt for the suitcase. I can still include it, but without proof of purchase the limit is lower. You can add it any time.",
    missingFill: { field: "receipt", value: "Not provided yet" },
  },

  assessment: {
    section: "Section 6, Baggage",
    condition: "Damage reported to the airline",
    intro: "Here's your assessment. Rachel, your claims officer, sees exactly the same thing.",
    excess: 0,
    lines: [
      { id: "repair", item: "Suitcase repair", claimed: 150, rule: "No receipt: up to S$50", plain: "Without a receipt, repairs are covered up to S$50.", clause: "6.2(a)", eligible: 50, limited: true, backed: false },
    ],
  },

  addDoc: {
    ask: "Sure. Attach the suitcase receipt and I'll update the assessment.",
    lineId: "repair",
    update: { rule: "Receipt provided, per-item limit S$500", plain: "With a receipt, repairs are covered in full up to S$500.", eligible: 150, limited: false, backed: true },
    after: "Your repair is now covered in full. The total is updated on both screens.",
  },

  callback: {
    time: "4:15 pm today",
    after: "Thanks for speaking with Rachel. She's reviewing your claim now.",
  },

  review: {
    checklist: [
      "Policy active 8–16 Nov 2026",
      "Flight within travel period",
      "Airline damage report on file",
      "Photo matches the report",
      "Limits applied per Section 6",
    ],
  },
};
