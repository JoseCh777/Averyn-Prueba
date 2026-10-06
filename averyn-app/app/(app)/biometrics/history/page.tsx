import type { Metadata } from "next";

import { parseHistoryFilter } from "@/features/biometrics/biometric-rules";
import { HistoryView } from "@/features/biometrics/components/history-view";

export const metadata: Metadata = { title: "Historial biométrico · Averyn" };

type HistoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Toma el primer valor de un parámetro de la URL (puede venir repetido). */
function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Página `/biometrics/history`: el historial de registros y verificaciones. Los filtros salen de la URL.
 *
 * @param props - Los parámetros de búsqueda de la URL.
 * @returns La pantalla del historial.
 */
export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams;
  return <HistoryView filter={parseHistoryFilter({ method: firstValue(params.method), result: firstValue(params.result) })} />;
}
