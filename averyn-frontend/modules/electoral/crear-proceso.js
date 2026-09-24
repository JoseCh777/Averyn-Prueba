/**
 * Interacciones del flujo "Nuevo proceso electoral" (crear-proceso.html):
 * captura de la información general, de la configuración y del universo de
 * participantes (vista informativa), resumen de revisión, creación del
 * proceso electoral y navegación entre pasos del wizard.
 * Sprint 1: el proceso vive únicamente en memoria mientras se configura;
 * solo se persiste (guardarProceso) en el paso final de revisión.
 */

/** Proceso electoral que se está configurando en la sesión. */
const procesoEnCreacion = {
  nombre: '',
  descripcion: '',
  institucion: '',
  tipoProceso: '',
  fechaInicio: '',
  fechaFin: '',
  estado: 'DRAFT',
  configuracion: {},
  participantes: {}
};

/** Número del paso actual del wizard (1 = Información general). */
let pasoActual = 1;

/** Campos obligatorios del paso "Información general". */
const CAMPOS_OBLIGATORIOS_INFORMACION = [
  'campo-nombre',
  'campo-descripcion',
  'campo-institucion',
  'campo-tipo-proceso',
  'campo-fecha-inicio',
  'campo-fecha-fin'
];

/** Campos obligatorios del paso "Configuración". */
const CAMPOS_OBLIGATORIOS_CONFIGURACION = [
  'campo-tipo-votacion',
  'campo-opciones-voto'
];

/** Etiquetas legibles para mostrar los valores capturados en la revisión. */
const ETIQUETAS_INSTITUCION = {
  universidad: 'Universidad',
  colegio: 'Colegio',
  fundacion: 'Fundación',
  empresa: 'Empresa'
};

const ETIQUETAS_TIPO_PROCESO = {
  consejo: 'Elección de consejo',
  representantes: 'Elección de representantes',
  consulta: 'Consulta institucional',
  votacion: 'Votación general'
};

const ETIQUETAS_TIPO_VOTACION = {
  unico: 'Voto único',
  acumulativo: 'Voto acumulativo',
  ponderado: 'Voto ponderado'
};

const ETIQUETAS_MODALIDAD = {
  'en-linea': 'En línea',
  presencial: 'Presencial'
};

const ETIQUETAS_SWITCHES = [
  { campo: 'votacionAnonima', etiqueta: 'Votación anónima' },
  { campo: 'votoEnBlanco', etiqueta: 'Permitir voto en blanco' },
  { campo: 'mostrarResultados', etiqueta: 'Mostrar resultados' },
  { campo: 'permitirModificacionVoto', etiqueta: 'Permitir modificación del voto' }
];

/**
 * Muestra el mensaje de error de un campo del formulario.
 * @param {string} idCampo - Id del input o select del campo.
 * @param {string} mensaje - Texto del error a mostrar.
 * @returns {void}
 */
function marcarErrorCampo(idCampo, mensaje) {
  const elemento = document.getElementById(idCampo);
  if (!elemento) return;

  const contenedor = elemento.closest('.av-field');
  const ayuda = document.getElementById(`error-${idCampo.replace('campo-', '')}`);

  if (contenedor) contenedor.classList.add('has-error');
  if (ayuda) {
    ayuda.textContent = mensaje;
    ayuda.hidden = false;
  }
}

/**
 * Limpia el estado de error de un campo del formulario.
 * @param {string} idCampo - Id del input o select del campo.
 * @returns {void}
 */
function limpiarErrorCampo(idCampo) {
  const elemento = document.getElementById(idCampo);
  if (!elemento) return;

  const contenedor = elemento.closest('.av-field');
  const ayuda = document.getElementById(`error-${idCampo.replace('campo-', '')}`);

  if (contenedor) contenedor.classList.remove('has-error');
  if (ayuda) {
    ayuda.textContent = 'Completa este campo para continuar.';
    ayuda.hidden = true;
  }
}

