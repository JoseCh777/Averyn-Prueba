"use client";

import { useEffect, useRef, useState } from "react";

import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CAPTURE_TICK_MS, captureMessage, progressAtTick, type CapturePhase } from "@/features/biometrics/capture-state";
import { FaceView } from "@/features/biometrics/components/face-view";
import { FingerprintView } from "@/features/biometrics/components/fingerprint-view";
import { useCamera } from "@/features/biometrics/use-camera";

import type { AccessMethod } from "../types";

type BiometricStepProps = {
  method: Extract<AccessMethod, "FACE" | "FINGERPRINT">;
  /** Hay una consulta en curso: se bloquea para evitar un doble envío. */
  busy: boolean;
  /** Se llama una sola vez, al terminar la captura. El resultado lo decide el servicio. */
  onCaptured: () => void;
};

/**
 * Paso de captura biométrica del operador: la cámara (rostro) o el lector (huella) y el avance.
 *
 * Reutiliza el visor y la cámara del módulo de Biometría. La captura es simulada: al terminar solo
 * avisa, no devuelve imagen alguna (nada del rostro sale de la memoria del navegador). El
 * desenlace —coincide, no coincide, vivacidad— lo decide el servicio, nunca esta pantalla.
 *
 * @param props - La modalidad, si hay una consulta en curso y qué hacer al terminar.
 * @returns El paso de captura.
 */
export function BiometricStep({ method, busy, onCaptured }: BiometricStepProps) {
  const isFace = method === "FACE";
  const camera = useCamera(isFace);
  const [phase, setPhase] = useState<CapturePhase>("idle");
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const finished = useRef(onCaptured);

  useEffect(() => {
    finished.current = onCaptured;
  }, [onCaptured]);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const capture = () => {
    window.clearInterval(timer.current);
    setPhase("capturing");
    setProgress(0);
    let tick = 0;
    timer.current = window.setInterval(() => {
      tick += 1;
      const value = progressAtTick(tick);
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(timer.current);
        camera.stop();
        setPhase("captured");
        finished.current();
      }
    }, CAPTURE_TICK_MS);
  };

  const noun = isFace ? "rostro" : "huella";
  const working = phase === "capturing" || phase === "captured" || busy;

  return (
    <div className="acc-capture">
      {isFace ? (
        <FaceView phase={phase} live={camera.state === "live"} still={undefined} message={captureMessage(phase, "face")} videoRef={camera.videoRef} />
      ) : (
        <FingerprintView phase={phase} progress={progress} />
      )}
      {isFace && camera.state === "unavailable" ? (
        <Alert tone="warning" title="No pudimos usar la cámara">
          Permita el acceso a la cámara en el navegador. Mientras tanto puede continuar con una captura simulada.
        </Alert>
      ) : null}
      <Button onClick={capture} disabled={working} loading={working} block>
        {working ? (
          "Verificando…"
        ) : (
          <>
            <Icon name={isFace ? "camera" : "fingerprint"} /> Capturar {noun}
          </>
        )}
      </Button>
    </div>
  );
}
