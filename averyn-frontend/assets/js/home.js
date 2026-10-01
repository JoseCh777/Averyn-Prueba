(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menú móvil */
  var burger = document.querySelector('.lp-burger');
  var nav = document.getElementById('lp-nav');
  if (burger && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.textContent = open ? 'CERRAR' : 'MENÚ';
    };
    burger.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  /* Volver arriba */
  var backToTop = document.querySelector('.lp-top');
  var updateBackToTop = function () {
    if (!backToTop) return;
    var visible = window.scrollY > 520;
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
  var revealTargets = document.querySelectorAll('.lp-reveal');
  if ('IntersectionObserver' in window && revealTargets.length > 0) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Isotipo del hero: las capas se desplazan con el cursor y el scroll */
  var hero = document.getElementById('inicio');
  if (hero && !reduceMotion) {
    var ticking = false;
    var setVars = function (mx, sy) {
      hero.style.setProperty('--mx', mx.toFixed(3));
      hero.style.setProperty('--sy', sy.toFixed(1));
    };
    var mx = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { setVars(mx, window.scrollY); ticking = false; });
      }
    });
    window.addEventListener('scroll', function () {
      if (!ticking && window.scrollY < window.innerHeight * 1.2) {
        ticking = true;
        requestAnimationFrame(function () { setVars(mx, window.scrollY); ticking = false; });
      }
    }, { passive: true });
  }
})();