/**
 * Lee el valor de un campo de fecha como objeto Date del día local.
 * @param {string} idCampo - Id del input de tipo date.
 * @returns {Date|null} Fecha del campo, o null si está vacío.
 */
function leerFecha(idCampo) {
  const valor = document.getElementById(idCampo).value;
  if (!valor) return null;
  return new Date(`${valor}T00:00:00`);
}

/**
 * Valida la información general del proceso antes de avanzar al siguiente paso.
 * Verifica campos obligatorios, validez de fechas y nombre duplicado.
 * @returns {boolean} true si toda la información es válida.
 */
function validarInformacionGeneral() {
  let esValido = true;

  CAMPOS_OBLIGATORIOS_INFORMACION.forEach((idCampo) => {
    const elemento = document.getElementById(idCampo);
    if (!elemento) return;

    if (elemento.value.trim() === '') {
      marcarErrorCampo(idCampo, 'Completa este campo para continuar.');
      esValido = false;
    }
  });

  const nombre = document.getElementById('campo-nombre');
  if (nombre && nombre.value.trim() !== '' && existeProcesoConNombre(nombre.value.trim())) {
    marcarErrorCampo('campo-nombre', 'Ya existe un proceso electoral con este nombre.');
    esValido = false;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaInicio = leerFecha('campo-fecha-inicio');
  const fechaFin = leerFecha('campo-fecha-fin');

  if (fechaInicio && fechaInicio < hoy) {
    marcarErrorCampo('campo-fecha-inicio', 'La fecha de inicio no puede ser anterior a hoy.');
    esValido = false;
  }

  if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
    marcarErrorCampo('campo-fecha-fin', 'La fecha de finalización debe ser posterior a la fecha de inicio.');
    esValido = false;
  }

  return esValido;
}

/**
 * Lee los campos del paso "Información general" y los guarda en el
 * objeto del proceso en memoria.
 * @returns {void}
 */
function capturarInformacionGeneral() {
  procesoEnCreacion.nombre = document.getElementById('campo-nombre').value.trim();
  procesoEnCreacion.descripcion = document.getElementById('campo-descripcion').value.trim();
  procesoEnCreacion.institucion = document.getElementById('campo-institucion').value;
  procesoEnCreacion.tipoProceso = document.getElementById('campo-tipo-proceso').value;
  procesoEnCreacion.fechaInicio = document.getElementById('campo-fecha-inicio').value;
  procesoEnCreacion.fechaFin = document.getElementById('campo-fecha-fin').value;
}

/**
 * Valida la configuración del proceso antes de avanzar al siguiente paso.
 * @returns {boolean} true si la configuración es válida.
 */
function validarConfiguracion() {
  let esValido = true;

  CAMPOS_OBLIGATORIOS_CONFIGURACION.forEach((idCampo) => {
    const elemento = document.getElementById(idCampo);
    if (!elemento) return;

    if (elemento.value.trim() === '') {
      marcarErrorCampo(idCampo, 'Completa este campo para continuar.');
      esValido = false;
    }
  });

  return esValido;
}

/**
 * Lee los campos del paso "Configuración" y los guarda en la configuración
 * del proceso en memoria.
 * @returns {void}
 */
function capturarConfiguracion() {
  const botonModalidad = document.querySelector('#grupo-modalidad .av-seg__btn.is-active');

  procesoEnCreacion.configuracion = {
    tipoVotacion: document.getElementById('campo-tipo-votacion').value,
    opcionesPorVoto: Number(document.getElementById('campo-opciones-voto').value),
    modalidad: botonModalidad ? botonModalidad.id.replace('btn-modalidad-', '') : '',
    votacionAnonima: document.getElementById('campo-votacion-anonima').checked,
    votoEnBlanco: document.getElementById('campo-voto-en-blanco').checked,
    mostrarResultados: document.getElementById('campo-mostrar-resultados').checked,
    permitirModificacionVoto: document.getElementById('campo-permitir-modificacion').checked
  };
}

