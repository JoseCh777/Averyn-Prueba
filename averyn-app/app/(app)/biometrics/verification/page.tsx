import type { Metadata } from "next";

import { FlowView } from "@/features/biometrics/components/flow-view";

export const metadata: Metadata = { title: "Verificar identidad · Averyn" };

type VerificationPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Página `/biometrics/verification`: elegir persona y método para verificar su identidad.
 * Con `?person=<id>` llega la persona ya elegida.
 *
 * @param props - Los parámetros de búsqueda de la URL.
 * @returns El flujo de verificación.
 */
export default async function VerificationPage({ searchParams }: VerificationPageProps) {
  const { person } = await searchParams;
  return <FlowView mode="verification" personId={Array.isArray(person) ? person[0] : person} />;
}
