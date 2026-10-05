"use client";
import { useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/overlay";

/** Umbral de ejemplo (0.68): lo define el servidor; la maqueta lo muestra, no lo calcula. */
export const THRESHOLD = 68;

/** Escala 0–1 con la marca del umbral: la similitud y el umbral se leen a la vez. */
export function ScoreScale({ score, label }: { score: number; label?: string }) {
  const s = score / 100;
  return (
    <div>
      <div className="pt-scale" role="img" aria-label={label ?? `Similitud ${s.toFixed(2)} sobre 1. Umbral 0.68.`}>
        <div className="pt-scale__fill" style={{ width: `max(0px, calc(${score}% - 6px))` }} />
        <div className="pt-scale__thr"><em>Umbral 0.68</em></div>
      </div>
      <div className="pt-scale__ends"><span>0</span><span>Similitud</span><span>1</span></div>
    </div>
  );
}

/** Resultado de verificación facial: decisión (icono + palabra), puntaje, distancia al umbral y motivos. */
export function VerificationResult() {
  const toast = useToast();
  const id = useId();
  const [n, setN] = useState(82);
  const s = n / 100;
  const ok = n >= THRESHOLD;
  const diff = Math.abs(s - 0.68).toFixed(2);
  const reasons = [
    { label: "Similitud facial", ok, text: `${s.toFixed(2)} ${ok ? "≥" : "<"} 0.68` },
    { label: "Prueba de vida", ok: true, text: "Superada" },
    { label: "Calidad de la captura", ok: true, text: "Buena" },
  ];
  const main = ok ? "Continuar →" : "Intentar de nuevo";
  return (
    <div className="pt-vr">
        <div className="pt-vr__head">
          <div><h3 className="pt-card__t">Verificación facial</h3><p className="pt-card__s" style={{ margin: 0 }}>Persona de ejemplo · hoy, 10:42</p></div>
          <span className={`pt-dec ${ok ? "pt-dec--ok" : "pt-dec--bad"}`} role="status"><Icon name={ok ? "check-circle-fill" : "x-circle-fill"} />{ok ? "Aceptada" : "Rechazada"}</span>
        </div>
        <div className="pt-score"><b>{s.toFixed(2)}</b><span>{n === THRESHOLD ? "Justo en el umbral de 0.68." : `${diff} ${ok ? "por encima" : "por debajo"} del umbral de 0.68.`}</span></div>
        <ScoreScale score={n} label={`Similitud ${s.toFixed(2)} sobre 1. Umbral 0.68. ${ok ? "Por encima." : "Por debajo."}`} />
        <ul className="pt-reasons">
          {reasons.map((r) => (
            <li key={r.label}><span>{r.label}</span><b className={r.ok ? "ok" : "bad"}><Icon name={r.ok ? "check-circle" : "x-circle"} />{r.text}</b></li>
          ))}
        </ul>
        <div className="pt-actions">
          <button className="av-btn av-btn--primary" type="button" onClick={() => toast({ title: main, text: "Aquí continuaría o reiniciaría la captura.", kind: "ok" })}>{main}</button>
          <button className="av-btn av-btn--ghost" type="button" onClick={() => toast({ title: "Ver detalle", text: "Aquí se abriría el detalle de la verificación.", kind: "ok" })}>Ver detalle</button>
        </div>
        <div className="pt-range">
          <label className="av-label" htmlFor={`${id}-r`}>Puntaje de ejemplo: <b>{s.toFixed(2)}</b></label>
          <input type="range" id={`${id}-r`} min={0} max={100} value={n} step={1} aria-describedby={`${id}-h`} onChange={(e) => setN(Number(e.target.value))} />
          <span className="av-help" id={`${id}-h`}>Mueve el control para simular otro resultado. En producción el puntaje viene del servidor.</span>
        </div>
    </div>
  );
}
