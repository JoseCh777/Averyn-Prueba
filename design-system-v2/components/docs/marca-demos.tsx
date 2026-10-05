"use client";
/* «Marca y entregables»: kit de ilustración, vistas previas de correos y vista de impresión (antes: marca.js). */
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import emails from "@/lib/emails.json";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { useToast } from "@/components/ui/overlay";
import { useFrameBody } from "@/components/templates/frames";

function useCopyDownload() {
  const toast = useToast();
  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); toast({ title: "Copiado", text: label, kind: "ok" }); }
    catch { toast({ title: "No se pudo copiar", text: "Selecciona el texto manualmente.", kind: "warn" }); }
  };
  const download = (name: string, text: string, type = "text/plain;charset=utf-8") => {
    const a = document.createElement("a");
    a.download = name;
    a.href = URL.createObjectURL(new Blob([text], { type }));
    document.body.appendChild(a); a.click(); a.remove();
    toast({ title: "Descarga lista", text: name, kind: "ok" });
  };
  return { copy, download };
}

/* ---------- Kit de ilustración ---------- */
const P = { h: "M0 290 H640", a1: "M30 290 C110 60 330 40 450 290", a2: "M90 290 C150 110 300 95 390 290", a3: "M150 290 C190 170 270 160 330 290", d1: "M300 8 L545 290", d2: "M326 -32 L605 290" };
type Palette = { h: string; a1: string; a2: string; a3: string; d: string; ok: string };
const LIGHT: Palette = { h: "#CFDCF3", a1: "#000C24", a2: "#0092B5", a3: "#145FEE", d: "#145FEE", ok: "#047857" };
const NIGHT: Palette = { h: "rgba(255,255,255,.22)", a1: "#FFFFFF", a2: "#00ACD2", a3: "#55D6FF", d: "#3D86FF", ok: "#6EE7B7" };
const path = (d: string, col: string, w: number, extra = "") => `<path d="${d}" stroke="${col}" stroke-width="${w}"${extra}/>`;
const wrap = (inner: string, label: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" fill="none" role="img" aria-label="${label}">${inner}</svg>`;
const base = (c: Palette) => path(P.h, c.h, 1) + path(P.a1, c.a1, 1.5) + path(P.a2, c.a2, 2) + path(P.a3, c.a3, 1.5) + path(P.d1, c.d, 2) + path(P.d2, c.d, 2);
const arcs3 = (c: Palette) => path(P.h, c.h, 1) + path(P.a1, c.a1, 1.5) + path(P.a2, c.a2, 2) + path(P.a3, c.a3, 1.5);

type Kit = { k: string; n: string; d: string; night: boolean; label: string; svg: (c: Palette) => string };
const KIT: Kit[] = [
  { k: "base", n: "Arcos base", d: "La figura de marca: encabezados, portadas y fondos de página.", night: false, label: "Arcos de Averyn sobre el horizonte", svg: base },
  { k: "base-noche", n: "Arcos base · sobre navy", d: "Misma figura con trazos claros para superficies oscuras.", night: true, label: "Arcos de Averyn sobre fondo oscuro", svg: base },
  { k: "vacio", n: "Vacío", d: "Un solo arco pequeño y un punto: algo está por llegar.", night: false, label: "Un arco pequeño con un punto", svg: (c) => path(P.h, c.h, 1) + path(P.a3, c.a3, 1.5) + `<circle cx="240" cy="205" r="5" stroke="${c.a2}" stroke-width="2"/>` },
  { k: "exito", n: "Éxito", d: "Los arcos completos y una marca de verificación sobre ellos.", night: false, label: "Arcos completos con una marca de verificación", svg: (c) => arcs3(c) + `<circle cx="240" cy="62" r="32" stroke="${c.ok}" stroke-width="2"/>` + path("M224 62 l11 11 l21 -23", c.ok, 2.5) },
  { k: "error", n: "Error · arcos rotos", d: "Las piezas se separan: la figura no encaja. Solo para errores.", night: true, label: "Arcos rotos sobre fondo oscuro",
    svg: (c) => path(P.h, c.h, 1) + path(P.a1, c.a1, 1.5) + path("M90 290 C101 213 151 118 215 125", c.a2, 2) + `<g transform="translate(18 14)">${path("M215 125 C279 133 340 175 390 290", c.a2, 2)}</g><g transform="translate(22 -8)">${path(P.a3, c.a3, 1.5)}</g>` + path(P.d1, c.d, 2) },
  { k: "cargando", n: "Cargando", d: "Los arcos se dibujan una vez, de afuera hacia adentro. Sin bucle.", night: false, label: "Arcos dibujándose",
    svg: (c) => { const dr = (d: string, col: string, w: number, i: number) => path(d, col, w, ` class="ill-draw" pathLength="1" style="animation-delay:${i * 0.25}s"`); return path(P.h, c.h, 1) + dr(P.a1, c.a1, 1.5, 0) + dr(P.a2, c.a2, 2, 1) + dr(P.a3, c.a3, 1.5, 2); } },
];
const make = (k: Kit) => wrap(k.svg(k.night ? NIGHT : LIGHT), k.label);
const clean = (k: Kit) => make(k).replace(/ class="ill-draw" pathLength="1" style="[^"]*"/g, "");

export function IllustrationGrid() {
  const { copy, download } = useCopyDownload();
  return (
    <div className="ill-grid">
      {KIT.map((k) => (
        <article key={k.k} className="ill">
          {/* SVG generado por este módulo (cadenas propias, sin datos externos). */}
          <div className={`ill__art${k.night ? " ill__art--night" : ""}`} dangerouslySetInnerHTML={{ __html: make(k) }} />
          <div className="ill__txt"><b>{k.n}</b>{k.d}</div>
          <div className="ill__act">
            <button type="button" onClick={() => copy(clean(k), `SVG de ${k.n}`)}>Copiar SVG</button>
            <button type="button" onClick={() => download(`averyn-${k.k}.svg`, clean(k), "image/svg+xml;charset=utf-8")}>Descargar</button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function EmptyStateExamples() {
  const E: [string, string, string, string][] = [
    ["vacio", "Aún no hay personas", "Registra a la primera persona para empezar.", "Registrar persona"],
    ["vacio", "Sin resultados para «Quispe»", "Revisa la ortografía o quita algún filtro.", "Limpiar búsqueda"],
    ["exito", "Todo al día", "No tienes tareas pendientes.", ""],
  ];
  return (
    <div className="ds-grid ds-grid--3">
      {E.map(([k, t, p, b]) => {
        const kit = KIT.find((x) => x.k === k)!;
        const svg = wrap(kit.svg(LIGHT), "").replace('role="img" aria-label=""', 'aria-hidden="true" focusable="false"');
        return (
          <div key={t} className="es">
            <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: svg }} />
            <b>{t}</b><p>{p}</p>
            {b && <button className="hz-btn hz-btn--ghost" type="button">{b}</button>}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Correos ---------- */
type Mail = { name: string; subject: string; pre: string; html: string; text: string };
const MAILS = emails as unknown as Record<string, Mail>;

export function MailPreview() {
  const { copy, download } = useCopyDownload();
  const keys = Object.keys(MAILS);
  const [cur, setCur] = useState(keys[0]);
  const frame = useRef<HTMLIFrameElement>(null);
  const logo = typeof window === "undefined" ? "" : `${window.location.origin}/assets/images/averyn-logo-font-black.avif`;
  const vars: Record<string, string> = { nombre: "Ana", institucion: "Universidad Horizonte", invitador: "Carlos Mendoza", enlace: "https://app.averyn.example/aceptar/abc123", codigo: "482 913", fecha: "2 oct 2026, 10:42", dispositivo: "Edge en Windows", ubicacion: "Lima, Perú", correo_soporte: "soporte@averyn.example", logo_url: logo };
  const fill = (t: string) => t.replace(/\{\{(\w+)\}\}/g, (m, k) => vars[k] ?? m);
  const m = MAILS[cur];
  return (
    <div className="mail">
      <div className="mail__side">
        <Segmented label="Plantilla de correo" value={cur} onChange={setCur} options={keys.map((k) => ({ value: k, label: MAILS[k].name }))} />
        <dl className="mail__meta"><div><dt>Asunto</dt><dd>{fill(m.subject)}</dd></div><div><dt>Preencabezado</dt><dd>{fill(m.pre)}</dd></div></dl>
        <div className="pt-actions" style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
          <Button onClick={() => copy(m.html, "HTML del correo")}>Copiar HTML</Button>
          <Button variant="ghost" onClick={() => copy(m.text, "Texto del correo")}>Copiar texto</Button>
          <Button variant="ghost" onClick={() => download(`${cur}.html`, m.html, "text/html;charset=utf-8")}>Descargar .html</Button>
        </div>
        <details className="vz-model"><summary>Versión en texto plano</summary><div className="codeblock"><pre>{m.text}</pre></div></details>
      </div>
      <div className="mail__frame">
        <iframe ref={frame} title="Vista previa del correo" tabIndex={-1} srcDoc={fill(m.html)}
          onLoad={(e) => { try { const h = e.currentTarget.contentDocument!.documentElement.scrollHeight; e.currentTarget.style.height = `${Math.max(420, h)}px`; } catch { /* mismo origen: no debería fallar */ } }} />
      </div>
    </div>
  );
}

/* ---------- Impresión ---------- */
function Constancia() {
  return (
    <main className="pr-sheet pr-doc">
      <header className="pr-head">
        <div>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" /><h1 className="pr-title" style={{ marginTop: "5mm" }}>Constancia de verificación de identidad</h1><p className="pr-sub">Universidad Horizonte · Sede Central</p></div>
        <div className="pr-folio">Folio<b>AV-2026-000482</b>Emitida el 2 oct 2026, 10:45</div>
      </header>
      <dl className="pr-meta">
        <div><dt>Persona</dt><dd>Ana Lucía Pérez</dd></div><div><dt>Documento</dt><dd>12345678</dd></div><div><dt>Proceso</dt><dd>Ingreso a campus</dd></div>
        <div><dt>Dispositivo</dt><dd>CAM-001 · Puerta 1</dd></div><div><dt>Fecha y hora</dt><dd>2 oct 2026, 10:42</dd></div><div><dt>Emitida por</dt><dd>Usuario Demo (Administrador)</dd></div>
      </dl>
      <h2 className="pr-h2">Resultado de la verificación</h2>
      <table className="pr-table"><thead><tr><th>Verificación</th><th>Resultado</th><th>Detalle</th></tr></thead>
        <tbody>
          <tr><td>Rostro</td><td className="pr-ok">Aceptada</td><td>Similitud 0.82 · umbral 0.68</td></tr>
          <tr><td>Prueba de vida</td><td className="pr-ok">Superada</td><td>Parpadeo y giro de cabeza</td></tr>
          <tr><td>Documento</td><td className="pr-ok">Coincide</td><td>Con el registro de la institución</td></tr>
        </tbody></table>
      <p className="pr-note"><b>Privacidad.</b> Esta constancia no incluye imágenes, plantillas biométricas ni datos de huella. Solo certifica que la verificación se realizó y su resultado.</p>
      <div className="pr-sign"><div>Firma de quien emite</div><div>Firma de la persona</div><div className="pr-qr">QR de validación</div></div>
      <p className="pr-foot">Documento generado por Averyn. Verifica su autenticidad con el folio en <a href="https://verifica.averyn.example">https://verifica.averyn.example</a>. Datos de ejemplo.</p>
    </main>
  );
}

export function PrintPreview() {
  const toast = useToast();
  const id = useId();
  const f = useFrameBody("");
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const upd = () => setScale(el.clientWidth / 794);
    upd();
    const ro = new ResizeObserver(upd); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="pr-stage">
      <div className="pr-bar no-print">
        <Button aria-describedby={id} onClick={() => { try { f.ref.current?.contentWindow?.focus(); f.ref.current?.contentWindow?.print(); } catch { toast({ title: "No se pudo imprimir", text: "Usa Ctrl+P desde el documento.", kind: "warn" }); } }}>Imprimir / guardar PDF</Button>
        <span className="ds-note" id={id} style={{ margin: 0 }}>Abre el diálogo de impresión con solo el documento. En «Más ajustes» desactiva encabezados y pies del navegador.</span>
      </div>
      <div className="pr-frame" ref={box} style={{ height: Math.round(1123 * scale) }}>
        <iframe ref={f.ref} title="Vista previa de la constancia en tamaño A4" tabIndex={-1} srcDoc='<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Constancia de verificación · Averyn</title><style>body{margin:0;padding:0;background:#E7EBF3}@media print{body{background:#fff}}</style></head><body></body></html>' onLoad={f.onLoad} style={{ transform: `scale(${scale})` }} />
        {f.body && createPortal(<Constancia />, f.body)}
      </div>
    </div>
  );
}
