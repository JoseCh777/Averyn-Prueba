/* Design System Horizonte — utilidades compartidas por todas las páginas del documento.
   Expone window.DS = { $, $$, toast, copiar, reduce }. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Toast (región aria-live) ---------- */
  function toast(titulo, texto, tipo) {
    var cont = document.getElementById('toasts');
    if (!cont) return;
    var t = document.createElement('div');
    t.className = 'hz-toast' + (tipo === 'bad' ? ' hz-toast--bad' : tipo === 'warn' ? ' hz-toast--warn' : '');
    t.setAttribute('role', 'status');
    t.innerHTML = '<div><b></b><span></span></div>';
    t.querySelector('b').textContent = titulo;
    t.querySelector('span').textContent = texto || '';
    cont.appendChild(t);
    var timer = setTimeout(function () { t.remove(); }, 5000);
    t.addEventListener('mouseenter', function () { clearTimeout(timer); });
    t.addEventListener('mouseleave', function () { timer = setTimeout(function () { t.remove(); }, 2000); });
  }

  /* ---------- Copiar al portapapeles ---------- */
  function copiar(texto, etiqueta) {
    var ok = function () { toast('Copiado', etiqueta || texto); };
    var fallo = function () { toast('No se pudo copiar', 'Selecciona el texto manualmente.', 'warn'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(ok, fallo);
    else fallo();
  }

  window.DS = { $: $, $$: $$, toast: toast, copiar: copiar, reduce: reduce };

  /* Botones "Copiar" de los bloques de código */
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = $(b.getAttribute('data-copy'));
      if (el) copiar(el.textContent, 'Fragmento de código');
    });
  });

  /* Muestras de color e iconos: cualquier elemento con data-hex o data-icon se copia al hacer clic */
  document.addEventListener('click', function (e) {
    var sw = e.target.closest('[data-hex]');
    if (sw) copiar(sw.getAttribute('data-hex'), sw.getAttribute('data-hex'));
    var ic = e.target.closest('[data-icon]');
    if (ic) copiar(ic.getAttribute('data-icon'), ic.getAttribute('data-icon'));
  });

  /* Índice lateral: marca la sección visible de la página actual */
  var enlaces = $$('.ds-side nav a[href^="#"]');
  var secciones = enlaces.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && secciones.length) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) enlaces.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    secciones.forEach(function (s) { obs.observe(s); });
    window.addEventListener('scroll', function () {
      if (window.scrollY < 120) enlaces.forEach(function (a) { a.classList.remove('is-current'); });
    }, { passive: true });
  }
})();
