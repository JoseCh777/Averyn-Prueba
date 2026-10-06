import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CAPTURE_FAILURE_PROBABILITY,
  VERIFICATION_THRESHOLD,
  captureFails,
  connectedDeviceFor,
  eventResultOf,
  filterEvents,
  formatScore,
  methodAvailability,
  newestFirst,
  outcomeFromRandom,
  parseCaptureContext,
  parseHistoryFilter,
  parseMethod,
  parseMode,
  simulatedScore,
  summarizeBiometrics,
} from "../../features/biometrics/biometric-rules";
import { seedDevices, seedEvents, seedProfiles } from "../../features/biometrics/mock-biometrics";
import { resultChip } from "../../features/biometrics/labels";

const devices = seedDevices();
const events = seedEvents();

describe("parseMethod, parseMode y parseCaptureContext", () => {
  it("aceptan solo valores conocidos", () => {
    assert.equal(parseMethod("face"), "face");
    assert.equal(parseMethod("iris"), undefined);
    assert.equal(parseMode("verification"), "verification");
    assert.equal(parseMode("registro"), undefined);
  });

  it("el contexto necesita modo, persona y modalidad válidos", () => {
    assert.deepEqual(parseCaptureContext({ mode: "enrollment", person: "per-0001", method: "face" }), { mode: "enrollment", personId: "per-0001", method: "face" });
    for (const params of [{}, { mode: "enrollment", person: "per-0001" }, { mode: "x", person: "per-0001", method: "face" }, { mode: "enrollment", person: "", method: "face" }, { mode: "enrollment", person: ["a"], method: "face" }]) {
      assert.equal(parseCaptureContext(params), undefined, JSON.stringify(params));
    }
  });

  it("los filtros desconocidos equivalen a «todos»", () => {
    assert.deepEqual(parseHistoryFilter({ method: "fingerprint", result: "rejected" }), { method: "fingerprint", result: "rejected" });
    assert.deepEqual(parseHistoryFilter({ method: "x", result: ["success"] }), { method: "all", result: "all" });
  });
});

describe("filterEvents y newestFirst", () => {
  it("filtra por método y resultado y los combina", () => {
    assert.equal(filterEvents(events, { method: "all", result: "all" }).length, 6);
    assert.equal(filterEvents(events, { method: "fingerprint", result: "all" }).length, 2);
    assert.equal(filterEvents(events, { method: "all", result: "success" }).length, 3);
    assert.equal(filterEvents(events, { method: "face", result: "rejected" }).length, 0);
  });

  it("ordena del más reciente al más antiguo sin tocar el original", () => {
    const shuffled = [events[2], events[0], events[5], events[1], events[4], events[3]].filter((event) => event !== undefined);
    const sorted = newestFirst(shuffled);
    assert.deepEqual(sorted.map((event) => event.id), ["ev-0001", "ev-0002", "ev-0003", "ev-0004", "ev-0005", "ev-0006"]);
    assert.equal(shuffled[0]?.id, "ev-0003");
  });
});

describe("summarizeBiometrics", () => {
  it("cuenta los datos de demostración", () => {
    assert.deepEqual(summarizeBiometrics({ totalPeople: 8, profiles: seedProfiles(), events, devices }), {
      peopleWithBiometrics: 5,
      totalPeople: 8,
      verifications: 4,
      successful: 2,
      rejected: 1,
      successRate: 50,
      connectedDevices: 2,
      totalDevices: 5,
    });
  });

  it("sin verificaciones no hay tasa de éxito", () => {
    const summary = summarizeBiometrics({ totalPeople: 0, profiles: [], events: [], devices: [] });
    assert.equal(summary.successRate, null);
    assert.equal(summary.verifications, 0);
  });
});

describe("methodAvailability", () => {
  const luis = { face: false, fingerprint: true };
  const ana = { face: true, fingerprint: false };

  it("registrar el rostro solo pide un dispositivo conectado", () => {
    assert.deepEqual(methodAvailability({ mode: "enrollment", method: "face", profile: undefined, devices }), { available: true });
  });

  it("registrar la huella no se puede si no hay lector conectado", () => {
    assert.deepEqual(methodAvailability({ mode: "enrollment", method: "fingerprint", profile: undefined, devices }), { available: false, reason: "Dispositivo no conectado" });
  });

  it("verificar pide que la persona tenga la modalidad registrada", () => {
    assert.deepEqual(methodAvailability({ mode: "verification", method: "face", profile: ana, devices }), { available: true });
    assert.deepEqual(methodAvailability({ mode: "verification", method: "face", profile: luis, devices }), { available: false, reason: "No registrado para esta persona" });
    assert.deepEqual(methodAvailability({ mode: "verification", method: "face", profile: undefined, devices }), { available: false, reason: "No registrado para esta persona" });
  });

  it("verificar con una huella registrada pero sin lector conectado no se puede", () => {
    assert.deepEqual(methodAvailability({ mode: "verification", method: "fingerprint", profile: luis, devices }), { available: false, reason: "Dispositivo no conectado" });
  });

  it("connectedDeviceFor devuelve el primer dispositivo conectado de la modalidad", () => {
    assert.equal(connectedDeviceFor(devices, "face")?.id, "CAM-001");
    assert.equal(connectedDeviceFor(devices, "fingerprint"), undefined);
  });
});

describe("simulación del desenlace", () => {
  it("outcomeFromRandom reparte 60 / 25 / 15 %", () => {
    assert.equal(outcomeFromRandom(0), "success");
    assert.equal(outcomeFromRandom(0.599), "success");
    assert.equal(outcomeFromRandom(0.6), "failure");
    assert.equal(outcomeFromRandom(0.849), "failure");
    assert.equal(outcomeFromRandom(0.85), "retry");
    assert.equal(outcomeFromRandom(0.999), "retry");
  });

  it("eventResultOf traduce el fallo a «rechazado»", () => {
    assert.equal(eventResultOf("success"), "success");
    assert.equal(eventResultOf("failure"), "rejected");
    assert.equal(eventResultOf("retry"), "retry");
  });

  it("la similitud de un éxito supera el umbral y la de un fallo queda por debajo", () => {
    for (const random of [0, 0.5, 0.999]) {
      assert.ok((simulatedScore("success", random) ?? 0) > VERIFICATION_THRESHOLD, `éxito ${random}`);
      assert.ok((simulatedScore("failure", random) ?? 100) < VERIFICATION_THRESHOLD, `fallo ${random}`);
    }
    assert.equal(simulatedScore("retry", 0.5), undefined, "un reintento no llega a comparar");
  });

  it("captureFails falla solo por debajo de la probabilidad", () => {
    assert.equal(captureFails(CAPTURE_FAILURE_PROBABILITY - 0.01), true);
    assert.equal(captureFails(CAPTURE_FAILURE_PROBABILITY), false);
  });

  it("formatScore usa coma decimal", () => {
    assert.equal(formatScore(91), "0,91");
    assert.equal(formatScore(68), "0,68");
  });
});

describe("resultChip", () => {
  it("el éxito se llama «Registrado» o «Verificado» según la operación", () => {
    assert.equal(resultChip("success", "enrollment").label, "Registrado");
    assert.equal(resultChip("success", "verification").label, "Verificado");
    assert.equal(resultChip("rejected", "verification").tone, "error");
  });
});
