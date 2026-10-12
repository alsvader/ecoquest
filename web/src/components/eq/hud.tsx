import { t } from "@/i18n";

/** HUD superior en pixel (§7.10). `left` es el título de la pantalla: se renderiza como el único h1. */
export function Hud({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 font-pixel text-pixel-sm font-bold uppercase tracking-[0.5px]">
      <h1 className="font-pixel text-pixel-sm font-bold uppercase tracking-[0.5px]">{left}</h1>
      <span className="whitespace-nowrap">{right}</span>
    </div>
  );
}

/** Chip «IA» (Cian) del HUD de resultado. El texto «IA» es literal de marca, no copy traducible. */
export const IaChip = () => (
  <span className="border-2 border-tinta bg-glitch px-1.5 py-0.5 font-pixel text-pixel-sm font-bold uppercase">
    <span aria-hidden="true">IA</span>
    <span className="sr-only">{t("hud.iaAria")}</span>
  </span>
);
