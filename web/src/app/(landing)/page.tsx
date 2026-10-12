import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/sections/hero";
import { Problema } from "@/components/landing/sections/problema";
import { ComoSeJuega } from "@/components/landing/sections/como-se-juega";
import { Expedicion } from "@/components/landing/sections/expedicion";
import { IaAbierta } from "@/components/landing/sections/ia-abierta";
import { Principios } from "@/components/landing/sections/principios";
import { Villahermosa } from "@/components/landing/sections/villahermosa";
import { Stack } from "@/components/landing/sections/stack";
import { Contribuye } from "@/components/landing/sections/contribuye";
import { Roadmap } from "@/components/landing/sections/roadmap";
import { Faq } from "@/components/landing/sections/faq";
import { JugarCta } from "@/components/landing/sections/jugar-cta";
import { Footer } from "@/components/landing/sections/footer";

export const metadata: Metadata = {
  title: "EcoQuest · Guarda el teléfono. El parque es el nivel.",
  description:
    "EcoQuest convierte una caminata en una expedición de ~20 minutos: tres misiones, unas cuantas fotos y una insignia al final. Una IA de pesos abiertos interpreta tus hallazgos; tú pones los pasos.",
};

export default function LandingPage() {
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border-4 focus:border-tinta focus:bg-voltio focus:px-4 focus:py-3 focus:font-bold focus:shadow-brutal">Saltar al contenido</a>
      <Navbar />
      <main id="contenido">
      <Hero />
      <Problema />
      <ComoSeJuega />
      <Expedicion />
      <IaAbierta />
      <Principios />
      <Villahermosa />
      <Stack />
      <Contribuye />
      <Roadmap />
      <Faq />
      <JugarCta />
      </main>
      <Footer />
    </>
  );
}
