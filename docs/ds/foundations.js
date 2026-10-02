(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toast = DS.toast, copiar = DS.copiar;

  /* ---------- Datos de color ---------- */
  var COLORES = {
    brand: [
      ['Azul de señal', '--av-blue', '#145FEE', 'Botones, enlaces, cierre azul', '#fff'],
      ['Azul hover', '--av-blue-hover', '#0F4BC7', 'Hover del botón primario', '#fff'],
      ['Azul activo', '--av-blue-active', '#0C3B9E', 'Pulsado', '#fff'],
      ['Tinte de señal', '--av-blue-tint', '#EAF0FE', 'Chips, avatares, tiles medianos', '#145FEE']
    ],
    horizon: [
      ['Navy profundo', '--av-navy', '#000C24', 'Texto principal, footer, tramo final', '#fff'],
      ['Navy nocturno', '--av-navy-night', '#071A36', 'Panel oscuro, sección Capacidades', '#fff'],
      ['Navy de horizonte', '--av-navy-horizon', '#0A2A66', 'Tramo medio del degradado', '#fff'],
      ['Cielo', '--av-sky', '#DCECFF', 'Inicio del degradado', '#000C24'],
      ['Papel azul', '--av-paper-blue', '#F4F8FF', 'Fondos alternos de sección', '#000C24'],
      ['Traza cian', '--av-cyan', '#00ACD2', 'Trazos de la figura de arcos', '#fff'],
      ['Brillo cian', '--av-cyan-glow', '#55D6FF', 'Índices, hover y puntos sobre navy', '#000C24'],
      ['Texto nocturno', '--av-night-text', '#B9C9E4', 'Texto secundario sobre navy', '#000C24']
    ],
    neutral: [
      ['Blanco', '--av-white', '#FFFFFF', 'Fondos y texto sobre oscuro', '#000C24'],
      ['Gris 50', '--av-gray-50', '#F4F6FA', 'Fondo deshabilitado', '#000C24'],
      ['Gris 100', '--av-gray-100', '#E7EBF3', 'Pistas, esqueletos', '#000C24'],
      ['Gris 200', '--av-gray-200', '#CBD3E1', 'Bordes en reposo (deshabilitado)', '#000C24'],
      ['Gris 300', '--av-gray-300', '#A9B4C7', 'Solo decoración (2.09:1)', '#000C24'],
      ['Gris 400', '--av-gray-400', '#7C89A3', 'Iconos y numeración; texto solo grande (3.52:1)', '#fff'],
      ['Gris 500', '--av-gray-500', '#56637F', 'Texto secundario (6.02:1)', '#fff'],
      ['Gris 600', '--av-gray-600', '#3B4664', 'Texto de apoyo (9.4:1)', '#fff'],
      ['Gris 700', '--av-gray-700', '#26304A', 'Texto de navegación', '#fff'],
      ['Línea', '--av-hairline', '#DCE5F5', 'Separadores de 1 px', '#000C24'],
      ['Línea fuerte', '--av-hairline-strong', '#CFDCF3', 'Bordes de contenedor y franja', '#000C24'],
      ['Borde de campo', '--av-field-border', '#6E86B0', 'Bordes de campo y borde discontinuo (3.68:1)', '#fff'],
      ['Placeholder', '--av-placeholder', '#667390', 'Texto de ejemplo en campos (4.75:1)', '#fff'],
      ['Tinta tenue', '--av-ink-faint', '#9DB6E6', 'Solo sobre navy o decoración', '#000C24']
    ],
    semantic: [
      ['Éxito', '--av-success', '#12B76A', 'Puntos y rellenos', '#fff'],
      ['Éxito texto', '--av-success-text', '#047857', 'Texto de éxito (5.48:1)', '#fff'],
      ['Éxito fondo', '--av-success-bg', '#E8F8F0', 'Fondo de chip y alerta', '#047857'],
      ['Aviso', '--av-warning', '#F79009', 'Puntos y rellenos', '#000C24'],
      ['Aviso texto', '--av-warning-text', '#B45309', 'Texto de aviso (5.02:1)', '#fff'],
      ['Aviso fondo', '--av-warning-bg', '#FEF3E2', 'Fondo de chip y alerta', '#B45309'],
      ['Error', '--av-error', '#F04438', 'Puntos y rellenos', '#fff'],
      ['Error texto', '--av-error-text', '#B91C1C', 'Texto de error (6.47:1)', '#fff'],
      ['Error fondo', '--av-error-bg', '#FDECEA', 'Fondo de chip y alerta', '#B91C1C'],
      ['Info', '--av-info', '#00ACD2', 'Puntos y rellenos', '#fff'],
      ['Info texto', '--av-info-text', '#0369A1', 'Texto informativo (5.93:1)', '#fff'],
      ['Info fondo', '--av-info-bg', '#E3F6FA', 'Fondo de chip y alerta', '#0369A1']
    ]
  };
  function pintarColores(id, lista) {
    var cont = $('#' + id); if (!cont) return;
    cont.innerHTML = lista.map(function (c) {
      var borde = /^#(FFFFFF|F4F8FF|F4F6FA|EAF0FE|E8F8F0|FEF3E2|FDECEA|E3F6FA|DCE5F5|CFDCF3|DCECFF)$/i.test(c[2]) ? 'box-shadow:inset 0 0 0 1px rgba(0,12,36,.08);' : '';
      return '<button class="sw" type="button" data-hex="' + c[2] + '" aria-label="Copiar ' + c[0] + ' ' + c[2] + '"><span class="sw__chip" style="background:' + c[2] + ';color:' + c[4] + ';' + borde + '">' + c[2] + '</span><span class="sw__meta"><b>' + c[0] + '</b><span>' + c[1] + '</span><em>' + c[3] + '</em></span></button>';
    }).join('');
  }
  Object.keys(COLORES).forEach(function (k) { pintarColores('sw-' + k, COLORES[k]); });

  /* ---------- Contraste en vivo ---------- */
  function lum(h) { h = h.replace('#', ''); var c = [0, 2, 4].map(function (i) { var v = parseInt(h.substr(i, 2), 16) / 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; }
  function ratio(a, b) { var l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); }
  var PARES = [
    ['#000C24', '#FFFFFF', 'Texto principal sobre blanco', 'Cuerpo y titulares'],
    ['#56637F', '#FFFFFF', 'Gris 500 sobre blanco', 'Texto secundario'],
    ['#56637F', '#F4F8FF', 'Gris 500 sobre papel azul', 'Texto secundario en secciones alternas'],
    ['#145FEE', '#FFFFFF', 'Azul de señal sobre blanco', 'Enlaces y rótulos'],
    ['#FFFFFF', '#145FEE', 'Blanco sobre azul de señal', 'Botón primario, cierre azul'],
    ['#F0F5FF', '#145FEE', 'Texto de apoyo sobre azul', 'Párrafos del cierre azul (mín.)'],
    ['#DCE8FF', '#145FEE', 'Texto #DCE8FF sobre azul', 'NO USAR (usar #F0F5FF)'],
    ['#FFFFFF', '#071A36', 'Blanco sobre navy nocturno', 'Titulares del panel'],
    ['#B9C9E4', '#071A36', 'Texto nocturno sobre navy', 'Texto secundario del panel'],
    ['#55D6FF', '#071A36', 'Brillo cian sobre navy', 'Índices, enlaces, foco'],
    ['#9DB6E6', '#071A36', 'Tinta tenue sobre navy', 'Solo sobre navy'],
    ['#9DB6E6', '#F4F8FF', 'Tinta tenue sobre papel azul', 'NO USAR como texto'],
    ['#FF8A80', '#071A36', 'Rojo suave sobre navy', 'Rechazo en el panel'],
    ['#FFC15A', '#071A36', 'Ámbar sobre navy', 'Reintento en el panel'],
    ['#6E86B0', '#FFFFFF', 'Borde de campo sobre blanco', 'Componente (mín. 3:1)'],
    ['#CFDCF3', '#FFFFFF', 'Línea fuerte sobre blanco', 'Solo separador, no borde de campo'],
    ['#667390', '#FFFFFF', 'Placeholder sobre blanco', 'Texto de ejemplo'],
    ['#7C89A3', '#FFFFFF', 'Gris 400 sobre blanco', 'Solo grande o decorativo'],
    ['#A9B4C7', '#FFFFFF', 'Gris 300 sobre blanco', 'NO USAR para texto'],
    ['#047857', '#FFFFFF', 'Éxito texto sobre blanco', 'Chips y alertas'],
    ['#B91C1C', '#FFFFFF', 'Error texto sobre blanco', 'Chips, alertas y mensajes'],
    ['#12B76A', '#FFFFFF', 'Éxito base sobre blanco', 'Solo punto o relleno, nunca texto'],
    ['#000C24', '#145FEE', 'Anillo navy sobre azul de señal', 'Foco del tile azul (≥ 3:1)']
  ];
  var tbody = $('#contrast-table tbody');
  if (tbody) tbody.innerHTML = PARES.map(function (p) {
    var r = ratio(p[0], p[1]); var nivel = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'Solo grande / componente' : 'No cumple';
    var prohibido = /NO USAR|nunca texto|Solo separador/.test(p[3]);
    var clase = (r >= 4.5 && !prohibido) || (r >= 3 && /componente|foco/i.test(p[3])) ? 'pass' : 'fail';
    return '<tr><td><span style="display:inline-block;padding:.2rem .7rem;border-radius:6px;background:' + p[1] + ';color:' + p[0] + ';font-weight:600;box-shadow:inset 0 0 0 1px rgba(0,12,36,.1)">Aa</span></td><td>' + p[2] + '<br><code>' + p[0] + '</code></td><td><code>' + p[1] + '</code></td><td class="' + clase + '">' + r.toFixed(2) + ':1<br><small>' + nivel + '</small></td><td>' + p[3] + '</td></tr>';
  }).join('');

  /* ---------- Escalas ---------- */
  var ESP = [['space-1', 4], ['space-2', 8], ['space-3', 12], ['space-4', 16], ['space-6', 24], ['space-8', 32], ['space-12', 48], ['space-16', 64]];
  $('#space-scale').innerHTML = ESP.map(function (e) { return '<div class="scale__row"><code>--av-' + e[0] + '</code><span class="mono">' + e[1] + ' px</span><span class="scale__bar" style="width:' + e[1] * 3 + 'px"></span></div>'; }).join('');
  var RAD = [['4 px', 'sm', 'Marcos de media', '4px'], ['8 px', 'control', 'Botones y campos', '8px'], ['10 px', 'pill', 'Píldora de navegación pública', '10px'], ['16 px', 'tile', 'Tiles, menús, toasts', '16px'], ['24 px', 'frame', 'Marco del login, modal, panel', '24px'], ['9999 px', 'full', 'Dock, chips, avatares', '9999px']];
  $('#radii').innerHTML = RAD.map(function (r) { return '<div><div class="rad" style="border-radius:' + r[3] + '">' + r[0] + '<br>--av-radius-' + r[1] + '</div><p class="ds-note">' + r[2] + '</p></div>'; }).join('');

  /* ---------- Iconos ---------- */
  var ICONOS = [['person-vcard', 'Identidad'], ['fingerprint', 'Biometría'], ['file-earmark-text', 'Documento / OCR'], ['camera', 'Cámara'], ['card-checklist', 'Procesos electorales'], ['check2-square', 'Electoral (dock)'], ['stars', 'IA'], ['cpu', 'IA (dock)'], ['person-gear', 'Usuarios'], ['clipboard-data', 'Reportes'], ['door-open', 'Accesos'], ['gear', 'Administración'], ['grid-1x2', 'Dashboard'], ['search', 'Buscar'], ['bell', 'Notificaciones'], ['box-arrow-right', 'Cerrar sesión'], ['chevron-down', 'Desplegar'], ['patch-check', 'Verificar'], ['collection', 'Vacío'], ['cloud-arrow-up', 'Subir archivo'], ['exclamation-circle', 'Error'], ['check-circle', 'Éxito'], ['info-circle', 'Información'], ['x-circle', 'Rechazo']];
  $('#icon-grid').innerHTML = ICONOS.map(function (i) { return '<button type="button" data-icon="bi bi-' + i[0] + '" aria-label="Copiar clase del icono ' + i[1] + '"><i class="bi bi-' + i[0] + '" aria-hidden="true"></i><span>' + i[1] + '</span></button>'; }).join('');

  /* ---------- Demos de componentes ---------- */
  var tg = $('#f-toggle'), pw = $('#f-pass');
  if (tg) tg.addEventListener('click', function () { var ver = pw.type === 'password'; pw.type = ver ? 'text' : 'password'; tg.textContent = ver ? 'Ocultar' : 'Mostrar'; tg.setAttribute('aria-pressed', String(ver)); });
  var sw1 = $('#sw1'); if (sw1) sw1.addEventListener('click', function () { sw1.setAttribute('aria-checked', String(sw1.getAttribute('aria-checked') !== 'true')); });
  var bl = $('#btn-load');
  if (bl) bl.addEventListener('click', function () {
    var sp = bl.querySelector('.hz-spin'), tx = $('#btn-load-t');
    bl.disabled = true; sp.hidden = false; tx.textContent = 'Verificando...';
    setTimeout(function () { bl.disabled = false; sp.hidden = true; tx.textContent = 'Probar estado de carga'; toast('Verificación completada', 'Ana Torres · Rostro verificado'); }, 1400);
  });
  $$('[data-toast]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-toast');
      if (t === 'ok') toast('Persona registrada', 'El registro se guardó correctamente.');
      if (t === 'bad') toast('Verificación rechazada', 'La huella no coincidió. Puedes reintentar.', 'bad');
      if (t === 'warn') toast('Reintento requerido', 'La calidad de la captura es baja.', 'warn');
    });
  });
  var modal = $('#modal'), openM = $('#open-modal');
  if (modal && openM) {
    openM.addEventListener('click', function () { if (modal.showModal) modal.showModal(); else modal.setAttribute('open', ''); });
    $('#close-modal').addEventListener('click', function () { modal.close(); });
    $('#ok-modal').addEventListener('click', function () { modal.close(); toast('Persona eliminada', 'Ana Torres se eliminó del catálogo.', 'bad'); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  }
  var avb = $('#av-open'), avm = $('#av-menu');
  if (avb) {
    avb.addEventListener('click', function (e) { e.stopPropagation(); var abierto = avb.getAttribute('aria-expanded') === 'true'; avm.hidden = abierto; avb.setAttribute('aria-expanded', String(!abierto)); });
    document.addEventListener('click', function (e) { if (!avm.contains(e.target)) { avm.hidden = true; avb.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !avm.hidden) { avm.hidden = true; avb.setAttribute('aria-expanded', 'false'); avb.focus(); } });
  }
  var tabs = $$('#tabs [role="tab"]');
  function seleccionar(t, foco) {
    tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
    if (foco) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { seleccionar(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); seleccionar(tabs[(i + 1) % tabs.length], true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); seleccionar(tabs[(i - 1 + tabs.length) % tabs.length], true); }
    });
  });
  var drop = $('#drop');
  if (drop) {
    ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); }); });
    drop.addEventListener('drop', function () { toast('Documento recibido', 'Procesando con OCR…'); });
    drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toast('Elegir archivo', 'Aquí se abriría el selector del sistema.'); } });
    drop.addEventListener('click', function () { toast('Elegir archivo', 'Aquí se abriría el selector del sistema.'); });
  }
  $$('.hz-pager button:not([disabled])').forEach(function (b) { b.addEventListener('click', function () { if (/^\d+$/.test(b.textContent)) { $$('.hz-pager [aria-current]').forEach(function (x) { x.removeAttribute('aria-current'); }); b.setAttribute('aria-current', 'page'); } }); });

  /* ---------- Demo del hero (misma matemática que home.js) ---------- */
  var range = $('#hd-range'), demo = $('#hero-demo');
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ease = function (t) { return t * t * (3 - 2 * t); };
  var fase = function (p, a, b) { return ease(clamp((p - a) / (b - a))); };
  function heroDemo() {
    var p = Number(range.value) / 100;
    var t1 = fase(p, .06, .42), t2 = fase(p, .42, .66), t3 = fase(p, .62, .92);
    var W = 900, H = W * 371 / 1144, stageH = demo.clientHeight;
    var finalW = Math.min(300, demo.clientWidth * .3), sf = finalW / W;
    var s = 1 - (1 - sf) * (.55 * t1 + .45 * t2);
    var cx = 15.95 + 84.05 * t1;
    var tx = -W / 2 + (1 - t1) * s * .349 * W;
    var ty = -H / 2 - t2 * .27 * stageH;
    var logo = $('#hd-logo');
    logo.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
    logo.style.clipPath = 'polygon(0 0,' + cx + '% 0,' + (cx + 18.3) + '% 100%,0 100%)';
    $('#hd-navy').style.opacity = t2;
    $('#hd-fig').style.opacity = t3;
    $$('.hd-p').forEach(function (el) { el.style.strokeDasharray = 1; el.style.strokeDashoffset = 1 - t3; });
    $('#hd-copy').style.opacity = t3;
    $('#hd-val').textContent = Math.round(p * 100) + ' %';
    range.setAttribute('aria-valuetext', Math.round(p * 100) + ' %');
  }
  if (range) { range.addEventListener('input', heroDemo); window.addEventListener('resize', heroDemo); heroDemo(); }

})();
