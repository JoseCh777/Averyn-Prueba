import type { Metadata } from "next";

import { ElectionDetailView } from "@/features/elections/components/election-detail-view";
import { electionService } from "@/features/elections/services";

type ElectionPageProps = { params: Promise<{ id: string }> };

/**
 * El título de la pestaña lleva el nombre del proceso; si no existe, el genérico.
 *
 * @param props - Los parámetros de la ruta.
 * @returns Los metadatos de la página.
 */
export async function generateMetadata({ params }: ElectionPageProps): Promise<Metadata> {
  const { id } = await params;
  const election = await electionService.getById(id);
  return { title: election === undefined ? "Proceso no encontrado · Averyn" : `${election.name} · Averyn` };
}

/**
 * Página `/elections/[id]`: el detalle de un proceso electoral.
 *
 * @param props - Los parámetros de la ruta.
 * @returns La pantalla de detalle.
 */
export default async function ElectionPage({ params }: ElectionPageProps) {
  const { id } = await params;
  return <ElectionDetailView electionId={id} />;
}
