"use client";

import { useEffect, useRef, useState } from "react";

import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { completeCaptureAction } from "../actions";
import { captureFails } from "../biometric-rules";
import { CAPTURE_TICK_MS, captureFailure, captureMessage, progressAtTick, qualityRows, type CapturePhase } from "../capture-state";
import { METHOD_WITH_ARTICLE } from "../labels";
import type { CaptureContext } from "../types";
import { useCamera } from "../use-camera";
import { FaceView } from "./face-view";
import { FingerprintView } from "./fingerprint-view";

type CaptureStationProps = {
  context: CaptureContext;
  /** Línea con la persona, por ejemplo «Ana Torres · Cédula 10234567 · Estudiante». */
  personLine: string;
  /** Dispositivo que atiende la captura, por ejemplo «CAM-001». */
  deviceLabel: string;
};

/**
 * Estación de captura biométrica: la cámara (rostro) o el lector (huella), el análisis y el cierre.
 *
 * - **Rostro:** usa la cámara real del dispositivo; si no hay permiso, continúa de forma simulada.
 * - **Huella:** no hay lector todavía, así que la lectura es simulada.
 * - El análisis es simulado (1,8 s): calidad, presencia y coincidencia las decidirá el Core. El 15 %
 *   de las capturas falla a propósito para poder ver el estado de error.
 * - El fotograma queda solo en la memoria del navegador; al continuar solo viaja el contexto.
 *
 * @param props - El contexto de la captura, la persona y el dispositivo.
 * @returns La estación de captura.
 */
export function CaptureStation({ context, personLine, deviceLabel }: CaptureStationProps) {
  const isFace = context.method === "face";
  const camera = useCamera(isFace);
  const [phase, setPhase] = useState<CapturePhase>("idle");
  const [progress, setProgress] = useState(0);
  const [still, setStill] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const finish = () => {
    if (captureFails(Math.random())) {
      setPhase("failed");
      return;
    }
    setStill(isFace ? camera.snapshot() : undefined);
    camera.stop();
    setPhase("captured");
  };

  const capture = () => {
    window.clearInterval(timer.current);
    setPhase("capturing");
    setStill(undefined);
    setError(undefined);
    setProgress(0);
    let tick = 0;
    timer.current = window.setInterval(() => {
      tick += 1;
      const value = progressAtTick(tick);
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(timer.current);
        finish();
      }
    }, CAPTURE_TICK_MS);
  };

  const repeat = () => {
    setPhase("idle");
    setProgress(0);
    setStill(undefined);
    setError(undefined);
    if (isFace) void camera.start();
  };

  const complete = async () => {
    setSaving(true);
    setError(undefined);
    // Si todo sale bien el servidor redirige al acta o al resultado y esta llamada no vuelve.
    const result = await completeCaptureAction({ mode: context.mode, person: context.personId, method: context.method });
    setError(result.message);
    setSaving(false);
  };

  const rows = qualityRows({ phase, progress, method: context.method, mode: context.mode });
  const failure = captureFailure(context.method);

  return (
    <section className="av-surface av-surface--pad bio-station" aria-label="Captura biométrica">
      <p className="av-note">
        {personLine} · Método: {isFace ? "Rostro" : "Huella"} · Dispositivo {deviceLabel}
      </p>

      {isFace ? (
        <FaceView phase={phase} live={camera.state === "live"} still={still} message={captureMessage(phase, context.method)} videoRef={camera.videoRef} />
      ) : (
        <FingerprintView phase={phase} progress={progress} />
      )}

      <ul className="pt-meter" aria-label="Calidad de la captura">
        {rows.map((item) => (
          <li key={item.key} data-lv={item.level}>
            <span>{item.label}</span>
            <span className="pt-meter__seg" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <b>
              <Icon name={item.icon} />
              {item.text}
            </b>
          </li>
        ))}
      </ul>

      {isFace && camera.state === "unavailable" ? (
        <Alert tone="warning" title="No pudimos usar la cámara">
          Permite el acceso a la cámara en tu navegador para ver el video. Mientras tanto puedes continuar con una captura simulada.
        </Alert>
      ) : null}
      {phase === "failed" ? (
        <Alert tone="error" title={failure.title}>
          {failure.description}
        </Alert>
      ) : null}
      {error ? <Alert tone="error">{error}</Alert> : null}

      <div className="bio-station__actions">
        {phase === "idle" || phase === "capturing" ? (
          <Button onClick={capture} disabled={phase === "capturing"} loading={phase === "capturing"}>
            {phase === "capturing" ? "Analizando…" : <><Icon name={isFace ? "camera" : "fingerprint"} /> Capturar {isFace ? "rostro" : "huella"}</>}
          </Button>
        ) : null}
        {phase === "failed" ? (
          <Button onClick={capture}>
            <Icon name="arrow-repeat" /> Reintentar
          </Button>
        ) : null}
        {phase === "captured" ? (
          <>
            <Button variant="ghost" onClick={repeat} disabled={saving}>
              <Icon name="arrow-repeat" /> Repetir captura
            </Button>
            <Button onClick={() => void complete()} loading={saving}>
              {saving ? "Guardando…" : <>Continuar <Icon name="arrow-right" /></>}
            </Button>
          </>
        ) : null}
      </div>
      <p className="sr-only" role="status">
        {phase === "captured" ? `Captura de ${METHOD_WITH_ARTICLE[context.method]} validada.` : ""}
      </p>
    </section>
  );
}
