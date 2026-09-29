import { MessagesSquare, type LucideIcon } from "lucide-react";
import { cn } from "@/lib";

/** The assistant's avatar: a plain chat icon on UOI blue. Deliberately not the UOI logo,
    which brand guidelines don't allow to be cropped or recoloured. */
export function AiOrb({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full bg-primary text-white", className)}
      style={{ width: size, height: size }}
    >
      <MessagesSquare size={size * 0.48} strokeWidth={2} />
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
