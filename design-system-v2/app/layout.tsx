import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

/* Fuente de títulos: Space Grotesk (Horizonte). AGENTS §9 pide Plus Jakarta Sans: se decide en ADR-011;
   cambiarla es sustituir esta línea. */
const heading = Space_Grotesk({ variable: "--font-heading", subsets: ["latin"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horizonte 2.0 · Averyn",
  description: "Design System Horizonte v2.0: componentes en React.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
