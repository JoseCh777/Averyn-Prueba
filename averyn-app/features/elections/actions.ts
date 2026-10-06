"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/features/authentication/require-session";
import { personService } from "@/features/identity/services";
import { limaDay } from "@/lib/date-format";

import { countParticipants, parseElectionPayload, validateGeneralInfo, validateSettings } from "./election-rules";
import { DuplicateElectionNameError, electionService } from "./services";
import type { CreateElectionResult } from "./types";

/**
 * Crea un proceso electoral desde el asistente.
 *
 * Valida de nuevo todo lo que llega (viene del navegador): la información general, la
 * configuración y que el padrón tenga a quién convocar. El proceso nace como borrador.
 *
 * @param input - Información general, configuración y afiliación convocada (se validan).
 * @returns Si se creó y el mensaje; con errores por campo cuando la validación falla.
 */
export async function createElectionAction(input: unknown): Promise<CreateElectionResult> {
  await requireSession();
  const payload = parseElectionPayload(input);
  if (payload === undefined) return { ok: false, message: "No pudimos leer los datos del proceso." };

  const [elections, people] = await Promise.all([electionService.list(), personService.list()]);
  const general = validateGeneralInfo(payload.general, { existingNames: elections.map((election) => election.name), today: limaDay(new Date()) });
  if (!general.ok) return { ok: false, message: "Revisa la información general del proceso.", generalErrors: general.errors };

  const settings = validateSettings(payload.settings);
  if (!settings.ok) return { ok: false, message: "Revisa la configuración del proceso.", settingsErrors: settings.errors };

  const participants = countParticipants(people, payload.affiliation);
  if (participants.eligible === 0) return { ok: false, message: "No hay personas en el padrón para convocar. Elige otra afiliación." };

  try {
    await electionService.create({ ...general.value, settings: settings.value, participants });
  } catch (error) {
    if (error instanceof DuplicateElectionNameError) {
      return { ok: false, message: "Revisa la información general del proceso.", generalErrors: { name: "Ya existe un proceso electoral con este nombre." } };
    }
    throw error;
  }

  revalidatePath("/elections");
  revalidatePath("/dashboard");
  return { ok: true, message: "Proceso electoral creado." };
}
