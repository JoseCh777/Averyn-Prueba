import { chromium } from 'playwright-core';

import { readBrowserChannel, readSessionCookie } from './audit-settings';
import { buildRouteUrl, parseCliArguments } from './cli-arguments';
import { collectFindings, formatFinding, formatRouteSummary, resolveExitCode, type RouteReport } from './report';
import { auditRoute } from './route-audit';

/**
 * Auditoria de accesibilidad del frontend.
 *
 * Uso: `npm run test:a11y -- [<baseUrl> [<ruta>...]]`. Requiere el servidor en
 * marcha (`npm run build && npm run start`). Detalle en `README.md`.
 */
async function main(): Promise<void> {
  const target = parseCliArguments(process.argv.slice(2));
  const cookie = readSessionCookie();
  const browser = await chromium.launch({ channel: readBrowserChannel() });

  try {
    const reports: RouteReport[] = [];
    for (const route of target.routes) {
      const report = await auditRoute(browser, buildRouteUrl(target.baseUrl, route), route, cookie);
      console.log(formatRouteSummary(report));
      reports.push(report);
    }

    for (const finding of collectFindings(reports)) {
      console.log(formatFinding(finding));
    }
    process.exitCode = resolveExitCode(reports);
  } finally {
    await browser.close();
  }
}

/** Codigo de salida de un uso incorrecto o de un fallo al ejecutar (distinto de `1`, que es «hay problemas»). */
const EXECUTION_FAILURE_EXIT_CODE = 2;

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = EXECUTION_FAILURE_EXIT_CODE;
});
