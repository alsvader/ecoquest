import Image from "next/image";
import { cn } from "@/lib/utils";

export type LandingIconName =
  | "arrow" | "camera" | "check" | "eye" | "flower" | "heart" | "leaf" | "lock"
  | "medal" | "phone" | "pin" | "plus" | "star" | "tree" | "warn";

/** Equivale a `<img src="assets/icons/x.svg" width height alt="" class="px …">` de la landing HTML. */
export function Icon({ name, size, className }: { name: LandingIconName; size: number; className?: string }) {
  return <Image src={`/landing/icons/${name}.svg`} width={size} height={size} alt="" unoptimized className={cn("px", className)} />;
}
