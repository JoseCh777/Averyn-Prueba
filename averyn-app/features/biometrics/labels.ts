import type { ChipTone } from "@/components/ui/feedback";
import type { IconName } from "@/components/ui/icon";

import type { BiometricMethod, CaptureMode, DeviceStatus, EventResult } from "./types";

export const METHODS: readonly BiometricMethod[] = ["face", "fingerprint"];

export const METHOD_LABEL: Record<BiometricMethod, string> = { face: "Rostro", fingerprint: "Huella" };

export const METHOD_ICON: Record<BiometricMethod, IconName> = { face: "person-bounding-box", fingerprint: "fingerprint" };

/** Con artículo, para frases: «Captura el rostro…», «Captura la huella…». */
export const METHOD_WITH_ARTICLE: Record<BiometricMethod, string> = { face: "el rostro", fingerprint: "la huella" };

export const OPERATION_LABEL: Record<CaptureMode, string> = { enrollment: "Registro", verification: "Verificación" };

export const EVENT_RESULTS: readonly EventResult[] = ["success", "rejected", "retry", "device"];

/** Texto del resultado en el filtro del historial. */
export const EVENT_RESULT_FILTER_LABEL: Record<EventResult, string> = {
  success: "Exitosa",
  rejected: "Rechazada",
  retry: "Reintento",
  device: "Sin dispositivo",
};

/**
 * Chip de un resultado: el color siempre va con icono y palabra. El éxito de un registro
 * se llama «Registrado» y el de una verificación «Verificado».
 *
 * @param result - Resultado del evento.
 * @param operation - Operación a la que pertenece.
 * @returns Tono, icono y texto del chip.
 */
export function resultChip(result: EventResult, operation: CaptureMode): { tone: ChipTone; icon: IconName; label: string } {
  switch (result) {
    case "success":
      return { tone: "success", icon: "check-circle", label: operation === "enrollment" ? "Registrado" : "Verificado" };
    case "rejected":
      return { tone: "error", icon: "x-circle", label: "Rechazado" };
    case "retry":
      return { tone: "warning", icon: "arrow-repeat", label: "Reintento" };
    case "device":
      return { tone: "neutral", icon: "plug", label: "Sin dispositivo" };
  }
}

export const DEVICE_STATUS_CHIP: Record<DeviceStatus, { tone: ChipTone; icon: IconName; label: string }> = {
  connected: { tone: "success", icon: "signal", label: "Conectado" },
  disconnected: { tone: "neutral", icon: "plug", label: "Desconectado" },
};

/** Texto de la tarjeta de modalidad en el registro cuando no se puede elegir. */
export const DEVICE_UNAVAILABLE = "Dispositivo no conectado";
