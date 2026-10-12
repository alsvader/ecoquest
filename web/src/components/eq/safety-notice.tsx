import { t } from "@/i18n";
import { PixelIcon } from "./pixel-icon";

/** Aviso de seguridad (§7.7): Naranja Lava, cuerpo en Space Grotesk (nunca Silkscreen). */
export function SafetyNotice() {
  return (
    <aside aria-labelledby="aviso-seguridad" className="border-3 border-tinta bg-lava px-3 py-2.5 text-base font-medium leading-[1.3] text-tinta">
      <h2 id="aviso-seguridad" className="mb-1.5 flex items-center gap-2 font-pixel text-pixel-sm font-bold uppercase">
        <PixelIcon name="warn" scale={2} flat /> {t("safety.title")}
      </h2>
      <p>{t("safety.body")}</p>
    </aside>
  );
}
