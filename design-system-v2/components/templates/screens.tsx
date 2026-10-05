import type { ReactNode } from "react";
import { Chip, type ChipTone } from "@/components/ui/feedback";
import { Icon, type IconName } from "@/components/ui/icon";
import { AField, AppShell, AuthFrame, BackLink, Block, EmptyBlock, ErrorBlock, PageHead, Skel, StaticPager, Wide } from "./parts";

/* Plantillas de pantalla de Horizonte como componentes React (antes: HTML generado en plantillas.js).
   Cada una recibe `state` (normal, empty, loading, error…). Datos de ejemplo. */
type S = { state: string };

/* ---------- Bitácora ---------- */
const AUDIT: [string, string, string, string, string, ChipTone][] = [
  ["10:42", "BIOMETRIC_VERIFIED", "Ana Lucía Pérez", "CAM-001", "Aceptada", "success"], ["10:31", "LOGIN", "Carlos Mendoza", "Web", "Correcto", "success"],
  ["10:15", "BIOMETRIC_VERIFIED", "Lucía Ramos", "LEC-002", "Rechazada", "error"], ["09:58", "DOCUMENT_REGISTERED", "Diego Torres", "Web", "Correcto", "success"],
  ["09:40", "PERSON_CREATED", "Valeria Quispe", "Web", "Correcto", "success"], ["09:12", "BIOMETRIC_ENROLLED", "Jorge Salazar", "CAM-002", "Correcto", "success"],
  ["08:55", "VOTE_CAST", "— (anónimo)", "KIOSCO-01", "Registrado", "info"], ["08:30", "LOGIN", "Mariana Cruz", "Web", "Fallido", "error"],
];

export function Bitacora({ state }: S) {
  const data = state === "empty" ? <EmptyBlock icon="journal-text" title="Sin eventos en este periodo" text="Prueba con un periodo más amplio o quita algún filtro." button="Ampliar a 90 días" />
    : state === "loading" ? <Skel n={7} /> : state === "error" ? <ErrorBlock /> : (
      <>
        <table className="tp-t">
          <thead><tr><th>Hora</th><th>Evento</th><th>Persona</th><th>Dispositivo</th><th>Resultado</th></tr></thead>
          <tbody>{AUDIT.map((r) => <tr key={r[0] + r[1]}><td className="tp-mono">{r[0]}</td><td className="tp-ev">{r[1]}</td><td>{r[2]}</td><td className="tp-mono">{r[3]}</td><td><Chip tone={r[5]}>{r[4]}</Chip></td></tr>)}</tbody>
        </table>
        <div className="tp-foot"><span>Mostrando 1–8 de 1,953</span><StaticPager /></div>
      </>
    );
  return (
    <AppShell active="p">
      <PageHead crumb={<>Panel / <b>Bitácora</b></>} title="Bitácora de auditoría" sub="Quién hizo qué y cuándo. Solo lectura." actions={<button className="av-btn av-btn--ghost" type="button">Exportar CSV</button>} />
      <div className="tp-bar">
        <span className="tp-btn"><Icon name="calendar3" />Últimos 30 días<Icon name="chevron-down" /></span>
        <select className="av-select" aria-label="Tipo de evento"><option>Todos los eventos</option></select>
        <input className="av-input" type="search" placeholder="Buscar persona o dispositivo" aria-label="Buscar" />
      </div>
      <div className="tp-card">{data}</div>
    </AppShell>
  );
}

/* ---------- Configuración ---------- */
const Row = ({ on, label, desc }: { on: boolean; label: string; desc: string }) => (
  <div className="tp-row"><div><b>{label}</b><small>{desc}</small></div><button className="av-switch" role="switch" aria-checked={on} aria-label={label} type="button" /></div>
);

