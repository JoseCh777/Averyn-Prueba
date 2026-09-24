/**
 * Dashboard principal de Averyn.
 *
 * Decisión de diseño: se priorizó un panel con datos simples y trazables
 * (conteos y un log de acciones) sobre visualizaciones complejas, para que
 * cada elemento se pueda explicar y sustentar. Por eso no hay gráficos ni
 * cálculos estadísticos: cada número es un conteo del mock (que en producción
 * vendría de la API) y la actividad reciente es un log de eventos.
 *
 * Datos de esta pantalla:
 * - KPI: conteos por módulo (personas, verificaciones, procesos, accesos).
 * - Accesos rápidos: enlaces a los módulos, sin lógica.
 * - Actividad reciente: últimas acciones registradas (log).
 */

const USUARIO_DEMO = { nombre: 'Usuario Demo', rol: 'Administrador' };

/**
 * Indicadores del panel. Cada valor es un conteo del mock; el delta es la
 * variación contra el período anterior. En producción, estos conteos vendrían
 * agregados por la API a partir de las tablas de cada módulo.
 * @type {Array<{id: string, label: string, icono: string, tono: string, variante: string, valor: string, delta: string, direccion: 'up'|'down', nota: string}>}
 */
const KPI_MOCK = [
  { id: 'personas', label: 'Personas registradas', icono: 'bi-people', tono: 'blue', variante: 'av-kpi--blue', valor: '248', delta: '+12%', direccion: 'up', nota: 'vs. mes anterior' },
  { id: 'verificaciones', label: 'Verificaciones del mes', icono: 'bi-patch-check-fill', tono: 'success', variante: 'av-kpi--success', valor: '1.284', delta: '+8%', direccion: 'up', nota: '72 con biometría' },
  { id: 'electoral', label: 'Procesos electorales activos', icono: 'bi-check2-square', tono: 'violet', variante: 'av-kpi--violet', valor: '3', delta: '−1', direccion: 'down', nota: 'cerró 1 convocatoria' },
  { id: 'accesos', label: 'Accesos registrados (24 h)', icono: 'bi-door-open', tono: 'indigo', variante: 'av-kpi--indigo', valor: '186', delta: '+16%', direccion: 'up', nota: 'vs. día anterior' },
];

/**
 * Atajos a los módulos. Son enlaces: no tienen lógica asociada.
 * @type {Array<{titulo: string, desc: string, icono: string, tono: string, href: string}>}
 */
const ACCESOS_RAPIDOS_MOCK = [
  { titulo: 'Gestionar personas', desc: 'Listado y verificación de identidad', icono: 'bi-people', tono: 'blue', href: 'identity/index.html' },
  { titulo: 'Gestionar usuarios', desc: 'Cuentas y roles de la organización', icono: 'bi-person-gear', tono: 'success', href: '../modules/admin/index.html' },
  { titulo: 'Procesos electorales', desc: 'Convocatorias y mesas de votación', icono: 'bi-check2-square', tono: 'violet', href: '../modules/electoral/index.html' },
  { titulo: 'Biometría', desc: 'Registro y verificación biométrica', icono: 'bi-fingerprint', tono: 'cyan', href: '../biometrics/index.html' },
  { titulo: 'Procesar documento', desc: 'OCR · nuevo registro desde documento', icono: 'bi-camera', tono: 'teal', href: 'documents/pre-registro.html' },
  { titulo: 'Consultas con IA', desc: 'Preguntas sobre identidad y procesos', icono: 'bi-stars', tono: 'indigo', href: '../modules/ia/index.html' },
  { titulo: 'Reportes y auditoría', desc: 'Trazabilidad y exportación de datos', icono: 'bi-clipboard-data', tono: 'slate', href: '../modules/admin/index.html' },
];

const TONO_POR_TIPO_EVENTO = { usuario: 'success', biometria: 'blue', electoral: 'violet', acceso: 'indigo', dispositivo: 'cyan' };
const ICONO_POR_TIPO_EVENTO = { usuario: 'bi-person-plus', biometria: 'bi-fingerprint', electoral: 'bi-check2-square', acceso: 'bi-door-open', dispositivo: 'bi-broadcast' };

