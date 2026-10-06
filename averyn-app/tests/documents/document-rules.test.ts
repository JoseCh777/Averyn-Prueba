import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  MAX_UPLOAD_BYTES,
  formatFileSize,
  fullNameOf,
  orderedFields,
  parseDocumentKind,
  parseOcrValues,
  parseUploadMetadata,
  summarizeDocuments,
  validatePreRegistration,
  validateUpload,
  valuesOf,
} from "../../features/documents/document-rules";
import { seedDocuments } from "../../features/documents/mock-documents";
import type { OcrField } from "../../features/documents/types";

const valid = { fileName: "cedula.jpg", sizeBytes: 340_000, mimeType: "image/jpeg", kind: "cc" };

describe("parseDocumentKind", () => {
  it("acepta solo los tipos conocidos", () => {
    assert.equal(parseDocumentKind("passport"), "passport");
    assert.equal(parseDocumentKind("licencia"), undefined);
    assert.equal(parseDocumentKind(undefined), undefined);
  });
});

describe("parseUploadMetadata", () => {
  it("acepta la forma esperada", () => {
    assert.deepEqual(parseUploadMetadata(valid), valid);
  });

  it("rechaza lo que no tiene la forma esperada", () => {
    for (const input of [null, undefined, "x", 5, {}, { ...valid, sizeBytes: "340" }, { ...valid, sizeBytes: Infinity }, { ...valid, fileName: 5 }, { ...valid, fileName: "a".repeat(256) }]) {
      assert.equal(parseUploadMetadata(input), undefined, JSON.stringify(input));
    }
  });
});

describe("validateUpload", () => {
  it("acepta un archivo válido", () => {
    assert.deepEqual(validateUpload(valid), { ok: true, kind: "cc" });
    assert.equal(validateUpload({ ...valid, fileName: "escaneo.PDF", mimeType: "application/pdf" }).ok, true);
  });

  it("pide el tipo de documento y el archivo", () => {
    assert.deepEqual(validateUpload({ ...valid, kind: "" }), { ok: false, error: "Elige el tipo de documento." });
    assert.deepEqual(validateUpload({ ...valid, fileName: "  " }), { ok: false, error: "Elige un archivo." });
  });

  it("rechaza formatos no permitidos, por extensión o por tipo MIME", () => {
    assert.equal(validateUpload({ ...valid, fileName: "datos.exe" }).ok, false);
    assert.equal(validateUpload({ ...valid, fileName: "cedula.jpg", mimeType: "application/x-msdownload" }).ok, false);
  });

  it("acepta un archivo sin tipo MIME si la extensión es válida (algunos navegadores no lo informan)", () => {
    assert.equal(validateUpload({ ...valid, mimeType: "" }).ok, true);
  });

  it("rechaza archivos vacíos y los que pasan de 10 MB, con el tamaño en el mensaje", () => {
    assert.equal(validateUpload({ ...valid, sizeBytes: 0 }).ok, false);
    assert.equal(validateUpload({ ...valid, sizeBytes: MAX_UPLOAD_BYTES }).ok, true);
    const tooBig = validateUpload({ ...valid, sizeBytes: MAX_UPLOAD_BYTES + 1 });
    assert.equal(tooBig.ok, false);
    if (!tooBig.ok) assert.match(tooBig.error, /10 MB/);
  });
});

describe("formatFileSize", () => {
  it("usa KB por debajo de 1 MB y MB con coma decimal por encima", () => {
    assert.equal(formatFileSize(340_000), "332 KB");
    assert.equal(formatFileSize(10), "1 KB");
    assert.equal(formatFileSize(2_621_440), "2,5 MB");
  });
});

describe("summarizeDocuments", () => {
  it("cuenta por estado los documentos de demostración", () => {
    assert.deepEqual(summarizeDocuments(seedDocuments()), { total: 4, processed: 2, processing: 1, failed: 1 });
  });

  it("sin documentos, todo en cero", () => {
    assert.deepEqual(summarizeDocuments([]), { total: 0, processed: 0, processing: 0, failed: 0 });
  });
});

