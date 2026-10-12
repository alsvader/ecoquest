import { cn } from "@/lib/utils";
import { PixelIcon, type PixelIconName } from "./pixel-icon";

const V = {
  ok: { bg: "bg-lima", icon: "check" as PixelIconName, role: "status" },
  xp: { bg: "bg-voltio", icon: "star" as PixelIconName, role: "status" },
  info: { bg: "bg-glitch", icon: "eye" as PixelIconName, role: "status" },
  warn: { bg: "bg-lava", icon: "warn" as PixelIconName, role: "alert" },
} as const;

export type EqToastVariant = keyof typeof V;

/** Confirmación breve (§7.6). Sin sonido, sin vibración, sin quedarse fijo. */
export function EqToast({ variant, title, children }: { variant: EqToastVariant; title: string; children?: React.ReactNode }) {
  const v = V[variant];
  return (
    <div role={v.role} className={cn("flex w-full max-w-[420px] items-start gap-3 border-4 border-tinta px-3.5 py-3 text-tinta shadow-brutal", v.bg)}>
      <span className="flex h-9 w-9 flex-none items-center justify-center border-3 border-tinta bg-white">
        <PixelIcon name={v.icon} scale={4} flat />
      </span>
      <div>
        <b className="block font-display text-[18px] font-normal">{title}</b>
        {children && <span className="text-sm leading-[1.35]">{children}</span>}
      </div>
    </div>
  );
}
