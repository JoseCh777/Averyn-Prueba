"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { currentOperatorName } from "@/features/authentication/current-operator";
import { requireSession } from "@/features/authentication/require-session";
import { personService } from "@/features/identity/services";

import { methodAvailability, parseCaptureContext } from "./biometric-rules";
import { enrollmentDonePath, verificationResultPath } from "./routes";
import { biometricService } from "./services";
import type { CompleteCaptureResult } from "./types";

/** Pantallas que muestran datos biométricos y deben recalcularse tras una operación. */
function revalidateBiometrics(): void {
  revalidatePath("/biometrics", "layout");
  revalidatePath("/identity");
  revalidatePath("/dashboard");
}

/**
 * Cierra una captura biométrica: registra la modalidad o verifica a la persona y sigue al
 * acta o al resultado.
 *
 * El desenlace de una verificación lo decide el servicio, nunca el navegador. Si la
 * verificación sale bien, la persona queda como verificada. Si todo sale bien redirige y no
 * vuelve; si no, devuelve el motivo.
 *
 * @param input - Modo, persona y modalidad (se validan: vienen del navegador).
 * @returns El motivo por el que no se pudo cerrar (solo cuando falla).
 */
export async function completeCaptureAction(input: unknown): Promise<CompleteCaptureResult> {
  await requireSession();
  const context = parseCaptureContext(typeof input === "object" && input !== null ? { mode: Reflect.get(input, "mode"), person: Reflect.get(input, "person"), method: Reflect.get(input, "method") } : {});
  if (context === undefined) return { ok: false, message: "No pudimos leer los datos de la captura." };

  const [person, profile, devices] = await Promise.all([
    personService.getById(context.personId),
    biometricService.getProfile(context.personId),
    biometricService.listDevices(),
  ]);
  if (person === undefined) return { ok: false, message: "La persona ya no existe." };

  const availability = methodAvailability({ mode: context.mode, method: context.method, profile, devices });
  if (!availability.available) return { ok: false, message: availability.reason };

  const operation = { personId: context.personId, method: context.method, operator: await currentOperatorName() };
  if (context.mode === "enrollment") {
    const event = await biometricService.enroll(operation);
    revalidateBiometrics();
    redirect(enrollmentDonePath(event.id));
  }

  const event = await biometricService.verify(operation);
  if (event.result === "success") await personService.markVerified(context.personId);
  revalidateBiometrics();
  redirect(verificationResultPath(event.id));
}
