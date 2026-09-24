/**
 * Selector de persona reutilizable para el módulo de Biometría.
 *
 * Se usa tanto en el registro (seleccionar a quién se le asocia un perfil
 * biométrico) como en la verificación (identificar a quién se verifica).
 * Renderiza el resultado de búsqueda en una tabla y notifica la selección.
 */

/** Colores de avatar disponibles en el Design System. */
const BIOMETRIA_COLORES_AVATAR = ['av-avatar--blue', 'av-avatar--violet', 'av-avatar--teal', 'av-avatar--amber', 'av-avatar--rose', 'av-avatar--slate'];

/**
 * Devuelve las iniciales de un nombre completo.
 * @param {string} nombre
 * @returns {string}
 */
function biometriaIniciales(nombre) {
  const partes = String(nombre || '').trim().split(/\s+/);
  return `${(partes[0] || '')[0] || ''}${(partes[1] || '')[0] || ''}`.toUpperCase();
}

/**
 * Color de avatar estable a partir del id de la persona.
 * @param {number} id
 * @returns {string}
 */
function biometriaColorAvatar(id) {
  return BIOMETRIA_COLORES_AVATAR[(Number(id) - 1 + BIOMETRIA_COLORES_AVATAR.length) % BIOMETRIA_COLORES_AVATAR.length];
}

/**
 * Icono del tipo de afiliación.
 * @param {string} afiliacion
 * @returns {string}
 */
function biometriaIconoAfiliacion(afiliacion) {
  switch (afiliacion) {
    case 'Estudiante': return 'bi-mortarboard';
    case 'Docente': return 'bi-person-badge';
    case 'Administrativo': return 'bi-briefcase';
    case 'Visitante': return 'bi-person';
    default: return 'bi-person';
  }
}

/**
 * Chips que describen el perfil biométrico de una persona.
 * @param {number} personaId
 * @returns {string} HTML de los chips.
 */
function biometriaChipsPerfil(personaId) {
  const perfil = obtenerPerfilBiometrico(personaId);
  const chips = [];
  if (perfil.rostro) chips.push('<span class="av-chip av-chip--info"><i class="bi bi-person-bounding-box" aria-hidden="true"></i>Rostro</span>');
  if (perfil.huella) chips.push('<span class="av-chip av-chip--info"><i class="bi bi-fingerprint" aria-hidden="true"></i>Huella</span>');
  if (chips.length === 0) return '<span class="av-table__sub">Sin registro</span>';
  return chips.join(' ');
}

/**
 * Crea un selector de personas conectado a un input de búsqueda y una tabla.
 * @param {{inputId: string, tbodyId: string, contadorId?: string, alSeleccionar?: (persona: object) => void}} opciones
 * @returns {{obtenerSeleccionada: () => object|null, limpiar: () => void}}
 */
function crearSelectorPersonas(opciones) {
  const input = document.getElementById(opciones.inputId);
  const tbody = document.getElementById(opciones.tbodyId);
  const contador = opciones.contadorId ? document.getElementById(opciones.contadorId) : null;
  let seleccionadaId = null;

  /**
   * Pinta las filas de personas según el texto de búsqueda.
   * @param {string} texto
   * @returns {void}
   */
  function renderizar(texto) {
    if (!tbody) return;
    const personas = buscarPersonasBiometria(texto);

    if (contador) contador.textContent = `${personas.length} ${personas.length === 1 ? 'persona' : 'personas'}`;

    if (personas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4">
            <div class="av-empty-state">
              <i class="bi bi-person-x av-empty-state__icon" aria-hidden="true"></i>
              <span class="av-empty-state__title">No se encontraron personas</span>
              <p class="av-text-sm av-text-muted" style="margin: 0">Prueba con otro nombre o documento.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = personas.map((persona) => {
      const seleccionada = persona.id === seleccionadaId;
      return `
        <tr class="av-table__row-clicable ${seleccionada ? 'is-active' : ''}" data-persona-id="${persona.id}" tabindex="0">
          <td>
            <div class="av-table__person">
              <span class="av-avatar av-avatar--md ${biometriaColorAvatar(persona.id)}" aria-hidden="true">${biometriaIniciales(persona.nombre)}</span>
              <div class="av-table__person-info">
                <span class="av-table__name">${persona.nombre}</span>
                <span class="av-table__sub">Cédula ${persona.documento}</span>
              </div>
            </div>
          </td>
          <td><span class="av-tag"><i class="bi ${biometriaIconoAfiliacion(persona.afiliacion)}" aria-hidden="true"></i>${persona.afiliacion}</span></td>
          <td>${biometriaChipsPerfil(persona.id)}</td>
          <td class="av-table__actions">
            <span class="av-icon-btn av-icon-btn--sm" aria-hidden="true"><i class="bi ${seleccionada ? 'bi-check-circle-fill' : 'bi-circle'}"></i></span>
          </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('tr[data-persona-id]').forEach((fila) => {
      const id = Number(fila.getAttribute('data-persona-id'));
      const elegir = () => seleccionar(id);
      fila.addEventListener('click', elegir);
      fila.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          elegir();
        }
      });
    });
  }

  /**
   * Marca una persona como seleccionada y notifica al controlador.
   * @param {number} id
   * @returns {void}
   */
  function seleccionar(id) {
    seleccionadaId = id;
    renderizar(input ? input.value : '');
    const persona = obtenerPersonaBiometria(id);
    if (persona && typeof opciones.alSeleccionar === 'function') opciones.alSeleccionar(persona);
  }

  if (input) input.addEventListener('input', () => renderizar(input.value));
  renderizar('');

  return {
    /** @returns {object|null} La persona seleccionada actualmente. */
    obtenerSeleccionada: () => (seleccionadaId ? obtenerPersonaBiometria(seleccionadaId) : null),
    /** Limpia la selección y el buscador. @returns {void} */
    limpiar: () => {
      seleccionadaId = null;
      if (input) input.value = '';
      renderizar('');
    },
  };
}
