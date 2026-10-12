import Image from "next/image";
import { cn } from "@/lib/utils";

export type LandingIconName =
  | "arrow" | "camera" | "check" | "eye" | "flower" | "hand" | "heart" | "leaf" | "lock"
  | "medal" | "phone" | "pin" | "plus" | "retry" | "star" | "tree" | "warn";

/** Equivale a `<img src="assets/icons/x.svg" width height alt="" class="px …">` de la landing HTML. */
/** `eager`: iconos del navbar/hero (above the fold), sin carga diferida. */
export function Icon({ name, size, className, eager }: { name: LandingIconName; size: number; className?: string; eager?: boolean }) {
  return <Image src={`/landing/icons/${name}.svg`} width={size} height={size} alt="" unoptimized loading={eager ? "eager" : undefined} className={cn("px", className)} />;
}
