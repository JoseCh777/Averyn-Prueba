"use client";

import { useId, useRef, useState } from "react";

import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Segmented } from "@/components/ui/segmented";
import { StepProgress, type ProgressStep } from "@/components/ui/step-progress";

import { readDocumentAction, registerFromDocumentAction } from "../actions";
import { validateUpload } from "../document-rules";
import { DOCUMENT_KIND_SHORT, IDENTITY_DOCUMENT_KINDS } from "../labels";
import type { DocumentKind, PreRegistrationField, UploadMetadata } from "../types";
import { useOcrReview } from "../use-ocr-review";
import { DocumentPreview, type ScanState } from "./document-preview";
import { OcrFieldsForm } from "./ocr-fields-form";

/** Pasos del registro de una persona; el pre-registro es el segundo. */
function stepsFor(consent: boolean): ProgressStep[] {
  return [
    { title: "Consentimiento", state: consent ? "done" : "current" },
    { title: "Pre-registro", state: consent ? "current" : "locked" },
    { title: "Captura de rostro", state: "locked" },
    { title: "Huella dactilar", state: "locked" },
    { title: "Verificación", state: "locked" },
  ];
}

/**
 * [MOCK] Capturas simuladas de cámara: no se abre ninguna cámara; se entrega un archivo ficticio al OCR.
 * TODO(AVY-008): conectar la cámara local, la cámara IP y el escáner cuando existan los servicios de captura.
 */
const SIMULATED_CAPTURES = {
  camera: { fileName: "captura-camara.jpg", source: "Cámara local · simulada" },
  ipCamera: { fileName: "captura-camara-ip.jpg", source: "Cámara IP · simulada" },
} as const;

/** Tamaño ficticio de una captura de cámara simulada. */
const SIMULATED_CAPTURE_BYTES = 250_000;

/**
 * Asistente de pre-registro: consentimiento, captura del documento, revisión de los datos leídos y
 * alta de la persona. Al continuar lleva a la captura de rostro de esa persona.
 *
 * Mientras no haya consentimiento, la captura y los datos están deshabilitados. «Continuar» solo se
 * habilita cuando no quedan campos de baja confianza sin revisar; el servidor valida de nuevo.
 *
 * @returns El asistente completo.
 */
