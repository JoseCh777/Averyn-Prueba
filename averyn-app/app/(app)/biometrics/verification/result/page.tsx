import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { VerificationResultView } from "@/features/biometrics/components/verification-result-view";

export const metadata: Metadata = { title: "Resultado de verificación · Averyn" };

type ResultPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Página `/biometrics/verification/result?event=<id>`: el resultado de una verificación.
 *
 * @param props - Los parámetros de búsqueda de la URL.
 * @returns El resultado, o «no encontrado» si falta el evento.
 */
export default async function VerificationResultPage({ searchParams }: ResultPageProps) {
  const { event } = await searchParams;
  const eventId = Array.isArray(event) ? event[0] : event;
  if (eventId === undefined) notFound();
  return <VerificationResultView eventId={eventId} />;
}
