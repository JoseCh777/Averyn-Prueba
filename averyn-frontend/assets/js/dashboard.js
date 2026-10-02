/**
 * Dashboard principal de Averyn.
 *
 * Decisión de diseño: se priorizó un panel con datos simples y trazables
 * (conteos y un log de acciones) sobre visualizaciones complejas, para que
 * cada elemento se pueda explicar y sustentar. Por eso no hay cálculos
 * estadísticos: cada número es un conteo del mock (que en producción vendría
 * de la API) y el único gráfico son tres barras con el conteo del log.
 *
 * Datos de esta pantalla:
 * - Indicadores: conteos por módulo (personas, verificaciones, procesos, dispositivos).
 * - Accesos rápidos: mosaico de enlaces a los módulos, sin lógica. Los módulos
 *   que aún no existen se muestran como "Próximamente" en vez de enlazar a un 404.
 * - Actividad reciente: resumen por resultado y últimas acciones registradas (log).
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
 * Atajos a los módulos, en el orden del mosaico. Son enlaces: no tienen lógica.
 * - `tamano`: 'lg' (2 por fila), 'md' (3 por fila) o 'sm' (2 por fila, módulos pendientes).
 * - `tono`: color de la tarjeta ('signal' azul, 'night' navy, 'tint' azul tenue, 'soon' atenuada).
 * - `proximamente`: el módulo aún no tiene pantalla; no enlaza.
 * @type {Array<{titulo: string, desc: string, href: string, icono: string, tamano: 'lg'|'md'|'sm', tono: string, proximamente?: boolean}>}
 */
const ACCESOS_RAPIDOS_MOCK = [
  { titulo: 'Gestionar personas', desc: 'Listado y verificación de identidad', href: 'identity/index.html', icono: 'bi-person-vcard', tamano: 'lg', tono: 'signal' },
  { titulo: 'Biometría', desc: 'Registro y verificación biométrica de rostro y huella', href: '../biometrics/index.html', icono: 'bi-fingerprint', tamano: 'lg', tono: 'night' },
  { titulo: 'Procesar documento', desc: 'OCR · nuevo registro desde documento', href: 'documents/pre-registro.html', icono: 'bi-file-earmark-text', tamano: 'md', tono: 'tint' },
  { titulo: 'Procesos electorales', desc: 'Convocatorias y mesas de votación', href: '../modules/electoral/index.html', icono: 'bi-card-checklist', tamano: 'md', tono: 'tint' },
  { titulo: 'Consultas con IA', desc: 'Preguntas sobre identidad y procesos', href: '../modules/ia/index.html', icono: 'bi-stars', tamano: 'md', tono: 'tint' },
  { titulo: 'Gestionar usuarios', desc: 'Cuentas y roles de la organización', href: '../modules/admin/index.html', icono: 'bi-person-gear', tamano: 'sm', tono: 'soon', proximamente: true },
  { titulo: 'Reportes y auditoría', desc: 'Trazabilidad y exportación de datos', href: '../modules/admin/index.html', icono: 'bi-clipboard-data', tamano: 'sm', tono: 'soon', proximamente: true },
];

/**
 * Resumen del log biométrico por resultado, para el mini gráfico de barras.
 * Cuenta TODOS los eventos del log (no solo los 4 que muestra la línea de tiempo).
 * @returns {{total: number, barras: Array<{clave: string, etiqueta: string, n: number, pct: number}>}}
 */
function construirResumenResultados() {
  const eventos = listarEventosBiometricos();
  const total = eventos.length;
  const definicion = [
    { clave: 'exito', etiqueta: 'Exitosas' },
    { clave: 'rechazo', etiqueta: 'Rechazadas' },
    { clave: 'reintento', etiqueta: 'Reintentos' },
  ];
  const barras = definicion.map((d) => {
    const n = eventos.filter((e) => e.resultado === d.clave).length;
    return { ...d, n, pct: total > 0 ? Math.round((n / total) * 100) : 0 };
  });
  return { total, barras };
}

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
 * Pinta los accesos rápidos como mosaico asimétrico. Los módulos sin pantalla
 * se muestran atenuados con la etiqueta "Próximamente" y no son enlaces.
 * @returns {void}
 */
function renderizarAccesosRapidos() {
  const lista = document.getElementById('grid-accesos-rapidos');
  if (!lista) return;

  lista.innerHTML = ACCESOS_RAPIDOS_MOCK.map((acceso) => {
    const contenido = `
      <span class="dh-tile__icon" aria-hidden="true"><i class="bi ${acceso.icono}"></i></span>
      <span class="dh-tile__body">
        <span class="dh-tile__title">${escaparHtml(acceso.titulo)}</span>
        <span class="dh-tile__desc">${escaparHtml(acceso.desc)}</span>
      </span>`;
    const celda = `dh-cell dh-cell--${acceso.tamano}`;
    if (acceso.proximamente) {
      return `<li class="${celda}"><div class="dh-tile dh-tile--${acceso.tono}" aria-disabled="true">${contenido}<span class="dh-tile__tag dh-mono">Próximamente</span></div></li>`;
    }
    return `<li class="${celda}"><a class="dh-tile dh-tile--${acceso.tono}" href="${acceso.href}">${contenido}<span class="dh-tile__arrow" aria-hidden="true">↗</span></a></li>`;
  }).join('');
}

/**
 * Pinta el mini gráfico de resultados (tres barras con su conteo). Cada fila
 * tiene texto visible, así que no depende del color; la barra es decorativa.
 * Sin eventos en el log, el gráfico se oculta.
 * @returns {void}
 */
function renderizarResumenResultados() {
  const contenedor = document.getElementById('resumen-resultados');
  if (!contenedor) return;

  const { total, barras } = construirResumenResultados();
  if (total === 0) {
    contenedor.hidden = true;
    contenedor.innerHTML = '';
    return;
  }

  contenedor.hidden = false;
  contenedor.innerHTML = `
    <p class="dh-bars__title dh-mono">Resultados del log · ${conteoTexto(total, 'evento', 'eventos')}</p>
    ${barras.map((b) => `
      <div class="dh-bar dh-bar--${b.clave}">
        <span class="dh-bar__label">${escaparHtml(b.etiqueta)}</span>
        <span class="dh-bar__track" aria-hidden="true"><i style="--w: ${b.pct}%"></i></span>
        <span class="dh-bar__n dh-mono">${b.n}</span>
      </div>`).join('')}`;
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
  renderizarResumenResultados();
  renderizarFeedActividad();
});
