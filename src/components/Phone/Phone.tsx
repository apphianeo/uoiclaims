import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { CalendarClock, FileText } from "lucide-react";
import { AiOrb } from "@/components/Shared/Ai";
import { PhoneAssessment } from "@/components/Shared/AssessmentCard";
import { payableOf, useStore, type Msg } from "@/engine/machine";
import { sgd } from "@/lib";
import { Composer } from "./Composer";

/** The customer's phone: conversation, answers, documents and the payout. */
export function Phone() {
  const messages = useStore((s) => s.messages);
  const typing = useStore((s) => s.typing);
  const paid = useStore((s) => s.paid);
  const scenario = useStore((s) => s.scenario);
  const lines = useStore((s) => s.lines);
  const scroller = useRef<HTMLDivElement>(null);
  const buzz = useAnimationControls();
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
            <div className="text-base font-semibold text-ink">UOI Claims assistant</div>
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

        {/* PayNow-style payout notification */}
        <AnimatePresence>
          {paid && (
            <motion.div
              initial={{ y: -140, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -140, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="absolute inset-x-3 top-3 z-20 rounded-[22px] bg-page/95 p-4 shadow-pop ring-1 ring-line backdrop-blur"
            >
              <div className="flex items-center gap-2 text-2xs text-muted">
                <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-[#7B2A8E] text-[9px] font-bold text-white">PN</span>
                PayNow · now
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
        <span className="mt-1 block text-base">Rachel Lim will call you at {m.time}.</span>
        <span className="mt-1 block text-sm text-muted">She has your full claim file, so you won't need to repeat anything.</span>
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
