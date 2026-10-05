"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Chip } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/overlay";
import { THRESHOLD, ScoreScale } from "./verification-result";

type Case = { id: string; who: string; s: number; dev: string; at: string; q: string; tries: number };
const CASES: Case[] = [
  { id: "REV-0412", who: "Ana Lucía Pérez", s: 66, dev: "CAM-001", at: "02/10/2026, 10:42", q: "Buena", tries: 1 },
  { id: "REV-0411", who: "Carlos Mendoza", s: 64, dev: "LEC-001", at: "02/10/2026, 10:15", q: "Buena", tries: 2 },
  { id: "REV-0409", who: "Valeria Quispe", s: 71, dev: "CAM-002", at: "02/10/2026, 09:31", q: "Mejorable", tries: 1 },
  { id: "REV-0406", who: "Jorge Salazar", s: 62, dev: "CAM-001", at: "01/10/2026, 17:48", q: "Buena", tries: 3 },
];
const REASONS = ["Calidad de captura insuficiente", "Coincide con el documento presentado", "Diferencia visible con el registro", "Otro (explicar en la nota)"];
const dist = (s: number) => `${(Math.abs(s - THRESHOLD) / 100).toFixed(2)} ${s >= THRESHOLD ? "por encima" : "por debajo"} del umbral`;

/** Propuesta de diseño (pendiente de validar con el equipo): una persona autorizada decide cerca del umbral; el motivo es obligatorio y queda en la bitácora. */
export function ManualReview() {
  const toast = useToast();
  const id = useId();
  const [cases, setCases] = useState(CASES);
  const [cur, setCur] = useState(0);
  const [decision, setDecision] = useState<"ok" | "no" | "">("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const detail = useRef<HTMLDivElement>(null);
  const focusDetail = useRef(false);
  useEffect(() => { if (focusDetail.current) { focusDetail.current = false; detail.current?.focus(); } });

  const c = cases[cur];
  const select = (i: number) => { setCur(i); setDecision(""); setReason(""); setNote(""); focusDetail.current = true; };
  const submit = () => {
    const verdict = decision === "ok" ? "aprobada" : "rechazada";
    const left = cases.length - 1;
    toast({ title: "Decisión registrada", text: `${c.id} ${verdict}. ${left ? `Quedan ${left} ${left === 1 ? "caso" : "casos"}.` : "No quedan casos pendientes."}`, kind: "ok" });
    setCases((cs) => cs.filter((_, k) => k !== cur));
    setCur((x) => Math.max(0, Math.min(x, left - 1)));
    setDecision(""); setReason(""); setNote("");
    focusDetail.current = left > 0;
  };

  return (
    <div className="pt-card" id="rv">
      <div className="rv__layout">
        <div className="rv__queue">
          <h3 className="rv__h">Cola de revisión <Chip tone="warning" icon="clock">{cases.length} {cases.length === 1 ? "pendiente" : "pendientes"}</Chip></h3>
          <ul className="rv__list" aria-label="Casos pendientes">
            {cases.map((k, i) => (
              <li key={k.id}>
                <button className="rv__case" type="button" aria-current={i === cur ? "true" : undefined} onClick={() => select(i)}>
                  <b>{k.id} · {k.who}</b><small>{k.at}</small><span>{(k.s / 100).toFixed(2)} · {dist(k.s)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rv__detail" tabIndex={-1} ref={detail}>
          {!c ? (
            <div className="rv__done"><Icon name="check2-circle" /><b>No hay casos pendientes.</b><span>Buen trabajo.</span></div>
          ) : (
            <>
              <h3 className="rv__t">{c.id} · {c.who}</h3>
              <p className="rv__sub">Verificación facial · {c.at}</p>
              <div className="pt-score"><b>{(c.s / 100).toFixed(2)}</b><span>{dist(c.s)} de 0.68.</span></div>
              <ScoreScale score={c.s} />
              <dl className="rv__meta">
                <div><dt>Dispositivo</dt><dd>{c.dev}</dd></div><div><dt>Calidad</dt><dd>{c.q}</dd></div>
                <div><dt>Prueba de vida</dt><dd>Superada</dd></div><div><dt>Intentos previos</dt><dd>{c.tries}</dd></div>
              </dl>
              <fieldset className="rv__dec">
                <legend>Decisión</legend>
                <label className="rv__opt"><input type="radio" name="rv-d" checked={decision === "ok"} onChange={() => setDecision("ok")} /><span>Aprobar<small>La identidad se confirma.</small></span></label>
                <label className="rv__opt"><input type="radio" name="rv-d" checked={decision === "no"} onChange={() => setDecision("no")} /><span>Rechazar<small>La identidad no se confirma.</small></span></label>
              </fieldset>
              <div className="hz-field">
                <label className="hz-label" htmlFor={`${id}-m`}>Motivo (obligatorio)</label>
                <select className="hz-select" id={`${id}-m`} aria-describedby={`${id}-mh`} value={reason} onChange={(e) => setReason(e.target.value)}>
                  <option value="">Elige un motivo…</option>{REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
                <span className="hz-help" id={`${id}-mh`}>Queda en la bitácora junto con tu nombre y la hora.</span>
              </div>
              <div className="hz-field"><label className="hz-label" htmlFor={`${id}-n`}>Nota (opcional)</label><textarea className="hz-textarea" id={`${id}-n`} rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></div>
              <div className="pt-actions"><button className="hz-btn hz-btn--primary" type="button" disabled={!decision || !reason} onClick={submit}>Registrar decisión</button></div>
              <p className="rv__audit"><Icon name="journal-check" /> Esta decisión se registra con tu nombre, la fecha y el motivo.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
