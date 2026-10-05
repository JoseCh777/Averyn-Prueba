"use client";
/* Demostraciones interactivas de la página «Componentes» (antes: componentes.js y foundations.js). Datos ficticios. */
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  Accordion, ActionMenu, ActiveFilters, Alert, Avatar, Button, Chip, Combobox, CommandPalette, DataTable, DateRangePicker, Drawer, FileUpload, Icon,
  IconButton, KeyValue, Modal, MultiSelect, OtpInput, Pager, PasswordInput, PasswordWithStrength, Popover, SearchField, Stepper, Switch, Tabs, ValidatedForm,
  Mark, useToast, type DateRange,
} from "@/components/ui";
import { normalize } from "@/components/ui/combobox";

const TODAY = new Date(2026, 9, 2);

/* ---------- Botones y campos ---------- */
export function ButtonLoadDemo() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <button className="hz-btn hz-btn--primary" type="button" disabled={busy} onClick={() => { setBusy(true); setTimeout(() => { setBusy(false); toast({ title: "Verificación completada", text: "Ana Torres · Rostro verificado", kind: "ok" }); }, 1400); }}>
      <span className="hz-spin" aria-hidden="true" hidden={!busy} /><span>{busy ? "Verificando..." : "Probar estado de carga"}</span>
    </button>
  );
}

export function PasswordFieldDemo() {
  return <PasswordInput id="f-pass" placeholder="Ingresa tu contraseña" autoComplete="current-password" />;
}

export function SwitchDemo() {
  const [on, setOn] = useState(true);
  return <Switch id="sw1" label="Notificaciones por correo" checked={on} onCheckedChange={setOn} />;
}

/* ---------- Navegación ---------- */
export function AvatarMenuDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape" && open) { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("click", click); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("click", click); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <div ref={ref}>
      <div className="row" style={{ gap: 8 }}>
        <IconButton aria-label="Buscar"><Icon name="search" /></IconButton>
        <IconButton aria-label="Notificaciones, 3 sin leer" badge={3}><Icon name="bell" /></IconButton>
        <button ref={btn} className="hz-avatar" type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="hz-avatar__c" aria-hidden="true">UD</span><span><b>Usuario Demo</b><small>Administrador</small></span>
        </button>
      </div>
      <div className="row" style={{ justifyContent: "flex-end", marginTop: ".8rem" }}>
        <div className="hz-menu" role="menu" hidden={!open}>
          <button type="button" role="menuitem" onClick={() => setOpen(false)}><Icon name="box-arrow-right" />Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}

export function TabsPagerDemo() {
  const [page, setPage] = useState(1);
  return (
    <>
      <Tabs label="Ejemplo de pestañas" tabs={[{ label: "Todas", content: "8 personas en el catálogo." }, { label: "Verificadas", content: "5 personas verificadas." }, { label: "Pendientes", content: "3 personas pendientes de verificación." }]} />
      <div style={{ marginTop: "1.4rem" }}><Pager page={page} pages={3} onPage={setPage} /></div>
    </>
  );
}

/* ---------- Feedback ---------- */
export function ToastButtons() {
  const toast = useToast();
  return (
    <div className="row row--col">
      <button className="hz-btn hz-btn--ghost" type="button" onClick={() => toast({ title: "Persona registrada", text: "El registro se guardó correctamente.", kind: "ok" })}>Registrar persona</button>
      <button className="hz-btn hz-btn--ghost" type="button" onClick={() => toast({ title: "Verificación rechazada", text: "La huella no coincidió. Puedes reintentar.", kind: "bad" })}>Rechazar verificación</button>
      <button className="hz-btn hz-btn--ghost" type="button" onClick={() => toast({ title: "Reintento requerido", text: "La calidad de la captura es baja.", kind: "warn" })}>Pedir reintento</button>
    </div>
  );
}

