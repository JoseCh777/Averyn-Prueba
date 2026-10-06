import type { Metadata } from "next";

import { LandingView } from "@/features/landing/components/landing-view";

export const metadata: Metadata = {
  title: "Averyn — Identidad inteligente para procesos institucionales",
  description:
    "Averyn: plataforma institucional de identidad, biometría, inteligencia artificial y seguridad para automatizar procesos institucionales críticos.",
};

/** Landing pública (fuera del grupo `(app)`: no exige sesión). */
export default function HomePage() {
  return <LandingView />;
}
