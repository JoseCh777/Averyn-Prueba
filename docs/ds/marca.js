/* Marca y entregables: kit de ilustración, correos, vista de impresión y tokens. */
(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var logo = ($('.ds-side__brand img') || {}).src || '';
  var styles = function () { return $$('head link[rel="stylesheet"], head style').map(function (n) { return n.outerHTML; }).join('\n'); };
  function download(name, text, type) {
    var a = document.createElement('a'); a.download = name;
    a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain;charset=utf-8' }));
    document.body.appendChild(a); a.click(); a.remove(); DS.toast('Descarga lista', name);
  }

  /* ---------- Kit de ilustración ---------- */
  (function () {
    var grid = $('#ill-grid'); if (!grid) return;
    var P = { h: 'M0 290 H640', a1: 'M30 290 C110 60 330 40 450 290', a2: 'M90 290 C150 110 300 95 390 290', a3: 'M150 290 C190 170 270 160 330 290', d1: 'M300 8 L545 290', d2: 'M326 -32 L605 290' };
    var C = { light: { h: '#CFDCF3', a1: '#000C24', a2: '#0092B5', a3: '#145FEE', d: '#145FEE', ok: '#047857' }, night: { h: 'rgba(255,255,255,.22)', a1: '#FFFFFF', a2: '#00ACD2', a3: '#55D6FF', d: '#3D86FF', ok: '#6EE7B7' } };
    var path = function (d, col, w, extra) { return '<path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '"' + (extra || '') + '/>'; };
    function wrap(inner, label) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" fill="none" role="img" aria-label="' + label + '">' + inner + '</svg>'; }
    var base = function (c) { return path(P.h, c.h, 1) + path(P.a1, c.a1, 1.5) + path(P.a2, c.a2, 2) + path(P.a3, c.a3, 1.5) + path(P.d1, c.d, 2) + path(P.d2, c.d, 2); };
    var arcs3 = function (c) { return path(P.h, c.h, 1) + path(P.a1, c.a1, 1.5) + path(P.a2, c.a2, 2) + path(P.a3, c.a3, 1.5); };
    var K = [
      { k: 'base', n: 'Arcos base', d: 'La figura de marca: encabezados, portadas y fondos de página.', night: false, svg: function (c) { return base(c); }, label: 'Arcos de Averyn sobre el horizonte' },
      { k: 'base-noche', n: 'Arcos base · sobre navy', d: 'Misma figura con trazos claros para superficies oscuras.', night: true, svg: function (c) { return base(c); }, label: 'Arcos de Averyn sobre fondo oscuro' },
      { k: 'vacio', n: 'Vacío', d: 'Un solo arco pequeño y un punto: algo está por llegar.', night: false, svg: function (c) { return path(P.h, c.h, 1) + path(P.a3, c.a3, 1.5) + '<circle cx="240" cy="205" r="5" stroke="' + c.a2 + '" stroke-width="2"/>'; }, label: 'Un arco pequeño con un punto' },
      { k: 'exito', n: 'Éxito', d: 'Los arcos completos y una marca de verificación sobre ellos.', night: false, svg: function (c) { return arcs3(c) + '<circle cx="240" cy="62" r="32" stroke="' + c.ok + '" stroke-width="2"/>' + path('M224 62 l11 11 l21 -23', c.ok, 2.5); }, label: 'Arcos completos con una marca de verificación' },
      { k: 'error', n: 'Error · arcos rotos', d: 'Las piezas se separan: la figura no encaja. Solo para errores.', night: true, svg: function (c) { return path(P.h, c.h, 1) + path(P.a1, c.a1, 1.5) + path('M90 290 C101 213 151 118 215 125', c.a2, 2) + '<g transform="translate(18 14)">' + path('M215 125 C279 133 340 175 390 290', c.a2, 2) + '</g><g transform="translate(22 -8)">' + path(P.a3, c.a3, 1.5) + '</g>' + path(P.d1, c.d, 2) + path('M326 -32 L471 135', c.d, 2) + '<g transform="translate(-22 10)">' + path('M471 135 L605 290', c.d, 2) + '</g><circle cx="227" cy="115" r="15" stroke="' + c.a3 + '" stroke-width="1.5"/>'; }, label: 'Arcos con piezas separadas' },
      { k: 'cargando', n: 'Cargando', d: 'Los arcos se dibujan una vez, de afuera hacia adentro. Sin bucle.', night: false, svg: function (c) { var dr = function (d, col, w, i) { return path(d, col, w, ' class="ill-draw" pathLength="1" style="animation-delay:' + (i * .25) + 's"'); }; return path(P.h, c.h, 1) + dr(P.a1, c.a1, 1.5, 0) + dr(P.a2, c.a2, 2, 1) + dr(P.a3, c.a3, 1.5, 2); }, label: 'Arcos dibujándose' }
    ];
    function make(k, forceSize) { var c = k.night ? C.night : C.light; return wrap(k.svg(c), k.label); }
    K.forEach(function (k) {
      var art = document.createElement('article'); art.className = 'ill';
      art.innerHTML = '<div class="ill__art' + (k.night ? ' ill__art--night' : '') + '">' + make(k) + '</div><div class="ill__txt"><b>' + esc(k.n) + '</b>' + esc(k.d) + '</div><div class="ill__act"><button type="button" data-a="copy">Copiar SVG</button><button type="button" data-a="dl">Descargar</button></div>';
      var clean = function () { return make(k).replace(/ class="ill-draw" pathLength="1" style="[^"]*"/g, ''); };
      $('[data-a="copy"]', art).addEventListener('click', function () { DS.copiar(clean(), 'SVG de ' + k.n); });
      $('[data-a="dl"]', art).addEventListener('click', function () { download('averyn-' + k.k + '.svg', clean(), 'image/svg+xml;charset=utf-8'); });
      grid.appendChild(art);
    });
    var E = [
      ['vacio', 'Aún no hay personas', 'Registra a la primera persona para empezar.', 'Registrar persona'],
      ['vacio', 'Sin resultados para «Quispe»', 'Revisa la ortografía o quita algún filtro.', 'Limpiar búsqueda'],
      ['exito', 'Todo al día', 'No tienes tareas pendientes.', '']
    ], host = $('#ill-empties');
    E.forEach(function (e) {
      var k = K.filter(function (x) { return x.k === e[0]; })[0], d = document.createElement('div'); d.className = 'es';
      d.innerHTML = wrap(k.svg(C.light), '').replace('role="img" aria-label=""', 'aria-hidden="true" focusable="false"') + '<b>' + esc(e[1]) + '</b><p>' + esc(e[2]) + '</p>' + (e[3] ? '<button class="hz-btn hz-btn--ghost" type="button">' + esc(e[3]) + '</button>' : '');
      host.appendChild(d);
    });
  })();

  /* ---------- Correos ---------- */
  (function () {
    var seg = $('#mail-seg'), data; try { data = JSON.parse($('#emails-data').textContent); } catch (e) { return; }
    var keys = Object.keys(data), cur = keys[0];
    var VARS = { nombre: 'Ana', institucion: 'Universidad Horizonte', invitador: 'Carlos Mendoza', enlace: 'https://app.averyn.example/aceptar/abc123', codigo: '482 913', fecha: '2 oct 2026, 10:42', dispositivo: 'Edge en Windows', ubicacion: 'Lima, Perú', correo_soporte: 'soporte@averyn.example', logo_url: logo };
    var fill = function (t) { return t.replace(/\{\{(\w+)\}\}/g, function (m, k) { return VARS[k] != null ? VARS[k] : m; }); };
    keys.forEach(function (k) { var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-k', k); b.setAttribute('aria-pressed', k === cur); b.textContent = data[k].name; b.addEventListener('click', function () { cur = k; show(); }); seg.appendChild(b); });
    function show() {
      var m = data[cur]; $$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-k') === cur); });
      $('#mail-subject').textContent = fill(m.subject); $('#mail-pre').textContent = fill(m.pre); $('#mail-text').textContent = m.text;
      var f = $('#mail-frame'); f.srcdoc = fill(m.html);
    }
    $('#mail-frame').addEventListener('load', function () { try { var h = this.contentDocument.documentElement.scrollHeight; this.style.height = Math.max(420, h) + 'px'; } catch (e) {} });
    $('#mail-copy').addEventListener('click', function () { DS.copiar(data[cur].html, 'HTML del correo'); });
    $('#mail-txt').addEventListener('click', function () { DS.copiar(data[cur].text, 'Texto del correo'); });
    $('#mail-dl').addEventListener('click', function () { download(cur + '.html', data[cur].html, 'text/html;charset=utf-8'); });
    show();
  })();

  /* ---------- Impresión ---------- */
  (function () {
    var fr = $('#pr-frame'); if (!fr) return;
    var doc = '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Constancia de verificación · Averyn</title>' + styles() + '<style>body{margin:0;padding:0;background:#E7EBF3;}@media print{body{background:#fff}}</style></head><body>' +
      '<main class="pr-sheet pr-doc"><header class="pr-head"><div><img src="' + logo + '" alt="Averyn"><h1 class="pr-title" style="margin-top:5mm">Constancia de verificación de identidad</h1><p class="pr-sub">Universidad Horizonte · Sede Central</p></div><div class="pr-folio">Folio<b>AV-2026-000482</b>Emitida el 2 oct 2026, 10:45</div></header>' +
      '<dl class="pr-meta"><div><dt>Persona</dt><dd>Ana Lucía Pérez</dd></div><div><dt>Documento</dt><dd>12345678</dd></div><div><dt>Proceso</dt><dd>Ingreso a campus</dd></div><div><dt>Dispositivo</dt><dd>CAM-001 · Puerta 1</dd></div><div><dt>Fecha y hora</dt><dd>2 oct 2026, 10:42</dd></div><div><dt>Emitida por</dt><dd>Usuario Demo (Administrador)</dd></div></dl>' +
      '<h2 class="pr-h2">Resultado de la verificación</h2><table class="pr-table"><thead><tr><th>Verificación</th><th>Resultado</th><th>Detalle</th></tr></thead><tbody><tr><td>Rostro</td><td class="pr-ok">Aceptada</td><td>Similitud 0.82 · umbral 0.68</td></tr><tr><td>Prueba de vida</td><td class="pr-ok">Superada</td><td>Parpadeo y giro de cabeza</td></tr><tr><td>Documento</td><td class="pr-ok">Coincide</td><td>Con el registro de la institución</td></tr></tbody></table>' +
      '<p class="pr-note"><b>Privacidad.</b> Esta constancia no incluye imágenes, plantillas biométricas ni datos de huella. Solo certifica que la verificación se realizó y su resultado.</p>' +
      '<div class="pr-sign"><div>Firma de quien emite</div><div>Firma de la persona</div><div class="pr-qr">QR de validación</div></div>' +
      '<p class="pr-foot">Documento generado por Averyn. Verifica su autenticidad con el folio en <a href="https://verifica.averyn.example">https://verifica.averyn.example</a>. Datos de ejemplo.</p></main></body></html>';
    fr.srcdoc = doc;
    function scale() { var box = fr.parentNode, s = box.clientWidth / 794; fr.style.transform = 'scale(' + s + ')'; box.style.height = Math.round(1123 * s) + 'px'; }
    scale(); window.addEventListener('resize', scale);
    $('#pr-print').addEventListener('click', function () { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { DS.toast('No se pudo imprimir', 'Usa Ctrl+P desde el documento.', 'warn'); } });
  })();

  /* ---------- Tokens ---------- */
  (function () {
    var el = $('#tokens-data'); if (!el) return;
    var T; try { T = JSON.parse(el.textContent); } catch (e) { return; }
    var raw = JSON.stringify(T, null, 2), TYPE = { color: 'color', chart: 'color', fontFamily: 'fontFamily', fontSize: 'dimension', space: 'dimension', radius: 'dimension', dimension: 'dimension', shadow: 'shadow', transition: 'transition', easing: 'cubicBezier', ratio: 'other' };
    var rows = '';
    Object.keys(T).filter(function (k) { return k.charAt(0) !== '$'; }).forEach(function (g) { rows += '<tr><td><code>' + g + '</code></td><td>' + Object.keys(T[g]).length + '</td><td>' + (TYPE[g] || '') + '</td></tr>'; });
    $('#tk-rows').innerHTML = rows;
    var sample = { color: { blue: T.color.blue, navy: T.color.navy }, space: { '4': T.space['4'] }, shadow: { key: T.shadow.key }, transition: T.transition.fast };
    $('#tk-sample').textContent = JSON.stringify(sample, null, 2);
    var sw = $('#tk-sw'); ['color', 'chart'].forEach(function (g) {
      Object.keys(T[g] || {}).forEach(function (n) {
        var v = T[g][n]['$value']; if (!/^#[0-9A-F]{6,8}$/i.test(v)) return;
        var b = document.createElement('button'); b.type = 'button'; b.style.setProperty('--c', v); b.setAttribute('aria-label', 'Copiar ' + g + ' ' + n + ' ' + v);
        b.innerHTML = '<i></i><span><b>' + (g === 'chart' ? 'viz-' : '') + n + '</b>' + v + '</span>'; b.addEventListener('click', function () { DS.copiar(v, v); }); sw.appendChild(b);
      });
    });
    $('#tk-dl').addEventListener('click', function () { download('tokens.json', raw + '\n', 'application/json;charset=utf-8'); });
    $('#tk-copy').addEventListener('click', function () { DS.copiar(raw, 'tokens.json'); });
  })();
})();
