/**
 * Listado de procesos electorales (index.html):
 * carga los procesos guardados en localStorage y los muestra en una tabla.
 * Si todavía no hay ninguno, muestra el estado vacío.
 */

/** Etiquetas legibles para mostrar los valores guardados en el listado. */
const ETIQUETAS_INSTITUCION = {
  universidad: 'Universidad',
  colegio: 'Colegio',
  fundacion: 'Fundación',
  empresa: 'Empresa'
};

const ETIQUETAS_TIPO_PROCESO = {
  consejo: 'Elección de consejo',
  representantes: 'Elección de representantes',
  consulta: 'Consulta institucional',
  votacion: 'Votación general'
};

/** Datos del chip de estado según el estado del proceso. */
const ETIQUETAS_ESTADO = {
  DRAFT: { clase: 'av-chip--neutral', texto: 'Borrador', icono: 'bi-file-earmark-text' },
  CONFIGURATION: { clase: 'av-chip--warning', texto: 'Configurando', icono: 'bi-sliders' },
  OPEN: { clase: 'av-chip--success', texto: 'En curso', icono: 'bi-unlock' },
  CLOSED: { clase: 'av-chip--info', texto: 'Cerrado', icono: 'bi-lock' },
  COUNTING: { clase: 'av-chip--warning', texto: 'Conteo', icono: 'bi-bar-chart' },
  FINISHED: { clase: 'av-chip--success', texto: 'Finalizado', icono: 'bi-check-circle' },
  CANCELLED: { clase: 'av-chip--error', texto: 'Cancelado', icono: 'bi-x-circle' }
};

/**
 * Devuelve las iniciales de un nombre (ej. "Consejo Estudiantil" → "CE").
 * @param {string} nombre - Nombre del proceso.
 * @returns {string} Iniciales en mayúscula (máximo 2 letras).
 */
function inicialesDe(nombre) {
  const partes = nombre.trim().split(' ');
  const primera = partes[0] ? partes[0][0] : '';
  const segunda = partes[1] ? partes[1][0] : '';
  return (primera + segunda).toUpperCase();
}

/**
 * Convierte una fecha en formato AAAA-MM-DD a DD/MM/AAAA.
 * @param {string} valor - Fecha en formato del input de tipo date.
 * @returns {string} Fecha en formato de la interfaz de Averyn.
 */
function formatearFecha(valor) {
  if (!valor) return '-';
  const partes = valor.split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

/**
 * Devuelve los datos del chip de un estado del proceso.
 * Si el estado no está contemplado, muestra el valor tal cual.
 * @param {string} estado - Estado del proceso electoral.
 * @returns {{clase: string, texto: string, icono: string}} Datos del chip.
 */
function datosEstado(estado) {
  return ETIQUETAS_ESTADO[estado] || { clase: 'av-chip--neutral', texto: estado, icono: 'bi-question-circle' };
}

/**
 * Genera el HTML de una fila de la tabla de procesos.
 * @param {object} proceso - Proceso electoral guardado.
 * @returns {string} Fragmento HTML de la fila <tr>.
 */
function renderizarFilaProceso(proceso) {
  const estado = datosEstado(proceso.estado);
  const institucion = ETIQUETAS_INSTITUCION[proceso.institucion] || proceso.institucion;
  const tipo = ETIQUETAS_TIPO_PROCESO[proceso.tipoProceso] || proceso.tipoProceso;

  return `
    <tr>
      <td>
        <div class="av-table__person">
          <span class="av-avatar av-avatar--md av-avatar--blue" aria-hidden="true">${inicialesDe(proceso.nombre)}</span>
          <div class="av-table__person-info">
            <span class="av-table__name">${proceso.nombre}</span>
            <span class="av-table__sub">${tipo}</span>
          </div>
        </div>
      </td>
      <td><span class="av-tag"><i class="bi bi-building" aria-hidden="true"></i>${institucion}</span></td>
      <td>${formatearFecha(proceso.fechaInicio)} – ${formatearFecha(proceso.fechaFin)}</td>
      <td><span class="av-chip ${estado.clase}"><i class="bi ${estado.icono}" aria-hidden="true"></i>${estado.texto}</span></td>
    </tr>
  `;
}

/**
 * Muestra los procesos guardados en la tabla o el estado vacío si no hay.
 * @returns {void}
 */
function mostrarProcesos() {
  const procesos = obtenerProcesos();
  const contenedor = document.getElementById('contenedor-procesos');
  const estadoVacio = document.getElementById('estado-vacio');
  const tbody = document.getElementById('tabla-procesos-body');
  if (!contenedor || !estadoVacio || !tbody) return;

  if (procesos.length === 0) {
    contenedor.hidden = true;
    estadoVacio.hidden = false;
    return;
  }

  contenedor.hidden = false;
  estadoVacio.hidden = true;

  tbody.innerHTML = '';
  for (let i = 0; i < procesos.length; i++) {
    const fila = renderizarFilaProceso(procesos[i]);
    tbody.insertAdjacentHTML('beforeend', fila);
  }
}

document.addEventListener('DOMContentLoaded', mostrarProcesos);