"use client";

import { useState } from "react";

import { Table } from "@/components/ui/display";
import { Alert, EmptyState } from "@/components/ui/feedback";
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
  onAffiliation: (value: string) => void;
  /** Mensaje del servidor cuando no hay a quién convocar. */
  error?: string;
};

/**
 * Paso 3 del asistente: a quién se convoca.
 *
 * El padrón es el catálogo de Identidad. Se elige una afiliación (o todas) y se ve la lista de
 * convocados, con una búsqueda para encontrar a alguien. Solo las personas verificadas podrán votar:
 * el resumen lo dice y avisa si hay pendientes.
 *
 * @param props - El padrón, la afiliación elegida y quién avisa del cambio.
 * @returns El filtro, la tabla y el resumen.
 */
export function ParticipantsStep({ people, affiliation, onAffiliation, error }: ParticipantsStepProps) {
  const [query, setQuery] = useState("");
  const chosen = parseAffiliation(affiliation) ?? "all";
  const counts = countParticipants(people, chosen);
  const normalized = normalizeText(query.trim());
  const visible = eligibleVoters(people, chosen).filter((person) => normalized === "" || normalizeText(`${person.name} ${person.document}`).includes(normalized));
  const pending = counts.eligible - counts.verified;

  return (
    <div className="elec-participants">
      <div className="elec-participants__filters">
        <Field id="election-affiliation" label="Afiliación convocada" className="av-toolbar__field">
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
        <div className="av-toolbar__search">
          <SearchField value={query} onChange={setQuery} label="Buscar participantes" placeholder="Nombre o documento" countText={`${visible.length} de ${counts.eligible} convocados`} />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon="person-x" title="No se encontraron participantes">
          {counts.eligible === 0 ? "No hay personas con esa afiliación en el padrón." : "Prueba con otro nombre o documento."}
        </EmptyState>
      ) : (
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
              {visible.map((person) => (
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
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <dl className="av-detail" aria-live="polite">
        <div>
          <dt>Participantes en el padrón</dt>
          <dd>
            <strong>{people.length}</strong>
          </dd>
        </div>
        <div>
          <dt>Convocados</dt>
          <dd>
            <strong>{counts.eligible}</strong>
          </dd>
        </div>
        <div>
          <dt>Podrán votar (verificados)</dt>
          <dd>
            <strong>{counts.verified}</strong>
          </dd>
        </div>
      </dl>

      {pending > 0 ? (
        <Alert tone="warning" title={`${pending} ${pending === 1 ? "persona está pendiente" : "personas están pendientes"} de verificar`}>
          Solo las personas con identidad verificada podrán votar. Verifícalas en Biometría antes de abrir el proceso.
        </Alert>
      ) : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
    </div>
  );
}