describe("valuesOf, fullNameOf y orderedFields", () => {
  const [, , , luis] = seedDocuments();
  const fields: OcrField[] = luis?.fields ?? [];

  it("valuesOf devuelve un valor por campo", () => {
    assert.equal(valuesOf(fields).firstSurname, "Pérez");
    assert.equal(valuesOf([]).documentNumber, "", "los campos que faltan quedan vacíos");
  });

  it("fullNameOf junta nombres y apellidos sin huecos", () => {
    assert.equal(fullNameOf(valuesOf(fields)), "Luis Alberto Pérez Gómez");
    assert.equal(fullNameOf({ ...valuesOf(fields), middleName: "  ", secondSurname: "" }), "Luis Pérez");
  });

  it("orderedFields devuelve siempre los seis campos en orden", () => {
    const ordered = orderedFields(fields.slice(2));
    assert.deepEqual(ordered.map((field) => field.key), ["firstName", "middleName", "firstSurname", "secondSurname", "documentNumber", "birthDate"]);
    assert.equal(ordered[0]?.value, "");
    assert.equal(ordered[0]?.confidence, null);
  });
});

describe("parseOcrValues", () => {
  const complete = { firstName: "Ana", middleName: "", firstSurname: "Torres", secondSurname: "", documentNumber: "10234567", birthDate: "15/03/1999" };

  it("acepta un objeto con los seis campos como texto", () => {
    assert.deepEqual(parseOcrValues(complete), complete);
  });

  it("ignora campos de más y rechaza lo que no tiene la forma esperada", () => {
    assert.deepEqual(parseOcrValues({ ...complete, extra: "x" }), complete);
    for (const input of [null, undefined, "texto", 5, [], { ...complete, firstName: 5 }, { ...complete, firstName: "x".repeat(121) }, { firstName: "Ana" }]) {
      assert.equal(parseOcrValues(input), undefined, JSON.stringify(input));
    }
  });
});

describe("validatePreRegistration", () => {
  const today = new Date("2026-10-06T17:00:00.000Z");
  const input = {
    values: { firstName: "Ana", middleName: "", firstSurname: "Torres", secondSurname: "", documentNumber: "10234567", birthDate: "15/03/1999" },
    email: "",
    consent: true,
  };

  it("arma a la persona como visitante, con la fecha en aaaa-mm-dd y el correo solo si se escribió", () => {
    assert.deepEqual(validatePreRegistration(input, today), {
      ok: true,
      person: { name: "Ana Torres", document: "10234567", affiliation: "visitor", birthDate: "1999-03-15" },
    });
    const withEmail = validatePreRegistration({ ...input, email: " ana@institucion.edu " }, today);
    assert.ok(withEmail.ok);
    assert.equal(withEmail.person.email, "ana@institucion.edu");
  });

  it("exige el consentimiento", () => {
    const result = validatePreRegistration({ ...input, consent: false }, today);
    assert.ok(!result.ok);
    assert.ok(result.errors.consent);
  });

  it("pide el primer nombre y el primer apellido", () => {
    const result = validatePreRegistration({ ...input, values: { ...input.values, firstName: " ", firstSurname: "" } }, today);
    assert.ok(!result.ok);
    assert.ok(result.errors.firstName);
    assert.ok(result.errors.firstSurname);
  });

  it("valida el documento, la fecha de nacimiento y el correo", () => {
    const result = validatePreRegistration({ ...input, values: { ...input.values, documentNumber: "12ab", birthDate: "31/02/2000" }, email: "no-es-correo" }, today);
    assert.ok(!result.ok);
    assert.ok(result.errors.documentNumber);
    assert.ok(result.errors.birthDate);
    assert.ok(result.errors.email);
  });

  it("un nombre con símbolos se reporta en el primer nombre", () => {
    const result = validatePreRegistration({ ...input, values: { ...input.values, firstName: "A<n>a" } }, today);
    assert.ok(!result.ok);
    assert.ok(result.errors.firstName);
  });
});
