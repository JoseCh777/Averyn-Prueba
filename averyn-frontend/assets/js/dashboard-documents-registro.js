/**
 * Interacciones de la vista "Nuevo registro" (dashboard/documents/pre-registro.html):
 * selector de tipo de documento, subida/captura simulada del documento,
 * y acciones del wizard (nuevo escaneo / continuar).
 * Sprint 1: todo simulado en memoria, sin conexión real a cámara ni scanner
 * (esto se conecta en una fase posterior, ver 6.4 de la Guía de Actividades).
 */

/**
 * Marca como activo el botón de tipo de documento clickeado dentro
 * del selector segmentado, quitando el estado activo de los demás.
 * @param {HTMLElement} botonSeleccionado - Botón .av-seg__btn clickeado.
 * @returns {void}
 */
function seleccionarTipoDocumento(botonSeleccionado) {
  const grupo = botonSeleccionado.closest('.av-seg');
  if (!grupo) return;

  grupo.querySelectorAll('.av-seg__btn').forEach((boton) => boton.classList.remove('is-active'));
  botonSeleccionado.classList.add('is-active');
}

/**
 * Conecta cada botón del selector de tipo de documento (C.C./C.E./T.I./Pasaporte).
 * @returns {void}
 */
function inicializarSelectorTipoDocumento() {
  const botones = document.querySelectorAll('.av-seg .av-seg__btn');
  botones.forEach((boton) => {
    boton.addEventListener('click', () => seleccionarTipoDocumento(boton));
  });
}

/**
 * Actualiza la vista previa de captura para reflejar que se recibió
 * un documento (nombre de archivo o modo de captura), sin subir nada real.
 * @param {string} textoEstado - Texto a mostrar debajo del ícono de vista previa.
 * @returns {void}
 */
function actualizarVistaPreviaDocumento(textoEstado) {
  const preview = document.querySelector('.av-capture__preview');
  if (!preview) return;

  preview.innerHTML = `
    <i class="bi bi-file-earmark-check" aria-hidden="true"></i>
    <p style="margin: 0">${textoEstado}</p>
  `;
}

/**
 * Conecta el botón "Subir archivo": abre el selector de archivos nativo
 * y, al elegir uno, actualiza la vista previa con su nombre.
 * @returns {void}
 */
function inicializarSubidaArchivo() {
  const btnSubir = document.getElementById('btn-registro-subir-archivo');
  if (!btnSubir) return;

  const inputArchivo = document.createElement('input');
  inputArchivo.type = 'file';
  inputArchivo.accept = '.jpg,.jpeg,.png,.pdf';
  inputArchivo.hidden = true;
  document.body.appendChild(inputArchivo);

  btnSubir.addEventListener('click', () => inputArchivo.click());

  inputArchivo.addEventListener('change', () => {
    if (inputArchivo.files.length > 0) {
      actualizarVistaPreviaDocumento(`Archivo seleccionado: ${inputArchivo.files[0].name}`);
    }
  });
}

/**
 * Conecta los botones "Cámara" y "Cámara IP": simulan el inicio de una
 * captura en vivo actualizando la vista previa (sin acceso real a la cámara).
 * @returns {void}
 */
function inicializarCapturaPorCamara() {
  const btnCamara = document.getElementById('btn-registro-camara');
  const btnCamaraIp = document.getElementById('btn-registro-camara-ip');

  if (btnCamara) {
    btnCamara.addEventListener('click', () => actualizarVistaPreviaDocumento('Captura simulada desde cámara local'));
  }
  if (btnCamaraIp) {
    btnCamaraIp.addEventListener('click', () => actualizarVistaPreviaDocumento('Captura simulada desde cámara IP'));
  }
}

/**
 * Conecta el botón "Nuevo escaneo": limpia la vista previa y vuelve
 * el selector de tipo de documento a su primera opción (C.C.).
 * @returns {void}
 */
function inicializarNuevoEscaneo() {
  const btnNuevoEscaneo = document.getElementById('btn-registro-nuevo-escaneo');
  if (!btnNuevoEscaneo) return;

  btnNuevoEscaneo.addEventListener('click', () => {
    const preview = document.querySelector('.av-capture__preview');
    if (preview) {
      preview.innerHTML = `
        <i class="bi bi-file-earmark-image" aria-hidden="true"></i>
        <p style="margin: 0">Vista previa del documento</p>
      `;
    }
    const primerTipo = document.querySelector('.av-seg .av-seg__btn');
    if (primerTipo) seleccionarTipoDocumento(primerTipo);
  });
}

/**
 * Conecta el botón "Continuar a captura de rostro": por ahora navega
 * al siguiente paso del wizard. Actualizar la ruta cuando el bloque de
 * Biometría (Daniel) tenga lista la vista de captura de rostro.
 * @returns {void}
 */
function inicializarContinuarWizard() {
  const btnContinuar = document.getElementById('btn-registro-continuar');
  if (!btnContinuar) return;

  btnContinuar.addEventListener('click', () => {
    window.location.href = '../../biometrics/capture/index.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarSelectorTipoDocumento();
  inicializarSubidaArchivo();
  inicializarCapturaPorCamara();
  inicializarNuevoEscaneo();
  inicializarContinuarWizard();
});