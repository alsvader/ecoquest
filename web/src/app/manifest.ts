import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/jugar",
    name: "EcoQuest",
    short_name: "EcoQuest",
    description: "Misiones de exploración al aire libre: fotografía lo que encuentras y la IA te ayuda a verificarlo.",
    lang: "es-MX",
    start_url: "/jugar",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#FFFBEF",
    theme_color: "#FFFBEF",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