export function ModalDemo() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="hz-btn hz-btn--danger" type="button" onClick={() => setOpen(true)}>Eliminar persona</button>
      <Modal open={open} onClose={() => setOpen(false)} title="¿Eliminar a Ana Torres?"
        actions={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button variant="danger" onClick={() => { setOpen(false); toast({ title: "Persona eliminada", text: "Ana Torres se eliminó del catálogo.", kind: "bad" }); }}>Eliminar</Button></>}>
        <p>Se borrarán su registro y sus datos biométricos. Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
}

/* ---------- Componentes avanzados ---------- */
export function DatePickerDemo() {
  const [range, setRange] = useState<DateRange>({ from: new Date(2026, 8, 3), to: TODAY, label: "Últimos 30 días" });
  const toast = useToast();
  return <DateRangePicker today={TODAY} value={range} onChange={(r) => { setRange(r); toast({ title: "Periodo aplicado", text: r.label, kind: "ok" }); }} />;
}

export function ActionMenuDemo() {
  const toast = useToast();
  const say = (t: string, d: string) => () => toast({ title: t, text: d, kind: "ok" });
  return (
    <ActionMenu label="Acciones de Ana Lucía Pérez" items={[
      { label: "Ver detalle", icon: "eye", onSelect: say("Ver detalle", "Aquí se ejecutaría la acción.") },
      { label: "Editar datos", icon: "pencil", onSelect: say("Editar datos", "Aquí se ejecutaría la acción.") },
      { label: "Duplicar", icon: "files", onSelect: say("Duplicar", "Aquí se ejecutaría la acción.") },
      "separator",
      { label: "Eliminar…", icon: "trash3", danger: true, onSelect: say("Eliminar…", "Aquí se pediría confirmar antes de eliminar.") },
    ]} />
  );
}

export function ComboboxDemo() {
  const toast = useToast();
  return (
    <Combobox label="Institución" options={[
      { title: "Universidad Horizonte", detail: "Sede Central · Lima" }, { title: "Universidad Horizonte", detail: "Sede Norte · Trujillo" }, { title: "Instituto Cima", detail: "Campus Arequipa" },
      { title: "Instituto Raíz", detail: "Sede Cusco" }, { title: "Colegio Albor", detail: "Lima Norte" }, { title: "Colegio Aurora", detail: "Piura" },
      { title: "Municipalidad de Miraflores", detail: "Lima" }, { title: "Centro Técnico Brújula", detail: "Huancayo" },
    ]} onChoose={(o) => toast({ title: "Institución elegida", text: `${o.title} · ${o.detail}`, kind: "ok" })} />
  );
}

export function AccordionDemo() {
  const id = useId();
  const [multi, setMulti] = useState(false);
  return (
    <>
      <label className="hz-switch" style={{ marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: ".7rem", minHeight: 44 }} htmlFor={id}>
        <input type="checkbox" id={id} checked={multi} onChange={(e) => setMulti(e.target.checked)} /> <span>Permitir abrir varios</span>
      </label>
      <Accordion multiple={multi} items={[
        { title: "¿Qué datos biométricos se guardan?", content: <p style={{ margin: 0 }}>Una plantilla matemática de tu rostro y tu huella. No guardamos fotos ni imágenes de la huella.</p> },
        { title: "¿Quién puede ver mis datos?", content: <p style={{ margin: 0 }}>Solo el personal autorizado de tu institución, y cada consulta queda registrada en la bitácora de auditoría.</p> },
        { title: "¿Puedo retirar mi consentimiento?", content: <p style={{ margin: 0 }}>Sí, desde tu perfil o escribiendo a tu administrador. Al retirarlo se eliminan tus plantillas biométricas.</p> },
        { title: "¿Qué pasa si la cámara no funciona?", content: <p style={{ margin: 0 }}>Revisa los permisos del navegador y vuelve a intentarlo. Si sigue igual, avisa a tu administrador.</p> },
      ]} />
    </>
  );
}

