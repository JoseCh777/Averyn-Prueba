"use client";
import { usePathname } from "next/navigation";
import { ErrorPage } from "@/components/errors/error-page";

export default function NotFound() {
  const path = usePathname();
  let shown = path;
  try { shown = decodeURIComponent(path); } catch { /* ruta mal codificada: se muestra tal cual */ }
  return <ErrorPage variant="404" path={shown} />;
}
