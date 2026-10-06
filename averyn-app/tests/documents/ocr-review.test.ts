import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { valuesOf } from "../../features/documents/document-rules";
import { mockReadDocument } from "../../features/documents/mock-ocr";
import {
  OCR_REVIEW_THRESHOLD,
  countPendingReviews,
  describePendingReviews,
  formatConfidence,
  reviewStateOf,
} from "../../features/documents/ocr-review";
import type { OcrField, OcrFieldKey } from "../../features/documents/types";

const sure: OcrField = { key: "firstName", value: "Ana", confidence: 99 };
const unsure: OcrField = { key: "birthDate", value: "15/03/1999", confidence: 86.3 };

describe("reviewStateOf", () => {
  it("un campo con confianza alta no necesita revisión", () => {
    assert.equal(reviewStateOf(sure, "Ana", false), "confident");
  });

  it("el umbral es 90: justo en 90 ya es confiable", () => {
    assert.equal(reviewStateOf({ ...unsure, confidence: OCR_REVIEW_THRESHOLD }, unsure.value, false), "confident");
    assert.equal(reviewStateOf({ ...unsure, confidence: OCR_REVIEW_THRESHOLD - 0.1 }, unsure.value, false), "needs-review");
  });

  it("un campo de baja confianza pide revisión hasta que la persona lo ve", () => {
    assert.equal(reviewStateOf(unsure, unsure.value, false), "needs-review");
    assert.equal(reviewStateOf(unsure, unsure.value, true), "reviewed");
  });

  it("cambiar el valor lo marca como corregido, aunque la confianza sea alta", () => {
    assert.equal(reviewStateOf(unsure, "16/03/1999", false), "corrected");
    assert.equal(reviewStateOf(sure, "Anna", true), "corrected");
  });

  it("un campo vacío (sin confianza) no necesita revisión", () => {
    assert.equal(reviewStateOf({ key: "middleName", value: "", confidence: null }, "", false), "confident");
  });
});

describe("countPendingReviews", () => {
  const reading = mockReadDocument("cedula.jpg", 2); // tercera identidad: la fecha de nacimiento sale con 86,3 %
  const fields = reading.ok ? reading.fields : [];

  it("cuenta los campos de baja confianza sin ver", () => {
    assert.equal(countPendingReviews(fields, valuesOf(fields), new Set()), 1);
  });

  it("baja a cero al ver el campo o al corregirlo", () => {
    const seen = new Set<OcrFieldKey>(["birthDate"]);
    assert.equal(countPendingReviews(fields, valuesOf(fields), seen), 0);
    assert.equal(countPendingReviews(fields, { ...valuesOf(fields), birthDate: "14/03/1998 " }, new Set()), 0);
  });
});

describe("textos", () => {
  it("formatConfidence usa coma decimal", () => {
    assert.equal(formatConfidence(97.8), "97,8 %");
    assert.equal(formatConfidence(100), "100,0 %");
  });

  it("describePendingReviews concuerda en número", () => {
    assert.match(describePendingReviews(0), /Todo revisado/);
    assert.match(describePendingReviews(1), /1 campo con baja confianza/);
    assert.match(describePendingReviews(3), /3 campos con baja confianza/);
  });
});
