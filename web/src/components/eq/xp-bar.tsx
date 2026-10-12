import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import type { MissionResult } from "./status-badge";

type Seg = MissionResult | "pending";

/** Barra segmentada, un bloque por misión (§7.4). Lima = coincidencia, Rosa = manual (no verificada). */
export function XpBar({
  segments,
  label,
  hideHeader = false,
  className,
}: {
  segments: Seg[];
  label?: string;
  /** En la pantalla Misiones el HUD sustituye al encabezado de la barra (§8.2). */
  hideHeader?: boolean;
  className?: string;
}) {
  const done = segments.filter((s) => s === "match" || s === "manual").length;
  const manual = segments.filter((s) => s === "manual").length;
  const valuetext =
    t("xp.valuetext", { done, total: segments.length }) + (manual > 0 ? t("xp.valuetextManual", { n: manual }) : "");
  return (
    <div className={className}>
      {!hideHeader && (
        <div className="mb-2 flex items-center justify-between font-pixel text-pixel-sm font-bold uppercase tracking-[0.5px]">
          <span>{label ?? t("xp.label")}</span>
          <span>
            {done}/{segments.length}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={t("xp.aria")}
        aria-valuemin={0}
        aria-valuemax={segments.length}
        aria-valuenow={done}
        aria-valuetext={valuetext}
        className="flex h-10 gap-1 border-4 border-tinta bg-white p-1 shadow-brutal-sm"
      >
        {segments.map((s, i) => (
          <i
            key={i}
            className={cn(
              "flex-1 border-2 border-tinta",
              s === "match" && "bg-lima",
              s === "manual" && "bg-turbo",
              (s === "pending" || s === "unsure" || s === "retry") && "border-dashed bg-white",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Barra continua de avance general (§7.4). Rayado duro: única excepción permitida a «sin degradados». */
export function XpContinuous({ value }: { value: number /* 0–100 */ }) {
  return (
    <div
      className="relative h-[30px] border-4 border-tinta bg-white shadow-brutal-sm"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={t("xp.continuousValuetext", { value })}
      aria-label={t("xp.continuousAria")}
    >
      <div
        className="absolute inset-y-0 left-0 border-r-4 border-tinta bg-voltio"
        style={{
          width: `${value}%`,
          backgroundImage: "repeating-linear-gradient(90deg,transparent 0 18px,#000 18px 21px)",
        }}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 font-pixel text-pixel-sm font-bold uppercase">{t("xp.exp")}</span>
    </div>
  );
}
