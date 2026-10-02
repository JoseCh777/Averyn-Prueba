/* Fundamentos: exportación de tokens (W3C). Lee el JSON incrustado en la página (#tokens-data). */
(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;
  function download(name, text, type) {
    var a = document.createElement('a'); a.download = name;
    a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain;charset=utf-8' }));
    document.body.appendChild(a); a.click(); a.remove(); DS.toast('Descarga lista', name);
  }

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
