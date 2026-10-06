import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginView } from "@/features/authentication/components/login-view";
import { AFTER_LOGIN_PATH } from "@/features/authentication/routes";
import { hasMockSession } from "@/features/authentication/services/mock-session";

export const metadata: Metadata = { title: "Iniciar sesión · Averyn" };

/**
 * Página `/login`. Si ya hay una sesión abierta, lleva directo al dashboard.
 *
 * @returns La pantalla de inicio de sesión.
 */
export default async function LoginPage() {
  if (await hasMockSession()) {
    redirect(AFTER_LOGIN_PATH);
  }
  return <LoginView />;
}
