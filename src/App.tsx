import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressRail } from "@/components/Shared/ProgressRail";
import { Phone } from "@/components/Phone/Phone";
import { Desk } from "@/components/Desk/Desk";
import { Connectors, Flight } from "@/components/Shared/LiveLink";
import { Attract } from "@/components/Attract";
import { EndScreen } from "@/components/EndScreen";
import { useStore } from "@/engine/machine";
import { useKiosk } from "@/hooks/useKiosk";

const STAGE_W = 1920;
const STAGE_H = 1080;

/** Scale the fixed 1920×1080 stage to fit any window, letterboxed. */
function useStageScale() {
  // 0.92 leaves a margin of background around the stage on every side
  const calc = () => Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H) * 0.92;
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}

export default function App() {
  const scale = useStageScale();
  const countdown = useKiosk();
  const staff = useStore((s) => s.staff);

  return (
    <div className="kiosk relative h-full w-full overflow-hidden bg-night" onContextMenu={(e) => e.preventDefault()}>
      {/* Calm sky-to-white canvas, painted on the full window so it never shows an edge */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#eaf3ff] to-[#f8fafd]" />
      {/* Fixed 1920×1080 stage, scaled to fit and centred exactly */}
      <div
        data-stage
        className="absolute left-1/2 top-1/2 flex flex-col"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <ProgressRail />

        <main className="relative flex min-h-0 flex-1">
          <section className="flex shrink-0 items-center pl-16 pr-10">
            <Phone />
          </section>

          <LiveSeam />

          <section className="relative min-w-0 flex-1 pb-6 pl-10 pr-16 pt-2">
            <Desk />
            <EndScreen />
          </section>
        </main>

        <footer className="relative flex h-12 shrink-0 items-center justify-center gap-4 text-2xs text-faint">
          Illustrative demo. Figures and policy wording are not actual UOI policy terms.
          {staff && <span className="rounded-full bg-info px-2 py-0.5 font-medium text-primary">Staff mode</span>}
        </footer>

        <Connectors />
        <Flight />
        <Attract />

        <AnimatePresence>
          {countdown != null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] grid place-items-center bg-night/60 backdrop-blur-[2px]"
            >
              <div className="rounded-xl bg-page px-14 py-10 text-center shadow-pop ring-1 ring-line">
                <p className="text-2xl font-bold text-ink">Still there?</p>
                <p className="num mt-2 text-base text-muted">Starting over in {countdown} seconds.</p>
                <button className="mt-6 h-14 rounded-full bg-primary px-10 text-lg font-semibold text-white">I'm still here</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** The seam between the two views. Answers travel across it. */
function LiveSeam() {
  return (
    <div className="relative w-px shrink-0">
      <div className="absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-regal-hi/50 to-transparent" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-page shadow-pop">
          <span className="live-pulse h-3 w-3 rounded-full bg-primary" />
        </span>
        <span className="whitespace-nowrap rounded-full bg-night px-2 text-2xs font-medium text-muted">Live</span>
      </div>
    </div>
  );
}
