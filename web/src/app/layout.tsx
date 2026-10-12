import type { Metadata, Viewport } from "next";
import { fontBody, fontDisplay, fontPixel } from "./fonts";
import "./globals.css";

const DESCRIPTION = "Misiones de exploración al aire libre: fotografía lo que encuentras y la IA te ayuda a verificarlo.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "EcoQuest", template: "%s · EcoQuest" },
  description: DESCRIPTION,
  applicationName: "EcoQuest",
  appleWebApp: { capable: true, title: "EcoQuest", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "EcoQuest",
    locale: "es_MX",
    title: "EcoQuest",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "EcoQuest", description: DESCRIPTION },
};

// Sin maximum-scale ni user-scalable=no: el zoom del navegador debe estar permitido (§9).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFBEF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${fontPixel.variable} ${fontDisplay.variable} ${fontBody.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-background font-sans text-base text-foreground">
        {children}
      </body>
    </html>
  );
}
