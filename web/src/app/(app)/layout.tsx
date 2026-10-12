import { ExpeditionProvider } from "@/components/expedition-provider";

/** Layout de la app (juego): solo aquí vive el estado de la expedición; la landing en `/` no lo necesita. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <ExpeditionProvider>{children}</ExpeditionProvider>;
}