/**
 * Últimas acciones registradas en el sistema (log). Es una lista corta de
 * eventos recientes, no una agregación estadística.
 * @type {Array<{tipo: string, titulo: string, desc: string, meta: string}>}
 */
const ACTIVIDAD_RECIENTE_MOCK = [
  { tipo: 'usuario', titulo: 'Nuevo usuario creado', desc: 'María Gómez · cuenta con rol Administrativo', meta: 'hace 2h · Sede Central' },
  { tipo: 'biometria', titulo: 'Verificación biométrica', desc: 'Ana Torres · rostro verificado', meta: 'hace 3h · Puesto 2' },
  { tipo: 'electoral', titulo: 'Inicio de votación', desc: 'Elecciones de representantes 2026', meta: 'hace 5h · Sede Central' },
  { tipo: 'acceso', titulo: 'Acceso registrado', desc: 'Carlos Ruiz · Puerta principal', meta: 'hace 7h · Campus Norte' },
];

/**
 * Pinta el nombre del usuario en el bloque de bienvenida.
 * @returns {void}
 */
function renderizarBienvenida() {
  const nombre = document.getElementById('nombre-usuario');
  if (nombre) nombre.textContent = USUARIO_DEMO.nombre;
}

/**
 * Pinta los KPI del panel.
 * @returns {void}
 */
function renderizarKpis() {
  const grid = document.getElementById('kpi-grid');
  if (!grid) return;

  grid.innerHTML = KPI_MOCK.map((kpi) => {
    const claseDelta = kpi.direccion === 'up' ? 'av-kpi__delta--up' : 'av-kpi__delta--down';
    const iconoDelta = kpi.direccion === 'up'
      ? '<i class="bi bi-arrow-up-short" aria-hidden="true"></i>'
      : '<i class="bi bi-arrow-down-short" aria-hidden="true"></i>';
    return `
      <div class="av-kpi ${kpi.variante}">
        <span class="av-tint-circle av-tint-circle--${kpi.tono} av-kpi__icon" aria-hidden="true"><i class="bi ${kpi.icono}"></i></span>
        <span class="av-kpi__label">${kpi.label}</span>
        <span class="av-kpi__value">${kpi.valor}</span>
        <span class="av-kpi__delta ${claseDelta}">${iconoDelta}${kpi.delta}</span>
        <span class="av-kpi__note">${kpi.nota}</span>
      </div>`;
  }).join('');
}

/**
 * Pinta los accesos rápidos (enlaces a los módulos).
 * @returns {void}
 */
function renderizarAccesosRapidos() {
  const grid = document.getElementById('grid-accesos-rapidos');
  if (!grid) return;

  grid.innerHTML = ACCESOS_RAPIDOS_MOCK.map((acceso) => `
    <a class="av-quick" href="${acceso.href}">
      <span class="av-tint-circle av-tint-circle--${acceso.tono}" aria-hidden="true"><i class="bi ${acceso.icono}"></i></span>
      <span class="av-quick__title">${acceso.titulo}</span>
      <span class="av-quick__desc">${acceso.desc}</span>
      <span class="av-quick__arrow" aria-hidden="true"><i class="bi bi-arrow-right"></i></span>
    </a>`).join('');
}

/**
 * Pinta la actividad reciente (log de las últimas acciones).
 * @returns {void}
 */
function renderizarFeedActividad() {
  const lista = document.getElementById('feed-actividad');
  if (!lista) return;

  lista.innerHTML = ACTIVIDAD_RECIENTE_MOCK.map((evento) => {
    const tono = TONO_POR_TIPO_EVENTO[evento.tipo] || 'slate';
    const icono = ICONO_POR_TIPO_EVENTO[evento.tipo] || 'bi-circle';
    return `
      <li class="av-feed__item">
        <span class="av-tint-circle av-tint-circle--sm av-tint-circle--${tono}" aria-hidden="true"><i class="bi ${icono}"></i></span>
        <div class="av-feed__body">
          <span class="av-feed__title">${evento.titulo}</span>
          <span class="av-feed__desc">${evento.desc}</span>
          <span class="av-feed__meta">${evento.meta}</span>
        </div>
      </li>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarBienvenida();
  renderizarKpis();
  renderizarAccesosRapidos();
  renderizarFeedActividad();
});
