import { normalizeText } from "@/features/identity/person-rules";

import type { Election, NewElectionInput } from "../types";
import { DuplicateElectionNameError, type ElectionService } from "./election-service";

/** Procesos del mock y el último número de id entregado (nunca retrocede). */
interface ElectionStore {
  elections: Election[];
  lastNumber: number;
}

declare global {
  /** Almacén del mock en `globalThis`: Next.js puede cargar este módulo varias veces y todas deben ver lo mismo. */
  var averynMockElections: ElectionStore | undefined;
}

/** Almacén compartido; empieza vacío, como el prototipo (la pantalla muestra su estado vacío). */
function store(): ElectionStore {
  globalThis.averynMockElections ??= { elections: [], lastNumber: 0 };
  return globalThis.averynMockElections;
}

function copyOf(election: Election): Election {
  return { ...election, settings: { ...election.settings }, participants: { ...election.participants } };
}

/**
 * [MOCK] Servicio de procesos electorales en memoria del servidor: se pierde al reiniciarlo.
 * TODO(AVY-010): reemplazar por un servicio que llame al Core.
 */
export class MockElectionService implements ElectionService {
  async list(): Promise<Election[]> {
    return store().elections.map(copyOf);
  }

  async create(input: NewElectionInput): Promise<Election> {
    const current = store();
    const name = normalizeText(input.name.trim());
    if (current.elections.some((election) => normalizeText(election.name.trim()) === name)) {
      throw new DuplicateElectionNameError(input.name);
    }
    current.lastNumber += 1;
    const election: Election = {
      ...input,
      id: `ele-${String(current.lastNumber).padStart(4, "0")}`,
      status: "draft",
      createdAt: new Date().toISOString(),
      settings: { ...input.settings },
      participants: { ...input.participants },
    };
    current.elections.push(election);
    return copyOf(election);
  }
}
