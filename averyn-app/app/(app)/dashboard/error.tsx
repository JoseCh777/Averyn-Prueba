"use client";

import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";

/**
 * Estado de error del dashboard: avisa sin culpar y deja reintentar (coding-standard 22).
 *
 * Es un Client Component porque Next.js lo exige para los límites de error.
 *
 * @param props - `reset` vuelve a intentar renderizar el dashboard.
 * @returns La alerta con el botón de reintento.
 */
export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Alert tone="error" title="No pudimos cargar el dashboard">
      Revisa tu conexión e inténtalo de nuevo.
      <div>
        <Button variant="ghost" onClick={reset}>Reintentar</Button>
      </div>
    </Alert>
  );
}
