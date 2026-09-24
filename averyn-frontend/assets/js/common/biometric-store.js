/**
 * Datos y persistencia simulada del módulo de Biometría (capa compartida).
 *
 * Centraliza tres cosas que usan todas las vistas del módulo:
 *   1. El catálogo de PERSONAS (mock de Identity, bloque B, sección 5.2).
 *   2. Los PERFILES biométricos (qué modalidad tiene registrada cada persona).
 *   3. Los EVENTOS biométricos (historial / auditoría de cada operación).
 *
 * La persistencia de la demostración usa sessionStorage, de modo que las
 * operaciones hechas durante la presentación (registrar, verificar) se vean
 * reflejadas en el historial y en el dashboard sin recargar datos falsos.
 *
 * Arquitectura del dominio (no mezclar): el registro crea/asocia un perfil
 * biométrico a una persona ya existente; la verificación comprueba una
 * identidad; el dispositivo es el hardware; el evento es la auditoría.
 */

/* Claves de almacenamiento */

const BIOMETRIA_PREFIJO = 'averyn.biometria.';
const BIOMETRIA_CLAVE_PERFILES = `${BIOMETRIA_PREFIJO}perfiles`;
const BIOMETRIA_CLAVE_EVENTOS = `${BIOMETRIA_PREFIJO}eventos`;

/* Catálogo de personas (mock de Identity) */

/**
 * Personas disponibles para operar biometría. Mismos nombres de campo que
 * Identity (id, nombre, documento, afiliacion, estado).
 * @type {Array<{id: number, nombre: string, documento: string, afiliacion: string, estado: 'verificado'|'pendiente'}>}
 */
const BIOMETRIA_PERSONAS = [
  { id: 1, nombre: 'Ana Torres', documento: '10234567', afiliacion: 'Estudiante', estado: 'verificado' },
  { id: 2, nombre: 'Luis Pérez', documento: '10345678', afiliacion: 'Docente', estado: 'pendiente' },
  { id: 3, nombre: 'María Gómez', documento: '10456789', afiliacion: 'Administrativo', estado: 'verificado' },
  { id: 4, nombre: 'Carlos Ruiz', documento: '10567890', afiliacion: 'Estudiante', estado: 'pendiente' },
  { id: 5, nombre: 'Laura Díaz', documento: '10678901', afiliacion: 'Visitante', estado: 'verificado' },
  { id: 6, nombre: 'Jorge Ramírez', documento: '10789012', afiliacion: 'Docente', estado: 'verificado' },
  { id: 7, nombre: 'Paula Herrera', documento: '10890123', afiliacion: 'Estudiante', estado: 'pendiente' },
  { id: 8, nombre: 'Andrés Molina', documento: '10901234', afiliacion: 'Administrativo', estado: 'verificado' },
];

/* Perfiles biométricos (semilla) */

/**
 * Perfil biométrico de una persona: qué modalidades tiene registradas.
 * @typedef {{personaId: number, rostro: boolean, huella: boolean, estado: 'activa'|'inactiva', fechaRegistro: string}} PerfilBiometrico
 */

/** @type {Array<PerfilBiometrico>} */
const BIOMETRIA_PERFILES_SEED = [
  { personaId: 1, rostro: true, huella: false, estado: 'activa', fechaRegistro: '2026-09-08T09:15:00' },
  { personaId: 2, rostro: false, huella: true, estado: 'activa', fechaRegistro: '2026-09-08T10:40:00' },
  { personaId: 3, rostro: false, huella: false, estado: 'inactiva', fechaRegistro: null },
  { personaId: 4, rostro: true, huella: true, estado: 'activa', fechaRegistro: '2026-09-09T11:05:00' },
  { personaId: 5, rostro: true, huella: false, estado: 'activa', fechaRegistro: '2026-09-10T14:20:00' },
  { personaId: 6, rostro: false, huella: false, estado: 'inactiva', fechaRegistro: null },
  { personaId: 7, rostro: false, huella: false, estado: 'inactiva', fechaRegistro: null },
  { personaId: 8, rostro: true, huella: false, estado: 'activa', fechaRegistro: '2026-09-11T16:45:00' },
];

