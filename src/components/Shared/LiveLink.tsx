import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, MessageSquare, ShieldCheck } from "lucide-react";
import { stageRect, useStore, type Rect } from "@/engine/machine";

/* The signature moment: what the visitor does on the phone visibly travels
   across and lands in the officer's claim file. Both overlays sit on top of the
   stage in stage coordinates. */

const centre = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

/** An answer (or document) flying from the phone to its place on the desk. */
export function Flight() {
  const flight = useStore((s) => s.flight);
  const [to, setTo] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    if (!flight) return setTo(null);
    const sel = flight.to === "viewer" ? `[data-drop="viewer"]` : `[data-field="${flight.to}"]`;
    setTo(stageRect(document.querySelector(sel)));
  }, [flight?.id]);

  return (
    <AnimatePresence>
      {flight && to && (
        <motion.div
          key={flight.id}
          className="pointer-events-none absolute left-0 top-0 z-40"
          initial={{ x: centre(flight.from).x, y: centre(flight.from).y, scale: 1, opacity: 0 }}
          animate={{
            x: [centre(flight.from).x, (centre(flight.from).x + centre(to).x) / 2, centre(to).x],
            y: [centre(flight.from).y, Math.min(centre(flight.from).y, centre(to).y) - 90, centre(to).y],
            scale: [1, 1.08, 0.9],
            opacity: [0, 1, 1],
          }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
          transition={{ duration: 0.8, ease: [0.45, 0, 0.2, 1], opacity: { duration: 0.15 } }}
        >
          <span className="ai-ring flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-base font-semibold text-ink shadow-[0_12px_30px_-6px_rgb(92_85_235/0.45)]">
            {flight.icon === "doc" ? <FileText size={17} className="text-primary" /> : flight.icon === "policy" ? <ShieldCheck size={17} className="text-primary" /> : <MessageSquare size={17} className="text-primary" />}
            {flight.text}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type Link = { key: string; d: string; a: { x: number; y: number }; b: { x: number; y: number } };

/** Lines from each highlighted value in the open document to its claim file field. */
export function Connectors() {
  const activeDoc = useStore((s) => s.activeDoc);
  const fields = useStore((s) => s.fields);
  const reviewing = useStore((s) => !!s.review);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    if (!activeDoc || reviewing) return setLinks([]);
    const measure = () => {
      const out: Link[] = [];
      document.querySelectorAll<HTMLElement>("[data-extract]").forEach((el) => {
        const key = el.dataset.extract!;
        if (!fields[key]) return;
        const from = stageRect(document.querySelector(`[data-field="${key}"]`));
        const to = stageRect(el);
        if (!from || !to) return;
        const a = { x: from.x + from.w - 6, y: from.y + from.h / 2 };
        const b = { x: to.x, y: to.y + to.h / 2 };
        const mx = (a.x + b.x) / 2;
        out.push({ key, a, b, d: `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}` });
      });
      setLinks(out);
    };
    const timers = [0, 700, 1500].map((t) => setTimeout(measure, t));
    return () => timers.forEach(clearTimeout);
  }, [activeDoc, fields, reviewing]);

  return (
    <svg className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible">
      <AnimatePresence>
        {links.map((l) => (
          <motion.g key={`${activeDoc}-${l.key}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.path
              d={l.d}
              fill="none"
              stroke="rgb(var(--regal))"
              strokeWidth={1.75}
              strokeOpacity={0.7}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <circle cx={l.a.x} cy={l.a.y} r={4} fill="rgb(var(--primary))" />
            <circle cx={l.b.x} cy={l.b.y} r={4} fill="rgb(var(--regal))" />
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
}
