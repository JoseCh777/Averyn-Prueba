/**
 * Verificación de identidad 1:1 (biometrics/verification/index.html).
 *
 * Dos modos en la misma ruta:
 *   - Sin `?resultado`: identifica a la persona y elige el método biométrico,
 *     y continúa hacia la captura compartida.
 *   - Con `?resultado`: muestra el desenlace de la verificación (éxito, fallo
 *     o reintento), ya conectado a la persona capturada.
 *
 * Nunca expone términos técnicos: el desenlace se comunica en lenguaje humano.
 */

const VERIFICACION_RUTA_DASHBOARD = '../../dashboard/index.html';
const VERIFICACION_RUTA_BIOMETRIA = '../index.html';
const VERIFICACION_TEXTO_AVISO_BLOQUEO = 'Selecciona una persona para desbloquear el método.';

/** Estado del asistente de identificación. */
const verificacionEstado = { paso: 1, persona: null };

/* Utilidades */

/**
 * Lee un parámetro de la URL actual.
 * @param {string} nombre
 * @returns {string|null}
 */
function parametroVerificacion(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

/**
 * Ruta a la captura para una persona y método dados.
 * @param {object|null} persona
 * @param {'rostro'|'huella'} metodo
 * @returns {string}
 */
function rutaCapturaVerificacion(persona, metodo) {
  if (!persona) return 'index.html';
  return `../capture/index.html?modo=verificacion&persona=${persona.id}&modalidad=${metodo}`;
}

/* Modo resultado */

/**
 * Devuelve el HTML del resumen de la persona verificada.
 * @param {object|null} persona
 * @returns {string}
 */
function plantillaPersonaVerificada(persona) {
  if (!persona) return '';
  return `
    <dl class="av-detail" style="margin-top: var(--av-space-4)">
      <div class="av-detail__row"><dt>Nombre</dt><dd>${persona.nombre}</dd></div>
      <div class="av-detail__row"><dt>Documento</dt><dd>Cédula ${persona.documento}</dd></div>
      <div class="av-detail__row"><dt>Afiliación</dt><dd>${persona.afiliacion}</dd></div>
      <div class="av-detail__row"><dt>Hora de verificación</dt><dd>${formatearFechaBiometria(new Date().toISOString())}</dd></div>
      <div class="av-detail__row"><dt>Estado</dt><dd><span class="av-chip av-chip--success"><i class="bi bi-check-circle" aria-hidden="true"></i>Verificado</span></dd></div>
    </dl>`;
}

/**
 * Construye el HTML del resultado para un desenlace dado.
 * @param {'exito'|'fallo'|'reintento'} desenlace
 * @param {object|null} persona
 * @returns {string}
 */
function plantillaResultadoVerificacion(desenlace, persona) {
  const nombre = persona ? persona.nombre : 'la persona';
  const captura = rutaCapturaVerificacion(persona, 'rostro');

  if (desenlace === 'exito') {
    return `
      <div class="av-alert av-alert--success">
        <span class="av-alert__icon"><i class="bi bi-check-lg" aria-hidden="true"></i></span>
        <div class="av-alert__content">
          <span class="av-alert__title">Identidad verificada</span>
          <p class="av-alert__description">La verificación biométrica coincide con el registro de ${nombre}.</p>
        </div>
      </div>
      ${plantillaPersonaVerificada(persona)}
      <div class="av-modal__footer">
        <a href="${VERIFICACION_RUTA_BIOMETRIA}" class="av-btn av-btn-secondary">Volver a Biometría</a>
        <a href="${persona ? `../../dashboard/identity/detalle.html?id=${persona.id}` : VERIFICACION_RUTA_DASHBOARD}" class="av-btn av-btn-primary">Continuar <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
      </div>`;
  }

  if (desenlace === 'fallo') {
    return `
      <div class="av-alert av-alert--error">
        <span class="av-alert__icon"><i class="bi bi-x-lg" aria-hidden="true"></i></span>
        <div class="av-alert__content">
          <span class="av-alert__title">No pudimos verificar tu identidad</span>
          <p class="av-alert__description">Vuelve a intentar la captura.</p>
        </div>
      </div>
      <div class="av-modal__footer">
        <a href="${VERIFICACION_RUTA_BIOMETRIA}" class="av-btn av-btn-secondary">Volver a Biometría</a>
        <a href="${captura}" class="av-btn av-btn-primary"><i class="bi bi-arrow-repeat" aria-hidden="true"></i> Reintentar</a>
      </div>`;
  }

  return `
    <div class="av-alert av-alert--warning">
      <span class="av-alert__icon"><i class="bi bi-exclamation-lg" aria-hidden="true"></i></span>
      <div class="av-alert__content">
        <span class="av-alert__title">Iluminación insuficiente</span>
        <p class="av-alert__description">Acércate a una fuente de luz antes de repetir la captura.</p>
      </div>
    </div>
    <div class="av-modal__footer">
      <a href="${VERIFICACION_RUTA_BIOMETRIA}" class="av-btn av-btn-secondary">Volver a Biometría</a>
      <a href="${captura}" class="av-btn av-btn-primary"><i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Repetir captura</a>
    </div>`;
}

/**
 * Marca el botón del selector de demostración correspondiente.
 * @param {string} desenlace
 * @returns {void}
 */
function marcarSegmentoResultado(desenlace) {
  document.querySelectorAll('.av-seg__btn').forEach((boton) => {
    boton.classList.toggle('is-active', boton.getAttribute('data-resultado') === desenlace);
  });
}

/**
 * Pinta el resultado y alterna entre identificación y resultado.
 * @param {'exito'|'fallo'|'reintento'} desenlace
 * @param {object|null} persona
 * @returns {void}
 */
function mostrarResultadoVerificacion(desenlace, persona) {
  const contenedor = document.getElementById('resultado-verificacion');
  const vistaResultado = document.getElementById('verificacion-resultado');
  const vistaIdentificar = document.getElementById('verificacion-identificar');
  const reciente = listarEventosBiometricos().find((evento) => evento.tipoOperacion === 'verificacion' && evento.resultado === desenlace);

  if (contenedor) contenedor.innerHTML = plantillaResultadoVerificacion(desenlace, persona);
  if (vistaResultado) vistaResultado.hidden = false;
  if (vistaIdentificar) vistaIdentificar.hidden = true;
  marcarSegmentoResultado(desenlace);

  // Si no vino una persona por URL, se intenta resolver con el evento reciente.
  if (!persona && reciente) {
    const dela = obtenerPersonaBiometria(reciente.personaId);
    if (dela && contenedor) contenedor.innerHTML = plantillaResultadoVerificacion(desenlace, dela);
  }
}

/**
 * Conecta el selector de demostración de desenlaces.
 * @param {object|null} persona
 * @returns {void}
 */
function inicializarDemoVerificacion(persona) {
  document.querySelectorAll('.av-seg__btn').forEach((boton) => {
    boton.addEventListener('click', () => {
      const desenlace = boton.getAttribute('data-resultado');
      if (['exito', 'fallo', 'reintento'].includes(desenlace)) {
        mostrarResultadoVerificacion(desenlace, persona);
      }
    });
  });
}

/* Modo identificación */

/**
 * Activa el panel del paso indicado.
 * @param {number} paso
 * @returns {void}
 */
function activarPanelVerificacion(paso) {
  document.querySelectorAll('.av-tabs__item').forEach((tab) => {
    const activo = Number(tab.getAttribute('data-paso')) === paso;
    tab.classList.toggle('is-active', activo);
    tab.setAttribute('aria-selected', String(activo));
    tab.setAttribute('tabindex', activo ? '0' : '-1');
  });
  document.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
    panel.hidden = panel.id !== `vpanel-${paso === 2 ? 'metodo' : 'persona'}`;
  });
}

