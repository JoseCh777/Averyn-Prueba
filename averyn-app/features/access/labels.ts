import type { ChipTone } from "@/components/ui/feedback";
import type { IconName } from "@/components/ui/icon";

import type { AccessDecision, AccessDirection, AccessMethod, DenyReason, SimulatedOutcome } from "./types";

export const METHOD_LABEL: Record<AccessMethod, string> = { QR: "Código QR", FACE: "Rostro", FINGERPRINT: "Huella" };

export const METHOD_ICON: Record<AccessMethod, IconName> = { QR: "qr-code", FACE: "person-bounding-box", FINGERPRINT: "fingerprint" };

export const DIRECTION_LABEL: Record<AccessDirection, string> = { ENTRY: "Entrada", EXIT: "Salida" };

/** Palabra grande de la tarjeta de resultado: el color siempre va con icono y texto. */
export const DECISION_LABEL: Record<AccessDecision, string> = { GRANTED: "Autorizado", DENIED: "Denegado" };

export const DECISION_CHIP: Record<AccessDecision, { tone: ChipTone; icon: IconName; label: string }> = {
  GRANTED: { tone: "success", icon: "check-circle", label: "Autorizado" },
  DENIED: { tone: "error", icon: "x-circle", label: "Denegado" },
};

/**
 * Mensajes para el operador, en usted. El catálogo de motivos está pendiente en el contrato (⚑).
 * La interfaz decide por `DenyReason`, nunca por el texto.
 */
export const DENY_REASON_MESSAGE: Record<DenyReason, string> = {
  EVENT_NOT_LIVE: "El evento no está abierto en este momento.",
  NOT_ADMITTED: "La persona no figura en el padrón del evento o su acceso fue revocado.",
  ALREADY_INSIDE: "La persona ya registró su ingreso y figura dentro del evento.",
  NOT_INSIDE: "La persona no figura dentro del evento, por lo que no se puede registrar su salida.",
  CAPACITY_FULL: "El aforo del evento está completo.",
  QR_INVALID: "El código QR no es válido. Pida a la persona que revise su invitación.",
  QR_EXPIRED: "El código QR venció. El organizador puede reemitirlo.",
  QR_USED: "El código QR ya se utilizó para ingresar.",
  IDENTITY_MISMATCH: "La identidad no coincide entre los factores presentados.",
  ENROLLMENT_MISSING: "La persona no tiene registrado este método. Use otro método de la política.",
  NO_MATCH: "No hubo coincidencia con la persona. Pida repetir la captura.",
  LIVENESS_FAILED: "No se pudo confirmar que la captura sea de una persona presente.",
  VERIFICATION_ERROR: "El servicio de verificación no respondió. Intente de nuevo o use el QR si la política lo permite.",
};

/** Resultados que el panel de demostración puede forzar en una captura biométrica. */
export const OUTCOME_LABEL: Record<SimulatedOutcome, string> = {
  match: "Coincide",
  no_match: "No coincide",
  liveness_failed: "Falla la vivacidad",
  unavailable: "Servicio no disponible",
};

/**
 * Resumen legible de una política: los grupos se unen con «y» y los métodos de un grupo con «o»
 * (`Código QR y (Rostro o Huella)`).
 *
 * @param policy - Grupos de la política del punto de control.
 * @returns El texto, o «Sin verificación» si no hay grupos.
 */
export function policyLabel(policy: readonly (readonly AccessMethod[])[]): string {
  if (policy.length === 0) return "Sin verificación";
  return policy
    .map((group) => {
      const text = group.map((method) => METHOD_LABEL[method]).join(" o ");
      return policy.length > 1 && group.length > 1 ? `(${text})` : text;
    })
    .join(" y ");
}

/**
 * Iniciales para el avatar de una persona (máximo dos letras).
 *
 * @param name - Nombre completo.
 * @returns Las iniciales en mayúscula, o «?» si no hay nombre.
 */
export function initialsOf(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter((part) => part !== "")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase());
  return letters.join("") || "?";
}