/* Eventos biométricos (semilla de historial / auditoría) */

/**
 * Evento biométrico registrado (historial).
 * @typedef {{id: string, personaId: number, tipoOperacion: 'registro'|'verificacion', metodo: 'rostro'|'huella', resultado: 'exito'|'rechazo'|'reintento'|'dispositivo', dispositivo: string, operador: string, institucion: string, fecha: string}} EventoBiometrico
 */

/** @type {Array<EventoBiometrico>} */
const BIOMETRIA_EVENTOS_SEED = [
  { id: 'ev-1', personaId: 1, tipoOperacion: 'verificacion', metodo: 'rostro', resultado: 'exito', dispositivo: 'CAM-001', operador: 'Admin', institucion: 'Sede Central', fecha: '2026-09-13T20:42:00' },
  { id: 'ev-2', personaId: 5, tipoOperacion: 'verificacion', metodo: 'huella', resultado: 'rechazo', dispositivo: 'BIO-003', operador: 'Operador', institucion: 'Campus Norte', fecha: '2026-09-13T20:31:00' },
  { id: 'ev-3', personaId: 4, tipoOperacion: 'registro', metodo: 'rostro', resultado: 'exito', dispositivo: 'CAM-001', operador: 'Admin', institucion: 'Sede Central', fecha: '2026-09-13T18:12:00' },
  { id: 'ev-4', personaId: 8, tipoOperacion: 'verificacion', metodo: 'rostro', resultado: 'reintento', dispositivo: 'CAM-002', operador: 'Operador', institucion: 'Sede Central', fecha: '2026-09-13T17:55:00' },
  { id: 'ev-5', personaId: 2, tipoOperacion: 'verificacion', metodo: 'huella', resultado: 'exito', dispositivo: 'BIO-001', operador: 'Operador', institucion: 'Campus Norte', fecha: '2026-09-13T16:20:00' },
  { id: 'ev-6', personaId: 3, tipoOperacion: 'registro', metodo: 'rostro', resultado: 'dispositivo', dispositivo: 'CAM-003', operador: 'Admin', institucion: 'Sede Central', fecha: '2026-09-12T15:03:00' },
];

/* Persistencia */

/**
 * Lee una colección desde sessionStorage; si no existe, la siembra.
 * @param {string} clave
 * @param {Array<object>} semilla
 * @returns {Array<object>}
 */
function biometriaLeer(clave, semilla) {
  try {
    const crudo = sessionStorage.getItem(clave);
    if (crudo) return JSON.parse(crudo);
    sessionStorage.setItem(clave, JSON.stringify(semilla));
  } catch (error) {
    return semilla;
  }
  return semilla.slice();
}

/**
 * Escribe una colección en sessionStorage.
 * @param {string} clave
 * @param {Array<object>} valor
 * @returns {void}
 */
function biometriaEscribir(clave, valor) {
  try {
    sessionStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    /* sessionStorage no disponible: la demo sigue en memoria */
  }
}

/* API de personas */

/** @returns {Array<object>} Todas las personas del catálogo. */
function listarPersonasBiometria() {
  return BIOMETRIA_PERSONAS.slice();
}

/**
 * Busca personas por nombre o documento.
 * @param {string} texto
 * @returns {Array<object>}
 */
function buscarPersonasBiometria(texto) {
  const filtro = String(texto || '').trim().toLowerCase();
  if (!filtro) return listarPersonasBiometria();
  return BIOMETRIA_PERSONAS.filter((persona) => `${persona.nombre} ${persona.documento}`.toLowerCase().includes(filtro));
}

/**
 * Obtiene una persona por id.
 * @param {number|string} id
 * @returns {object|undefined}
 */
function obtenerPersonaBiometria(id) {
  return BIOMETRIA_PERSONAS.find((persona) => persona.id === Number(id));
}

