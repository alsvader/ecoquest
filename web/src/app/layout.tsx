import type { Metadata, Viewport } from "next";
import { ExpeditionProvider } from "@/components/expedition-provider";
import { t } from "@/i18n";
import { fontBody, fontDisplay, fontPixel } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoQuest",
  description: t("app.tagline"),
  applicationName: "EcoQuest",
  appleWebApp: { capable: true, title: "EcoQuest", statusBarStyle: "default" },
};

// Sin maximum-scale ni user-scalable=no: el zoom del navegador debe estar permitido (§9).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFBEF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${fontPixel.variable} ${fontDisplay.variable} ${fontBody.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-background font-sans text-base text-foreground">
        <ExpeditionProvider>{children}</ExpeditionProvider>
      </body>
    </html>
  );
}
