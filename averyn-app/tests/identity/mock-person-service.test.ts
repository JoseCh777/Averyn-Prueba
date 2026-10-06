import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { DuplicateDocumentError } from "../../features/identity/services/person-service";
import { MockPersonService } from "../../features/identity/services/mock-person-service";

describe("MockPersonService", () => {
  let service: MockPersonService;

  beforeEach(() => {
    globalThis.averynMockPeople = undefined;
    service = new MockPersonService();
  });

  it("empieza con las ocho personas de demostración", async () => {
    assert.equal((await service.list()).length, 8);
  });

  it("registra a una persona como pendiente, con el siguiente id", async () => {
    const person = await service.create({ name: "Rosa Vega", document: "11111111", affiliation: "visitor" });
    assert.equal(person.id, "per-0009");
    assert.equal(person.status, "pending");
    assert.equal((await service.list()).length, 9);
    assert.deepEqual(await service.getById("per-0009"), person);
  });

  it("no repite el documento", async () => {
    await assert.rejects(
      service.create({ name: "Otra Ana", document: "10234567", affiliation: "student" }),
      DuplicateDocumentError,
    );
    assert.equal((await service.list()).length, 8);
  });

  it("elimina a una persona y no repite su id", async () => {
    await service.remove("per-0008");
    assert.equal(await service.getById("per-0008"), undefined);
    const created = await service.create({ name: "Rosa Vega", document: "11111111", affiliation: "visitor" });
    assert.equal(created.id, "per-0009", "el id de la persona eliminada no se reutiliza");
  });

  it("eliminar a alguien que no existe no falla", async () => {
    await service.remove("per-9999");
    assert.equal((await service.list()).length, 8);
  });

  it("devuelve copias: cambiarlas no altera el almacén", async () => {
    const [first] = await service.list();
    if (first === undefined) throw new Error("falta la semilla");
    first.name = "Cambiado";
    assert.equal((await service.getById(first.id))?.name, "Ana Torres");
  });
});
