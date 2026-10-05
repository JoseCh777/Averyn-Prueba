"use client";
import { useState, type ReactNode } from "react";
import {
  Accordion, ActionMenu, ActiveFilters, ActivityPanel, Alert, Avatar, Breadcrumb, Button, Checkbox, Chip, Combobox, CommandPalette, DataTable,
  DateRangePicker, Dock, Drawer, EmptyState, Field, FileUpload, Icon, IconButton, Input, KeyValue, Kpi, KpiRow, Mark, Modal, MultiSelect, OtpInput,
  Pager, PasswordInput, PasswordWithStrength, Popover, Progress, SearchField, Select, SimpleMenu, SkeletonLines, Stepper, Switch, Table, Tabs, Tag,
  Textarea, Tile, ToastProvider, Tooltip, useToast, ValidatedForm,
} from "@/components/ui";

const TODAY = new Date(2026, 9, 2);
const PEOPLE = [
  ["Ana Lucía Pérez", "12345678", "Estudiante", "on", "2026-10-02T10:42"], ["Carlos Mendoza", "23456789", "Docente", "on", "2026-10-02T09:15"], ["Lucía Ramos", "34567890", "Estudiante", "off", "2026-09-28T17:30"],
  ["Diego Torres", "45678901", "Empleado", "on", "2026-10-01T08:05"], ["Valeria Quispe", "56789012", "Estudiante", "pend", "2026-09-30T12:20"], ["Jorge Salazar", "67890123", "Docente", "on", "2026-10-02T07:50"],
  ["Mariana Cruz", "78901234", "Estudiante", "on", "2026-10-01T15:40"], ["Andrés Vega", "89012345", "Empleado", "off", "2026-09-20T11:10"],
].map((p, i) => ({ id: i, name: p[0], doc: p[1], role: p[2], status: p[3] as "on" | "off" | "pend", last: p[4] }));
const STATUS = { on: ["success", "Activa"], off: ["neutral", "Inactiva"], pend: ["warning", "Pendiente"] } as const;
const fmt = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
const DEVICES = ["CAM-001", "CAM-002", "LEC-001", "LEC-002", "KIOSCO-01"];
const EVENTS: Record<string, number> = { "CAM-001": 412, "CAM-002": 198, "LEC-001": 356, "LEC-002": 231, "KIOSCO-01": 87 };

function Sec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="ds-sec" style={{ paddingBlock: "2rem" }}>
      <div className="ds-wrap"><h2 style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>{title}</h2>{children}</div>
    </section>
  );
}

