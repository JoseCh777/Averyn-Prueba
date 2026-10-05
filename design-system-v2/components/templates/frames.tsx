"use client";
/* Marcos de revisión de las plantillas: cada pantalla se renderiza (React) dentro de un iframe a 1440 px, con los mismos estilos de la
   página, y se muestra escalada. «Ver a pantalla completa» la abre a tamaño real en un diálogo. */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/icon";
import { Segmented } from "@/components/ui/segmented";
import { TEMPLATES } from "./screens";

const BLANK = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=1440"></head><body class="tp"></body></html>';

/** Prepara un iframe: copia los estilos y las variables de fuente de la página y devuelve el <body> donde pintar. */
export function useFrameBody(bodyClass = "tp") {
  const ref = useRef<HTMLIFrameElement>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);
  const prepare = () => {
    const f = ref.current, d = f?.contentDocument;
    if (!f || !d?.body) return;
    d.documentElement.className = document.documentElement.className;
    d.head.querySelectorAll("[data-copied]").forEach((n) => n.remove());
    document.head.querySelectorAll('link[rel="stylesheet"], style').forEach((n) => { const c = n.cloneNode(true) as HTMLElement; c.setAttribute("data-copied", "1"); d.head.appendChild(c); });
    d.body.className = bodyClass;
    setBody(d.body);
  };
  useEffect(() => { if (ref.current?.contentDocument?.readyState === "complete") prepare(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return { ref, body, onLoad: prepare };
}

export type FrameState = [value: string, label: string];

export function TemplateFrame({ template, title, states = [] }: { template: string; title: string; states?: FrameState[] }) {
  const [state, setState] = useState(states[0]?.[0] ?? "normal");
  const [open, setOpen] = useState(false);
  const main = useFrameBody();
  const full = useFrameBody();
  const box = useRef<HTMLDivElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const [scale, setScale] = useState(0.5);
  const Tpl = TEMPLATES[template];

  useEffect(() => {
    const el = box.current; if (!el) return;
    const upd = () => setScale(el.clientWidth / 1440);
    upd();
    const ro = new ResizeObserver(upd); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const d = dlg.current; if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <div className="tpf">
      <div className="tpf__ctrl">
        <span className="stage__label mono" style={{ margin: 0 }}>Ejemplo de uso · {title}</span>
        {states.length > 0 && <Segmented label={`Estado de la plantilla ${title}`} value={state} onChange={setState} options={states.map(([value, label]) => ({ value, label }))} />}
      </div>
      <div className="tpf__frame">
        <div className="dsframe" ref={box}>
          <iframe ref={main.ref} title={`Vista previa de la plantilla ${title}`} tabIndex={-1} aria-hidden="true" srcDoc={BLANK} onLoad={main.onLoad} style={{ transform: `scale(${scale})` }} />
          {main.body && createPortal(<Tpl state={state} />, main.body)}
        </div>
        <button className="tpf__open" type="button" onClick={() => setOpen(true)}><Icon name="arrows-fullscreen" />Ver a pantalla completa</button>
      </div>
      <dialog ref={dlg} className="tpfull" aria-labelledby={`tpfull-${template}`} onClose={() => setOpen(false)} onClick={(e) => { if (e.target === dlg.current) setOpen(false); }}>
        <div className="tpfull__h"><span id={`tpfull-${template}`}>{title} · ejemplo ilustrativo, no es el producto final</span><button type="button" aria-label="Cerrar vista a pantalla completa" onClick={() => setOpen(false)}><Icon name="x-lg" /></button></div>
        <iframe ref={full.ref} title="Plantilla a pantalla completa" srcDoc={BLANK} onLoad={full.onLoad} />
        {open && full.body && createPortal(<Tpl state={state} />, full.body)}
      </dialog>
    </div>
  );
}

/** Página real (ruta de la propia app) escalada a 1440×900; sirve para mostrar las páginas de error. */
export function PageFrame({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const upd = () => setScale(el.clientWidth / 1440);
    upd();
    const ro = new ResizeObserver(upd); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="dsframe" ref={box} style={{ height: Math.round(900 * scale) }}>
      <iframe src={src} title={title} loading="lazy" tabIndex={-1} aria-hidden="true" style={{ transform: `scale(${scale})` }} />
    </div>
  );
}
