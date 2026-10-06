import Link from "next/link";

import { LOGIN_PATH } from "@/features/authentication/routes";

import { TEAM, type TeamMember } from "../content";
import { ArcsFigure } from "./arcs-figure";
import { SectionLabel } from "./landing-parts";
import { Reveal } from "./reveal";

/**
 * «Equipo»: los cuatro integrantes con enlace a su GitHub.
 *
 * @returns La sección `#equipo`.
 */
export function TeamSection() {
  return (
    <section id="equipo" className="mn-section mn-soft" aria-labelledby="equipo-title">
      <Reveal className="mn-wrap mn-grid">
        <div className="mn-eq__head">
          <SectionLabel>Equipo</SectionLabel>
          <h2 className="mn-title" id="equipo-title">
            Construido desde la ingeniería y la investigación.
          </h2>
        </div>
        <p className="mn-lead mn-eq__intro">
          Averyn nace como una propuesta académica para modernizar los procesos institucionales mediante software, biometría y
          arquitecturas distribuidas.
        </p>
        <div className="mn-team">
          {TEAM.map((member) => (
            <TeamCard key={member.github} member={member} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Tarjeta de un integrante. Al pasar el puntero o enfocar el enlace aparece una ficha con
 * su avatar de GitHub y lo que construye (la ficha describe al enlace: `aria-describedby`).
 */
function TeamCard({ member }: { member: TeamMember }) {
  const popoverId = `pop-${member.github.toLowerCase()}`;
  return (
    <div className="mn-person-wrap">
      <a
        className="mn-person"
        href={`https://github.com/${member.github}`}
        target="_blank"
        rel="noreferrer"
        aria-describedby={popoverId}
        aria-label={`Abrir perfil de GitHub de ${member.name} (se abre en una pestaña nueva)`}
      >
        <span className="mn-person__ini" aria-hidden="true">
          {member.initials}
        </span>
        <strong>{member.name}</strong>
        <small>{member.role}</small>
        <span className="mn-mono">@{member.github} ↗</span>
      </a>
      <div className="mn-pop" role="tooltip" id={popoverId}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://github.com/${member.github}.png?size=96`} alt={`Avatar de ${member.name}`} loading="lazy" />
        <div>
          <strong>{member.name}</strong>
          <small>@{member.github}</small>
          <p>{member.bio}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Cierre en azul con la figura de arcos y la invitación a ingresar.
 *
 * @returns La sección `#cta`.
 */
export function CallToActionSection() {
  return (
    <section id="cta" className="mn-section mn-cta" aria-labelledby="cta-title">
      <ArcsFigure variant="cta" className="mn-cta__fig" />
      <Reveal className="mn-wrap mn-grid">
        <h2 className="mn-title" id="cta-title">
          Automatiza procesos institucionales críticos con seguridad.
        </h2>
        <div className="mn-cta__side">
          <p>Explora la plataforma y descubre una forma más clara y segura de gestionar la identidad de tu institución.</p>
          <Link className="mn-btn mn-btn--light" href={LOGIN_PATH}>
            Ingresar al sistema →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Pie de página: marca, enlace al sistema y el espacio reservado para el contacto.
 *
 * @returns El `footer`.
 */
export function LandingFooter() {
  return (
    <footer className="mn-footer" aria-label="Pie de página">
      <div className="mn-wrap">
        <div className="mn-footer__grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mn-footer__logo" src="/assets/images/averyn-logo-font-white.avif" alt="Averyn" />
            <p>Identidad inteligente para procesos institucionales seguros.</p>
          </div>
          <div>
            <h3>Proyecto</h3>
            <Link href={LOGIN_PATH}>Ingresar →</Link>
          </div>
          <address id="contacto">
            <h3>Contacto Averyn</h3>
            <p>Espacio reservado para el correo y los canales oficiales del proyecto.</p>
            <span className="mn-mono">Próximamente</span>
          </address>
        </div>
        <div className="mn-footer__bottom mn-mono">© 2026 Averyn. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
}
