/**
 * Registro biométrico (biometrics/enrollment/index.html).
 *
 * Flujo: seleccionar persona → seleccionar modalidad → captura (pantalla
 * compartida) → acta de registro. La captura y la persistencia del perfil
 * ocurren en biometrics/capture; aquí se prepara el contexto y se muestra el
 * acta cuando se vuelve con ?registrado=1.
 */

const REGISTRO_TEXTO_AVISO_BLOQUEO = 'Selecciona una persona para desbloquear la modalidad.';

/** Estado del asistente de registro. */
const registroEstado = { paso: 1, persona: null };

/**
 * Activa el panel del paso indicado y sincroniza los tabs.
 * @param {number} paso
 * @returns {void}
 */
function activarPanelRegistro(paso) {
  document.querySelectorAll('.av-tabs__item').forEach((tab) => {
    const activo = Number(tab.getAttribute('data-paso')) === paso;
    tab.classList.toggle('is-active', activo);
    tab.setAttribute('aria-selected', String(activo));
    tab.setAttribute('tabindex', activo ? '0' : '-1');
  });
  document.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
    panel.hidden = panel.id !== `panel-${paso === 2 ? 'modalidad' : 'persona'}`;
  });
}

/**
 * Cambia de paso en el registro.
 * @param {number} paso
 * @returns {void}
 */
function irAPasoRegistro(paso) {
  registroEstado.paso = paso;
  activarPanelRegistro(paso);
  actualizarFooterRegistro();
  if (paso === 2) renderizarResumenPersonaRegistro();
}

/**
 * Sincroniza el footer del registro.
 * @returns {void}
 */
function actualizarFooterRegistro() {
  const btnAtras = document.getElementById('btn-registro-atras');
  const btnContinuar = document.getElementById('btn-registro-continuar');
  if (!btnAtras || !btnContinuar) return;

  btnAtras.disabled = registroEstado.paso === 1;
  btnContinuar.disabled = registroEstado.paso === 1 && !registroEstado.persona;
}

/**
 * Muestra el resumen de la persona elegida y, si ya tiene rostro, un aviso.
 * @returns {void}
 */
function renderizarResumenPersonaRegistro() {
  const persona = registroEstado.persona;
  const resumen = document.getElementById('registro-persona-resumen');
  const aviso = document.getElementById('registro-aviso-existentes');
  const avisoTexto = document.getElementById('registro-aviso-existentes-texto');
  if (!persona) return;

  if (resumen) resumen.textContent = `Persona seleccionada: ${persona.nombre} · Cédula ${persona.documento} · ${persona.afiliacion}`;

  if (aviso && avisoTexto) {
    const yaTieneRostro = tieneModalidadBiometrica(persona.id, 'rostro');
    aviso.hidden = !yaTieneRostro;
    if (yaTieneRostro) avisoTexto.textContent = `${persona.nombre} ya tiene rostro registrado. Al continuar se actualizará su perfil biométrico.`;
  }
}

/**
 * Guarda la persona seleccionada y refresca el asistente.
 * @param {object} persona
 * @returns {void}
 */
function seleccionarPersonaRegistro(persona) {
  registroEstado.persona = persona;
  const aviso = document.getElementById('registro-aviso');
  if (aviso) aviso.textContent = '';
  actualizarFooterRegistro();
}

/**
 * Continúa al siguiente paso o lanza la captura según el paso actual.
 * @returns {void}
 */
function continuarRegistro() {
  if (registroEstado.paso === 1) {
    if (registroEstado.persona) irAPasoRegistro(2);
    return;
  }

  const persona = registroEstado.persona;
  const seleccion = document.querySelector('input[name="modalidad"]:checked');
  if (!persona || !seleccion) return;

  window.location.href = `../capture/index.html?modo=registro&persona=${persona.id}&modalidad=${seleccion.value}`;
}

/**
 * Retrocede un paso en el registro.
 * @returns {void}
 */
function retrocederRegistro() {
  if (registroEstado.paso > 1) irAPasoRegistro(registroEstado.paso - 1);
}

/**
 * Conecta los tabs y valida que la modalidad no se abra sin persona.
 * @returns {void}
 */
