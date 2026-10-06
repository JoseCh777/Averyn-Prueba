"use client";

import { SectionError } from "@/components/errors/section-error";

/**
 * Estado de error de Identidad: avisa y deja reintentar.
 *
 * @param props - `reset` vuelve a intentar renderizar la pantalla.
 * @returns El aviso con el botón de reintento.
 */
export default function IdentityError({ reset }: { error: Error; reset: () => void }) {
  return <SectionError what="las personas" reset={reset} />;
}