export function StepperDemo() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [err, setErr] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const info = (t: string) => <div className="hz-alert hz-alert--info"><strong>Vista de ejemplo</strong>{t}</div>;
  return (
    <Stepper label="Pasos del registro" onFinish={() => { toast({ title: "Persona registrada", text: "Aquí se guardaría el registro.", kind: "ok" }); setName(""); }}
      steps={[
        { title: "Datos", heading: "Datos de la persona", validate: () => { const bad = !name.trim(); setErr(bad); if (bad) input.current?.focus(); return !bad; },
          content: (<>
            <p>Empieza por lo básico. Puedes corregirlo después.</p>
            <div className="hz-field"><label className="hz-label" htmlFor="st-name">Nombre completo</label>
              <input ref={input} className="hz-input" id="st-name" autoComplete="off" aria-describedby="st-err" aria-invalid={err || undefined} value={name} onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setErr(false); }} />
              <span className="hz-err" id="st-err" hidden={!err}><Icon name="exclamation-circle" /> Escribe el nombre para continuar.</span></div>
          </>) },
        { title: "Documento", content: (<><p>Captura el documento de identidad con la cámara.</p>{info("Aquí iría la captura de documento (ver Patrones de Averyn).")}</>) },
        { title: "Biometría", content: (<><p>Rostro y huella, con el consentimiento de la persona.</p>{info("Aquí irían la captura facial y de huella.")}</>) },
        { title: "Confirmar", content: (<><p>Revisa los datos antes de guardar.</p><KeyValue items={[{ term: "Nombre", value: name.trim() || "—" }, { term: "Documento", value: "Capturado" }, { term: "Biometría", value: "Rostro y huella" }]} /></>) },
      ]} />
  );
}

export function PopoverDemo() {
  return (
    <Popover trigger="¿Qué es el umbral?" title="Umbral de similitud">
      <p>Es el puntaje mínimo (de 0 a 1) para aceptar una verificación. Hoy es 0.68 y lo define el servidor.</p>
      <Link href="/patrones#resultado" className="hz-btn hz-btn--text" style={{ minHeight: 44 }}>Ver el patrón de resultado →</Link>
    </Popover>
  );
}

export function DrawerDemo() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="hz-btn hz-btn--ghost" type="button" onClick={() => setOpen(true)}>Ver detalle de Ana Lucía Pérez</button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Ana Lucía Pérez" subtitle="Estudiante · Sede Central"
        footer={<><Button onClick={() => toast({ title: "Editar datos", text: "Aquí se abriría el formulario de edición.", kind: "ok" })}>Editar datos</Button><Button variant="ghost" onClick={() => setOpen(false)}>Cerrar</Button></>}>
        <KeyValue items={[{ term: "Documento", value: "12345678" }, { term: "Correo", value: "ana.perez@ejemplo.edu" }, { term: "Biometría", value: <Chip tone="success" icon="check-circle">Rostro y huella</Chip> }, { term: "Último acceso", value: "Hoy, 10:42 · CAM-001" }, { term: "Registrada", value: "29 sep 2026" }]} />
        <h4 style={{ margin: "1.4rem 0 .4rem", font: "500 .75rem var(--av-font-mono)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--av-gray-600)" }}>Actividad reciente</h4>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "grid", gap: ".4rem", fontSize: ".875rem", color: "var(--av-gray-700)" }}><li>BIOMETRIC_VERIFIED · hoy, 10:42</li><li>LOGIN · ayer, 08:15</li><li>BIOMETRIC_ENROLLED · 29 sep</li></ul>
      </Drawer>
    </>
  );
}

export function CommandDemo() {
  const toast = useToast();
  const go = (t: string) => () => toast({ title: t, text: `Aquí se abriría «${t}».`, kind: "ok" });
  return (
    <CommandPalette commands={[
      { group: "Ir a", icon: "grid-1x2", label: "Panel", run: go("Panel") }, { group: "Ir a", icon: "people", label: "Personas", run: go("Personas") },
      { group: "Ir a", icon: "file-earmark-text", label: "Documentos", run: go("Documentos") }, { group: "Ir a", icon: "fingerprint", label: "Biometría", run: go("Biometría") },
      { group: "Ir a", icon: "door-open", label: "Accesos", soon: true }, { group: "Ir a", icon: "clipboard-data", label: "Reportes y auditoría", soon: true },
      { group: "Acciones", icon: "person-plus", label: "Registrar persona", run: go("Registrar persona") }, { group: "Acciones", icon: "shield-check", label: "Verificar identidad", run: go("Verificar identidad") },
      { group: "Acciones", icon: "box-arrow-right", label: "Cerrar sesión", run: go("Cerrar sesión") },
    ]} openLabel="Abrir paleta" />
  );
}

