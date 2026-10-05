"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_PAGES, VERSION } from "@/lib/docs-pages";
import { SECTIONS } from "@/lib/docs-sections";

/** Barra lateral: grupos de páginas y, bajo la página actual, su índice por subgrupos. */
export function Sidebar() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const items: React.ReactNode[] = [];
  let lastGroup = "";
  for (const p of DOC_PAGES) {
    if (p.group !== lastGroup) { items.push(<span key={`g-${p.group}`} className="grp mono">{p.group}</span>); lastGroup = p.group; }
    const current = p.href === path;
    items.push(<Link key={p.slug} className="ds-page" href={p.href} aria-current={current ? "page" : undefined}>{p.label}</Link>);
    const secs = SECTIONS[p.slug];
    if (current && secs?.length) {
      let last = "";
      const sub: React.ReactNode[] = [];
      for (const s of secs) {
        if (s.group && s.group !== last) { sub.push(<span key={`s-${s.group}`} className="grp sub mono">{s.group}</span>); last = s.group; }
        sub.push(<a key={s.id} href={`#${s.id}`}>{s.label}</a>);
      }
      items.push(<div key={`${p.slug}-sub`} className="ds-subnav">{sub}</div>);
    }
  }
  return (
    <aside className="ds-side" aria-label="Índice del design system">
      <Link className="ds-side__brand" href="/" aria-label="Averyn, inicio del design system">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" />
      </Link>
      <p className="ds-side__ver mono">Design System · v{VERSION} Horizonte</p>
      <nav>{items}</nav>
    </aside>
  );
}
