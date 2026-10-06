import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { VERIFICATION_THRESHOLD } from "../../features/biometrics/biometric-rules";
import { MockBiometricService } from "../../features/biometrics/services/mock-biometric-service";

/** Servicio con valores «aleatorios» fijos, en el orden en que se piden. */
function serviceWith(...randoms: number[]): MockBiometricService {
  const queue = [...randoms];
  return new MockBiometricService(() => queue.shift() ?? 0.5);
}

describe("MockBiometricService", () => {
  beforeEach(() => {
    globalThis.averynMockBiometrics = undefined;
  });

  it("empieza con los datos de demostración, con el historial del más reciente al más antiguo", async () => {
    const service = serviceWith();
    assert.equal((await service.listProfiles()).length, 8);
    assert.equal((await service.listDevices()).length, 5);
    const events = await service.listEvents();
    assert.equal(events.length, 6);
    assert.equal(events[0]?.id, "ev-0001");
  });

  describe("enroll", () => {
    it("registra el rostro de una persona sin biometría: crea el perfil y deja el evento", async () => {
      const service = serviceWith();
      const event = await service.enroll({ personId: "per-0003", method: "face", operator: "Usuario Demo" });
      assert.equal(event.result, "success");
      assert.equal(event.operation, "enrollment");
      assert.equal(event.deviceId, "CAM-001");
      assert.equal(event.id, "ev-0007");
      const profile = await service.getProfile("per-0003");
      assert.equal(profile?.face, true);
      assert.equal(profile?.fingerprint, false);
      assert.ok(profile?.registeredAt);
      assert.equal((await service.listEvents())[0]?.id, "ev-0007");
    });

    it("una persona que no tenía perfil lo recibe", async () => {
      const service = serviceWith();
      await service.enroll({ personId: "per-0099", method: "face", operator: "Usuario Demo" });
      assert.equal((await service.getProfile("per-0099"))?.face, true);
    });

    it("sin lector de huella conectado no cambia el perfil y el evento queda como «device»", async () => {
      const service = serviceWith();
      const event = await service.enroll({ personId: "per-0003", method: "fingerprint", operator: "Usuario Demo" });
      assert.equal(event.result, "device");
      assert.equal((await service.getProfile("per-0003"))?.fingerprint, false);
    });

    it("registrar otra modalidad conserva la que ya tenía", async () => {
      const service = serviceWith();
      await service.enroll({ personId: "per-0001", method: "face", operator: "Usuario Demo" });
      assert.equal((await service.getProfile("per-0001"))?.face, true);
      assert.equal((await service.getProfile("per-0001"))?.fingerprint, false);
    });
  });

  describe("verify", () => {
    it("un aleatorio bajo (0,2) es un éxito con similitud sobre el umbral", async () => {
      const event = await serviceWith(0.2, 0.5).verify({ personId: "per-0001", method: "face", operator: "Usuario Demo" });
      assert.equal(event.result, "success");
      assert.ok((event.score ?? 0) > VERIFICATION_THRESHOLD);
    });

    it("un aleatorio medio (0,7) es un rechazo con similitud bajo el umbral", async () => {
      const event = await serviceWith(0.7, 0.5).verify({ personId: "per-0001", method: "face", operator: "Usuario Demo" });
      assert.equal(event.result, "rejected");
      assert.ok((event.score ?? 100) < VERIFICATION_THRESHOLD);
    });

    it("un aleatorio alto (0,95) es un reintento sin similitud", async () => {
      const event = await serviceWith(0.95).verify({ personId: "per-0001", method: "face", operator: "Usuario Demo" });
      assert.equal(event.result, "retry");
      assert.equal(event.score, undefined);
    });

    it("sin dispositivo conectado el evento queda como «device»", async () => {
      const event = await serviceWith(0.2).verify({ personId: "per-0002", method: "fingerprint", operator: "Usuario Demo" });
      assert.equal(event.result, "device");
    });

    it("cada verificación queda en el historial y se puede leer por id", async () => {
      const service = serviceWith(0.2, 0.5);
      const event = await service.verify({ personId: "per-0001", method: "face", operator: "Usuario Demo" });
      assert.deepEqual(await service.getEvent(event.id), event);
      assert.equal(await service.getEvent("ev-9999"), undefined);
    });
  });

  it("devuelve copias: cambiarlas no altera el almacén", async () => {
    const service = serviceWith();
    const [first] = await service.listEvents();
    assert.ok(first);
    first.result = "device";
    assert.equal((await service.getEvent(first.id))?.result, "success");
  });
});
