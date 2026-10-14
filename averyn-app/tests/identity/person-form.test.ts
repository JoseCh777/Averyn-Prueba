import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EMPTY_PERSON_FORM,
  firstInvalidField,
  fullNameOf,
  normalizeDocument,
  normalizeName,
  parsePersonFormFields,
  sectionStatus,
  toNewPersonInput,
  validatePersonField,
  validatePersonForm,
  type PersonFormFields,
} from "../../features/identity/person-form";

const TODAY = "2026-10-13";
const VALID: PersonFormFields = {
  ...EMPTY_PERSON_FORM,
  firstName: "María",
  middleName: "José",
  lastName: "Núñez",
  secondLastName: "de la Cruz",
  birthDate: "1999-03-15",
  document: "10.234.567",
  affiliation: "teacher",
  email: "maria@averyn.test",
};

describe("normalizeName y normalizeDocument", () => {
  it("quita los espacios sobrantes de un nombre, incluidos tabuladores y saltos de línea", () => {
    assert.equal(normalizeName("  Ana \t\n  María "), "Ana María");
  });

  it("quita espacios, puntos y guiones del documento y conserva los ceros a la izquierda", () => {
    assert.equal(normalizeDocument(" 0010.234-567 "), "0010234567");
  });
});

describe("fullNameOf", () => {
  it("arma el nombre en orden, sin huecos si falta una parte", () => {
    assert.equal(fullNameOf(VALID), "María José Núñez de la Cruz");
    assert.equal(fullNameOf({ ...VALID, middleName: "", secondLastName: "" }), "María Núñez");
    assert.equal(fullNameOf(EMPTY_PERSON_FORM), "");
  });
});

describe("validatePersonForm", () => {
  it("acepta un formulario completo", () => {
    assert.deepEqual(validatePersonForm(VALID, TODAY), {});
  });

  it("solo exige primer nombre, primer apellido, documento y afiliación", () => {
    const minimal: PersonFormFields = { ...EMPTY_PERSON_FORM, firstName: "Ana", lastName: "Torres", document: "10234567" };
    assert.deepEqual(validatePersonForm(minimal, TODAY), {});
    assert.deepEqual(Object.keys(validatePersonForm(EMPTY_PERSON_FORM, TODAY)), ["firstName", "lastName", "document"]);
  });

  it("rechaza nombres de más de 80 caracteres y caracteres de control", () => {
    assert.match(validatePersonField("firstName", { ...VALID, firstName: "A".repeat(81) }, TODAY) ?? "", /80/);
    assert.ok(validatePersonField("lastName", { ...VALID, lastName: "Pérez\u0007" }, TODAY));
  });

  it("cuenta caracteres Unicode, no unidades UTF-16", () => {
    assert.equal(validatePersonField("firstName", { ...VALID, firstName: "😀".repeat(80) }, TODAY), undefined);
  });

  it("valida la fecha: que exista, no antes de 1900 y no futura", () => {
    const at = (birthDate: string) => validatePersonField("birthDate", { ...VALID, birthDate }, TODAY);
    assert.equal(at(""), undefined);
    assert.equal(at("2026-10-13"), undefined);
    assert.ok(at("2026-02-30"));
    assert.ok(at("1899-12-31"));
    assert.ok(at("2026-10-14"));
  });

  it("valida el documento ya sin separadores: solo dígitos y entre 6 y 12", () => {
    const at = (document: string) => validatePersonField("document", { ...VALID, document }, TODAY);
    assert.equal(at("10.234.567"), undefined);
    assert.ok(at("12345"));
    assert.ok(at("1234567890123"));
    assert.ok(at("ABC12345"));
  });

  it("valida el correo opcional y la afiliación", () => {
    assert.equal(validatePersonField("email", { ...VALID, email: "" }, TODAY), undefined);
    assert.ok(validatePersonField("email", { ...VALID, email: "sin-arroba" }, TODAY));
    assert.ok(validatePersonField("affiliation", { ...VALID, affiliation: "alumno" }, TODAY));
  });
});

describe("firstInvalidField", () => {
  it("devuelve el primer campo con error según el orden del formulario", () => {
    assert.equal(firstInvalidField({ document: "x", lastName: "y" }), "lastName");
    assert.equal(firstInvalidField({}), undefined);
  });
});

describe("toNewPersonInput", () => {
  it("normaliza los textos y descarta los opcionales vacíos", () => {
    const input = toNewPersonInput({ ...EMPTY_PERSON_FORM, firstName: " Ana ", lastName: "Torres", document: "10 234 567" });
    assert.deepEqual(input, { name: "Ana Torres", firstName: "Ana", lastName: "Torres", document: "10234567", affiliation: "student" });
    assert.equal("middleName" in input, false);
    assert.equal("email" in input, false);
  });

  it("incluye los opcionales escritos", () => {
    const input = toNewPersonInput(VALID);
    assert.equal(input.name, "María José Núñez de la Cruz");
    assert.equal(input.middleName, "José");
    assert.equal(input.birthDate, "1999-03-15");
    assert.equal(input.document, "10234567");
  });
});

describe("parsePersonFormFields", () => {
  it("lee solo textos; lo que no es texto queda vacío", () => {
    const parsed = parsePersonFormFields({ firstName: "Ana", lastName: 5, document: null, extra: "x" });
    assert.equal(parsed.firstName, "Ana");
    assert.equal(parsed.lastName, "");
    assert.equal(parsed.document, "");
    assert.equal("extra" in parsed, false);
  });

  it("tolera valores que no son un objeto", () => {
    assert.deepEqual(parsePersonFormFields(null), parsePersonFormFields(undefined));
    assert.equal(parsePersonFormFields("hola").firstName, "");
  });

  it("recorta los textos gigantes", () => {
    assert.equal(parsePersonFormFields({ firstName: "A".repeat(5000) }).firstName.length, 200);
  });
});

describe("sectionStatus", () => {
  it("cuenta los obligatorios que faltan en cada sección", () => {
    assert.deepEqual(sectionStatus("personal", EMPTY_PERSON_FORM, {}), { missing: 2, hasErrors: false, complete: false });
    assert.equal(sectionStatus("personal", { ...EMPTY_PERSON_FORM, firstName: "Ana" }, {}).missing, 1);
    assert.equal(sectionStatus("identification", EMPTY_PERSON_FORM, {}).missing, 1);
  });

  it("la pertenencia ya viene completa porque la afiliación tiene valor por defecto", () => {
    assert.equal(sectionStatus("membership", EMPTY_PERSON_FORM, {}).complete, true);
  });

  it("una sección con un error visible no está completa aunque no le falte nada", () => {
    const status = sectionStatus("personal", VALID, { birthDate: "Escriba una fecha válida." });
    assert.deepEqual(status, { missing: 0, hasErrors: true, complete: false });
  });

  it("los espacios solos no cuentan como escrito", () => {
    assert.equal(sectionStatus("personal", { ...EMPTY_PERSON_FORM, firstName: "   ", lastName: "Torres" }, {}).missing, 1);
  });
});