const PEOPLE = [
  ["Ana Lucía Pérez", "12345678", "Estudiante", "on", "2026-10-02T10:42"], ["Carlos Mendoza", "23456789", "Docente", "on", "2026-10-02T09:15"], ["Lucía Ramos", "34567890", "Estudiante", "off", "2026-09-28T17:30"],
  ["Diego Torres", "45678901", "Empleado", "on", "2026-10-01T08:05"], ["Valeria Quispe", "56789012", "Estudiante", "pend", "2026-09-30T12:20"], ["Jorge Salazar", "67890123", "Docente", "on", "2026-10-02T07:50"],
  ["Mariana Cruz", "78901234", "Estudiante", "on", "2026-10-01T15:40"], ["Andrés Vega", "89012345", "Empleado", "off", "2026-09-20T11:10"], ["Camila Rojas", "90123456", "Estudiante", "on", "2026-10-02T10:01"],
  ["Renzo Paredes", "11223344", "Docente", "pend", "2026-09-29T16:45"], ["Sofía Medina", "22334455", "Estudiante", "on", "2026-10-01T09:30"], ["Hugo Castillo", "33445566", "Empleado", "on", "2026-09-30T18:05"],
].map((p, i) => ({ id: i, name: p[0], doc: p[1], role: p[2], status: p[3] as "on" | "off" | "pend", last: p[4] }));
const STATUS = { on: ["success", "Activa"], off: ["neutral", "Inactiva"], pend: ["warning", "Pendiente"] } as const;
const fmtDate = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });

export function TableDemo() {
  const toast = useToast();
  return (
    <DataTable
      label="Tabla de personas" rows={PEOPLE} searchKeys={["name", "doc"]} searchLabel="Buscar personas" searchPlaceholder="Buscar persona o documento" who={{ key: "name", detail: "role" }}
      columns={[
        { key: "name", header: "Nombre", sortable: true }, { key: "doc", header: "Documento", mono: true, sortable: true },
        { key: "status", header: "Estado", render: (r) => <Chip tone={STATUS[r.status][0]}>{STATUS[r.status][1]}</Chip> },
        { key: "last", header: "Último acceso", mono: true, sortable: true, render: (r) => fmtDate.format(new Date(r.last)).replace(/\./g, "") },
      ]}
      bulkActions={() => (<>
        <Button variant="ghost" style={{ minHeight: 44 }} onClick={() => toast({ title: "Exportar", text: "Se exportarían las filas seleccionadas.", kind: "ok" })}>Exportar</Button>
        <Button variant="ghost" style={{ minHeight: 44 }} onClick={() => toast({ title: "Desactivar", text: "Aquí se pediría confirmación antes de desactivar.", kind: "ok" })}>Desactivar</Button>
      </>)}
    />
  );
}

const SEARCH_PEOPLE = [["Ana Torres", "10234567"], ["Luis Pérez", "10345678"], ["Laura Díaz", "10456789"], ["Andrés Molina", "10567890"], ["Carlos Mendoza", "23456789"], ["Valeria Quispe", "56789012"]];
export function SearchDemo() {
  const [q, setQ] = useState("");
  const r = SEARCH_PEOPLE.filter(([n, d]) => !q.trim() || normalize(`${n} ${d}`).includes(normalize(q.trim())));
  const count = !q.trim() ? `${SEARCH_PEOPLE.length} personas` : r.length ? `${r.length} ${r.length === 1 ? "resultado" : "resultados"}` : `Sin resultados para «${q.trim()}». Revisa la ortografía o prueba con el documento.`;
  return (
    <>
      <SearchField label="Buscar personas" placeholder="Buscar por nombre o documento" value={q} onChange={setQ} countText={count} />
      <ul className="sf__list">{r.map(([n, d]) => <li key={n}><span><Mark text={n} query={q.trim()} /></span><span className="mono"><Mark text={d} query={q.trim()} /></span></li>)}</ul>
    </>
  );
}

