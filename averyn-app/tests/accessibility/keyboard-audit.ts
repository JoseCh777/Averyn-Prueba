import type { Page } from 'playwright-core';

import { FOCUS_HOLDER_SELECTOR, MAX_TAB_STOPS } from './audit-settings';

/** Estado del elemento que tiene el foco en un momento dado. */
interface FocusSnapshot {
  /** Nombre corto para el informe, por ejemplo `button#menu.av-avatar`. */
  readonly label: string;
  /** Posicion en la pagina; sirve para detectar que el foco dio la vuelta. */
  readonly position: string;
  readonly hasFocusIndicator: boolean;
  readonly hasAccessibleName: boolean;
}

/** Resultado de recorrer una pagina con la tecla Tab. */
export interface KeyboardAuditResult {
  readonly focusableCount: number;
  readonly problems: readonly string[];
}

/**
 * Recorre la pagina con Tab y comprueba cada elemento que recibe el foco.
 *
 * Un elemento falla si no muestra un indicador de foco visible o si no tiene
 * nombre accesible (coding-standard 70). El recorrido termina cuando el foco
 * vuelve a un elemento ya visto o al llegar a `MAX_TAB_STOPS`.
 *
 * La comprobacion es una aproximacion rapida: no sustituye la prueba con un
 * lector de pantalla.
 *
 * @param page - Pagina ya cargada.
 * @returns Cuantos elementos se recorrieron y los problemas encontrados.
 */
export async function auditKeyboardNavigation(page: Page): Promise<KeyboardAuditResult> {
  const visited = new Set<string>();
  const problems: string[] = [];

  for (let stop = 0; stop < MAX_TAB_STOPS; stop++) {
    await page.keyboard.press('Tab');
    const snapshot = await page.evaluate(describeFocusedElement, FOCUS_HOLDER_SELECTOR);
    if (snapshot === null) {
      continue;
    }
    if (visited.has(snapshot.position)) {
      break;
    }
    visited.add(snapshot.position);

    if (!snapshot.hasFocusIndicator) {
      problems.push(`${snapshot.label} no muestra indicador de foco`);
    }
    if (!snapshot.hasAccessibleName) {
      problems.push(`${snapshot.label} no tiene nombre accesible`);
    }
  }

  return { focusableCount: visited.size, problems };
}

/**
 * Describe el elemento enfocado. Se ejecuta **dentro de la pagina**: no puede
 * usar nada de este modulo, solo lo que recibe por argumento.
 *
 * @param holderSelector - Selector de los contenedores que dibujan el foco de un campo compuesto.
 * @returns Descripcion del elemento, o `null` si el foco esta en el documento.
 */
function describeFocusedElement(holderSelector: string): FocusSnapshot | null {
  const element = document.activeElement;
  if (element === null || element === document.body) {
    return null;
  }

  const hasRing = (target: Element): boolean => {
    const style = getComputedStyle(target);
    const hasOutline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
    return hasOutline || (style.boxShadow !== '' && style.boxShadow !== 'none');
  };
  const holder = element.closest(holderSelector);
  const box = element.getBoundingClientRect();
  const id = element.id === '' ? '' : `#${element.id}`;
  const firstClass = typeof element.className === 'string' ? element.className.split(' ')[0] : '';
  const isLabelable =
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement;
  const labels = isLabelable ? element.labels : null;

  return {
    label: `${element.tagName.toLowerCase()}${id}${firstClass ? `.${firstClass}` : ''}`,
    position: `${Math.round(box.top + window.scrollY)},${Math.round(box.left)}`,
    hasFocusIndicator: hasRing(element) || (holder !== null && hasRing(holder)),
    hasAccessibleName:
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.hasAttribute('title') ||
      element.hasAttribute('alt') ||
      (labels !== null && labels.length > 0) ||
      (element.textContent ?? '').trim() !== '',
  };
}
