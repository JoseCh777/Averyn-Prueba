import type { Metadata } from "next";

import { NewPersonView } from "@/features/identity/components/new-person-view";

export const metadata: Metadata = { title: "Nueva persona · Averyn" };

/**
 * Página `/identity/new`: formulario de alta de una persona.
 *
 * @returns La pantalla «Nueva persona».
 */
export default function NewPersonPage() {
  return <NewPersonView />;
}
