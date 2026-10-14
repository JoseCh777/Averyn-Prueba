import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { currentStep, gateReducer, initialGateState, type BiometricFactor } from "../../features/access/gate-flow";
import { DEMO_CHECKPOINTS } from "../../features/access/mock-access";
import type { AccessResult, Candidate, Checkpoint } from "../../features/access/types";

const [GATE, PREFERENTIAL, EXIT_GATE] = DEMO_CHECKPOINTS as [Checkpoint, Checkpoint, Checkpoint];
const FACE: BiometricFactor = { method: "FACE", capture: { simulate: "match" } };
const ANA: Candidate = { personId: "per-0001", displayName: "Ana Torres", detail: "Estudiante" };
const RESULT: AccessResult = { decision: "DENIED", denyReason: "NO_MATCH", accessLogId: 1041, occupancy: 2, personName: "Ana Torres" };

describe("gateReducer", () => {
  it("la puerta principal empieza pidiendo el QR para identificar", () => {
    assert.deepEqual(currentStep(initialGateState(GATE, "ENTRY")), { kind: "identify", methods: ["QR"] });
  });

  it("tras identificar con QR toca el rostro o la huella, 1:1 contra esa persona", () => {
    const state = gateReducer(initialGateState(GATE, "ENTRY"), {
      type: "identified",
      personId: ANA.personId,
      displayName: ANA.displayName,
      factor: { method: "QR", code: "AVY-ANA-7F3K" },
    });
    assert.deepEqual(currentStep(state), { kind: "factor", methods: ["FACE", "FINGERPRINT"], groupIndex: 1 });
  });

  it("la identificación 1:N espera la confirmación y la envía con operatorConfirmed", () => {
    let state = gateReducer(initialGateState(PREFERENTIAL, "ENTRY"), { type: "candidates", candidates: [ANA], factor: FACE });
    assert.equal(currentStep(state), undefined);

    state = gateReducer(state, { type: "confirmed", candidate: ANA });
    assert.deepEqual(state.identity, { personId: "per-0001", displayName: "Ana Torres" });
    assert.deepEqual(state.factors, [{ ...FACE, operatorConfirmed: true }]);
    assert.deepEqual(currentStep(state), { kind: "submit" });
  });

  it("una salida sin política pide elegir quién sale y luego envía", () => {
    const start = initialGateState(EXIT_GATE, "EXIT");
    assert.deepEqual(currentStep(start), { kind: "pick-inside" });
    assert.deepEqual(currentStep(gateReducer(start, { type: "picked", candidate: ANA })), { kind: "submit" });
  });

  it("con resultado ya no hay paso que pedir", () => {
    assert.equal(currentStep(gateReducer(initialGateState(GATE, "ENTRY"), { type: "result", data: RESULT })), undefined);
  });

  it("repetir la verificación conserva a la persona y el QR, y descarta la biometría y el resultado", () => {
    let state = initialGateState(GATE, "ENTRY");
    state = gateReducer(state, { type: "identified", personId: ANA.personId, displayName: ANA.displayName, factor: { method: "QR", code: "AVY-ANA-7F3K" } });
    state = gateReducer(state, { type: "factor", factor: FACE });
    state = gateReducer(state, { type: "result", data: RESULT });

    const retried = gateReducer(state, { type: "retry" });
    assert.equal(retried.outcome, undefined);
    assert.deepEqual(retried.factors, [{ method: "QR", code: "AVY-ANA-7F3K" }]);
    assert.equal(retried.identity?.personId, "per-0001");
  });

  it("empezar de nuevo no deja rastro de la persona anterior", () => {
    const used = gateReducer(initialGateState(GATE, "ENTRY"), { type: "identity-rejected", reason: "QR_INVALID" });
    const fresh = gateReducer(used, { type: "start", checkpoint: PREFERENTIAL, direction: "ENTRY" });
    assert.deepEqual(fresh, initialGateState(PREFERENTIAL, "ENTRY"));
  });

  it("nunca modifica el estado anterior", () => {
    const before = initialGateState(GATE, "ENTRY");
    gateReducer(before, { type: "factor", factor: FACE });
    assert.deepEqual(before.factors, []);
  });
});
