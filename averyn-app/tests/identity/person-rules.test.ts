import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { seedPeople } from "../../features/identity/mock-people";
import {
  AVATAR_TONES,
  avatarToneOf,
  filterPeople,
  initialsOf,
  normalizeText,
  parseAffiliation,
  parseStatusFilter,
  summarizePeople,
  validateNewPerson,
} from "../../features/identity/person-rules";

const people = seedPeople();

describe("normalizeText", () => {
  it("quita tildes y pasa a minúsculas", () => {
    assert.equal(normalizeText("María PÉREZ"), "maria perez");
  });
});

describe("filterPeople", () => {
  it("sin criterios devuelve a todas, en el mismo orden", () => {
    assert.deepEqual(filterPeople(people, { query: "", status: "all" }), people);
  });

  it("busca por nombre sin importar tildes ni mayúsculas", () => {
    const found = filterPeople(people, { query: "perez", status: "all" });
    assert.deepEqual(found.map((person) => person.name), ["Luis Pérez"]);
  });

  it("busca por documento, también por una parte", () => {
    assert.deepEqual(filterPeople(people, { query: "1090", status: "all" }).map((person) => person.name), ["Andrés Molina"]);
  });

  it("filtra por estado y lo combina con el texto", () => {
    assert.equal(filterPeople(people, { query: "", status: "pending" }).length, 3);
    assert.deepEqual(filterPeople(people, { query: "ana", status: "pending" }), []);
  });

  it("ignora espacios alrededor del texto", () => {
    assert.equal(filterPeople(people, { query: "  ana  ", status: "all" }).length, 1);
  });
});

describe("summarizePeople", () => {
  it("cuenta los estados y calcula la tasa", () => {
    assert.deepEqual(summarizePeople(people), { total: 8, verified: 5, pending: 3, verificationRate: 63 });
  });

  it("sin personas la tasa es 0, sin dividir entre cero", () => {
    assert.deepEqual(summarizePeople([]), { total: 0, verified: 0, pending: 0, verificationRate: 0 });
  });
});

describe("initialsOf y avatarToneOf", () => {
  it("toma la primera letra de las dos primeras palabras", () => {
    assert.equal(initialsOf("Ana Torres"), "AT");
    assert.equal(initialsOf("  jorge   ivan herrera "), "JI");
    assert.equal(initialsOf("Madonna"), "M");
    assert.equal(initialsOf(""), "");
  });

  it("el mismo id da siempre el mismo tono, y es uno de los seis", () => {
    for (const person of people) {
      assert.equal(avatarToneOf(person.id), avatarToneOf(person.id));
      assert.ok(AVATAR_TONES.includes(avatarToneOf(person.id)));
    }
  });
});

describe("parseAffiliation y parseStatusFilter", () => {
  it("acepta solo valores conocidos", () => {
    assert.equal(parseAffiliation("teacher"), "teacher");
    assert.equal(parseAffiliation("director"), undefined);
    assert.equal(parseAffiliation(undefined), undefined);
    assert.equal(parseStatusFilter("verified"), "verified");
    assert.equal(parseStatusFilter("cualquier cosa"), "all");
    assert.equal(parseStatusFilter(["verified"]), "all");
  });
});

describe("validateNewPerson", () => {
  const valid = { name: "  Ana   María  Ruiz ", document: " 10234599 ", affiliation: "student" };

  it("acepta datos válidos y los limpia", () => {
    assert.deepEqual(validateNewPerson(valid), {
      ok: true,
      input: { name: "Ana María Ruiz", document: "10234599", affiliation: "student" },
    });
  });

  it("pide cada campo vacío", () => {
    const result = validateNewPerson({ name: "", document: "", affiliation: "" });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.deepEqual(Object.keys(result.errors).sort(), ["affiliation", "document", "name"]);
    }
  });

  it("rechaza documentos con letras o de largo inválido", () => {
    for (const document of ["12ab5678", "12345", "1234567890123"]) {
      const result = validateNewPerson({ ...valid, document });
      assert.equal(result.ok, false, document);
    }
  });

  it("rechaza nombres con símbolos o demasiado cortos o largos", () => {
    for (const name of ["<script>", "A", "x".repeat(81), "1234"]) {
      assert.equal(validateNewPerson({ ...valid, name }).ok, false, name);
    }
  });

  it("acepta nombres con tildes, apóstrofos y guiones", () => {
    assert.equal(validateNewPerson({ ...valid, name: "Mary-Ann O'Neil Núñez" }).ok, true);
  });
});
