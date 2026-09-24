/**
 * Catálogo único de personas (capa compartida).
 *
 * Fuente de verdad de PERSONAS para todos los módulos (Identidad, Biometría,
 * Electoral y OCR). Se persiste en localStorage bajo la clave `averyn_personas`
 * para que una persona creada en un módulo aparezca en los demás sin recargar
 * datos falsos.
 *
 * Los otros archivos NO deben definir su propia lista de personas superpuesta:
 * deben delegar aquí (p. ej. `listarPersonasCatalogo()`).
 */

const PERSONAS_CATALOGO_CLAVE = 'averyn_personas';

/**
 * Semilla inicial del catálogo: mismos nombres de campo que usa Identidad
 * (id, nombre, documento, afiliacion, estado).
 * @type {Array<{id: number, nombre: string, documento: string, afiliacion: string, estado: 'verificado'|'pendiente'}>}
 */
const PERSONAS_CATALOGO_SEED = [
  { id: 1, nombre: 'Ana Torres', documento: '10234567', afiliacion: 'Estudiante', estado: 'verificado' },
  { id: 2, nombre: 'Luis Pérez', documento: '10345678', afiliacion: 'Docente', estado: 'pendiente' },
  { id: 3, nombre: 'María Gómez', documento: '10456789', afiliacion: 'Administrativo', estado: 'verificado' },
  { id: 4, nombre: 'Carlos Ruiz', documento: '10567890', afiliacion: 'Estudiante', estado: 'pendiente' },
  { id: 5, nombre: 'Laura Díaz', documento: '10678901', afiliacion: 'Visitante', estado: 'verificado' },
  { id: 6, nombre: 'Jorge Ramírez', documento: '10789012', afiliacion: 'Docente', estado: 'verificado' },
  { id: 7, nombre: 'Paula Herrera', documento: '10890123', afiliacion: 'Estudiante', estado: 'pendiente' },
  { id: 8, nombre: 'Andrés Molina', documento: '10901234', afiliacion: 'Administrativo', estado: 'verificado' },
];

/**
 * Lee el catálogo desde localStorage; si no existe o está corrupto, lo siembra.
 * @returns {Array<object>}
 */
function listarPersonasCatalogo() {
  try {
    const crudo = localStorage.getItem(PERSONAS_CATALOGO_CLAVE);
    if (crudo) {
      const personas = JSON.parse(crudo);
      if (Array.isArray(personas)) return personas;
    }
    localStorage.setItem(PERSONAS_CATALOGO_CLAVE, JSON.stringify(PERSONAS_CATALOGO_SEED));
  } catch (error) {
    return PERSONAS_CATALOGO_SEED.slice();
  }
  return PERSONAS_CATALOGO_SEED.slice();
}

/**
 * Escribe el catálogo en localStorage.
 * @param {Array<object>} personas
 * @returns {void}
 */
function guardarPersonasCatalogo(personas) {
  try {
    localStorage.setItem(PERSONAS_CATALOGO_CLAVE, JSON.stringify(personas));
  } catch (error) {
    /* localStorage no disponible: la demo sigue en memoria */
  }
}

/**
 * Busca personas por nombre o documento.
 * @param {string} texto
 * @returns {Array<object>}
 */
function buscarPersonasCatalogo(texto) {
  const filtro = String(texto || '').trim().toLowerCase();
  const personas = listarPersonasCatalogo();
  if (!filtro) return personas;
  return personas.filter((persona) => `${persona.nombre} ${persona.documento}`.toLowerCase().includes(filtro));
}

/**
 * Obtiene una persona por id.
 * @param {number|string} id
 * @returns {object|undefined}
 */
function obtenerPersonaCatalogo(id) {
  return listarPersonasCatalogo().find((persona) => persona.id === Number(id));
}

/**
 * Calcula el siguiente id disponible del catálogo.
 * @returns {number}
 */
function generarSiguienteIdPersonaCatalogo() {
  const personas = listarPersonasCatalogo();
  if (personas.length === 0) return 1;
  return Math.max(...personas.map((persona) => persona.id)) + 1;
}

/**
 * Crea una persona, la agrega al catálogo y persiste.
 * @param {{nombre: string, documento: string, afiliacion: string}} datos
 * @returns {object} La persona creada.
 */
function crearPersonaCatalogo(datos) {
  const personas = listarPersonasCatalogo();
  const nuevaPersona = {
    id: generarSiguienteIdPersonaCatalogo(),
    nombre: datos.nombre,
    documento: datos.documento,
    afiliacion: datos.afiliacion,
    estado: 'pendiente',
  };
  personas.push(nuevaPersona);
  guardarPersonasCatalogo(personas);
  return nuevaPersona;
}

/**
 * Elimina una persona del catálogo y persiste.
 * @param {number|string} id
 * @returns {void}
 */
function eliminarPersonaCatalogo(id) {
  const personas = listarPersonasCatalogo();
  const filtradas = personas.filter((persona) => persona.id !== Number(id));
  guardarPersonasCatalogo(filtradas);
}