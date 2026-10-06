import type { Metadata } from "next";

import { PreRegistrationView } from "@/features/documents/components/pre-registration-view";

export const metadata: Metadata = { title: "Nuevo registro · Averyn" };

/**
 * Página `/documents/pre-registration`: el asistente de pre-registro con OCR.
 *
 * @returns La pantalla del asistente.
 */
export default function PreRegistrationPage() {
  return <PreRegistrationView />;
}
