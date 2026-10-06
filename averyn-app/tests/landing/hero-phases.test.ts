import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  HERO_FINAL_PHASES,
  clampUnit,
  finalLogoScale,
  heroPhases,
  heroProgress,
  phaseProgress,
  smoothstep,
} from "../../features/landing/hero-phases";

describe("clampUnit y smoothstep", () => {
  it("recorta al intervalo [0, 1]", () => {
    assert.equal(clampUnit(-0.5), 0);
    assert.equal(clampUnit(0.25), 0.25);
    assert.equal(clampUnit(3), 1);
  });

  it("es suave en los extremos y simétrica en el centro", () => {
    assert.equal(smoothstep(0), 0);
    assert.equal(smoothstep(0.5), 0.5);
    assert.equal(smoothstep(1), 1);
    assert.ok(smoothstep(0.1) < 0.1, "arranca más lento que una recta");
  });
});

describe("phaseProgress", () => {
  it("vale 0 antes del tramo y 1 después", () => {
    assert.equal(phaseProgress(0.1, 0.3, 0.5), 0);
    assert.equal(phaseProgress(0.9, 0.3, 0.5), 1);
  });

  it("vale 0,5 a mitad del tramo", () => {
    assert.ok(Math.abs(phaseProgress(0.4, 0.3, 0.5) - 0.5) < 1e-9);
  });
});

describe("heroPhases", () => {
  it("empieza con todo oculto y termina en el estado final", () => {
    assert.deepEqual(heroPhases(0), { t1: 0, t2: 0, t3: 0 });
    assert.deepEqual(heroPhases(1), HERO_FINAL_PHASES);
  });

  it("revela el logo antes de subirlo y el texto al final", () => {
    const middle = heroPhases(0.3);
    assert.equal(middle.t1, 1, "la palabra ya está completa");
    assert.equal(middle.t2, 0, "el logo aún no sube");
    assert.equal(middle.t3, 0, "el texto aún no aparece");
  });

  it("las fases nunca bajan al avanzar el scroll", () => {
    let previous = heroPhases(0);
    for (let step = 1; step <= 100; step += 1) {
      const current = heroPhases(step / 100);
      assert.ok(current.t1 >= previous.t1 && current.t2 >= previous.t2 && current.t3 >= previous.t3, `paso ${step}`);
      previous = current;
    }
  });
});

describe("heroProgress", () => {
  it("va de 0 a 1 mientras el escenario fijo recorre la sección", () => {
    assert.equal(heroProgress(0, 2200, 1000), 0);
    assert.equal(heroProgress(-600, 2200, 1000), 0.5);
    assert.equal(heroProgress(-1200, 2200, 1000), 1);
    assert.equal(heroProgress(-5000, 2200, 1000), 1);
  });

  it("muestra el estado final si la sección no es más alta que la pantalla", () => {
    assert.equal(heroProgress(0, 900, 1000), 1);
  });
});

describe("finalLogoScale", () => {
  it("deja el logo en el 25,8 % del ancho de pantalla", () => {
    assert.equal(finalLogoScale(1040, 1000), 258 / 1040);
  });

  it("respeta los anchos mínimo (186 px) y máximo (372 px)", () => {
    assert.equal(finalLogoScale(1040, 375), 186 / 1040);
    assert.equal(finalLogoScale(1040, 2560), 372 / 1040);
  });

  it("nunca amplía el logo y no divide entre cero", () => {
    assert.equal(finalLogoScale(150, 1440), 1);
    assert.equal(finalLogoScale(0, 1440), 1);
  });
});
