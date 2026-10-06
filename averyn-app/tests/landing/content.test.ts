import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CAPABILITIES, LANDING_NAV, TEAM, orderLabel } from "../../features/landing/content";

describe("orderLabel", () => {
  it("numera con dos cifras empezando en 01", () => {
    assert.equal(orderLabel(0), "01");
    assert.equal(orderLabel(5), "06");
    assert.equal(orderLabel(11), "12");
  });
});

describe("contenido de la landing", () => {
  it("el menú no repite secciones", () => {
    const ids = LANDING_NAV.map((link) => link.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("muestra las seis capacidades", () => {
    assert.equal(CAPABILITIES.length, 6);
  });

  it("cada integrante tiene usuario de GitHub único e iniciales de dos letras", () => {
    const users = TEAM.map((member) => member.github.toLowerCase());
    assert.equal(new Set(users).size, users.length);
    for (const member of TEAM) {
      assert.match(member.initials, /^[A-Z]{2}$/, member.name);
      assert.match(member.github, /^[A-Za-z0-9-]+$/, member.name);
    }
  });
});
