import type { Metadata } from "next";

import { IdentityView } from "@/features/identity/components/identity-view";
import { parseStatusFilter } from "@/features/identity/person-rules";

export const metadata: Metadata = { title: "Identidad · Averyn" };

type IdentityPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Toma el primer valor de un parámetro de la URL (puede venir repetido). */
function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/**
 * Página `/identity`: el listado de personas. Los filtros salen de la URL (`?q=` y `?status=`).
 *
 * @param props - Los parámetros de búsqueda de la URL.
 * @returns La pantalla de Identidad.
 */
export default async function IdentityPage({ searchParams }: IdentityPageProps) {
  const params = await searchParams;
  return <IdentityView filter={{ query: firstValue(params.q), status: parseStatusFilter(firstValue(params.status)) }} />;
}