/**
 * Conecta el selector de modalidad (En línea / Presencial): el botón
 * clickeado queda activo y los demás se desactivan.
 * @returns {void}
 */
function inicializarModalidad() {
  const grupo = document.getElementById('grupo-modalidad');
  if (!grupo) return;

  grupo.querySelectorAll('.av-seg__btn').forEach((boton) => {
    boton.addEventListener('click', () => {
      grupo.querySelectorAll('.av-seg__btn').forEach((b) => b.classList.remove('is-active'));
      boton.classList.add('is-active');
    });
  });
}

/**
 * Devuelve las iniciales de un nombre (ej. "Ana Torres" → "AT").
 * @param {string} nombre - Nombre completo de la persona.
 * @returns {string} Iniciales en mayúscula (máximo 2 letras).
 */
function inicialesDe(nombre) {
  const partes = nombre.trim().split(' ');
  const primera = partes[0] ? partes[0][0] : '';
  const segunda = partes[1] ? partes[1][0] : '';
  return (primera + segunda).toUpperCase();
}

/**
 * Asigna un color de avatar estable a partir del id del participante.
 * @param {number} id - Id del participante en el catálogo.
 * @returns {string} Clase de color del avatar (av-avatar--*).
 */
function colorAvatarDe(id) {
  const colores = ['av-avatar--blue', 'av-avatar--violet', 'av-avatar--teal', 'av-avatar--amber'];
  return colores[(id - 1) % colores.length];
}

/**
 * Devuelve el icono que representa el tipo de afiliación.
 * @param {string} afiliacion - Afiliación del participante.
 * @returns {string} Clase de ícono de Bootstrap Icons.
 */
function iconoAfiliacion(afiliacion) {
  switch (afiliacion) {
    case 'Estudiante': return 'bi-mortarboard';
    case 'Docente': return 'bi-person-badge';
    case 'Administrativo': return 'bi-briefcase';
    default: return 'bi-person';
  }
}

/**
 * Devuelve la clase de chip e ícono para el estado de verificación.
 * @param {'verificado'|'pendiente'} estado - Estado del participante.
 * @returns {{clase: string, texto: string, icono: string}} Datos del chip.
 */
function infoEstadoParticipante(estado) {
  if (estado === 'verificado') {
    return { clase: 'av-chip--success', texto: 'Verificado', icono: 'bi-check-circle' };
  }
  return { clase: 'av-chip--warning', texto: 'Pendiente', icono: 'bi-clock' };
}

/**
 * Genera el HTML de una fila de la tabla de participantes.
 * @param {object} participante - Participante del catálogo.
 * @returns {string} Fragmento HTML de la fila <tr>.
 */
function renderizarFilaParticipante(participante) {
  const estado = infoEstadoParticipante(participante.estado);

  return `
    <tr>
      <td>
        <div class="av-table__person">
          <span class="av-avatar av-avatar--md ${colorAvatarDe(participante.id)}" aria-hidden="true">${inicialesDe(participante.nombre)}</span>
          <div class="av-table__person-info">
            <span class="av-table__name">${participante.nombre}</span>
            <span class="av-table__sub">Documento ${participante.documento}</span>
          </div>
        </div>
      </td>
      <td><span class="av-tag"><i class="bi ${iconoAfiliacion(participante.afiliacion)}" aria-hidden="true"></i>${participante.afiliacion}</span></td>
      <td><span class="av-chip ${estado.clase}"><i class="bi ${estado.icono}" aria-hidden="true"></i>${estado.texto}</span></td>
    </tr>
  `;
}

/**
 * Pinta las filas de participantes según el filtro vigente (texto y
 * afiliación). Si no hay coincidencias muestra un mensaje de estado vacío.
 * @returns {void}
 */
