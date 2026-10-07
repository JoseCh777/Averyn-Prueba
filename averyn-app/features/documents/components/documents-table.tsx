import type { ReactNode } from "react";

import { Table } from "@/components/ui/display";
import { Chip } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { formatDate, relativeDayLabel } from "@/lib/date-format";

import { DOCUMENT_KIND_ICON, DOCUMENT_KIND_LABEL, DOCUMENT_STATUS_CHIP, DOCUMENT_STATUS_LABEL, UNREADABLE_DOCUMENT_MESSAGE } from "../labels";
import type { DocumentRecord } from "../types";
import { OcrResultButton } from "./ocr-result-button";

/**
 * Tabla del historial de documentos: tipo, fecha, estado y acciones.
 *
 * Es un Server Component; solo el botón de resultado corre en el navegador. Un documento en
 * proceso o con error explica qué pasa debajo del chip; solo los procesados tienen resultado.
 *
 * El estado vacío se pinta **dentro** de la tabla (`tr.av-table__empty` con `colspan`),
 * igual que en el original (dashboard-documents.js:181-190), en vez de fuera de ella.
 *
 * @param props - Los documentos, en orden de registro (del más antiguo al más reciente, como
 * los pinta el original), y el contenido de la fila vacía cuando no hay ninguno.
 * @returns La tabla.
 */
export function DocumentsTable({ documents, now = new Date(), empty }: { documents: readonly DocumentRecord[]; now?: Date; empty?: ReactNode }) {
  return (
    <div className="av-tablewrap" tabIndex={0} role="region" aria-label="Historial de documentos (desplazable)">
      <Table>
        <thead>
          <tr>
            <th scope="col">Documento</th>
            <th scope="col">Fecha</th>
            <th scope="col">Estado</th>
            <th scope="col" className="av-table__actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr className="av-table__empty">
              <td colSpan={4}>{empty}</td>
            </tr>
          ) : documents.map((document) => {
            const status = DOCUMENT_STATUS_CHIP[document.status];
            return (
              <tr key={document.id}>
                <td>
                  <div className="av-who">
                    <span className="av-initials" data-tone="slate" aria-hidden="true">
                      <Icon name={DOCUMENT_KIND_ICON[document.kind]} />
                    </span>
                    <div className="av-who__text">
                      <span className="av-who__name">{DOCUMENT_KIND_LABEL[document.kind]}</span>
                      <span className="av-who__sub">{document.fileName}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {formatDate(document.uploadedAt)}
                  <span className="av-cell-sub">{relativeDayLabel(document.uploadedAt, now)}</span>
                </td>
                <td>
                  <Chip tone={status.tone} icon={status.icon}>
                    {DOCUMENT_STATUS_LABEL[document.status]}
                  </Chip>
                  {document.status === "processing" ? <span className="av-cell-sub">Extrayendo datos…</span> : null}
                  {document.status === "failed" ? <span className="av-cell-sub av-cell-sub--wrap">{UNREADABLE_DOCUMENT_MESSAGE}</span> : null}
                </td>
                <td className="av-table__actions">
                  {document.status === "processed" ? (
                    <OcrResultButton
                      documentId={document.id}
                      kindLabel={DOCUMENT_KIND_LABEL[document.kind]}
                      fields={document.fields}
                      confirmed={document.confirmed}
                    />
                  ) : (
                    <span className="av-cell-sub">
                      <span className="sr-only">Sin acciones disponibles</span>—
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
