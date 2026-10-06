import type { Browser, Page } from 'playwright-core';

import { findAxeViolations, measureHorizontalOverflow } from './axe-audit';
import { SETTLE_TIME_MS, VIEWPORTS, type SessionCookie } from './audit-settings';
import { auditKeyboardNavigation } from './keyboard-audit';
import type { Finding, RouteReport } from './report';

type Viewport = (typeof VIEWPORTS)[number];

/** Pagina abierta y los errores de consola que va acumulando. */
interface LoadedPage {
  readonly page: Page;
  /** Cierra la pagina y su contexto (y con el, la cookie de sesion). */
  readonly close: () => Promise<void>;
  readonly consoleErrors: readonly string[];
  /** Codigo HTTP de la carga, o `undefined` si no hubo respuesta. */
  readonly status: number | undefined;
}

/**
 * Audita una ruta: axe, desborde y errores de consola en cada ancho, y el teclado en escritorio.
 *
 * @param browser - Navegador ya abierto.
 * @param url - URL absoluta de la pagina.
 * @param route - Ruta tal como la escribio la persona, para el informe.
 * @param cookie - Cookie de sesion para pantallas que la exigen.
 * @returns Resultado de la ruta.
 */
export async function auditRoute(
  browser: Browser,
  url: string,
  route: string,
  cookie?: SessionCookie,
): Promise<RouteReport> {
  const findings: Finding[] = [];
  for (const viewport of VIEWPORTS) {
    findings.push(...(await auditViewport(browser, url, route, viewport, cookie)));
  }

  const keyboard = await auditKeyboard(browser, url, route, cookie);
  findings.push(...keyboard.findings);
  return { route, focusableCount: keyboard.focusableCount, findings };
}

/**
 * @param browser - Navegador ya abierto.
 * @param url - URL absoluta de la pagina.
 * @param route - Ruta para el informe.
 * @param viewport - Ancho y alto del viewport.
 * @param cookie - Cookie de sesion, si la pantalla la exige.
 * @returns Problemas de axe, desborde horizontal y consola en ese ancho.
 */
async function auditViewport(
  browser: Browser,
  url: string,
  route: string,
  viewport: Viewport,
  cookie?: SessionCookie,
): Promise<Finding[]> {
  const loaded = await loadPage(browser, url, viewport, cookie);
  const found = (check: Finding['check'], message: string): Finding => ({
    route,
    viewportWidth: viewport.width,
    check,
    message,
  });

  try {
    if (loaded.status === undefined || loaded.status >= 400) {
      return [found('http', `la pagina respondio ${loaded.status ?? 'sin respuesta'}`)];
    }

    const findings = (await findAxeViolations(loaded.page)).map((violation) => found('axe', violation));
    const overflow = await measureHorizontalOverflow(loaded.page);
    if (overflow > 0) {
      findings.push(found('overflow', `scroll horizontal de ${overflow}px`));
    }
    findings.push(...loaded.consoleErrors.map((error) => found('console', error)));
    return findings;
  } finally {
    await loaded.close();
  }
}

/**
 * @param browser - Navegador ya abierto.
 * @param url - URL absoluta de la pagina.
 * @param route - Ruta para el informe.
 * @param cookie - Cookie de sesion, si la pantalla la exige.
 * @returns Elementos enfocables recorridos y problemas de teclado (en el ancho de escritorio).
 */
async function auditKeyboard(
  browser: Browser,
  url: string,
  route: string,
  cookie?: SessionCookie,
): Promise<{ focusableCount: number; findings: Finding[] }> {
  const [desktop] = VIEWPORTS;
  const loaded = await loadPage(browser, url, desktop, cookie);

  try {
    if (loaded.status === undefined || loaded.status >= 400) {
      return { focusableCount: 0, findings: [] };
    }
    const result = await auditKeyboardNavigation(loaded.page);
    const findings = result.problems.map((message): Finding => ({ route, check: 'keyboard', message }));
    return { focusableCount: result.focusableCount, findings };
  } finally {
    await loaded.close();
  }
}

/**
 * Abre la pagina y espera a que terminen las animaciones de entrada.
 *
 * @param browser - Navegador ya abierto.
 * @param url - URL absoluta de la pagina.
 * @param viewport - Ancho y alto del viewport.
 * @param cookie - Cookie de sesion que se envia con la peticion, si la hay.
 * @returns Pagina cargada, su codigo HTTP y los errores de consola.
 */
async function loadPage(
  browser: Browser,
  url: string,
  viewport: Viewport,
  cookie?: SessionCookie,
): Promise<LoadedPage> {
  const context = await browser.newContext({ viewport });
  if (cookie !== undefined) {
    await context.addCookies([{ name: cookie.name, value: cookie.value, url }]);
  }
  const page = await context.newPage();
  // tsx (esbuild) envuelve las funciones con nombre en `__name(...)`. Esas funciones se
  // serializan y se ejecutan en el navegador, donde el auxiliar no existe: se define vacio.
  await page.addInitScript('window.__name = (target) => target;');
  const consoleErrors: string[] = [];
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  const response = await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(SETTLE_TIME_MS);
  return { page, close: () => context.close(), consoleErrors, status: response?.status() };
}
