/**
 * Dashboard del módulo de Biometría (biometrics/index.html).
 *
 * Renderiza, a partir de la capa compartida:
 *   - indicadores del módulo,
 *   - actividad biométrica reciente,
 *   - estado de los dispositivos.
 *
 * No contiene lógica de captura ni de dominio: solo presenta los datos.
 */

/* Render del dashboard */

/**
 * Pinta los indicadores del módulo.
 * @param {{personasConBiometria: number, verificaciones: number, exitosas: number, rechazadas: number, dispositivosConectados: number}} resumen
 * @param {number} totalPersonas
 * @param {number} totalDispositivos
 * @returns {void}
 */
function renderizarKpisBiometria(resumen, totalPersonas, totalDispositivos) {
  const grid = document.getElementById('biometria-kpis');
  if (!grid) return;

  const tasaExito = resumen.verificaciones > 0
    ? `${Math.round((resumen.exitosas / resumen.verificaciones) * 100)}%`
    : '—';

  const kpis = [
    { variante: 'av-kpi--blue', tono: 'blue', icono: 'bi-person-badge', label: 'Personas con biometría', valor: String(resumen.personasConBiometria), nota: `de ${totalPersonas} personas` },
    { variante: 'av-kpi--violet', tono: 'violet', icono: 'bi-shield-check', label: 'Verificaciones', valor: String(resumen.verificaciones), nota: `${resumen.rechazadas} rechazadas` },
    { variante: 'av-kpi--success', tono: 'teal', icono: 'bi-graph-up-arrow', label: 'Tasa de éxito', valor: tasaExito, nota: `${resumen.exitosas} exitosas` },
    { variante: 'av-kpi--info', tono: 'cyan', icono: 'bi-broadcast', label: 'Dispositivos conectados', valor: String(resumen.dispositivosConectados), nota: `de ${totalDispositivos} equipos` },
  ];

  grid.innerHTML = kpis.map((kpi) => `
    <div class="av-kpi ${kpi.variante}">
      <span class="av-tint-circle av-tint-circle--${kpi.tono} av-kpi__icon" aria-hidden="true"><i class="bi ${kpi.icono}"></i></span>
      <span class="av-kpi__label">${kpi.label}</span>
      <span class="av-kpi__value">${kpi.valor}</span>
      <span class="av-kpi__note">${kpi.nota}</span>
    </div>
  `).join('');
}

/**
 * Pinta la actividad biométrica reciente (últimos 5 eventos).
 * @param {Array<object>} eventos
 * @returns {void}
 */
function renderizarActividadBiometrica(eventos) {
  const tbody = document.getElementById('actividad-biometrica-body');
  if (!tbody) return;

  const recientes = eventos.slice(0, 5);
  if (recientes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="av-empty-state">
            <i class="bi bi-activity av-empty-state__icon" aria-hidden="true"></i>
            <span class="av-empty-state__title">Aún no hay actividad biométrica</span>
            <p class="av-text-sm av-text-muted" style="margin: 0">Registra o verifica una identidad para ver eventos aquí.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = recientes.map((evento) => {
    const persona = obtenerPersonaBiometria(evento.personaId);
    const info = infoResultadoBiometrico(evento.resultado, evento.tipoOperacion);
    return `
      <tr>
        <td><span class="av-table__name">${persona ? persona.nombre : '—'}</span></td>
        <td>${textoOperacionBiometrica(evento.tipoOperacion)}</td>
        <td>${textoMetodoBiometrico(evento.metodo)}</td>
        <td><span class="av-chip ${info.clase}"><i class="bi ${info.icono}" aria-hidden="true"></i>${info.texto}</span></td>
        <td class="av-table__sub">${formatearFechaBiometria(evento.fecha)}</td>
      </tr>`;
  }).join('');
}

/**
 * Pinta el estado de los dispositivos biométricos.
 * @param {Array<object>} dispositivos
 * @returns {void}
 */
function renderizarDispositivosBiometricos(dispositivos) {
  const contenedor = document.getElementById('biometria-dispositivos');
  if (!contenedor) return;

  contenedor.innerHTML = dispositivos.map((dispositivo) => {
    const conectado = dispositivo.estado === 'conectado';
    const chip = conectado
      ? '<span class="av-chip av-chip--success"><i class="bi bi-broadcast" aria-hidden="true"></i>Conectado</span>'
      : '<span class="av-chip av-chip--neutral"><i class="bi bi-plug" aria-hidden="true"></i>Desconectado</span>';
    return `
      <div class="av-card">
        <div class="av-card__header">
          <div>
            <h3 class="av-card__section-title" style="margin: 0">${dispositivo.nombre}</h3>
            <p class="av-table__sub" style="margin: 2px 0 0">${dispositivo.id} · ${dispositivo.tipo}</p>
          </div>
          ${chip}
        </div>
        <dl class="av-detail">
          <div class="av-detail__row"><dt>Modelo</dt><dd>${dispositivo.modelo}</dd></div>
          <div class="av-detail__row"><dt>Ubicación</dt><dd>${dispositivo.ubicacion}</dd></div>
          <div class="av-detail__row"><dt>Serial</dt><dd>${dispositivo.serial}</dd></div>
        </dl>
      </div>`;
  }).join('');
}

/* Init */

document.addEventListener('DOMContentLoaded', () => {
  const personas = listarPersonasBiometria();
  const dispositivos = listarDispositivosBiometricos();
  const eventos = listarEventosBiometricos();

  renderizarKpisBiometria(resumenBiometria(), personas.length, dispositivos.length);
  renderizarActividadBiometrica(eventos);
  renderizarDispositivosBiometricos(dispositivos);
});