function inicializarTabsRegistro() {
  document.querySelectorAll('.av-tabs__item').forEach((tab) => {
    tab.addEventListener('click', () => {
      const paso = Number(tab.getAttribute('data-paso'));
      if (paso === 2 && !registroEstado.persona) {
        const aviso = document.getElementById('registro-aviso');
        if (aviso) aviso.textContent = REGISTRO_TEXTO_AVISO_BLOQUEO;
        return;
      }
      irAPasoRegistro(paso);
    });
  });
}

/**
 * Muestra el acta de registro cuando se vuelve con ?registrado=1.
 * @returns {void}
 */
function renderizarActaRegistro() {
  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get('registrado') !== '1') return;

  const persona = obtenerPersonaBiometria(parametros.get('persona'));
  const modalidad = parametros.get('modalidad') === 'huella' ? 'huella' : 'rostro';
  const flujo = document.getElementById('registro-flujo');
  const acta = document.getElementById('registro-acta');
  if (!flujo || !acta) return;

  flujo.hidden = true;
  acta.hidden = false;

  if (!persona) {
    acta.innerHTML = `
      <div class="av-empty-state">
        <i class="bi bi-person-x av-empty-state__icon" aria-hidden="true"></i>
        <span class="av-empty-state__title">No encontramos el registro</span>
        <p class="av-text-sm av-text-muted" style="margin: 0">Vuelve a iniciar el registro biométrico.</p>
        <a href="index.html" class="av-btn av-btn-primary" style="margin-top: var(--av-space-3)">Registrar biometría</a>
      </div>`;
    return;
  }

  const perfil = obtenerPerfilBiometrico(persona.id);
  const evento = listarEventosBiometricos().find((item) => item.personaId === persona.id && item.tipoOperacion === 'registro');

  acta.innerHTML = `
    <div class="av-alert av-alert--success">
      <span class="av-alert__icon"><i class="bi bi-check-lg" aria-hidden="true"></i></span>
      <div class="av-alert__content">
        <span class="av-alert__title">Registro biométrico completado</span>
        <p class="av-alert__description">El perfil biométrico se asoció correctamente a la persona.</p>
      </div>
    </div>
    <dl class="av-detail" style="margin-top: var(--av-space-4)">
      <div class="av-detail__row"><dt>Persona</dt><dd>${persona.nombre}</dd></div>
      <div class="av-detail__row"><dt>Documento</dt><dd>Cédula ${persona.documento}</dd></div>
      <div class="av-detail__row"><dt>Biometría registrada</dt><dd><span class="av-chip av-chip--info"><i class="bi ${modalidad === 'huella' ? 'bi-fingerprint' : 'bi-person-bounding-box'}" aria-hidden="true"></i>${modalidad === 'huella' ? 'Huella' : 'Rostro'}</span></dd></div>
      <div class="av-detail__row"><dt>Estado</dt><dd><span class="av-chip av-chip--success"><i class="bi bi-check-circle" aria-hidden="true"></i>${perfil.estado === 'activa' ? 'ACTIVA' : 'INACTIVA'}</span></dd></div>
      <div class="av-detail__row"><dt>Fecha de registro</dt><dd>${formatearFechaBiometria(perfil.fechaRegistro || (evento && evento.fecha))}</dd></div>
    </dl>
    <div class="av-modal__footer">
      <a href="../../dashboard/identity/detalle.html?id=${persona.id}" class="av-btn av-btn-secondary"><i class="bi bi-person-vcard" aria-hidden="true"></i> Ver perfil</a>
      <a href="index.html" class="av-btn av-btn-primary"><i class="bi bi-plus-lg" aria-hidden="true"></i> Registrar otra persona</a>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get('registrado') === '1') {
    renderizarActaRegistro();
    return;
  }

  inicializarTabsRegistro();
  crearSelectorPersonas({
    inputId: 'input-buscar-persona-registro',
    tbodyId: 'tabla-personas-registro',
    contadorId: 'contador-personas-registro',
    alSeleccionar: seleccionarPersonaRegistro,
  });

  document.getElementById('btn-registro-atras').addEventListener('click', retrocederRegistro);
  document.getElementById('btn-registro-continuar').addEventListener('click', continuarRegistro);

  activarPanelRegistro(1);
  actualizarFooterRegistro();
});
