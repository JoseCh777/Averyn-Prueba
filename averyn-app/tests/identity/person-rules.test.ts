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
  formatIsoDate,
  parseBirthDate,
  summarizePeople,
  validateEmail,
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

describe("validateEmail", () => {
  it("el correo es opcional", () => {
    assert.equal(validateEmail(""), undefined);
    assert.equal(validateEmail("   "), undefined);
  });

  it("acepta correos con forma válida y rechaza el resto", () => {
    assert.equal(validateEmail("ana@institucion.edu"), undefined);
    for (const email of ["ana", "ana@", "@x.com", "ana@x", "a b@x.com", `${"a".repeat(250)}@x.com`]) {
      assert.ok(validateEmail(email), email);
    }
  });
});

describe("parseBirthDate y formatIsoDate", () => {
  const today = "2026-10-06";

  it("convierte dd/mm/aaaa a aaaa-mm-dd", () => {
    assert.equal(parseBirthDate("15/03/1999", today), "1999-03-15");
    assert.equal(parseBirthDate(" 01/01/1900 ", today), "1900-01-01");
  });

  it("rechaza fechas que no existen, de otro formato, anteriores a 1900 o futuras", () => {
    for (const text of ["31/02/2000", "15-03-1999", "1999-03-15", "15/3/1999", "01/01/1899", "07/10/2026", ""]) {
      assert.equal(parseBirthDate(text, today), undefined, text);
    }
  });

  it("acepta el día de hoy", () => {
    assert.equal(parseBirthDate("06/10/2026", today), "2026-10-06");
  });

  it("formatIsoDate vuelve al formato de pantalla", () => {
    assert.equal(formatIsoDate("1999-03-15"), "15/03/1999");
  });
});
