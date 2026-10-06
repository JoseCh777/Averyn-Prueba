import type { Metadata } from "next";

import { EnrollmentDoneView } from "@/features/biometrics/components/enrollment-done-view";
import { FlowView } from "@/features/biometrics/components/flow-view";

export const metadata: Metadata = { title: "Registrar biometría · Averyn" };

type EnrollmentPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Toma el primer valor de un parámetro de la URL (puede venir repetido). */
function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Página `/biometrics/enrollment`: elegir persona y modalidad para registrar su biometría.
 * Con `?done=<evento>` muestra el acta del registro terminado; con `?person=<id>` llega la persona ya elegida.
 *
 * @param props - Los parámetros de búsqueda de la URL.
 * @returns El flujo de registro o el acta.
 */
export default async function EnrollmentPage({ searchParams }: EnrollmentPageProps) {
  const params = await searchParams;
  const done = firstValue(params.done);
  if (done !== undefined) return <EnrollmentDoneView eventId={done} />;
  return <FlowView mode="enrollment" personId={firstValue(params.person)} />;
}
