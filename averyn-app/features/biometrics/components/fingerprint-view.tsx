import type { CapturePhase } from "../capture-state";
import { FINGERPRINT_RINGS, litRings } from "../fingerprint-rings";

/** Estado visual de la huella (los estilos del patrón conocen estos nombres). */
const VIEWER_STATE: Record<CapturePhase, "wait" | "read" | "ok" | "err"> = { idle: "wait", capturing: "read", captured: "ok", failed: "err" };

const COPY: Record<CapturePhase, { title: string; sub: string }> = {
  idle: { title: "Apoya el dedo en el lector.", sub: "Mantenlo quieto hasta que termine la lectura." },
  capturing: { title: "Leyendo… no muevas el dedo.", sub: "Casi listo." },
  captured: { title: "Huella validada.", sub: "La lectura salió con buena calidad." },
  failed: { title: "No pudimos leer la huella.", sub: "Límpiala y reintenta." },
};

/**
 * Visor de la captura de la huella: arcos que se iluminan de dentro hacia fuera, el avance en
 * texto y una barra.
 *
 * Es presentación pura; `CaptureStation` decide el estado. La lectura es simulada: no hay lector.
 *
 * @param props - La fase y el avance de 0 a 100.
 * @returns El visor.
 */
export function FingerprintView({ phase, progress }: { phase: CapturePhase; progress: number }) {
  const lit = litRings(phase === "captured" ? 100 : phase === "failed" ? 0 : progress);
  const percent = Math.round(phase === "captured" ? 100 : phase === "failed" ? 0 : progress);
  const copy = COPY[phase];
  return (
    <div className="pt-fp bio-fp" data-state={VIEWER_STATE[phase]}>
      <div className="pt-fp__pad">
        <svg viewBox="0 0 200 230" aria-hidden="true" focusable="false">
          {FINGERPRINT_RINGS.map((path, index) => (
            <path key={path} d={path} className={index < lit ? "pt-fp__ring on" : "pt-fp__ring"} />
          ))}
        </svg>
      </div>
      <div className="pt-fp__txt">
        <h3 role="status">{copy.title}</h3>
        <p>{copy.sub}</p>
        <div className="pt-prog">
          <div className="pt-prog__bar" role="progressbar" aria-label="Progreso de la lectura" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <i style={{ ["--p" as string]: percent / 100 }} />
          </div>
          <div className="pt-prog__lab">
            <span>{percent}%</span>
            <span>Lector simulado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
