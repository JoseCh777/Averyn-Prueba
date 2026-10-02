(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero guiado por scroll: tres fases (0 a 1) con easing suave.
     t1: la A negra y la palabra "Averyn" se revelan.
     t2: el logo se reduce y sube.
     t3: aparece la figura abstracta, la bajada y los botones. */
  var stage = document.getElementById('inicio');
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ease = function (t) { return t * t * (3 - 2 * t); };
  var phase = function (p, from, to) { return ease(clamp((p - from) / (to - from))); };

  var lockup = document.querySelector('.mn-lockup');
  var fitLogo = function () {
    if (!lockup) return;
    var w0 = lockup.offsetWidth;
    var wf = Math.min(372, Math.max(186, window.innerWidth * 0.258)); /* ancho final del logo en px */
    lockup.style.setProperty('--sf', (wf / w0).toFixed(4));
  };
  fitLogo();
  window.addEventListener('resize', fitLogo);

  var brand = document.querySelector('.mn-brand');
  var copy = document.querySelector('.mn-copy');
  var gate = function (el, off) {
    if (!el) return;
    if (off) { el.setAttribute('inert', ''); } else { el.removeAttribute('inert'); }
  };

  var setVars = function (t1, t2, t3) {
    root.style.setProperty('--t1', t1.toFixed(4));
    root.style.setProperty('--t2', t2.toFixed(4));
    root.style.setProperty('--t3', t3.toFixed(4));
  };

  if (stage && !reduceMotion) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var span = stage.offsetHeight - window.innerHeight;
      var p = span > 0 ? clamp(-stage.getBoundingClientRect().top / span) : 1;
      var t1 = phase(p, 0.04, 0.30), t2 = phase(p, 0.30, 0.50), t3 = phase(p, 0.42, 0.72);
      setVars(t1, t2, t3);
      /* Lo que aún no se ve no recibe foco ni lo leen los lectores de pantalla */
      gate(brand, t2 < 0.6);
      gate(copy, t3 < 0.5);
    };
    var request = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  } else {
    setVars(1, 1, 1);
  }

  /* Menú móvil */
  var burger = document.querySelector('.mn-burger');
  var nav = document.getElementById('mn-nav');
  if (burger && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.textContent = open ? 'CERRAR' : 'MENÚ';
    };
    burger.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); burger.focus(); }
    });
  }

  /* Volver arriba */
  var backToTop = document.querySelector('.mn-top');
  var updateBackToTop = function () {
    if (!backToTop) return;
    var visible = window.scrollY > window.innerHeight * 1.5;
    backToTop.classList.toggle('is-visible', visible);
    backToTop.setAttribute('aria-hidden', String(!visible));
    backToTop.tabIndex = visible ? 0 : -1;
  };
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* Revelado al hacer scroll */
  var revealTargets = document.querySelectorAll('.mn-reveal');
  if ('IntersectionObserver' in window && revealTargets.length > 0) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
