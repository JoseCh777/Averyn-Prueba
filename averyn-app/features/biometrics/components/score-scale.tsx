import { VERIFICATION_THRESHOLD, formatScore } from "../biometric-rules";

/**
 * Escala de 0 a 1 con la marca del umbral: la similitud y el umbral se leen a la vez.
 *
 * Tiene un nombre accesible que dice los dos valores y de qué lado del umbral queda.
 *
 * @param props - La similitud de 0 a 100.
 * @returns La escala.
 */
export function ScoreScale({ score }: { score: number }) {
  const above = score >= VERIFICATION_THRESHOLD;
  const threshold = formatScore(VERIFICATION_THRESHOLD);
  return (
    <div>
      <div
        className="pt-scale"
        role="img"
        aria-label={`Similitud ${formatScore(score)} sobre 1. Umbral ${threshold}. ${above ? "Por encima" : "Por debajo"} del umbral.`}
      >
        <div className="pt-scale__fill" style={{ width: `max(0px, calc(${score}% - 6px))` }} />
        <div className="pt-scale__thr">
          <em>Umbral {threshold}</em>
        </div>
      </div>
      <div className="pt-scale__ends">
        <span>0</span>
        <span>Similitud</span>
        <span>1</span>
      </div>
    </div>
  );
}
