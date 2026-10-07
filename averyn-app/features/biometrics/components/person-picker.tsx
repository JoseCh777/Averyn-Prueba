"use client";

import { useState } from "react";

import { Table } from "@/components/ui/display";
import { EmptyState, Tag } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { SearchField } from "@/components/ui/inputs";
import { PersonAvatar } from "@/features/identity/components/person-avatar";
import { normalizeText } from "@/features/identity/person-rules";

import type { PickerPerson } from "../types";
import { ProfileChips } from "./profile-chips";

type PersonPickerProps = {
  people: readonly PickerPerson[];
  selectedId: string | undefined;
  onSelect: (personId: string) => void;
  /** Texto del campo de búsqueda, por ejemplo «Buscar persona». */
  searchLabel: string;
};

/**
 * Selector de persona: búsqueda por nombre o documento y una tabla con un botón de opción por fila.
 *
 * Cada fila es un `radio` (se puede elegir con el teclado y los lectores de pantalla lo anuncian) y
 * toda la fila es clicable. La búsqueda ignora tildes y mayúsculas.
 *
 * @param props - Las personas con su perfil, la elegida y quién avisa de la elección.
 * @returns El buscador y la tabla.
 */
export function PersonPicker({ people, selectedId, onSelect, searchLabel }: PersonPickerProps) {
  const [query, setQuery] = useState("");
  const normalized = normalizeText(query.trim());
  const visible = people.filter((person) => normalized === "" || normalizeText(`${person.name} ${person.document}`).includes(normalized));

  return (
    <div className="picker">
      <div className="picker__search">
        <SearchField
          value={query}
          onChange={setQuery}
          label={searchLabel}
          placeholder="Nombre o documento"
          countText={`${visible.length} ${visible.length === 1 ? "persona" : "personas"}`}
        />
      </div>
      {visible.length === 0 ? (
        <EmptyState icon="person-x" title="No se encontraron personas">
          Prueba con otro nombre o documento.
        </EmptyState>
      ) : (
        <div className="av-tablewrap" tabIndex={0} role="region" aria-label="Personas (desplazable)">
          <Table>
            <thead>
              <tr>
                <th scope="col">Persona</th>
                <th scope="col">Afiliación</th>
                <th scope="col">Biometría registrada</th>
                <th scope="col" className="av-table__actions">
                  Seleccionar
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((person) => {
                const selected = person.id === selectedId;
                return (
                  <tr key={person.id} className={selected ? "is-active" : undefined} onClick={() => onSelect(person.id)}>
                    <td>
                      <div className="av-who">
                        <PersonAvatar person={person} />
                        <div className="av-who__text">
                          <span className="av-who__name">{person.name}</span>
                          <span className="av-who__sub">Cédula {person.document}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Tag>
                        <Icon name={person.affiliationIcon} /> {person.affiliation}
                      </Tag>
                    </td>
                    <td>
                      <ProfileChips profile={person.profile} />
                    </td>
                    <td className="av-table__actions picker__radio">
                      <input
                        type="radio"
                        name="picker-person"
                        checked={selected}
                        aria-label={`Elegir a ${person.name}`}
                        onChange={() => onSelect(person.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
