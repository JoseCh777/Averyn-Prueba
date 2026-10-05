"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Icon, type IconName } from "./icon";
import { Tag } from "./feedback";
import { normalize } from "./combobox";

export type Command = { group: string; icon: IconName; label: string; /** Sin pantalla todavía: se muestra «Próximamente» y no se ejecuta. */ soon?: boolean; run?: () => void };

/**
 * Paleta de comandos (Ctrl/⌘ + K). Siempre hay también un botón visible para quien no usa atajos.
 * ↑↓ navegan (saltando los «Próximamente»), Enter ejecuta, Esc cierra.
 */
export function CommandPalette({ commands, openLabel = "Abrir paleta de comandos" }: { commands: Command[]; openLabel?: string }) {
  const id = useId();
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [act, setAct] = useState(0);

  const shown = commands.filter((c) => !q.trim() || normalize(c.label).includes(normalize(q.trim())));
  const firstEnabled = shown.findIndex((c) => !c.soon);

  const open = () => { setQ(""); dlg.current?.showModal(); input.current?.focus(); };
  useEffect(() => { setAct(firstEnabled); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dlg.current?.open) dlg.current.close(); else open();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);

  const move = (d: number) => {
    if (!shown.length) return;
    let i = act;
    do { i = (i + d + shown.length) % shown.length; } while (shown[i].soon && i !== act);
    setAct(i);
  };
  const run = (i: number) => {
    const c = shown[i];
    if (!c || c.soon) return;
    dlg.current?.close();
    c.run?.();
  };

  let last = "";
  return (
    <>
      <button className="hz-btn hz-btn--ghost" type="button" onClick={open}>{openLabel} <kbd className="cp-k">Ctrl K</kbd></button>
      <dialog ref={dlg} className="cmd" aria-label="Paleta de comandos" onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}>
        <div className="cmd__top">
          <Icon name="search" />
          <input
            ref={input}
            className="cmd__in"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-label="Buscar comandos"
            aria-activedescendant={act >= 0 ? `${id}-o${act}` : undefined}
            placeholder="Escribe un comando o una pantalla…"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
              else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
              else if (e.key === "Enter") { e.preventDefault(); run(act); }
            }}
          />
        </div>
        <ul className="cmd__list" id={`${id}-list`} role="listbox" aria-label="Resultados" onPointerMove={(e) => {
          const o = (e.target as HTMLElement).closest<HTMLElement>(".cmd__opt");
          if (o && !o.getAttribute("aria-disabled")) setAct(Number(o.dataset.i));
        }}>
          {shown.length ? shown.map((c, i) => {
            const head = c.group !== last ? <li key={`g-${c.group}`} className="cmd__grp" role="presentation">{c.group}</li> : null;
            last = c.group;
            return [
              head,
              <li key={c.label} id={`${id}-o${i}`} data-i={i} className="cmd__opt" role="option" aria-selected={i === act} aria-disabled={c.soon || undefined} onClick={() => run(i)}>
                <Icon name={c.icon} /><span>{c.label}</span>{c.soon && <Tag>Próximamente</Tag>}
              </li>,
            ];
          }) : <li className="cmd__none" role="presentation">Nada coincide con «{q.trim()}».</li>}
        </ul>
        <div className="cmd__foot"><span><kbd className="cp-k">↑</kbd> <kbd className="cp-k">↓</kbd> navegar</span><span><kbd className="cp-k">↵</kbd> abrir</span><span><kbd className="cp-k">Esc</kbd> cerrar</span></div>
        <div className="sr-only" aria-live="polite">{shown.length ? `${shown.length} resultados.` : "Sin resultados."}</div>
      </dialog>
    </>
  );
}
