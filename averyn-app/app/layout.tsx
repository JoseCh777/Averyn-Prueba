import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

/* Titulares: Space Grotesk ( DESIGN.md y frontend original averyn-frontend ). */
const headingFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

/** Barra del navegador al color de lo que hay arriba de la página; el teclado virtual redimensiona el contenido (no lo tapa). */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EAF0FE" },
    { media: "(prefers-color-scheme: dark)", color: "#071A36" },
  ],
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: 'Averyn',
  description: 'Plataforma institucional de identificacion, autenticacion y biometria.',
  icons: {
    icon: [
      { url: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/assets/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
