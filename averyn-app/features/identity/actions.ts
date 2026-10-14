"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/features/authentication/require-session";
import { limaDay } from "@/lib/date-format";

import { firstInvalidField, parsePersonFormFields, toNewPersonInput, validatePersonForm, type CreatePersonResult } from "./person-form";
import { DuplicateDocumentError, personService } from "./services";
import type { DeletePersonResult } from "./types";

/** Pantallas que muestran personas y deben recalcularse tras un cambio. */
function revalidatePeople(): void {
  revalidatePath("/identity");
  revalidatePath("/dashboard");
}

/**
 * Crea a una persona desde el formulario «Nueva persona».
 *
 * La acción es un endpoint público: exige sesión y **vuelve a validar** todo lo que recibe aunque el
 * navegador ya lo haya validado. La persona nace `pending` hasta que se verifique su identidad.
 *
 * @param raw - Campos del formulario, sin tipar.
 * @returns La persona creada, o los errores por campo (un documento repetido se marca en su campo).
 */
export async function createPersonAction(raw: unknown): Promise<CreatePersonResult> {
  await requireSession();
  const fields = parsePersonFormFields(raw);
  const errors = validatePersonForm(fields, limaDay(new Date()));
  if (firstInvalidField(errors) !== undefined) return { ok: false, errors };

  try {
    const person = await personService.create(toNewPersonInput(fields));
    revalidatePeople();
    return { ok: true, personId: person.id, name: person.name };
  } catch (error) {
    if (error instanceof DuplicateDocumentError) {
      return { ok: false, errors: { document: "Ya hay una persona registrada con ese documento." } };
    }
    return { ok: false, errors: {}, message: "No pudimos crear a la persona. Intente de nuevo." };
  }
}

/**
 * Elimina a una persona del catálogo.
 *
 * @param personId - Id de la persona.
 * @returns Si salió bien y el mensaje para mostrar.
 */
export async function deletePersonAction(personId: string): Promise<DeletePersonResult> {
  await requireSession();
  await personService.remove(personId);
  revalidatePeople();
  return { ok: true, message: "Persona eliminada." };
}
