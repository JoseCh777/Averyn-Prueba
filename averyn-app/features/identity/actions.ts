"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/features/authentication/require-session";

import { validateNewPerson } from "./person-rules";
import { DuplicateDocumentError, personService } from "./services";
import type { DeletePersonResult, NewPersonFormState } from "./types";

/** Lee un campo de texto del formulario; los datos de un formulario son externos y no se asume que sean texto. */
function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/** Pantallas que muestran personas y deben recalcularse tras un cambio. */
function revalidatePeople(): void {
  revalidatePath("/identity");
  revalidatePath("/dashboard");
}

/**
 * Acción del formulario «Nueva persona».
 *
 * Valida los campos, registra a la persona como `pending` y devuelve el nuevo estado del
 * formulario: con los errores por campo (sin vaciar lo escrito) o con `created`.
 *
 * @param _previousState - Estado anterior (lo exige `useActionState`; no se usa).
 * @param formData - Datos enviados por el formulario.
 * @returns El estado del formulario tras el envío.
 */
export async function createPersonAction(_previousState: NewPersonFormState, formData: FormData): Promise<NewPersonFormState> {
  await requireSession();
  const values = {
    name: readText(formData, "name"),
    document: readText(formData, "document"),
    affiliation: readText(formData, "affiliation"),
  };

  const validation = validateNewPerson(values);
  if (!validation.ok) {
    return { status: "error", errors: validation.errors, values };
  }

  try {
    const person = await personService.create(validation.input);
    revalidatePeople();
    return { status: "created", errors: {}, values: { name: "", document: "", affiliation: "student" }, createdName: person.name };
  } catch (error) {
    if (error instanceof DuplicateDocumentError) {
      return { status: "error", errors: { document: "Ya hay una persona registrada con ese documento." }, values };
    }
    throw error;
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
