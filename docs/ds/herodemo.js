/* Demo del hero guiado por scroll (Patrones › Patrones de página). Misma matemática que averyn-frontend/assets/js/home.js. */
(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;

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
