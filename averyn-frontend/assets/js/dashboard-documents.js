/**
 * Datos simulados de documentos asociados a personas en Averyn.
 * El pipeline conceptual es DOCUMENT_CAPTURE -> OCR_PROCESS -> OCR_RESULT
 * -> VALIDATION -> IDENTITY_MATCHING -> PERSON (Contexto Maestro, sección 3.2).
 * El campo "tipo" es variable a proposito: no todo es cedula.
 * @type {Array<{id: number, tipo: string, fecha: string, estado: 'procesado'|'en_proceso'|'error', campoExtraido: Object|null}>}
 */
const DOCUMENTOS_MOCK = [
  {
    id: 1,
    tipo: 'Cédula',
    fecha: '10/09/2026',
    estado: 'procesado',
    campoExtraido: { nombres: 'Ana', apellidos: 'Torres', numeroDocumento: '10234567', fechaDocumento: '15/03/2019' },
  },
  {
    id: 2,
    tipo: 'Pasaporte',
    fecha: '11/09/2026',
    estado: 'en_proceso',
    campoExtraido: null,
  },
  {
    id: 3,
    tipo: 'Carnet institucional',
    fecha: '12/09/2026',
    estado: 'error',
    campoExtraido: null,
  },
  {
    id: 4,
    tipo: 'Cédula',
    fecha: '12/09/2026',
    estado: 'procesado',
    campoExtraido: { nombres: 'Luis', apellidos: 'Pérez', numeroDocumento: '10345678', fechaDocumento: '02/07/2020' },
  },
];

/**
 * Devuelve la clase de badge y el texto visible para un estado de documento.
 * @param {'procesado'|'en_proceso'|'error'} estado
 * @returns {{clase: string, texto: string}}
 */
function obtenerInfoEstadoDocumento(estado) {
  switch (estado) {
    case 'procesado':
      return { clase: 'av-chip--success', texto: 'Procesado', icono: 'bi-check-circle' };
    case 'en_proceso':
      return { clase: 'av-chip--info', texto: 'En proceso', icono: 'bi-arrow-repeat' };
    case 'error':
      return { clase: 'av-chip--error', texto: 'Error', icono: 'bi-x-circle' };
    default:
      return { clase: 'av-chip--neutral', texto: estado, icono: 'bi-circle' };
  }
}

/**
 * Devuelve el icono asociado al tipo de documento.
 * @param {string} tipo
 * @returns {string} Clase del icono de Bootstrap Icons.
 */
function iconoTipoDocumento(tipo) {
  switch (tipo) {
    case 'Cédula': return 'bi-card-text';
    case 'Pasaporte': return 'bi-book';
    case 'Carnet institucional': return 'bi-person-badge';
    default: return 'bi-file-earmark-text';
  }
}

/**
 * Genera el HTML de una fila de la tabla de documentos. Los documentos
 * procesados son clicables (abren el modal de resultado OCR); los que
 * fallaron muestran el texto exacto de Microcopy debajo del chip.
 * @param {Object} documento
 * @returns {string} Fragmento HTML de la fila <tr>.
 */
function renderizarFilaDocumento(documento) {
  const { clase, texto, icono } = obtenerInfoEstadoDocumento(documento.estado);
  const esClicable = documento.estado === 'procesado';
  const atributoClic = esClicable ? `data-id-documento="${documento.id}"` : '';
  const claseFila = esClicable ? 'av-table__row-clicable' : '';
  const iconoDoc = iconoTipoDocumento(documento.tipo);

  let nota = '';
  if (documento.estado === 'en_proceso') {
    nota = '<div class="av-table__sub" style="margin-top:4px">Extrayendo datos…</div>';
  } else if (documento.estado === 'error') {
    nota = '<div class="av-table__sub" style="margin-top:4px;max-width:250px">No pudimos leer el documento. Verifica que la imagen esté completa y sin reflejos.</div>';
  }

  const accion = esClicable
    ? '<button type="button" class="av-icon-btn av-icon-btn--sm" aria-label="Ver resultado OCR" title="Ver resultado"><i class="bi bi-eye" aria-hidden="true"></i></button>'
    : '<span class="av-table__sub">—</span>';

  return `
    <tr class="${claseFila}" ${atributoClic}>
      <td>
        <div class="av-table__doc">
          <span class="av-table__doc-icon" aria-hidden="true"><i class="bi ${iconoDoc}"></i></span>
          <div class="av-table__doc-info">
            <span class="av-table__doc-name">${documento.tipo}</span>
            <span class="av-table__doc-sub">Documento de identidad</span>
          </div>
        </div>
      </td>
      <td>${documento.fecha}</td>
      <td>
        <span class="av-chip ${clase}"><i class="bi ${icono}" aria-hidden="true"></i>${texto}</span>
        ${nota}
      </td>
      <td class="av-table__actions">${accion}</td>
    </tr>
  `;
}

