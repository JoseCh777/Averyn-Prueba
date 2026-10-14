"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { useToast } from "@/components/ui/overlay";
import { limaDay } from "@/lib/date-format";

import { createPersonAction } from "./actions";
import { identityPath } from "./routes";
import {
  EMPTY_PERSON_FORM,
  firstInvalidField,
  validatePersonField,
  validatePersonForm,
  type PersonFormErrors,
  type PersonFormField,
  type PersonFormFields,
} from "./person-form";

/** Identificador del control de un campo: lo usan las etiquetas, el resumen de errores y el foco. */
export function personFieldId(field: PersonFormField): string {
  return `person-form-${field}`;
}

/** Lleva el foco al control de un campo, si existe. */
function focusField(field: PersonFormField): void {
  document.getElementById(personFieldId(field))?.focus();
}

/** Lo que el formulario necesita para pintarse y enviarse. */
export interface NewPersonFormController {
  fields: PersonFormFields;
  errors: PersonFormErrors;
  /** Mensaje general (un fallo que no es de un campo). */
  formError: string | undefined;
  /** Hubo un intento de envío con errores: se muestra el resumen. */
  attempted: boolean;
  /** `true` desde que se envía hasta que llega la respuesta o termina la navegación. */
  pending: boolean;
  /** Hoy `aaaa-mm-dd` (vacío hasta que monta): tope del campo de nacimiento. */
  today: string;
  /** Nombre de la última persona creada con «Crear y agregar otra», para avisarlo. */
  lastCreated: string | undefined;
  setField: (field: PersonFormField, value: string) => void;
  blurField: (field: PersonFormField) => void;
  focusField: (field: PersonFormField) => void;
  submit: (event?: FormEvent<HTMLFormElement>, keepOpen?: boolean) => Promise<void>;
}

/**
 * Estado y envío del formulario «Nueva persona».
 *
 * - Valida un campo al salir de él y, si ya tenía error, mientras se corrige (el error desaparece al
 *   arreglarlo). Al enviar valida todo, lleva el foco al primer campo con error y muestra el resumen.
 * - El envío llama a la acción de servidor, que vuelve a validar. Si sale bien avisa con un toast y
 *   lleva al detalle de la persona; con «Crear y agregar otra» deja el formulario limpio (conservando
 *   la afiliación) y el foco en el primer nombre.
 * - `pending` sigue en `true` durante la navegación para que no se pueda enviar dos veces.
 *
 * @returns El estado y las funciones del formulario.
 */
export function useNewPersonForm(): NewPersonFormController {
  const router = useRouter();
  const toast = useToast();
  const [fields, setFields] = useState<PersonFormFields>(EMPTY_PERSON_FORM);
  const [errors, setErrors] = useState<PersonFormErrors>({});
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [today, setToday] = useState("");
  const [lastCreated, setLastCreated] = useState<string | undefined>(undefined);

  // «Hoy» se calcula al montar, en el cliente: la fecha del servidor puede quedar vieja en la caché.
  useEffect(() => {
    setToday(limaDay(new Date()));
  }, []);

  const todayOrNow = (): string => (today === "" ? limaDay(new Date()) : today);

  const setField = (field: PersonFormField, value: string): void => {
    const next = { ...fields, [field]: value };
    setFields(next);
    setFormError(undefined);
    // Solo se revalida mientras se corrige un error: no se grita a quien aún está escribiendo.
    if (errors[field] !== undefined) {
      const message = validatePersonField(field, next, todayOrNow());
      setErrors((current) => {
        const copy = { ...current };
        if (message === undefined) delete copy[field];
        else copy[field] = message;
        return copy;
      });
    }
  };

  const blurField = (field: PersonFormField): void => {
    // Lo vacío se reporta al enviar: avisarlo al salir del campo mueve el botón entre el clic y el
    // soltar, y el envío se pierde.
    if (fields[field].trim() === "") return;
    const message = validatePersonField(field, fields, todayOrNow());
    setErrors((current) => {
      const copy = { ...current };
      if (message === undefined) delete copy[field];
      else copy[field] = message;
      return copy;
    });
  };

  const submit = async (event?: FormEvent<HTMLFormElement>, keepOpen = false): Promise<void> => {
    event?.preventDefault();
    if (pending) return;

    const found = validatePersonForm(fields, todayOrNow());
    const first = firstInvalidField(found);
    if (first !== undefined) {
      setErrors(found);
      setAttempted(true);
      focusField(first);
      return;
    }

    setPending(true);
    setFormError(undefined);
    const result = await createPersonAction(fields);

    if (!result.ok) {
      setPending(false);
      setErrors(result.errors);
      setAttempted(true);
      setFormError(result.message);
      const invalid = firstInvalidField(result.errors);
      if (invalid !== undefined) focusField(invalid);
      return;
    }

    toast({ title: "Persona creada", text: `${result.name} quedó como Pendiente hasta que se verifique su identidad.`, kind: "ok" });
    if (keepOpen) {
      setFields({ ...EMPTY_PERSON_FORM, affiliation: fields.affiliation });
      setErrors({});
      setAttempted(false);
      setLastCreated(result.name);
      setPending(false);
      focusField("firstName");
      return;
    }
    router.push(identityPath(result.personId));
  };

  return { fields, errors, formError, attempted, pending, today, lastCreated, setField, blurField, focusField, submit };
}
