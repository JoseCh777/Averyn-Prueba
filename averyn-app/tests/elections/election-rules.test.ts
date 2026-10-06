import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { countParticipants, electionInitials, eligibleVoters, formatDateRange, isIsoDate, parseElectionPayload, validateGeneralInfo, validateSettings } from "../../features/elections/election-rules";
import { seedPeople } from "../../features/identity/mock-people";

const context = { existingNames: ["Consejo Estudiantil 2026"], today: "2026-10-06" };
const valid = { name: "  Elección de   representantes ", description: "Representantes ante el consejo", institution: "university", kind: "representatives", startDate: "2026-10-10", endDate: "2026-10-12" };

describe("isIsoDate", () => {
  it("acepta fechas que existen y rechaza el resto", () => {
    assert.equal(isIsoDate("2026-10-06"), true);
    assert.equal(isIsoDate("2028-02-29"), true);
    for (const text of ["2026-02-30", "2027-02-29", "06/10/2026", "2026-1-6", "", "hoy"]) assert.equal(isIsoDate(text), false, text);
  });
});

describe("validateGeneralInfo", () => {
  it("acepta datos válidos y limpia el nombre", () => {
    const result = validateGeneralInfo(valid, context);
    assert.ok(result.ok);
    assert.equal(result.value.name, "Elección de representantes");
    assert.equal(result.value.institution, "university");
  });

  it("pide todos los campos", () => {
    const result = validateGeneralInfo({ name: "", description: "", institution: "", kind: "", startDate: "", endDate: "" }, context);
    assert.ok(!result.ok);
    assert.deepEqual(Object.keys(result.errors).sort(), ["description", "endDate", "institution", "kind", "name", "startDate"]);
  });

  it("no repite un nombre, sin distinguir mayúsculas ni tildes", () => {
    for (const name of ["Consejo Estudiantil 2026", "consejo estudiantil 2026", "  CONSEJO   Estudiantil 2026 "]) {
      const result = validateGeneralInfo({ ...valid, name }, context);
      assert.ok(!result.ok, name);
      assert.equal(result.errors.name, "Ya existe un proceso electoral con este nombre.");
    }
  });

  it("la fecha de inicio no puede ser anterior a hoy, pero hoy sí vale", () => {
    const past = validateGeneralInfo({ ...valid, startDate: "2026-10-05", endDate: "2026-10-12" }, context);
    assert.ok(!past.ok);
    assert.match(past.errors.startDate ?? "", /anterior a hoy/);
    assert.ok(validateGeneralInfo({ ...valid, startDate: "2026-10-06" }, context).ok);
  });

  it("la fecha de fin no puede ser anterior a la de inicio, pero el mismo día vale", () => {
    const before = validateGeneralInfo({ ...valid, endDate: "2026-10-09" }, context);
    assert.ok(!before.ok);
    assert.match(before.errors.endDate ?? "", /anterior a la de inicio/);
    assert.ok(validateGeneralInfo({ ...valid, endDate: "2026-10-10" }, context).ok);
  });

  it("rechaza fechas que no existen y valores desconocidos de institución o tipo", () => {
    const result = validateGeneralInfo({ ...valid, startDate: "2026-02-30", institution: "ministerio", kind: "otro" }, context);
    assert.ok(!result.ok);
    assert.ok(result.errors.startDate && result.errors.institution && result.errors.kind);
  });
});

describe("validateSettings", () => {
  const settings = { votingType: "cumulative", choicesPerVote: "3", mode: "online", anonymous: true, blankVote: false, showResults: true, allowVoteChange: false };

  it("acepta una configuración válida", () => {
    assert.deepEqual(validateSettings(settings), { ok: true, value: { votingType: "cumulative", choicesPerVote: 3, mode: "online", anonymous: true, blankVote: false, showResults: true, allowVoteChange: false } });
  });

  it("en voto único las opciones por voto son siempre 1", () => {
    const result = validateSettings({ ...settings, votingType: "single", choicesPerVote: "4" });
    assert.ok(result.ok);
    assert.equal(result.value.choicesPerVote, 1);
  });

  it("pide el tipo de votación y la modalidad, y limita las opciones a 1–5", () => {
    const empty = validateSettings({ ...settings, votingType: "", mode: "" });
    assert.ok(!empty.ok);
    assert.ok(empty.errors.votingType && empty.errors.mode);
    for (const choices of ["0", "6", "2.5", "x", ""]) assert.ok(!validateSettings({ ...settings, choicesPerVote: choices }).ok, choices);
  });
});

describe("padrón", () => {
  const people = seedPeople();

  it("convoca a todas o a una afiliación", () => {
    assert.equal(eligibleVoters(people, "all").length, 8);
    assert.deepEqual(eligibleVoters(people, "teacher").map((person) => person.name), ["Luis Pérez", "Jorge Ramírez"]);
  });

  it("cuenta convocados y verificados", () => {
    assert.deepEqual(countParticipants(people, "all"), { affiliation: "all", eligible: 8, verified: 5 });
    assert.deepEqual(countParticipants(people, "student"), { affiliation: "student", eligible: 3, verified: 1 });
    assert.deepEqual(countParticipants([], "all"), { affiliation: "all", eligible: 0, verified: 0 });
  });
});

describe("textos", () => {
  it("electionInitials toma las iniciales de las dos primeras palabras", () => {
    assert.equal(electionInitials("Consejo Estudiantil"), "CE");
    assert.equal(electionInitials("Consulta"), "C");
  });

  it("formatDateRange pasa de aaaa-mm-dd a dd/mm/aaaa", () => {
    assert.equal(formatDateRange("2026-10-15", "2026-10-20"), "15/10/2026 – 20/10/2026");
  });
});

describe("parseElectionPayload", () => {
  const payload = {
    general: { name: "Consejo", description: "Desc", institution: "university", kind: "council", startDate: "2026-10-10", endDate: "2026-10-12" },
    settings: { votingType: "single", choicesPerVote: "1", mode: "online", anonymous: true, blankVote: false, showResults: true, allowVoteChange: false },
    affiliation: "all",
  };

  it("acepta la forma esperada, con «todas» o una afiliación", () => {
    assert.deepEqual(parseElectionPayload(payload), payload);
    assert.equal(parseElectionPayload({ ...payload, affiliation: "teacher" })?.affiliation, "teacher");
  });

  it("rechaza lo que no tiene la forma esperada", () => {
    const inputs = [
      null,
      "x",
      {},
      { ...payload, affiliation: "director" },
      { ...payload, general: "texto" },
      { ...payload, general: { ...payload.general, name: 5 } },
      { ...payload, settings: { ...payload.settings, anonymous: "sí" } },
      { ...payload, settings: { ...payload.settings, choicesPerVote: 1 } },
    ];
    for (const input of inputs) assert.equal(parseElectionPayload(input), undefined, JSON.stringify(input));
  });
});
