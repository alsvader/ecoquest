import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** twMerge conoce los nombres del tema EcoQuest (si no, text-pixel-* se confunde con un color y se descarta). */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["pixel-sm", "pixel-md", "pixel-lg"] }],
      shadow: [{ shadow: ["brutal-sm", "brutal", "brutal-lg"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
