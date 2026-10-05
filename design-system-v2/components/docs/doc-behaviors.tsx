"use client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/overlay";

/**
 * Comportamientos comunes de la documentación (migrados de ds.js):
 *  - botones «Copiar» de los bloques de código (data-copy="#id")
 *  - muestras de color e iconos (data-hex / data-icon) se copian al hacer clic
 *  - índice lateral: marca la sección visible
 *  - regiones con desplazamiento horizontal (tablas, código) accesibles con teclado
 */
export function DocBehaviors() {
  const toast = useToast();

  useEffect(() => {
    const copy = async (text: string, label?: string) => {
      try { await navigator.clipboard.writeText(text); toast({ title: "Copiado", text: label ?? text, kind: "ok" }); }
      catch { toast({ title: "No se pudo copiar", text: "Selecciona el texto manualmente.", kind: "warn" }); }
    };
    const click = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const b = t.closest<HTMLElement>(".copy[data-copy]");
      if (b) { const el = document.querySelector(b.getAttribute("data-copy")!); if (el) copy(el.textContent ?? "", "Fragmento de código"); return; }
      const sw = t.closest<HTMLElement>("[data-hex]");
      if (sw) copy(sw.dataset.hex!, sw.dataset.hex);
      const ic = t.closest<HTMLElement>("[data-icon]");
      if (ic) copy(ic.dataset.icon!, ic.dataset.icon);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [toast]);

  /* Formularios de muestra (data-nosubmit): no envían nada. */
  useEffect(() => {
    const submit = (e: Event) => { if ((e.target as HTMLElement).closest("form[data-nosubmit]")) e.preventDefault(); };
    document.addEventListener("submit", submit);
    return () => document.removeEventListener("submit", submit);
  }, []);

  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.ds-side nav a[href^="#"]'));
    const secs = links.map((a) => document.querySelector(a.getAttribute("href")!)).filter(Boolean) as Element[];
    if (!secs.length || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === `#${en.target.id}`)); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    secs.forEach((s) => obs.observe(s));
    const top = () => { if (window.scrollY < 120) links.forEach((a) => a.classList.remove("is-current")); };
    window.addEventListener("scroll", top, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener("scroll", top); };
  });

  useEffect(() => {
    const run = () => {
      document.querySelectorAll<HTMLElement>(".doc-wrap, .codeblock pre").forEach((el) => {
        const cut = el.scrollWidth > el.clientWidth + 1;
        if (cut && !el.hasAttribute("data-sr")) { el.setAttribute("data-sr", "1"); el.tabIndex = 0; el.setAttribute("role", "region"); el.setAttribute("aria-label", el.matches("pre") ? "Código (desplazable)" : "Tabla (desplazable)"); }
        else if (!cut && el.hasAttribute("data-sr")) { el.removeAttribute("data-sr"); el.removeAttribute("tabindex"); el.removeAttribute("role"); el.removeAttribute("aria-label"); }
      });
    };
    run();
    window.addEventListener("resize", run);
    window.addEventListener("load", run);
    return () => { window.removeEventListener("resize", run); window.removeEventListener("load", run); };
  });

  return null;
}
