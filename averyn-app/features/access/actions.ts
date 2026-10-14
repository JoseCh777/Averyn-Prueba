"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/features/authentication/require-session";

import { parseAccessFactor, parseAccessRequest } from "./access-rules";
import { ACCESS_PATH } from "./routes";
import { accessService, InvalidAccessRequestError } from "./services";
import { resetMockAccess } from "./services/mock-access-service";
import type { AccessResult, IdentifyResult } from "./types";

/** Resultado de una acción: el dato o el mensaje que se muestra al operador. */
export type ActionOutcome<T> = { ok: true; data: T } | { ok: false; message: string };

const UNREADABLE = "No pudimos leer los datos del intento. Vuelva a intentarlo.";

/** Ejecuta la operación, refresca el aforo y el registro, y convierte el error esperado en mensaje. */
async function guarded<T>(run: () => Promise<T>): Promise<ActionOutcome<T>> {
  try {
    const data = await run();
    revalidatePath(ACCESS_PATH);
    return { ok: true, data };
  } catch (error) {
    if (error instanceof InvalidAccessRequestError) return { ok: false, message: error.message };
    return { ok: false, message: "No pudimos completar la operación. Intente de nuevo." };
  }
}

/**
 * Identifica a la persona en un punto de control sin conceder el acceso.
 *
 * El desenlace lo decide el servicio, nunca el navegador. La acción es un endpoint público: exige
 * sesión y vuelve a validar todo lo que recibe.
 *
 * @param input - `{ checkpointId, factor }` sin tipar.
 * @returns El resultado de la identificación o el mensaje de error.
 */
export async function identifyAction(input: unknown): Promise<ActionOutcome<IdentifyResult>> {
  await requireSession();
  const raw = typeof input === "object" && input !== null ? input : {};
  const checkpointId = Reflect.get(raw, "checkpointId");
  const factor = parseAccessFactor(Reflect.get(raw, "factor"));
  if (typeof checkpointId !== "string" || factor === undefined) return { ok: false, message: UNREADABLE };
  return guarded(() => accessService.identify(checkpointId, factor));
}

/**
 * Evalúa la política del punto de control y registra la decisión (`GRANTED` o `DENIED`).
 *
 * @param input - Petición de acceso sin tipar.
 * @returns La decisión o el mensaje de error (un `DENIED` no es un error).
 */
export async function requestAccessAction(input: unknown): Promise<ActionOutcome<AccessResult>> {
  await requireSession();
  const request = parseAccessRequest(input);
  if (request === undefined) return { ok: false, message: UNREADABLE };
  return guarded(() => accessService.requestAccess(request));
}

/**
 * [MOCK] Devuelve la demostración al estado inicial (aforo, padrón, QR y registro).
 * TODO(AVY-048): retirar con el panel de demostración.
 *
 * @returns Siempre `ok`.
 */
export async function resetDemoAction(): Promise<ActionOutcome<null>> {
  await requireSession();
  return guarded(async () => {
    resetMockAccess();
    return null;
  });
}
