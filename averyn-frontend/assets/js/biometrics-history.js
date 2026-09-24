/**
 * Historial / auditoría biométrica (biometrics/history/index.html).
 *
 * Presenta los eventos biométricos (registro y verificación) con filtros por
 * método y resultado. Cada operación del módulo alimenta esta vista.
 */

/**
 * Filtra los eventos biométricos por método y resultado.
 * @param {Array<object>} eventos
 * @param {string} metodo - "todos" | "rostro" | "huella".
 * @param {string} resultado - "todos" | "exito" | "rechazo" | "reintento" | "dispositivo".
 * @returns {Array<object>} Eventos filtrados.
 */
function filtrarEventosBiometricos(eventos, metodo, resultado) {
  return eventos.filter((evento) => {
    const coincideMetodo = metodo === 'todos' || evento.metodo === metodo;
    const coincideResultado = resultado === 'todos' || evento.resultado === resultado;
    return coincideMetodo && coincideResultado;
  });
}

/**
 * Pinta las filas del historial.
 * @param {Array<object>} eventos
 * @returns {void}
 */
function renderizarHistorialBiometrico(eventos) {
  const tbody = document.getElementById('historial-biometrico-body');
  const contador = document.getElementById('historial-contador');
  if (!tbody) return;

  const total = listarEventosBiometricos().length;
  if (contador) contador.textContent = `${eventos.length} de ${total} eventos`;

  if (eventos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="av-empty-state">
            <i class="bi bi-funnel av-empty-state__icon" aria-hidden="true"></i>
            <span class="av-empty-state__title">No hay eventos con esos filtros</span>
            <p class="av-text-sm av-text-muted" style="margin: 0">Ajusta el método o el resultado para ver otros registros.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = eventos.map((evento) => {
    const persona = obtenerPersonaBiometria(evento.personaId);
    const info = infoResultadoBiometrico(evento.resultado, evento.tipoOperacion);
    return `
      <tr>
        <td>
          <div class="av-table__person-info">
            <span class="av-table__name">${persona ? persona.nombre : '—'}</span>
            <span class="av-table__sub">${persona ? `Cédula ${persona.documento}` : ''}</span>
          </div>
        </td>
        <td>${textoOperacionBiometrica(evento.tipoOperacion)}</td>
        <td>${textoMetodoBiometrico(evento.metodo)}</td>
        <td><span class="av-chip ${info.clase}"><i class="bi ${info.icono}" aria-hidden="true"></i>${info.texto}</span></td>
        <td class="av-table__sub">${evento.dispositivo}</td>
        <td class="av-table__sub">${formatearFechaBiometria(evento.fecha)}</td>
        <td class="av-table__sub">${evento.operador}</td>
      </tr>`;
  }).join('');
}

/**
 * Conecta los filtros del historial.
 * @returns {void}
 */
function inicializarFiltrosHistorial() {
  const filtroMetodo = document.getElementById('filtro-metodo');
  const filtroResultado = document.getElementById('filtro-resultado');
  const eventos = listarEventosBiometricos();

  const refrescar = () => {
    const metodo = filtroMetodo ? filtroMetodo.value : 'todos';
    const resultado = filtroResultado ? filtroResultado.value : 'todos';
    renderizarHistorialBiometrico(filtrarEventosBiometricos(eventos, metodo, resultado));
  };

  if (filtroMetodo) filtroMetodo.addEventListener('change', refrescar);
  if (filtroResultado) filtroResultado.addEventListener('change', refrescar);
  refrescar();
}

document.addEventListener('DOMContentLoaded', inicializarFiltrosHistorial);