export function Configuracion(_: S) {
  return (
    <AppShell active="bio">
      <PageHead crumb={<>Panel / Configuración / <b>Biometría</b></>} title="Configuración" sub="Ajustes de tu institución." />
      <div className="tp-cols">
        <nav className="tp-sub-nav" aria-label="Secciones"><a href="#">General</a><a href="#">Seguridad</a><a href="#" aria-current="page">Biometría</a><a href="#">Notificaciones</a><a href="#">Dispositivos</a></nav>
        <div>
          <section className="tp-card"><h2>Umbral de verificación</h2><p>Puntaje mínimo para aceptar una verificación.</p>
            <div className="av-field" style={{ maxWidth: "14rem" }}><label className="av-label" htmlFor="u">Umbral (0 a 1)</label><input className="av-input" id="u" defaultValue="0.68" readOnly aria-describedby="uh" /><span className="av-help" id="uh">Lo define el servidor. Cambiarlo requiere permiso de Administrador.</span></div></section>
          <section className="tp-card"><h2>Dispositivos</h2><p>Qué hacer cuando algo falla.</p>
            <Row on label="Avisar si un dispositivo se desconecta" desc="Notificación y banner en el panel." /><Row on label="Reintentar la lectura automáticamente" desc="Hasta 2 veces antes de pedir ayuda." /><Row on={false} label="Permitir verificación sin conexión" desc="Desactivado: requiere conexión con el servidor." /></section>
          <section className="tp-card"><h2>Retención de datos</h2><p>Cuánto tiempo se conservan las plantillas biométricas tras el fin del vínculo.</p>
            <div className="av-field" style={{ maxWidth: "20rem" }}><label className="av-label" htmlFor="r">Eliminar a los</label><select className="av-select" id="r"><option>30 días</option><option>90 días</option></select></div></section>
          <div className="tp-save"><span><Icon name="dot" style={{ color: "var(--av-blue)" }} />Tienes cambios sin guardar.</span><span style={{ display: "flex", gap: ".6rem" }}><button className="av-btn av-btn--ghost" type="button">Descartar</button><button className="av-btn av-btn--primary" type="button">Guardar cambios</button></span></div>
          <section className="tp-card tp-danger" style={{ marginTop: "1.4rem" }}><h2>Zona de peligro</h2><p>Estas acciones no se pueden deshacer.</p><button className="av-btn av-btn--danger" type="button">Revocar todos los consentimientos…</button></section>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------- Detalle de persona ---------- */
export function Persona({ state }: S) {
  const feed = state === "loading" ? <Skel n={5} /> : state === "error" ? <div className="av-alert av-alert--error" role="alert"><strong>No pudimos cargar la actividad</strong>Los datos de la persona sí se cargaron.</div> : (
    <ul className="av-feed">
      <li><b>Verificación biométrica</b><span>Rostro verificado · 0.82</span><small>HOY, 10:42 · CAM-001</small></li>
      <li><b>Inicio de sesión</b><span>Correcto</span><small>AYER, 08:15 · WEB</small></li>
      <li className="retry"><b>Verificación biométrica</b><span>Huella con reintento</span><small>30 SEP, 12:20 · LEC-001</small></li>
      <li><b>Biometría registrada</b><span>Rostro y huella</span><small>29 SEP, 17:30 · CAM-002</small></li>
    </ul>
  );
  return (
    <AppShell active="personas">
      <p className="av-crumb mono" style={{ marginBottom: "1.2rem" }}>Panel / Personas / <b>Ana Lucía Pérez</b></p>
      <div className="tp-head">
        <div className="tp-who"><span className="tp-ava" aria-hidden="true">AP</span><div><h1>Ana Lucía Pérez</h1><div className="tp-chips"><Chip tone="success">Activa</Chip><Chip tone="info" icon="fingerprint">Rostro y huella</Chip><Chip tone="neutral" icon="mortarboard">Estudiante</Chip></div></div></div>
        <div style={{ display: "flex", gap: ".6rem" }}><button className="av-btn av-btn--primary" type="button">Editar datos</button><button className="tp-btn" type="button" aria-label="Más acciones"><Icon name="three-dots" /></button></div>
      </div>
      <div className="tp-split">
        <div>
          <section className="tp-card"><h2>Datos</h2><dl className="tp-kv"><div><dt>Documento</dt><dd>12345678</dd></div><div><dt>Correo</dt><dd>ana.perez@ejemplo.edu</dd></div><div><dt>Teléfono</dt><dd>+51 999 000 111</dd></div><div><dt>Institución</dt><dd>Universidad Horizonte · Sede Central</dd></div><div><dt>Registrada</dt><dd>29 sep 2026</dd></div></dl></section>
          <section className="tp-card"><h2>Biometría</h2><dl className="tp-kv"><div><dt>Rostro</dt><dd>Registrado el 29 sep · calidad 92/100</dd></div><div><dt>Huella</dt><dd>2 dedos · calidad 86/100</dd></div><div><dt>Consentimiento</dt><dd>Aceptado el 29 sep · <a href="#" style={{ color: "var(--av-error-text)", fontWeight: 600 }}>Revocar</a></dd></div></dl></section>
        </div>
        <aside className="tp-night"><h2>Actividad reciente</h2>{feed}</aside>
      </div>
    </AppShell>
  );
}

/* ---------- Asistente electoral ---------- */
export function Asistente(_: S) {
  const steps = ["Datos", "Candidaturas", "Padrón", "Revisión"];
  return (
    <AppShell active="p">
      <PageHead crumb={<>Panel / Electoral / <b>Nueva elección</b></>} title="Nueva elección" sub="Elecciones de ejemplo · borrador guardado hace 2 min." />
      <div className="tp-card">
        <ol className="st__list tp-steps" aria-label="Pasos">
          {steps.map((s, i) => { const k = i < 2 ? "done" : i === 2 ? "now" : "pending"; return <li key={s} className="st__li" data-s={k} aria-current={i === 2 ? "step" : undefined}><span className="st__n" aria-hidden="true">{k === "done" ? "✓" : i + 1}</span><span className="st__t">{s}</span></li>; })}
        </ol>
        <h2>Padrón electoral</h2><p>Sube el listado de personas habilitadas para votar. Aceptamos CSV o Excel.</p>
        <div className="av-drop" tabIndex={0} role="button" aria-label="Subir padrón"><span className="ic"><Icon name="cloud-arrow-up" /></span><b>Arrastra el archivo aquí</b><p>o haz clic para elegirlo · CSV o XLSX · máx. 10 MB</p></div>
        <div style={{ marginTop: "1.1rem" }} className="av-alert av-alert--warning" role="status"><strong>1,240 personas leídas · 3 sin documento</strong>Puedes continuar: las 3 filas se pueden corregir luego en Personas.</div>
        <div className="tp-foot-bar"><span className="st__count">Paso 3 de 4</span><span style={{ display: "flex", gap: ".6rem" }}><button className="av-btn av-btn--ghost" type="button">Atrás</button><button className="av-btn av-btn--primary" type="button">Siguiente →</button></span></div>
      </div>
    </AppShell>
  );
}

/* ---------- Notificaciones ---------- */
function Notice({ icon, tone = "", title, desc, time, unread, action }: { icon: IconName; tone?: string; title: string; desc: string; time: string; unread: boolean; action: string }) {
  return (
    <div className={`tp-n${unread ? " unread" : ""}`}>
      <span className={`tp-n__ic ${tone}`}><Icon name={icon} /></span>
      <div><b>{title}</b><small>{desc} · {time}</small></div>
      <button className="av-btn av-btn--text" type="button" style={{ minHeight: 44 }}>{action}</button>
    </div>
  );
}
export function Notificaciones({ state }: S) {
  const data = state === "empty" ? <EmptyBlock icon="bell" title="No tienes notificaciones" text="Cuando haya novedades, aparecerán aquí." /> : state === "loading" ? <Skel n={6} /> : (
    <>
      <p className="tp-n-grp">Hoy</p>
      <Notice icon="camera-video-off" tone="tp-n__ic--warn" title="Dispositivo desconectado" desc="CAM-002 no responde desde las 08:10" time="hace 2 h" unread action="Ver dispositivo" />
      <Notice icon="x-circle" tone="tp-n__ic--bad" title="Verificación rechazada" desc="Lucía Ramos · LEC-002" time="hace 30 min" unread action="Ver detalle" />
      <Notice icon="person-plus" title="Persona registrada" desc="Valeria Quispe se registró en Sede Central" time="hace 1 h" unread action="Ver persona" />
      <p className="tp-n-grp">Ayer</p>
      <Notice icon="file-earmark-check" title="Padrón cargado" desc="1,240 personas · Elecciones de ejemplo" time="ayer, 17:20" unread={false} action="Ver padrón" />
      <Notice icon="shield-check" title="Cambio de umbral solicitado" desc="Pendiente de aprobación del administrador" time="ayer, 11:05" unread={false} action="Revisar" />
    </>
  );
  return (
    <AppShell active="p">
      <PageHead crumb={<>Panel / <b>Notificaciones</b></>} title="Notificaciones" sub="Lo que pasó mientras no mirabas." actions={<button className="av-btn av-btn--ghost" type="button">Marcar todas como leídas</button>} />
      <div className="tp-card">
        <div className="av-tabs" role="tablist" aria-label="Filtro" style={{ marginBottom: "1rem" }}><button className="av-tab" role="tab" aria-selected="true" type="button">Todas · 5</button><button className="av-tab" role="tab" aria-selected="false" type="button">Sin leer · 3</button></div>
        {data}
      </div>
    </AppShell>
  );
}

/* ---------- Perfil ---------- */
export function Perfil(_: S) {
  return (
    <AppShell active="p">
      <PageHead crumb={<>Panel / <b>Perfil</b></>} title="Tu perfil" sub="Datos de tu cuenta, seguridad y privacidad." />
      <div className="tp-cols">
        <aside className="tp-card" style={{ textAlign: "center" }}><span className="tp-ava" style={{ margin: "0 auto .8rem" }} aria-hidden="true">UD</span><b style={{ font: "500 1.2rem var(--av-font-heading)" }}>Usuario Demo</b>
          <p style={{ margin: ".2rem 0 .8rem", color: "var(--av-gray-600)", fontSize: ".875rem" }}>Administrador · Sede Central</p><Chip tone="success">Biometría registrada</Chip></aside>
        <div>
          <section className="tp-card"><h2>Datos personales</h2><p>El correo no se puede cambiar desde aquí.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="av-field"><label className="av-label" htmlFor="n">Nombre</label><input className="av-input" id="n" defaultValue="Usuario Demo" /></div>
              <div className="av-field"><label className="av-label" htmlFor="t">Teléfono</label><input className="av-input" id="t" defaultValue="+51 999 000 111" /></div>
              <div className="av-field" style={{ gridColumn: "1/-1" }}><label className="av-label" htmlFor="c">Correo</label><input className="av-input" id="c" defaultValue="usuario@ejemplo.edu" readOnly /></div>
            </div><div style={{ marginTop: "1rem" }}><button className="av-btn av-btn--primary" type="button">Guardar</button></div></section>
          <section className="tp-card"><h2>Seguridad</h2><p>Contraseña y sesiones abiertas.</p>
            <div className="tp-row"><div><b>Contraseña</b><small>Cambiada hace 3 meses</small></div><button className="av-btn av-btn--ghost" type="button">Cambiar</button></div>
            <div className="tp-row"><div><b>Este dispositivo · Windows, Edge</b><small>Lima · activa ahora</small></div><Chip tone="info">Sesión actual</Chip></div>
            <div className="tp-row"><div><b>Móvil · Android, Chrome</b><small>Lima · hace 2 días</small></div><button className="av-btn av-btn--ghost" type="button">Cerrar sesión</button></div></section>
          <section className="tp-card"><h2>Biometría y privacidad</h2><p>Guardamos una plantilla matemática, nunca fotos.</p>
            <div className="tp-row"><div><b>Rostro</b><small>Registrado el 29 sep</small></div><Chip tone="success">Activo</Chip></div>
            <div className="tp-row"><div><b>Huella</b><small>2 dedos · 29 sep</small></div><Chip tone="success">Activo</Chip></div>
            <div style={{ marginTop: ".6rem" }}><button className="av-btn av-btn--text" type="button" style={{ color: "var(--av-error-text)" }}>Retirar mi consentimiento…</button></div></section>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------- Acceso y cuenta ---------- */
/** Login: los errores se deciden por el `code` de la API (contrato de Auth v0.2). */
export function Login({ state }: S) {
  const busy = state === "cargando", lock = state === "bloqueado";
  const off = busy || lock;
  return (
    <AuthFrame>
      <h1 className="tp-h1">Bienvenido de nuevo.</h1>
      <p className="tp-p">Ingresa con tu cuenta de <b>Universidad Horizonte</b>.</p>
      {state === "error" && <Block tone="error" title="Correo o contraseña incorrectos" role="alert">Revisa los datos e inténtalo de nuevo. Por seguridad no indicamos cuál de los dos falló.</Block>}
      {lock && <Block tone="warning" title="Demasiados intentos" role="alert">Por seguridad bloqueamos el acceso un momento. Podrás volver a intentarlo en <b>14:32</b>.</Block>}
      {state === "inesperado" && <Block tone="error" title="Algo falló de nuestro lado" role="alert">No pudimos iniciar tu sesión. Inténtalo de nuevo; si sigue pasando, comparte este código con tu administrador: <span className="mono">7f3c9a1e</span></Block>}
      <AField id="lg-em" label="Correo electrónico" value={state === "normal" ? "" : "ana@horizonte.edu"} type="email" autoComplete="username" placeholder="nombre@organizacion.com" disabled={off} />
      <AField id="lg-pw" label="Contraseña" value={state === "normal" ? "" : "contrasena-demo"} type="password" autoComplete="current-password" placeholder="Ingresa tu contraseña" disabled={off} />
      {busy ? <Wide busy disabled>Ingresando…</Wide> : <Wide disabled={lock}>Ingresar de forma segura →</Wide>}
      <p className="tp-p" style={{ marginTop: "1rem", fontSize: ".82rem" }}>¿Olvidaste tu contraseña? La recuperación aún no está disponible; contacta a tu administrador.</p>
    </AuthFrame>
  );
}

export function Tenant(_: S) {
  return (
    <AuthFrame claim="Cada organización, su propio espacio.">
      <span className="mono" style={{ color: "var(--av-gray-500)" }}>Error 404 · Organización no encontrada</span>
      <h1 className="tp-h1">No encontramos esta organización.</h1>
      <p className="tp-p">La dirección que abriste no corresponde a una organización de Averyn. Revisa que esté bien escrita o pide el enlace correcto a tu administrador.</p>
      <Block tone="info" title="Código de soporte">TENANT_NOT_FOUND · <span className="mono">7f3c9a1e</span></Block>
      <p className="tp-p" style={{ fontSize: ".82rem" }}>No decimos por qué: la misma pantalla aparece si la organización no existe o no está disponible.</p>
    </AuthFrame>
  );
}

export function Recuperar({ state }: S) {
  let body: ReactNode;
  if (state === "enviado") body = (<><h1 className="tp-h1">Revisa tu correo</h1><p className="tp-p">Si hay una cuenta con ese correo, te enviamos un enlace para elegir una nueva contraseña. Puede tardar unos minutos; revisa también la carpeta de spam.</p>
    <Block tone="info" title="Por seguridad no confirmamos si el correo existe">El mensaje es el mismo para cualquier dirección.</Block><Wide variant="ghost" disabled>Reenviar enlace (disponible en 30 s)</Wide></>);
  else if (state === "nueva") body = (<><h1 className="tp-h1">Elige una nueva contraseña</h1><p className="tp-p">Usa al menos 10 caracteres. Este enlace solo sirve una vez.</p>
    <AField id="p1" label="Nueva contraseña" value="Horizonte26" type="password" />
    <div className="pw" data-lv="3" style={{ margin: "-.2rem 0 .3rem" }}><div className="pw__bar" aria-hidden="true"><i /><i /><i /><i /></div><p className="pw__st">Seguridad: Buena. Cumples 3 de 4 requisitos.</p></div>
    <AField id="p2" label="Confirma la contraseña" type="password" /><Wide>Guardar contraseña</Wide></>);
  else if (state === "vencido") body = (<><h1 className="tp-h1">Este enlace venció</h1><p className="tp-p">Por seguridad, los enlaces de recuperación duran 30 minutos y solo se pueden usar una vez.</p>
    <Block tone="warning" title="No pasa nada: puedes pedir uno nuevo">Te lo enviaremos al mismo correo.</Block><Wide>Pedir un enlace nuevo</Wide></>);
  else body = (<><h1 className="tp-h1">Recupera tu acceso</h1><p className="tp-p">Escribe el correo de tu cuenta y te enviaremos un enlace para elegir una nueva contraseña.</p>
    <AField id="em" label="Correo electrónico" placeholder="nombre@organizacion.com" type="email" /><Wide>Enviar enlace →</Wide></>);
  return <AuthFrame><BackLink />{body}</AuthFrame>;
}

export function Segundo({ state }: S) {
  const vals = state === "ok" ? "482913" : "";
  const msg = state === "error" ? "Código incorrecto. Te quedan 2 intentos." : state === "bloqueado" ? "Demasiados intentos. Vuelve a intentarlo en 5 minutos." : state === "ok" ? "Identidad confirmada." : "";
  return (
    <AuthFrame>
      <BackLink />
      <h1 className="tp-h1">Confirma que eres tú</h1>
      <p className="tp-p">Ingresa el código de 6 dígitos que enviamos a <b>a•••@ejemplo.edu</b>.</p>
      <fieldset className="otp" data-s={state === "error" ? "error" : state === "ok" ? "ok" : ""}>
        <legend className="sr-only">Código de verificación</legend>
        <div className="otp__row">{Array.from({ length: 6 }, (_, i) => <input key={i} className="otp__d" defaultValue={vals[i] ?? ""} aria-label={`Dígito ${i + 1} de 6`} disabled={state === "bloqueado" || state === "ok"} />)}</div>
        <p className="otp__msg" role="status">{msg}</p>
      </fieldset>
      <Wide disabled={state === "bloqueado"}>{state === "ok" ? "Continuar →" : "Verificar"}</Wide>
      <p className="tp-p" style={{ margin: ".4rem 0 0", textAlign: "center" }}>¿No te llegó? <a href="#" className="tp-link">Reenviar código</a> · <a href="#" className="tp-link">Usar otro método</a></p>
    </AuthFrame>
  );
}

export function Institucion({ state }: S) {
  const rows = [["Universidad Horizonte", "Sede Central · Lima"], ["Universidad Horizonte", "Sede Norte · Trujillo"], ["Instituto Cima", "Campus Arequipa"]];
  return (
    <AuthFrame claim="Una cuenta, varias instituciones.">
      {state === "sin" ? (
        <><h1 className="tp-h1">Tu cuenta aún no tiene instituciones</h1><p className="tp-p">Pide a tu administrador que te agregue a una institución para continuar.</p>
          <Block tone="info" title="Te avisaremos por correo">Cuando te agreguen, podrás entrar con esta misma cuenta.</Block><Wide variant="ghost">Cerrar sesión</Wide></>
      ) : (
        <><h1 className="tp-h1">Elige tu institución</h1><p className="tp-p">Tu cuenta pertenece a más de una. Puedes cambiar de institución después desde tu perfil.</p>
          <div className="tp-inst" role="radiogroup" aria-label="Institución">{rows.map((r, i) => <label key={r[1]} className="tp-inst__o"><input type="radio" name="inst" defaultChecked={i === 0} /><span><b>{r[0]}</b><small>{r[1]}</small></span></label>)}</div>
          <Wide>Continuar →</Wide></>
      )}
    </AuthFrame>
  );
}

export function Invitacion({ state }: S) {
  let body: ReactNode;
  if (state === "vencida") body = (<><h1 className="tp-h1">Esta invitación venció</h1><p className="tp-p">Las invitaciones duran 48 horas. Pide una nueva a quien te invitó.</p><Block tone="warning" title="Invitada por Carlos Mendoza">Universidad Horizonte · enviada el 28 sep 2026</Block><Wide variant="ghost">Volver al inicio</Wide></>);
  else if (state === "usada") body = (<><h1 className="tp-h1">Esta invitación ya se usó</h1><p className="tp-p">Si ya creaste tu cuenta, ingresa con tu correo y tu contraseña.</p><Wide>Ingresar →</Wide></>);
  else body = (<><span className="mono" style={{ color: "var(--av-gray-500)" }}>Invitación de Carlos Mendoza</span><h1 className="tp-h1">Te invitaron a Averyn</h1><p className="tp-p"><b>Universidad Horizonte</b> te invitó a crear tu cuenta. Tardas unos minutos.</p>
    <AField id="inv-n" label="Nombre completo" value="Ana Torres" /><AField id="inv-p" label="Crea una contraseña" type="password" placeholder="Al menos 10 caracteres" />
    <label className="av-check"><input type="checkbox" /> Acepto los términos de uso</label>
    <p className="tp-p" style={{ margin: 0 }}>El consentimiento para usar tu rostro y huella se pide más adelante, antes de la primera captura.</p><Wide>Crear mi cuenta →</Wide></>);
  return <AuthFrame claim="Bienvenido a tu panel.">{body}</AuthFrame>;
}

/* ---------- Escrutinio, mesas y roles (propuesta de diseño; fuera del MVP oficial) ---------- */
const fmtN = (n: number) => n.toLocaleString("es-PE");
const Kpi = ({ l, v, n }: { l: string; v: string; n: string }) => (<article className="kt"><h3 className="cc__label" style={{ margin: 0 }}>{l}</h3><p className="cc__value">{v}</p><p className="cc__meta"><span>{n}</span></p></article>);

export function Escrutinio({ state }: S) {
  const fin = state === "final";
  if (state === "sin") return (
    <AppShell active="p"><PageHead crumb={<>Panel / Electoral / <b>Escrutinio</b></>} title="Escrutinio" sub="Elecciones de ejemplo" />
      <div className="tp-card"><EmptyBlock icon="inbox" title="Aún no hay mesas reportadas" text="Cuando la primera mesa reporte, aquí aparecerán la participación y los votos por lista." /></div></AppShell>
  );
  const lists: [string, number][] = fin ? [["Lista 1 · Horizonte", 1021], ["Lista 2 · Cima", 812], ["Lista 3 · Raíz", 487], ["Voto en blanco", 128]] : [["Lista 1 · Horizonte", 812], ["Lista 2 · Cima", 648], ["Lista 3 · Raíz", 391], ["Voto en blanco", 102]];
  const tot = lists.reduce((s, l) => s + l[1], 0), max = Math.max(...lists.map((l) => l[1]));
  const mesas: [string, string, ChipTone, string, IconName, string, string][] = [
    ["Mesa 01", "Aula 101", "success", "Reportada", "check-circle", "312", "19:42"], ["Mesa 02", "Aula 102", "success", "Reportada", "check-circle", "298", "19:48"],
    ["Mesa 03", "Aula 201", "info", "En conteo", "hourglass-split", "—", "—"], ["Mesa 04", "Auditorio", "neutral", "Sin reportar", "clock", "—", "—"], ["Mesa 05", "Biblioteca", "success", "Reportada", "check-circle", "276", "19:55"],
  ];
  const rows = fin ? mesas.map((m): typeof m => [m[0], m[1], "success", "Reportada", "check-circle", m[5] === "—" ? "254" : m[5], m[6] === "—" ? "20:10" : m[6]]) : mesas;
  const part = fin ? 81 : 72;
  return (
    <AppShell active="p">
      <PageHead crumb={<>Panel / Electoral / <b>Escrutinio</b></>} title="Escrutinio" sub="Elecciones de ejemplo · actualizado hace 2 min"
        actions={<><Chip tone={fin ? "success" : "info"} icon={fin ? "check-circle" : "hourglass-split"}>{fin ? "Resultados finales" : "En conteo"}</Chip> <button className="av-btn av-btn--ghost" type="button">Exportar acta</button></>} />
      <div className="kpi-grid" style={{ marginBottom: "1rem" }}>
        <Kpi l="Participación" v={`${part}%`} n={`Meta 80% · ${fin ? "cumplida" : "por debajo"}`} /><Kpi l="Mesas reportadas" v={fin ? "24 de 24" : "18 de 24"} n={fin ? "Todas las mesas" : "6 por reportar"} /><Kpi l="Votos emitidos" v={fmtN(tot)} n="de 2,712 habilitados" />
      </div>
      <div className="tp-split">
        <div className="tp-card"><h2>Votos por lista</h2><p>Totales por opción. Los porcentajes se calculan sobre los votos emitidos.</p>
          <ul className="hb">{lists.map((l) => <li key={l[0]} className="hb__row" style={{ gridTemplateColumns: "minmax(0,11rem) minmax(0,1fr) 8.5rem" }}><span className="hb__name">{l[0]}</span><span className="hb__track" role="img" aria-label={`${l[0]}: ${l[1]} votos`}><span className="hb__fill" style={{ width: `${(l[1] / max) * 100}%`, animation: "none" }} /></span><span className="hb__val">{fmtN(l[1])} · {((l[1] / tot) * 100).toFixed(1)}%</span></li>)}</ul></div>
        <div className="tp-card"><h2>Participación frente a la meta</h2><p>Votos emitidos entre habilitados.</p>
          <ul className="bl"><li className="bl__row" style={{ gridTemplateColumns: "minmax(0,5rem) minmax(0,1fr) 3.4rem" }}><span className="hb__name">General</span><span className="bl__track" role="img" aria-label={`Participación ${part}% de una meta de 80%`}><span className="bl__fill" style={{ width: `${part}%`, animation: "none" }} /><span className="bl__goal" style={{ left: "calc(80% - 1px)" }} /></span><span className="hb__val">{part}%</span></li></ul></div>
      </div>
      <div className="tp-card" style={{ marginTop: "1rem" }}><h2>Mesas</h2><p>Estado de cada mesa y votos reportados.</p>
        <table className="tp-t"><thead><tr><th>Mesa</th><th>Local</th><th>Estado</th><th>Votos</th><th>Reportada</th></tr></thead>
          <tbody>{rows.map((m) => <tr key={m[0]}><td className="tp-ev">{m[0]}</td><td>{m[1]}</td><td><Chip tone={m[2]} icon={m[4]}>{m[3]}</Chip></td><td className="tp-mono">{m[5]}</td><td className="tp-mono">{m[6]}</td></tr>)}</tbody></table></div>
      <div style={{ marginTop: "1rem" }}><Block tone="info" title="Solo se muestran totales">Ningún dato de esta pantalla permite saber quién votó por quién.</Block></div>
    </AppShell>
  );
}

export function Mesas({ state }: S) {
  const rows: [string, string, string, string, ChipTone, string, IconName][] = [
    ["Mesa 01", "Aula 101", "312", "Carla Rojas", "success", "Asignada", "check-circle"], ["Mesa 02", "Aula 102", "305", "Diego Torres", "success", "Asignada", "check-circle"],
    ["Mesa 03", "Aula 201", "298", "—", "warning", "Sin responsable", "exclamation-circle"], ["Mesa 04", "Auditorio", "420", "Lucía Ramos", "success", "Asignada", "check-circle"], ["Mesa 05", "Biblioteca", "276", "—", "warning", "Sin responsable", "exclamation-circle"],
  ];
  const data = state === "vacio" ? <EmptyBlock icon="grid-3x3-gap" title="Aún no hay mesas" text="Importa el padrón para crearlas automáticamente o añade la primera a mano." button="Importar padrón" /> : (
    <>
      <table className="tp-t"><thead><tr><th>Mesa</th><th>Local</th><th>Habilitados</th><th>Responsable</th><th>Estado</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}><td className="tp-ev">{r[0]}</td><td>{r[1]}</td><td className="tp-mono">{r[2]}</td><td>{r[3] === "—" ? "Sin asignar" : r[3]}</td><td><Chip tone={r[4]} icon={r[6]}>{r[5]}</Chip></td></tr>)}</tbody></table>
      <div className="tp-foot"><span>Mostrando 1–5 de 24 mesas</span><StaticPager /></div>
    </>
  );
  return (
    <AppShell active="p">
      <PageHead crumb={<>Panel / Electoral / <b>Mesas y padrón</b></>} title="Mesas y padrón" sub="24 mesas · 2,712 personas habilitadas" actions={<><button className="av-btn av-btn--ghost" type="button">Importar padrón</button> <button className="av-btn av-btn--primary" type="button">Nueva mesa</button></>} />
      <div className="tp-bar"><input className="av-input" type="search" placeholder="Buscar mesa o responsable" aria-label="Buscar" /><select className="av-select" aria-label="Estado"><option>Todos los estados</option></select></div>
      <div className="tp-card">{data}</div>
    </AppShell>
  );
}

export function Roles({ state }: S) {
  const dirty = state === "cambios";
  const R = ["Administrador", "Operador", "Auditor", "Solo lectura"];
  const P: [string, number[]][] = [["Ver personas", [1, 1, 1, 1]], ["Registrar personas", [1, 1, 0, 0]], ["Verificar identidad", [1, 1, 0, 0]], ["Ver la bitácora", [1, 0, 1, 0]], ["Exportar datos", [1, 0, 1, 0]], ["Revocar consentimientos", [1, 0, 0, 0]], ["Administrar usuarios y roles", [1, 0, 0, 0]]];
  return (
    <AppShell active="p">
      <PageHead crumb={<>Panel / Configuración / <b>Roles y permisos</b></>} title="Roles y permisos" sub="Qué puede hacer cada rol en tu institución." />
      {dirty && <><Block tone="warning" title="Quitar permisos a Administrador pide confirmación">Al guardar te pediremos que lo confirmes.</Block><div style={{ height: "1rem" }} /></>}
      <div className="tp-card">
        <table className="tp-t tp-matrix"><thead><tr><th scope="col">Permiso</th>{R.map((r) => <th key={r} scope="col" style={{ textAlign: "center" }}>{r}</th>)}</tr></thead>
          <tbody>{P.map((p, ri) => <tr key={p[0]}><th scope="row">{p[0]}</th>{p[1].map((v, ci) => {
            const locked = ri === P.length - 1 && ci === 0;
            const on = (v && !(dirty && ri === 3 && ci === 1)) || (dirty && ri === 3 && ci === 1);
            return <td key={ci} style={{ textAlign: "center" }}>{locked ? <span className="tp-lock"><Icon name="lock" /> Siempre</span> : <input type="checkbox" defaultChecked={!!on} aria-label={`${R[ci]}: ${p[0]}`} />}</td>;
          })}</tr>)}</tbody></table>
      </div>
      {dirty
        ? <div className="tp-save"><span><Icon name="dot" style={{ color: "var(--av-blue)" }} />Tienes 1 cambio sin guardar.</span><span style={{ display: "flex", gap: ".6rem" }}><button className="av-btn av-btn--ghost" type="button">Descartar</button><button className="av-btn av-btn--primary" type="button">Guardar cambios</button></span></div>
        : <p className="tp-p" style={{ marginTop: "1rem" }}>El rol Administrador siempre puede administrar usuarios: no se puede quitar para evitar que la institución se quede sin administración.</p>}
    </AppShell>
  );
}

export const TEMPLATES: Record<string, (p: S) => ReactNode> = {
  bitacora: Bitacora, configuracion: Configuracion, persona: Persona, asistente: Asistente, notificaciones: Notificaciones, perfil: Perfil,
  login: Login, tenant: Tenant, recuperar: Recuperar, segundo: Segundo, institucion: Institucion, invitacion: Invitacion,
  escrutinio: Escrutinio, mesas: Mesas, roles: Roles,
};
