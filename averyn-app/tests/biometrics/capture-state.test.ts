import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CAPTURE_TOTAL_TICKS, captureFailure, captureHeading, captureMessage, progressAtTick, qualityRows } from "../../features/biometrics/capture-state";

const levels = (rows: ReturnType<typeof qualityRows>) => rows.map((row) => row.level);

describe("progressAtTick", () => {
  it("va de 0 a 100 en el total de ciclos y no pasa de ahí", () => {
    assert.equal(progressAtTick(0), 0);
    assert.equal(progressAtTick(CAPTURE_TOTAL_TICKS / 2), 50);
    assert.equal(progressAtTick(CAPTURE_TOTAL_TICKS), 100);
    assert.equal(progressAtTick(CAPTURE_TOTAL_TICKS + 5), 100);
  });

  it("es creciente", () => {
    for (let tick = 1; tick <= CAPTURE_TOTAL_TICKS; tick += 1) assert.ok(progressAtTick(tick) > progressAtTick(tick - 1));
  });
});

describe("qualityRows del rostro", () => {
  const base = { method: "face", mode: "enrollment" } as const;

  it("al registrar mide tres criterios y todo está sin medir antes de empezar", () => {
    const rows = qualityRows({ ...base, phase: "idle", progress: 0 });
    assert.deepEqual(rows.map((row) => row.label), ["Iluminación", "Encuadre", "Nitidez"]);
    assert.deepEqual(levels(rows), [0, 0, 0]);
  });

  it("al verificar suma la prueba de vida", () => {
    const rows = qualityRows({ ...base, mode: "verification", phase: "idle", progress: 0 });
    assert.equal(rows.at(-1)?.label, "Prueba de vida");
  });

  it("durante el análisis cada criterio pasa a bueno según el avance", () => {
    assert.deepEqual(levels(qualityRows({ ...base, mode: "verification", phase: "capturing", progress: 10 })), [2, 2, 2, 2]);
    assert.deepEqual(levels(qualityRows({ ...base, mode: "verification", phase: "capturing", progress: 40 })), [3, 3, 2, 2]);
    assert.deepEqual(levels(qualityRows({ ...base, mode: "verification", phase: "capturing", progress: 70 })), [3, 3, 3, 2]);
    assert.deepEqual(levels(qualityRows({ ...base, mode: "verification", phase: "capturing", progress: 90 })), [3, 3, 3, 3]);
  });

  it("al terminar todo está bien, y la prueba de vida dice «Superada»", () => {
    const rows = qualityRows({ ...base, mode: "verification", phase: "captured", progress: 100 });
    assert.deepEqual(levels(rows), [3, 3, 3, 3]);
    assert.equal(rows.at(-1)?.text, "Superada");
  });

  it("si falla, la iluminación es insuficiente y la prueba de vida queda sin validar", () => {
    const rows = qualityRows({ ...base, mode: "verification", phase: "failed", progress: 100 });
    assert.deepEqual(levels(rows), [1, 3, 3, 0]);
    assert.equal(rows[0]?.text, "Insuficiente");
  });
});

describe("qualityRows de la huella", () => {
  const base = { method: "fingerprint", mode: "verification" } as const;

  it("mide la lectura y la calidad, sin prueba de vida", () => {
    assert.deepEqual(qualityRows({ ...base, phase: "idle", progress: 0 }).map((row) => row.label), ["Lectura", "Calidad"]);
  });

  it("avanza, termina bien o falla", () => {
    assert.deepEqual(levels(qualityRows({ ...base, phase: "capturing", progress: 40 })), [3, 2]);
    assert.deepEqual(levels(qualityRows({ ...base, phase: "captured", progress: 100 })), [3, 3]);
    assert.deepEqual(levels(qualityRows({ ...base, phase: "failed", progress: 100 })), [1, 1]);
  });
});

describe("textos", () => {
  it("el mensaje cambia con la fase y la modalidad, y el error lo explica la alerta", () => {
    assert.match(captureMessage("idle", "face"), /Capturar rostro/);
    assert.match(captureMessage("idle", "fingerprint"), /Capturar huella/);
    assert.match(captureMessage("capturing", "fingerprint"), /dedo apoyado/);
    assert.equal(captureMessage("failed", "face"), "");
  });

  it("el aviso de error conserva el microcopy aprobado", () => {
    assert.equal(captureFailure("face").title, "Iluminación insuficiente");
    assert.equal(captureFailure("fingerprint").title, "Huella no legible");
  });

  it("el encabezado nombra la operación y lo que se captura", () => {
    assert.equal(captureHeading("enrollment", "face").title, "Registro biométrico");
    assert.match(captureHeading("verification", "fingerprint").description, /la huella/);
  });
});
