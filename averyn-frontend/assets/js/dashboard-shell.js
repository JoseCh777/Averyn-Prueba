/**
 * Marca como activo el item del dock que corresponde a la pagina actual,
 * comparando el nombre de carpeta del enlace contra la ruta visible en
 * el navegador (funciona con o sin "index.html" explicito en la URL).
 * @returns {void}
 */
function marcarItemActivoDelDock() {
  const itemsDock = document.querySelectorAll('.av-dock__item');
  const moduloPagina = document.body.getAttribute('data-modulo');
  const rutaActual = window.location.pathname.replace(/\/index\.html$/, '/');

  itemsDock.forEach((item) => {
    item.classList.remove('is-active');

    // Si la página declara su módulo (data-modulo), se marca por módulo: así
    // todas las subvistas de Biometría resaltan el mismo ítem del dock.
    if (moduloPagina) {
      if (item.getAttribute('data-modulo') === moduloPagina) {
        item.classList.add('is-active');
      }
      return;
    }

    const rutaDelItem = item.getAttribute('href');
    if (rutaDelItem === '#') {
      return;
    }

    // Normaliza el href del item a su ruta absoluta real, resolviendola
    // contra la URL actual del navegador (funciona con cualquier
    // profundidad de carpetas, sin depender de contar "../").
    const rutaAbsolutaDelItem = new URL(rutaDelItem, window.location.href).pathname.replace(/\/index\.html$/, '/');

    if (rutaActual === rutaAbsolutaDelItem) {
      item.classList.add('is-active');
    }
  });
}

/**
 * Calcula la ruta relativa a login.html desde la vista actual, subiendo
 * tantos niveles de carpeta como profundidad tenga la página dentro de
 * averyn-frontend (funciona con cualquier profundidad).
 * @returns {string}
 */
function rutaLoginRelativa() {
  const segmentos = window.location.pathname.split('/').filter(Boolean);
  const indice = segmentos.indexOf('averyn-frontend');
  const base = indice >= 0 ? segmentos.slice(indice + 1) : segmentos;
  const niveles = Math.max(base.length - 1, 0);
  return `${'../'.repeat(niveles)}login.html`;
}

/**
 * Indica si existe una sesión activa guardada por el login.
 * @returns {boolean}
 */
function tieneSesionActiva() {
  try {
    const crudo = localStorage.getItem('averyn.session');
    return Boolean(crudo && JSON.parse(crudo).email);
  } catch (error) {
    return false;
  }
}

/**
 * Redirige al login simulando el cierre de sesión del usuario: limpia la
 * sesión guardada y navega a login.html relativo a la vista actual.
 * @returns {void}
 */
function cerrarSesion() {
  try {
    localStorage.removeItem('averyn.session');
  } catch (error) {
    /* localStorage no disponible */
  }
  window.location.href = rutaLoginRelativa();
}

/**
 * Controla el buscador compacto: al abrir enfoca el input y sincroniza
 * el estado ARIA; Escape o el foco fuera lo vuelven a cerrar.
 * @returns {void}
 */
function inicializarBuscador() {
  const contenedor = document.getElementById('av-search');
  const boton = document.getElementById('btn-search');
  const input = document.getElementById('input-search');
  if (!contenedor || !boton || !input) return;

  const abrir = () => {
    input.hidden = false;
    contenedor.classList.add('is-open');
    boton.setAttribute('aria-expanded', 'true');
    input.focus();
  };

  const cerrar = () => {
    contenedor.classList.remove('is-open');
    boton.setAttribute('aria-expanded', 'false');
    input.hidden = true;
  };

  boton.addEventListener('click', () => {
    if (contenedor.classList.contains('is-open')) {
      cerrar();
    } else {
      abrir();
    }
  });

  input.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      cerrar();
      boton.focus();
    }
  });

  document.addEventListener('click', (evento) => {
    if (!contenedor.contains(evento.target)) {
      cerrar();
    }
  });
}

/**
 * Controla el menu desplegable del usuario: abre/cierra con click,
 * cierra al hacer click fuera o con Escape, y sincroniza ARIA.
 * @returns {void}
 */
function inicializarMenuUsuario() {
  const contenedor = document.getElementById('av-user');
  const boton = document.getElementById('btn-user');
  const menu = document.getElementById('menu-user');
  if (!contenedor || !boton || !menu) return;

  const cerrar = () => {
    menu.hidden = true;
    boton.setAttribute('aria-expanded', 'false');
  };

  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    menu.hidden = abierto;
    boton.setAttribute('aria-expanded', String(!abierto));
  });

  document.addEventListener('click', (evento) => {
    if (!contenedor.contains(evento.target)) {
      cerrar();
    }
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      cerrar();
    }
  });
}

/**
 * Mide la altura real del navbar (varía en mobile por el wrap del dock)
 * y la expone como --navbar-height en :root, para que el contenido
 * compense el espacio del dock flotante (position: fixed) con padding-top.
 * @returns {void}
 */
function inicializarAlturaNavbar() {
  const navbar = document.querySelector('.av-navbar');
  if (!navbar || !('ResizeObserver' in window)) return;

  const actualizar = () => {
    document.documentElement.style.setProperty('--navbar-height', `${navbar.offsetHeight}px`);
  };

  actualizar();
  new ResizeObserver(actualizar).observe(navbar);
  window.addEventListener('load', actualizar);
  window.addEventListener('resize', actualizar);
}

document.addEventListener('DOMContentLoaded', () => {
  // Guard de sesión: sin sesión activa, la vista redirige al login.
  if (!tieneSesionActiva()) {
    window.location.replace(rutaLoginRelativa());
    return;
  }

  marcarItemActivoDelDock();
  inicializarBuscador();
  inicializarMenuUsuario();
  inicializarAlturaNavbar();

  const botonLogout = document.getElementById('btn-logout');
  if (botonLogout) {
    botonLogout.addEventListener('click', cerrarSesion);
  }
});