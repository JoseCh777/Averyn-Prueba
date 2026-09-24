/**
 * Lista de personas registradas. La fuente de verdad es el catálogo único
 * compartido (common/personas-catalogo.js): Identidad NO guarda su propia
 * copia, sino que trabaja sobre la lista que devuelve el catálogo.
 */
let PERSONAS_MOCK = listarPersonasCatalogo();

/**
 * Persiste el estado actual en el catálogo compartido.
 */
function guardarPersonasEnStorage() {
  guardarPersonasCatalogo(PERSONAS_MOCK);
}

/**
 * Devuelve las iniciales de una persona a partir de su nombre completo.
 * @param {string} nombre
 * @returns {string} Iniciales en mayúscula (máx. 2 letras).
 */
function obtenerIniciales(nombre) {
  const partes = nombre.trim().split(/\s+/);
  const primera = partes[0] ? partes[0][0] : '';
  const segunda = partes[1] ? partes[1][0] : '';
  return (primera + segunda).toUpperCase();
}

/**
 * Asigna un color de avatar estable a partir del id de la persona.
 * @param {number} id
 * @returns {string} Clase de color del avatar (av-avatar--*).
 */
const COLORES_AVATAR = ['av-avatar--blue', 'av-avatar--violet', 'av-avatar--teal', 'av-avatar--amber', 'av-avatar--rose', 'av-avatar--slate'];
function obtenerColorAvatar(id) {
  return COLORES_AVATAR[(id - 1) % COLORES_AVATAR.length];
}

/**
 * Devuelve el icono para un tipo de afiliación.
 * @param {string} afiliacion
 * @returns {{icono: string}}
 */
function infoAfiliacion(afiliacion) {
  switch (afiliacion) {
    case 'Estudiante':     return { icono: 'bi-mortarboard' };
    case 'Docente':        return { icono: 'bi-person-badge' };
    case 'Administrativo': return { icono: 'bi-briefcase' };
    case 'Visitante':      return { icono: 'bi-person' };
    default:               return { icono: 'bi-person' };
  }
}

/**
 * Devuelve la clase de chip, texto e icono para el estado de verificación.
 * @param {'verificado'|'pendiente'} estado
 * @returns {{clase: string, texto: string, icono: string}}
 */
function infoEstadoPersona(estado) {
  if (estado === 'verificado') {
    return { clase: 'av-chip--success', texto: 'Verificado', icono: 'bi-check-circle' };
  }
  return { clase: 'av-chip--warning', texto: 'Pendiente', icono: 'bi-clock' };
}

/**
 * Genera el HTML de una fila de la tabla de personas.
 * @param {{id: number, nombre: string, documento: string, afiliacion: string, estado: string}} persona
 * @returns {string} Fragmento HTML de la fila <tr>.
 */
function renderizarFilaPersona(persona) {
  const iniciales = obtenerIniciales(persona.nombre);
  const colorAvatar = obtenerColorAvatar(persona.id);
  const afiliacion = infoAfiliacion(persona.afiliacion);
  const estado = infoEstadoPersona(persona.estado);

  return `
    <tr>
      <td>
        <div class="av-table__person">
          <span class="av-avatar av-avatar--md ${colorAvatar}" aria-hidden="true">${iniciales}</span>
          <div class="av-table__person-info">
            <a href="detalle.html?id=${persona.id}" class="av-table__name">${persona.nombre}</a>
            <span class="av-table__sub">Cédula ${persona.documento}</span>
          </div>
        </div>
      </td>
      <td><span class="av-tag"><i class="bi ${afiliacion.icono}" aria-hidden="true"></i>${persona.afiliacion}</span></td>
      <td><span class="av-chip ${estado.clase}"><i class="bi ${estado.icono}" aria-hidden="true"></i>${estado.texto}</span></td>
      <td class="av-table__actions">
        <a href="detalle.html?id=${persona.id}" class="av-icon-btn av-icon-btn--sm" aria-label="Ver detalle de ${persona.nombre}" title="Ver detalle"><i class="bi bi-eye" aria-hidden="true"></i></a>
        <button type="button" class="av-icon-btn av-icon-btn--sm" data-accion="eliminar" data-id="${persona.id}" aria-label="Eliminar a ${persona.nombre}" title="Eliminar"><i class="bi bi-trash" aria-hidden="true"></i></button>
      </td>
    </tr>
  `;
}

/**
 * Genera el HTML del estado vacio de la tabla.
 */
