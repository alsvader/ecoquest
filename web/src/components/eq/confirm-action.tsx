"use client";

import { useEffect, useRef, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { t } from "@/i18n";

/**
 * Acción con confirmación en dos pasos, en línea (sin window.confirm).
 * Al abrir, el foco pasa al mensaje; al cancelar o terminar, vuelve al botón que la abrió.
 * Si `onConfirm` lanza, se muestra `errorMessage` y la confirmación sigue abierta para reintentar.
 */
export function ConfirmAction({
  label,
  message,
  confirmLabel,
  onConfirm,
  errorMessage = t("common.actionError"),
  variant = "secondary",
  size = "sm",
  disabled,
}: {
  label: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
  errorMessage?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) messageRef.current?.focus();
    else if (wasOpen.current) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  async function confirm() {
    setBusy(true);
    setError(false);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {open ? (
        <div role="group" aria-label={label} className="flex flex-col gap-2 border-3 border-tinta bg-white p-3 text-tinta">
          <p ref={messageRef} tabIndex={-1} className="text-base font-bold outline-none">
            {message}
          </p>
          <Button variant="destructive" size="sm" block disabled={busy} onClick={() => void confirm()}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" size="sm" block disabled={busy} onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
        </div>
      ) : (
        <Button
          ref={triggerRef}
          variant={variant}
          size={size}
          block
          disabled={disabled}
          onClick={() => {
            setError(false);
            setOpen(true);
          }}
        >
          {label}
        </Button>
      )}
      {/* Región en vivo siempre montada; el texto se inyecta solo si hay error. */}
      <p role="alert" className={error ? "text-sm font-bold" : "sr-only"}>
        {error ? errorMessage : null}
      </p>
    </div>
  );
}
