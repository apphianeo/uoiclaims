import { useEffect, useState } from "react";
import { ProgressRail } from "@/components/Shared/ProgressRail";
import { Phone } from "@/components/Phone/Phone";
import { Desk } from "@/components/Desk/Desk";

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

  return (
    <div className="kiosk relative h-full w-full overflow-hidden bg-night" onContextMenu={(e) => e.preventDefault()}>
      {/* Soft pastel light in the brand hues. Painted on the full window, not the
          scaled stage, so it never shows an edge when the window isn't 16:9. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 55% at 5% 90%, rgb(var(--accent) / 0.16), transparent 70%), radial-gradient(45% 60% at 34% 40%, rgb(var(--regal) / 0.12), transparent 70%), radial-gradient(55% 65% at 88% 8%, rgb(var(--primary) / 0.12), transparent 70%)",
        }}
      />
      {/* Fixed 1920×1080 stage, scaled to fit and centred exactly */}
      <div
        className="absolute left-1/2 top-1/2 flex flex-col"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <ProgressRail current={0} elapsed="0:42" />

        <main className="relative flex min-h-0 flex-1">
          <section className="grid w-[36%] shrink-0 place-items-center pl-8">
            <Phone />
          </section>

          <LiveSeam />

          <section className="min-w-0 flex-1 pb-6 pl-10 pr-16 pt-2">
            <Desk />
          </section>
        </main>

        <footer className="relative flex h-12 shrink-0 items-center justify-center text-2xs text-faint">
          Illustrative demo. Figures and policy wording are not actual UOI policy terms.
        </footer>
      </div>
    </div>
  );
}

/** The signature link between the two views. Answers will travel along it. */
function LiveSeam() {
  return (
    <div className="relative w-px shrink-0">
      <div className="absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-regal-hi/50 to-transparent" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-page shadow-pop">
          <span className="live-pulse ai-gradient h-3 w-3 rounded-full" />
        </span>
        <span className="whitespace-nowrap rounded-full bg-night px-2 text-2xs font-medium text-muted">Live</span>
      </div>
    </div>
  );
}
