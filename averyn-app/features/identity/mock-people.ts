import type { Person } from "./types";

/**
 * [MOCK] Personas de demostración (las mismas ocho del prototipo).
 * TODO(AVY-007): reemplazar por las personas del Core cuando exista el módulo de identidad.
 *
 * @returns Una copia nueva de la semilla, para que cada reinicio parta de los mismos datos.
 */
export function seedPeople(): Person[] {
  return [
    { id: "per-0001", name: "Ana Torres", document: "10234567", affiliation: "student", status: "verified" },
    { id: "per-0002", name: "Luis Pérez", document: "10345678", affiliation: "teacher", status: "pending" },
    { id: "per-0003", name: "María Gómez", document: "10456789", affiliation: "staff", status: "verified" },
    { id: "per-0004", name: "Carlos Ruiz", document: "10567890", affiliation: "student", status: "pending" },
    { id: "per-0005", name: "Laura Díaz", document: "10678901", affiliation: "visitor", status: "verified" },
    { id: "per-0006", name: "Jorge Ramírez", document: "10789012", affiliation: "teacher", status: "verified" },
    { id: "per-0007", name: "Paula Herrera", document: "10890123", affiliation: "student", status: "pending" },
    { id: "per-0008", name: "Andrés Molina", document: "10901234", affiliation: "staff", status: "verified" },
  ];
}
