import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import { PixelIcon } from "./pixel-icon";

/** Insignia de doble marco (§7.5). Bloqueada: «?» + «Próxima». */
export function Insignia({
  name = t("expedition.title"),
  ribbon = t("insignia.ribbonDone"),
  size = "default",
  locked = false,
  hasManual = false,
}: {
  name?: string;
  ribbon?: string;
  size?: "default" | "sm";
  locked?: boolean;
  hasManual?: boolean;
}) {
  const dim = size === "sm" ? "h-[140px] w-[140px] m-[34px]" : "h-[200px] w-[200px] m-[46px]";
  const inset = size === "sm" ? "inset-6" : "inset-[34px]";
  return (
    <figure className="flex flex-col items-center">
      <div
        className={cn("relative", dim)}
        role="img"
        aria-label={
          locked ? t("insignia.lockedAria") : t("insignia.aria", { name }) + (hasManual ? t("insignia.ariaManual") : "")
        }
      >
        <div className={cn("absolute inset-0 rotate-45 border-4 border-tinta shadow-brutal-lg", locked ? "bg-[#E8E4D6]" : "bg-voltio")} />
        <div className={cn("absolute rotate-45 border-4 border-tinta", inset, locked ? "border-dashed bg-white" : "bg-lima")} />
        <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-center">
          {locked ? (
            <>
              <span className="font-pixel text-pixel-md font-bold">?</span>
              <span className="font-pixel text-pixel-sm font-bold uppercase">{t("insignia.next")}</span>
            </>
          ) : (
            <>
              <PixelIcon name="tree" scale={size === "sm" ? 3 : 5} flat />
              {/* TODO(diseño): en sm el nombre usa 11 px (menor que text-pixel-sm) para caber en el rombo interior, como en la referencia. */}
              <span
                className={cn(
                  "font-pixel font-bold uppercase",
                  size === "sm" ? "max-w-[72px] text-[11px] leading-[1.3]" : "text-pixel-sm leading-[1.5]",
                )}
              >
                {name}
              </span>
            </>
          )}
        </div>
        {!locked && (
          <div
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 -translate-x-1/2 -rotate-3 whitespace-nowrap border-3 border-tinta bg-turbo px-2.5 py-1.5 font-pixel text-pixel-sm font-bold uppercase shadow-brutal-sm",
              size === "sm" ? "-bottom-7" : "-bottom-5",
            )}
          >
            {ribbon}
          </div>
        )}
      </div>
      {hasManual && !locked && <figcaption className="mt-2 text-center text-sm font-bold">{t("insignia.manualNote")}</figcaption>}
    </figure>
  );
}
