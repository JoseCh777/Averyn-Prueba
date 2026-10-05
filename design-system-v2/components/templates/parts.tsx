import type { ReactNode } from "react";
import { Alert } from "@/components/ui/feedback";
import { Icon, type IconName } from "@/components/ui/icon";

/* Piezas comunes de las plantillas de pantalla (antes: shell, head, STATE… de plantillas.js). */

const DOCK: [string, string][] = [["Panel", "p"], ["Personas", "personas"], ["Documentos", "docs"], ["Biometría", "bio"], ["Accesos", "soon"], ["Reportes", "soon"]];

/** Cabecera de la aplicación (marca, dock de módulos y usuario) + contenedor principal. */
export function AppShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <>
      <header className="hz-nav">
        <span className="hz-brandchip">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" /></span>
        <nav className="hz-dock" aria-label="Módulos">
          {DOCK.map(([label, key]) => key === "soon"
            ? <span key={label} className="soon" title="Próximamente" aria-disabled="true">{label}</span>
            : <a key={label} href="#" aria-current={key === active ? "page" : undefined}>{label}</a>)}
        </nav>
        <button className="hz-avatar" type="button"><span className="hz-avatar__c" aria-hidden="true">UD</span><span><b>Usuario Demo</b><small>Administrador</small></span></button>
      </header>
      <main className="tp-main">{children}</main>
    </>
  );
}

export function PageHead({ crumb, title, sub, actions }: { crumb: ReactNode; title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="tp-head">
      <div><p className="hz-crumb mono">{crumb}</p><h1>{title}</h1>{sub && <p className="tp-sub">{sub}</p>}</div>
      <div style={{ display: "flex", gap: ".6rem" }}>{actions}</div>
    </div>
  );
}

export const Skel = ({ n }: { n: number }) => (
  <div className="tp-sk" role="status" aria-label="Cargando">{Array.from({ length: n }, (_, i) => <i key={i} style={{ width: `${100 - i * 9}%` }} />)}</div>
);

export function EmptyBlock({ icon, title, text, button }: { icon: IconName; title: string; text: string; button?: string }) {
  return (
    <div className="tp-state"><Icon name={icon} /><b>{title}</b><p>{text}</p>{button && <button className="hz-btn hz-btn--ghost" type="button">{button}</button>}</div>
  );
}

export function ErrorBlock() {
  return (
    <>
      <div className="hz-alert hz-alert--error" role="alert"><strong>No pudimos cargar los datos</strong>Revisa tu conexión e inténtalo de nuevo.</div>
      <div style={{ marginTop: ".8rem" }}><button className="hz-btn hz-btn--ghost" type="button">Reintentar</button></div>
    </>
  );
}

export const StaticPager = () => (
  <div className="hz-pager" role="navigation" aria-label="Paginación">
    <button type="button" disabled aria-label="Anterior">←</button><button type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><button type="button" aria-label="Siguiente">→</button>
  </div>
);

/** Marco de las pantallas de acceso (panel de marca + formulario). */
export function AuthFrame({ claim = "Todo listo para continuar.", children }: { claim?: string; children: ReactNode }) {
  return (
    <div className="tp-auth">
      <div className="hz-frame">
        <div className="hz-frame__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" />
          <svg viewBox="0 0 640 300" aria-hidden="true">
            <path d="M0 290 H640" stroke="rgba(255,255,255,.22)" fill="none" /><path d="M30 290 C110 60 330 40 450 290" stroke="#fff" strokeWidth="1.5" fill="none" />
            <path d="M90 290 C150 110 300 95 390 290" stroke="#00ACD2" strokeWidth="2" fill="none" /><path d="M150 290 C190 170 270 160 330 290" stroke="#55D6FF" strokeWidth="1.5" fill="none" />
            <path d="M300 8 L545 290" stroke="#3D86FF" strokeWidth="2" fill="none" /><path d="M326 -32 L605 290" stroke="#3D86FF" strokeWidth="2" fill="none" />
          </svg>
          <div><h4>{claim}</h4></div>
        </div>
        <div className="hz-frame__form">{children}</div>
      </div>
    </div>
  );
}

export const BackLink = () => <a href="#" className="mono tp-back">← Volver a ingresar</a>;

export function Block({ tone, title, children, role }: { tone: "success" | "warning" | "error" | "info"; title: string; children?: ReactNode; role?: string }) {
  return <Alert tone={tone} title={title} role={role}>{children}</Alert>;
}

export function AField({ id, label, value, ...props }: { id: string; label: string; value?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div className="hz-field"><label className="hz-label" htmlFor={id}>{label}</label><input className="hz-input" id={id} defaultValue={value ?? ""} {...props} /></div>;
}

export function Wide({ children, variant = "primary", disabled, busy }: { children: ReactNode; variant?: string; disabled?: boolean; busy?: boolean }) {
  return <button className={`hz-btn hz-btn--${variant} hz-btn--block`} type="button" disabled={disabled} aria-busy={busy || undefined}>{children}</button>;
}