/**
 * Pinta el arreglo de documentos en el tbody de la tabla y conecta
 * el clic de cada fila procesada con la apertura del modal OCR.
 * @param {Array<Object>} documentos
 * @returns {void}
 */
function renderizarTablaDocumentos(documentos) {
  const tbody = document.getElementById('tabla-documentos-body');
  if (!tbody) return;

  const info = document.getElementById('tabla-documentos-info');
  if (info) {
    info.textContent = `${documentos.length} documento${documentos.length === 1 ? '' : 's'}`;
  }

  tbody.innerHTML = documentos.map(renderizarFilaDocumento).join('');

  tbody.querySelectorAll('tr[data-id-documento]').forEach((fila) => {
    fila.addEventListener('click', () => {
      const idDocumento = Number(fila.getAttribute('data-id-documento'));
      const documento = documentos.find((d) => d.id === idDocumento);
      if (documento) {
        abrirModalOcr(documento);
      }
    });
  });
}

/**
 * Abre el modal de resultado OCR y precarga los campos extraidos
 * del documento como valores editables (regla 3.2: el OCR nunca
 * crea identidad automaticamente, es un borrador para confirmar).
 * @param {Object} documento - Documento con su campoExtraido ya presente.
 * @returns {void}
 */
function abrirModalOcr(documento) {
  const overlay = document.getElementById('modal-ocr-overlay');
  if (!overlay || !documento.campoExtraido) return;

  document.getElementById('ocr-nombres').value = documento.campoExtraido.nombres;
  document.getElementById('ocr-apellidos').value = documento.campoExtraido.apellidos;
  document.getElementById('ocr-documento').value = documento.campoExtraido.numeroDocumento;
  document.getElementById('ocr-fecha').value = documento.campoExtraido.fechaDocumento;

  overlay.hidden = false;
}

/**
 * Cierra el modal de resultado OCR.
 * @returns {void}
 */
function cerrarModalOcr() {
  const overlay = document.getElementById('modal-ocr-overlay');
  if (overlay) overlay.hidden = true;
}

/**
 * Conecta los cierres del modal OCR: boton X, boton Cancelar, clic
 * fuera del modal, y tecla Escape.
 * @returns {void}
 */
function inicializarModalOcr() {
  const overlay = document.getElementById('modal-ocr-overlay');
  const btnCerrar = document.getElementById('btn-cerrar-modal-ocr');
  const btnCancelar = document.getElementById('btn-cancelar-ocr');
  const btnConfirmar = document.getElementById('btn-confirmar-ocr');
  if (!overlay || !btnCerrar || !btnCancelar || !btnConfirmar) return;

  btnCerrar.addEventListener('click', cerrarModalOcr);
  btnCancelar.addEventListener('click', cerrarModalOcr);

  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) {
      cerrarModalOcr();
    }
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !overlay.hidden) {
      cerrarModalOcr();
    }
  });

  btnConfirmar.addEventListener('click', () => {
    // Sprint 1: confirmar solo cierra el modal (sin persistencia real).
    cerrarModalOcr();
  });
}

/**
 * Simula la seleccion de un archivo en la dropzone: al hacer clic,
 * abre el selector de archivos nativo. No sube nada realmente,
 * solo confirma visualmente que se "recibio" un archivo.
 * @returns {void}
 */
function inicializarDropzoneDocumento() {
  const dropzone = document.getElementById('dropzone-documento');
  const input = document.getElementById('input-archivo-documento');
  if (!dropzone || !input) return;

  dropzone.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    if (input.files.length > 0) {
      const nombreArchivo = input.files[0].name;
      dropzone.querySelector('span').textContent = `Archivo seleccionado: ${nombreArchivo}`;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarTablaDocumentos(DOCUMENTOS_MOCK);
  inicializarModalOcr();
  inicializarDropzoneDocumento();
});