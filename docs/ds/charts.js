/* ==========================================================================
   Biblioteca de gráficos Horizonte — SVG/HTML puro, sin dependencias.
   Cada gráfico es una función (host, config) que dibuja a partir de un modelo de datos JSON
   (el mismo que se muestra en la documentación). Todos comparten: tooltip, navegación con
   flechas, vista en tabla, menú de tarjeta y estados. Datos de ejemplo, deterministas.
   ========================================================================== */
(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;
  var NS = 'http://www.w3.org/2000/svg';
  var uid = 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- utilidades ---------- */
  function S(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function H(tag, cls, html, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  }
  var nf0 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  var N = function (n) { return nf0.format(n); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var css = function (v) { return 'var(' + v + ')'; };

  function niceTicks(max) {
    var raw = max / 4, mag = Math.pow(10, Math.floor(Math.log10(raw))), step = mag;
    [1, 2, 2.5, 5, 10].some(function (m) { step = m * mag; return step >= raw; });
    var out = [], top = Math.ceil(max / step) * step;
    for (var v = 0; v <= top + 1e-9; v += step) out.push(v);
    return out;
  }

  /* Curva monótona (Fritsch–Carlson): suave y sin sobrepasar los datos */
  function curve(p) {
    var n = p.length, i, d;
    if (n < 2) return '';
    var dx = [], m = [], t = [];
    for (i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
    t[0] = m[0]; t[n - 1] = m[n - 2];
    for (i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (i = 0; i < n - 1; i++) {
      if (m[i] === 0) { t[i] = t[i + 1] = 0; continue; }
      var a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
      if (s > 9) { var k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
    }
    d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
    for (i = 0; i < n - 1; i++) {
      d += ' C' + (p[i][0] + dx[i] / 3).toFixed(1) + ' ' + (p[i][1] + t[i] * dx[i] / 3).toFixed(1) + ' ' +
        (p[i + 1][0] - dx[i] / 3).toFixed(1) + ' ' + (p[i + 1][1] - t[i + 1] * dx[i] / 3).toFixed(1) + ' ' +
        p[i + 1][0].toFixed(1) + ' ' + p[i + 1][1].toFixed(1);
    }
    return d;
  }

  /* Datos deterministas */
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  var END = Date.UTC(2026, 9, 1);
  var fShort = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  var fLong = new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  var iso = function (t) { return new Date(t).toISOString().slice(0, 10); };
  function trend(n, seed, base, shift) {
    var r = rng(seed), out = [];
    for (var i = 0; i < n; i++) {
      var t = END - (n - 1 - i + (shift || 0)) * 864e5, dow = new Date(t).getUTCDay();
      var v = Math.round(base * (1 + i * 0.0035) * (dow === 0 || dow === 6 ? 0.86 : 1) * (0.94 + r() * 0.12));
      out.push({ t: iso(t), label: fShort.format(t).replace('.', ''), long: fLong.format(t).replace(/\./g, ''), v: v });
    }
    return out;
  }
  function sum(a) { return a.reduce(function (s, p) { return s + (p.v != null ? p.v : p); }, 0); }
  function pct(a, b) { return (a / b - 1) * 100; }
  function sgn(n, f) { return (n > 0 ? '+' : n < 0 ? '−' : '') + (f || nf1).format(Math.abs(n)); }

  /* ---------- tooltip + navegación con teclado ---------- */
  var tip = H('div', 'vz-tip', '', document.body); tip.setAttribute('role', 'tooltip');
  var live = H('div', 'sr-only', '', document.body); live.setAttribute('aria-live', 'polite');
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.classList.add('is-on');
    var r = tip.getBoundingClientRect();
    var left = Math.min(Math.max(8, x - r.width / 2), window.innerWidth - r.width - 8);
    var top = y - r.height - 12; if (top < 8) top = y + 18;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function hideTip() { tip.classList.remove('is-on'); }
  window.addEventListener('scroll', hideTip, { passive: true });
  var tipHtml = function (title, rows) {
    return '<span class="vz-tip__t">' + esc(title) + '</span>' + rows.map(function (r) {
      return '<div class="vz-tip__r"><span>' + (r.c ? '<i style="--c:' + r.c + '"></i>' : '') + esc(r.k) + '</span><b>' + esc(r.v) + '</b></div>';
    }).join('');
  };

  /* items: [{html, say, at:()=>({x,y})}] */
  function inspector(host, label, items, o) {
    o = o || {};
    var cur = -1;
    function go(k) {
      if (k < 0 || k >= items.length) return;
      cur = k; var p = items[k].at(); showTip(items[k].html, p.x, p.y); live.textContent = items[k].say;
      if (o.on) o.on(k);
    }
    function off() { cur = -1; hideTip(); if (o.on) o.on(-1); }
    host.setAttribute('tabindex', '0'); host.setAttribute('role', 'group');
    host.setAttribute('aria-roledescription', 'gráfico interactivo');
    host.setAttribute('aria-label', label + '. Usa las flechas para recorrer los valores y Escape para salir.');
    host.addEventListener('keydown', function (e) {
      var k = cur, c = o.cols || 1;
      switch (e.key) {
        case 'ArrowRight': k = cur < 0 ? 0 : Math.min(items.length - 1, cur + 1); break;
        case 'ArrowLeft': k = cur < 0 ? 0 : Math.max(0, cur - 1); break;
        case 'ArrowDown': k = cur < 0 ? 0 : Math.min(items.length - 1, cur + (o.cols ? c : 1)); break;
        case 'ArrowUp': k = cur < 0 ? 0 : Math.max(0, cur - (o.cols ? c : 1)); break;
        case 'Home': k = 0; break;
        case 'End': k = items.length - 1; break;
        case 'Escape': off(); return;
        default: return;
      }
      e.preventDefault(); go(k);
    });
    host.addEventListener('focus', function () { if (cur < 0 && host.matches(':focus-visible')) go(0); });
    host.addEventListener('blur', off);
    return { go: go, off: off };
  }

  /* ==========================================================================
     GRÁFICOS
     ========================================================================== */

  /* ---- Área / línea suave (tendencia) ---- */
  function area(host, cfg) {
    host.innerHTML = '';
    var id = 'g' + (++uid), W = Math.max(260, host.clientWidth), Ht = cfg.height || 240;
    var m = { l: 42, r: 14, t: 10, b: 28 }, pw = W - m.l - m.r, ph = Ht - m.t - m.b;
    var all = []; cfg.series.forEach(function (s) { s.points.forEach(function (p) { all.push(p.v); }); });
    var ticks = niceTicks(Math.max.apply(null, all)), top = ticks[ticks.length - 1];
    var n = cfg.series[0].points.length;
    var X = function (i) { return m.l + (n === 1 ? pw / 2 : i * pw / (n - 1)); };
    var Y = function (v) { return m.t + ph - (v / top) * ph; };

    if (cfg.series.length > 1) {
      var lg = H('ul', 'vz-legend', '', host);
      cfg.series.forEach(function (s) { H('li', '', '<i class="is-line' + (s.dash ? ' is-dash' : '') + '" style="--c:' + s.color + '"></i>' + esc(s.name), lg); });
    }
    var wrap = H('div', 'vz', '', host);
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + Ht, width: W, height: Ht, 'aria-hidden': 'true' }, wrap);
    var defs = S('defs', {}, svg), lgd = S('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    S('stop', { offset: '0%', 'stop-color': cfg.series[0].color, 'stop-opacity': .22 }, lgd);
    S('stop', { offset: '100%', 'stop-color': cfg.series[0].color, 'stop-opacity': 0 }, lgd);

    var g = S('g', { class: 'vz-grid' }, svg);
    ticks.forEach(function (v, k) {
      S('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: k === 0 ? 'vz-base' : null }, k === 0 ? S('g', { class: 'vz-base' }, svg) : g);
      var t = S('text', { x: m.l - 10, y: Y(v) + 4, 'text-anchor': 'end', class: 'vz-tick' }, svg); t.textContent = N(v);
    });
    var step = Math.max(1, Math.ceil(n / Math.floor(pw / 74)));
    cfg.series[0].points.forEach(function (p, i) {
      if ((n - 1 - i) % step) return;
      var t = S('text', { x: X(i), y: Ht - 6, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle', class: 'vz-tick' }, svg); t.textContent = p.label;
    });
    /* orden de dibujo: referencia primero, serie principal encima */
    cfg.series.slice().reverse().forEach(function (s, k, arr) {
      var pts = s.points.map(function (p, i) { return [X(i), Y(p.v)]; }), d = curve(pts);
      if (s === cfg.series[0]) {
        S('path', { d: d + ' L' + X(n - 1) + ' ' + Y(0) + ' L' + X(0) + ' ' + Y(0) + ' Z', fill: 'url(#' + id + ')' }, svg);
      }
      S('path', { d: d, class: 'vz-line' + (s.dash ? ' vz-line--ref' : ''), stroke: s.color }, svg);
    });
    var last = cfg.series[0].points[n - 1];
    S('circle', { cx: X(n - 1), cy: Y(last.v), r: 4, fill: cfg.series[0].color, class: 'vz-dot' }, svg);

    var hov = S('g', { visibility: 'hidden' }, svg);
    var cross = S('line', { y1: m.t, y2: m.t + ph, class: 'vz-cross' }, hov);
    var dots = cfg.series.map(function (s) { return S('circle', { r: 4.5, fill: s.color, class: 'vz-dot' }, hov); });
    function at(i) {
      var r = svg.getBoundingClientRect(), k = r.width / W;
      return { x: r.left + X(i) * k, y: r.top + Y(cfg.series[0].points[i].v) * k };
    }
    var items = cfg.series[0].points.map(function (p, i) {
      return {
        html: tipHtml(p.long || p.label, cfg.series.map(function (s) { return { k: s.name, v: N(s.points[i].v), c: s.color }; })),
        say: (p.long || p.label) + ': ' + cfg.series.map(function (s) { return s.name + ' ' + N(s.points[i].v); }).join(', '),
        at: function () { return at(i); }
      };
    });
    var ins = inspector(wrap, cfg.label, items, {
      on: function (i) {
        if (i < 0) { hov.setAttribute('visibility', 'hidden'); return; }
        hov.setAttribute('visibility', 'visible'); cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i));
        dots.forEach(function (d, k) { d.setAttribute('cx', X(i)); d.setAttribute('cy', Y(cfg.series[k].points[i].v)); });
      }
    });
    function move(e) {
      var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width);
      ins.go(Math.max(0, Math.min(n - 1, Math.round((x - m.l) / pw * (n - 1)))));
    }
    svg.addEventListener('pointermove', move); svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', ins.off);
  }

  /* ---- Barras verticales (píldora suave o recta) ---- */
  function bars(host, cfg) {
    host.innerHTML = '';
    var id = 'g' + (++uid), W = Math.max(260, host.clientWidth), Ht = cfg.height || 240;
    var m = { l: 42, r: 10, t: 26, b: 28 }, pw = W - m.l - m.r, ph = Ht - m.t - m.b, n = cfg.data.length;
    var ticks = niceTicks(Math.max.apply(null, cfg.data.map(function (d) { return d.v; }))), top = ticks[ticks.length - 1];
    var band = pw / n, bw = Math.min(32, band * .62);
    var Y = function (v) { return m.t + ph - (v / top) * ph; };
    var wrap = H('div', 'vz', '', host);
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + Ht, width: W, height: Ht, 'aria-hidden': 'true' }, wrap);
    var lgd = S('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, S('defs', {}, svg));
    S('stop', { offset: '0%', 'stop-color': cfg.color || 'var(--viz-1)' }, lgd);
    S('stop', { offset: '100%', 'stop-color': 'var(--viz-seq-2)' }, lgd);
    var g = S('g', { class: 'vz-grid' }, svg);
    ticks.forEach(function (v, k) {
      S('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v) }, k === 0 ? S('g', { class: 'vz-base' }, svg) : g);
      var t = S('text', { x: m.l - 10, y: Y(v) + 4, 'text-anchor': 'end', class: 'vz-tick' }, svg); t.textContent = N(v);
    });
    var maxI = 0; cfg.data.forEach(function (d, i) { if (d.v > cfg.data[maxI].v) maxI = i; });
    var els = [];
    cfg.data.forEach(function (d, i) {
      var cx = m.l + band * i + band / 2, x = cx - bw / 2, y = Y(d.v), h = Y(0) - y, el;
      if (cfg.pill !== false) {
        el = S('rect', { x: x, y: y, width: bw, height: Math.max(h, 2), rx: Math.min(bw / 2, h / 2) }, svg);
      } else {
        var r = Math.min(4, h);
        el = S('path', { d: 'M' + x + ' ' + Y(0) + 'V' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'H' + (x + bw - r) + 'Q' + (x + bw) + ' ' + y + ' ' + (x + bw) + ' ' + (y + r) + 'V' + Y(0) + 'Z' }, svg);
      }
      el.setAttribute('fill', 'url(#' + id + ')'); el.setAttribute('class', 'vz-bar'); els.push(el);
      var t = S('text', { x: cx, y: Ht - 6, 'text-anchor': 'middle', class: 'vz-tick' }, svg); t.textContent = d.label;
    });
    var mx = cfg.data[maxI], lt = S('text', { x: m.l + band * maxI + band / 2, y: Y(mx.v) - 8, 'text-anchor': 'middle', class: 'vz-label' }, svg); lt.textContent = N(mx.v);
    var items = cfg.data.map(function (d, i) {
      var prev = i ? cfg.data[i - 1].v : null, rows = [{ k: cfg.name, v: N(d.v), c: 'var(--viz-1)' }];
      if (prev) rows.push({ k: 'vs anterior', v: sgn(pct(d.v, prev)) + '%' });
      return {
        html: tipHtml(d.long || d.label, rows), say: (d.long || d.label) + ': ' + N(d.v),
        at: function () { var r = svg.getBoundingClientRect(), k = r.width / W; return { x: r.left + (m.l + band * i + band / 2) * k, y: r.top + Y(d.v) * k }; }
      };
    });
    var ins = inspector(wrap, cfg.label, items, {
      on: function (i) { wrap.classList.toggle('is-hover', i >= 0); els.forEach(function (e, k) { e.classList.toggle('is-on', k === i); }); }
    });
    svg.addEventListener('pointermove', function (e) {
      var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width), i = Math.floor((x - m.l) / band);
      if (i >= 0 && i < n) ins.go(i); else ins.off();
    });
    svg.addEventListener('pointerleave', ins.off);
  }

  /* ---- Barras horizontales: ranking ---- */
  function hbars(host, cfg) {
    host.innerHTML = '';
    var ul = H('ul', 'hb', '', host), max = cfg.max || Math.max.apply(null, cfg.rows.map(function (r) { return r.v; }));
    cfg.rows.forEach(function (r, i) {
      var li = H('li', 'hb__row', '', ul);
      H('span', 'hb__name', esc(r.label), li);
      var tr = H('span', 'hb__track', '', li), f = H('span', 'hb__fill', '', tr);
      f.style.width = (r.v / max * 100) + '%'; f.style.animationDelay = (i * 60) + 'ms';
      tr.setAttribute('role', 'img'); tr.setAttribute('aria-label', r.label + ': ' + cfg.fmt(r.v));
      H('span', 'hb__val', cfg.fmt(r.v), li);
    });
  }

  /* ---- Barras apiladas ---- */
  function stacked(host, cfg) {
    host.innerHTML = '';
    var lg = H('ul', 'vz-legend', '', host);
    cfg.series.forEach(function (s) { H('li', '', '<i style="--c:' + s.color + '"></i>' + esc(s.name), lg); });
    var ul = H('ul', 'sb', '', host), max = Math.max.apply(null, cfg.rows.map(function (r) { return sum(cfg.series.map(function (s) { return r.vals[s.id]; })); }));
    var segs = [], items = [];
    cfg.rows.forEach(function (r) {
      var tot = sum(cfg.series.map(function (s) { return r.vals[s.id]; })), li = H('li', 'sb__row', '', ul);
      H('span', 'sb__name', esc(r.label), li);
      var bar = H('span', 'sb__bar', '', li); bar.style.width = (tot / max * 100) + '%';
      cfg.series.forEach(function (s) {
        var v = r.vals[s.id]; if (!v) return;
        var el = H('span', 'sb__seg', '', bar); el.style.setProperty('--c', s.color); el.style.flex = v + ' 1 0';
        var k = segs.push(el) - 1;
        items.push({
          html: tipHtml(r.label, [{ k: s.name, v: N(v) + ' (' + nf1.format(v / tot * 100) + '%)', c: s.color }, { k: 'Total', v: N(tot) }]),
          say: r.label + ', ' + s.name + ': ' + N(v) + ' de ' + N(tot),
          at: function () { var b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top }; }
        });
        el.addEventListener('pointerenter', function () { ins.go(k); }); el.addEventListener('pointerleave', function () { ins.off(); });
      });
      H('span', 'sb__total', N(tot), li);
    });
    var ins = inspector(ul, cfg.label, items, {
      on: function (i) { ul.classList.toggle('is-hover', i >= 0); segs.forEach(function (e, k) { e.classList.toggle('is-on', k === i); }); }
    });
  }

  /* ---- Anillo ---- */
  function donut(host, cfg) {
    host.innerHTML = '';
    var root = H('div', 'dn', '', host), box = H('div', 'dn__svg', '', root);
    var R = 78, T = 22, C = 100, tot = sum(cfg.segs), gap = 2 / R, a0 = -Math.PI / 2;
    var svg = S('svg', { viewBox: '0 0 200 200', 'aria-hidden': 'true' }, box), arcs = [], lis = [], items = [];
    var ul = H('ul', 'dn__legend', '', root);
    cfg.segs.forEach(function (s, i) {
      var ang = s.v / tot * Math.PI * 2, x0 = a0 + gap / 2, x1 = a0 + ang - gap / 2, large = x1 - x0 > Math.PI ? 1 : 0;
      var p = function (a) { return (C + R * Math.cos(a)).toFixed(2) + ' ' + (C + R * Math.sin(a)).toFixed(2); };
      var el = S('path', { d: 'M' + p(x0) + ' A' + R + ' ' + R + ' 0 ' + large + ' 1 ' + p(x1), fill: 'none', stroke: s.color, 'stroke-width': T, class: 'dn__arc' }, svg);
      arcs.push(el);
      var li = H('li', '', '<i style="--c:' + s.color + '"></i><span>' + esc(s.label) + '</span><b>' + N(s.v) + '</b><em>' + nf1.format(s.v / tot * 100) + '%</em>', ul); li.firstChild.style.background = s.color; lis.push(li);
      items.push({
        html: tipHtml(cfg.name, [{ k: s.label, v: N(s.v) + ' (' + nf1.format(s.v / tot * 100) + '%)', c: s.color }]),
        say: s.label + ': ' + N(s.v) + ', ' + nf1.format(s.v / tot * 100) + '%',
        at: function () { var b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height * .15 }; }
      });
      el.addEventListener('pointerenter', function () { ins.go(i); }); el.addEventListener('pointerleave', function () { ins.off(); });
      li.addEventListener('pointerenter', function () { arcs.forEach(function (e, k) { e.classList.toggle('is-on', k === i); }); root.classList.add('is-hover'); });
      li.addEventListener('pointerleave', function () { root.classList.remove('is-hover'); });
      a0 += ang;
    });
    H('div', 'dn__center', '<b>' + N(tot) + '</b><span>' + esc(cfg.unit) + '</span>', box);
    var ins = inspector(box, cfg.label, items, {
      on: function (i) { root.classList.toggle('is-hover', i >= 0); arcs.forEach(function (e, k) { e.classList.toggle('is-on', k === i); }); }
    });
  }

  /* ---- Bullet: valor vs meta ---- */
  function bullet(host, cfg) {
    host.innerHTML = '';
    var lg = H('ul', 'vz-legend', '<li><i style="--c:var(--viz-1)"></i>' + esc(cfg.name) + '</li><li><i style="width:2px;height:14px;border-radius:0;background:var(--viz-ink)"></i>Meta ' + cfg.goal + '%</li>', host);
    var ul = H('ul', 'bl', '', host);
    cfg.rows.forEach(function (r, i) {
      var li = H('li', 'bl__row', '', ul);
      H('span', 'hb__name', esc(r.label), li);
      var tr = H('span', 'bl__track', '', li); tr.setAttribute('role', 'img');
      tr.setAttribute('aria-label', r.label + ': ' + r.v + '% de una meta de ' + cfg.goal + '%, ' + (r.v >= cfg.goal ? 'cumplida' : 'por debajo'));
      var f = H('span', 'bl__fill', '', tr); f.style.width = 'calc(' + r.v + '% - 0px)'; f.style.animationDelay = (i * 60) + 'ms';
      var gl = H('span', 'bl__goal', '', tr); gl.style.left = 'calc(' + cfg.goal + '% - 1px)';
      H('span', 'hb__val', r.v + '%', li);
    });
    H('div', 'bl__axis', '<span>0%</span><span>50%</span><span>100%</span>', host);
  }

  /* ---- Sparkline (sin ejes: el valor está en el texto de la tarjeta) ---- */
  function spark(host, vals, color) {
    host.innerHTML = '';
    var id = 'g' + (++uid), W = Math.max(120, host.clientWidth), Ht = 52, pad = 6;
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), rg = (mx - mn) || 1;
    var X = function (i) { return pad + i * (W - pad * 2) / (vals.length - 1); }, Y = function (v) { return Ht - pad - (v - mn) / rg * (Ht - pad * 2); };
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + Ht, width: W, height: Ht, 'aria-hidden': 'true' }, host);
    var g = S('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, S('defs', {}, svg));
    S('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': .2 }, g); S('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': 0 }, g);
    var pts = vals.map(function (v, i) { return [X(i), Y(v)]; }), d = curve(pts);
    S('path', { d: d + ' L' + X(vals.length - 1) + ' ' + Ht + ' L' + X(0) + ' ' + Ht + ' Z', fill: 'url(#' + id + ')' }, svg);
    S('path', { d: d, class: 'vz-line', stroke: color }, svg);
    S('circle', { cx: pts[pts.length - 1][0], cy: pts[pts.length - 1][1], r: 4, fill: color, class: 'vz-dot' }, svg);
  }

  /* ---- Mapa de calor ---- */
  function heatmap(host, cfg) {
    host.innerHTML = '';
    var grid = H('div', 'hm', '', host), max = Math.max.apply(null, [].concat.apply([], cfg.rows.map(function (r) { return r.v; })));
    H('span', 'hm__h', '', grid);
    cfg.cols.forEach(function (c, i) { H('span', 'hm__h hm__h--top', i % 2 === 0 ? esc(c.short) : '', grid); });
    var cells = [], items = [];
    cfg.rows.forEach(function (r) {
      H('span', 'hm__h', esc(r.label.slice(0, 3)), grid);
      r.v.forEach(function (v, j) {
        var k = Math.min(5, Math.floor(v / max * 6)), el = H('span', 'hm__c', '', grid);
        el.style.setProperty('--c', 'var(--viz-seq-' + (k + 1) + ')');
        var idx = cells.push(el) - 1, lab = r.label + ', ' + cfg.cols[j].long;
        items.push({
          html: tipHtml(lab, [{ k: cfg.name, v: N(v) }]), say: lab + ': ' + N(v),
          at: function () { var b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top }; }
        });
        el.addEventListener('pointerenter', function () { ins.go(idx); }); el.addEventListener('pointerleave', function () { ins.off(); });
      });
    });
    var ins = inspector(grid, cfg.label, items, {
      cols: cfg.cols.length,
      on: function (i) { grid.classList.toggle('is-hover', i >= 0); cells.forEach(function (e, k) { e.classList.toggle('is-on', k === i); }); }
    });
    var sc = H('div', 'hm-scale', '<span>Menos</span>', host), rp = H('span', 'hm-scale__ramp', '', sc);
    for (var k = 1; k <= 6; k++) H('i', '', '', rp).style.background = 'var(--viz-seq-' + k + ')';
    H('span', '', 'Más', sc);
  }

  /* ---- Embudo ---- */
  function funnel(host, cfg) {
    host.innerHTML = '';
    var ul = H('ul', 'fn', '', host), first = cfg.rows[0].v;
    cfg.rows.forEach(function (r, i) {
      var li = H('li', 'fn__row', '', ul);
      H('span', 'hb__name', esc(r.label), li);
      var bar = H('span', 'fn__bar', '', li), s = H('span', '', '', bar);
      s.style.width = (r.v / first * 100) + '%'; s.style.animationDelay = (i * 70) + 'ms';
      bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', r.label + ': ' + N(r.v));
      H('span', 'fn__v', N(r.v) + '<small>' + (i ? nf1.format(r.v / cfg.rows[i - 1].v * 100) + '% del anterior' : 'punto de partida') + '</small>', li);
    });
  }

  /* ---- Histograma con umbral ---- */
  function histogram(host, cfg) {
    host.innerHTML = '';
    var W = Math.max(280, host.clientWidth), Ht = cfg.height || 260, m = { l: 42, r: 10, t: 26, b: 44 }, pw = W - m.l - m.r, ph = Ht - m.t - m.b, n = cfg.bins.length;
    var lg = H('ul', 'vz-legend', '<li><i style="--c:var(--viz-2)"></i>Rechazadas (< umbral)</li><li><i style="--c:var(--viz-1)"></i>Aceptadas (≥ umbral)</li><li><i class="is-line is-dash" style="--c:var(--viz-ink)"></i>Umbral ' + nf2.format(cfg.threshold) + '</li>', host);
    var ticks = niceTicks(Math.max.apply(null, cfg.bins.map(function (b) { return b.n; }))), top = ticks[ticks.length - 1];
    var Y = function (v) { return m.t + ph - v / top * ph; }, XS = function (s) { return m.l + s * pw; }, bw = pw / n;
    var wrap = H('div', 'vz', '', host), svg = S('svg', { viewBox: '0 0 ' + W + ' ' + Ht, width: W, height: Ht, 'aria-hidden': 'true' }, wrap);
    var g = S('g', { class: 'vz-grid' }, svg);
    ticks.forEach(function (v, k) {
      S('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v) }, k === 0 ? S('g', { class: 'vz-base' }, svg) : g);
      var t = S('text', { x: m.l - 10, y: Y(v) + 4, 'text-anchor': 'end', class: 'vz-tick' }, svg); t.textContent = N(v);
    });
    [0, .2, .4, .6, .8, 1].forEach(function (v) { var t = S('text', { x: XS(v), y: Ht - 24, 'text-anchor': v === 0 ? 'start' : v === 1 ? 'end' : 'middle', class: 'vz-tick' }, svg); t.textContent = nf1.format(v); });
    var els = [];
    cfg.bins.forEach(function (b, i) {
      var ok = b.from >= cfg.threshold - 1e-9, x = m.l + bw * i + 1, w = bw - 2, y = Y(b.n), h = Y(0) - y, r = Math.min(3, h);
      els.push(S('path', { d: 'M' + x + ' ' + Y(0) + 'V' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + 'V' + Y(0) + 'Z', fill: ok ? 'var(--viz-1)' : 'var(--viz-2)', class: 'vz-bar' }, svg));
    });
    var tx = XS(cfg.threshold);
    S('line', { x1: tx, x2: tx, y1: m.t - 8, y2: m.t + ph, class: 'vz-thr' }, svg);
    var l1 = S('text', { x: tx - 8, y: 14, 'text-anchor': 'end', class: 'vz-label' }, svg); l1.textContent = '← Rechazadas';
    var l2 = S('text', { x: tx + 8, y: 14, 'text-anchor': 'start', class: 'vz-label' }, svg); l2.textContent = 'Aceptadas →';
    var xt = S('text', { x: m.l + pw / 2, y: Ht - 4, 'text-anchor': 'middle', class: 'vz-tick' }, svg); xt.textContent = 'Puntaje de similitud (0–1)';
    var items = cfg.bins.map(function (b, i) {
      var ok = b.from >= cfg.threshold - 1e-9, lab = nf2.format(b.from) + '–' + nf2.format(b.to);
      return {
        html: tipHtml('Similitud ' + lab, [{ k: ok ? 'Aceptadas' : 'Rechazadas', v: N(b.n), c: ok ? 'var(--viz-1)' : 'var(--viz-2)' }]), say: 'Similitud ' + lab + ': ' + N(b.n) + (ok ? ' aceptadas' : ' rechazadas'),
        at: function () { var r = svg.getBoundingClientRect(), k = r.width / W; return { x: r.left + (m.l + bw * i + bw / 2) * k, y: r.top + Y(b.n) * k }; }
      };
    });
    var ins = inspector(wrap, cfg.label, items, { on: function (i) { wrap.classList.toggle('is-hover', i >= 0); els.forEach(function (e, k) { e.classList.toggle('is-on', k === i); }); } });
    svg.addEventListener('pointermove', function (e) {
      var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width), i = Math.floor((x - m.l) / bw);
      if (i >= 0 && i < n) ins.go(i); else ins.off();
    });
    svg.addEventListener('pointerleave', ins.off);
  }

  /* ---- Tabla "breakdown" con pestañas ---- */
  function breakdown(host, cfg) {
    host.innerHTML = '';
    var tabs = H('div', 'bd-tabs', '', host), panel = H('div', '', '', host), btns = [];
    tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', cfg.label);
    function draw(k) {
      var t = cfg.tabs[k];
      btns.forEach(function (b, i) { b.setAttribute('aria-selected', i === k); b.tabIndex = i === k ? 0 : -1; });
      panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', btns[k].id);
      var tot = sum(t.rows.map(function (r) { return r.n; })), h = '<table class="bd"><thead><tr><th scope="col">' + esc(t.col) + '</th><th scope="col" class="num">Total</th><th scope="col" class="num">Variación</th></tr></thead><tbody>';
      t.rows.forEach(function (r) {
        var tone = r.tone || (r.d > 0 ? 'good' : r.d < 0 ? 'bad' : 'flat');
        h += '<tr><td class="bd__ev">' + esc(r.label) + '</td><td class="num"><button type="button" class="bd__n" data-ev="' + esc(r.label) + '" aria-label="' + N(r.n) + ' ' + esc(r.label) + ', abrir en la bitácora">' + N(r.n) + '</button></td>' +
          '<td class="num"><span class="bd__d bd__d--' + tone + '"><i class="bi ' + (r.d > 0 ? 'bi-arrow-up-short' : r.d < 0 ? 'bi-arrow-down-short' : 'bi-dash') + '" aria-hidden="true"></i>' + sgn(r.d) + '%</span></td></tr>';
      });
      h += '</tbody><tfoot><tr><td>Total</td><td class="num">' + N(tot) + '</td><td class="num"><span class="bd__d bd__d--' + (t.totalTone || 'good') + '"><i class="bi bi-arrow-up-short" aria-hidden="true"></i>' + sgn(t.totalD) + '%</span></td></tr></tfoot></table>';
      panel.innerHTML = h;
      $$('.bd__n', panel).forEach(function (b) { b.addEventListener('click', function () { DS.toast('Bitácora', 'Se abriría la bitácora filtrada por ' + b.getAttribute('data-ev') + '.'); }); });
    }
    cfg.tabs.forEach(function (t, k) {
      var b = H('button', '', esc(t.name), tabs); b.type = 'button'; b.id = 'bd-' + (++uid); b.setAttribute('role', 'tab'); btns.push(b);
      b.addEventListener('click', function () { draw(k); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        e.preventDefault(); var j = (k + d + btns.length) % btns.length; draw(j); btns[j].focus();
      });
    });
    draw(0);
  }

  /* ==========================================================================
     TARJETA DE GRÁFICO: cascarón, menú, vista en tabla, estados
     ========================================================================== */
  function csvOf(t) {
    var q = function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; };
    return [t.head].concat(t.rows).map(function (r) { return r.map(q).join(','); }).join('\n');
  }
  function tableEl(t) {
    var wrap = H('div', 'vz-table-wrap'), tb = H('table', 'vz-table', '', wrap);
    wrap.setAttribute('tabindex', '0'); wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', t.caption);
    var h = '<caption>' + esc(t.caption) + '</caption><thead><tr>' + t.head.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
    t.rows.forEach(function (r) { h += '<tr>' + r.map(function (c, i) { return i ? '<td>' + esc(c) + '</td>' : '<th scope="row" style="font-weight:500">' + esc(c) + '</th>'; }).join('') + '</tr>'; });
    tb.innerHTML = h + '</tbody>'; return wrap;
  }
  var deltaHtml = function (d) {
    return '<span class="cc__delta cc__delta--' + d.tone + '"><i class="bi ' + (d.dir === 'up' ? 'bi-arrow-up-short' : d.dir === 'down' ? 'bi-arrow-down-short' : 'bi-dash') + '" aria-hidden="true"></i>' + esc(d.text) + '</span>';
  };

  function card(mount, spec) {
    var art = H('article', 'cc' + (spec.wide ? ' cc--wide' : '')), tableMode = false, rangeKey = spec.range && spec.range.def;
    art.setAttribute('aria-label', spec.label);
    var head = H('header', 'cc__head', '', art);
    H('h3', 'cc__label', esc(spec.label), head).style.margin = 0;
    var tools = H('div', 'cc__tools', '', head);
    if (spec.range) {
      var seg = H('div', 'vz-seg', '', tools); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Periodo');
      spec.range.keys.forEach(function (k) {
        var b = H('button', '', esc(k.label), seg); b.type = 'button'; b.setAttribute('aria-pressed', k.key === rangeKey);
        b.addEventListener('click', function () { rangeKey = k.key; $$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); refresh(); hideTip(); });
      });
    }
    var mb = H('button', 'cc__menu', '<i class="bi bi-three-dots" aria-hidden="true"></i>', tools);
    mb.type = 'button'; mb.setAttribute('aria-haspopup', 'menu'); mb.setAttribute('aria-expanded', 'false'); mb.setAttribute('aria-label', 'Opciones del gráfico ' + spec.label);
    var valueEl = spec.value != null ? H('p', 'cc__value', '', art) : null, metaEl = spec.value != null ? H('p', 'cc__meta', '', art) : null;
    var body = H('div', 'cc__body', '', art), fig = H('div', '', '', body);
    if (spec.foot) H('footer', 'cc__foot', spec.foot, art);

    function meta() { return spec.meta ? spec.meta(rangeKey) : spec; }
    function draw() {
      if (tableMode) { fig.innerHTML = ''; fig.appendChild(tableEl(spec.table(rangeKey))); } else spec.render(fig, rangeKey);
    }
    function refresh() {
      var m = meta();
      if (valueEl) { valueEl.innerHTML = m.value; metaEl.innerHTML = (m.delta ? deltaHtml(m.delta) : '') + '<span>' + esc(m.period || '') + '</span>'; }
      draw();
    }
    /* Menú */
    var pop = H('div', 'cc__pop', '', art); pop.hidden = true;
    var menu = H('div', 'hz-menu', '', pop); menu.setAttribute('role', 'menu'); menu.setAttribute('aria-label', 'Opciones de ' + spec.label);
    var mi = {};
    [['tabla', 'bi-table', 'Ver como tabla'], ['copiar', 'bi-clipboard', 'Copiar datos (CSV)'], ['bajar', 'bi-download', 'Descargar CSV']].forEach(function (o) {
      var b = H('button', '', '<i class="bi ' + o[1] + '" aria-hidden="true"></i><span>' + o[2] + '</span>', menu); b.type = 'button'; b.setAttribute('role', 'menuitem'); mi[o[0]] = b;
    });
    function open() { pop.hidden = false; mb.setAttribute('aria-expanded', 'true'); mi.tabla.focus(); }
    function close(back) { pop.hidden = true; mb.setAttribute('aria-expanded', 'false'); if (back) mb.focus(); }
    mb.addEventListener('click', function () { pop.hidden ? open() : close(); });
    menu.addEventListener('keydown', function (e) {
      var items = $$('button', menu), i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Tab') close();
    });
    document.addEventListener('click', function (e) { if (!pop.hidden && !art.contains(e.target)) close(); });
    mi.tabla.addEventListener('click', function () {
      tableMode = !tableMode; mi.tabla.querySelector('span').textContent = tableMode ? 'Ver gráfico' : 'Ver como tabla'; close(true); draw();
    });
    mi.copiar.addEventListener('click', function () { DS.copiar(csvOf(spec.table(rangeKey)), 'Datos'); close(true); });
    mi.bajar.addEventListener('click', function () {
      var a = document.createElement('a'); a.download = (spec.id || 'grafico') + '.csv';
      a.href = URL.createObjectURL(new Blob(['﻿' + csvOf(spec.table(rangeKey))], { type: 'text/csv;charset=utf-8' }));
      document.body.appendChild(a); a.click(); a.remove(); close(true); DS.toast('Descarga lista', (spec.id || 'grafico') + '.csv');
    });
    mount.appendChild(art); refresh();
    var lastW = fig.clientWidth, raf;
    if (window.ResizeObserver) new ResizeObserver(function () {
      cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { var w = fig.clientWidth; if (w && Math.abs(w - lastW) > 2) { lastW = w; if (!tableMode) draw(); } });
    }).observe(body);
    return art;
  }

  /* Estados: cargando, vacío, error */
  function stateCard(mount, kind) {
    var art = H('article', 'cc'), label = 'Verificaciones por día';
    H('header', 'cc__head', '<h3 class="cc__label" style="margin:0">' + label + '</h3>', art);
    var b = H('div', 'cc__body', '', art);
    if (kind === 'loading') {
      art.setAttribute('aria-busy', 'true');
      b.innerHTML = '<div class="sk" role="status" aria-label="Cargando gráfico"><i class="big"></i><i style="width:30%"></i><i class="chart"></i></div>';
    } else if (kind === 'empty') {
      b.innerHTML = '<div class="cc-state"><i class="bi bi-bar-chart" aria-hidden="true"></i><h3>Sin verificaciones en este periodo</h3><p>Cuando haya actividad, la tendencia aparecerá aquí. Prueba con un periodo más amplio.</p><button class="hz-btn hz-btn--ghost" type="button" data-act="rango">Ampliar a 90 días</button></div>';
    } else {
      b.innerHTML = '<div class="cc-state" role="alert"><i class="bi bi-exclamation-triangle" aria-hidden="true"></i><h3>No pudimos cargar este gráfico</h3><p>Hubo un problema al pedir los datos. Tus datos no se perdieron.</p><button class="hz-btn hz-btn--ghost" type="button" data-act="reintentar">Reintentar</button></div>';
    }
    mount.appendChild(art);
    $$('[data-act]', art).forEach(function (x) { x.addEventListener('click', function () { DS.toast(x.textContent, 'Aquí se volvería a pedir el dato al servidor.'); }); });
  }

  /* ==========================================================================
     DATOS DE EJEMPLO Y MONTAJE
     ========================================================================== */
  var MS = 'ejemplo';
  var RANGES = { '7': 7, '30': 30, '90': 90 };
  function trendSpec(key) {
    var n = RANGES[key], cur = trend(n, 11, 360), prev = trend(n, 29, 335, n).map(function (p, i) { p.label = cur[i].label; p.long = cur[i].long; return p; });
    return { n: n, cur: cur, prev: prev };
  }
  var days = { '7': '7 días', '30': '30 días', '90': '90 días' };

  var D = {};
  D.area = function (key) {
    var t = trendSpec(key), d = pct(sum(t.cur), sum(t.prev));
    return {
      t: t, value: N(sum(t.cur)), period: 'en los últimos ' + days[key] + ' · vs periodo anterior',
      delta: { dir: d >= 0 ? 'up' : 'down', tone: d >= 0 ? 'good' : 'bad', text: sgn(d) + '%' }
    };
  };
  D.bars = { name: 'Registros', label: 'Registros por semana', data: [412, 530, 486, 602, 574, 690, 655, 742].map(function (v, i) { var t = END - (7 - i) * 7 * 864e5; return { label: fShort.format(t).replace('.', ''), long: 'Semana del ' + fShort.format(t - 6 * 864e5).replace('.', '') + ' al ' + fShort.format(t).replace('.', ''), v: v }; }) };
  D.ocr = { rows: [{ label: 'N.º de documento', v: 99.1 }, { label: 'Apellidos', v: 97.8 }, { label: 'Nombres', v: 97.2 }, { label: 'Fecha de nacimiento', v: 95.4 }, { label: 'Dirección', v: 88.9 }, { label: 'Lugar de nacimiento', v: 86.3 }] };
  D.stack = { label: 'Verificaciones por dispositivo', series: [{ id: 'ok', name: 'Exitosas', color: 'var(--viz-1)' }, { id: 'retry', name: 'Reintentos', color: 'var(--viz-2)' }, { id: 'rej', name: 'Rechazadas', color: 'var(--viz-5)' }],
    rows: [{ label: 'CAM-001', vals: { ok: 1840, retry: 212, rej: 96 } }, { label: 'CAM-002', vals: { ok: 1522, retry: 188, rej: 74 } }, { label: 'LEC-001', vals: { ok: 1204, retry: 64, rej: 41 } }, { label: 'LEC-002', vals: { ok: 968, retry: 120, rej: 88 } }, { label: 'KIOSCO-01', vals: { ok: 612, retry: 35, rej: 20 } }] };
  D.donut = { name: 'Verificaciones por método', label: 'Verificaciones por método', unit: 'verificaciones', segs: [{ label: 'Rostro', v: 7240, color: 'var(--viz-1)' }, { label: 'Huella', v: 3868, color: 'var(--viz-2)' }, { label: 'Documento (OCR)', v: 1372, color: 'var(--viz-3)' }] };
  D.bullet = { name: 'Participación', goal: 80, rows: [{ label: 'Mesa 1', v: 88 }, { label: 'Mesa 2', v: 72 }, { label: 'Mesa 3', v: 54 }, { label: 'Mesa 4', v: 81 }] };
  D.kpis = [
    { id: 'k1', label: 'Verificaciones hoy', value: '1,284', delta: { dir: 'up', tone: 'good', text: '+4.2%' }, color: 'var(--viz-1)', vals: [22, 25, 24, 28, 27, 31, 30, 34, 33, 38, 36, 41] },
    { id: 'k2', label: 'Tasa de coincidencia', value: '98.4%', delta: { dir: 'up', tone: 'good', text: '+0.6 pp' }, color: 'var(--viz-1)', vals: [96, 96.4, 96.1, 97, 97.3, 97.1, 97.8, 97.6, 98, 98.2, 98.1, 98.4] },
    { id: 'k3', label: 'Tiempo medio', value: '1.8 s', delta: { dir: 'down', tone: 'good', text: '−0.2 s' }, color: 'var(--viz-1)', vals: [2.3, 2.2, 2.25, 2.1, 2.05, 2.0, 2.05, 1.95, 1.9, 1.9, 1.85, 1.8] },
    { id: 'k4', label: 'Dispositivos activos', value: '18<small>/ 20</small>', delta: { dir: 'flat', tone: 'flat', text: 'Sin cambios' }, color: 'var(--viz-other)', vals: [19, 19, 20, 20, 19, 18, 18, 19, 18, 18, 18, 18] }
  ];
  var hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  var dnames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  var rh = rng(7);
  D.heat = { name: 'Accesos', label: 'Accesos por día y franja horaria', cols: hours.map(function (h) { return { short: h + 'h', long: h + '–' + (h + 2) + ' h' }; }),
    rows: dnames.map(function (n, d) { return { label: n, v: hours.map(function (h) { var wk = d < 5, base = wk ? (h >= 8 && h < 10 ? 320 : h >= 12 && h < 14 ? 260 : h >= 6 && h < 18 ? 150 : 24) : (h >= 10 && h < 14 ? 70 : 12); return Math.round(base * (.85 + rh() * .3)); }) }; }) };
  D.funnel = { rows: [{ label: 'Captura iniciada', v: 1240 }, { label: 'Calidad suficiente', v: 1102 }, { label: 'Prueba de vida', v: 1046 }, { label: 'Coincidencia ≥ 0.68', v: 981 }] };
  var below = [1, 2, 3, 5, 8, 12, 17, 22, 26, 24, 19, 14, 10, 7, 5, 4, 3], above = [6, 14, 30, 52, 74, 90, 55, 20];
  D.hist = { label: 'Distribución de puntajes de similitud', threshold: 0.68, bins: below.concat(above).map(function (n, i) { return { from: +(i * .04).toFixed(2), to: +((i + 1) * .04).toFixed(2), n: n }; }) };
  D.bd = { label: 'Desglose de eventos de auditoría', tabs: [
    { name: 'Por evento', col: 'Evento', totalD: 3.9, rows: [{ label: 'LOGIN', n: 4812, d: 3.1 }, { label: 'PERSON_CREATED', n: 612, d: 8.4 }, { label: 'DOCUMENT_REGISTERED', n: 587, d: 7.9 }, { label: 'BIOMETRIC_ENROLLED', n: 436, d: -2.2, tone: 'bad' }, { label: 'BIOMETRIC_VERIFIED', n: 9744, d: 1.5 }, { label: 'VOTE_CAST', n: 1953, d: 12.6 }] },
    { name: 'Por dispositivo', col: 'Dispositivo', totalD: 2.4, rows: [{ label: 'CAM-001', n: 2148, d: 3.8 }, { label: 'CAM-002', n: 1784, d: 1.2 }, { label: 'LEC-001', n: 1309, d: 0 }, { label: 'LEC-002', n: 1176, d: -4.6, tone: 'bad' }, { label: 'KIOSCO-01', n: 667, d: 9.1 }] }] };

  /* tablas alternativas (cada gráfico debe tener una) */
  var T = {
    area: function (key) { var t = trendSpec(key); return { caption: 'Verificaciones por día · ejemplo', head: ['Fecha', 'Periodo actual', 'Periodo anterior'], rows: t.cur.map(function (p, i) { return [p.long, N(p.v), N(t.prev[i].v)]; }) }; },
    bars: function () { return { caption: 'Registros por semana · ejemplo', head: ['Semana', 'Registros'], rows: D.bars.data.map(function (d) { return [d.long, N(d.v)]; }) }; },
    stack: function () { return { caption: 'Verificaciones por dispositivo · ejemplo', head: ['Dispositivo', 'Exitosas', 'Reintentos', 'Rechazadas', 'Total'], rows: D.stack.rows.map(function (r) { return [r.label, N(r.vals.ok), N(r.vals.retry), N(r.vals.rej), N(r.vals.ok + r.vals.retry + r.vals.rej)]; }) }; },
    donut: function () { var t = sum(D.donut.segs); return { caption: 'Verificaciones por método · ejemplo', head: ['Método', 'Verificaciones', '% del total'], rows: D.donut.segs.map(function (s) { return [s.label, N(s.v), nf1.format(s.v / t * 100) + '%']; }) }; },
    bullet: function () { return { caption: 'Participación por mesa · meta 80% · ejemplo', head: ['Mesa', 'Participación', 'Meta cumplida'], rows: D.bullet.rows.map(function (r) { return [r.label, r.v + '%', r.v >= 80 ? 'Sí' : 'No']; }) }; },
    heat: function () { return { caption: 'Accesos por día y franja horaria · ejemplo', head: ['Día'].concat(D.heat.cols.map(function (c) { return c.long; })), rows: D.heat.rows.map(function (r) { return [r.label].concat(r.v.map(N)); }) }; },
    funnel: function () { return { caption: 'Embudo de verificación · ejemplo', head: ['Paso', 'Personas', '% del anterior'], rows: D.funnel.rows.map(function (r, i) { return [r.label, N(r.v), i ? nf1.format(r.v / D.funnel.rows[i - 1].v * 100) + '%' : '100%']; }) }; },
    hist: function () { return { caption: 'Puntajes de similitud por intervalo · umbral 0.68 · ejemplo', head: ['Intervalo', 'Verificaciones', 'Decisión'], rows: D.hist.bins.map(function (b) { return [nf2.format(b.from) + '–' + nf2.format(b.to), N(b.n), b.from >= .68 - 1e-9 ? 'Aceptada' : 'Rechazada']; }) }; }
  };
  var foot = function (extra) { return '<span class="cc__sample">Datos de ejemplo</span>' + (extra || ''); };

  function mount(sel, spec) { var m = $(sel); if (m) card(m, spec); }

  mount('#m-area', {
    id: 'verificaciones', label: 'Verificaciones', wide: true, range: { def: '30', keys: [{ key: '7', label: '7 d' }, { key: '30', label: '30 d' }, { key: '90', label: '90 d' }] },
    meta: function (k) { var a = D.area(k); return { value: a.value, period: a.period, delta: a.delta }; }, value: '',
    foot: foot('<button type="button" class="linklike" data-go="bitacora">Ver detalle en la bitácora →</button>'),
    render: function (fig, k) { var t = trendSpec(k); area(fig, { label: 'Verificaciones por día', height: 260, series: [{ name: 'Periodo actual', color: 'var(--viz-1)', points: t.cur }, { name: 'Periodo anterior', color: 'var(--viz-other)', dash: true, points: t.prev }] }); },
    table: T.area
  });
  mount('#m-bars', { id: 'registros-semana', label: 'Registros por semana', value: '4,691', meta: function () { return { value: '4,691', period: 'en las últimas 8 semanas', delta: { dir: 'up', tone: 'good', text: '+8.4%' } }; }, foot: foot(), render: function (f) { bars(f, D.bars); }, table: T.bars });
  mount('#m-bars-flat', { id: 'registros-semana-recta', label: 'Registros por semana · recta', value: '4,691', meta: function () { return { value: '4,691', period: 'en las últimas 8 semanas', delta: { dir: 'up', tone: 'good', text: '+8.4%' } }; }, foot: foot(), render: function (f) { bars(f, { name: D.bars.name, label: D.bars.label, data: D.bars.data, pill: false }); }, table: T.bars });
  mount('#m-ocr', { id: 'confianza-ocr', label: 'Confianza del OCR por campo', foot: foot(), render: function (f) { hbars(f, { rows: D.ocr.rows, max: 100, fmt: function (v) { return nf1.format(v) + '%'; } }); }, table: function () { return { caption: 'Confianza del OCR por campo · ejemplo', head: ['Campo', 'Confianza'], rows: D.ocr.rows.map(function (r) { return [r.label, nf1.format(r.v) + '%']; }) }; } });
  mount('#m-stack', { id: 'verificaciones-dispositivo', label: 'Verificaciones por dispositivo', foot: foot(), render: function (f) { stacked(f, D.stack); }, table: T.stack });
  mount('#m-donut', { id: 'verificaciones-metodo', label: 'Verificaciones por método', foot: foot(), render: function (f) { donut(f, D.donut); }, table: T.donut });
  mount('#m-bullet', { id: 'participacion-mesas', label: 'Participación por mesa', foot: foot(), render: function (f) { bullet(f, D.bullet); }, table: T.bullet });
  mount('#m-heat', { id: 'accesos-hora', label: 'Accesos por día y hora', wide: true, foot: foot(), render: function (f) { heatmap(f, D.heat); }, table: T.heat });
  mount('#m-funnel', { id: 'embudo-verificacion', label: 'Embudo de verificación', foot: foot(), render: function (f) { funnel(f, D.funnel); }, table: T.funnel });
  mount('#m-hist', { id: 'puntajes-similitud', label: 'Puntajes de similitud', foot: foot(), render: function (f) { histogram(f, D.hist); }, table: T.hist });
  mount('#m-bd', {
    id: 'desglose-eventos', label: 'Desglose de eventos', wide: true, foot: foot('<button type="button" class="linklike" data-go="bitacora">Ver toda la bitácora →</button>'), render: function (f) { breakdown(f, D.bd); },
    table: function () { return { caption: 'Eventos de auditoría · ejemplo', head: ['Evento', 'Total', 'Variación'], rows: D.bd.tabs[0].rows.map(function (r) { return [r.label, N(r.n), sgn(r.d) + '%']; }) }; }
  });
  $$('[data-go="bitacora"]').forEach(function (b) { b.addEventListener('click', function () { DS.toast('Bitácora', 'Aquí se abriría la bitácora de auditoría.'); }); });

  /* Fichas KPI con sparkline */
  var kg = $('#m-kpis');
  if (kg) {
    D.kpis.forEach(function (k) {
      var art = H('article', 'kt', '', kg); art.setAttribute('aria-label', k.label);
      H('h3', 'cc__label', esc(k.label), art).style.margin = 0;
      H('p', 'cc__value', k.value, art);
      H('p', 'cc__meta', deltaHtml(k.delta) + '<span>vs ayer</span>', art);
      var sp = H('div', 'kt__spark', '', art); sp.setAttribute('role', 'img'); sp.setAttribute('aria-label', 'Tendencia de ' + k.label + ' en las últimas 12 mediciones');
      spark(sp, k.vals, k.color);
      var w = sp.clientWidth;
      if (window.ResizeObserver) new ResizeObserver(function () { if (Math.abs(sp.clientWidth - w) > 2) { w = sp.clientWidth; spark(sp, k.vals, k.color); } }).observe(sp);
    });
  }

  /* Estados */
  ['loading', 'empty', 'error'].forEach(function (k) { var m = $('#m-state-' + k); if (m) stateCard(m, k); });

  /* ---------- Modelos de datos mostrados en la documentación ---------- */
  function trunc(o) {
    if (Array.isArray(o)) return o.length > 4 ? o.slice(0, 3).map(trunc).concat('… ' + (o.length - 3) + ' más') : o.map(trunc);
    if (o && typeof o === 'object') { var r = {}; for (var k in o) r[k] = trunc(o[k]); return r; }
    return o;
  }
  var pre = function (id, o) { var e = $('#' + id); if (e) e.textContent = JSON.stringify(trunc(o), null, 2); };
  var t30 = trendSpec('30'), pts = function (a) { return a.map(function (p) { return { t: p.t, v: p.v }; }); };
  pre('mod-area', { metric: 'verifications', unit: 'count', granularity: 'day', period: { from: t30.cur[0].t, to: t30.cur[29].t }, series: [{ id: 'current', name: 'Periodo actual', points: pts(t30.cur) }, { id: 'previous', name: 'Periodo anterior', points: pts(t30.prev) }], updatedAt: '2026-10-01T23:59:00-05:00' });
  pre('mod-bars', { metric: 'registrations', unit: 'count', granularity: 'week', points: D.bars.data.map(function (d) { return { t: d.label, v: d.v }; }) });
  pre('mod-ocr', { metric: 'ocr_confidence', unit: 'percent', max: 100, rows: D.ocr.rows });
  pre('mod-stack', { metric: 'verifications_by_device', series: D.stack.series.map(function (s) { return { id: s.id, name: s.name }; }), rows: D.stack.rows });
  pre('mod-donut', { metric: 'verifications_by_method', unit: 'count', segments: D.donut.segs.map(function (s) { return { id: s.label.toLowerCase(), label: s.label, v: s.v }; }) });
  pre('mod-bullet', { metric: 'turnout', unit: 'percent', goal: 80, rows: D.bullet.rows });
  pre('mod-kpi', { metric: 'verifications_today', value: 1284, display: '1,284', compare: { vs: 'yesterday', change: 4.2, unit: 'percent', tone: 'good' }, spark: D.kpis[0].vals });
  pre('mod-heat', { metric: 'accesses', unit: 'count', cols: D.heat.cols.map(function (c) { return c.long; }), rows: D.heat.rows });
  pre('mod-funnel', { metric: 'verification_funnel', steps: D.funnel.rows });
  pre('mod-hist', { metric: 'similarity_score', threshold: D.hist.threshold, binWidth: 0.04, bins: D.hist.bins });
  pre('mod-bd', { metric: 'audit_events', tabs: D.bd.tabs.map(function (t) { return { name: t.name, rows: t.rows.map(function (r) { return { id: r.label, total: r.n, change: r.d, tone: r.tone || 'auto' }; }) }; }) });

  /* ---------- Contraste en vivo de la paleta ---------- */
  function lum(hex) {
    var c = hex.replace('#', ''), v = [0, 2, 4].map(function (i) { var x = parseInt(c.substr(i, 2), 16) / 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); });
    return .2126 * v[0] + .7152 * v[1] + .0722 * v[2];
  }
  $$('[data-contrast]').forEach(function (e) {
    var a = lum(e.getAttribute('data-contrast')), b = lum('#FFFFFF'), r = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    e.textContent = nf1.format(r) + ':1 sobre blanco';
  });
})();
