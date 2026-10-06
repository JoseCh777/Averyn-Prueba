"use client";

import { SectionError } from "@/components/errors/section-error";

/**
 * Estado de error de Biometría: avisa y deja reintentar.
 *
 * @param props - `reset` vuelve a intentar renderizar la pantalla.
 * @returns El aviso con el botón de reintento.
 */
export default function BiometricsError({ reset }: { error: Error; reset: () => void }) {
  return <SectionError what="la biometría" reset={reset} />;
}
