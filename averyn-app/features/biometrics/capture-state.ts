import type { IconName } from "@/components/ui/icon";

import type { BiometricMethod, CaptureMode } from "./types";

/**
 * Estado de una captura biométrica y lo que muestra la pantalla en cada fase. Todo es simulado:
 * el análisis real (calidad, presencia, coincidencia) lo hará el servicio de biometría del Core.
 */

/** Fase de la captura. */
export type CapturePhase = "idle" | "capturing" | "captured" | "failed";

/** Cuánto dura el análisis simulado, y cada cuánto se actualiza el avance. */
export const CAPTURE_DURATION_MS = 1800;
export const CAPTURE_TICK_MS = 60;

/** Nivel de un criterio de calidad: 0 sin medir, 1 insuficiente, 2 en curso o mejorable, 3 bueno. */
export type QualityLevel = 0 | 1 | 2 | 3;

/** Una fila del medidor de calidad. */
export interface QualityRow {
  key: string;
  label: string;
  level: QualityLevel;
  text: string;
  icon: IconName;
}

/** Avance (0 a 100) a partir del cual cada criterio queda bien durante el análisis. */
const FRAMING_OK_AT = 35;
const SHARPNESS_OK_AT = 65;
const PRESENCE_OK_AT = 85;
const LIGHTING_OK_AT = 15;

const LEVEL_ICON: Record<QualityLevel, IconName> = { 0: "dash-circle", 1: "x-circle", 2: "exclamation-circle", 3: "check-circle" };

function row(key: string, label: string, level: QualityLevel, text: string): QualityRow {
  return { key, label, level, text, icon: LEVEL_ICON[level] };
}

/** Cuántos ciclos dura el análisis. */
export const CAPTURE_TOTAL_TICKS = CAPTURE_DURATION_MS / CAPTURE_TICK_MS;

/**
 * Avance del análisis tras un número de ciclos (se calcula desde el ciclo, no se acumula, para que
 * los decimales no se desvíen).
 *
 * @param tick - Ciclos transcurridos, desde 0.
 * @returns El avance de 0 a 100, sin pasar de 100.
 */
export function progressAtTick(tick: number): number {
  return Math.min(100, (tick / CAPTURE_TOTAL_TICKS) * 100);
}

/**
 * Criterios de calidad que se muestran en cada fase.
 *
 * El rostro se mide por iluminación, encuadre y nitidez (y, al verificar, la prueba de vida); la
 * huella, por lectura y calidad. Cada criterio pasa a «bueno» según avanza el análisis.
 *
 * @param params - Fase, avance (0 a 100), modalidad y modo de la captura.
 * @returns Las filas del medidor, en el orden en que se muestran.
 */
export function qualityRows(params: { phase: CapturePhase; progress: number; method: BiometricMethod; mode: CaptureMode }): QualityRow[] {
  const { phase, progress, method, mode } = params;
  const done = phase === "captured";
  const analyzing = phase === "capturing";
  const failed = phase === "failed";
  const at = (threshold: number) => done || (analyzing && progress >= threshold);

  const level = (ok: boolean, whenFailed: QualityLevel = 3): QualityLevel => {
    if (ok) return 3;
    if (analyzing) return 2;
    if (failed) return whenFailed;
    return 0;
  };
  const text = (value: QualityLevel, good: string, working = "Analizando") =>
    ({ 0: "Sin medir", 1: "Insuficiente", 2: working, 3: good })[value];

  if (method === "fingerprint") {
    const reading = level(at(FRAMING_OK_AT), 1);
    const quality = level(at(SHARPNESS_OK_AT), 1);
    return [row("reading", "Lectura", reading, text(reading, "Completa", "Leyendo")), row("quality", "Calidad", quality, text(quality, "Suficiente"))];
  }

  const lighting = level(at(LIGHTING_OK_AT), 1);
  const framing = level(at(FRAMING_OK_AT), 3);
  const sharpness = level(at(SHARPNESS_OK_AT), 3);
  const rows = [
    row("lighting", "Iluminación", lighting, text(lighting, "Buena")),
    row("framing", "Encuadre", framing, text(framing, "Correcto", "Ajustando")),
    row("sharpness", "Nitidez", sharpness, text(sharpness, "Suficiente")),
  ];
  if (mode === "verification") {
    const presence = level(at(PRESENCE_OK_AT), 0);
    rows.push(row("presence", "Prueba de vida", presence, text(presence, "Superada", "Verificando")));
  }
  return rows;
}

/**
 * Mensaje que se anuncia en cada fase de la captura.
 *
 * @param phase - Fase actual.
 * @param method - Modalidad.
 * @returns El texto para la persona (vacío en el error: lo explica la alerta).
 */
export function captureMessage(phase: CapturePhase, method: BiometricMethod): string {
  const fingerprint = method === "fingerprint";
  switch (phase) {
    case "idle":
      return fingerprint ? "Presiona «Capturar huella» para comenzar." : "Presiona «Capturar rostro» para comenzar.";
    case "capturing":
      return fingerprint ? "Capturando huella… mantén el dedo apoyado." : "Analizando rostro… mantén la posición.";
    case "captured":
      return fingerprint ? "Huella validada. Puedes continuar." : "Captura validada. Puedes continuar.";
    case "failed":
      return "";
  }
}

/**
 * Aviso cuando la captura no sirvió (microcopy aprobado).
 *
 * @param method - Modalidad.
 * @returns Título y descripción de la alerta.
 */
export function captureFailure(method: BiometricMethod): { title: string; description: string } {
  return method === "fingerprint"
    ? { title: "Huella no legible", description: "Limpia el lector y vuelve a apoyar el dedo antes de repetir." }
    : { title: "Iluminación insuficiente", description: "Acércate a una fuente de luz antes de repetir la captura." };
}

/** Frase corta de la persona y la operación, para el encabezado de la captura. */
export function captureHeading(mode: CaptureMode, method: BiometricMethod): { title: string; description: string; crumb: string } {
  const subject = method === "fingerprint" ? "la huella" : "el rostro";
  return mode === "enrollment"
    ? { title: "Registro biométrico", crumb: "Registrar biometría", description: `Captura ${subject} para asociar el perfil biométrico a la persona.` }
    : { title: "Verificación de identidad", crumb: "Verificar identidad", description: `Captura ${subject} para compararla con el registro biométrico de la persona.` };
}
