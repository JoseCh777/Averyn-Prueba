/* Componentes que faltaban: demos interactivas con teclado completo (datos ficticios). */
(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var norm = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };

  /* ---------- Selector de fechas ---------- */
  (function () {
    var btn = $('#dp-btn'); if (!btn) return;
    var pop = $('#dp-pop'), grid = $('#dp-grid'), mon = $('#dp-month'), sum = $('#dp-sum'), apply = $('#dp-apply');
    var TODAY = new Date(2026, 9, 2), DAY = 864e5;
    var fmtD = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' });
    var fmtY = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
    var fmtM = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' });
    var fmtL = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    var clean = function (s) { return s.replace(/\./g, ''); };
    var day0 = function (d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
    var add = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
    var same = function (a, b) { return a && b && a.getTime() === b.getTime(); };
    var view = new Date(2026, 9, 1), focus = TODAY, a = add(TODAY, -29), b = TODAY, committed = { a: a, b: b, label: 'Últimos 30 días' }, picking = false;
    var PRE = [['Hoy', 0], ['Últimos 7 días', 6], ['Últimos 30 días', 29], ['Este trimestre', 'q'], ['Este año', 'y']];
    var presets = $('#dp-presets');
    PRE.forEach(function (p) {
      var el = document.createElement('button'); el.type = 'button'; el.textContent = p[0]; el.setAttribute('aria-pressed', p[0] === 'Últimos 30 días');
      el.addEventListener('click', function () {
        var s = p[1] === 'q' ? new Date(2026, 6, 1) : p[1] === 'y' ? new Date(2026, 0, 1) : add(TODAY, -p[1]);
        a = s; b = TODAY; commit(p[0]); close(true);
      });
      presets.appendChild(el);
    });
    function label() { return a && b ? (same(a, b) ? fmtY.format(a) : clean(fmtD.format(a)) + ' – ' + clean(fmtY.format(b))) : ''; }
    function commit(name) {
      committed = { a: a, b: b, label: name }; $('#dp-label').textContent = name || label();
      $$('button', presets).forEach(function (x) { x.setAttribute('aria-pressed', x.textContent === name); });
      DS.toast('Periodo aplicado', label());
    }
    function draw() {
      var mt = fmtM.format(view); mon.textContent = mt.charAt(0).toUpperCase() + mt.slice(1).replace(' de ', ' de ');
      var first = new Date(view.getFullYear(), view.getMonth(), 1), off = (first.getDay() + 6) % 7, html = '';
      ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(function (w, i) { html += '<div class="dp__wd" role="columnheader"><abbr title="' + ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'][i] + '">' + w + '</abbr></div>'; });
      for (var i = 0; i < 42; i++) {
        var d = add(first, i - off), out = d.getMonth() !== view.getMonth(), fut = d > TODAY;
        var lo = a && b ? (a < b ? a : b) : a, hi = a && b ? (a < b ? b : a) : a, inr = lo && hi && d >= lo && d <= hi;
        var cls = 'dp__day' + (out ? ' is-out' : '') + (inr ? ' is-in' : '') + (same(d, lo) || same(d, hi) ? ' is-edge' : '') + (same(d, lo) ? ' is-start' : '') + (same(d, hi) ? ' is-end' : '') + (same(d, TODAY) ? ' is-today' : '');
        html += '<button type="button" role="gridcell" class="' + cls + '" data-t="' + d.getTime() + '" tabindex="' + (same(d, focus) ? 0 : -1) + '"' + (fut ? ' aria-disabled="true"' : '') + (inr ? ' aria-selected="true"' : '') + ' aria-label="' + fmtL.format(d) + (same(d, TODAY) ? ', hoy' : '') + '">' + d.getDate() + '</button>';
      }
      grid.innerHTML = html;
      sum.textContent = picking ? 'Elige la fecha final.' : (a && b ? label() : 'Elige la fecha inicial.');
      apply.disabled = !(a && b) || picking;
    }
    function pick(d) {
      if (d > TODAY) return;
      if (!picking) { a = d; b = null; picking = true; }
      else { b = d; if (b < a) { var t = a; a = b; b = t; } picking = false; }
      focus = d; draw(); refocus();
    }
    function refocus() { var e = grid.querySelector('[tabindex="0"]'); if (e) e.focus(); }
    function go(d) { if (d > TODAY) d = TODAY; focus = d; if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1); draw(); refocus(); }
    grid.addEventListener('click', function (e) { var c = e.target.closest('.dp__day'); if (c) pick(new Date(+c.getAttribute('data-t'))); });
    grid.addEventListener('keydown', function (e) {
      var d = focus, k = e.key;
      if (k === 'ArrowRight') d = add(d, 1); else if (k === 'ArrowLeft') d = add(d, -1); else if (k === 'ArrowDown') d = add(d, 7); else if (k === 'ArrowUp') d = add(d, -7);
      else if (k === 'Home') d = add(d, -((d.getDay() + 6) % 7)); else if (k === 'End') d = add(d, 6 - ((d.getDay() + 6) % 7));
      else if (k === 'PageUp') d = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()); else if (k === 'PageDown') d = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
      else return;
      e.preventDefault(); go(d);
    });
    $('#dp-prev').addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); focus = view; draw(); });
    $('#dp-next').addEventListener('click', function () { var n = new Date(view.getFullYear(), view.getMonth() + 1, 1); if (n <= TODAY) { view = n; focus = n; draw(); } });
    function open() { a = committed.a; b = committed.b; picking = false; view = new Date(b.getFullYear(), b.getMonth(), 1); focus = b; pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); draw(); refocus(); }
    function close(back) { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (back) btn.focus(); }
    btn.addEventListener('click', function () { pop.hidden ? open() : close(); });
    apply.addEventListener('click', function () { commit(''); close(true); });
    $('#dp-cancel').addEventListener('click', function () { close(true); });
    pop.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); close(true); } });
  })();

  /* ---------- Menú de acciones ---------- */
  (function () {
    var btn = $('#am-btn'); if (!btn) return;
    var menu = $('#am-menu'), items = $$('[role="menuitem"]', menu);
    function open(i) { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); items[i || 0].focus(); }
    function close(back) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (back) btn.focus(); }
    btn.addEventListener('click', function () { menu.hidden ? open(0) : close(); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); open(0); } else if (e.key === 'ArrowUp') { e.preventDefault(); open(items.length - 1); } });
    menu.addEventListener('keydown', function (e) {
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') close();
    });
    items.forEach(function (it) { it.addEventListener('click', function () { close(true); DS.toast(it.textContent.trim(), it.classList.contains('is-danger') ? 'Aquí se pediría confirmar antes de eliminar.' : 'Aquí se ejecutaría la acción.'); }); });
    document.addEventListener('click', function (e) { if (!menu.hidden && !$('#am').contains(e.target)) close(); });
  })();

  /* ---------- Combobox ---------- */
  (function () {
    var inp = $('#cb-in'); if (!inp) return;
    var list = $('#cb-list'), live = $('#cb-live');
    var D = [['Universidad Horizonte', 'Sede Central · Lima'], ['Universidad Horizonte', 'Sede Norte · Trujillo'], ['Instituto Cima', 'Campus Arequipa'], ['Instituto Raíz', 'Sede Cusco'], ['Colegio Albor', 'Lima Norte'], ['Colegio Aurora', 'Piura'], ['Municipalidad de Miraflores', 'Lima'], ['Centro Técnico Brújula', 'Huancayo']];
    var act = -1, shown = [];
    function hi(t, q) { if (!q) return esc(t); var i = norm(t).indexOf(norm(q)); return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length)); }
    function render() {
      var q = inp.value.trim();
      shown = D.filter(function (d) { return !q || norm(d[0] + ' ' + d[1]).indexOf(norm(q)) >= 0; });
      list.innerHTML = shown.length ? shown.map(function (d, i) { return '<li class="cb__opt" role="option" id="cb-o' + i + '" aria-selected="false" data-i="' + i + '"><span>' + hi(d[0], q) + '</span><small>' + esc(d[1]) + '</small></li>'; }).join('') : '<li class="cb__none" role="presentation">Sin resultados para «' + esc(q) + '».</li>';
      list.hidden = false; inp.setAttribute('aria-expanded', 'true'); act = -1; inp.removeAttribute('aria-activedescendant');
      live.textContent = shown.length ? shown.length + (shown.length === 1 ? ' resultado disponible' : ' resultados disponibles') + '.' : 'Sin resultados.';
    }
    function setAct(i) {
      if (!shown.length) return; act = (i + shown.length) % shown.length;
      $$('.cb__opt', list).forEach(function (o, k) { o.setAttribute('aria-selected', k === act); });
      var o = $('#cb-o' + act); inp.setAttribute('aria-activedescendant', o.id); o.scrollIntoView({ block: 'nearest' });
    }
    function choose(i) { var d = shown[i]; if (!d) return; inp.value = d[0] + ' · ' + d[1]; close(); DS.toast('Institución elegida', inp.value); }
    function close() { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); act = -1; }
    inp.addEventListener('input', render);
    inp.addEventListener('focus', function () { if (list.hidden) render(); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) render(); setAct(act + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (list.hidden) render(); setAct(act - 1); }
      else if (e.key === 'Enter') { if (!list.hidden && act >= 0) { e.preventDefault(); choose(act); } }
      else if (e.key === 'Escape') { if (!list.hidden) { e.preventDefault(); close(); } else inp.value = ''; }
    });
    list.addEventListener('mousedown', function (e) { var o = e.target.closest('.cb__opt'); if (o) { e.preventDefault(); choose(+o.getAttribute('data-i')); } });
    document.addEventListener('click', function (e) { if (!$('#cb').contains(e.target)) close(); });
  })();

  /* ---------- Acordeón ---------- */
  (function () {
    var root = $('#ac'); if (!root) return;
    var btns = $$('.ac__btn', root), multi = $('#ac-multi');
    function set(b, open) { b.setAttribute('aria-expanded', open); $('#' + b.getAttribute('aria-controls')).hidden = !open; }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') !== 'true';
        if (open && !multi.checked) btns.forEach(function (o) { if (o !== b) set(o, false); });
        set(b, open);
      });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : null;
        if (n === null) return; e.preventDefault(); btns[(n + btns.length) % btns.length].focus();
      });
    });
    multi.addEventListener('change', function () { if (!multi.checked) { var first = true; btns.forEach(function (b) { if (b.getAttribute('aria-expanded') === 'true') { if (first) first = false; else set(b, false); } }); } });
  })();

  /* ---------- Stepper ---------- */
  (function () {
    var list = $('#st-list'); if (!list) return;
    var N = ['Datos', 'Documento', 'Biometría', 'Confirmar'], cur = 0, done = -1;
    var panels = $$('#st-panels .st__panel'), back = $('#st-back'), next = $('#st-next'), cnt = $('#st-count');
    function paint(focus) {
      list.innerHTML = N.map(function (n, i) {
        var s = i < cur ? 'done' : i === cur ? 'now' : 'pending';
        return '<li class="st__li" data-s="' + s + '"' + (i === cur ? ' aria-current="step"' : '') + '><span class="st__n" aria-hidden="true">' + (s === 'done' ? '✓' : i + 1) + '</span><span class="st__t">' + n + (s === 'done' ? '<span class="sr-only"> (completado)</span>' : '') + '</span></li>';
      }).join('');
      panels.forEach(function (p, i) { p.hidden = i !== cur; });
      cnt.textContent = 'Paso ' + (cur + 1) + ' de ' + N.length;
      back.disabled = cur === 0; next.textContent = cur === N.length - 1 ? 'Guardar' : 'Siguiente →';
      if (focus) panels[cur].querySelector('h3').focus();
    }
    next.addEventListener('click', function () {
      if (cur === 0) {
        var inp = $('#st-name'), err = $('#st-err');
        if (!inp.value.trim()) { inp.setAttribute('aria-invalid', 'true'); err.hidden = false; inp.focus(); return; }
        inp.removeAttribute('aria-invalid'); err.hidden = true; $('#st-sum').textContent = inp.value.trim();
      }
      if (cur === N.length - 1) { DS.toast('Persona registrada', 'Aquí se guardaría el registro.'); cur = 0; $('#st-name').value = ''; paint(true); return; }
      cur++; paint(true);
    });
    back.addEventListener('click', function () { if (cur > 0) { cur--; paint(true); } });
    paint(false);
  })();

  /* ---------- Popover ---------- */
  (function () {
    var btn = $('#po-btn'); if (!btn) return;
    var pop = $('#po-pop');
    function close(back) { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (back) btn.focus(); }
    btn.addEventListener('click', function () { pop.hidden = !pop.hidden; btn.setAttribute('aria-expanded', !pop.hidden); });
    $('#po').addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) { e.preventDefault(); close(true); } });
    document.addEventListener('click', function (e) { if (!pop.hidden && !$('#po').contains(e.target)) close(); });
  })();

  /* ---------- Drawer ---------- */
  (function () {
    var dlg = $('#dr'); if (!dlg) return;
    function open() { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    $('#dr-open').addEventListener('click', open);
    $('#dr-x').addEventListener('click', function () { dlg.close(); });
    $('#dr-close').addEventListener('click', function () { dlg.close(); });
    $('#dr-edit').addEventListener('click', function () { DS.toast('Editar datos', 'Aquí se abriría el formulario de edición.'); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  })();

  /* ---------- Paleta de comandos ---------- */
  (function () {
    var dlg = $('#cmd'); if (!dlg) return;
    var inp = $('#cmd-in'), list = $('#cmd-list'), live = $('#cmd-live'), opener = $('#cmd-open');
    var C = [
      ['Ir a', 'bi-grid-1x2', 'Panel', ''], ['Ir a', 'bi-people', 'Personas', ''], ['Ir a', 'bi-file-earmark-text', 'Documentos', ''], ['Ir a', 'bi-fingerprint', 'Biometría', ''],
      ['Ir a', 'bi-door-open', 'Accesos', 'soon'], ['Ir a', 'bi-clipboard-data', 'Reportes y auditoría', 'soon'],
      ['Acciones', 'bi-person-plus', 'Registrar persona', ''], ['Acciones', 'bi-shield-check', 'Verificar identidad', ''], ['Acciones', 'bi-box-arrow-right', 'Cerrar sesión', '']
    ];
    var shown = [], act = 0;
    function render() {
      var q = norm(inp.value.trim()), html = '', last = '';
      shown = C.filter(function (c) { return !q || norm(c[2]).indexOf(q) >= 0; });
      shown.forEach(function (c, i) {
        if (c[0] !== last) { html += '<li class="cmd__grp" role="presentation">' + c[0] + '</li>'; last = c[0]; }
        html += '<li class="cmd__opt" role="option" id="cmd-o' + i + '" data-i="' + i + '" aria-selected="false"' + (c[3] ? ' aria-disabled="true"' : '') + '><i class="bi ' + c[1] + '" aria-hidden="true"></i><span>' + esc(c[2]) + '</span>' + (c[3] ? '<span class="hz-tag">Próximamente</span>' : '') + '</li>';
      });
      list.innerHTML = shown.length ? html : '<li class="cmd__none" role="presentation">Nada coincide con «' + esc(inp.value.trim()) + '».</li>';
      act = shown.findIndex(function (c) { return !c[3]; }); setAct(act);
      live.textContent = shown.length ? shown.length + ' resultados.' : 'Sin resultados.';
    }
    function setAct(i) {
      act = i; $$('.cmd__opt', list).forEach(function (o, k) { o.setAttribute('aria-selected', k === i); });
      var o = $('#cmd-o' + i); if (o) { inp.setAttribute('aria-activedescendant', o.id); o.scrollIntoView({ block: 'nearest' }); } else inp.removeAttribute('aria-activedescendant');
    }
    function move(d) { if (!shown.length) return; var i = act; do { i = (i + d + shown.length) % shown.length; } while (shown[i][3] && i !== act); setAct(i); }
    function run(i) { var c = shown[i]; if (!c || c[3]) return; dlg.close(); DS.toast(c[2], 'Aquí se abriría «' + c[2] + '».'); }
    function open() { inp.value = ''; if (dlg.showModal) dlg.showModal(); render(); inp.focus(); }
    opener.addEventListener('click', open);
    document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (dlg.open) dlg.close(); else open(); } });
    inp.addEventListener('input', render);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); } else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); run(act); }
    });
    list.addEventListener('click', function (e) { var o = e.target.closest('.cmd__opt'); if (o) run(+o.getAttribute('data-i')); });
    list.addEventListener('pointermove', function (e) { var o = e.target.closest('.cmd__opt'); if (o && !o.getAttribute('aria-disabled')) setAct(+o.getAttribute('data-i')); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  })();

  /* ---------- Tabla avanzada ---------- */
  (function () {
    var body = $('#ta-body'); if (!body) return;
    var P = [
      ['Ana Lucía Pérez', '12345678', 'Estudiante', 'on', '2026-10-02T10:42'], ['Carlos Mendoza', '23456789', 'Docente', 'on', '2026-10-02T09:15'], ['Lucía Ramos', '34567890', 'Estudiante', 'off', '2026-09-28T17:30'],
      ['Diego Torres', '45678901', 'Empleado', 'on', '2026-10-01T08:05'], ['Valeria Quispe', '56789012', 'Estudiante', 'pend', '2026-09-30T12:20'], ['Jorge Salazar', '67890123', 'Docente', 'on', '2026-10-02T07:50'],
      ['Mariana Cruz', '78901234', 'Estudiante', 'on', '2026-10-01T15:40'], ['Andrés Vega', '89012345', 'Empleado', 'off', '2026-09-20T11:10'], ['Camila Rojas', '90123456', 'Estudiante', 'on', '2026-10-02T10:01'],
      ['Renzo Paredes', '11223344', 'Docente', 'pend', '2026-09-29T16:45'], ['Sofía Medina', '22334455', 'Estudiante', 'on', '2026-10-01T09:30'], ['Hugo Castillo', '33445566', 'Empleado', 'on', '2026-09-30T18:05']
    ].map(function (p, i) { return { id: i, n: p[0], d: p[1], r: p[2], s: p[3], a: p[4] }; });
    var ST = { on: ['success', 'Activa'], off: ['neutral', 'Inactiva'], pend: ['warning', 'Pendiente'] };
    var fmt = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
    var sort = { k: 'n', dir: 1 }, page = 1, per = 5, sel = {}, q = '';
    var all = $('#ta-all'), selBar = $('#ta-sel'), bar = $('#ta-bar');
    function rows() {
      var r = P.filter(function (p) { return !q || norm(p.n + ' ' + p.d).indexOf(norm(q)) >= 0; });
      r.sort(function (a, b) { var x = a[sort.k], y = b[sort.k]; return (x < y ? -1 : x > y ? 1 : 0) * sort.dir; });
      return r;
    }
    function draw() {
      var r = rows(), pages = Math.max(1, Math.ceil(r.length / per)); if (page > pages) page = pages;
      var vis = r.slice((page - 1) * per, page * per);
      body.innerHTML = vis.length ? vis.map(function (p) {
        var s = !!sel[p.id];
        return '<tr aria-selected="' + s + '"><td class="ta__ck"><label><input type="checkbox" data-id="' + p.id + '"' + (s ? ' checked' : '') + ' aria-label="Seleccionar a ' + esc(p.n) + '"></label></td><td class="ta__who"><b>' + esc(p.n) + '</b><small>' + p.r + '</small></td><td class="ta__mono">' + p.d + '</td><td><span class="hz-chip hz-chip--' + ST[p.s][0] + '">' + ST[p.s][1] + '</span></td><td class="ta__mono">' + fmt.format(new Date(p.a)).replace(/\./g, '') + '</td></tr>';
      }).join('') : '<tr><td colspan="5" class="ta__empty">Sin resultados para «' + esc(q) + '». Prueba con otro nombre o <button type="button" class="hz-btn hz-btn--text" id="ta-reset" style="min-height:44px;display:inline">limpia la búsqueda</button>.</td></tr>';
      var rst = $('#ta-reset'); if (rst) rst.addEventListener('click', function () { $('#ta-q').value = ''; q = ''; page = 1; draw(); });
      $('#ta-info').textContent = r.length ? 'Mostrando ' + ((page - 1) * per + 1) + '–' + ((page - 1) * per + vis.length) + ' de ' + r.length : '0 resultados';
      var pg = $('#ta-pg'), h = '<button type="button" data-p="' + (page - 1) + '" aria-label="Página anterior"' + (page === 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left" aria-hidden="true"></i></button>';
      for (var i = 1; i <= pages; i++) h += '<button type="button" data-p="' + i + '"' + (i === page ? ' aria-current="page"' : '') + ' aria-label="Página ' + i + '">' + i + '</button>';
      pg.innerHTML = h + '<button type="button" data-p="' + (page + 1) + '" aria-label="Página siguiente"' + (page === pages ? ' disabled' : '') + '><i class="bi bi-chevron-right" aria-hidden="true"></i></button>';
      var n = vis.filter(function (p) { return sel[p.id]; }).length; all.checked = vis.length > 0 && n === vis.length; all.indeterminate = n > 0 && n < vis.length;
      var total = Object.keys(sel).filter(function (k) { return sel[k]; }).length;
      selBar.hidden = !total; bar.hidden = !!total; $('#ta-selc').textContent = total + (total === 1 ? ' persona seleccionada' : ' personas seleccionadas');
      $$('th[aria-sort]').forEach(function (th) { var k = th.querySelector('.ta__sort').getAttribute('data-k'); th.setAttribute('aria-sort', k === sort.k ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'); th.querySelector('i').className = 'bi ' + (k === sort.k ? (sort.dir > 0 ? 'bi-arrow-up' : 'bi-arrow-down') : 'bi-arrow-down-up'); });
    }
    $$('.ta__sort').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-k'); sort = { k: k, dir: sort.k === k ? -sort.dir : 1 }; page = 1; draw(); }); });
    body.addEventListener('change', function (e) { var c = e.target.closest('input[data-id]'); if (c) { sel[c.getAttribute('data-id')] = c.checked; draw(); var again = $('input[data-id="' + c.getAttribute('data-id') + '"]'); if (again) again.focus(); } });
    all.addEventListener('change', function () { $$('input[data-id]', body).forEach(function (c) { sel[c.getAttribute('data-id')] = all.checked; }); draw(); all.focus(); });
    $('#ta-pg').addEventListener('click', function (e) { var b = e.target.closest('button[data-p]'); if (b && !b.disabled) { page = +b.getAttribute('data-p'); draw(); var cur = $('#ta-pg [aria-current]'); if (cur) cur.focus(); } });
    $('#ta-q').addEventListener('input', function (e) { q = e.target.value.trim(); page = 1; draw(); });
    $$('#ta-dens button').forEach(function (b) { b.addEventListener('click', function () { $$('#ta-dens button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); $('#ta').classList.toggle('ta--compact', b.getAttribute('data-d') === 'compact'); }); });
    $('#ta-clr').addEventListener('click', function () { sel = {}; draw(); $('#ta-q').focus(); });
    $('#ta-exp').addEventListener('click', function () { DS.toast('Exportar', 'Se exportarían las filas seleccionadas.'); });
    $('#ta-off').addEventListener('click', function () { DS.toast('Desactivar', 'Aquí se pediría confirmación antes de desactivar.'); });
    draw();
  })();
})();
