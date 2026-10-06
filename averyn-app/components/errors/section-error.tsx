"use client";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";

/**
 * Estado de error de una pantalla de módulo: avisa sin culpar y deja reintentar (coding-standard 22).
 *
 * Los `error.tsx` de cada ruta lo usan para no repetir el mismo aviso. Es un Client Component
 * porque Next.js lo exige para los límites de error.
 *
 * @param props - `what` completa el título («No pudimos cargar {what}») y `reset` vuelve a intentarlo.
 * @returns La alerta con el botón de reintento.
 */
export function SectionError({ what, reset }: { what: string; reset: () => void }) {
  return (
    <Alert tone="error" title={`No pudimos cargar ${what}`}>
      Revisa tu conexión e inténtalo de nuevo.
      <div>
        <Button variant="ghost" onClick={reset}>
          Reintentar
        </Button>
      </div>
    </Alert>
  );
}