/**
 * Sincroniza los métodos biométricos del paso 2 con el perfil de la persona:
 * cada modalidad se habilita solo si la persona la tiene registrada, y el
 * texto del subtítulo informa qué dispositivo la atiende. Si la modalidad
 * marcada quedó deshabilitada, se salta al primer método disponible.
 * @returns {void}
 */
function sincronizarMetodosVerificacion() {
  const persona = verificacionEstado.persona;

  document.querySelectorAll('input[name="metodo"]').forEach((radio) => {
    const metodo = radio.value;
    const perfil = obtenerPerfilBiometrico(persona ? persona.id : 0);
    const disponible = Boolean(persona && perfil[metodo]);
    const card = radio.closest('[data-metodo-card]');

    radio.disabled = !disponible;
    if (card) {
      card.style.opacity = disponible ? '1' : '0.55';
      card.style.cursor = disponible ? 'pointer' : 'not-allowed';
    }

    const sub = document.getElementById(`verificacion-sub-${metodo}`);
    if (sub) {
      sub.innerHTML = disponible
        ? (metodo === 'rostro' ? 'Cámara CAM-001' : 'Lector BIO-001')
        : `<i class="bi bi-plug" aria-hidden="true"></i> ${persona ? 'No registrado para esta persona' : 'Selecciona una persona'}`;
    }
  });

  const marcada = document.querySelector('input[name="metodo"]:checked');
  if (marcada && marcada.disabled) {
    const primerDisponible = document.querySelector('input[name="metodo"]:not(:disabled)');
    if (primerDisponible) primerDisponible.checked = true;
  }
}

/**
 * Sincroniza el footer del asistente.
 * @returns {void}
 */
function actualizarFooterVerificacion() {
  const btnAtras = document.getElementById('btn-verificacion-atras');
  const btnContinuar = document.getElementById('btn-verificacion-continuar');
  if (!btnAtras || !btnContinuar) return;

  btnAtras.disabled = verificacionEstado.paso === 1;

  let habilitadoContinuar = false;
  if (verificacionEstado.paso === 1) {
    habilitadoContinuar = Boolean(verificacionEstado.persona);
  } else {
    const seleccion = document.querySelector('input[name="metodo"]:checked');
    habilitadoContinuar = Boolean(
      verificacionEstado.persona && seleccion &&
      tieneModalidadBiometrica(verificacionEstado.persona.id, seleccion.value)
    );
  }
  btnContinuar.disabled = !habilitadoContinuar;
}

