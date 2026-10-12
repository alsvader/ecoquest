import { cn } from "@/lib/utils";

/** Etiqueta inclinada ±2° (§7.8). Solo decorativa. */
export function Sticker({
  children,
  color = "bg-voltio",
  right = false,
  className,
}: {
  children: React.ReactNode;
  color?: "bg-white" | "bg-lima" | "bg-voltio" | "bg-turbo" | "bg-glitch";
  right?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap border-3 border-tinta px-3 py-1.5 font-pixel text-pixel-sm font-bold uppercase leading-[1.5] text-tinta shadow-brutal-sm",
        right ? "rotate-sticker-r" : "rotate-sticker",
        color,
        className,
      )}
    >
      {children}
    </span>
  );
}