export function PreRegistrationWizard() {
  const consentId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const review = useOcrReview();
  const [kind, setKind] = useState<DocumentKind>("cc");
  const [scan, setScan] = useState<{ state: ScanState; source?: string }>({ state: "empty" });
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Partial<Record<PreRegistrationField, string>>>({});
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const reading = scan.state === "reading";

  const read = async (meta: UploadMetadata, source: string) => {
    setUploadError(undefined);
    setErrors({});
    setScan({ state: "reading", source });
    const result = await readDocumentAction(meta);
    review.load(result.ok ? result.fields : []);
    setScan({ state: result.ok ? "ready" : "failed", source });
  };

  const chooseFile = (file: File | undefined) => {
    if (file === undefined) return;
    const meta: UploadMetadata = { fileName: file.name, sizeBytes: file.size, mimeType: file.type, kind };
    const validation = validateUpload(meta);
    if (!validation.ok) {
      setUploadError(validation.error);
      return;
    }
    void read(meta, file.name);
  };

  const simulate = (capture: (typeof SIMULATED_CAPTURES)[keyof typeof SIMULATED_CAPTURES]) =>
    read({ fileName: capture.fileName, sizeBytes: SIMULATED_CAPTURE_BYTES, mimeType: "image/jpeg", kind }, capture.source);

  const reset = () => {
    review.load([]);
    setScan({ state: "empty" });
    setErrors({});
    setUploadError(undefined);
    if (fileInput.current) fileInput.current.value = "";
  };

  const submit = async () => {
    setSaving(true);
    setErrors({});
    // Si todo sale bien el servidor redirige a la captura de rostro y esta llamada no vuelve.
    const result = await registerFromDocumentAction({ values: review.values, email, consent });
    setErrors(result.errors);
    setSaving(false);
  };

  return (
    <div className="av-wizard">
      <aside className="av-wizard__side av-surface av-surface--pad">
        <StepProgress steps={stepsFor(consent)} label="Progreso del registro" />
      </aside>

      <div className="av-wizard__body">
        <section className="av-surface av-surface--pad" aria-labelledby="consent-title">
          <div className="av-surface__head">
            <h2 id="consent-title">Consentimiento informado</h2>
            <p>La captura de documentos y datos biométricos exige que la persona lo autorice antes de empezar.</p>
          </div>
          <Checkbox
            id={consentId}
            label="La persona autoriza el tratamiento de sus datos personales y biométricos para este registro."
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          {consent ? null : <p className="av-note">Marca la casilla para habilitar la captura del documento.</p>}
          {errors.consent ? (
            <p className="av-err" role="alert">
              <Icon name="exclamation-circle" />
              {errors.consent}
            </p>
          ) : null}
        </section>

        <fieldset className="av-wizard__fieldset" disabled={!consent}>
          <legend className="sr-only">Documento y datos de la persona</legend>
          <section className="av-surface av-surface--pad">
            <div className="wiz-kind">
              <span className="av-label">Tipo de documento</span>
              <Segmented
                label="Tipo de documento"
                value={kind}
                onChange={setKind}
                options={IDENTITY_DOCUMENT_KINDS.map((option) => ({ value: option, label: DOCUMENT_KIND_SHORT[option] }))}
              />
            </div>

            <div className="wiz-grid">
              <div className="wiz-capture">
                <DocumentPreview state={scan.state} source={scan.source} />
                <div className="wiz-capture__actions">
                  <Button variant="ghost" onClick={() => fileInput.current?.click()} disabled={reading}>
                    <Icon name="upload" /> Subir archivo
                  </Button>
                  <Button variant="ghost" onClick={() => void simulate(SIMULATED_CAPTURES.camera)} disabled={reading}>
                    <Icon name="camera" /> Cámara
                  </Button>
                  <Button variant="ghost" onClick={() => void simulate(SIMULATED_CAPTURES.ipCamera)} disabled={reading}>
                    <Icon name="camera-video" /> Cámara IP
                  </Button>
                </div>
                <input
                  ref={fileInput}
                  className="sr-only"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  tabIndex={-1}
                  aria-label="Elegir archivo del documento"
                  onChange={(event) => chooseFile(event.target.files?.[0])}
                />
                {uploadError ? <Alert tone="error">{uploadError}</Alert> : null}
                <p className="wiz-capture__note">Formatos: JPG, PNG o PDF — máx. 10 MB.</p>
                <div className="wiz-qr">
                  <Icon name="qr-code" />
                  <span>
                    <b>Contingencia por QR</b>
                    <small>Capturar desde otro dispositivo · Próximamente</small>
                  </span>
                </div>
              </div>

              <div className="wiz-data">
                <h2 className="wiz-data__title">Datos detectados por OCR</h2>
                <OcrFieldsForm review={review} errors={errors} idPrefix="pre-registration" />
                <h2 className="wiz-data__title">Datos complementarios</h2>
                <Field label="Correo (opcional)" error={errors.email}>
                  {(a) => (
                    <Input
                      {...a}
                      type="email"
                      autoComplete="off"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  )}
                </Field>
              </div>
            </div>
          </section>

          <div className="wiz-footer">
            <Button variant="ghost" onClick={reset} disabled={reading || saving}>
              <Icon name="arrow-repeat" /> Nuevo escaneo
            </Button>
            <Button onClick={() => void submit()} loading={saving} disabled={reading || review.pending > 0}>
              {saving ? "Registrando…" : "Continuar a captura de rostro"} {saving ? null : <Icon name="arrow-right" />}
            </Button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