function Inner() {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [on, setOn] = useState(true);
  const [page, setPage] = useState(2);
  const [range, setRange] = useState({ from: new Date(2026, 8, 3), to: TODAY, label: "Últimos 30 días" });
  const [q, setQ] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState<{ s: "" | "error" | "ok"; m: string; tries: number }>({ s: "", m: "", tries: 3 });
  const [ms, setMs] = useState<string[]>([]);
  const names = ["Ana Torres", "Luis Pérez", "Laura Díaz", "Andrés Molina"].filter((n) => !q || n.toLowerCase().includes(q.toLowerCase()));
  const ok = (title: string, text?: string) => toast({ title, text, kind: "ok" });

  return (
    <>
      <Sec title="Botones, campos y estados">
        <div className="row">
          <Button>Primario</Button><Button variant="ghost">Fantasma</Button><Button variant="danger">Eliminar</Button><Button variant="text">Texto</Button>
          <Button loading>Guardando…</Button><Button disabled>Deshabilitado</Button>
          <IconButton aria-label="Notificaciones, 3 sin leer" badge={3}><Icon name="bell" /></IconButton>
        </div>
        <div className="ds-grid ds-grid--2" style={{ marginTop: "1rem" }}>
          <Field label="Nombre" help="Como figura en el documento.">{(a) => <Input {...a} />}</Field>
          <Field label="Documento" error="El documento debe tener solo números.">{(a) => <Input {...a} defaultValue="12A" />}</Field>
          <Field label="Contraseña">{(a) => <PasswordInput {...a} placeholder="Ingresa tu contraseña" />}</Field>
          <Field label="Tipo">{(a) => <Select {...a}><option>CC</option><option>CE</option></Select>}</Field>
          <Field label="Comentarios">{(a) => <Textarea {...a} />}</Field>
          <div>
            <Checkbox label="Acepto el tratamiento de datos" />
            <div className="row"><Switch label="Notificaciones por correo" checked={on} onCheckedChange={setOn} /><span>Notificaciones por correo</span></div>
          </div>
        </div>
        <div className="ds-grid ds-grid--2" style={{ marginTop: "1rem" }}>
          <Alert tone="success" title="Guardado">Los cambios se aplicaron.</Alert>
          <Alert tone="error" title="No pudimos guardar">Inténtalo de nuevo.</Alert>
          <Alert tone="warning" title="Atención">Quedan 2 intentos.</Alert>
          <Alert tone="info" title="Información">Vista de ejemplo.</Alert>
        </div>
        <div className="row" style={{ marginTop: "1rem" }}>
          <Chip tone="success">Aceptada</Chip><Chip tone="warning">Reintento</Chip><Chip tone="error">Rechazada</Chip><Chip tone="info">En revisión</Chip>
          <Chip tone="neutral">Pendiente</Chip><Chip tone="brand" variant="outline">Nuevo</Chip><Tag>Próximamente</Tag>
        </div>
      </Sec>

      <Sec title="Navegación">
        <Breadcrumb items={[{ label: "Panel", href: "#" }, { label: "Personas", href: "#" }, { label: "Ana Lucía Pérez" }]} />
        <div className="row" style={{ margin: "1rem 0" }}>
          <Dock items={[{ label: "Panel", href: "#", current: true }, { label: "Personas", href: "#" }, { label: "Accesos" }]} />
          <Avatar initials="UD" name="Usuario Demo" role="Administrador" />
          <SimpleMenu label="Menú" items={[{ label: "Cerrar sesión", icon: "box-arrow-right", onSelect: () => ok("Sesión cerrada") }]} />
        </div>
        <Tabs label="Ejemplo de pestañas" tabs={[{ label: "Todas", content: "Contenido de todas." }, { label: "Verificadas", content: "Solo verificadas." }, { label: "Pendientes", content: "Solo pendientes." }]} />
        <div style={{ marginTop: "1rem" }}><Pager page={page} pages={3} onPage={setPage} /></div>
      </Sec>

      <Sec title="Menú de acciones, combobox, selección múltiple y fechas">
        <div className="ds-grid ds-grid--2">
          <div style={{ minHeight: 260 }}>
            <ActionMenu label="Acciones de Ana Lucía Pérez" items={[{ label: "Ver detalle", icon: "eye", onSelect: () => ok("Ver detalle") }, { label: "Editar datos", icon: "pencil", onSelect: () => ok("Editar datos") }, "separator", { label: "Eliminar…", icon: "trash3", danger: true, onSelect: () => setModal(true) }]} />
            <div style={{ marginTop: "1rem" }}>
              <Combobox label="Institución" options={[{ title: "Universidad Horizonte", detail: "Sede Central · Lima" }, { title: "Universidad Horizonte", detail: "Sede Norte · Trujillo" }, { title: "Instituto Cima", detail: "Campus Arequipa" }]} onChoose={(o) => ok("Institución elegida", o.title)} />
            </div>
          </div>
          <div style={{ minHeight: 360 }}>
            <MultiSelect label="Dispositivo" options={DEVICES} selected={ms} onChange={setMs} describe={(o) => `${EVENTS[o]} eventos`} />
            <ActiveFilters values={ms} onRemove={(v) => setMs(ms.filter((x) => x !== v))} onClear={() => setMs([])} summary={`${(ms.length ? ms : DEVICES).reduce((s, v) => s + EVENTS[v], 0).toLocaleString("es-PE")} eventos`} />
          </div>
        </div>
        <DateRangePicker today={TODAY} value={range} onChange={setRange} />
      </Sec>

      <Sec title="Búsqueda, código, contraseña y validación">
        <div className="ds-grid ds-grid--2">
          <div>
            <SearchField label="Buscar personas" placeholder="Buscar por nombre o documento" value={q} onChange={setQ} countText={q ? `${names.length} resultados` : "4 personas"} />
            <ul className="sf__list">{names.map((n) => <li key={n}><span><Mark text={n} query={q} /></span></li>)}</ul>
          </div>
          <OtpInput
            state={otp.s}
            message={otp.m}
            help="Escribe los 6 dígitos. En esta demo el código correcto es 482913."
            onComplete={(c) => {
              if (c === "482913") setOtp({ s: "ok", m: "Correo confirmado.", tries: 3 });
              else {
                const t = otp.tries - 1;
                setOtp({ s: "error", m: t > 0 ? `Código incorrecto. Te quedan ${t} ${t === 1 ? "intento" : "intentos"}.` : "Demasiados intentos. Vuelve a intentarlo en 5 minutos.", tries: t });
              }
            }}
          />
          <PasswordWithStrength value={pw} onChange={setPw} />
          <ValidatedForm
            label="Registro de persona"
            onValid={() => ok("Persona guardada", "Los datos pasaron la validación.")}
            fields={[
              { name: "n", label: "Nombre completo", check: (v) => (v.trim().length >= 3 ? "" : "Escribe el nombre completo.") },
              { name: "c", label: "Correo electrónico", inputProps: { type: "email" }, check: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Escribe un correo como nombre@dominio.com.") },
            ]}
          />
        </div>
      </Sec>

      <Sec title="Tabla, carga de archivos y estados de carga">
        <DataTable
          label="Tabla de personas"
          rows={PEOPLE}
          searchKeys={["name", "doc"]}
          searchLabel="Buscar personas"
          searchPlaceholder="Buscar persona o documento"
          who={{ key: "name", detail: "role" }}
          columns={[
            { key: "name", header: "Nombre", sortable: true },
            { key: "doc", header: "Documento", mono: true, sortable: true },
            { key: "status", header: "Estado", render: (r) => <Chip tone={STATUS[r.status][0]}>{STATUS[r.status][1]}</Chip> },
            { key: "last", header: "Último acceso", mono: true, sortable: true, render: (r) => fmt.format(new Date(r.last)).replace(/\./g, "") },
          ]}
          bulkActions={() => <Button variant="ghost" onClick={() => ok("Exportar")}>Exportar</Button>}
        />
        <div style={{ marginTop: "1.5rem" }}><FileUpload /></div>
        <div className="ds-grid ds-grid--2" style={{ marginTop: "1.5rem" }}>
          <SkeletonLines />
          <div>
            <Progress value={0.4} label="Avance" />
            <EmptyState icon="inbox" title="Sin eventos" action={<Button variant="ghost">Ampliar a 90 días</Button>}>Prueba con un periodo más amplio.</EmptyState>
          </div>
        </div>
      </Sec>

      <Sec title="Capas: modal, drawer, popover, tooltip, paleta, acordeón, pasos">
        <div className="row">
          <Button variant="ghost" onClick={() => setModal(true)}>Abrir modal</Button>
          <Button variant="ghost" onClick={() => setDrawer(true)}>Abrir drawer</Button>
          <Tooltip text="Verificada: la identidad superó el umbral">{(a) => <IconButton aria-label="¿Qué significa Verificada?" {...a}><Icon name="question-circle" /></IconButton>}</Tooltip>
          <Popover trigger="¿Qué es el umbral?" title="Umbral de similitud"><p>Es el puntaje mínimo (de 0 a 1) para aceptar una verificación.</p></Popover>
          <CommandPalette commands={[{ group: "Ir a", icon: "grid-1x2", label: "Panel" }, { group: "Ir a", icon: "people", label: "Personas" }, { group: "Ir a", icon: "door-open", label: "Accesos", soon: true }, { group: "Acciones", icon: "person-plus", label: "Registrar persona", run: () => ok("Registrar persona") }]} />
        </div>
        <div className="ds-grid ds-grid--2" style={{ marginTop: "1.5rem", minHeight: 300 }}>
          <Accordion items={[{ title: "¿Qué datos biométricos se guardan?", content: "Una plantilla matemática de tu rostro y tu huella." }, { title: "¿Quién puede ver mis datos?", content: "Solo el personal autorizado." }]} />
          <Stepper
            label="Pasos del registro"
            onFinish={() => ok("Persona registrada")}
            steps={[
              { title: "Datos", heading: "Datos de la persona", content: <p>Empieza por lo básico.</p> },
              { title: "Documento", content: <Alert tone="info" title="Vista de ejemplo">Aquí iría la captura.</Alert> },
              { title: "Confirmar", content: <p>Revisa los datos antes de guardar.</p> },
            ]}
          />
        </div>
        <Modal open={modal} onClose={() => setModal(false)} title="¿Eliminar a Ana Torres?" actions={<><Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button><Button variant="danger" onClick={() => { setModal(false); toast({ title: "Eliminada", kind: "bad" }); }}>Eliminar</Button></>}>
          <p>Esta acción no se puede deshacer.</p>
        </Modal>
        <Drawer open={drawer} onClose={() => setDrawer(false)} title="Ana Lucía Pérez" subtitle="Estudiante · Sede Central" footer={<Button onClick={() => setDrawer(false)}>Cerrar</Button>}>
          <KeyValue items={[{ term: "Documento", value: "12345678" }, { term: "Biometría", value: <Chip tone="success">Rostro y huella</Chip> }]} />
        </Drawer>
      </Sec>

      <Sec title="Mosaicos, indicadores y panel de actividad">
        <div className="ds-grid ds-grid--3">
          <Tile tone="signal" icon="people" title="Personas" description="Registro y consulta" href="#" />
          <Tile tone="night" icon="fingerprint" title="Biometría" description="Rostro y huella" href="#" />
          <Tile tone="soon" icon="door-open" title="Accesos" description="Próximamente" tag={<Tag>Pronto</Tag>} />
        </div>
        <div style={{ margin: "1.5rem 0" }}>
          <KpiRow>
            <Kpi label="Personas" value="8" delta="+2 esta semana" tone="ok" /><Kpi label="Verificaciones" value="24" delta="3 en reintento" tone="warn" />
            <Kpi label="Dispositivos" value="4" note="2 conectados" /><Kpi label="Alertas" value="0" />
          </KpiRow>
        </div>
        <ActivityPanel title="Actividad" subtitle="Hoy" bars={[{ label: "Aceptadas", value: 18, max: 24 }, { label: "Reintento", value: 4, max: 24, tone: "retry" }, { label: "Rechazadas", value: 2, max: 24, tone: "bad" }]} events={[{ title: "Verificación aceptada", detail: "Ana Lucía Pérez · CAM-001", time: "10:42" }, { title: "Rechazada", detail: "Carlos Mendoza", time: "10:15", tone: "bad" }]} />
        <Table style={{ marginTop: "1.5rem" }}><thead><tr><th>Evento</th><th>Hora</th></tr></thead><tbody><tr><td>LOGIN</td><td className="num">10:31</td></tr></tbody></Table>
      </Sec>
    </>
  );
}

export function Demos() {
  return <ToastProvider><Inner /></ToastProvider>;
}
