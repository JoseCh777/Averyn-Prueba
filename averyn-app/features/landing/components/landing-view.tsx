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
