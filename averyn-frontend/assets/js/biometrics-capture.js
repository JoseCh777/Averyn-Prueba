/**
 * Captura biométrica compartida (biometrics/capture/index.html).
 *
 * Es el paso de captura de los dos flujos del módulo, decidido por el
 * parámetro `modo`:
 *   - `modo=registro`      → crea/actualiza el perfil biométrico de la persona.
 *   - `modo=verificacion`  → compara la captura contra el registro (1:1).
 *
 * La cámara es real (getUserMedia) y el análisis (calidad, presencia/liveness
 * y coincidencia) es simulado. Si no hay cámara o se niega el permiso, la
 * captura continúa con un panel de reemplazo: la demo nunca depende del permiso.
 *
 * Este archivo NO captura documentos: el OCR es un dominio aparte.
 */

/* Configuración */

const CAPTURA_DURACION_MS = 1800;
const CAPTURA_INTERVALO_MS = 60;
const CAPTURA_PROBABILIDAD_FALLO = 0.15;

/** Contexto de la operación, leído de la URL. */
const capturaContexto = { modo: 'registro', persona: null, modalidad: 'rostro' };

/** Estado de la captura. */
const capturaEstado = { fase: 'esperando', stream: null, temporizador: null };

/* Contexto */

/**
 * Lee y valida el contexto de la captura desde la URL.
 * @returns {boolean} true si el contexto es válido.
 */
function leerContextoCaptura() {
  const parametros = new URLSearchParams(window.location.search);
  const persona = obtenerPersonaBiometria(parametros.get('persona'));
  const modo = parametros.get('modo') === 'verificacion' ? 'verificacion' : parametros.get('modo') === 'registro' ? 'registro' : null;
  const modalidad = parametros.get('modalidad') === 'huella' ? 'huella' : 'rostro';

  if (!persona || !modo) return false;

  capturaContexto.modo = modo;
  capturaContexto.persona = persona;
  capturaContexto.modalidad = modalidad;
  return true;
}

/**
 * Ajusta los textos de la página según el modo (registro o verificación).
 * @returns {void}
 */
function renderizarContextoCaptura() {
  const { modo, persona, modalidad } = capturaContexto;
  const esRegistro = modo === 'registro';

  const titulo = document.getElementById('captura-titulo');
  const desc = document.getElementById('captura-desc');
  const migaja = document.getElementById('captura-migaja');
  const personaTexto = document.getElementById('captura-persona');
  const filaPresencia = document.getElementById('fila-presencia');
  const btnCancelar = document.getElementById('btn-captura-cancelar');

  if (titulo) titulo.textContent = esRegistro ? 'Registro biométrico' : 'Verificación de identidad';
  if (desc) desc.textContent = esRegistro
    ? 'Captura el rostro para asociar el perfil biométrico a la persona.'
    : 'Captura el rostro para compararlo con el registro biométrico de la persona.';
  if (migaja) migaja.textContent = esRegistro ? 'Registrar biometría' : 'Verificar identidad';
  if (personaTexto) personaTexto.textContent = `${persona.nombre} · Cédula ${persona.documento} · ${persona.afiliacion} · Método: ${modalidad === 'huella' ? 'Huella' : 'Rostro'}`;
  if (filaPresencia) filaPresencia.hidden = esRegistro;
  if (btnCancelar) btnCancelar.setAttribute('href', esRegistro ? '../enrollment/index.html' : '../verification/index.html');
}

/* Cámara */

/**
 * Solicita acceso a la cámara del dispositivo.
 * @returns {Promise<MediaStream|null>}
 */
async function solicitarCamara() {
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') return null;
  try {
    return await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
  } catch (error) {
    return null;
  }
}

/** Detiene la cámara en curso. @returns {void} */
function detenerCamara() {
  if (capturaEstado.stream) {
    capturaEstado.stream.getTracks().forEach((pista) => pista.stop());
    capturaEstado.stream = null;
  }
}

/**
 * Prepara la cámara (o el panel de reemplazo) para el paso de captura.
 * @returns {Promise<void>}
 */
async function prepararCamara() {
  const video = document.getElementById('video-rostro');
  if (!video) return;
  if (!capturaEstado.stream) capturaEstado.stream = await solicitarCamara();
  if (capturaEstado.stream) video.srcObject = capturaEstado.stream;
  actualizarVistaCaptura();
}

/* Diagnóstico (calidad / presencia en lenguaje humano) */

/**
 * Pinta una fila del diagnóstico con icono y color según su estado.
 * @param {string} id - Id del <dd>.
 * @param {'espera'|'ok'|'error'} estado
 * @param {string} texto
 * @returns {void}
 */