/* API de perfiles biométricos */

/** @returns {Array<PerfilBiometrico>} */
function listarPerfilesBiometricos() {
  return biometriaLeer(BIOMETRIA_CLAVE_PERFILES, BIOMETRIA_PERFILES_SEED);
}

/**
 * Perfil biométrico de una persona (crea uno vacío si no existe).
 * @param {number|string} personaId
 * @returns {PerfilBiometrico}
 */
function obtenerPerfilBiometrico(personaId) {
  const id = Number(personaId);
  const perfiles = listarPerfilesBiometricos();
  return perfiles.find((perfil) => perfil.personaId === id)
    || { personaId: id, rostro: false, huella: false, estado: 'inactiva', fechaRegistro: null };
}

/**
 * Indica si una persona ya tiene registrada una modalidad.
 * @param {number|string} personaId
 * @param {'rostro'|'huella'} modalidad
 * @returns {boolean}
 */
function tieneModalidadBiometrica(personaId, modalidad) {
  return Boolean(obtenerPerfilBiometrico(personaId)[modalidad]);
}

/**
 * Registra/actualiza una modalidad biométrica para una persona.
 * @param {number|string} personaId
 * @param {'rostro'|'huella'} modalidad
 * @returns {PerfilBiometrico}
 */
function registrarModalidadBiometrica(personaId, modalidad) {
  const id = Number(personaId);
  const perfiles = listarPerfilesBiometricos();
  const indice = perfiles.findIndex((perfil) => perfil.personaId === id);
  const base = indice >= 0 ? perfiles[indice] : { personaId: id, rostro: false, huella: false, estado: 'inactiva', fechaRegistro: null };
  const actualizado = { ...base, [modalidad]: true, estado: 'activa', fechaRegistro: new Date().toISOString() };

  if (indice >= 0) perfiles[indice] = actualizado;
  else perfiles.push(actualizado);

  biometriaEscribir(BIOMETRIA_CLAVE_PERFILES, perfiles);
  return actualizado;
}

/**
 * Cuenta cuántas personas tienen al menos una modalidad registrada.
 * @returns {number}
 */
function contarPersonasConBiometria() {
  return listarPerfilesBiometricos().filter((perfil) => perfil.rostro || perfil.huella).length;
}

/* API de eventos biométricos (historial / auditoría) */

