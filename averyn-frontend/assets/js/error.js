/**
 * Páginas de error (404, 403, 500, sin conexión, mantenimiento).
 * El contenido ya viene en el HTML; este script solo lo completa:
 * - muestra la ruta pedida (404/403),
 * - decide entre "Ir al panel" (hay sesión) o "Ingresar",
 * - cambia el mensaje cuando la ruta es un módulo que aún no tiene pantalla,
 * - habilita "Reintentar" y la recarga automática al volver la conexión.
 */
(function () {
  'use strict';

  var SESSION_KEY = 'averyn.session';
  var tipo = document.body.getAttribute('data-error');

  var tieneSesion = function () {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return Boolean(raw && JSON.parse(raw).email);
    } catch (e) { return false; }
  };

  /* Ruta pedida: solo texto (textContent), recortada y legible */
  var rutaEl = document.getElementById('er-path');
  if (rutaEl) {
    var ruta = '';
    try { ruta = decodeURIComponent(window.location.pathname); } catch (e) { ruta = window.location.pathname; }
    var esVistaPrevia = /\/(404|403)\.html$/.test(ruta);
    if (!esVistaPrevia && ruta) {
      rutaEl.querySelector('code').textContent = ruta.length > 90 ? ruta.slice(0, 87) + '…' : ruta;
      rutaEl.hidden = false;
    }
  }

  /* Módulos del dock que todavía no existen: mensaje honesto en lugar de "no encontrada" */
  if (tipo === '404' && /\/modules\/(access|admin)\//.test(window.location.pathname)) {
    var t = document.querySelector('.er-title'), l = document.querySelector('.er-lead'), e = document.querySelector('.er-eyebrow');
    if (t) t.textContent = 'Este módulo llega pronto.';
    if (l) l.textContent = 'Accesos y Administración todavía no tienen pantalla. Estamos trabajando en ellos.';
    if (e) e.textContent = 'Próximamente';
  }

  /* Acciones que dependen de la sesión */
  var panel = document.querySelector('[data-go="panel"]');
  var auth = document.querySelector('[data-go="auth"]');
  if (panel && auth) {
    if (tieneSesion()) { auth.hidden = true; } else { panel.hidden = true; }
  }

  /* Reintentar */
  var reintentar = document.querySelector('[data-retry]');
  if (reintentar) reintentar.addEventListener('click', function () { window.location.reload(); });

  /* Sin conexión: se recarga sola al volver la red */
  if (tipo === 'offline') {
    var estado = document.getElementById('er-status');
    var pintar = function () {
      if (!estado) return;
      estado.hidden = false;
      estado.textContent = navigator.onLine ? 'Parece que la conexión volvió. Pulsa Reintentar.' : 'Esperando conexión…';
    };
    pintar();
    window.addEventListener('online', function () { pintar(); window.setTimeout(function () { window.location.reload(); }, 600); });
    window.addEventListener('offline', pintar);
  }

  /* Volver (403) */
  var volver = document.querySelector('[data-back]');
  if (volver) volver.addEventListener('click', function (ev) {
    if (window.history.length > 1) { ev.preventDefault(); window.history.back(); }
  });
})();