export function OtpDemo() {
  const toast = useToast();
  const [state, setState] = useState<{ s: "" | "error" | "ok"; m: string }>({ s: "", m: "" });
  const [tries, setTries] = useState(3);
  const [wait, setWait] = useState(10);
  useEffect(() => { if (wait <= 0) return; const t = setTimeout(() => setWait((w) => w - 1), 1000); return () => clearTimeout(t); }, [wait]);
  const locked = tries <= 0;
  return (
    <OtpInput state={state.s} message={state.m} help={<>Escribe los 6 dígitos que enviamos a ana@ejemplo.edu. En esta demo el código correcto es <b>482913</b>.</>}
      onComplete={(c) => {
        if (locked) return;
        if (c === "482913") setState({ s: "ok", m: "Correo confirmado." });
        else { const t = tries - 1; setTries(t); setState({ s: "error", m: t <= 0 ? "Demasiados intentos. Vuelve a intentarlo en 5 minutos." : `Código incorrecto. Te quedan ${t} ${t === 1 ? "intento" : "intentos"}.` }); }
      }}>
      {({ code, clear }) => (
        <div className="pt-actions" style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", alignItems: "center", marginTop: ".8rem" }}>
          <button className="hz-btn hz-btn--primary" type="button" disabled={code.length < 6 || locked || state.s === "ok"}>Verificar</button>
          <button className="hz-btn hz-btn--text" type="button" style={{ minHeight: 44 }} disabled={wait > 0 || locked}
            onClick={() => { toast({ title: "Código reenviado", text: "Revisa tu correo. El código anterior ya no sirve.", kind: "ok" }); setState({ s: "", m: "" }); clear(); setWait(10); }}>
            {wait > 0 ? `Reenviar en ${wait} s` : "Reenviar código"}
          </button>
        </div>
      )}
    </OtpInput>
  );
}

export function PasswordDemo() {
  const [v, setV] = useState("");
  return <PasswordWithStrength value={v} onChange={setV} />;
}

const DEVICES = ["CAM-001", "CAM-002", "LEC-001", "LEC-002", "KIOSCO-01"];
const EVENTS: Record<string, number> = { "CAM-001": 412, "CAM-002": 198, "LEC-001": 356, "LEC-002": 231, "KIOSCO-01": 87 };
export function MultiSelectDemo() {
  const [sel, setSel] = useState<string[]>([]);
  const total = (sel.length ? sel : DEVICES).reduce((s, v) => s + EVENTS[v], 0).toLocaleString("es-PE");
  return (
    <>
      <MultiSelect label="Dispositivo" options={DEVICES} selected={sel} onChange={setSel} describe={(o) => `${EVENTS[o]} eventos`} />
      <ActiveFilters values={sel} onRemove={(v) => setSel(sel.filter((x) => x !== v))} onClear={() => setSel([])}
        summary={`${total} eventos${sel.length ? ` en ${sel.length} ${sel.length === 1 ? "dispositivo" : "dispositivos"}` : " en todos los dispositivos"}`} />
    </>
  );
}

