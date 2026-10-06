import { DEFAULT_BASE_URL, DEFAULT_ROUTES } from './audit-settings';

/** Que auditar: servidor y rutas. */
export interface AuditTarget {
  readonly baseUrl: string;
  readonly routes: readonly string[];
}

/**
 * La URL base indicada no es una URL absoluta de http o https.
 */
export class InvalidBaseUrlError extends Error {
  /**
   * @param value - Texto recibido como URL base.
   */
  public constructor(value: string) {
    super(`The base URL must be an absolute http(s) URL: ${value}`);
    this.name = 'InvalidBaseUrlError';
  }
}

/**
 * Interpreta los argumentos de la linea de comandos.
 *
 * Forma: `<baseUrl> [<ruta>...]`. Sin argumentos se auditan todas las pantallas de la
 * aplicacion en `DEFAULT_BASE_URL`; con solo la URL base se usan las mismas rutas.
 *
 * @param args - Argumentos sin `node` ni el nombre del script.
 * @returns Servidor y rutas a auditar.
 * @throws InvalidBaseUrlError when the first argument is not an absolute http(s) URL.
 */
export function parseCliArguments(args: readonly string[]): AuditTarget {
  const [baseUrl = DEFAULT_BASE_URL, ...routes] = args;
  assertHttpUrl(baseUrl);
  return { baseUrl, routes: routes.length > 0 ? routes : DEFAULT_ROUTES };
}

/**
 * Construye la URL completa de una ruta.
 *
 * La barra inicial es opcional: en Git Bash un argumento que empieza por `/` se
 * convierte en una ruta de Windows, asi que las rutas se escriben sin ella.
 *
 * @param baseUrl - Servidor, por ejemplo `http://localhost:3000`.
 * @param route - Ruta con o sin barra inicial.
 * @returns URL absoluta de la pagina.
 */
export function buildRouteUrl(baseUrl: string, route: string): string {
  return new URL(route.replace(/^\/?/, '/'), baseUrl).href;
}

/**
 * @param value - Texto a comprobar.
 * @throws InvalidBaseUrlError when `value` is not an absolute http(s) URL.
 */
function assertHttpUrl(value: string): void {
  try {
    const { protocol } = new URL(value);
    if (protocol === 'http:' || protocol === 'https:') {
      return;
    }
  } catch {
    // Se informa abajo con el mismo error que un protocolo no admitido.
  }
  throw new InvalidBaseUrlError(value);
}
