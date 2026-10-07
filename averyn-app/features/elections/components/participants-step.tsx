"use client";

import { Table } from "@/components/ui/display";
import { Alert } from "@/components/ui/feedback";
import { Field, Select } from "@/components/ui/field";
import { SearchField } from "@/components/ui/inputs";
import { AffiliationTag, StatusChip } from "@/features/identity/components/person-badges";
import { PersonAvatar } from "@/features/identity/components/person-avatar";
import { AFFILIATIONS, AFFILIATION_LABEL } from "@/features/identity/labels";
import { normalizeText, parseAffiliation } from "@/features/identity/person-rules";
import type { Person } from "@/features/identity/types";

import { countParticipants, eligibleVoters } from "../election-rules";

type ParticipantsStepProps = {
  people: readonly Person[];
  /** `all` o una afiliación. */
  affiliation: string;
  /** Texto del buscador: vive en el asistente para que la revisión lo muestre igual que el original. */
  query: string;
  onQuery: (value: string) => void;
  onAffiliation: (value: string) => void;
  /** Mensaje del servidor cuando no hay a quién convocar. */
  error?: string;
};

/**
 * Paso 3 del asistente: a quién se convoca.
 *
 * El padrón es el catálogo de Identidad. Se elige una afiliación (o todas) y se ve la lista de
 * convocados, con una búsqueda para encontrar a alguien; la tabla y el resumen son del original
 * (barra de filtros, fila vacía dentro de la tabla y las dos cifras del padrón).
 *
 * @param props - El padrón, la afiliación, la búsqueda y quién avisa de los cambios.
 * @returns El filtro, la tabla y el resumen.
 */
export function ParticipantsStep({ people, affiliation, query, onQuery, onAffiliation, error }: ParticipantsStepProps) {
  const chosen = parseAffiliation(affiliation) ?? "all";
  const counts = countParticipants(people, chosen);
  const normalized = normalizeText(query.trim());
  const visible = eligibleVoters(people, chosen).filter((person) => normalized === "" || normalizeText(`${person.name} ${person.document}`).includes(normalized));

  return (
    <div className="elec-participants">
      <div className="av-toolbar">
        <div className="av-toolbar__group">
          <div className="av-toolbar__search">
            <SearchField value={query} onChange={onQuery} label="Buscar" placeholder="Nombre o documento" countText={`${visible.length} de ${counts.eligible} convocados`} />
          </div>
          <Field id="election-affiliation" label="Afiliación" className="av-toolbar__field">
            {(a) => (
              <Select {...a} value={affiliation} onChange={(event) => onAffiliation(event.target.value)}>
                <option value="all">Todas las afiliaciones</option>
                {AFFILIATIONS.map((option) => (
                  <option key={option} value={option}>
                    {AFFILIATION_LABEL[option]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      </div>

      <div className="av-tablewrap" tabIndex={0} role="region" aria-label="Participantes convocados (desplazable)">
        <Table>
          <thead>
            <tr>
              <th scope="col">Participante</th>
              <th scope="col">Afiliación</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr className="av-table__empty">
                <td colSpan={3}>No se encontraron participantes con ese criterio de búsqueda.</td>
              </tr>
            ) : (
              visible.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="av-who">
                      <PersonAvatar person={person} />
                      <div className="av-who__text">
                        <span className="av-who__name">{person.name}</span>
                        <span className="av-who__sub">Documento {person.document}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <AffiliationTag affiliation={person.affiliation} />
                  </td>
                  <td>
                    <StatusChip status={person.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <dl className="av-detail" aria-live="polite">
        <div>
          <dt>Participantes en el padrón</dt>
          <dd>
            <strong>{people.length}</strong>
          </dd>
        </div>
        <div>
          <dt>Coincidencias con el filtro actual</dt>
          <dd>
            <strong>{visible.length}</strong>
          </dd>
        </div>
      </dl>

      {error ? <Alert tone="error">{error}</Alert> : null}
    </div>
  );
}
