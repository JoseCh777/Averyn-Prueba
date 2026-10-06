import type { Metadata } from "next";

import { PersonDetailView } from "@/features/identity/components/person-detail-view";
import { personService } from "@/features/identity/services";

type PersonPageProps = { params: Promise<{ personId: string }> };

/**
 * El título de la pestaña lleva el nombre de la persona; si no existe, el genérico.
 *
 * @param props - Los parámetros de la ruta.
 * @returns Los metadatos de la página.
 */
export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { personId } = await params;
  const person = await personService.getById(personId);
  return { title: person === undefined ? "Persona no encontrada · Averyn" : `${person.name} · Averyn` };
}

/**
 * Página `/identity/[personId]`: la ficha de una persona.
 *
 * @param props - Los parámetros de la ruta.
 * @returns La pantalla de detalle.
 */
export default async function PersonPage({ params }: PersonPageProps) {
  const { personId } = await params;
  return <PersonDetailView personId={personId} />;
}
