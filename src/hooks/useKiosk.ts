import { useEffect, useState } from "react";
import { actions, getState } from "@/engine/machine";
import { SCENARIOS } from "@/scenarios";

const IDLE_MS = 45_000;
const WARN_S = 10;

/** Staff shortcuts and the idle reset. Returns the "Still there?" countdown, or null. */
export function useKiosk() {
  const [countdown, setCountdown] = useState<number | null>(null);

  // Staff shortcuts (not shown on screen)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (e.code === "KeyR") actions.reset();
      else if (e.code === "KeyS") actions.toggleStaff();
      else if (e.code === "Digit1" && SCENARIOS[0]) actions.start(SCENARIOS[0].id);
      else if (e.code === "Digit2" && SCENARIOS[1]) actions.start(SCENARIOS[1].id);
      else if (e.code === "KeyF") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Idle: 45 s without input anywhere but the attract loop -> "Still there?" -> 10 s -> attract
  useEffect(() => {
    let last = Date.now();
    const poke = () => {
      last = Date.now();
      setCountdown(null);
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((ev) => window.addEventListener(ev, poke, { passive: true }));
    const t = setInterval(() => {
      if (getState().phase === "attract") return setCountdown(null);
      const idle = Date.now() - last;
      if (idle < IDLE_MS) return;
      const left = WARN_S - Math.floor((idle - IDLE_MS) / 1000);
      if (left <= 0) {
        actions.reset();
        poke();
      } else setCountdown(left);
    }, 250);
    return () => {
      clearInterval(t);
      events.forEach((ev) => window.removeEventListener(ev, poke));
    };
  }, []);

  return countdown;
}