function renderizarTablaParticipantes() {
  const tbody = document.getElementById('tabla-participantes-body');
  if (!tbody) return;

  const texto = document.getElementById('buscar-participantes').value;
  const afiliacion = document.getElementById('filtro-afiliacion').value;
  const participantes = filtrarParticipantes(texto, afiliacion);

  if (participantes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="av-table__empty">No se encontraron participantes con ese criterio de búsqueda.</td></tr>';
    mostrarResumenParticipantes();
    return;
  }

  tbody.innerHTML = '';
  for (let i = 0; i < participantes.length; i++) {
    const fila = renderizarFilaParticipante(participantes[i]);
    tbody.insertAdjacentHTML('beforeend', fila);
  }

  mostrarResumenParticipantes();
}

/**
 * Actualiza el resumen del paso 3: el total de participantes del padrón y
 * las coincidencias con el filtro vigente.
 * @returns {void}
 */
function mostrarResumenParticipantes() {
  const texto = document.getElementById('buscar-participantes').value;
  const afiliacion = document.getElementById('filtro-afiliacion').value;
  const coincidencias = filtrarParticipantes(texto, afiliacion).length;

  document.getElementById('resumen-padron').textContent = PARTICIPANTES_CATALOGO.length;
  document.getElementById('resumen-filtro').textContent = coincidencias;
}

/**
 * Guarda la descripción del universo de participantes en el proceso en
 * memoria: tipo, cantidad y los filtros vigentes en el momento de avanzar.
 * @returns {void}
 */
function capturarParticipantes() {
  const texto = document.getElementById('buscar-participantes').value.trim();
  const afiliacion = document.getElementById('filtro-afiliacion').value;

  procesoEnCreacion.participantes = {
    tipo: 'Padrón de participantes',
    total: PARTICIPANTES_CATALOGO.length,
    filtroTexto: texto,
    filtroAfiliacion: afiliacion
  };
}

/**
 * Conecta los filtros de la tabla de participantes con su renderizado y
 * la actualización del resumen.
 * @returns {void}
 */
function inicializarParticipantes() {
  const buscar = document.getElementById('buscar-participantes');
  if (buscar) buscar.addEventListener('input', renderizarTablaParticipantes);

  const filtroAfiliacion = document.getElementById('filtro-afiliacion');
  if (filtroAfiliacion) filtroAfiliacion.addEventListener('change', renderizarTablaParticipantes);

  renderizarTablaParticipantes();
}

/**
 * Genera el HTML de una fila clave/valor del resumen de revisión.
 * @param {string} etiqueta - Nombre del dato a mostrar.
 * @param {string|number} valor - Valor del dato.
 * @returns {string} Fragmento HTML de la fila del detalle.
 */
function crearFilaDetalle(etiqueta, valor) {
  return '<div class="av-detail__row"><dt>' + etiqueta + '</dt><dd>' + valor + '</dd></div>';
}

/**
 * Convierte una fecha en formato AAAA-MM-DD a DD/MM/AAAA.
 * @param {string} valor - Fecha en formato del input de tipo date.
 * @returns {string} Fecha en formato de la interfaz de Averyn.
 */
