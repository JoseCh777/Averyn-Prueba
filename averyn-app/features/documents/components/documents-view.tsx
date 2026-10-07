import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Kpi, KpiRow } from "@/components/ui/display";
import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

import { summarizeDocuments } from "../document-rules";
import { documentService } from "../services";
import { DocumentsTable } from "./documents-table";
import { UploadDocumentCard } from "./upload-document-card";

/** Ruta del asistente de pre-registro. */
export const PRE_REGISTRATION_PATH = "/documents/pre-registration";

/**
 * Pantalla de Documentos: indicadores, carga de un documento y su historial.
 *
 * Es un Server Component asíncrono: pide los documentos al servicio, así que mientras llegan se
 * muestra `loading.tsx` y, si falla, `error.tsx`.
 *
 * @returns La pantalla completa.
 */
export async function DocumentsView() {
  const documents = await documentService.list();
  const summary = summarizeDocuments(documents);

  return (
    <div className="av-page av-page--docs">
      <PageHeader
        icon="camera"
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Documentos" }]}
        title="Documentos"
        description="Captura y lectura OCR de documentos de identidad para extraer y validar sus datos."
        actions={
          <>
            <ButtonLink href="#subir-documento" variant="ghost">
              <Icon name="cloud-arrow-up" /> Subir documento
            </ButtonLink>
            <ButtonLink href={PRE_REGISTRATION_PATH} variant="primary">
              <Icon name="person-plus" /> Nuevo registro
            </ButtonLink>
          </>
        }
      />

      <section aria-label="Indicadores de documentos">
        <KpiRow>
          <Kpi label="Documentos" value={summary.total} note="cargados en total" />
          <Kpi label="Procesados" value={summary.processed} note="OCR completado" />
          <Kpi label="En proceso" value={summary.processing} note="extrayendo datos" />
          <Kpi label="Con error" value={summary.failed} note="requiere revisión" tone={summary.failed > 0 ? "warn" : undefined} />
        </KpiRow>
      </section>

      <UploadDocumentCard />

      <section className="av-surface" aria-labelledby="history-title">
        <div className="av-toolbar">
          <div className="av-toolbar__group">
            <h2 className="av-kpi__label" id="history-title">
              <Icon name="clock-history" />
              Historial de documentos
            </h2>
          </div>
          <div className="av-toolbar__spacer" />
          <span className="av-pagination__info">
            {summary.total} {summary.total === 1 ? "documento" : "documentos"}
          </span>
        </div>
        <DocumentsTable
          documents={documents}
          empty={
            <EmptyState icon="file-earmark-text" title="Aún no hay documentos">
              Los documentos que proceses con OCR aparecerán en este historial.
            </EmptyState>
          }
        />
      </section>
    </div>
  );
}