/**
 * Ir a un paso del asistente de identificación.
 * @param {number} paso
 * @returns {void}
 */
function irAPasoVerificacion(paso) {
  verificacionEstado.paso = paso;
  activarPanelVerificacion(paso);
  actualizarFooterVerificacion();
  if (paso === 2) renderizarResumenVerificacion();
}

/**
 * Muestra el resumen de la persona y, por modalidad, si la modalidad marcada
 * está registrada (o si ninguna lo está) muestra la alerta correspondiente.
 * @returns {void}
 */
function renderizarResumenVerificacion() {
  const persona = verificacionEstado.persona;
  const resumen = document.getElementById('verificacion-persona-resumen');
  const alerta = document.getElementById('verificacion-sin-registro');
  const alertaTitulo = document.getElementById('verificacion-sin-registro-titulo');
  const alertaTexto = document.getElementById('verificacion-sin-registro-texto');
  if (!persona) return;

  if (resumen) resumen.textContent = `Persona: ${persona.nombre} · Cédula ${persona.documento} · ${persona.afiliacion}`;

  sincronizarMetodosVerificacion();
  actualizarFooterVerificacion();

  const seleccion = document.querySelector('input[name="metodo"]:checked');
  const metodo = seleccion ? seleccion.value : null;
  const tieneMetodo = metodo && tieneModalidadBiometrica(persona.id, metodo);

  if (!alerta) return;
  alerta.hidden = Boolean(tieneMetodo);
  if (!tieneMetodo) {
    const metodoTexto = metodo === 'huella' ? 'huella' : 'rostro';
    if (alertaTitulo) alertaTitulo.textContent = `Esta persona no tiene ${metodoTexto} registrado`;
    if (alertaTexto) {
      alertaTexto.textContent = `${persona.nombre} no tiene ${metodoTexto} registrado. Primero registra su biometría para poder verificarla.`;
    }
  }
}

/**
 * Guarda la persona seleccionada.
 * @param {object} persona
 * @returns {void}
 */
function seleccionarPersonaVerificacion(persona) {
  verificacionEstado.persona = persona;
  const aviso = document.getElementById('verificacion-aviso');
  if (aviso) aviso.textContent = '';
  actualizarFooterVerificacion();
}

/**
 * Continúa al método o lanza la captura.
 * @returns {void}
 */
function continuarVerificacion() {
  if (verificacionEstado.paso === 1) {
    if (verificacionEstado.persona) irAPasoVerificacion(2);
    return;
  }

  const persona = verificacionEstado.persona;
  const seleccion = document.querySelector('input[name="metodo"]:checked');
  if (!persona || !seleccion) return;
  if (!tieneModalidadBiometrica(persona.id, seleccion.value)) return;

  window.location.href = rutaCapturaVerificacion(persona, seleccion.value);
}

/**
 * Retrocede un paso.
 * @returns {void}
 */
function retrocederVerificacion() {
  if (verificacionEstado.paso > 1) irAPasoVerificacion(verificacionEstado.paso - 1);
}

/**
 * Conecta los tabs del asistente.
 * @returns {void}
 */
function inicializarTabsVerificacion() {
  document.querySelectorAll('.av-tabs__item').forEach((tab) => {
    tab.addEventListener('click', () => {
      const paso = Number(tab.getAttribute('data-paso'));
      if (paso === 2 && !verificacionEstado.persona) {
        const aviso = document.getElementById('verificacion-aviso');
        if (aviso) aviso.textContent = VERIFICACION_TEXTO_AVISO_BLOQUEO;
        return;
      }
      irAPasoVerificacion(paso);
    });
  });
}

/* Init */

document.addEventListener('DOMContentLoaded', () => {
  const resultadoParam = parametroVerificacion('resultado');

  if (['exito', 'fallo', 'reintento'].includes(resultadoParam)) {
    const persona = obtenerPersonaBiometria(parametroVerificacion('persona')) || null;
    inicializarDemoVerificacion(persona);
    mostrarResultadoVerificacion(resultadoParam, persona);
    return;
  }

  document.getElementById('verificacion-identificar').hidden = false;
  document.getElementById('verificacion-resultado').hidden = true;

  inicializarTabsVerificacion();
  crearSelectorPersonas({
    inputId: 'input-buscar-persona-verificacion',
    tbodyId: 'tabla-personas-verificacion',
    contadorId: 'contador-personas-verificacion',
    alSeleccionar: seleccionarPersonaVerificacion,
  });

  document.getElementById('btn-verificacion-atras').addEventListener('click', retrocederVerificacion);
  document.getElementById('btn-verificacion-continuar').addEventListener('click', continuarVerificacion);

  document.querySelectorAll('input[name="metodo"]').forEach((radio) => {
    radio.addEventListener('change', renderizarResumenVerificacion);
  });

  activarPanelVerificacion(1);
  actualizarFooterVerificacion();
});
