import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib";
import mark from "@/assets/uoi-mark-white.png";

/** The assistant's avatar: the white UOI mark on a brand blue-purple disc. */
export function AiOrb({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full shadow-[0_4px_12px_-4px_rgb(0_94_184/0.5)]", className)}
      style={{ width: size, height: size, background: "linear-gradient(135deg, rgb(var(--ai-1)), rgb(var(--ai-2)))" }}
    >
      <img src={mark} alt="" draggable={false} style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  );
}

/** Small label marking something the AI produced, in the portal's blue-purple tint. */
export function AiTag({ children, className, icon: Icon }: { children: React.ReactNode; className?: string; icon?: LucideIcon }) {
  return (
    <span className={cn("ai-tint inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-primary ring-1 ring-primary/10", className)}>
      {Icon && <Icon size={13} strokeWidth={2.25} />}
      {children}
    </span>
  );
}
