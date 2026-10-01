/* ============================================================
   AVERYN DESIGN LAB — LÓGICA COMPARTIDA
   Mock data, state management, utilidades.
   ============================================================ */

// ---- Mock Data ----
const MOCK_PERSONAS = [
  { id: 1, nombre: "Ana Torres", documento: "CC 1.023.456.789", afiliacion: "Estudiante", estado: "verificado", avatar: "AT" },
  { id: 2, nombre: "Carlos Mendez", documento: "CC 1.098.765.432", afiliacion: "Docente", estado: "verificado", avatar: "CM" },
  { id: 3, nombre: "Lucia Rojas", documento: "CC 1.112.233.445", afiliacion: "Administrativo", estado: "verificado", avatar: "LR" },
  { id: 4, nombre: "Mateo Calderon", documento: "CC 1.223.344.556", afiliacion: "Estudiante", estado: "pendiente", avatar: "MC" },
  { id: 5, nombre: "Jorge Herrera", documento: "CC 1.334.455.667", afiliacion: "Docente", estado: "pendiente", avatar: "JH" },
  { id: 6, nombre: "Daniel Turizo", documento: "CC 1.445.566.778", afiliacion: "Administrativo", estado: "pendiente", avatar: "DT" },
  { id: 7, nombre: "Jose Chinchia", documento: "CC 1.556.677.889", afiliacion: "Estudiante", estado: "verificado", avatar: "JC" },
  { id: 8, nombre: "Sofia Vargas", documento: "CC 1.667.788.990", afiliacion: "Visitante", estado: "verificado", avatar: "SV" },
];

const MOCK_EVENTOS_BIOMETRICOS = [
  { id: 1, personaId: 1, tipoOperacion: "verificacion", metodo: "rostro", resultado: "exitoso", dispositivo: "FaceCam Pro", fecha: "2026-10-01T08:15:00Z" },
  { id: 2, personaId: 3, tipoOperacion: "enrolamiento", metodo: "huella", resultado: "exitoso", dispositivo: "DigitalPersona 4500", fecha: "2026-09-30T14:30:00Z" },
  { id: 3, personaId: 2, tipoOperacion: "verificacion", metodo: "rostro", resultado: "rechazado", dispositivo: "FaceCam Pro", fecha: "2026-09-30T10:45:00Z" },
  { id: 4, personaId: 7, tipoOperacion: "enrolamiento", metodo: "rostro", resultado: "exitoso", dispositivo: "FaceCam Pro", fecha: "2026-09-29T16:20:00Z" },
  { id: 5, personaId: 5, tipoOperacion: "verificacion", metodo: "huella", resultado: "exitoso", dispositivo: "DigitalPersona 4500", fecha: "2026-09-29T11:10:00Z" },
  { id: 6, personaId: 8, tipoOperacion: "verificacion", metodo: "rostro", resultado: "exitoso", dispositivo: "FaceCam Pro", fecha: "2026-09-28T09:30:00Z" },
];

const MOCK_DISPOSITIVOS = [
  { id: 1, nombre: "FaceCam Pro", tipo: "rostro", estado: "conectado", ubicacion: "Recepcion principal" },
  { id: 2, nombre: "DigitalPersona 4500", tipo: "huella", estado: "conectado", ubicacion: "Sala de enrolamiento" },
  { id: 3, nombre: "FaceCam Lite", tipo: "rostro", estado: "desconectado", ubicacion: "Sucursal norte" },
  { id: 4, nombre: "SecuGen Hamster", tipo: "huella", estado: "conectado", ubicacion: "Sala de verificacion" },
];

const MOCK_PROCESOS_ELECTORALES = [
  { id: 1, nombre: "Eleccion Rector 2026", institucion: "Universidad del Cesar", fechaInicio: "2026-11-15", fechaFin: "2026-11-17", estado: "OPEN" },
  { id: 2, nombre: "Consejo Estudiantil", institucion: "Facultad de Ingenieria", fechaInicio: "2026-10-20", fechaFin: "2026-10-22", estado: "DRAFT" },
];

