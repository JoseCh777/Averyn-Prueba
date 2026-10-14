/** Rutas del módulo de Identidad. */
export const IDENTITY_PATH = "/identity";
export const NEW_PERSON_PATH = `${IDENTITY_PATH}/new`;

/**
 * Dirección del detalle de una persona.
 *
 * @param personId - Id de la persona.
 * @returns Por ejemplo `/identity/per-0001`.
 */
export function identityPath(personId: string): string {
  return `${IDENTITY_PATH}/${encodeURIComponent(personId)}`;
}
