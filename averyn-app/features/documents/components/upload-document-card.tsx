"use client";

import { useId, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/overlay";
import { cn } from "@/lib/utils";

import { uploadDocumentAction } from "../actions";
import { formatFileSize, validateUpload } from "../document-rules";
import { DOCUMENT_KINDS, DOCUMENT_KIND_LABEL } from "../labels";
import type { UploadMetadata } from "../types";

/**
 * Tarjeta «Nuevo documento»: elegir el tipo, soltar o elegir el archivo y procesarlo con OCR.
 *
 * Valida el formato y el tamaño en el navegador para avisar al instante; el servidor vuelve a
 * validar. Arrastrar es una mejora: siempre existe el selector de archivos del navegador.
 *
 * @returns La tarjeta de carga.
 */
export function UploadDocumentCard() {
  const inputId = useId();
  const hintId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [kind, setKind] = useState("cc");
  const [file, setFile] = useState<UploadMetadata | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();

  const choose = (candidate: File | undefined, chosenKind: string) => {
    if (candidate === undefined) return;
    const meta: UploadMetadata = { fileName: candidate.name, sizeBytes: candidate.size, mimeType: candidate.type, kind: chosenKind };
    const validation = validateUpload(meta);
    setError(validation.ok ? undefined : validation.error);
    setFile(validation.ok ? meta : undefined);
  };

  const clear = () => {
    setFile(undefined);
    setError(undefined);
    if (fileInput.current) fileInput.current.value = "";
  };

  const process = () => {
    if (file === undefined) return;
    startTransition(async () => {
      const result = await uploadDocumentAction({ ...file, kind });
      toast({ title: result.ok ? "Documento procesado" : "No se pudo procesar", text: result.message, kind: result.ok ? "ok" : "bad" });
      clear();
    });
  };

  return (
    <section className="av-surface av-surface--pad" id="subir-documento" aria-labelledby="upload-title">
      <div className="av-surface__head">
        <h2 id="upload-title">Nuevo documento</h2>
        <p>El OCR extrae los campos y los deja listos para confirmar.</p>
      </div>

      <div className="upload">
        <Field label="Tipo de documento" className="upload__kind">
          {(a) => (
            <Select {...a} value={kind} onChange={(event) => setKind(event.target.value)}>
              {DOCUMENT_KINDS.map((option) => (
                <option key={option} value={option}>
                  {DOCUMENT_KIND_LABEL[option]}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <div>
          <label
            className={cn("up__drop", dragging && "is-over")}
            htmlFor={inputId}
            onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={(event) => { event.preventDefault(); setDragging(false); }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              choose(event.dataTransfer.files[0], kind);
            }}
          >
            <Icon name="cloud-arrow-up" />
            <span className="up__t">
              <b>Sube la foto de tu documento</b> arrastrándola o eligiéndola desde tu equipo
            </span>
            <span className="up__h" id={hintId}>
              JPG, PNG o PDF · máx. 10 MB
            </span>
          </label>
          <input
            ref={fileInput}
            className="sr-only"
            id={inputId}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            aria-describedby={hintId}
            onChange={(event) => choose(event.target.files?.[0], kind)}
          />
        </div>
      </div>

      {error ? (
        <Alert tone="error" className="upload__msg">
          {error}
        </Alert>
      ) : null}

      {file ? (
        <div className="upload__file">
          <Icon name="file-earmark-image" />
          <span className="upload__name">
            <b>{file.fileName}</b>
            <small>{formatFileSize(file.sizeBytes)}</small>
          </span>
          <Button variant="text" onClick={clear} disabled={pending}>
            Quitar<span className="sr-only"> {file.fileName}</span>
          </Button>
          <Button onClick={process} loading={pending}>
            {pending ? "Procesando…" : "Procesar documento"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