function renderizarEstadoVacio(hayFiltroActivo) {
  const mensaje = hayFiltroActivo
    ? 'No se encontraron personas con ese criterio de búsqueda.'
    : 'No hay personas registradas.';

  return `
    <tr>
      <td colspan="4">
        <div class="av-empty-state">
          <i class="bi bi-person-x" aria-hidden="true"></i>
          <p>${mensaje}</p>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Pinta el arreglo de personas dado en el tbody de la tabla.
 */
function renderizarTablaPersonas(personas) {
  const tbody = document.getElementById('tabla-personas-body');
  const info = document.getElementById('tabla-personas-info');
  if (!tbody || !info) return;

  if (personas.length === 0) {
    const inputBuscar = document.getElementById('input-buscar-persona');
    const selectEstado = document.getElementById('select-estado-persona');
    const hayFiltroActivo =
      inputBuscar.value.trim() !== '' || selectEstado.value !== 'todos';
    tbody.innerHTML = renderizarEstadoVacio(hayFiltroActivo);
  } else {
    tbody.innerHTML = personas.map(renderizarFilaPersona).join('');
  }

  info.textContent = `Mostrando ${personas.length} de ${PERSONAS_MOCK.length}`;
}

/**
 * Recalcula y repinta las 4 tarjetas KPI.
 */
function actualizarKpisPersonas() {
  const kpiTotal = document.getElementById('kpi-total');
  const kpiVerificadas = document.getElementById('kpi-verificadas');
  const kpiPendientes = document.getElementById('kpi-pendientes');
  const kpiTasa = document.getElementById('kpi-tasa');
  const kpiTasaNota = document.getElementById('kpi-tasa-nota');
  if (!kpiTotal || !kpiVerificadas || !kpiPendientes || !kpiTasa || !kpiTasaNota) return;

  const total = PERSONAS_MOCK.length;
  const verificadas = PERSONAS_MOCK.filter((p) => p.estado === 'verificado').length;
  const pendientes = total - verificadas;
  const tasa = total === 0 ? 0 : Math.round((verificadas / total) * 100);

  kpiTotal.textContent = String(total);
  kpiVerificadas.textContent = String(verificadas);
  kpiPendientes.textContent = String(pendientes);
  kpiTasa.textContent = `${tasa}%`;
  kpiTasaNota.textContent = `${verificadas} de ${total} personas`;
}

/**
 * Filtra el arreglo de personas.
 */
function filtrarPersonas() {
  const textoBusqueda = document.getElementById('input-buscar-persona').value.trim().toLowerCase();
  const estadoSeleccionado = document.getElementById('select-estado-persona').value;

  const personasFiltradas = PERSONAS_MOCK.filter((persona) => {
    const coincideTexto =
      persona.nombre.toLowerCase().includes(textoBusqueda) ||
      persona.documento.includes(textoBusqueda);
    const coincideEstado = estadoSeleccionado === 'todos' || persona.estado === estadoSeleccionado;

    return coincideTexto && coincideEstado;
  });

  renderizarTablaPersonas(personasFiltradas);
  actualizarKpisPersonas();
}

/**
 * Crea una nueva persona en el catálogo compartido y actualiza la lista local.
 */
function crearPersona(datos) {
  const nuevaPersona = crearPersonaCatalogo({
    nombre: datos.nombre,
    documento: datos.documento,
    afiliacion: datos.afiliacion,
  });
  PERSONAS_MOCK.push(nuevaPersona);
  return nuevaPersona;
}

/**
 * Elimina del catálogo la persona y actualiza la lista local.
 */
function eliminarPersona(id) {
  const indice = PERSONAS_MOCK.findIndex((p) => p.id === id);
  if (indice !== -1) {
    PERSONAS_MOCK.splice(indice, 1);
    eliminarPersonaCatalogo(id);
  }
}

/**
 * Abre el modal de "Nueva persona".
 */
function abrirModalNuevaPersona() {
  const modal = document.getElementById('modal-nueva-persona');
  if (modal) modal.hidden = false;
}

/**
 * Cierra el modal de "Nueva persona".
 */
function cerrarModalNuevaPersona() {
  const modal = document.getElementById('modal-nueva-persona');
  const form = document.getElementById('form-nueva-persona');
  if (modal) modal.hidden = true;
  if (form) form.reset();
}

/**
 * Renderiza los datos en la vista de detalle.
 */
function renderizarDetallePersona() {
  const card = document.getElementById('card-detalle-persona');
  if (!card) return;

  const idPersona = Number(new URLSearchParams(window.location.search).get('id'));
  const persona = PERSONAS_MOCK.find((p) => p.id === idPersona);

  if (!persona) {
    card.innerHTML = `
      <div class="av-empty-state">
        <i class="bi bi-person-x" aria-hidden="true"></i>
        <p>No se encontró la persona solicitada.</p>
      </div>
    `;
    return;
  }

  const iniciales = obtenerIniciales(persona.nombre);
  const colorAvatar = obtenerColorAvatar(persona.id);
  const afiliacion = infoAfiliacion(persona.afiliacion);
  const estado = infoEstadoPersona(persona.estado);

  card.innerHTML = `
    <div class="av-table__person" style="margin-bottom: 16px">
      <span class="av-avatar av-avatar--md ${colorAvatar}" aria-hidden="true">${iniciales}</span>
      <div class="av-table__person-info">
        <h2 class="av-page-header__title" style="font-size: 1.4rem">${persona.nombre}</h2>
        <span class="av-table__sub">Cédula ${persona.documento}</span>
      </div>
    </div>
    <dl class="av-detail">
      <div class="av-detail__row"><dt>Afiliación</dt><dd><span class="av-tag"><i class="bi ${afiliacion.icono}" aria-hidden="true"></i>${persona.afiliacion}</span></dd></div>
      <div class="av-detail__row"><dt>Estado</dt><dd><span class="av-chip ${estado.clase}"><i class="bi ${estado.icono}" aria-hidden="true"></i>${estado.texto}</span></dd></div>
    </dl>
    <a href="index.html" class="av-btn av-btn-ghost" style="margin-top: 20px; display: inline-flex"><i class="bi bi-arrow-left" aria-hidden="true"></i> Volver al listado</a>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarTablaPersonas(PERSONAS_MOCK);
  actualizarKpisPersonas();
  renderizarDetallePersona();

  const inputBuscar = document.getElementById('input-buscar-persona');
  const selectEstado = document.getElementById('select-estado-persona');
  if (inputBuscar) inputBuscar.addEventListener('input', filtrarPersonas);
  if (selectEstado) selectEstado.addEventListener('change', filtrarPersonas);

  const btnNuevaPersona = document.getElementById('btn-nueva-persona');
  const btnCerrarModalPersona = document.getElementById('btn-cerrar-modal-persona');
  const btnCancelarNuevaPersona = document.getElementById('btn-cancelar-nueva-persona');
  const modalNuevaPersona = document.getElementById('modal-nueva-persona');

  if (btnNuevaPersona) btnNuevaPersona.addEventListener('click', abrirModalNuevaPersona);
  if (btnCerrarModalPersona) btnCerrarModalPersona.addEventListener('click', cerrarModalNuevaPersona);
  if (btnCancelarNuevaPersona) btnCancelarNuevaPersona.addEventListener('click', cerrarModalNuevaPersona);

  if (modalNuevaPersona) {
    modalNuevaPersona.addEventListener('click', (evento) => {
      if (evento.target === modalNuevaPersona) cerrarModalNuevaPersona();
    });
  }

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && modalNuevaPersona && !modalNuevaPersona.hidden) {
      cerrarModalNuevaPersona();
    }
  });

  const formNuevaPersona = document.getElementById('form-nueva-persona');
  if (formNuevaPersona) {
    formNuevaPersona.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const nombre = document.getElementById('input-nombre-persona').value.trim();
      const documento = document.getElementById('input-documento-persona').value.trim();
      const afiliacion = document.getElementById('select-afiliacion-crear').value;

      if (!nombre || !documento) return;

      crearPersona({ nombre, documento, afiliacion });
      filtrarPersonas();
      cerrarModalNuevaPersona();
    });
  }

  const tbodyPersonas = document.getElementById('tabla-personas-body');
  if (tbodyPersonas) {
    tbodyPersonas.addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-accion="eliminar"]');
      if (!boton) return;

      const id = Number(boton.dataset.id);
      const persona = PERSONAS_MOCK.find((p) => p.id === id);
      if (!persona) return;

      const confirmado = confirm(`¿Eliminar a ${persona.nombre}? Esta acción no se puede deshacer.`);
      if (confirmado) {
        eliminarPersona(id);
        filtrarPersonas();
      }
    });
  }

  document.addEventListener('keydown', (evento) => {
    if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === 'k') {
      if (inputBuscar) {
        evento.preventDefault();
        inputBuscar.focus();
      }
    }
  });
});