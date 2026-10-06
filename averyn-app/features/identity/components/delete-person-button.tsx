"use client";

import { useState, useTransition } from "react";

import { Button, IconButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Modal, useToast } from "@/components/ui/overlay";

import { deletePersonAction } from "../actions";

/**
 * Botón de eliminar con confirmación: abre un diálogo y solo borra si la persona confirma.
 *
 * @param props - El id y el nombre de la persona (el nombre va en el texto del botón y del diálogo).
 * @returns El botón y su diálogo.
 */
export function DeletePersonButton({ personId, personName }: { personId: string; personName: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const confirm = () => {
    startTransition(async () => {
      const result = await deletePersonAction(personId);
      setOpen(false);
      toast({ title: result.message, text: personName, kind: result.ok ? "ok" : "bad" });
    });
  };

  return (
    <>
      <IconButton aria-label={`Eliminar a ${personName}`} onClick={() => setOpen(true)}>
        <Icon name="trash3" />
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`¿Eliminar a ${personName}?`}
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirm} loading={pending}>
              {pending ? "Eliminando…" : "Eliminar"}
            </Button>
          </>
        }
      >
        <p>Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
}
