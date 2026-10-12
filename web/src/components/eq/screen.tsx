import { cn } from "@/lib/utils";

/**
 * Contenedor de pantalla móvil (§8): fondo a sangre, columna max-w-md, safe-area inferior.
 * Los hijos van con `gap-3`; usa `<div className="flex-1" />` para anclar la acción principal abajo.
 */
export function Screen({
  bg,
  children,
  className,
}: {
  bg: "bg-lima" | "bg-papel" | "bg-voltio";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("min-h-dvh", bg)}>
      <div className={cn("mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]", className)}>
        {children}
      </div>
    </main>
  );
}

export function ScreenLoading({ label }: { label: string }) {
  return (
    <Screen bg="bg-papel">
      <p role="status" className="font-pixel text-pixel-sm font-bold uppercase">
        {label}
      </p>
    </Screen>
  );
}
