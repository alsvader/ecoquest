import "./landing.css";

/** Landing pública en `/`. Sin ExpeditionProvider: no usa el estado de la app. */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <div className="landing">{children}</div>;
}
