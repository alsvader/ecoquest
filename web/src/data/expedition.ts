import type { DictKey } from "@/i18n";

export const MISSION_IDS = ["leaf", "flower", "roots"] as const;
export type MissionId = (typeof MISSION_IDS)[number];

export interface Mission {
  id: MissionId;
  titleKey: DictKey;
  hintKey: DictKey;
  shortKey: DictKey;
  /** Título corto de la lista de misiones. */
  listKey: DictKey;
  /** Nombre en la fila del resumen. */
  summaryKey: DictKey;
  /** «Parecido con «…»» del panel de similitud. */
  targetKey: DictKey;
  /** «Parece …» tras una coincidencia. */
  seenKey: DictKey;
  /** «La IA no está segura de que haya …». */
  maybeKey: DictKey;
  icon: "leaf" | "flower" | "tree";
  /**
   * Umbral de confirmación de la misión para la línea del panel de similitud.
   * TODO(diseño): el contrato de /classify no devuelve umbrales; hoy es un valor espejo de
   * inference/app/thresholds.json (campo `confirm`, provisional). Si cambia allí, actualizar aquí
   * o, mejor, exponerlo en la respuesta de la API. Solo se dibuja una línea; nunca se muestran números.
   */
  threshold: number;
}

export interface Expedition {
  id: string;
  titleKey: DictKey;
  placeKey: DictKey;
  durationMin: number;
  missions: Mission[];
}

export const EDEN_EXPEDITION: Expedition = {
  id: "descubre-el-eden",
  titleKey: "expedition.title",
  placeKey: "expedition.place",
  durationMin: 20,
  missions: [
    {
      id: "leaf",
      titleKey: "mission.leaf.title",
      hintKey: "mission.leaf.hint",
      shortKey: "mission.leaf.short",
      listKey: "mission.leaf.list",
      summaryKey: "mission.leaf.summary",
      targetKey: "mission.leaf.target",
      seenKey: "mission.leaf.seen",
      maybeKey: "mission.leaf.maybe",
      icon: "leaf",
      threshold: 0.7,
    },
    {
      id: "flower",
      titleKey: "mission.flower.title",
      hintKey: "mission.flower.hint",
      shortKey: "mission.flower.short",
      listKey: "mission.flower.list",
      summaryKey: "mission.flower.summary",
      targetKey: "mission.flower.target",
      seenKey: "mission.flower.seen",
      maybeKey: "mission.flower.maybe",
      icon: "flower",
      threshold: 0.5,
    },
    {
      id: "roots",
      titleKey: "mission.roots.title",
      hintKey: "mission.roots.hint",
      shortKey: "mission.roots.short",
      listKey: "mission.roots.list",
      summaryKey: "mission.roots.summary",
      targetKey: "mission.roots.target",
      seenKey: "mission.roots.seen",
      maybeKey: "mission.roots.maybe",
      icon: "tree",
      threshold: 0.6,
    },
  ],
};

export function isMissionId(value: string): value is MissionId {
  return (MISSION_IDS as readonly string[]).includes(value);
}

export function getMission(id: MissionId): Mission {
  return EDEN_EXPEDITION.missions.find((m) => m.id === id)!;
}
