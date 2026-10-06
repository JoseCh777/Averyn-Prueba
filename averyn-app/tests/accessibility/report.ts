/** Tipo de comprobacion que detecto el problema. */
export type FindingCheck = 'http' | 'axe' | 'overflow' | 'console' | 'keyboard';

/** Un problema encontrado en una pagina. */
export interface Finding {
  readonly route: string;
  /** Ancho del viewport, o `undefined` si la comprobacion no depende de el. */
  readonly viewportWidth?: number;
  readonly check: FindingCheck;
  readonly message: string;
}

/** Resultado de auditar una ruta. */
export interface RouteReport {
  readonly route: string;
  /** Elementos enfocables recorridos con Tab. */
  readonly focusableCount: number;
  readonly findings: readonly Finding[];
}

/**
 * Linea de texto de un problema.
 *
 * @param finding - Problema a mostrar.
 * @returns Texto con la ruta, el ancho (si aplica), la comprobacion y el detalle.
 */
export function formatFinding(finding: Finding): string {
  const width = finding.viewportWidth === undefined ? '' : ` @${finding.viewportWidth}px`;
  return `  - [${finding.check}] ${finding.route}${width}: ${finding.message}`;
}

/**
 * Resumen de una ruta para la salida de la consola.
 *
 * @param report - Resultado de la ruta.
 * @returns Una linea `ok` o `FALLA` con el numero de problemas y de enfocables.
 */
export function formatRouteSummary(report: RouteReport): string {
  const status = report.findings.length === 0 ? 'ok   ' : 'FALLA';
  return `${status} ${report.route} | enfocables: ${report.focusableCount} | problemas: ${report.findings.length}`;
}

/**
 * @param reports - Resultados de todas las rutas.
 * @returns Todos los problemas, en el orden en que se encontraron.
 */
export function collectFindings(reports: readonly RouteReport[]): readonly Finding[] {
  return reports.flatMap((report) => report.findings);
}

/**
 * Codigo de salida del proceso: 1 si hay algun problema, para que sirva en CI.
 *
 * @param reports - Resultados de todas las rutas.
 * @returns `0` sin problemas, `1` con alguno.
 */
export function resolveExitCode(reports: readonly RouteReport[]): 0 | 1 {
  return collectFindings(reports).length === 0 ? 0 : 1;
}
