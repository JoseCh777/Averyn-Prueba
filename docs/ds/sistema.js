/* Páginas de error y avisos (Plantillas y estados): vistas en vivo escaladas, modal de sesión caducada y banners. */
(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;

  /* Cada .dsframe carga una página real a 1440×900 y la escala al ancho disponible */
  var frames = $$('.dsframe[data-src]');
  frames.forEach(function (box) {
    var iframe = document.createElement('iframe');
    var src = box.getAttribute('data-src'), key = src.split('/').pop();
    /* En el HTML único (bundle.py) las páginas viajan dentro del archivo: window.DS_FRAMES[nombre] */
    if (window.DS_FRAMES && window.DS_FRAMES[key]) iframe.srcdoc = window.DS_FRAMES[key]; else iframe.src = src;
    iframe.title = box.getAttribute('data-title') || 'Vista previa';
    iframe.loading = 'lazy';
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('aria-hidden', 'true');
    box.appendChild(iframe);
  });
  function escalar() {
    frames.forEach(function (box) {
      var f = box.querySelector('iframe');
      if (!f) return;
      var s = box.clientWidth / 1440;
      f.style.transform = 'scale(' + s + ')';
      box.style.height = Math.round(900 * s) + 'px';
    });
  }
  escalar();
  window.addEventListener('resize', escalar);

  /* Modal de sesión caducada */
  var modal = $('#modal-session'), abrir = $('#open-session');
  if (modal && abrir) {
    abrir.addEventListener('click', function () { if (modal.showModal) modal.showModal(); else modal.setAttribute('open', ''); });
    $('#session-ok').addEventListener('click', function () { modal.close(); DS.toast('Ingresar', 'Aquí se redirigiría a login.html.'); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  }

  /* Cerrar banners descartables */
  $$('.hz-banner__x').forEach(function (b) { b.addEventListener('click', function () { b.closest('.hz-banner').remove(); }); });
})();
