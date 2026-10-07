"use client";
import "@/app/styles/error.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export type ErrorVariant = "404" | "403" | "500" | "offline" | "mantenimiento";

const COPY: Record<ErrorVariant, { tag: string; num: string; word?: boolean; eyebrow: string; title: string; lead: string }> = {
  "404": { tag: "Error 404", num: "404", eyebrow: "Error 404 · Página no encontrada", title: "No encontramos esa página.", lead: "La dirección que pediste no existe o se movió. Revisa que esté bien escrita o vuelve al inicio." },
  "403": { tag: "Error 403", num: "403", eyebrow: "Error 403 · Sin permiso", title: "No tienes permiso para ver esto.", lead: "Tu cuenta no tiene acceso a esta sección. Pídelo a tu administrador o vuelve al panel." },
  "500": { tag: "Error 500", num: "500", eyebrow: "Error 500 · Fallo del servidor", title: "Algo falló de nuestro lado.", lead: "No pudimos completar tu solicitud. Inténtalo de nuevo en unos minutos; si sigue pasando, avisa a tu administrador." },
  offline: { tag: "Sin conexión", num: "Offline", word: true, eyebrow: "Sin conexión", title: "No hay conexión.", lead: "Revisa tu red. No perdiste nada: esta página se recargará sola cuando vuelva la conexión." },
  mantenimiento: { tag: "Mantenimiento", num: "Pronto", word: true, eyebrow: "Mantenimiento", title: "Estamos haciendo mejoras.", lead: "Averyn vuelve en breve. Gracias por tu paciencia." },
};

/** Figura de arcos que se dibujan y luego se parten: el único adorno de las páginas de error. */
function BrokenArcs() {
  const d = (n: number) => ({ ["--d" as string]: n });
  const c = (x: number, y: number) => ({ ["--cx" as string]: `${x}px`, ["--cy" as string]: `${y}px` });
  return (
    <svg viewBox="0 0 640 300" aria-hidden="true" focusable="false">
      <path d="M0 290 H640" stroke="rgba(255,255,255,.22)" strokeWidth="1" />
      <path className="er-draw" style={d(0)} d="M30 290 C110 60 330 40 450 290" pathLength={1} stroke="#FFFFFF" strokeWidth="1.5" />
      <path className="er-draw" style={d(1)} d="M90 290 C121 196 177 147 236 149" pathLength={1} stroke="#00ACD2" strokeWidth="2" />
      <g className="er-crack" style={c(18, 14)}><path className="er-draw" style={d(1.4)} d="M236 149 C290 151 347 196 390 290" pathLength={1} stroke="#00ACD2" strokeWidth="2" /></g>
      <g className="er-crack" style={c(22, -8)}><path className="er-draw" style={d(2)} d="M150 290 C190 170 270 160 330 290" pathLength={1} stroke="#55D6FF" strokeWidth="1.5" /></g>
      <path className="er-draw" style={d(3)} d="M300 8 L545 290" pathLength={1} stroke="#3D86FF" strokeWidth="2" />
      <path className="er-draw" style={d(3.4)} d="M326 -32 L471 135" pathLength={1} stroke="#3D86FF" strokeWidth="2" />
      <g className="er-crack" style={c(-22, 10)}><path className="er-draw" style={d(3.8)} d="M471 135 L605 290" pathLength={1} stroke="#3D86FF" strokeWidth="2" /></g>
      <circle className="er-ghost" cx="248" cy="139" r="15" stroke="#55D6FF" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Página de error de pantalla completa (404, 403, 500, sin conexión y mantenimiento). Un único <h1>; el número gigante es decorativo.
 * `path` muestra la ruta pedida (404/403); `onRetry` reemplaza la recarga por defecto (p. ej. `reset` de error.tsx).
 */
export function ErrorPage({ variant, path, onRetry, homeHref = "/", panelHref }: { variant: ErrorVariant; path?: string; onRetry?: () => void; homeHref?: string; panelHref?: string }) {
  const c = COPY[variant];
  // null = aún no se conoce el estado real (evita que el primer pintado del SSR mienta).
  const [online, setOnline] = useState<boolean | null>(null);
  const retry = onRetry ?? (() => window.location.reload());

  useEffect(() => {
    if (variant !== "offline") return;
    const paint = () => setOnline(navigator.onLine);
    paint();
    const on = () => { paint(); setTimeout(() => window.location.reload(), 600); };
    window.addEventListener("online", on);
    window.addEventListener("offline", paint);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", paint); };
  }, [variant]);

  const shown = path && path.length > 90 ? `${path.slice(0, 87)}…` : path;
  return (
    <div className="er">
      <div className="er-page">
        <header className="er-top">
          <Link className="er-brand" href={homeHref} aria-label="Averyn, ir al inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" />
          </Link>
          <span className="er-tag">{c.tag}</span>
        </header>
        <main className="er-stage" id="contenido">
          <div className="er-copy">
            <p className={`er-num${c.word ? " er-num--word" : ""}`} aria-hidden="true">{c.num}</p>
            <p className="er-eyebrow">{c.eyebrow}</p>
            <h1 className="er-title">{c.title}</h1>
            <p className="er-lead">{c.lead}</p>
            {shown && <p className="er-path"><span className="er-tag" style={{ color: "var(--av-night-text)" }}>Ruta</span> <code>{shown}</code></p>}
            <div className="er-actions">
              {variant === "404" && (
                <>
                  <Link className="er-btn er-btn--primary" href={homeHref}>Volver al inicio →</Link>
                  {panelHref && <Link className="er-btn er-btn--ghost" href={panelHref}>Ir al panel →</Link>}
                </>
              )}
              {variant === "403" && (
                <>
                  <Link className="er-btn er-btn--primary" href={homeHref} onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }}>Volver</Link>
                  {panelHref && <Link className="er-btn er-btn--ghost" href={panelHref}>Ir al panel →</Link>}
                </>
              )}
              {(variant === "500" || variant === "offline") && (
                <>
                  <button type="button" className="er-btn er-btn--primary" onClick={retry}>Reintentar</button>
                  <Link className="er-btn er-btn--ghost" href={homeHref}>Volver al inicio</Link>
                </>
              )}
              {variant === "mantenimiento" && <button type="button" className="er-btn er-btn--primary" onClick={retry}>Reintentar</button>}
            </div>
            {variant === "offline" && (
              <p className="er-status" role="status" hidden={online === null}>
                {online === null ? "" : online ? "Parece que la conexión volvió. Pulsa Reintentar." : "Esperando conexión…"}
              </p>
            )}
          </div>
          <div className="er-fig"><BrokenArcs /></div>
        </main>
      </div>
    </div>
  );
}
