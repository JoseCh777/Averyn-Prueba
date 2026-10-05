"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

/* Demo del hero guiado por scroll: misma matemática que averyn-frontend/assets/js/home.js.
   HeroStage (escenario) y HeroSlider (control) comparten el progreso por un almacén mínimo. */
let progress = 0;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const setProgress = (p: number) => { progress = p; listeners.forEach((l) => l()); };
const useProgress = () => useSyncExternalStore(subscribe, () => progress, () => 0);

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => t * t * (3 - 2 * t);
const phase = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));

export function HeroStage() {
  const p = useProgress();
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 900, h: 340 });
  useEffect(() => {
    const m = () => ref.current && setSize({ w: ref.current.clientWidth, h: ref.current.clientHeight });
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  const t1 = phase(p, 0.06, 0.42), t2 = phase(p, 0.42, 0.66), t3 = phase(p, 0.62, 0.92);
  const W = 900, H = (W * 371) / 1144;
  const finalW = Math.min(300, size.w * 0.3), sf = finalW / W;
  const s = 1 - (1 - sf) * (0.55 * t1 + 0.45 * t2);
  const cx = 15.95 + 84.05 * t1;
  const tx = -W / 2 + (1 - t1) * s * 0.349 * W;
  const ty = -H / 2 - t2 * 0.27 * size.h;

  return (
    <div className="stage" style={{ padding: 0, overflow: "hidden" }}>
      <div ref={ref} id="hero-demo" style={{ position: "relative", height: 340, background: "linear-gradient(180deg,#DCECFF 0%,#EAF0FE 100%)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,42,102,0) 18%,#0A2A66 54%,#000C24 82%)", opacity: t2 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/averyn-logo-font-black.avif" alt="Wordmark Averyn mostrado durante la demo del hero"
             style={{ position: "absolute", left: "50%", top: "50%", width: 900, maxWidth: "none", transform: `translate(${tx}px,${ty}px) scale(${s})`, clipPath: `polygon(0 0,${cx}% 0,${cx + 18.3}% 100%,0 100%)` }} />
        <svg viewBox="0 0 640 300" aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: 64, width: 300, transform: "translateX(-50%)", opacity: t3 }}>
          <path d="M0 290 H640" stroke="rgba(255,255,255,.22)" fill="none" />
          {[["M30 290 C110 60 330 40 450 290", "#fff", 1.5], ["M90 290 C150 110 300 95 390 290", "#00ACD2", 2], ["M150 290 C190 170 270 160 330 290", "#55D6FF", 1.5], ["M300 8 L545 290", "#3D86FF", 2]].map(([d, c, w]) => (
            <path key={d as string} d={d as string} stroke={c as string} strokeWidth={w as number} fill="none" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - t3 }} />
          ))}
        </svg>
        <p style={{ position: "absolute", left: "50%", bottom: 18, transform: "translateX(-50%)", color: "#D7E0F3", fontSize: ".8rem", whiteSpace: "nowrap", opacity: t3 }}>Plataforma de identidad, biometría, IA y seguridad.</p>
      </div>
    </div>
  );
}

export function HeroSlider() {
  const id = useId();
  const p = useProgress();
  const pct = `${Math.round(p * 100)} %`;
  return (
    <div className="stage ds-gap-top">
      <label className="av-label" htmlFor={id}>Progreso de scroll <span className="mono">{pct}</span></label>
      <input id={id} className="demo-slider" type="range" min={0} max={100} value={Math.round(p * 100)} aria-valuetext={pct} onChange={(e) => setProgress(Number(e.target.value) / 100)} />
    </div>
  );
}
