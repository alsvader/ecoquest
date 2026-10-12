import Link from "next/link";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import { Button } from "@/components/ui/button";
import { PixelIcon, type PixelIconName } from "./pixel-icon";
import { PendingChip, StatusBadge, type MissionResult } from "./status-badge";

const tile: Record<"leaf" | "flower" | "tree", string> = {
  leaf: "bg-lima",
  flower: "bg-turbo",
  tree: "bg-voltio",
};

export interface MissionCardProps {
  index: number; // 1..3
  total: number; // 3
  icon: "leaf" | "flower" | "tree";
  title: string;
  description?: string;
  result?: MissionResult; // undefined = pendiente
  onCapture?: () => void;
  /** Versión lista (pantalla Misiones). Con `href` toda la tarjeta lleva a la misión en un toque. */
  compact?: boolean;
  href?: string;
  onNavigate?: () => void;
}

export function MissionCard({ index, total, icon, title, description, result, onCapture, compact, href, onNavigate }: MissionCardProps) {
  const done = result === "match" || result === "manual";
  if (compact) {
    const body = (
      <>
        <div className={cn("flex h-14 w-14 items-center justify-center border-2 border-tinta", tile[icon])}>
          <PixelIcon name={icon as PixelIconName} scale={4} flat />
        </div>
        <div>
          <h3 className="font-sans text-base font-bold leading-tight">{title}</h3>
          <div className="mt-1">{result ? <StatusBadge result={result} size="chip" /> : <PendingChip />}</div>
        </div>
      </>
    );
    const cls = cn(
      "grid min-h-tap grid-cols-[56px_1fr] items-center gap-3 border-3 border-tinta p-3 text-tinta shadow-brutal-sm",
      done ? "bg-[#F2FFE0]" : "bg-white",
    );
    return href ? (
      <Link href={href} onClick={onNavigate} className={cn(cls, "focus-visible:outline-offset-2")}>
        {body}
      </Link>
    ) : (
      <article className={cls}>{body}</article>
    );
  }
  return (
    <article className={cn("grid grid-cols-[64px_1fr] gap-3.5 border-4 border-tinta p-3.5 shadow-brutal", done ? "bg-[#F2FFE0]" : "bg-white")}>
      <div className={cn("flex h-16 w-16 items-center justify-center border-3 border-tinta", tile[icon])}>
        <PixelIcon name={icon as PixelIconName} scale={5} flat />
      </div>
      <div>
        <span className="font-pixel text-pixel-sm font-bold uppercase tracking-[0.5px]">{t("mission.hud", { n: index, total })}</span>
        <h3 className="mb-1.5 mt-1 font-display text-lg leading-[1.1]">{title}</h3>
        {description && <p className="text-base">{description}</p>}
      </div>
      <div className="col-span-full flex items-center justify-between gap-2.5 border-t-3 border-tinta pt-3">
        {done ? (
          <>
            <StatusBadge result={result!} />
            <span className="font-pixel text-pixel-sm font-bold uppercase">{t("mission.done")}</span>
          </>
        ) : (
          <>
            <span className="font-pixel text-pixel-sm font-bold uppercase">{t("mission.pending")}</span>
            {onCapture && (
              <Button variant="ia" size="sm" onClick={onCapture}>
                {t("mission.capture")}
              </Button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