function pintarFilaDiagnostico(id, estado, texto) {
  const celda = document.getElementById(id);
  if (!celda) return;
  const icono = estado === 'ok'
    ? '<i class="bi bi-check-lg" aria-hidden="true"></i>'
    : estado === 'error'
      ? '<i class="bi bi-x-lg" aria-hidden="true"></i>'
      : '<i class="bi bi-circle" aria-hidden="true"></i>';
  const color = estado === 'ok' ? 'var(--av-success)' : estado === 'error' ? 'var(--av-error)' : 'var(--av-gray-400)';
  celda.innerHTML = `<span style="color: ${color}; font-weight: 700" aria-hidden="true">${icono}</span> ${texto}`;
}

/**
 * Traduce la fase y el progreso de la captura al checklist visible.
 * @param {string} fase
 * @param {number} progreso
 * @returns {void}
 */
function actualizarDiagnostico(fase, progreso) {
  const verifica = capturaContexto.modo === 'verificacion';

  if (fase === 'esperando') {
    pintarFilaDiagnostico('diag-rostro', 'espera', 'En espera');
    pintarFilaDiagnostico('diag-posicion', 'espera', 'En espera');
    pintarFilaDiagnostico('diag-calidad', 'espera', 'En espera');
    if (verifica) pintarFilaDiagnostico('diag-presencia', 'espera', 'En espera');
    return;
  }

  if (fase === 'error') {
    pintarFilaDiagnostico('diag-rostro', 'ok', 'Detectado');
    pintarFilaDiagnostico('diag-posicion', 'ok', 'Correcta');
    pintarFilaDiagnostico('diag-calidad', 'error', 'Insuficiente');
    if (verifica) pintarFilaDiagnostico('diag-presencia', 'espera', 'No validada');
    return;
  }

  // capturando o capturado: se completa de forma progresiva.
  const ok = fase === 'capturado';
  pintarFilaDiagnostico('diag-rostro', 'ok', 'Detectado');
  pintarFilaDiagnostico('diag-posicion', progreso >= 35 || ok ? 'ok' : 'espera', progreso >= 35 || ok ? 'Correcta' : 'Ajustando');
  pintarFilaDiagnostico('diag-calidad', progreso >= 65 || ok ? 'ok' : 'espera', progreso >= 65 || ok ? 'Suficiente' : 'Analizando');
  if (verifica) pintarFilaDiagnostico('diag-presencia', progreso >= 85 || ok ? 'ok' : 'espera', progreso >= 85 || ok ? 'Validada' : 'Verificando');
}

/* Captura */

/**
 * Sincroniza los controles visibles según la fase de captura.
 * @returns {void}
 */
function actualizarVistaCaptura() {
  const fase = capturaEstado.fase;
  const video = document.getElementById('video-rostro');
  const overlay = document.getElementById('rostro-overlay');
  const miniatura = document.getElementById('rostro-miniatura');
  const espera = document.getElementById('rostro-espera');
  const esperaTexto = document.getElementById('rostro-espera-texto');
  const enVivo = document.getElementById('rostro-en-vivo');
  const mensaje = document.getElementById('rostro-mensaje');
  const alerta = document.getElementById('rostro-alerta');
  const btnCapturar = document.getElementById('btn-capturar-rostro');
  const btnReintentar = document.getElementById('btn-reintentar-rostro');
  const btnRepetir = document.getElementById('btn-repetir-rostro');
  const btnContinuar = document.getElementById('btn-continuar-captura');

  const hayCamara = Boolean(capturaEstado.stream);
  const hayFoto = Boolean(capturaEstado.rostro && capturaEstado.rostro.dataUrl);
  const mostrarVideo = hayCamara && !hayFoto;

  if (overlay) overlay.hidden = fase !== 'capturando';
  if (alerta) alerta.hidden = fase !== 'error';
  if (btnCapturar) {
    btnCapturar.hidden = fase !== 'esperando';
    btnCapturar.disabled = fase === 'capturando';
  }
  if (btnReintentar) btnReintentar.hidden = fase !== 'error';
  if (btnRepetir) btnRepetir.hidden = fase !== 'capturado';
  if (btnContinuar) btnContinuar.hidden = fase !== 'capturado';

  if (video) video.style.display = mostrarVideo ? 'block' : 'none';
  if (miniatura) {
    miniatura.hidden = !hayFoto;
    if (hayFoto) miniatura.src = capturaEstado.rostro.dataUrl;
  }
  if (espera) espera.hidden = mostrarVideo || hayFoto;
  if (esperaTexto && !mostrarVideo && !hayFoto) {
    esperaTexto.textContent = fase === 'error'
      ? 'Sin señal de cámara'
      : fase === 'capturado'
        ? 'Captura simulada validada'
        : 'Vista previa de la cámara';
  }
  if (enVivo) enVivo.hidden = !hayCamara || hayFoto;

  const TEXTOS = {
    esperando: 'Presiona "Capturar rostro" para comenzar.',
    capturando: 'Analizando rostro… mantén la posición.',
    capturado: 'Captura validada. Puedes continuar.',
    error: '',
  };
  if (mensaje) mensaje.textContent = TEXTOS[fase];
}

