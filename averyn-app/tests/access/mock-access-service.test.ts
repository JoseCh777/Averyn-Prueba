import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { InvalidAccessRequestError } from "../../features/access/services/access-service";
import { MockAccessService } from "../../features/access/services/mock-access-service";
import type { AccessFactor } from "../../features/access/types";

const GATE = "chk-0001";
const PREFERENTIAL = "chk-0002";
const EXIT_GATE = "chk-0003";

const qr = (code: string): AccessFactor => ({ method: "QR", code });
const face = (simulate: "match" | "no_match" | "liveness_failed" | "unavailable" = "match", presenter?: string): AccessFactor => ({
  method: "FACE",
  capture: { simulate, ...(presenter === undefined ? {} : { presenter }) },
});
const fingerprint: AccessFactor = { method: "FINGERPRINT", capture: { simulate: "match" } };

describe("MockAccessService", () => {
  let service: MockAccessService;

  beforeEach(() => {
    globalThis.averynMockAccess = undefined;
    service = new MockAccessService();
  });

  it("arranca con el aforo del escenario de demostración", async () => {
    assert.deepEqual(await service.getOccupancy("evt-0001"), { capacity: 5, inside: 2, entries: 3, exits: 1 });
  });

  it("QR y rostro correctos conceden la entrada, suben el aforo y consumen el QR", async () => {
    const result = await service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-ANA-7F3K"), face()] });
    assert.equal(result.decision, "GRANTED");
    assert.equal(result.occupancy, 3);

    const again = await service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-ANA-7F3K"), face()] });
    assert.equal(again.denyReason, "ALREADY_INSIDE");
  });

  it("un QR consumido se deniega aunque la persona ya haya salido", async () => {
    const result = await service.requestAccess({ checkpointId: GATE, personId: "per-0005", direction: "ENTRY", factors: [qr("AVY-LAURA-9B2X"), face()] });
    assert.equal(result.denyReason, "QR_USED");
  });

  it("denegar no cambia el aforo ni consume el QR", async () => {
    const before = await service.getOccupancy("evt-0001");
    await service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-ANA-7F3K"), face("no_match")] });
    assert.deepEqual(await service.getOccupancy("evt-0001"), before);
    const retry = await service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-ANA-7F3K"), face()] });
    assert.equal(retry.decision, "GRANTED");
  });

  it("traduce cada desenlace biométrico a su motivo", async () => {
    const reasons = [];
    for (const outcome of ["no_match", "liveness_failed", "unavailable"] as const) {
      const result = await service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-ANA-7F3K"), face(outcome)] });
      reasons.push(result.denyReason);
    }
    assert.deepEqual(reasons, ["NO_MATCH", "LIVENESS_FAILED", "VERIFICATION_ERROR"]);
  });

  it("otra persona frente al lector no coincide", async () => {
    const result = await service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-ANA-7F3K"), face("match", "per-0002")] });
    assert.equal(result.denyReason, "NO_MATCH");
  });

  it("sin el método registrado, se deniega por falta de registro", async () => {
    const noFingerprint = await service.requestAccess({ checkpointId: GATE, personId: "per-0002", direction: "ENTRY", factors: [qr("AVY-LUIS-2M9Q"), fingerprint] });
    assert.equal(noFingerprint.denyReason, "ENROLLMENT_MISSING");
  });

  it("el QR de otra persona no cumple el grupo", async () => {
    const result = await service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-LUIS-2M9Q"), face()] });
    assert.equal(result.denyReason, "IDENTITY_MISMATCH");
  });

  it("una persona revocada no pasa", async () => {
    const result = await service.requestAccess({ checkpointId: PREFERENTIAL, personId: "per-0008", direction: "ENTRY", factors: [face()] });
    assert.equal(result.denyReason, "NOT_ADMITTED");
  });

  it("el aforo completo deniega la siguiente entrada", async () => {
    for (const personId of ["per-0001", "per-0002", "per-0004"]) {
      const granted = await service.requestAccess({ checkpointId: PREFERENTIAL, personId, direction: "ENTRY", factors: [face()] });
      assert.equal(granted.decision, "GRANTED", personId);
    }
    const full = await service.requestAccess({ checkpointId: PREFERENTIAL, personId: "per-0005", direction: "ENTRY", factors: [face()] });
    assert.equal(full.denyReason, "CAPACITY_FULL");
  });

  it("la salida sin política baja el aforo y exige estar dentro", async () => {
    const left = await service.requestAccess({ checkpointId: EXIT_GATE, personId: "per-0003", direction: "EXIT", factors: [] });
    assert.equal(left.decision, "GRANTED");
    assert.equal(left.occupancy, 1);
    const twice = await service.requestAccess({ checkpointId: EXIT_GATE, personId: "per-0003", direction: "EXIT", factors: [] });
    assert.equal(twice.denyReason, "NOT_INSIDE");
  });

  it("lista a quienes están dentro", async () => {
    assert.deepEqual((await service.listInside("evt-0001")).map((person) => person.personId), ["per-0003", "per-0006"]);
  });

  describe("identify", () => {
    it("un QR válido identifica a la persona", async () => {
      const result = await service.identify(GATE, qr("AVY-ANA-7F3K"));
      assert.equal(result.identified, true);
      assert.equal(result.personId, "per-0001");
    });

    it("un QR inválido o vencido es un resultado de negocio con su motivo y queda en el registro", async () => {
      assert.equal((await service.identify(GATE, qr("AVY-NO-EXISTE"))).reason, "QR_INVALID");
      assert.equal((await service.identify(GATE, qr("AVY-CARLOS-4H6W"))).reason, "QR_EXPIRED");
      const log = await service.listRecent("evt-0001", 10);
      assert.deepEqual(log.map((entry) => entry.denyReason), ["QR_EXPIRED", "QR_INVALID"]);
    });

    it("la identificación facial 1:N propone candidatos y pide confirmación, con quien se presenta primero", async () => {
      const result = await service.identify(PREFERENTIAL, face("match", "per-0004"));
      assert.equal(result.requiresOperatorConfirmation, true);
      assert.equal(result.identified, false);
      assert.equal(result.candidates[0]?.personId, "per-0004");
      assert.ok(result.candidates.length <= 3);
    });

    it("un fallo biométrico no propone candidatos", async () => {
      const result = await service.identify(PREFERENTIAL, face("liveness_failed"));
      assert.deepEqual(result.candidates, []);
      assert.equal(result.reason, "LIVENESS_FAILED");
    });
  });

  describe("peticiones inválidas", () => {
    it("un punto de control inexistente no se evalúa", async () => {
      await assert.rejects(service.requestAccess({ checkpointId: "nada", personId: "per-0001", direction: "ENTRY", factors: [] }), InvalidAccessRequestError);
    });

    it("la política sin cubrir no se evalúa", async () => {
      await assert.rejects(service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-ANA-7F3K")] }), InvalidAccessRequestError);
    });

    it("un sentido que el punto no atiende no se evalúa", async () => {
      await assert.rejects(service.requestAccess({ checkpointId: EXIT_GATE, personId: "per-0003", direction: "ENTRY", factors: [] }), InvalidAccessRequestError);
    });
  });

  it("el registro nunca guarda el valor del QR", async () => {
    await service.requestAccess({ checkpointId: GATE, personId: "per-0001", direction: "ENTRY", factors: [qr("AVY-ANA-7F3K"), face()] });
    assert.doesNotMatch(JSON.stringify(await service.listRecent("evt-0001", 10)), /AVY-ANA/);
  });
});
