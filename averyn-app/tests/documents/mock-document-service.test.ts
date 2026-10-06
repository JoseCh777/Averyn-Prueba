import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { mockReadDocument } from "../../features/documents/mock-ocr";
import { valuesOf } from "../../features/documents/document-rules";
import { MockDocumentService } from "../../features/documents/services/mock-document-service";

describe("mockReadDocument", () => {
  it("entrega una identidad distinta en cada lectura y vuelve a empezar al terminar la lista", () => {
    const numbers = [0, 1, 2, 5].map((sequence) => {
      const result = mockReadDocument("cedula.jpg", sequence);
      return result.ok ? valuesOf(result.fields).documentNumber : "";
    });
    assert.equal(new Set(numbers.slice(0, 3)).size, 3);
    assert.equal(numbers[3], numbers[0], "la sexta lectura repite la primera");
  });

  it("simula una imagen ilegible según el nombre del archivo", () => {
    for (const fileName of ["cedula-borrosa-error.jpg", "foto-con-reflejo.png", "BLUR.jpg"]) {
      assert.deepEqual(mockReadDocument(fileName, 0), { ok: false, reason: "unreadable" }, fileName);
    }
  });

  it("los campos vacíos no llevan confianza", () => {
    const result = mockReadDocument("cedula.jpg", 0);
    assert.ok(result.ok);
    const middle = result.fields.find((field) => field.key === "middleName");
    assert.equal(middle?.value, "");
    assert.equal(middle?.confidence, null);
  });
});

describe("MockDocumentService", () => {
  let service: MockDocumentService;

  beforeEach(() => {
    globalThis.averynMockDocuments = undefined;
    service = new MockDocumentService();
  });

  it("empieza con los cuatro documentos de demostración", async () => {
    assert.equal((await service.list()).length, 4);
  });

  it("sube un documento legible: queda procesado, sin confirmar y con el siguiente id", async () => {
    const document = await service.upload({ kind: "cc", fileName: "cedula.jpg" });
    assert.equal(document.id, "doc-0005");
    assert.equal(document.status, "processed");
    assert.equal(document.confirmed, false);
    assert.equal(document.fields.length, 6);
    assert.equal((await service.list()).length, 5);
  });

  it("sube un documento ilegible: queda con error y sin campos", async () => {
    const document = await service.upload({ kind: "institutional", fileName: "carnet-reflejo.jpg" });
    assert.equal(document.status, "failed");
    assert.deepEqual(document.fields, []);
  });

  it("leer sin guardar no agrega documentos", async () => {
    const result = await service.read({ kind: "cc", fileName: "cedula.jpg" });
    assert.ok(result.ok);
    assert.equal((await service.list()).length, 4);
  });

  it("confirma los valores revisados y marca el documento como confirmado", async () => {
    const original = await service.getById("doc-0004");
    assert.ok(original);
    const confirmed = await service.confirm("doc-0004", { ...valuesOf(original.fields), birthDate: "03/07/2000" });
    assert.equal(confirmed?.confirmed, true);
    assert.equal(valuesOf(confirmed?.fields ?? []).birthDate, "03/07/2000");
    assert.equal(confirmed?.fields.find((field) => field.key === "birthDate")?.confidence, 86.3, "conserva la confianza original");
  });

  it("no confirma documentos que no existen o que no están procesados", async () => {
    const values = valuesOf([]);
    assert.equal(await service.confirm("doc-9999", values), undefined);
    assert.equal(await service.confirm("doc-0003", values), undefined);
    assert.equal(await service.confirm("doc-0002", values), undefined);
  });

  it("devuelve copias: cambiarlas no altera el almacén", async () => {
    const [first] = await service.list();
    assert.ok(first);
    first.fields[0] = { key: "firstName", value: "Cambiado", confidence: 1 };
    assert.equal((await service.getById(first.id))?.fields[0]?.value, "Ana");
  });
});