function formatearFecha(valor) {
  if (!valor) return '-';
  const partes = valor.split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

/**
 * Carga la información del proceso en memoria y la muestra en las tres
 * cards del paso de revisión (Información general, Configuración y
 * Participantes).
 * @returns {void}
 */
function mostrarResumenRevision() {
  const informacion = document.getElementById('revision-informacion');
  const configuracion = document.getElementById('revision-configuracion');
  const participantes = document.getElementById('revision-participantes');
  if (!informacion || !configuracion || !participantes) return;

  informacion.innerHTML =
    crearFilaDetalle('Nombre', procesoEnCreacion.nombre) +
    crearFilaDetalle('Descripción', procesoEnCreacion.descripcion) +
    crearFilaDetalle('Institución', ETIQUETAS_INSTITUCION[procesoEnCreacion.institucion] || procesoEnCreacion.institucion) +
    crearFilaDetalle('Tipo de proceso', ETIQUETAS_TIPO_PROCESO[procesoEnCreacion.tipoProceso] || procesoEnCreacion.tipoProceso) +
    crearFilaDetalle('Fecha de inicio', formatearFecha(procesoEnCreacion.fechaInicio)) +
    crearFilaDetalle('Fecha de finalización', formatearFecha(procesoEnCreacion.fechaFin));

  const config = procesoEnCreacion.configuracion;

  let filasSwitches = '';
  for (let i = 0; i < ETIQUETAS_SWITCHES.length; i++) {
    const item = ETIQUETAS_SWITCHES[i];
    filasSwitches += crearFilaDetalle(item.etiqueta, config[item.campo] ? 'Sí' : 'No');
  }

  configuracion.innerHTML =
    crearFilaDetalle('Tipo de votación', ETIQUETAS_TIPO_VOTACION[config.tipoVotacion] || config.tipoVotacion) +
    crearFilaDetalle('Opciones por voto', config.opcionesPorVoto) +
    crearFilaDetalle('Modalidad', ETIQUETAS_MODALIDAD[config.modalidad] || config.modalidad) +
    filasSwitches;

  const datos = procesoEnCreacion.participantes;
  const filtroTexto = datos.filtroTexto !== '' ? datos.filtroTexto : 'Ninguna';
  const filtroAfiliacion = datos.filtroAfiliacion !== '' ? datos.filtroAfiliacion : 'Todas';

  participantes.innerHTML =
    crearFilaDetalle('Tipo de participante', datos.tipo) +
    crearFilaDetalle('Búsqueda aplicada', filtroTexto) +
    crearFilaDetalle('Filtro de afiliación', filtroAfiliacion) +
    crearFilaDetalle('Cantidad estimada', datos.total);
}

/**
 * Verifica que el proceso tenga completa la información general, la
 * configuración y los participantes antes de crearlo.
 * @returns {boolean} true si el proceso está completo para crearse.
 */
function validarRevision() {
  const tieneInformacion = procesoEnCreacion.nombre &&
    procesoEnCreacion.institucion &&
    procesoEnCreacion.tipoProceso &&
    procesoEnCreacion.fechaInicio &&
    procesoEnCreacion.fechaFin;

  const tieneConfiguracion = procesoEnCreacion.configuracion &&
    procesoEnCreacion.configuracion.tipoVotacion &&
    procesoEnCreacion.configuracion.opcionesPorVoto &&
    procesoEnCreacion.configuracion.modalidad;

  const tieneParticipantes = procesoEnCreacion.participantes &&
    procesoEnCreacion.participantes.total > 0;

  return tieneInformacion && tieneConfiguracion && tieneParticipantes;
}

/**
 * Muestra un toast de éxito en la esquina inferior derecha.
 * @param {string} mensaje - Texto del aviso a mostrar.
 * @returns {void}
 */
function mostrarToast(mensaje) {
  const contenedor = document.getElementById('contenedor-toast');
  if (!contenedor) return;

  const toast = document.createElement('div');
  toast.className = 'av-toast av-toast--success';
  toast.innerHTML = '<i class="bi bi-check-circle av-toast__icon" aria-hidden="true"></i> ' + mensaje;
  contenedor.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 4000);
}

/**
 * Guarda el proceso electoral con estado DRAFT, muestra el aviso de éxito
 * y redirige al listado de procesos. Deshabilita el botón para evitar
 * crear el proceso más de una vez.
 * @returns {void}
 */
function crearProcesoElectoral() {
  procesoEnCreacion.estado = 'DRAFT';
  guardarProceso(procesoEnCreacion);

  const botonCrear = document.getElementById('btn-continuar');
  if (botonCrear) botonCrear.disabled = true;

  mostrarToast('Proceso electoral creado.');

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1600);
}

/**
 * Limpia el estado de error de un campo apenas el usuario lo corrige.
 * @returns {void}
 */
