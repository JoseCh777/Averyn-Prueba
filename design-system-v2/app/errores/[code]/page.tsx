import { notFound } from "next/navigation";
import { ErrorPage, type ErrorVariant } from "@/components/errors/error-page";

const CODES: ErrorVariant[] = ["403", "404", "500", "offline", "mantenimiento"];

export function generateStaticParams() {
  return CODES.map((code) => ({ code }));
}

export const metadata = { title: "Página de error · Horizonte 2.0", robots: { index: false } };

/** Vista de cada página de error del sistema (la usan las plantillas de la documentación como previsualización). */
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!CODES.includes(code as ErrorVariant)) notFound();
  return <ErrorPage variant={code as ErrorVariant} />;
}