export function ValidationDemo() {
  const toast = useToast();
  return (
    <ValidatedForm label="Registro de persona" submitLabel="Guardar persona" onValid={() => toast({ title: "Persona guardada", text: "Los datos pasaron la validación.", kind: "ok" })}
      fields={[
        { name: "n", label: "Nombre completo", inputProps: { autoComplete: "name" }, check: (v) => (v.trim().length >= 3 ? "" : "Escribe el nombre completo.") },
        { name: "c", label: "Correo electrónico", inputProps: { type: "email", autoComplete: "email" }, check: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Escribe un correo como nombre@dominio.com.") },
        { name: "d", label: "Documento (8 dígitos)", inputProps: { inputMode: "numeric", maxLength: 8 }, check: (v) => (/^\d{8}$/.test(v.trim()) ? "" : "El documento tiene 8 dígitos.") },
      ]} />
  );
}

export function UploadDemo() { return <FileUpload />; }

const LD_DATA: [string, string, string, "success" | "warning" | "neutral", "check-circle" | "exclamation-circle" | "clock", string][] = [
  ["MR", "María Rojas Quispe", "Verificada · hoy 09:12", "success", "check-circle", "Verificada"],
  ["LP", "Luis Paredes Gómez", "En reintento · hoy 08:47", "warning", "exclamation-circle", "Reintento"],
  ["AC", "Ana Castro Núñez", "Pendiente · ayer 17:30", "neutral", "clock", "Pendiente"],
];

export function LoadingDemo() {
  const toast = useToast();
  const [view, setView] = useState<"ok" | "loading" | "error">("ok");
  const [saving, setSaving] = useState(false);
  const [live, setLive] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const busy = view === "loading";
  const load = () => { clearTimeout(timer.current); setView("loading"); setLive(""); timer.current = setTimeout(() => { setView("ok"); setLive("Lista cargada: 3 personas."); }, 1600); };
  const fail = () => { clearTimeout(timer.current); setView("loading"); setLive(""); timer.current = setTimeout(() => setView("error"), 1200); };
  const save = () => {
    if (saving) return;
    setSaving(true); setLive("Guardando cambios.");
    setTimeout(() => { setSaving(false); setLive("Cambios guardados."); toast({ title: "Cambios guardados", text: "Se aplicaron correctamente.", kind: "ok" }); }, 1500);
  };
  return (
    <div className="cp-demo">
      <div className="ld__bar">
        <button className="hz-btn hz-btn--secondary" type="button" disabled={busy} onClick={load}>Recargar lista</button>
        <button className="hz-btn hz-btn--ghost" type="button" disabled={busy} onClick={fail}>Simular error</button>
        <span className="ld__hint mono">Tarda ~1,6 s</span>
      </div>
      <div className="ld" aria-live="polite" aria-busy={busy}>
        <ul className="ld__list">
          {view === "loading" && LD_DATA.map((d) => <li key={d[0]} className="ld__item"><span className="ld__sk ld__sk--av" /><div><span className="ld__sk ld__sk--l1" /><span className="ld__sk ld__sk--l2" /></div><span className="ld__sk ld__sk--chip" /></li>)}
          {view === "ok" && LD_DATA.map((d) => <li key={d[0]} className="ld__item"><span className="ld__av" aria-hidden="true">{d[0]}</span><div className="ld__nm"><b>{d[1]}</b><small>{d[2]}</small></div><Chip tone={d[3]} icon={d[4]}>{d[5]}</Chip></li>)}
          {view === "error" && (
            <li className="ld__err"><Alert tone="error" title="No pudimos cargar la lista">Revisa tu conexión e inténtalo de nuevo. <button className="up__btn" type="button" autoFocus onClick={load}>Reintentar</button></Alert></li>
          )}
        </ul>
      </div>
      <div className="ld__row2">
        <button className="hz-btn hz-btn--primary ld__save" type="button" aria-busy={saving || undefined} aria-disabled={saving || undefined} onClick={save}>
          <span className="ld__spin" aria-hidden="true" /><span className="ld__lbl">{saving ? "Guardando…" : "Guardar cambios"}</span>
        </button>
        <div className="ld__ind" aria-hidden="true"><i /></div><span className="ld__hint mono" aria-hidden="true">Barra indeterminada</span>
      </div>
      <p className="sr-only" role="status">{live}</p>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) { return <div className="row">{children}</div>; }
export { Avatar };
