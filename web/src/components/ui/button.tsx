import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Botón EcoQuest (§7.1). Sustituye al de shadcn.
 * Desviación: sin `asChild`/@radix-ui/react-slot (no está instalado); para enlaces usa `LinkButton`.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2.5 rounded-none border-4 border-tinta text-tinta",
    "font-display text-lg text-center select-none cursor-pointer",
    "shadow-brutal transition-[transform,box-shadow] duration-snap",
    "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000]",
    "active:translate-x-press active:translate-y-press active:shadow-none",
    "data-[pressed=true]:translate-x-press data-[pressed=true]:translate-y-press data-[pressed=true]:shadow-none",
    "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-turbo",
    "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-[#E8E4D6] disabled:text-[#555555]",
    "disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-lima",
        secondary: "bg-white",
        ia: "bg-glitch",
        logro: "bg-turbo",
        ghost:
          "bg-transparent border-dashed shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "min-h-tap px-6 py-3", // 56 px
        sm: "min-h-12 px-4 py-2 text-sm", // 48 px, 16 px
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "default", block: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Fuerza el estado "presionado" (demos o toggles). */
  pressed?: boolean;
}

export function Button({ className, variant, size, block, pressed, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-pressed={pressed ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}

/** Enlace con apariencia de botón (navegación, no acción). */
export function LinkButton({
  className,
  variant,
  size,
  block,
  ...props
}: React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return <Link className={cn(buttonVariants({ variant, size, block }), className)} {...props} />;
}

export { buttonVariants };
