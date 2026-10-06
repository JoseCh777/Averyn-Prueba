import type { ElectionService } from "./election-service";
import { MockElectionService } from "./mock-election-service";

/**
 * Servicio de procesos electorales que usa la aplicación: único lugar que elige la implementación.
 * TODO(AVY-010): cambiar `MockElectionService` por el servicio que llama al Core.
 */
export const electionService: ElectionService = new MockElectionService();

export { DuplicateElectionNameError } from "./election-service";
export type { ElectionService } from "./election-service";
