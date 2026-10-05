import type { ReactNode } from "react";
import { DOC_PAGES } from "@/lib/docs-pages";

/** Portada de página + contenido principal. La portada de «Inicio» es especial (ver app/(ds)/page.tsx). */
export function DocPage({ slug, children }: { slug: string; children: ReactNode }) {
  const meta = DOC_PAGES.find((p) => p.slug === slug)!;
  return (
    <>
      <header className="ds-cover ds-cover--page">
        <div className="ds-wrap">
          <span className="mono" style={{ color: "#fff", opacity: 0.85 }}>{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
          <p>{meta.lead}</p>
        </div>
      </header>
      <main id="contenido">{children}</main>
    </>
  );
}
