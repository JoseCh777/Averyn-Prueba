import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { DuplicateElectionNameError } from "../../features/elections/services/election-service";
import { MockElectionService } from "../../features/elections/services/mock-election-service";
import type { NewElectionInput } from "../../features/elections/types";

const input: NewElectionInput = {
  name: "Consejo Estudiantil 2026",
  description: "Elección del consejo",
  institution: "university",
  kind: "council",
  startDate: "2026-10-10",
  endDate: "2026-10-12",
  settings: { votingType: "single", choicesPerVote: 1, mode: "online", anonymous: true, blankVote: false, showResults: true, allowVoteChange: false },
  participants: { affiliation: "all", eligible: 8, verified: 5 },
};

describe("MockElectionService", () => {
  let service: MockElectionService;

  beforeEach(() => {
    globalThis.averynMockElections = undefined;
    service = new MockElectionService();
  });

  it("empieza sin procesos", async () => {
    assert.deepEqual(await service.list(), []);
  });

  it("crea un proceso como borrador, con id y fecha de creación", async () => {
    const election = await service.create(input);
    assert.equal(election.id, "ele-0001");
    assert.equal(election.status, "draft");
    assert.ok(Date.parse(election.createdAt) > 0);
    assert.equal((await service.list()).length, 1);
  });

  it("no repite el nombre, sin distinguir mayúsculas ni tildes", async () => {
    await service.create(input);
    await assert.rejects(service.create({ ...input, name: " consejo estudiantil 2026 " }), DuplicateElectionNameError);
    assert.equal((await service.list()).length, 1);
  });

  it("entrega los procesos en el orden en que se crearon", async () => {
    await service.create(input);
    await service.create({ ...input, name: "Segundo proceso" });
    assert.deepEqual((await service.list()).map((election) => election.id), ["ele-0001", "ele-0002"]);
  });

  it("devuelve copias: cambiarlas no altera el almacén", async () => {
    const created = await service.create(input);
    created.settings.anonymous = false;
    created.name = "Cambiado";
    const [stored] = await service.list();
    assert.equal(stored?.settings.anonymous, true);
    assert.equal(stored?.name, "Consejo Estudiantil 2026");
  });
});
