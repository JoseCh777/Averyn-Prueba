"use client";
/**
 * Haces de luz de marca. Derivado de «Background Beams» de Aceternity UI (MIT, https://ui.aceternity.com).
 * Cambios respecto al original, necesarios para Horizonte:
 *  - 13 haces en lugar de 50 (el original anima 50 degradados sin parar).
 *  - Duraciones y retardos deterministas: el original usa Math.random() en el render y rompe la hidratación en SSR.
 *  - Colores de la paleta de marca (--av-cyan-glow, --av-blue); el original usa violeta y morado fuera de Horizonte.
 *  - Respeta prefers-reduced-motion con useReducedMotion (MotionConfig no detiene el cambio de atributos SVG) y queda oculto a lectores de pantalla (decorativo).
 *  - Solo para superficies de marca (panel del login, héroes), nunca en pantallas de datos ni de biometría.
 */
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const COUNT = 13;
const STEP = 4;

const PATHS = Array.from({ length: COUNT }, (_, n) => {
  const i = n * STEP;
  const x = -380 + 7 * i;
  const y = -189 - 8 * i;
  return `M${x} ${y}C${x} ${y} ${x + 68} ${y + 405} ${x + 532} ${y + 532}C${x + 996} ${y + 659} ${x + 1064} ${y + 1064} ${x + 1064} ${y + 1064}`;
});

export function BackgroundBeams({ className }: { className?: string }) {
  const still = useReducedMotion();
  return (
    <>
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        <svg className="absolute h-full w-full" width="100%" height="100%" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
          {PATHS.map((d, i) => (
            <motion.path key={d} d={d} stroke={`url(#av-beam-${i})`} strokeOpacity="0.55" strokeWidth="0.6" />
          ))}
          <defs>
            {PATHS.map((_, i) => (
              <motion.linearGradient
                key={i}
                id={`av-beam-${i}`}
                initial={still ? { x1: "10%", x2: "80%", y1: "10%", y2: "90%" } : { x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
                animate={still ? undefined : { x1: ["0%", "100%"], x2: ["0%", "95%"], y1: ["0%", "100%"], y2: ["0%", `${94 + (i % 5) * 2}%`] }}
                transition={still ? undefined : { duration: 14 + (i % 6) * 2, ease: "easeInOut", repeat: Infinity, delay: (i % 7) * 1.4 }}
              >
                <stop style={{ stopColor: "var(--av-cyan-glow)", stopOpacity: 0 }} />
                <stop style={{ stopColor: "var(--av-cyan-glow)" }} />
                <stop offset="40%" style={{ stopColor: "var(--av-blue)" }} />
                <stop offset="100%" style={{ stopColor: "var(--av-blue)", stopOpacity: 0 }} />
              </motion.linearGradient>
            ))}
          </defs>
        </svg>
      </div>
    </>
  );
}