// ---- API Compartida ----
window.AVERYN = {
  listarPersonas: () => MOCK_PERSONAS,
  obtenerPersona: (id) => MOCK_PERSONAS.find(p => p.id === id),
  crearPersona: (data) => {
    const nueva = { id: MOCK_PERSONAS.length + 1, ...data, estado: "pendiente", avatar: data.nombre.split(" ").map(n => n[0]).join("") };
    MOCK_PERSONAS.push(nueva);
    return nueva;
  },
  eliminarPersona: (id) => { const i = MOCK_PERSONAS.findIndex(p => p.id === id); if (i > -1) MOCK_PERSONAS.splice(i, 1); },
  
  listarEventos: () => MOCK_EVENTOS_BIOMETRICOS,
  listarDispositivos: () => MOCK_DISPOSITIVOS,
  resumenBiometria: () => ({
    verificaciones: MOCK_EVENTOS_BIOMETRICOS.filter(e => e.tipoOperacion === "verificacion").length,
    exitosas: MOCK_EVENTOS_BIOMETRICOS.filter(e => e.resultado === "exitoso").length,
    rechazadas: MOCK_EVENTOS_BIOMETRICOS.filter(e => e.resultado === "rechazado").length,
    dispositivosConectados: MOCK_DISPOSITIVOS.filter(d => d.estado === "conectado").length,
  }),
  
  listarProcesos: () => MOCK_PROCESOS_ELECTORALES,
  crearProceso: (data) => {
    const nuevo = { id: MOCK_PROCESOS_ELECTORALES.length + 1, ...data, estado: "DRAFT" };
    MOCK_PROCESOS_ELECTORALES.push(nuevo);
    return nuevo;
  },

  formatearFecha: (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
  },
  formatearFechaHora: (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  },
  tiempoRelativo: (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "hace un momento";
    if (mins < 60) return "hace " + mins + " min";
    if (hours < 24) return "hace " + hours + " h";
    if (days < 7) return "hace " + days + " d";
    return AVERYN.formatearFecha(iso);
  },
  textoOperacion: (tipo) => ({ verificacion: "Verificacion", enrolamiento: "Enrolamiento" }[tipo] || tipo),
  textoMetodo: (metodo) => ({ rostro: "Rostro", huella: "Huella" }[metodo] || metodo),
  textoResultado: (resultado) => ({ exitoso: "Exitoso", rechazado: "Rechazado" }[resultado] || resultado),
  claseResultado: (resultado) => ({ exitoso: "success", rechazado: "danger" }[resultado] || "neutral"),

  sessionKey: "averyn.session",
  tieneSesion: () => {
    try { const raw = localStorage.getItem(AVERYN.sessionKey); return Boolean(raw && JSON.parse(raw).email); } catch { return false; }
  },
  guardarSesion: (email, rol = "Administrador") => {
    try { localStorage.setItem(AVERYN.sessionKey, JSON.stringify({ email, rol, loggedAt: new Date().toISOString() })); } catch {}
  },
  obtenerSesion: () => {
    try { const raw = localStorage.getItem(AVERYN.sessionKey); return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  cerrarSesion: () => { try { localStorage.removeItem(AVERYN.sessionKey); } catch {} },
  navegar: (url) => { window.location.href = url; }
};

// ---- Helpers de renderizado ----
function crearElemento(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }

function renderKPIs(contenedor, kpis) {
  if (!contenedor) return;
  contenedor.innerHTML = kpis.map(k => (
    "<article class=\"kpi kpi--" + k.tono + "\">" +
    "  <span class=\"kpi__icon\" aria-hidden=\"true\"><i class=\"bi " + k.icono + "\"></i></span>" +
    "  <span class=\"kpi__label\">" + k.label + "</span>" +
    "  <span class=\"kpi__value\">" + k.valor + "</span>" +
    "  <span class=\"kpi__delta " + k.direccion + "\">" + k.delta + "</span>" +
    "  <span class=\"kpi__note\">" + k.nota + "</span>" +
    "</article>"
  )).join("");
}

function renderEmptyState(contenedor, opts) {
  if (!contenedor) return;
  let html = "<div class=\"empty-state\">" +
    "  <span class=\"empty-state__icon\" aria-hidden=\"true\"><i class=\"bi " + opts.icono + "\"></i></span>" +
    "  <h3 class=\"empty-state__title\">" + opts.titulo + "</h3>" +
    "  <p class=\"empty-state__desc\">" + opts.descripcion + "</p>";
  if (opts.accion) {
    html += "  <a href=\"" + opts.accion.href + "\" class=\"btn btn-primary\">" + opts.accion.texto + "</a>";
  }
  html += "</div>";
  contenedor.innerHTML = html;
}

window.AVERYN.render = { crearElemento, renderKPIs, renderEmptyState };
