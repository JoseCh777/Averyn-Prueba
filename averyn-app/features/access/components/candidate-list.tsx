"use client";

import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

import { initialsOf } from "../labels";
import type { Candidate } from "../types";

type CandidateListProps = {
  title: string;
  description: string;
  candidates: readonly Candidate[];
  /** Texto cuando no hay nadie que elegir. */
  emptyTitle: string;
  disabled: boolean;
  onSelect: (candidate: Candidate) => void;
};

/**
 * Lista de personas entre las que el operador elige: los candidatos de una identificación 1:N (que
 * debe confirmar) o quienes están dentro del evento (para registrar una salida).
 *
 * Cada fila es un botón grande con nombre y afiliación, para distinguir homónimos y tocar con
 * facilidad en una tableta. Elegir a la persona equivocada se corrige volviendo a empezar.
 *
 * @param props - El título, las personas y qué hacer al elegir una.
 * @returns La lista o su estado vacío.
 */
export function CandidateList({ title, description, candidates, emptyTitle, disabled, onSelect }: CandidateListProps) {
  return (
    <section className="acc-candidates" aria-label={title}>
      <h3 className="acc-subtitle">{title}</h3>
      <p className="acc-hint">{description}</p>
      {candidates.length === 0 ? (
        <EmptyState icon="people" title={emptyTitle} />
      ) : (
        <ul className="acc-candidates__list">
          {candidates.map((candidate) => (
            <li key={candidate.personId}>
              <button type="button" className="acc-candidate" disabled={disabled} onClick={() => onSelect(candidate)}>
                <span className="acc-avatar" aria-hidden="true">
                  {initialsOf(candidate.displayName)}
                </span>
                <span className="acc-candidate__text">
                  <b>{candidate.displayName}</b>
                  <small>{candidate.detail}</small>
                </span>
                <Icon name="arrow-right" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
