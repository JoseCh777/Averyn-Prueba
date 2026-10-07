import type { Person } from "./types";

/**
 * [MOCK] Personas de demostración (las mismas ocho del prototipo).
 * TODO(AVY-007): reemplazar por las personas del Core cuando exista el módulo de identidad.
 *
 * El correo y la fecha de nacimiento son opcionales (`Person.birthDate`/`email`); se siembran
 * aquí para que la ficha de detalle muestre datos reales de la demo.
 *
 * @returns Una copia nueva de la semilla, para que cada reinicio parta de los mismos datos.
 */
export function seedPeople(): Person[] {
  return [
    { id: "per-0001", name: "Ana Torres", document: "10234567", affiliation: "student", status: "verified", email: "ana.torres@averyn.test", birthDate: "1999-03-15" },
    { id: "per-0002", name: "Luis Pérez", document: "10345678", affiliation: "teacher", status: "pending", email: "luis.perez@averyn.test", birthDate: "2000-07-02" },
    { id: "per-0003", name: "María Gómez", document: "10456789", affiliation: "staff", status: "verified", email: "maria.gomez@averyn.test", birthDate: "1988-11-23" },
    { id: "per-0004", name: "Carlos Ruiz", document: "10567890", affiliation: "student", status: "pending", email: "carlos.ruiz@averyn.test", birthDate: "2001-01-30" },
    { id: "per-0005", name: "Laura Díaz", document: "10678901", affiliation: "visitor", status: "verified", email: "laura.diaz@averyn.test", birthDate: "1995-06-12" },
    { id: "per-0006", name: "Jorge Ramírez", document: "10789012", affiliation: "teacher", status: "verified", email: "jorge.ramirez@averyn.test", birthDate: "1985-09-05" },
    { id: "per-0007", name: "Paula Herrera", document: "10890123", affiliation: "student", status: "pending", email: "paula.herrera@averyn.test", birthDate: "2002-04-18" },
    { id: "per-0008", name: "Andrés Molina", document: "10901234", affiliation: "staff", status: "verified", email: "andres.molina@averyn.test", birthDate: "1990-12-09" },
  ];
}
