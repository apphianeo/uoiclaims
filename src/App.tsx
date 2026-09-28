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
    <div className="grid h-full w-full place-items-center overflow-hidden bg-stage" onContextMenu={(e) => e.preventDefault()}>
      <div
        className="kiosk flex shrink-0 flex-col bg-stage"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
        <ProgressRail current={0} elapsed="0:00" />

        <main className="flex min-h-0 flex-1">
          <section className="grid w-[36%] shrink-0 place-items-center border-r border-line">
            <Phone />
          </section>
          <section className="min-w-0 flex-1 p-8">
            <Desk />
          </section>
        </main>

        <footer className="flex h-10 shrink-0 items-center justify-center border-t border-line bg-surface text-xs text-muted">
          Illustrative demo. Figures and policy wording are not actual UOI policy terms.
        </footer>
      </div>
    </div>
  );
}
