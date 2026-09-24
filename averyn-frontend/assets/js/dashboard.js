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
 * Construye los indicadores del panel en tiempo real desde las fuentes de
 * datos reales de la demo: el catálogo de personas (averyn_personas), el
 * resumen biométrico (averyn.biometria.*) y los procesos electorales
 * (averyn_procesos_electorales). Cada valor es trazable: no hay cifras
 * inventadas.
 * @returns {Array<{id: string, label: string, icono: string, tono: string, variante: string, valor: string, delta: string, direccion: 'up'|'down', nota: string}>}
 */
function construirKpis() {
  const personas = listarPersonasCatalogo();
  const totalPersonas = personas.length;
  const verificadas = personas.filter((p) => p.estado === 'verificado').length;
  const pendientes = totalPersonas - verificadas;

  const resumen = resumenBiometria();
  const dispositivos = listarDispositivosBiometricos();
  const procesos = obtenerProcesos();

  return [
    {
      id: 'personas', label: 'Personas registradas', icono: 'bi-people', tono: 'blue', variante: 'av-kpi--blue',
      valor: String(totalPersonas), delta: `${verificadas} verificadas`, direccion: 'up',
      nota: `${pendientes} pendientes · catálogo averyn_personas`,
    },
    {
      id: 'verificaciones', label: 'Verificaciones registradas', icono: 'bi-patch-check-fill', tono: 'success', variante: 'av-kpi--success',
      valor: String(resumen.verificaciones), delta: `${resumen.exitosas} exitosas`, direccion: 'up',
      nota: `${resumen.rechazadas} rechazadas · log biométrico`,
    },
    {
      id: 'electoral', label: 'Procesos electorales', icono: 'bi-check2-square', tono: 'violet', variante: 'av-kpi--violet',
      valor: String(procesos.filter((p) => p.estado === 'OPEN' || p.estado === 'DRAFT').length),
      delta: `${procesos.length} totales`, direccion: 'up',
      nota: 'guardados en averyn_procesos_electorales',
    },
    {
      id: 'accesos', label: 'Dispositivos conectados', icono: 'bi-broadcast', tono: 'indigo', variante: 'av-kpi--indigo',
      valor: String(resumen.dispositivosConectados),
      delta: `${dispositivos.length - resumen.dispositivosConectados} desconectados`, direccion: 'up',
      nota: `de ${dispositivos.length} dispositivos de biometría`,
    },
  ];
}

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
 * Construye la actividad reciente desde el log biométrico real
 * (averyn.biometria.eventos): se muestran los 4 eventos más recientes con
 * nombre de persona, método, resultado y fecha.
 * @returns {Array<{tipo: string, titulo: string, desc: string, meta: string}>}
 */
function construirActividadReciente() {
  return listarEventosBiometricos().slice(0, 4).map((evento) => {
    const persona = obtenerPersonaCatalogo(evento.personaId);
    const nombre = persona ? persona.nombre : `Persona #${evento.personaId}`;
    const operacion = textoOperacionBiometrica(evento.tipoOperacion);
    const metodo = textoMetodoBiometrico(evento.metodo);
    const info = infoResultadoBiometrico(evento.resultado, evento.tipoOperacion);
    return {
      tipo: 'biometria',
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
 * Pinta los KPI del panel.
 * @returns {void}
 */
function renderizarKpis() {
  const grid = document.getElementById('kpi-grid');
  if (!grid) return;

  grid.innerHTML = construirKpis().map((kpi) => {
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

  const actividad = construirActividadReciente();
  if (actividad.length === 0) {
    lista.innerHTML = `
      <li class="av-feed__item">
        <span class="av-tint-circle av-tint-circle--sm av-tint-circle--slate" aria-hidden="true"><i class="bi bi-collection"></i></span>
        <div class="av-feed__body">
          <span class="av-feed__title">Sin actividad reciente</span>
          <span class="av-feed__desc">Aún no hay eventos en el log biométrico.</span>
        </div>
      </li>`;
    return;
  }

  lista.innerHTML = actividad.map((evento) => {
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
