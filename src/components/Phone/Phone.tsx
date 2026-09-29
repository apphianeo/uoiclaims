import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { CalendarClock, Check, FileText, ScanText } from "lucide-react";
import { AiOrb } from "@/components/Shared/Ai";
import { PhoneAssessment } from "@/components/Shared/AssessmentCard";
import { payableOf, useStore, type Msg } from "@/engine/machine";
import type { Doc } from "@/engine/types";
import { sgd } from "@/lib";
import { Composer } from "./Composer";
import { Portal } from "./Portal";
import paynow from "@/assets/paynow.png";

/** The customer's phone: conversation, answers, documents and the payout. */
export function Phone() {
  const messages = useStore((s) => s.messages);
  const typing = useStore((s) => s.typing);
  const paid = useStore((s) => s.paid);
  const scenario = useStore((s) => s.scenario);
  const lines = useStore((s) => s.lines);
  const scroller = useRef<HTMLDivElement>(null);
  const inPortal = useStore((s) => s.prompt?.type === "portal");
  const buzz = useAnimationControls();
  // The payout moment: the notification drops in, then the whole screen turns UOI blue.
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (!paid) return setSuccess(false);
    const t = setTimeout(() => setSuccess(true), 1800);
    return () => clearTimeout(t);
  }, [paid]);
  const lastIsCard = useRef(false);
  lastIsCard.current = messages[messages.length - 1]?.kind === "assessment";

  // Keep the newest message in view. An assessment card scrolls to its top so every line is readable.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const last = messages[messages.length - 1];
    const toCard = last?.kind === "assessment";
    // Wait for the new message to be laid out, then scroll. Positions are measured
    // on screen and divided by the stage scale.
    const t = setTimeout(() => {
      const card = toCard ? el.querySelector<HTMLElement>("[data-phone-assessment]") : null;
      if (!card) return void (el.scrollTop = el.scrollHeight);
      const k = el.getBoundingClientRect().height / el.clientHeight;
      el.scrollTop += (card.getBoundingClientRect().top - el.getBoundingClientRect().top) / k - 12;
    }, 60);
    return () => clearTimeout(t);
  }, [messages.length, typing]);

  // When the answer area below grows or shrinks, keep the latest message in view.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (!lastIsCard.current) el.scrollTop = el.scrollHeight;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paid) void buzz.start({ x: [0, -6, 6, -5, 5, -3, 3, 0], transition: { duration: 0.5 } });
  }, [paid]);

  const payable = payableOf(lines, scenario.assessment.excess);

  return (
    <motion.div
      animate={buzz}
      className="relative h-[880px] w-[430px] rounded-[60px] bg-page p-[11px] shadow-pop ring-1 ring-device"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[50px] bg-surface">
        {/* status bar */}
        <div className="num relative flex h-12 shrink-0 items-end justify-between bg-surface px-9 pb-1.5 text-xs font-semibold">
          <Clock />
          <span className="absolute left-1/2 top-3 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-ink" />
          <span>5G</span>
        </div>

        {/* app header */}
        <div className="flex shrink-0 items-center gap-3 bg-surface px-5 pb-3 pt-3">
          <AiOrb size={44} />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-base font-semibold text-ink">UOI Claims Assistant</div>
            <div className="flex items-center gap-1.5 text-xs text-success">
              <span className="live-pulse h-1.5 w-1.5 rounded-full bg-success" /> Shared live with your claims officer
            </div>
          </div>
        </div>

        <div className="mx-4 flex shrink-0 items-center justify-between rounded-full bg-page px-4 py-2 text-xs text-ink shadow-card">
          <span className="font-medium">{scenario.policy.name}</span>
          <span className="num text-muted">{scenario.policy.number}</span>
        </div>

        {/* conversation */}
        <div ref={scroller} data-phone-scroller className="no-scrollbar relative flex-1 overflow-y-auto scroll-smooth px-4 pb-3 pt-4">
          <div className="flex flex-col gap-2.5 text-base text-ink">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  layout="position"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={m.from === "me" ? "flex justify-end" : "flex"}
                >
                  <Message m={m} />
                </motion.div>
              ))}
              {typing && (
                <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
                  <span className="flex h-11 items-center gap-1.5 rounded-[20px] rounded-bl-[6px] bg-page px-4 shadow-card">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="typing-dot h-2 w-2 rounded-full bg-faint" style={{ animationDelay: `${i * 160}ms` }} />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            {/* room below a fresh assessment so the whole card can sit in view */}
            {messages[messages.length - 1]?.kind === "assessment" && !typing && <div className="h-28 shrink-0" />}
          </div>
        </div>

        <Composer />

        <AnimatePresence>{inPortal && <Portal />}</AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-10 text-center text-white"
              style={{ background: "linear-gradient(160deg, rgb(var(--primary)) 35%, rgb(var(--regal)))" }}
            >
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
                className="grid h-28 w-28 place-items-center rounded-full bg-white text-primary"
              >
                <Check size={60} strokeWidth={2.5} />
              </motion.span>
              <p className="num mt-10 text-[40px] font-bold leading-none">{sgd(payable)}</p>
              <p className="mt-3 text-xl font-semibold">paid to you</p>
              <p className="mt-3 text-base text-white/80">UOI approved your claim. The money is in your account.</p>
              <span className="num absolute bottom-10 text-xs text-white/60">{scenario.claimRef}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PayNow-style payout notification */}
        <AnimatePresence>
          {paid && !success && (
            <motion.div
              initial={{ y: -140, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -140, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="absolute inset-x-3 top-3 z-20 rounded-[22px] bg-page/95 p-4 shadow-pop ring-1 ring-line backdrop-blur"
            >
              <div className="flex items-center gap-2 text-2xs text-muted">
                <img src={paynow} alt="PayNow" draggable={false} className="h-7 w-auto" />
                <span>· now</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-ink">Your UOI claim has been approved</p>
              <p className="num text-sm text-ink">{sgd(payable)} has been paid to you.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Message({ m }: { m: Msg }) {
  if (m.kind === "assessment") return <PhoneAssessment />;

  if (m.kind === "read") return <ReadCard doc={m.doc} text={m.doc.confirm} />;

  if (m.kind === "doc" && m.doc.photos)
    return (
      <span className="flex gap-1.5 rounded-[20px] rounded-br-[6px] bg-primary p-1.5">
        {m.doc.photos.map((p, i) => (
          <img key={i} src={p.src} alt="" draggable={false} className="h-[120px] w-[90px] rounded-[14px] object-cover" />
        ))}
      </span>
    );

  if (m.kind === "doc")
    return (
      <span className="flex items-center gap-3 rounded-[20px] rounded-br-[6px] bg-primary py-2.5 pl-2.5 pr-4 text-white">
        <span className="grid h-10 w-9 place-items-center rounded-[8px] bg-white/15">
          <FileText size={18} />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-medium">{m.doc.name}</span>
          <span className="block text-2xs text-white/75">Attached</span>
        </span>
      </span>
    );

  if (m.kind === "callback")
    return (
      <span className="w-[86%] rounded-[20px] rounded-bl-[6px] bg-page p-4 shadow-card">
        <span className="flex items-center gap-2 text-sm font-semibold text-primary">
          <CalendarClock size={18} /> Callback booked
        </span>
        <span className="mt-1 block text-base">A UOI claims officer will call you at {m.time}.</span>
        <span className="mt-1 block text-sm text-muted">They'll have your full claim file, so you won't need to repeat anything.</span>
      </span>
    );

  return m.from === "ai" ? (
    <p className="max-w-[86%] rounded-[20px] rounded-bl-[6px] bg-page px-4 py-3 shadow-card">{m.text}</p>
  ) : (
    <p className="max-w-[86%] rounded-[20px] rounded-br-[6px] bg-primary px-4 py-3 text-white">{m.text}</p>
  );
}

function Clock() {
  const t = new Date().toLocaleTimeString("en-SG", { hour: "numeric", minute: "2-digit", hour12: false });
  return <span>{t}</span>;
}

/** The assistant's confirmation after a document, showing what it read: the same values
    that just landed in the officer's claim file. */
function ReadCard({ doc, text }: { doc: Doc; text: string }) {
  const fields = useStore((s) => s.scenario.fields);
  const label = (key: string) => fields.find((f) => f.key === key)?.label ?? key;
  return (
    <div className="w-[86%] overflow-hidden rounded-[20px] rounded-bl-[6px] bg-page shadow-card">
      <p className="px-4 pb-2.5 pt-3">{text}</p>
      <div className="ai-tint mx-2 mb-2 rounded-[14px] px-3 py-2.5">
        <p className="mb-1.5 flex items-center gap-1.5 text-2xs font-medium text-primary">
          <ScanText size={12} /> What I read from your {doc.name.toLowerCase()}
        </p>
        <dl className="space-y-1">
          {doc.fills.map((f) => (
            <div key={f.field} className="flex items-baseline justify-between gap-3 text-sm">
              <dt className="text-muted">{label(f.field)}</dt>
              <dd className="num text-right font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
