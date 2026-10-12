import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EcoQuest",
    short_name: "EcoQuest",
    description: "The Real World Is Your Playground.",
    lang: "es-MX",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFBEF",
    theme_color: "#FFFBEF",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