function inicializarLimpiezaErrores() {
  CAMPOS_OBLIGATORIOS_INFORMACION.concat(CAMPOS_OBLIGATORIOS_CONFIGURACION).forEach((idCampo) => {
    const elemento = document.getElementById(idCampo);
    if (!elemento) return;

    elemento.addEventListener('input', () => limpiarErrorCampo(idCampo));
    elemento.addEventListener('change', () => limpiarErrorCampo(idCampo));
  });
}

/**
 * Muestra el paso indicado del wizard y actualiza el estado del stepper:
 * los pasos ya completados quedan marcados, el actual activo y los
 * siguientes bloqueados. "Atrás" se deshabilita en el primer paso y, en el
 * último paso, "Continuar" se convierte en "Crear proceso electoral" y se
 * muestra el resumen de revisión.
 * @param {number} paso - Número del paso a mostrar (1 a 4).
 * @returns {void}
 */
function mostrarPaso(paso) {
  pasoActual = paso;

  document.querySelectorAll('[data-paso]').forEach((seccion) => {
    seccion.hidden = Number(seccion.dataset.paso) !== paso;
  });

  [1, 2, 3, 4].forEach((numero) => {
    const pasoStepper = document.getElementById(`stepper-paso-${numero}`);
    if (!pasoStepper) return;

    pasoStepper.classList.remove(
      'av-stepper__step--done',
      'av-stepper__step--current',
      'av-stepper__step--locked'
    );

    const marcar = pasoStepper.querySelector('.av-stepper__marker i');
    const estado = pasoStepper.querySelector('.av-stepper__status');

    if (numero < paso) {
      pasoStepper.classList.add('av-stepper__step--done');
      if (marcar) marcar.className = 'bi bi-check-lg';
      if (estado) estado.textContent = 'Completado';
    } else if (numero === paso) {
      pasoStepper.classList.add('av-stepper__step--current');
      if (marcar) marcar.className = `bi ${pasoStepper.dataset.icono}`;
      if (estado) estado.textContent = 'En curso';
    } else {
      pasoStepper.classList.add('av-stepper__step--locked');
      if (marcar) marcar.className = 'bi bi-lock-fill';
      if (estado) estado.textContent = 'Bloqueado';
    }
  });

  const btnAtras = document.getElementById('btn-atras');
  if (btnAtras) btnAtras.disabled = paso === 1;

  const btnContinuar = document.getElementById('btn-continuar');
  if (btnContinuar) {
    if (paso === 4) {
      btnContinuar.innerHTML = 'Crear proceso electoral <i class="bi bi-check2-circle" aria-hidden="true"></i>';
    } else {
      btnContinuar.innerHTML = 'Continuar <i class="bi bi-arrow-right" aria-hidden="true"></i>';
    }
    btnContinuar.disabled = false;
  }

  if (paso === 4) mostrarResumenRevision();
}

/**
 * Conecta los botones de navegación del wizard. "Continuar" valida y
 * captura el paso actual antes de avanzar; "Atrás" regresa al paso
 * anterior sin perder lo capturado.
 * @returns {void}
 */
function inicializarNavegacion() {
  const btnContinuar = document.getElementById('btn-continuar');
  if (btnContinuar) {
    btnContinuar.addEventListener('click', () => {
      if (pasoActual === 1) {
        if (!validarInformacionGeneral()) return;
        capturarInformacionGeneral();
        mostrarPaso(2);
        return;
      }

      if (pasoActual === 2) {
        if (!validarConfiguracion()) return;
        capturarConfiguracion();
        mostrarPaso(3);
        return;
      }

      if (pasoActual === 3) {
        capturarParticipantes();
        mostrarPaso(4);
        return;
      }

      if (pasoActual === 4) {
        if (!validarRevision()) return;
        crearProcesoElectoral();
      }
    });
  }

  const btnAtras = document.getElementById('btn-atras');
  if (btnAtras) {
    btnAtras.addEventListener('click', () => {
      if (pasoActual > 1) mostrarPaso(pasoActual - 1);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarPaso(1);
  inicializarLimpiezaErrores();
  inicializarModalidad();
  inicializarParticipantes();
  inicializarNavegacion();
});