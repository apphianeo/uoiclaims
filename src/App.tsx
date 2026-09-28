import { useEffect, useState } from "react";
import { ProgressRail } from "@/components/Shared/ProgressRail";
import { Phone } from "@/components/Phone/Phone";
import { Desk } from "@/components/Desk/Desk";

const STAGE_W = 1920;
const STAGE_H = 1080;

/** Scale the fixed 1920×1080 stage to fit any window, letterboxed. */
function useStageScale() {
  const calc = () => Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
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
    <div className="grid h-full w-full place-items-center overflow-hidden bg-night" onContextMenu={(e) => e.preventDefault()}>
      <div
        className="kiosk relative flex shrink-0 flex-col overflow-hidden bg-night"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >

        {/* soft pastel light in the brand hues: calm, friendly, never a wash */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 500px at 8% 85%, rgb(var(--accent) / 0.16), transparent 70%), radial-gradient(800px 600px at 34% 40%, rgb(var(--regal) / 0.12), transparent 70%), radial-gradient(1000px 700px at 85% 10%, rgb(var(--primary) / 0.12), transparent 70%)",
          }}
        />

        <ProgressRail current={0} elapsed="0:42" />

        <main className="relative flex min-h-0 flex-1">
          <section className="grid w-[36%] shrink-0 place-items-center">
            <Phone />
          </section>

          <LiveSeam />

          <section className="min-w-0 flex-1 pb-4 pl-8 pr-8 pt-2">
            <Desk />
          </section>
        </main>

        <footer className="relative flex h-9 shrink-0 items-center justify-center text-2xs text-faint">
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
