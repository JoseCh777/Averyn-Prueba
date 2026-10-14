import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { directionsOf, nextStep, normalizeQrCode, parseAccessRequest, precheck, satisfiedGroups } from "../../features/access/access-rules";
import type { AccessFactor, PolicyGroup } from "../../features/access/types";

const POLICY: PolicyGroup[] = [["QR"], ["FACE", "FINGERPRINT"]];
const QR: AccessFactor = { method: "QR", code: "AVY-ANA-7F3K" };
const FACE: AccessFactor = { method: "FACE", capture: { simulate: "match" } };

describe("normalizeQrCode", () => {
  it("quita espacios y saltos de línea del lector y pasa a mayúsculas", () => {
    assert.equal(normalizeQrCode("  avy-ana-7f3k\r\n"), "AVY-ANA-7F3K");
  });

  it("limita el largo", () => {
    assert.equal(normalizeQrCode("A".repeat(500)).length, 64);
  });
});

describe("satisfiedGroups y nextStep", () => {
  it("sin factores, el primer grupo identifica", () => {
    assert.equal(satisfiedGroups(POLICY, []), 0);
    assert.deepEqual(nextStep(POLICY, [], false), { kind: "identify", methods: ["QR"] });
  });

  it("tras el QR, el grupo siguiente se verifica 1:1 contra la persona identificada", () => {
    assert.deepEqual(nextStep(POLICY, [QR], true), { kind: "factor", methods: ["FACE", "FINGERPRINT"], groupIndex: 1 });
  });

  it("con todos los grupos cumplidos toca enviar", () => {
    assert.deepEqual(nextStep(POLICY, [QR, FACE], true), { kind: "submit" });
  });

  it("un factor no cumple dos grupos", () => {
    assert.equal(satisfiedGroups([["FACE"], ["FACE"]], [FACE]), 1);
  });

  it("una salida sin política pide elegir quién sale y luego envía", () => {
    assert.deepEqual(nextStep([], [], false), { kind: "pick-inside" });
    assert.deepEqual(nextStep([], [], true), { kind: "submit" });
  });
});

describe("precheck", () => {
  const base = { eventStatus: "LIVE", attendee: { admitted: true, inside: false }, direction: "ENTRY", inside: 2, capacity: 5 } as const;

  it("deja continuar cuando todo está en orden", () => {
    assert.equal(precheck(base), undefined);
  });

  it("respeta el orden: evento, padrón, anti-passback, aforo", () => {
    assert.equal(precheck({ ...base, eventStatus: "CLOSED", attendee: undefined }), "EVENT_NOT_LIVE");
    assert.equal(precheck({ ...base, attendee: undefined }), "NOT_ADMITTED");
    assert.equal(precheck({ ...base, attendee: { admitted: false, inside: false } }), "NOT_ADMITTED");
    assert.equal(precheck({ ...base, attendee: { admitted: true, inside: true }, inside: 5 }), "ALREADY_INSIDE");
    assert.equal(precheck({ ...base, inside: 5 }), "CAPACITY_FULL");
  });

  it("una salida exige estar dentro y no mira el aforo", () => {
    assert.equal(precheck({ ...base, direction: "EXIT", inside: 5 }), "NOT_INSIDE");
    assert.equal(precheck({ ...base, direction: "EXIT", attendee: { admitted: true, inside: true }, inside: 5 }), undefined);
  });
});

describe("directionsOf", () => {
  it("un punto «BOTH» atiende los dos sentidos", () => {
    assert.deepEqual(directionsOf("BOTH"), ["ENTRY", "EXIT"]);
    assert.deepEqual(directionsOf("EXIT"), ["EXIT"]);
  });
});

describe("parseAccessRequest", () => {
  const valid = { checkpointId: "chk-0001", personId: "per-0001", direction: "ENTRY", factors: [{ method: "QR", code: " avy-ana-7f3k " }] };

  it("acepta una petición válida y normaliza el QR", () => {
    assert.deepEqual(parseAccessRequest(valid)?.factors, [{ method: "QR", code: "AVY-ANA-7F3K" }]);
  });

  it("rechaza lo que no tiene la forma esperada", () => {
    for (const bad of [null, "x", {}, { ...valid, direction: "SIDE" }, { ...valid, personId: "" }, { ...valid, factors: "QR" }]) {
      assert.equal(parseAccessRequest(bad), undefined);
    }
  });

  it("rechaza un factor desconocido, un QR vacío o una captura sin desenlace válido", () => {
    for (const factor of [{ method: "IRIS" }, { method: "QR", code: "   " }, { method: "FACE", capture: { simulate: "sí" } }, { method: "FACE" }]) {
      assert.equal(parseAccessRequest({ ...valid, factors: [factor] }), undefined);
    }
  });

  it("limita la cantidad de factores", () => {
    assert.equal(parseAccessRequest({ ...valid, factors: Array.from({ length: 5 }, () => valid.factors[0]) }), undefined);
  });
});
