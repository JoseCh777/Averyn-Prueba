/**
 * Capa de datos del módulo Electoral.
 * Sprint 1: los procesos se mantienen en memoria y en localStorage
 * para simular una futura conexión con backend.
 */

/** Clave usada en localStorage para persistir los procesos electorales. */
const CLAVE_PROCESOS_ELECTORALES = 'averyn_procesos_electorales';

/** Lista de procesos electorales creados en la sesión. */
const procesosElectorales = [];

/**
 * Obtiene la lista de procesos electorales guardados en localStorage.
 * Si no hay datos guardados o están corruptos, devuelve una lista vacía.
 * @returns {Array<Object>} Procesos electorales almacenados.
 */
function obtenerProcesos() {
  const guardados = localStorage.getItem(CLAVE_PROCESOS_ELECTORALES);
  if (!guardados) return [];

  try {
    return JSON.parse(guardados);
  } catch (error) {
    return [];
  }
}

/**
 * Guarda un proceso electoral en localStorage y lo refleja en memoria.
 * @param {Object} proceso - Proceso electoral a guardar.
 * @returns {void}
 */
function guardarProceso(proceso) {
  const procesos = obtenerProcesos();
  procesos.push(proceso);
  localStorage.setItem(CLAVE_PROCESOS_ELECTORALES, JSON.stringify(procesos));
  procesosElectorales.push(proceso);
}

/**
 * Genera el siguiente id disponible para un nuevo proceso electoral.
 * @returns {number} Siguiente id secuencial según los procesos guardados.
 */
function generarId() {
  return obtenerProcesos().length + 1;
}

/**
 * Verifica si ya existe un proceso electoral con el nombre indicado.
 * @param {string} nombre - Nombre del proceso a buscar.
 * @returns {boolean} true si el nombre ya está en uso.
 */
function existeProcesoConNombre(nombre) {
  const nombreNormalizado = nombre.trim().toLowerCase();
  return obtenerProcesos().some(
    (proceso) => proceso.nombre.trim().toLowerCase() === nombreNormalizado
  );
}

/**
 * Padrón de participantes del proceso electoral. Se toma del catálogo único
 * de personas (common/personas-catalogo.js) para que el padrón refleje las
 * personas de Identidad/Biometría sin duplicar datos.
 * @returns {Array<{id: number, nombre: string, documento: string, afiliacion: string, estado: 'verificado'|'pendiente'}>}
 */
function listarPadronElectoral() {
  return listarPersonasCatalogo();
}

/**
 * Filtra el padrón por texto (nombre o documento) y por afiliación.
 * Un filtro vacío no descarta participantes.
 * @param {string} texto - Texto de búsqueda para nombre o documento.
 * @param {string} afiliacion - Afiliación a filtrar ('' = todas).
 * @returns {Array<object>} Participantes que cumplen ambos criterios.
 */
function filtrarParticipantes(texto, afiliacion) {
  const termino = texto.trim().toLowerCase();
  const padron = listarPadronElectoral();
  const resultado = [];

  for (let i = 0; i < padron.length; i++) {
    const participante = padron[i];

    const coincideTexto =
      termino === '' ||
      participante.nombre.toLowerCase().includes(termino) ||
      participante.documento.includes(termino);

    const coincideAfiliacion =
      afiliacion === '' || participante.afiliacion === afiliacion;

    if (coincideTexto && coincideAfiliacion) {
      resultado.push(participante);
    }
  }

  return resultado;
}