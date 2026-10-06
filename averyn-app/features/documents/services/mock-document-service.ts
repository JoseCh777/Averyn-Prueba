import { seedDocuments } from "../mock-documents";
import { mockReadDocument } from "../mock-ocr";
import type { DocumentRecord, OcrField, OcrReadResult, OcrValues } from "../types";
import type { DocumentInput, DocumentService } from "./document-service";

/** Documentos del mock, el último número de id entregado y cuántas lecturas se hicieron. */
interface DocumentStore {
  documents: DocumentRecord[];
  lastNumber: number;
  readings: number;
}

declare global {
  /** Almacén del mock en `globalThis`: Next.js puede cargar este módulo varias veces y todas deben ver lo mismo. */
  var averynMockDocuments: DocumentStore | undefined;
}

function store(): DocumentStore {
  if (globalThis.averynMockDocuments === undefined) {
    const documents = seedDocuments();
    globalThis.averynMockDocuments = { documents, lastNumber: documents.length, readings: 0 };
  }
  return globalThis.averynMockDocuments;
}

function copyOf(document: DocumentRecord): DocumentRecord {
  return { ...document, fields: document.fields.map((field) => ({ ...field })) };
}

/**
 * [MOCK] Servicio de documentos en memoria del servidor: se pierde al reiniciarlo.
 * `latencyMs` simula lo que tarda el OCR; en las pruebas es 0.
 * TODO(AVY-008): reemplazar por un servicio que llame al Core.
 */
export class MockDocumentService implements DocumentService {
  constructor(private readonly latencyMs = 0) {}

  private async pause(): Promise<void> {
    if (this.latencyMs > 0) await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }

  private nextReading(fileName: string): OcrReadResult {
    const current = store();
    current.readings += 1;
    return mockReadDocument(fileName, current.readings - 1);
  }

  async list(): Promise<DocumentRecord[]> {
    return store().documents.map(copyOf);
  }

  async getById(id: string): Promise<DocumentRecord | undefined> {
    const document = store().documents.find((candidate) => candidate.id === id);
    return document === undefined ? undefined : copyOf(document);
  }

  async read(input: DocumentInput): Promise<OcrReadResult> {
    await this.pause();
    return this.nextReading(input.fileName);
  }

  async upload(input: DocumentInput): Promise<DocumentRecord> {
    await this.pause();
    const current = store();
    const reading = this.nextReading(input.fileName);
    current.lastNumber += 1;
    const document: DocumentRecord = {
      id: `doc-${String(current.lastNumber).padStart(4, "0")}`,
      kind: input.kind,
      fileName: input.fileName,
      uploadedAt: new Date().toISOString(),
      status: reading.ok ? "processed" : "failed",
      confirmed: false,
      fields: reading.ok ? reading.fields : [],
    };
    current.documents.push(document);
    return copyOf(document);
  }

  async confirm(id: string, values: OcrValues): Promise<DocumentRecord | undefined> {
    const document = store().documents.find((candidate) => candidate.id === id);
    if (document === undefined || document.status !== "processed") return undefined;
    document.fields = document.fields.map((field): OcrField => ({ ...field, value: values[field.key] }));
    document.confirmed = true;
    return copyOf(document);
  }
}
