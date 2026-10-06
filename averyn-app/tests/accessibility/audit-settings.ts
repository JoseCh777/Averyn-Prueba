/**
 * Valores fijos de la auditoria de accesibilidad.
 *
 * Viven juntos para que ningun otro modulo contenga numeros ni cadenas
 * magicas (coding-standard 61).
 */

/** Servidor al que se apunta cuando no se indica otro. */
export const DEFAULT_BASE_URL = 'http://localhost:3000';

/**
 * Rutas auditadas por defecto: todas las pantallas de la app. Las que exigen sesion necesitan
 * `AUDIT_COOKIE`; sin ella redirigen al login y se audita el login varias veces.
 * No incluye las paginas que responden 404 a proposito: la herramienta las toma como un problema.
 */
export const DEFAULT_ROUTES: readonly string[] = [
  '',
  'login',
  'forbidden',
  'offline',
  'maintenance',
  'dashboard',
  'identity',
  'identity/per-0001',
  'documents',
  'documents/pre-registration',
  'biometrics',
  'biometrics/enrollment',
  'biometrics/verification',
  'biometrics/history',
  'biometrics/capture?mode=enrollment&person=per-0001&method=face',
  'elections',
  'elections/new',
  'ai',
];

/** Anchos minimos que exige el estandar para probar el responsive (coding-standard 71). */
export const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 900 },
] as const;

/** Reglas WCAG que evalua axe: 2.2 nivel AA (coding-standard 70). */
export const AXE_WCAG_TAGS: readonly string[] = ['wcag2a', 'wcag2aa', 'wcag22aa'];

/**
 * Elementos que axe no debe evaluar. Ninguno por ahora: la aplicacion no tiene muestras de ejemplo
 * que fallen a proposito (las del catalogo del Design System viven en `design-system-v2`).
 */
export const AXE_EXCLUDED_SELECTORS: readonly string[] = [];

/** Espera tras cargar la pagina para que terminen las animaciones de entrada. */
export const SETTLE_TIME_MS = 1500;

/** Tope de pulsaciones de Tab por pagina; evita un bucle infinito si el foco no vuelve al inicio. */
export const MAX_TAB_STOPS = 600;

/**
 * Contenedores que dibujan el foco de un campo compuesto con `focus-within`.
 *
 * Son clases del catalogo del Design System: en esos campos el anillo de foco
 * no esta en el `input` sino en el contenedor.
 */
export const FOCUS_HOLDER_SELECTOR = '.ms__field, .cmd__top, .sf, .otp';

/** Canal de navegador por defecto (Microsoft Edge viene instalado en Windows). */
const DEFAULT_BROWSER_CHANNEL = 'msedge';

/**
 * Canal de navegador de Playwright.
 *
 * @returns El valor de `BROWSER_CHANNEL`, o Edge si no esta definido.
 */
export function readBrowserChannel(): string {
  return process.env.BROWSER_CHANNEL ?? DEFAULT_BROWSER_CHANNEL;
}

/** Cookie que se envia en cada peticion, para auditar pantallas que exigen sesion. */
export interface SessionCookie {
  readonly name: string;
  readonly value: string;
}

/**
 * Interpreta `nombre=valor`.
 *
 * @param raw - Texto de la variable `AUDIT_COOKIE`, posiblemente indefinido.
 * @returns La cookie, o `undefined` si no se indico ninguna.
 * @throws Error when the text is not in the `name=value` form.
 */
export function parseSessionCookie(raw: string | undefined): SessionCookie | undefined {
  if (raw === undefined || raw.trim() === '') {
    return undefined;
  }
  const separator = raw.indexOf('=');
  if (separator <= 0) {
    throw new Error('AUDIT_COOKIE must have the form name=value');
  }
  return { name: raw.slice(0, separator).trim(), value: raw.slice(separator + 1).trim() };
}

/**
 * Cookie de sesion de la auditoria.
 *
 * @returns La cookie de `AUDIT_COOKIE`, o `undefined` si no esta definida.
 * @throws Error when `AUDIT_COOKIE` is malformed.
 */
export function readSessionCookie(): SessionCookie | undefined {
  return parseSessionCookie(process.env.AUDIT_COOKIE);
}
