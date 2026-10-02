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
 * - Indicadores: conteos por módulo (personas, verificaciones, procesos, dispositivos).
 * - Accesos rápidos: enlaces a los módulos, sin lógica. Los módulos que aún
 *   no existen se muestran como "Próximamente" en vez de enlazar a un 404.
 * - Actividad reciente: últimas acciones registradas (log).
 */

const USUARIO_DEMO = { nombre: 'Usuario Demo', rol: 'Administrador' };

/**
 * Escapa texto antes de insertarlo como HTML (los nombres de personas los
 * puede escribir el usuario y se pintan con innerHTML).
 * @param {unknown} texto
 * @returns {string}
 */
function escaparHtml(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/**
 * Devuelve "1 verificada" / "3 verificadas" según la cantidad.
 * @param {number} n
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
function conteoTexto(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}

/**
 * Construye los indicadores del panel en tiempo real desde las fuentes de
 * datos reales de la demo: el catálogo de personas, el resumen biométrico y
 * los procesos electorales. Cada valor es trazable: no hay cifras inventadas.
 * `tono` colorea el punto del detalle: 'ok' (positivo), 'warn' (atención) o 'neutral'.
 * @returns {Array<{id: string, label: string, valor: string, delta: string, tono: 'ok'|'warn'|'neutral', nota: string}>}
 */
function construirKpis() {
  const personas = listarPersonasCatalogo();
  const totalPersonas = personas.length;
  const verificadas = personas.filter((p) => p.estado === 'verificado').length;
  const pendientes = totalPersonas - verificadas;

  const resumen = resumenBiometria();
  const dispositivos = listarDispositivosBiometricos();
  const desconectados = dispositivos.length - resumen.dispositivosConectados;
  const procesos = obtenerProcesos();
  const activos = procesos.filter((p) => p.estado === 'OPEN' || p.estado === 'DRAFT').length;

  return [
    {
      id: 'personas', label: 'Personas registradas', valor: String(totalPersonas),
      delta: conteoTexto(verificadas, 'verificada', 'verificadas'), tono: 'ok',
      nota: `${conteoTexto(pendientes, 'pendiente', 'pendientes')} de verificación`,
    },
    {
      id: 'verificaciones', label: 'Verificaciones', valor: String(resumen.verificaciones),
      delta: conteoTexto(resumen.exitosas, 'exitosa', 'exitosas'), tono: 'ok',
      nota: conteoTexto(resumen.rechazadas, 'rechazada', 'rechazadas'),
    },
    {
      id: 'electoral', label: 'Procesos electorales', valor: String(activos),
      delta: `${procesos.length} en total`, tono: 'neutral',
      nota: 'Abiertos o en borrador',
    },
    {
      id: 'dispositivos', label: 'Dispositivos conectados', valor: String(resumen.dispositivosConectados),
      delta: conteoTexto(desconectados, 'desconectado', 'desconectados'), tono: desconectados > 0 ? 'warn' : 'ok',
      nota: `de ${dispositivos.length} dispositivos de biometría`,
    },
  ];
}

/**
 * Atajos a los módulos. Son enlaces: no tienen lógica asociada.
 * `proximamente` marca los módulos cuya pantalla aún no existe.
 * @type {Array<{titulo: string, desc: string, href: string, proximamente?: boolean}>}
 */
const ACCESOS_RAPIDOS_MOCK = [
  { titulo: 'Gestionar personas', desc: 'Listado y verificación de identidad', href: 'identity/index.html' },
  { titulo: 'Biometría', desc: 'Registro y verificación biométrica', href: '../biometrics/index.html' },
  { titulo: 'Procesar documento', desc: 'OCR · nuevo registro desde documento', href: 'documents/pre-registro.html' },
  { titulo: 'Procesos electorales', desc: 'Convocatorias y mesas de votación', href: '../modules/electoral/index.html' },
  { titulo: 'Consultas con IA', desc: 'Preguntas sobre identidad y procesos', href: '../modules/ia/index.html' },
  { titulo: 'Gestionar usuarios', desc: 'Cuentas y roles de la organización', href: '../modules/admin/index.html', proximamente: true },
  { titulo: 'Reportes y auditoría', desc: 'Trazabilidad y exportación de datos', href: '../modules/admin/index.html', proximamente: true },
];

/**
 * Construye la actividad reciente desde el log biométrico real
 * (averyn.biometria.eventos): se muestran los 4 eventos más recientes con
 * nombre de persona, método, resultado y fecha.
 * `estado` colorea el punto de la línea de tiempo: exito | rechazo | reintento | otro.
 * @returns {Array<{estado: string, titulo: string, desc: string, meta: string}>}
 */
function construirActividadReciente() {
  return listarEventosBiometricos().slice(0, 4).map((evento) => {
    const persona = obtenerPersonaCatalogo(evento.personaId);
    const nombre = persona ? persona.nombre : `Persona #${evento.personaId}`;
    const operacion = textoOperacionBiometrica(evento.tipoOperacion);
    const metodo = textoMetodoBiometrico(evento.metodo);
    const info = infoResultadoBiometrico(evento.resultado, evento.tipoOperacion);
    return {
      estado: ['exito', 'rechazo', 'reintento'].includes(evento.resultado) ? evento.resultado : 'otro',
      titulo: `${operacion} biométrica`,
      desc: `${nombre} · ${metodo} ${info.texto.toLowerCase()}`,
      meta: `${formatearFechaBiometria(evento.fecha)} · ${evento.dispositivo}`,
    };
  });
}

/**
 * Pinta el nombre del usuario en el bloque de bienvenida.
 * @returns {void}
 */
function renderizarBienvenida() {
  const nombre = document.getElementById('nombre-usuario');
  if (nombre) nombre.textContent = USUARIO_DEMO.nombre;

  let nombreSesion = '';
  try {
    const crudo = localStorage.getItem('averyn.session');
    if (crudo) {
      const sesion = JSON.parse(crudo);
      nombreSesion = sesion.email || '';
    }
  } catch (error) { /* sin sesión */ }
  if (nombreSesion && nombre) nombre.textContent = nombreSesion.split('@')[0];
}

/**
 * Pinta los indicadores del panel.
 * @returns {void}
 */
function renderizarKpis() {
  const grid = document.getElementById('kpi-grid');
  if (!grid) return;

  grid.innerHTML = construirKpis().map((kpi) => `
    <div class="dh-kpi">
      <span class="dh-kpi__label dh-mono">${escaparHtml(kpi.label)}</span>
      <span class="dh-kpi__value">${escaparHtml(kpi.valor)}</span>
      <span class="dh-kpi__delta dh-kpi__delta--${kpi.tono}">${escaparHtml(kpi.delta)}</span>
      <span class="dh-kpi__note">${escaparHtml(kpi.nota)}</span>
    </div>`).join('');
}

/**
 * Pinta los accesos rápidos como filas. Los módulos sin pantalla se muestran
 * deshabilitados con la etiqueta "Próximamente".
 * @returns {void}
 */
function renderizarAccesosRapidos() {
  const lista = document.getElementById('grid-accesos-rapidos');
  if (!lista) return;

  lista.innerHTML = ACCESOS_RAPIDOS_MOCK.map((acceso, i) => {
    const indice = String(i + 1).padStart(2, '0');
    const cuerpo = `
      <span class="dh-row__n dh-mono" aria-hidden="true">${indice}</span>
      <span class="dh-row__body">
        <span class="dh-row__title">${escaparHtml(acceso.titulo)}</span>
        <span class="dh-row__desc">${escaparHtml(acceso.desc)}</span>
      </span>`;
    if (acceso.proximamente) {
      return `<li><span class="dh-row is-soon" aria-disabled="true">${cuerpo}<span class="dh-row__tag dh-mono">Próximamente</span></span></li>`;
    }
    return `<li><a class="dh-row" href="${acceso.href}">${cuerpo}<span class="dh-row__arrow" aria-hidden="true">→</span></a></li>`;
  }).join('');
}

/**
 * Pinta la actividad reciente como línea de tiempo.
 * @returns {void}
 */
function renderizarFeedActividad() {
  const lista = document.getElementById('feed-actividad');
  if (!lista) return;

  const actividad = construirActividadReciente();
  if (actividad.length === 0) {
    lista.innerHTML = `
      <li class="dh-event dh-event--otro">
        <span class="dh-event__title">Sin actividad reciente</span>
        <span class="dh-event__desc">Aún no hay eventos en el log biométrico. Registra o verifica una persona para empezar.</span>
      </li>`;
    return;
  }

  lista.innerHTML = actividad.map((evento) => `
    <li class="dh-event dh-event--${evento.estado}">
      <span class="dh-event__title">${escaparHtml(evento.titulo)}</span>
      <span class="dh-event__desc">${escaparHtml(evento.desc)}</span>
      <span class="dh-event__meta dh-mono">${escaparHtml(evento.meta)}</span>
    </li>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarBienvenida();
  renderizarKpis();
  renderizarAccesosRapidos();
  renderizarFeedActividad();
});
