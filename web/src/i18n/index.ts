import { es, type DictKey, type Dictionary } from "./es";

export type { DictKey };
export type Locale = "es";

const dictionaries: Record<Locale, Dictionary> = { es };
export const DEFAULT_LOCALE: Locale = "es";

export function translate(
  locale: Locale,
  key: DictKey,
  vars?: Record<string, string | number>,
): string {
  const template = dictionaries[locale]?.[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, name: string) =>
    name in vars ? String(vars[name]) : m,
  );
}

/** Traduce con el idioma por defecto (es). */
export function t(key: DictKey, vars?: Record<string, string | number>): string {
  return translate(DEFAULT_LOCALE, key, vars);
}