/** Inicia una captura simulada. @returns {void} */
function iniciarCaptura() {
  if (capturaEstado.fase === 'capturando') return;
  capturaEstado.fase = 'capturando';
  capturaEstado.rostro = null;
  actualizarVistaCaptura();
  iniciarProgresoCaptura();
}

/** Anima el progreso y el checklist durante la captura. @returns {void} */
function iniciarProgresoCaptura() {
  const barra = document.getElementById('rostro-progreso');
  const porcentaje = document.getElementById('rostro-porcentaje');
  const incremento = (CAPTURA_INTERVALO_MS / CAPTURA_DURACION_MS) * 100;
  let progreso = 0;

  if (barra) barra.style.width = '0%';
  if (porcentaje) porcentaje.textContent = '0%';

  capturaEstado.temporizador = window.setInterval(() => {
    progreso = Math.min(progreso + incremento, 100);
    if (barra) barra.style.width = `${progreso}%`;
    if (porcentaje) porcentaje.textContent = `${Math.round(progreso)}%`;
    actualizarDiagnostico('capturando', progreso);

    if (progreso >= 100) {
      window.clearInterval(capturaEstado.temporizador);
      capturaEstado.temporizador = null;
      finalizarCaptura();
    }
  }, CAPTURA_INTERVALO_MS);
}

/** Decide el desenlace de la captura. @returns {void} */
function finalizarCaptura() {
  if (Math.random() < CAPTURA_PROBABILIDAD_FALLO) {
    capturaEstado.fase = 'error';
    capturaEstado.rostro = null;
    actualizarDiagnostico('error', 100);
  } else {
    capturaEstado.fase = 'capturado';
    capturaEstado.rostro = { dataUrl: tomarFotograma() };
    detenerCamara();
    actualizarDiagnostico('capturado', 100);
  }
  actualizarVistaCaptura();
}

/**
 * Copia el fotograma actual del video a un canvas.
 * @returns {string|null}
 */
function tomarFotograma() {
  const video = document.getElementById('video-rostro');
  if (!video || !video.videoWidth) return null;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

/** Reinicia la captura desde el error y reintenta. @returns {Promise<void>} */
async function reintentarCaptura() {
  capturaEstado.fase = 'esperando';
  capturaEstado.rostro = null;
  actualizarDiagnostico('esperando', 0);
  actualizarVistaCaptura();
  await prepararCamara();
  iniciarCaptura();
}

/** Descarta la captura y permite repetirla. @returns {Promise<void>} */
async function repetirCaptura() {
  capturaEstado.fase = 'esperando';
  capturaEstado.rostro = null;
  actualizarDiagnostico('esperando', 0);
  actualizarVistaCaptura();
  await prepararCamara();
}

/* Cierre de la operación */

/**
 * Cierra la operación: persiste y navega según el modo.
 * @returns {void}
 */
function continuarCaptura() {
  if (capturaEstado.fase !== 'capturado') return;

  const { modo, persona, modalidad } = capturaContexto;

  if (modo === 'registro') {
    registrarModalidadBiometrica(persona.id, modalidad);
    registrarEventoBiometrico({ personaId: persona.id, tipoOperacion: 'registro', metodo: modalidad, resultado: 'exito', dispositivo: 'CAM-001' });
    window.location.href = `../enrollment/index.html?persona=${persona.id}&modalidad=${modalidad}&registrado=1`;
    return;
  }

  // Comparación simulada 1:1 (exito, fallo o reintento).
  const resultado = simularResultadoVerificacion();
  const resultadoEvento = resultado === 'fallo' ? 'rechazo' : resultado;
  registrarEventoBiometrico({ personaId: persona.id, tipoOperacion: 'verificacion', metodo: modalidad, resultado: resultadoEvento, dispositivo: 'CAM-001' });
  window.location.href = `../verification/index.html?persona=${persona.id}&resultado=${resultado}`;
}

/* Init */

document.addEventListener('DOMContentLoaded', async () => {
  const sinContexto = document.getElementById('captura-sin-contexto');
  const contenido = document.getElementById('captura-contenido');

  if (!leerContextoCaptura()) {
    if (sinContexto) sinContexto.hidden = false;
    if (contenido) contenido.hidden = true;
    document.body.setAttribute('data-modulo', 'biometria');
    return;
  }

  if (sinContexto) sinContexto.hidden = true;
  if (contenido) contenido.hidden = false;

  renderizarContextoCaptura();
  actualizarDiagnostico('esperando', 0);

  document.getElementById('btn-capturar-rostro').addEventListener('click', iniciarCaptura);
  document.getElementById('btn-reintentar-rostro').addEventListener('click', reintentarCaptura);
  document.getElementById('btn-repetir-rostro').addEventListener('click', repetirCaptura);
  document.getElementById('btn-continuar-captura').addEventListener('click', continuarCaptura);
  window.addEventListener('pagehide', detenerCamara);

  await prepararCamara();
  actualizarVistaCaptura();
});
