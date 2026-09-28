import { Sparkles } from "lucide-react";
import { cn } from "@/lib";

/** The assistant's avatar: a slowly turning brand-gradient orb. */
export function AiOrb({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("relative grid shrink-0 place-items-center rounded-full", className)} style={{ width: size, height: size }}>
      <span
        className="orb-spin absolute inset-0 rounded-full"
        style={{ background: "conic-gradient(from 0deg, rgb(var(--ai-1)), rgb(var(--ai-2)), rgb(var(--ai-3)), rgb(var(--ai-1)))" }}
      />
      <span className="absolute inset-[3px] rounded-full bg-page" />
      <Sparkles className="relative text-regal-hi" size={size * 0.45} strokeWidth={2} />
    </span>
  );
}

/** Small label that marks something as produced by the AI. */
export function AiTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("ai-tint inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-regal-hi", className)}>
      <Sparkles size={13} strokeWidth={2.25} />
      {children}
    </span>
  );
}
