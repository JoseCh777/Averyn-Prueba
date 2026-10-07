"use client";

import { useActionState, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Modal, useToast } from "@/components/ui/overlay";

import { createPersonAction } from "../actions";
import { AFFILIATIONS, AFFILIATION_LABEL } from "../labels";
import type { NewPersonFormState } from "../types";

const INITIAL_STATE: NewPersonFormState = {
  status: "idle",
  errors: {},
  values: { name: "", document: "", affiliation: "student" },
};

/**
 * Botón «Nueva persona» y su diálogo con el formulario.
 *
 * Los errores llegan de la acción del servidor por campo y no vacían lo escrito. Al crear
 * a la persona el diálogo se cierra y un aviso confirma que quedó como Pendiente.
 *
 * @returns El botón y el diálogo.
 */
export function NewPersonDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createPersonAction, INITIAL_STATE);
  const toast = useToast();
  const formId = useId();

  useEffect(() => {
    if (state.status !== "created") return;
    setOpen(false);
    toast({ title: "Persona creada", text: `${state.createdName ?? "La persona"} quedó como Pendiente.`, kind: "ok" });
  }, [state, toast]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon name="plus-lg" /> Nueva persona
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nueva persona"
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button type="submit" form={formId} loading={pending}>
              {pending ? (
                "Creando…"
              ) : (
                <>
                  <Icon name="check-lg" /> Crear persona
                </>
              )}
            </Button>
          </>
        }
      >
        <form id={formId} className="av-form" action={formAction} noValidate>
          <Field label="Nombre completo" error={state.errors.name}>
            {(a) => <Input {...a} name="name" type="text" autoComplete="off" defaultValue={state.values.name} />}
          </Field>
          <Field label="Documento" error={state.errors.document} help="Solo números, entre 6 y 12 dígitos.">
            {(a) => <Input {...a} name="document" type="text" inputMode="numeric" autoComplete="off" defaultValue={state.values.document} />}
          </Field>
          <Field label="Afiliación" error={state.errors.affiliation}>
            {(a) => (
              <Select {...a} name="affiliation" defaultValue={state.values.affiliation}>
                {AFFILIATIONS.map((affiliation) => (
                  <option key={affiliation} value={affiliation}>
                    {AFFILIATION_LABEL[affiliation]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <p className="av-note">
            La persona se crea con estado <strong>Pendiente</strong> hasta que se verifique.
          </p>
        </form>
      </Modal>
    </>
  );
}
