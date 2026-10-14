import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Alert, Chip } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { personService } from "@/features/identity/services";
import { formatDate, relativeDayLabel } from "@/lib/date-format";

import {
  DOCUMENT_KIND_ICON,
  DOCUMENT_KIND_LABEL,
  DOCUMENT_STATUS_CHIP,
  DOCUMENT_STATUS_LABEL,
  OCR_FIELD_LABEL,
  UNREADABLE_DOCUMENT_MESSAGE,
} from "../labels";
import { documentService } from "../services";
import type { DocumentStatus } from "../types";
import { DocumentPreview, type ScanState } from "./document-preview";
import { OcrResultButton } from "./ocr-result-button";

/** Estado del visor (mensaje y esquinas) para cada estado del documento. */
const SCAN_STATE: Record<DocumentStatus, ScanState> = {
  processed: "ready",
  processing: "reading",
  failed: "failed",
};

/**
 * Detalle de un documento: visor, ficha (tipo, archivo, estado, persona) y los datos leídos por OCR.
 *
 * Es un Server Component asíncrono: pide el documento al servicio (`getById`), así que mientras
 * llega se muestra `loading.tsx` y, si no existe, `notFound()` dibuja el 404. El botón de
 * revisión del OCR es el mismo de la tabla (único componente cliente de la pantalla).
 *
 * @param props - El id del documento, tomado de la URL.
 * @returns La pantalla de detalle.
 */
export async function DocumentDetailView({ documentId }: { documentId: string }) {
  const document = await documentService.getById(documentId);
  if (document === undefined) notFound();

  const status = DOCUMENT_STATUS_CHIP[document.status];
  const person = document.personId === undefined ? undefined : await personService.getById(document.personId);
  const kindLabel = DOCUMENT_KIND_LABEL[document.kind];

  return (
    <div className="av-page av-page--docs" role="region" aria-label="Detalle del documento">
      <PageHeader
        title="Detalle del documento"
        description="Lectura OCR, estado y persona a la que pertenece el documento."
        actions={
          <ButtonLink href="/documents">
            <Icon name="arrow-left" /> Volver al listado
          </ButtonLink>
        }
      />

      <div className="doc-detail">
        <section className="av-surface av-surface--pad" aria-label="Visor del documento">
          <DocumentPreview state={SCAN_STATE[document.status]} source={document.fileName} />
        </section>

        <section className="av-surface av-surface--pad" aria-label="Ficha del documento">
          <div className="av-profile">
            <span className="av-initials av-initials--lg" data-tone="slate" aria-hidden="true">
              <Icon name={DOCUMENT_KIND_ICON[document.kind]} />
            </span>
            <div>
              <h2>{kindLabel}</h2>
              <p>{document.fileName}</p>
            </div>
          </div>
          <dl className="av-detail">
            <div>
              <dt>Estado</dt>
              <dd>
                <Chip tone={status.tone} icon={status.icon}>
                  {DOCUMENT_STATUS_LABEL[document.status]}
                </Chip>
                {document.status === "processing" ? <span className="av-cell-sub">Extrayendo datos…</span> : null}
                {document.status === "failed" ? <span className="av-cell-sub av-cell-sub--wrap">{UNREADABLE_DOCUMENT_MESSAGE}</span> : null}
              </dd>
            </div>
            <div>
              <dt>Subido</dt>
              <dd>
                {formatDate(document.uploadedAt)}
                <span className="av-cell-sub">{relativeDayLabel(document.uploadedAt)}</span>
              </dd>
            </div>
            {document.status === "processed" ? (
              <div>
                <dt>Datos confirmados</dt>
                <dd>{document.confirmed ? "Sí" : "Pendiente de revisión"}</dd>
              </div>
            ) : null}
            {person !== undefined ? (
              <div>
                <dt>Persona</dt>
                <dd>
                  <Link className="av-who__name" href={`/identity/${person.id}`}>
                    {person.name}
                  </Link>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Identificador</dt>
              <dd className="av-cell-mono">{document.id}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="av-surface" aria-labelledby="doc-fields-title">
        <div className="av-toolbar av-toolbar--head">
          <h2 className="av-toolbar__title" id="doc-fields-title">
            <Icon name="file-earmark-text" /> Datos leídos (OCR)
          </h2>
          {document.status === "processed" ? (
            <OcrResultButton documentId={document.id} kindLabel={kindLabel} fields={document.fields} confirmed={document.confirmed} />
          ) : null}
        </div>
        <div className="doc-fields">
          {document.status === "processed" ? (
            <dl className="av-detail">
              {document.fields.map((field) => (
                <div key={field.key}>
                  <dt>{OCR_FIELD_LABEL[field.key]}</dt>
                  <dd>
                    {field.value === "" ? <span className="av-cell-sub">Sin dato</span> : field.value}
                    {field.confidence !== null ? <span className="av-cell-sub">{field.confidence}% de confianza</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          ) : document.status === "failed" ? (
            <Alert tone="error">{UNREADABLE_DOCUMENT_MESSAGE}</Alert>
          ) : (
            <p className="av-note" role="status">
              Extrayendo datos del documento…
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
