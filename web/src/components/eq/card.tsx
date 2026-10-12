import { cn } from "@/lib/utils";

/** Card base (§7.2): marco 4 px, sombra dura. Marco grande: `shadow-brutal-lg`. */
export function EqCard({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-none border-4 border-tinta bg-white p-6 text-tinta shadow-brutal", className)} {...p} />;
}
