import Link from "next/link";

import { Table } from "@/components/ui/display";
import { Icon } from "@/components/ui/icon";

import type { Person } from "../types";
import { DeletePersonButton } from "./delete-person-button";
import { AffiliationTag, StatusChip } from "./person-badges";
import { PersonAvatar } from "./person-avatar";

/** Ruta de la ficha de una persona. */
export function personPath(personId: string): string {
  return `/identity/${personId}`;
}

/**
 * Tabla de personas: quién es, afiliación, estado y acciones (ver detalle y eliminar).
 *
 * Es un Server Component; solo el botón de eliminar corre en el navegador. La región se
 * puede enfocar con el teclado para desplazarla cuando la pantalla es angosta.
 *
 * @param props - Las personas a mostrar (ya filtradas).
 * @returns La tabla.
 */
export function PeopleTable({ people }: { people: readonly Person[] }) {
  return (
    <div className="av-tablewrap" tabIndex={0} role="region" aria-label="Personas registradas (desplazable)">
      <Table>
        <thead>
          <tr>
            <th scope="col">Persona</th>
            <th scope="col">Afiliación</th>
            <th scope="col">Estado</th>
            <th scope="col" className="av-table__actions">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id}>
              <td>
                <div className="av-who">
                  <PersonAvatar person={person} />
                  <div className="av-who__text">
                    <Link className="av-who__name" href={personPath(person.id)}>
                      {person.name}
                    </Link>
                    <span className="av-who__sub">Cédula {person.document}</span>
                  </div>
                </div>
              </td>
              <td>
                <AffiliationTag affiliation={person.affiliation} />
              </td>
              <td>
                <StatusChip status={person.status} />
              </td>
              <td className="av-table__actions">
                <span className="av-rowactions">
                  <Link className="av-iconbtn" href={personPath(person.id)} aria-label={`Ver detalle de ${person.name}`}>
                    <Icon name="eye" />
                  </Link>
                  <DeletePersonButton personId={person.id} personName={person.name} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
