import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";

/**
 * Pantalla del módulo de IA: por ahora solo avisa de que llega en una fase posterior.
 *
 * Los modelos (reconocimiento facial, detección de vida, clasificación de documentos) los ejecuta
 * el Core; no hay nada que mostrar hasta que existan.
 *
 * @returns La pantalla.
 */
export function AiView() {
  return (
    <div className="av-page">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "IA" }]}
        title="Módulo de IA"
        description="Inteligencia artificial aplicada a los procesos institucionales."
      />
      <section className="av-surface" aria-label="Estado del módulo de IA">
        <EmptyState icon="cpu" title="Llega en una fase posterior" action={<ButtonLink href="/dashboard" variant="primary">Volver al dashboard</ButtonLink>}>
          Los modelos de inteligencia artificial (reconocimiento facial, detección de vida, clasificación de documentos) se integran en una
          fase posterior del proyecto.
        </EmptyState>
      </section>
    </div>
  );
}
