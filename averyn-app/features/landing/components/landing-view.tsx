import { BackToTop } from "./back-to-top";
import { CallToActionSection, LandingFooter, TeamSection } from "./closing-sections";
import { HeroScrollScope } from "./hero-scroll-scope";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { ArchitectureSection, ProcessSection, SecuritySection, TechnologySection } from "./platform-sections";
import { AboutSection, CapabilitiesSection, SolutionsSection } from "./product-sections";

/**
 * Landing pública de Averyn: hero guiado por scroll y las secciones del producto.
 *
 * Las secciones son Server Components; solo el hero, el encabezado, el revelado y
 * «Volver arriba» corren en el navegador. Los estilos (`mn-*`) están en `app/styles/av-landing.css`.
 *
 * @returns La página completa.
 */
export function LandingView() {
  return (
    <HeroScrollScope>
      <a className="mn-skip" href="#que-es">
        Saltar al contenido
      </a>
      {/* Sin JavaScript el hero muestra su estado final (con JavaScript lo conduce el scroll). */}
      <noscript>
        <style>{".mn { --t1: 1; --t2: 1; --t3: 1; }"}</style>
      </noscript>
      <LandingHeader />
      <main aria-label="Contenido principal">
        <LandingHero />
        {/*
          Equivalente en línea de `home.js` del frontend original, ejecutado al parsear
          (antes del primer pintado): añade `.js` a `<html>` —los bloques de revelado
          arrancan ocultos, como en el original— y escribe `--t1/--t2/--t3` y `--sf`
          para que una recarga a mitad del hero no muestre el estado inicial. No toca
          `inert`: lo gobierna React (`useHeroScroll`) al hidratar.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
  var scope = document.querySelector('.mn');
  if (!scope) return;
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = document.getElementById('inicio');
  var lockup = document.querySelector('.mn-lockup');
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ease = function (t) { return t * t * (3 - 2 * t); };
  var phase = function (p, from, to) { return ease(clamp((p - from) / (to - from))); };
  var fitLogo = function () {
    if (!lockup) return;
    var w0 = lockup.offsetWidth;
    var wf = Math.min(372, Math.max(186, innerWidth * 0.258));
    lockup.style.setProperty('--sf', (wf / w0).toFixed(4));
  };
  fitLogo();
  addEventListener('resize', fitLogo);
  var setVars = function (t1, t2, t3) {
    scope.style.setProperty('--t1', t1.toFixed(4));
    scope.style.setProperty('--t2', t2.toFixed(4));
    scope.style.setProperty('--t3', t3.toFixed(4));
  };
  if (stage && !reduce) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var span = stage.offsetHeight - innerHeight;
      var p = span > 0 ? clamp(-stage.getBoundingClientRect().top / span) : 1;
      setVars(phase(p, 0.04, 0.3), phase(p, 0.3, 0.5), phase(p, 0.42, 0.72));
    };
    var request = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    update();
  } else {
    setVars(1, 1, 1);
  }
})();`,
          }}
        />
        <AboutSection />
        <CapabilitiesSection />
        <SolutionsSection />
        <TechnologySection />
        <ProcessSection />
        <ArchitectureSection />
        <SecuritySection />
        <TeamSection />
        <CallToActionSection />
      </main>
      <LandingFooter />
      <BackToTop />
    </HeroScrollScope>
  );
}
