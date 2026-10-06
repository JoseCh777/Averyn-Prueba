import type { Ref } from "react";

import { Icon, type IconName } from "@/components/ui/icon";

import type { CapturePhase } from "../capture-state";

/** Estado visual del visor (los estilos del patrón conocen estos nombres). */
type ViewerState = "searching" | "ready" | "capturing" | "success" | "error";

const VIEWER_STATE: Record<CapturePhase, ViewerState> = { idle: "searching", capturing: "capturing", captured: "success", failed: "error" };

type FaceViewProps = {
  phase: CapturePhase;
  /** Hay una cámara transmitiendo en este momento. */
  live: boolean;
  /** Fotograma capturado (solo vive en la memoria del navegador; nunca se envía). */
  still: string | undefined;
  message: string;
  videoRef: Ref<HTMLVideoElement>;
};

/**
 * Visor de la captura del rostro: la cámara (o un fondo si no hay), el óvalo guía y el mensaje.
 *
 * Es presentación pura; `CaptureStation` decide el estado. Con cámara se ve el video en espejo; al
 * capturar, el fotograma. El óvalo cambia de color con la fase y siempre hay un mensaje escrito.
 *
 * @param props - La fase, si hay cámara en vivo, el fotograma y el mensaje.
 * @returns El visor.
 */
export function FaceView({ phase, live, still, message, videoRef }: FaceViewProps) {
  const state: ViewerState = phase === "idle" && live ? "ready" : VIEWER_STATE[phase];
  const icon: IconName = phase === "captured" ? "check-circle" : phase === "failed" ? "exclamation-triangle" : phase === "capturing" ? "camera" : "search";
  return (
    <div className="pt-view bio-view" data-state={state}>
      <video ref={videoRef} className="bio-view__video" autoPlay playsInline muted aria-label="Vista previa de la cámara" hidden={!live || still !== undefined} />
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="bio-view__still" src={still} alt="Fotograma capturado" />
      ) : null}
      <span className="pt-view__tag">{live ? "En vivo" : "Vista de cámara · simulada"}</span>
      <svg viewBox="0 0 400 460" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="200" cy="200" rx="84" ry="108" fill="none" stroke="rgba(185,201,228,.28)" strokeWidth="2" />
        <path d="M50 460 C50 372 120 330 200 330 C280 330 350 372 350 460" fill="none" stroke="rgba(185,201,228,.28)" strokeWidth="2" />
        <ellipse className="pt-oval" cx="200" cy="205" rx="112" ry="148" />
        <ellipse className="pt-oval-prog" cx="200" cy="205" rx="112" ry="148" pathLength={1} transform="rotate(-90 200 205)" />
      </svg>
      {message ? (
        <div className="pt-view__msg" role="status">
          <Icon name={icon} />
          <span>{message}</span>
        </div>
      ) : null}
    </div>
  );
}
