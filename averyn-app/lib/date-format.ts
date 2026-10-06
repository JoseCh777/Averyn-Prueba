/** Formato de fechas para la interfaz: hora de Lima y `dd/mm/aaaa` (coding-standard 62). */

const DISPLAY_LOCALE = "es-PE";
const DISPLAY_TIME_ZONE = "America/Lima";
const MS_PER_DAY = 86_400_000;

/**
 * Día calendario de un instante en hora de Lima, como `aaaa-mm-dd`.
 *
 * @param instant - Instante en ISO 8601 o `Date`.
 * @returns El día en Lima, por ejemplo `2026-10-06`.
 */
export function limaDay(instant: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: DISPLAY_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(instant),
  );
}

/**
 * Fecha para la interfaz: `dd/mm/aaaa` en hora de Lima.
 *
 * @param instant - Instante en ISO 8601.
 * @returns Por ejemplo `10/09/2026`.
 */
export function formatDate(instant: string): string {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, { timeZone: DISPLAY_TIME_ZONE, day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(instant),
  );
}

/**
 * Fecha y hora para la interfaz: `dd/mm/aaaa, hh:mm` en hora de Lima.
 *
 * @param instant - Instante en ISO 8601.
 * @returns Por ejemplo `10/09/2026, 14:30`.
 */
export function formatDateTime(instant: string): string {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    timeZone: DISPLAY_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(instant));
}

/**
 * Etiqueta relativa a hoy, contando días calendario en hora de Lima.
 *
 * @param instant - Instante en ISO 8601.
 * @param now - Instante de referencia (por defecto, ahora; se inyecta en las pruebas).
 * @returns «hoy», «ayer», «hace N días» o, si es futuro, la fecha `dd/mm/aaaa`.
 */
export function relativeDayLabel(instant: string, now: Date = new Date()): string {
  const days = Math.round((Date.parse(limaDay(now)) - Date.parse(limaDay(instant))) / MS_PER_DAY);
  if (days === 0) return "hoy";
  if (days === 1) return "ayer";
  if (days > 1) return `hace ${days} días`;
  return formatDate(instant);
}
