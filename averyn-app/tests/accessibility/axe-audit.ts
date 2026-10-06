import axe from 'axe-core';
import type { Page } from 'playwright-core';

import { AXE_EXCLUDED_SELECTORS, AXE_WCAG_TAGS } from './audit-settings';

/** `window` de la pagina auditada una vez inyectado axe (que lo publica como `window.axe`). */
type WindowWithAxe = Window & { axe: typeof axe };

/**
 * Evalua la pagina con axe-core contra WCAG 2.2 AA.
 *
 * Inyecta el codigo de axe en la pagina y ejecuta la auditoria completa.
 *
 * @param page - Pagina ya cargada.
 * @returns Una descripcion por regla incumplida; vacio si no hay violaciones.
 */
export async function findAxeViolations(page: Page): Promise<readonly string[]> {
  await page.addScriptTag({ content: axe.source });

  return page.evaluate(
    async ({ tags, excluded }) => {
      // El cast es necesario: `axe` no existe en el tipo de `window` hasta que se inyecta en la pagina.
      const { axe: pageAxe } = window as unknown as WindowWithAxe;
      const result = await pageAxe.run(
        { exclude: excluded.map((selector) => [selector]) },
        { runOnly: [...tags] },
      );
      return result.violations.map((violation) => {
        const firstTarget = violation.nodes[0]?.target.join(' ') ?? '';
        return `${violation.id} (${violation.nodes.length} elementos), por ejemplo ${firstTarget}`;
      });
    },
    { tags: AXE_WCAG_TAGS, excluded: AXE_EXCLUDED_SELECTORS },
  );
}

/**
 * Mide cuanto se sale la pagina por el lado derecho del viewport.
 *
 * @param page - Pagina ya cargada.
 * @returns Pixeles de desborde horizontal; `0` si no hay scroll horizontal.
 */
export async function measureHorizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}
