/**
 * Huella de arcos anidados (dibujo del equipo, vectorizado): 11 trazos de dentro hacia fuera —tallo,
 * horquilla y cúpulas con cortes y patas largas—. Ya incluye su inclinación. Es decorativa: no
 * codifica ningún dato real. Se ilumina de dentro hacia fuera según el avance de la lectura.
 */
export const FINGERPRINT_RINGS: readonly string[] = [
  "M98.6 105.4 L99.8 129.9",
  "M92.7 132.8 L91.3 103.5 A7.24 7.24 0 0 1 105.7 102.8 L107.1 132.0",
  "M83.8 147.9 L81.7 104.0 A16.80 16.80 0 0 1 115.3 102.4 L116.9 136.1",
  "M70.8 91.5 A30.10 30.10 0 0 1 128.6 101.7 L131.9 172.8",
  "M71.0 158.0 L68.4 104.6 A30.10 30.10 0 0 1 68.7 99.3",
  "M58.0 167.3 L55.1 105.2 A43.46 43.46 0 0 1 141.9 101.1 L144.6 157.2",
  "M57.3 64.0 A56.81 56.81 0 0 1 155.3 100.5 C155.4 102.3 155.8 107.9 156.0 111.6 C156.2 115.3 156.5 119.0 156.6 122.7 C156.8 126.5 156.8 130.3 156.9 134.0 C157.0 137.8 157.0 141.6 157.2 145.3 C157.3 149.1 157.5 152.9 157.7 156.6 C158.0 160.3 158.3 164.0 158.5 167.6 C158.7 171.3 158.9 174.9 158.9 178.5 C158.9 182.1 158.8 185.7 158.4 189.2 C157.9 192.8 157.4 196.3 156.4 199.8 C155.4 203.3 153.0 208.4 152.4 210.1",
  "M44.5 164.3 L41.8 105.9 A56.81 56.81 0 0 1 47.6 78.0",
  "M32.3 188.0 L28.5 106.5 A70.10 70.10 0 0 1 168.5 99.9 C168.6 101.7 169.1 107.1 169.2 110.7 C169.3 114.4 169.2 118.1 169.2 121.8 C169.2 125.5 169.2 129.2 169.4 132.9 C169.5 136.5 169.7 140.2 169.9 143.9 C170.2 147.6 170.6 151.3 170.9 155.0 C171.2 158.7 171.7 162.3 172.0 166.0 C172.3 169.7 172.6 173.3 172.6 177.0 C172.7 180.7 172.7 184.3 172.4 188.0 C172.1 191.6 171.1 197.1 170.9 198.9",
  "M19.1 190.1 L15.2 107.1 A83.42 83.42 0 0 1 181.8 99.2 L182.5 114.3",
  "M183.6 137.0 L186.3 192.8",
];

/**
 * Cuántos arcos están iluminados para un avance dado.
 *
 * @param progress - Avance de 0 a 100.
 * @returns De 0 a 11.
 */
export function litRings(progress: number): number {
  return Math.round((Math.min(100, Math.max(0, progress)) / 100) * FINGERPRINT_RINGS.length);
}
