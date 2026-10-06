import type { Metadata } from "next";

import { NewElectionView } from "@/features/elections/components/new-election-view";

export const metadata: Metadata = { title: "Nuevo proceso electoral · Averyn" };

/**
 * Página `/elections/new`: el asistente para crear un proceso electoral.
 *
 * @returns La pantalla del asistente.
 */
export default function NewElectionPage() {
  return <NewElectionView />;
}
