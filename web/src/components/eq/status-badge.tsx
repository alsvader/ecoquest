import { cn } from "@/lib/utils";
import { t, type DictKey } from "@/i18n";

import type { MissionResult } from "@/lib/types";
export type { MissionResult };

export const STATUS: Record<MissionResult, { bg: string; icon: string; label: DictKey; sub?: DictKey; chip: DictKey }> = {
  match: { bg: "bg-status-match", icon: "✓", label: "status.match", chip: "status.match" },
  unsure: { bg: "bg-status-unsure", icon: "?", label: "status.unsure", chip: "status.unsure" },
  retry: { bg: "bg-status-retry", icon: "↻", label: "status.retry", chip: "status.retry" },
  // TODO(diseño): el doc usa el emoji ✋ (§3.1); depende del emoji del sistema. Sin PixelIcon equivalente entre los 9 iconos.
  manual: { bg: "bg-status-manual", icon: "✋", label: "status.manual", sub: "status.manualSub", chip: "status.manualChip" },
};

/** Estado de resultado de IA (§7.3). Siempre icono + texto. */
export function StatusBadge({
  result,
  size = "default",
  className,
}: {
  result: MissionResult;
  size?: "default" | "chip";
  className?: string;
}) {
  const s = STATUS[result];
  if (size === "chip") {
    return (
      <span className={cn("inline-block whitespace-nowrap border-2 border-tinta px-1.5 py-0.5 text-xs font-bold uppercase text-tinta", s.bg, className)}>
        <span aria-hidden="true">{s.icon} </span>
        {t(s.chip)}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border-3 border-tinta py-1.5 pl-1.5 pr-3 text-sm font-bold leading-[1.1] text-tinta shadow-brutal-sm",
        s.bg,
        className,
      )}
    >
      <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center border-2 border-tinta bg-white text-[17px] leading-none">
        {s.icon}
      </span>
      <span>
        {t(s.label)}
        {s.sub && <small className="block text-xs font-bold uppercase tracking-[0.5px]">{t(s.sub)}</small>}
      </span>
    </span>
  );
}

/** Chip de misión sin resultado todavía. */
export function PendingChip() {
  return <span className="inline-block border-2 border-tinta bg-white px-1.5 py-px text-xs font-bold uppercase">{t("mission.pending")}</span>;
}
