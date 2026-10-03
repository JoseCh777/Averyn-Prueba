/* Patrones de Averyn: simulaciones interactivas (sin cámara, lector ni datos reales). */
(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* Control segmentado: marca el botón activo y avisa del cambio */
  function seg(el, cb) {
    var api = {
      set: function (s) { $$('button', el).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-s') === s); }); }
    };
    $$('button', el).forEach(function (b) { b.addEventListener('click', function () { api.set(b.getAttribute('data-s')); cb(b.getAttribute('data-s'), true); }); });
    return api;
  }

  /* ---------- Captura facial ---------- */
  (function () {
    var view = $('#face-view'); if (!view) return;
    var msg = $('#face-msg'), btn = $('#face-btn'), meter = $$('#face-meter li'), steps = $$('#face-steps li');
    var LV = [['Sin medir', 'bi-dash-circle'], ['Insuficiente', 'bi-x-circle'], ['Mejorar', 'bi-exclamation-circle'], ['Buena', 'bi-check-circle']];
    var S = {
      searching: { icon: 'bi-search', msg: 'Centra tu rostro en el óvalo.', q: [0, 0, 0], btn: ['Esperando rostro…', true], st: ['now', 'pending', 'pending'] },
      ready: { icon: 'bi-check-circle', msg: 'Perfecto, no te muevas.', q: [3, 3, 3], btn: ['Capturar', false], st: ['now', 'pending', 'pending'] },
      capturing: { icon: 'bi-camera', msg: 'Capturando…', q: [3, 3, 3], btn: ['Capturando…', true], st: ['done', 'now', 'pending'] },
      success: { icon: 'bi-check-circle-fill', msg: 'Rostro registrado.', q: [3, 3, 3], btn: ['Continuar →', false], st: ['done', 'done', 'done'] },
      error: { icon: 'bi-exclamation-triangle', msg: 'No logramos verla bien. Busca más luz y reintenta.', q: [1, 2, 1], btn: ['Reintentar', false], st: ['now', 'pending', 'pending'] },
      noperm: { icon: 'bi-camera-video-off', msg: '', q: [0, 0, 0], btn: ['Permitir cámara', false], st: ['pending', 'pending', 'pending'] }
    };
    var timers = [], cur = 'searching';
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function set(s) {
      cur = s; var d = S[s]; view.setAttribute('data-state', s); seg1.set(s);
      msg.hidden = !d.msg; msg.innerHTML = '<i class="bi ' + d.icon + '" aria-hidden="true"></i><span>' + esc(d.msg) + '</span>';
      meter.forEach(function (li, i) { var l = d.q[i]; li.setAttribute('data-lv', l); li.querySelector('b').innerHTML = '<i class="bi ' + LV[l][1] + '" aria-hidden="true"></i>' + LV[l][0]; });
      steps.forEach(function (li, i) { li.setAttribute('data-s', d.st[i]); li.querySelector('span').textContent = d.st[i] === 'done' ? '✓' : i + 1; });
      btn.textContent = d.btn[0]; btn.disabled = d.btn[1];
    }
    var seg1 = seg($('#face-seg'), function (s) { clear(); set(s); });
    btn.addEventListener('click', function () {
      clear();
      if (cur === 'ready') { set('capturing'); timers.push(setTimeout(function () { set('success'); }, 1700)); }
      else if (cur === 'success') DS.toast('Continuar', 'Aquí avanzaría al siguiente paso del registro.');
      else set('searching');
    });
    $('#face-play').addEventListener('click', function () {
      clear(); set('searching');
      timers.push(setTimeout(function () { set('ready'); }, 1500), setTimeout(function () { set('capturing'); }, 3000), setTimeout(function () { set('success'); }, 4800));
    });
    set('searching');
  })();

  /* ---------- Huella ---------- */
  (function () {
    var svg = $('#fp-svg'); if (!svg) return;
    var box = $('#fp-box'), title = $('#fp-title'), sub = $('#fp-sub'), bar = $('#fp-bar'), pct = $('#fp-pct'), q = $('#fp-q'), btn = $('#fp-btn');
    /* Crestas de una huella tipo "bucle": arcos anidados alrededor de un núcleo, tramo inferior de curvas suaves,
       pequeños cortes en las crestas y una ligera inclinación. Decorativa: no codifica ningún dato real. */
    var NS = 'http://www.w3.org/2000/svg', rings = [];
    (function () {
      var g = document.createElementNS(NS, 'g'); g.setAttribute('transform', 'rotate(-5 100 128)'); svg.appendChild(g);
      var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      var CX = 100, N = 12, parts = [];
      function leg(k) { return 5 + k * 7.3; }
      function yb(k) { return Math.min(214, 118 + k * 9); }
      function breaks(skip) {   /* trazos con 1–2 cortes pequeños, repartidos al azar (pathLength = 1) */
        if (skip || rnd() < .35) return '';
        var g1 = .012 + rnd() * .018, p1 = .3 + rnd() * .35, g2 = .012 + rnd() * .016;
        return (p1).toFixed(3) + ' ' + g1.toFixed(3) + ' ' + (1 - p1 - g1 - g2 - .002).toFixed(3) + ' ' + g2.toFixed(3) + ' .002 0';
      }
      for (var k = 1; k < N; k++) {
        var w = leg(k), base = yb(k), apex = 98 - k * 6.9, c = (4 * apex - base) / 3, sh = -k * .45;
        var xl = CX - w + sh, xr = CX + w * (1 + .008 * k) + sh;
        parts.push({ r: w, d: 'M' + xl.toFixed(1) + ' ' + base + ' C' + xl.toFixed(1) + ' ' + c.toFixed(1) + ' ' + xr.toFixed(1) + ' ' + c.toFixed(1) + ' ' + xr.toFixed(1) + ' ' + (base + (k > 5 ? 0 : 0)), dash: breaks(k < 3) });
      }
      /* núcleo: bucle pequeño y un punto */
      parts.push({ r: 1, d: 'M' + (CX - 4) + ' 120 C' + (CX - 4) + ' 98 ' + (CX + 4) + ' 98 ' + (CX + 4) + ' 120', dash: '' });
      parts.push({ r: 2, d: 'M' + (CX - .2) + ' 113 L' + (CX + .2) + ' 113', dash: '', dot: true });
      /* curvas bajo el núcleo, entre las patas de los bucles interiores */
      [130, 142, 154, 166, 178].forEach(function (y, j2) {
        var kk = 1; while (yb(kk) < y && kk < N) kk++;
        var half = leg(kk) - 5 - j2 * .3, dip = 7 + j2 * 1.4;
        parts.push({ r: half + (y - 118) * .5, d: 'M' + (CX - half).toFixed(1) + ' ' + y + ' C' + (CX - half * .45).toFixed(1) + ' ' + (y + dip) + ' ' + (CX + half * .45).toFixed(1) + ' ' + (y + dip) + ' ' + (CX + half).toFixed(1) + ' ' + y, dash: breaks(false) });
      });
      parts.sort(function (a, b) { return a.r - b.r; });
      parts.forEach(function (pt) {
        var p = document.createElementNS(NS, 'path'); p.setAttribute('d', pt.d); p.setAttribute('class', 'pt-fp__ring' + (pt.dot ? ' pt-fp__dot' : ''));
        p.setAttribute('pathLength', '1'); if (pt.dash) p.setAttribute('stroke-dasharray', pt.dash);
        g.appendChild(p); rings.push(p);
      });
    })();
    var finger = function () { return $('input[name="dedo"]:checked').value; };
    var timer;
    function paint(state, prog, t, s, ql) {
      box.setAttribute('data-state', state);
      var n = Math.round(prog / 100 * rings.length); rings.forEach(function (r, k) { r.classList.toggle('on', k < n); });
      bar.setAttribute('aria-valuenow', prog); bar.firstElementChild.style.setProperty('--p', prog / 100); pct.textContent = prog + '%';
      title.textContent = t; sub.textContent = s; q.textContent = ql;
    }
    var S = {
      wait: function () { paint('wait', 0, 'Coloca el dedo ' + finger().toLowerCase() + ' en el lector.', 'Mantenlo quieto hasta que termine la lectura.', 'Calidad —'); },
      read: function () { paint('read', 55, 'Leyendo… no muevas el dedo.', 'Casi listo.', 'Calidad —'); },
      low: function () { paint('low', 70, 'Presiona un poco más y no muevas el dedo.', 'La lectura salió con poca calidad. Inténtalo de nuevo.', 'Calidad 41/100'); },
      ok: function () { paint('ok', 100, 'Huella registrada.', 'Dedo ' + finger().toLowerCase() + ' registrado. 1 de 2 dedos.', 'Calidad 86/100'); $('input[name="dedo"]:checked').parentNode.classList.add('done'); },
      err: function () { paint('err', 0, 'No pudimos leer la huella.', 'Límpiala y reintenta.', 'Calidad —'); }
    };
    var sg = seg($('#fp-seg'), function (s) { clearInterval(timer); S[s](); });
    $$('input[name="dedo"]').forEach(function (r) { r.addEventListener('change', function () { clearInterval(timer); sg.set('wait'); S.wait(); }); });
    btn.addEventListener('click', function () {
      clearInterval(timer); var p = 0; sg.set('read');
      timer = setInterval(function () {
        p += 10; paint('read', p, 'Leyendo… no muevas el dedo.', 'Casi listo.', 'Calidad —');
        if (p >= 100) { clearInterval(timer); sg.set('ok'); S.ok(); }
      }, 180);
    });
    S.wait();
  })();

  /* ---------- Resultado de verificación ---------- */
  (function () {
    var r = $('#vr-range'); if (!r) return;
    var T = 68;
    function paint() {
      var n = +r.value, s = n / 100, ok = n >= T, diff = Math.abs(s - .68).toFixed(2);
      $('#vr-rv').textContent = s.toFixed(2); $('#vr-n').textContent = s.toFixed(2);
      $('#vr-d').textContent = n === T ? 'Justo en el umbral de 0.68.' : diff + (ok ? ' por encima' : ' por debajo') + ' del umbral de 0.68.';
      var dec = $('#vr-dec'); dec.className = 'pt-dec ' + (ok ? 'pt-dec--ok' : 'pt-dec--bad');
      dec.innerHTML = '<i class="bi ' + (ok ? 'bi-check-circle-fill' : 'bi-x-circle-fill') + '" aria-hidden="true"></i>' + (ok ? 'Aceptada' : 'Rechazada');
      $('#vr-fill').style.width = 'max(0px, calc(' + n + '% - 6px))';
      $('#vr-scale').setAttribute('aria-label', 'Similitud ' + s.toFixed(2) + ' sobre 1. Umbral 0.68. ' + (ok ? 'Por encima.' : 'Por debajo.'));
      $('#vr-reasons').innerHTML =
        '<li><span>Similitud facial</span><b class="' + (ok ? 'ok' : 'bad') + '"><i class="bi ' + (ok ? 'bi-check-circle' : 'bi-x-circle') + '" aria-hidden="true"></i>' + s.toFixed(2) + (ok ? ' ≥ ' : ' < ') + '0.68</b></li>' +
        '<li><span>Prueba de vida</span><b class="ok"><i class="bi bi-check-circle" aria-hidden="true"></i>Superada</b></li>' +
        '<li><span>Calidad de la captura</span><b class="ok"><i class="bi bi-check-circle" aria-hidden="true"></i>Buena</b></li>';
      $('#vr-main').textContent = ok ? 'Continuar →' : 'Intentar de nuevo';
    }
    r.addEventListener('input', paint); paint();
    $('#vr-main').addEventListener('click', function () { DS.toast($('#vr-main').textContent, 'Aquí continuaría o reiniciaría la captura.'); });
    $('#vr-detail').addEventListener('click', function () { DS.toast('Ver detalle', 'Aquí se abriría el detalle de la verificación.'); });
  })();

  /* ---------- Documento / OCR ---------- */
  (function () {
    var host = $('#ocr-fields'); if (!host) return;
    var F = [['N.º de documento', '12345678', 99.1], ['Apellidos', 'PÉREZ GARCÍA', 97.8], ['Nombres', 'MARÍA ELENA', 97.2], ['Fecha de nacimiento', '14/03/1998', 95.4], ['Dirección', 'AV. LOS ALAMOS 245', 88.9], ['Lugar de nacimiento', 'LIMA', 86.3]];
    var st = F.map(function (f) { return { low: f[2] < 90, seen: false, fixed: false }; });
    function conf(i) {
      var el = $('#ocr-c' + i), f = F[i], s = st[i], txt;
      if (s.fixed) { el.className = 'pt-conf fixed'; txt = '<i class="bi bi-pencil" aria-hidden="true"></i>Corregido'; }
      else if (s.low && !s.seen) { el.className = 'pt-conf low'; txt = '<i class="bi bi-exclamation-triangle" aria-hidden="true"></i>Revisar · ' + f[2].toFixed(1) + '%'; }
      else if (s.low) { el.className = 'pt-conf'; txt = '<i class="bi bi-check2" aria-hidden="true"></i>Revisado · ' + f[2].toFixed(1) + '%'; }
      else { el.className = 'pt-conf'; txt = f[2].toFixed(1) + '%'; }
      el.innerHTML = txt;
    }
    function sum() {
      var n = st.filter(function (s) { return s.low && !s.seen && !s.fixed; }).length;
      $('#ocr-sum').textContent = n ? n + (n === 1 ? ' campo con baja confianza. Revísalo' : ' campos con baja confianza. Revísalos') + ' antes de continuar.' : 'Todo revisado. Puedes confirmar los datos.';
      $('#ocr-ok').disabled = n > 0;
    }
    F.forEach(function (f, i) {
      var d = document.createElement('div'); d.className = 'pt-fld';
      d.innerHTML = '<label class="hz-label" for="ocr-i' + i + '">' + esc(f[0]) + '</label><input class="hz-input" id="ocr-i' + i + '" value="' + esc(f[1]) + '" autocomplete="off"><span id="ocr-c' + i + '"></span>';
      host.appendChild(d);
      var inp = d.querySelector('input');
      inp.addEventListener('input', function () { st[i].fixed = inp.value !== f[1]; st[i].seen = true; conf(i); sum(); });
      inp.addEventListener('blur', function () { if (!st[i].seen) { st[i].seen = true; conf(i); sum(); } });
      conf(i);
    });
    sum();
    var sg = seg($('#ocr-seg'), function (s) { doc(s); });
    function doc(s) {
      $('#ocr-doc').setAttribute('data-state', s); sg.set(s);
      $('#ocr-msg').innerHTML = s === 'ok' ? '<i class="bi bi-check-circle" aria-hidden="true"></i><span>Documento detectado.</span>' : '<i class="bi bi-search" aria-hidden="true"></i><span>Alinea el documento dentro del marco.</span>';
    }
    $('#ocr-again').addEventListener('click', function () { doc('searching'); setTimeout(function () { doc('ok'); }, 1200); });
    $('#ocr-ok').addEventListener('click', function () { DS.toast('Datos confirmados', 'Aquí avanzaría al siguiente paso.'); });
  })();

  /* ---------- Tarjetón y comprobante ---------- */
  (function () {
    var root = $('#ballot'); if (!root) return;
    /* Dos variantes: fórmula (2 personas por lista) y una persona por partido (personero, representante, delegado…) */
    var FORM = [['Presidente', 'Nombre Apellido'], ['Vicepresidente', 'Nombre Apellido']], SOLO = [['Candidata a representante', 'Nombre Apellido']];
    var MODES = {
      formula: { title: 'Voto por la fórmula de<br>Presidente y Vicepresidente', sub: 'Elecciones de ejemplo · Periodo 2026 – 2030', rule: 'Marque solo una opción de su preferencia', who: FORM },
      unica: { title: 'Voto por el representante<br>de los estudiantes', sub: 'Elecciones de ejemplo · Un cargo, una persona por lista', rule: 'Marque solo una persona de su preferencia', who: SOLO }
    };
    var OPTS = [];
    function optsFor(m) {
      var w = MODES[m].who;
      return [{ v: '1', n: '1', party: 'Lista Horizonte', who: w }, { v: '2', n: '2', party: 'Lista Cima', who: w }, { v: '3', n: '3', party: 'Lista Raíz', who: w }, { v: 'blanco', n: '', party: 'Voto en blanco', who: null }];
    }
    function box(o, radio) {
      var inner;
      if (o.who) {
        inner = '<span class="tj-opt__n">' + o.n + '</span>' +
          '<span class="tj-opt__ph">' + o.who.map(function () { return '<span class="tj-opt__f"><i class="bi bi-person-fill" aria-hidden="true"></i></span>'; }).join('') + '</span>' +
          '<span class="tj-opt__who">' + o.who.map(function (w) { return '<span>' + esc(w[0]) + '<b>' + esc(w[1]) + '</b></span>'; }).join('') + '</span>' +
          '<span class="tj-opt__logo">Logo · ' + esc(o.party) + '</span>';
      } else {
        inner = '<span class="tj-opt__mid">Voto<br>en blanco</span>';
      }
      var name = o.who ? o.party + ', número ' + o.n + '. ' + o.who.map(function (w) { return w[0] + ' ' + w[1]; }).join('. ') : 'Voto en blanco';
      return '<label class="tj-opt' + (o.who ? (o.who.length === 1 ? ' tj-opt--solo' : '') : ' tj-opt--blank') + '">' + (radio ? '<input type="radio" name="voto" value="' + o.v + '" aria-label="' + esc(name) + '">' : '') + '<span class="tj-opt__ok"><i class="bi bi-check-lg" aria-hidden="true"></i>Marcada</span>' + inner + '</label>';
    }
    var panels = $$('[data-v]', root), steps = $$('.pt-ballot-step li', root), next = $('#ballot-next'), hint = $('#ballot-hint');
    function go(i, focus) {
      panels.forEach(function (p) { p.hidden = +p.getAttribute('data-v') !== i; });
      steps.forEach(function (s, k) { if (k === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
      if (focus) { var h = $('#ballot-h' + (i + 1)); if (h) h.focus(); }
    }
    function render(m) {
      OPTS = optsFor(m); var M = MODES[m];
      $('#tj-title').innerHTML = M.title; $('#tj-sub').textContent = M.sub; $('#tj-rule').textContent = M.rule;
      $('#tj-grid').innerHTML = OPTS.map(function (o) { return box(o, true); }).join('');
      next.disabled = true; hint.textContent = 'Aún no has elegido una opción.';
      $$('input[name="voto"]').forEach(function (r) {
        r.addEventListener('change', function () {
          next.disabled = false; var o = OPTS.filter(function (x) { return x.v === r.value; })[0];
          hint.textContent = 'Marcaste: ' + (o.who ? o.party + ' (número ' + o.n + ')' : 'voto en blanco') + '.';
        });
      });
    }
    seg($('#tj-seg'), function (s) { render(s); });
    render('formula');
    next.addEventListener('click', function () {
      var v = $('input[name="voto"]:checked').value, o = OPTS.filter(function (x) { return x.v === v; })[0];
      $('#ballot-sel').innerHTML = box(o, false); go(1, true);
    });
    $('#ballot-back').addEventListener('click', function () { go(0); });
    $('#ballot-ok').addEventListener('click', function () {
      var a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', g = function (n) { var s = ''; for (var i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)]; return s; };
      $('#ballot-code').textContent = 'AV-' + g(4) + '-' + g(4);
      $('#ballot-time').textContent = new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
      $('#ballot-sel').innerHTML = ''; go(2, true);
    });
    $('#ballot-copy').addEventListener('click', function () { DS.copiar($('#ballot-code').textContent, 'Código de comprobante'); });
    $('#ballot-reset').addEventListener('click', function () { $$('input[name="voto"]').forEach(function (r) { r.checked = false; }); next.disabled = true; hint.textContent = 'Aún no has elegido una opción.'; go(0); });
  })();

  /* ---------- Dispositivos ---------- */
  (function () {
    var ul = $('#devs'); if (!ul) return;
    var D = [
      { id: 'CAM-001', n: 'Cámara de ingreso', loc: 'Puerta 1', st: 'on', last: 'Hace 1 min', ic: 'bi-camera-video' },
      { id: 'LEC-001', n: 'Lector de huella', loc: 'Puerta 1', st: 'on', last: 'Hace 1 min', ic: 'bi-fingerprint' },
      { id: 'CAM-002', n: 'Cámara de oficina', loc: 'Secretaría', st: 'off', last: 'Hace 2 h', ic: 'bi-camera-video-off' },
      { id: 'LEC-002', n: 'Lector de huella', loc: 'Secretaría', st: 'err', last: 'Hace 4 min', ic: 'bi-fingerprint', why: 'Lectura inestable' },
      { id: 'KIOSCO-01', n: 'Kiosco de votación', loc: 'Sala B', st: 'on', last: 'Hace 3 min', ic: 'bi-display' }
    ];
    var CH = { on: ['success', 'Conectado', 'bi-check-circle'], off: ['warning', 'Desconectado', 'bi-plug'], err: ['error', 'Con error', 'bi-x-circle'] };
    function draw() {
      ul.innerHTML = '';
      D.forEach(function (d, i) {
        var li = document.createElement('li'); li.className = 'pt-dev'; li.setAttribute('data-st', d.st);
        var act = d.st === 'off' ? 'Reconectar' : 'Probar';
        li.innerHTML = '<span class="pt-dev__ic"><i class="bi ' + d.ic + '" aria-hidden="true"></i></span><div><b>' + esc(d.id) + ' · ' + esc(d.n) + '</b><small>' + esc(d.loc) + ' · Última señal <span title="Hora de ejemplo">' + esc(d.last) + '</span>' + (d.why ? ' · ' + esc(d.why) : '') + '</small></div><span class="hz-chip hz-chip--' + CH[d.st][0] + '"><i class="bi ' + CH[d.st][2] + '" aria-hidden="true"></i>' + CH[d.st][1] + '</span><button class="pt-dev__act" type="button" aria-label="' + act + ' ' + esc(d.id) + '">' + act + '</button>';
        li.querySelector('button').addEventListener('click', function (e) {
          var b = e.currentTarget;
          if (d.st === 'off') { b.disabled = true; b.textContent = 'Conectando…'; setTimeout(function () { d.st = 'on'; d.last = 'Ahora'; draw(); DS.toast(d.id + ' conectado', 'El dispositivo volvió a responder.'); }, 900); }
          else if (d.st === 'err') DS.toast('Prueba fallida', d.id + ' sigue respondiendo con errores.', 'bad');
          else DS.toast('Prueba correcta', d.id + ' respondió en 0.4 s.');
        });
        ul.appendChild(li);
      });
    }
    draw();
  })();

  /* ---------- Consentimiento ---------- */
  (function () {
    var chk = $('#cons-chk'); if (!chk) return;
    var ok = $('#cons-ok'), msg = $('#cons-msg');
    chk.addEventListener('change', function () { ok.disabled = !chk.checked; msg.textContent = ''; });
    ok.addEventListener('click', function () { msg.textContent = 'Gracias. Continuamos con la captura.'; DS.toast('Consentimiento registrado', 'Se guardaría con la fecha y la versión del texto.'); });
    $('#cons-no').addEventListener('click', function () { msg.textContent = 'Entendido. Sin tu permiso no podemos usar cámara ni huella; puedes volver cuando quieras.'; });
  })();

  /* ---------- Revisión manual ---------- */
  (function () {
    var root = $('#rv'); if (!root) return;
    var CASES = [
      { id: 'REV-0412', who: 'Ana Lucía Pérez', s: 66, dev: 'CAM-001', at: '02/10/2026, 10:42', q: 'Buena', tries: 1 },
      { id: 'REV-0411', who: 'Carlos Mendoza', s: 64, dev: 'LEC-001', at: '02/10/2026, 10:15', q: 'Buena', tries: 2 },
      { id: 'REV-0409', who: 'Valeria Quispe', s: 71, dev: 'CAM-002', at: '02/10/2026, 09:31', q: 'Mejorable', tries: 1 },
      { id: 'REV-0406', who: 'Jorge Salazar', s: 62, dev: 'CAM-001', at: '01/10/2026, 17:48', q: 'Buena', tries: 3 }
    ];
    var cur = 0, list = $('#rv-list'), det = $('#rv-detail'), cnt = $('#rv-count');
    var T = 68;
    function dist(s) { var d = Math.abs(s - T) / 100; return d.toFixed(2) + (s >= T ? ' por encima' : ' por debajo') + ' del umbral'; }
    function paintList() {
      cnt.textContent = CASES.length + (CASES.length === 1 ? ' pendiente' : ' pendientes');
      list.innerHTML = CASES.map(function (c, i) { return '<li><button class="rv__case" type="button" data-i="' + i + '"' + (i === cur ? ' aria-current="true"' : '') + '><b>' + esc(c.id) + ' · ' + esc(c.who) + '</b><small>' + esc(c.at) + '</small><span>' + (c.s / 100).toFixed(2) + ' · ' + dist(c.s) + '</span></button></li>'; }).join('');
    }
    function paintDetail() {
      if (!CASES.length) { det.innerHTML = '<div class="rv__done"><i class="bi bi-check2-circle" aria-hidden="true"></i><b>No hay casos pendientes.</b><span>Buen trabajo.</span></div>'; return; }
      var c = CASES[cur], s = c.s / 100;
      det.innerHTML = '<h3 class="rv__t">' + esc(c.id) + ' · ' + esc(c.who) + '</h3><p class="rv__sub">Verificación facial · ' + esc(c.at) + '</p>' +
        '<div class="pt-score"><b>' + s.toFixed(2) + '</b><span>' + dist(c.s) + ' de 0.68.</span></div>' +
        '<div class="pt-scale" role="img" aria-label="Similitud ' + s.toFixed(2) + ' sobre 1. Umbral 0.68."><div class="pt-scale__fill" style="width:max(0px,calc(' + c.s + '% - 6px))"></div><div class="pt-scale__thr"><em>Umbral 0.68</em></div></div><div class="pt-scale__ends"><span>0</span><span>Similitud</span><span>1</span></div>' +
        '<dl class="rv__meta"><div><dt>Dispositivo</dt><dd>' + esc(c.dev) + '</dd></div><div><dt>Calidad</dt><dd>' + esc(c.q) + '</dd></div><div><dt>Prueba de vida</dt><dd>Superada</dd></div><div><dt>Intentos previos</dt><dd>' + c.tries + '</dd></div></dl>' +
        '<fieldset class="rv__dec"><legend>Decisión</legend><label class="rv__opt"><input type="radio" name="rv-d" value="ok"><span>Aprobar<small>La identidad se confirma.</small></span></label><label class="rv__opt"><input type="radio" name="rv-d" value="no"><span>Rechazar<small>La identidad no se confirma.</small></span></label></fieldset>' +
        '<div class="hz-field"><label class="hz-label" for="rv-m">Motivo (obligatorio)</label><select class="hz-select" id="rv-m" aria-describedby="rv-mh"><option value="">Elige un motivo…</option><option>Calidad de captura insuficiente</option><option>Coincide con el documento presentado</option><option>Diferencia visible con el registro</option><option>Otro (explicar en la nota)</option></select><span class="hz-help" id="rv-mh">Queda en la bitácora junto con tu nombre y la hora.</span></div>' +
        '<div class="hz-field"><label class="hz-label" for="rv-n">Nota (opcional)</label><textarea class="hz-textarea" id="rv-n" rows="2"></textarea></div>' +
        '<div class="pt-actions"><button class="hz-btn hz-btn--primary" type="button" id="rv-go" disabled>Registrar decisión</button></div>' +
        '<p class="rv__audit"><i class="bi bi-journal-check" aria-hidden="true"></i> Esta decisión se registra con tu nombre, la fecha y el motivo.</p>';
      var go = $('#rv-go'), upd = function () { go.disabled = !($('input[name="rv-d"]:checked') && $('#rv-m').value); };
      $$('input[name="rv-d"]', det).forEach(function (r) { r.addEventListener('change', upd); }); $('#rv-m').addEventListener('change', upd);
      go.addEventListener('click', function () {
        var dec = $('input[name="rv-d"]:checked').value === 'ok' ? 'aprobada' : 'rechazada', id = c.id;
        CASES.splice(cur, 1); cur = Math.min(cur, CASES.length - 1);
        DS.toast('Decisión registrada', id + ' ' + dec + '. ' + (CASES.length ? 'Quedan ' + CASES.length + (CASES.length === 1 ? ' caso.' : ' casos.') : 'No quedan casos pendientes.'));
        paintList(); paintDetail(); if (CASES.length) det.focus(); else list.innerHTML = '';
      });
    }
    list.addEventListener('click', function (e) { var b = e.target.closest('.rv__case'); if (!b) return; cur = +b.getAttribute('data-i'); paintList(); paintDetail(); det.focus(); });
    paintList(); paintDetail();
  })();
})();
