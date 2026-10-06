"use client";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { Segmented } from "@/components/ui/segmented";
import { useToast } from "@/components/ui/overlay";

/** Estados de la captura facial (coding-standard §23, simplificados para la maqueta). Sin cámara real. */
export type FaceState = "searching" | "ready" | "capturing" | "success" | "error" | "noperm";

const LEVELS: [string, IconName][] = [["Sin medir", "dash-circle"], ["Insuficiente", "x-circle"], ["Mejorar", "exclamation-circle"], ["Buena", "check-circle"]];
const STATES: Record<FaceState, { icon: IconName; msg: string; q: [number, number, number]; btn: [string, boolean]; st: ("now" | "pending" | "done")[] }> = {
  searching: { icon: "search", msg: "Centra tu rostro en el óvalo.", q: [0, 0, 0], btn: ["Esperando rostro…", true], st: ["now", "pending", "pending"] },
  ready: { icon: "check-circle", msg: "Perfecto, no te muevas.", q: [3, 3, 3], btn: ["Capturar", false], st: ["now", "pending", "pending"] },
  capturing: { icon: "camera", msg: "Capturando…", q: [3, 3, 3], btn: ["Capturando…", true], st: ["done", "now", "pending"] },
  success: { icon: "check-circle-fill", msg: "Rostro registrado.", q: [3, 3, 3], btn: ["Continuar →", false], st: ["done", "done", "done"] },
  error: { icon: "exclamation-triangle", msg: "No logramos verla bien. Busca más luz y reintenta.", q: [1, 2, 1], btn: ["Reintentar", false], st: ["now", "pending", "pending"] },
  noperm: { icon: "camera-video-off", msg: "", q: [0, 0, 0], btn: ["Permitir cámara", false], st: ["pending", "pending", "pending"] },
};
const CRITERIA = ["Iluminación", "Encuadre", "Nitidez"];
const LIVENESS = ["Mira al frente", "Parpadea una vez", "Gira la cabeza a la izquierda"];

export function FaceCapture({ onContinue }: { onContinue?: () => void }) {
  const toast = useToast();
  const [state, setState] = useState<FaceState>("searching");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);
  const set = (s: FaceState) => { clear(); setState(s); };
  const d = STATES[state];

  const click = () => {
    clear();
    if (state === "ready") { setState("capturing"); timers.current.push(setTimeout(() => setState("success"), 1700)); }
    else if (state === "success") (onContinue ?? (() => toast({ title: "Continuar", text: "Aquí avanzaría al siguiente paso del registro.", kind: "ok" })))();
    else setState("searching");
  };
  const play = () => {
    set("searching");
    timers.current.push(setTimeout(() => setState("ready"), 1500), setTimeout(() => setState("capturing"), 3000), setTimeout(() => setState("success"), 4800));
  };

  return (
    <div className="pt-card">
      <div className="pt-ctrl">
        <span className="stage__label mono">Estado</span>
        <Segmented<FaceState> label="Estado de la captura facial" value={state} onChange={set}
          options={([["searching", "Buscando"], ["ready", "Listo"], ["capturing", "Capturando"], ["success", "Éxito"], ["error", "Error"], ["noperm", "Sin cámara"]] as [string, string][]).map(([v, l]) => ({ value: v as FaceState, label: l }))} />
      </div>
      <div className="pt-view" data-state={state}>
        <span className="pt-view__tag">Vista de cámara · simulada</span>
        <svg viewBox="0 0 400 460" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="200" cy="200" rx="84" ry="108" fill="none" stroke="rgba(185,201,228,.28)" strokeWidth="2" />
          <path d="M50 460 C50 372 120 330 200 330 C280 330 350 372 350 460" fill="none" stroke="rgba(185,201,228,.28)" strokeWidth="2" />
          <ellipse className="pt-oval" cx="200" cy="205" rx="112" ry="148" />
          <ellipse className="pt-oval-prog" cx="200" cy="205" rx="112" ry="148" pathLength={1} transform="rotate(-90 200 205)" />
        </svg>
        <div className="pt-view__msg" role="status" hidden={!d.msg}><Icon name={d.icon} /><span>{d.msg}</span></div>
        <div className="pt-view__off"><Icon name="camera-video-off" /><b>No pudimos usar la cámara.</b><p>Permite el acceso a la cámara en tu navegador y vuelve a intentarlo.</p></div>
      </div>
      <ul className="pt-meter" aria-label="Calidad de la captura">
        {CRITERIA.map((c, i) => {
          const l = d.q[i];
          return (
            <li key={c} data-lv={l}>
              <span>{c}</span><span className="pt-meter__seg" aria-hidden="true"><i /><i /><i /></span>
              <b><Icon name={LEVELS[l!]![1]} />{LEVELS[l!]![0]}</b>
            </li>
          );
        })}
      </ul>
      <ol className="pt-steps" aria-label="Prueba de vida">
        {LIVENESS.map((t, i) => <li key={t} data-s={d.st[i]}><span>{d.st[i] === "done" ? "✓" : i + 1}</span>{t}</li>)}
      </ol>
      <div className="pt-actions">
        <button className="av-btn av-btn--primary" type="button" disabled={d.btn[1]} onClick={click}>{d.btn[0]}</button>
        <button className="av-btn av-btn--ghost" type="button" onClick={play}>Reproducir flujo</button>
      </div>
    </div>
  );
}