/** @returns {Array<EventoBiometrico>} Eventos ordenados del más reciente al más antiguo. */
function listarEventosBiometricos() {
  return biometriaLeer(BIOMETRIA_CLAVE_EVENTOS, BIOMETRIA_EVENTOS_SEED)
    .slice()
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

/**
 * Registra un evento biométrico en el historial.
 * @param {{personaId: number|string, tipoOperacion: 'registro'|'verificacion', metodo: 'rostro'|'huella', resultado: 'exito'|'rechazo'|'reintento'|'dispositivo', dispositivo?: string, operador?: string, institucion?: string}} evento
 * @returns {EventoBiometrico} El evento registrado.
 */
function registrarEventoBiometrico(evento) {
  const eventos = listarEventosBiometricos();
  const nuevo = {
    id: `ev-${Date.now()}`,
    personaId: Number(evento.personaId),
    tipoOperacion: evento.tipoOperacion,
    metodo: evento.metodo,
    resultado: evento.resultado,
    dispositivo: evento.dispositivo || 'CAM-001',
    operador: evento.operador || 'Admin',
    institucion: evento.institucion || 'Sede Central',
    fecha: new Date().toISOString(),
  };
  eventos.push(nuevo);
  biometriaEscribir(BIOMETRIA_CLAVE_EVENTOS, eventos);
  return nuevo;
}

/**
 * Resumen agregado para el dashboard.
 * @returns {{personasConBiometria: number, verificaciones: number, exitosas: number, rechazadas: number, dispositivosConectados: number}}
 */
function resumenBiometria() {
  const eventos = listarEventosBiometricos();
  const verificaciones = eventos.filter((evento) => evento.tipoOperacion === 'verificacion');
  return {
    personasConBiometria: contarPersonasConBiometria(),
    verificaciones: verificaciones.length,
    exitosas: verificaciones.filter((evento) => evento.resultado === 'exito').length,
    rechazadas: verificaciones.filter((evento) => evento.resultado === 'rechazo').length,
    dispositivosConectados: listarDispositivosBiometricos().filter((dispositivo) => dispositivo.estado === 'conectado').length,
  };
}

/* Dispositivos biométricos (mock) */

/**
 * Dispositivos biométricos conocidos por el sistema.
 * @returns {Array<{id: string, nombre: string, tipo: 'Facial'|'Huella', estado: 'conectado'|'desconectado', modelo: string, ubicacion: string, serial: string}>}
 */
function listarDispositivosBiometricos() {
  return [
    { id: 'CAM-001', nombre: 'Cámara principal', tipo: 'Facial', estado: 'conectado', modelo: 'Logitech Brio 4K', ubicacion: 'Sede Central · Recepción', serial: 'BR-4419-A' },
    { id: 'CAM-002', nombre: 'Cámara secundaria', tipo: 'Facial', estado: 'conectado', modelo: 'Logitech C920', ubicacion: 'Campus Norte · Acceso', serial: 'C9-2207-B' },
    { id: 'BIO-001', nombre: 'Lector de huella', tipo: 'Huella', estado: 'desconectado', modelo: 'DigitalPersona 4500', ubicacion: 'Sede Central · Registro', serial: 'DP-4500-01' },
  ];
}

/* Simulación de dominio */

/**
 * Determina el desenlace simulado de una verificacion biometrica
 * (exito, fallo o reintento) para efectos de demostracion.
 * @returns {'exito'|'fallo'|'reintento'}
 */
function simularResultadoVerificacion() {
  const azar = Math.random();
  if (azar < 0.6) return 'exito';
  if (azar < 0.85) return 'fallo';
  return 'reintento';
}

/* Vocabulario de dominio (traducción a lenguaje institucional) */

/**
 * Texto legible de la operación biométrica.
 * @param {'registro'|'verificacion'} tipoOperacion
 * @returns {string}
 */
function textoOperacionBiometrica(tipoOperacion) {
  return tipoOperacion === 'registro' ? 'Registro' : 'Verificación';
}

/**
 * Texto legible del método biométrico.
 * @param {'rostro'|'huella'} metodo
 * @returns {string}
 */
function textoMetodoBiometrico(metodo) {
  return metodo === 'huella' ? 'Huella' : 'Rostro';
}

/**
 * Chip (clase, texto, icono) para el resultado de un evento biométrico.
 * @param {'exito'|'rechazo'|'reintento'|'dispositivo'} resultado
 * @param {'registro'|'verificacion'} tipoOperacion
 * @returns {{clase: string, texto: string, icono: string}}
 */
function infoResultadoBiometrico(resultado, tipoOperacion) {
  const esRegistro = tipoOperacion === 'registro';
  switch (resultado) {
    case 'exito':
      return { clase: 'av-chip--success', texto: esRegistro ? 'Registrado' : 'Verificado', icono: 'bi-check-circle' };
    case 'rechazo':
      return { clase: 'av-chip--error', texto: 'Rechazado', icono: 'bi-x-circle' };
    case 'reintento':
      return { clase: 'av-chip--warning', texto: 'Reintento', icono: 'bi-arrow-repeat' };
    case 'dispositivo':
      return { clase: 'av-chip--neutral', texto: 'Sin dispositivo', icono: 'bi-plug' };
    default:
      return { clase: 'av-chip--neutral', texto: resultado, icono: 'bi-circle' };
  }
}

/**
 * Formatea una fecha ISO a texto legible "dd/mm/aaaa hh:mm".
 * @param {string} iso
 * @returns {string}
 */
function formatearFechaBiometria(iso) {
  if (!iso) return '—';
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '—';
  return fecha.toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}
