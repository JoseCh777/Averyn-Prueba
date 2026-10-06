import { seedPeople } from "../mock-people";
import type { NewPersonInput, Person } from "../types";
import { DuplicateDocumentError, type PersonService } from "./person-service";

/** Personas del mock y el último número de id entregado (nunca retrocede). */
interface PeopleStore {
  people: Person[];
  lastNumber: number;
}

declare global {
  /**
   * Almacén del mock. Vive en `globalThis` porque Next.js puede cargar este módulo más de
   * una vez (páginas, acciones de servidor y modo desarrollo) y todas deben ver la misma lista.
   */
  var averynMockPeople: PeopleStore | undefined;
}

const ID_PREFIX = "per-";

/** Almacén compartido; se siembra la primera vez que se pide. */
function store(): PeopleStore {
  if (globalThis.averynMockPeople === undefined) {
    const people = seedPeople();
    globalThis.averynMockPeople = { people, lastNumber: people.length };
  }
  return globalThis.averynMockPeople;
}

/** Id con cuatro cifras: `per-0009`. */
function formatId(number: number): string {
  return `${ID_PREFIX}${String(number).padStart(4, "0")}`;
}

/**
 * [MOCK] Servicio de personas en memoria del servidor: se pierde al reiniciarlo.
 * Un id eliminado no se vuelve a entregar, para que nada ajeno quede apuntando a otra persona.
 * TODO(AVY-007): reemplazar por un servicio que llame al Core.
 */
export class MockPersonService implements PersonService {
  async list(): Promise<Person[]> {
    return store().people.map((person) => ({ ...person }));
  }

  async getById(id: string): Promise<Person | undefined> {
    const person = store().people.find((candidate) => candidate.id === id);
    return person === undefined ? undefined : { ...person };
  }

  async findByDocument(document: string): Promise<Person | undefined> {
    const person = store().people.find((candidate) => candidate.document === document);
    return person === undefined ? undefined : { ...person };
  }

  async create(input: NewPersonInput): Promise<Person> {
    const current = store();
    if (current.people.some((person) => person.document === input.document)) {
      throw new DuplicateDocumentError(input.document);
    }
    current.lastNumber += 1;
    const person: Person = { id: formatId(current.lastNumber), ...input, status: "pending" };
    current.people.push(person);
    return { ...person };
  }

  async markVerified(id: string): Promise<void> {
    const person = store().people.find((candidate) => candidate.id === id);
    if (person !== undefined) person.status = "verified";
  }

  async remove(id: string): Promise<void> {
    const { people } = store();
    const index = people.findIndex((person) => person.id === id);
    if (index !== -1) people.splice(index, 1);
  }
}
