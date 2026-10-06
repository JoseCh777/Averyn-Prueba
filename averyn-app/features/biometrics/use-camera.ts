"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Estado de la cámara: `unavailable` es sin permiso, sin cámara o sin soporte del navegador. */
export type CameraState = "off" | "requesting" | "live" | "unavailable";

/**
 * Cámara del dispositivo para la captura del rostro (`getUserMedia`).
 *
 * El video solo se muestra en la pantalla: no se graba ni se envía. Al desmontar la pantalla o al
 * pedirlo, se apagan las pistas (se apaga la luz de la cámara). Si no hay permiso o no hay cámara,
 * el estado pasa a `unavailable` y la captura continúa de forma simulada.
 *
 * @param enabled - Si la modalidad usa cámara (la huella no).
 * @returns La referencia del `<video>`, el estado y las funciones para iniciar, apagar y sacar un fotograma.
 */
export function useCamera(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>(enabled ? "requesting" : "off");

  const release = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const start = useCallback(async () => {
    if (streamRef.current !== null) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      setState("unavailable");
      return;
    }
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setState("live");
    } catch {
      setState("unavailable");
    }
  }, []);

  const stop = useCallback(() => {
    release();
    setState((current) => (current === "live" || current === "requesting" ? "off" : current));
  }, [release]);

  /** Copia el fotograma actual a una imagen en memoria; `undefined` si no hay cámara en vivo. */
  const snapshot = useCallback((): string | undefined => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return undefined;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  }, []);

  useEffect(() => {
    if (enabled) void start();
    return release;
  }, [enabled, start, release]);

  return { videoRef, state, start, stop, snapshot };
}
