import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatDate, formatDateTime, limaDay, relativeDayLabel } from "../../lib/date-format";

describe("formato de fechas en hora de Lima", () => {
  it("limaDay usa el día de Lima, no el de UTC", () => {
    // 02:00 UTC del día 7 son las 21:00 del día 6 en Lima (UTC-5).
    assert.equal(limaDay("2026-10-07T02:00:00.000Z"), "2026-10-06");
  });

  it("formatDate y formatDateTime siguen dd/mm/aaaa", () => {
    assert.equal(formatDate("2026-09-10T15:00:00.000Z"), "10/09/2026");
    assert.equal(formatDateTime("2026-09-10T15:30:00.000Z"), "10/09/2026, 10:30");
  });
});

describe("relativeDayLabel", () => {
  const now = new Date("2026-10-06T17:00:00.000Z");

  it("dice hoy, ayer y hace N días contando días de Lima", () => {
    assert.equal(relativeDayLabel("2026-10-06T14:00:00.000Z", now), "hoy");
    assert.equal(relativeDayLabel("2026-10-05T23:00:00.000Z", now), "ayer");
    assert.equal(relativeDayLabel("2026-09-26T15:00:00.000Z", now), "hace 10 días");
  });

  it("un instante tarde en la noche de Lima sigue siendo del mismo día", () => {
    assert.equal(relativeDayLabel("2026-10-07T03:00:00.000Z", now), "hoy");
  });

  it("una fecha futura se muestra como fecha", () => {
    assert.equal(relativeDayLabel("2026-10-20T15:00:00.000Z", now), "20/10/2026");
  });
});
