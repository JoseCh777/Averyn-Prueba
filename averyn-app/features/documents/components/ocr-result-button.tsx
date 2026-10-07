"use client";

import { useState, useTransition } from "react";

import { Button, IconButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Modal, useToast } from "@/components/ui/overlay";

import { confirmDocumentAction } from "../actions";
import type { OcrField } from "../types";
import { useOcrReview } from "../use-ocr-review";
import { OcrFieldsForm } from "./ocr-fields-form";

type OcrResultButtonProps = {
  documentId: string;
  /** Nombre del tipo de documento, para el nombre accesible del botón. */
  kindLabel: string;
  fields: readonly OcrField[];
  confirmed: boolean;
};

/**
 * Botón «Ver resultado OCR» y su diálogo de revisión.
 *
 * El diálogo muestra los campos leídos con su confianza; solo se puede confirmar cuando no
 * quedan campos de baja confianza sin ver. Al abrirlo se vuelve a cargar lo guardado, así que
 * cerrar sin confirmar descarta los cambios.
 *
 * @param props - El documento y sus campos leídos.
 * @returns El botón y el diálogo.
 */
export function OcrResultButton({ documentId, kindLabel, fields, confirmed }: OcrResultButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const review = useOcrReview(fields, confirmed);
  const toast = useToast();

  const openDialog = () => {
    review.load(fields, confirmed);
    setOpen(true);
  };

  const confirm = () => {
    startTransition(async () => {
      const result = await confirmDocumentAction(documentId, review.values);
      toast({ title: result.message, kind: result.ok ? "ok" : "bad" });
      if (result.ok) setOpen(false);
    });
  };

  return (
    <>
      <IconButton aria-label={`Ver resultado OCR de ${kindLabel}`} title="Ver resultado" onClick={openDialog}>
        <Icon name="eye" />
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Resultado OCR"
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button onClick={confirm} disabled={review.pending > 0} loading={pending}>
              {pending ? "Guardando…" : confirmed ? "Guardar cambios" : "Confirmar datos"}
            </Button>
          </>
        }
      >
        <button type="button" className="av-modal__close" aria-label="Cerrar" onClick={() => setOpen(false)}>
          <Icon name="x-lg" />
        </button>
        <OcrFieldsForm review={review} idPrefix={`ocr-${documentId}`} />
      </Modal>
    </>
  );
}
