(function () {
  'use strict';

  var MOCK = { email: 'admin@averyn.test', password: 'Averyn2026', rol: 'Administrador' };
  var SESSION_KEY = 'averyn.session';
  var EMAIL_RE = /^\S+@\S+\.\S+$/;

  var saveSession = function (email) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        email: email,
        rol: MOCK.rol,
        loggedAt: new Date().toISOString()
      }));
    } catch (e) { /* localStorage no disponible */ }
  };

  var hasSession = function () {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return Boolean(raw && JSON.parse(raw).email);
    } catch (e) { return false; }
  };

  if (hasSession()) {
    try {
      fetch('dashboard/index.html', { method: 'HEAD', cache: 'no-store' })
        .then(function (res) { if (res.ok) { window.location.replace('dashboard/index.html'); } })
        .catch(function () {});
    } catch (e) { /* file:// o CORS: se muestra el login */ }
  }

  var hide = function (el) { el.hidden = true; };

  var form = document.getElementById('login-form');
  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');
  var emailError = document.getElementById('email-error');
  var passwordError = document.getElementById('password-error');
  var forgotLink = document.getElementById('forgot-link');
  var toggleBtn = document.getElementById('toggle-password');
  var submitBtn = document.getElementById('submit-btn');
  var idleLabel = document.getElementById('submit-idle');
  var loadingLabel = document.getElementById('submit-loading');
  var alertError = document.getElementById('alert-error');
  var alertSuccess = document.getElementById('alert-success');
  var alertInfo = document.getElementById('alert-info');
  var secureNote = document.getElementById('secure-note');
  var alertIds = ['alert-error', 'alert-success', 'alert-info'];

  /* La nota de conexión segura solo se muestra si la página realmente va por HTTPS */
  if (secureNote && window.location.protocol === 'https:') { secureNote.hidden = false; }

  var show = function (el, msg) {
    el.querySelector('span').textContent = msg || '';
    el.hidden = false;
  };

  var setLoading = function (loading) {
    submitBtn.disabled = loading;
    idleLabel.hidden = loading;
    loadingLabel.hidden = !loading;
    form.setAttribute('aria-busy', String(loading));
  };

  /* Error de un campo: mensaje junto al campo, aria-invalid y aria-describedby */
  var setFieldError = function (input, errorEl, msg) {
    if (msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('av-input--error');
    } else {
      errorEl.textContent = '';
      errorEl.hidden = true;
      input.removeAttribute('aria-invalid');
      input.classList.remove('av-input--error');
    }
  };

  var resetState = function () {
    alertIds.forEach(function (id) { hide(document.getElementById(id)); });
    setFieldError(emailInput, emailError, '');
    setFieldError(passwordInput, passwordError, '');
  };

  /* Al corregir un campo se limpia solo su error */
  emailInput.addEventListener('input', function () { setFieldError(emailInput, emailError, ''); });
  passwordInput.addEventListener('input', function () {
    setFieldError(passwordInput, passwordError, '');
    hide(alertError);
  });

  /* El nombre del botón es su texto visible (Mostrar / Ocultar): evita que el nombre y el estado se contradigan */
  toggleBtn.addEventListener('click', function () {
    var showing = passwordInput.type === 'text';
    passwordInput.type = showing ? 'password' : 'text';
    toggleBtn.textContent = showing ? 'Mostrar' : 'Ocultar';
  });

  forgotLink.addEventListener('click', function () {
    resetState();
    show(alertInfo, 'La recuperación aún no está disponible; contacta a tu administrador.');
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    resetState();

    var email = emailInput.value.trim();
    var password = passwordInput.value;

    var emailMsg = !email ? 'Ingresa tu correo electrónico.'
      : (!EMAIL_RE.test(email) ? 'Ingresa un correo válido, por ejemplo nombre@organizacion.com.' : '');
    var passwordMsg = !password ? 'Ingresa tu contraseña.' : '';

    if (emailMsg || passwordMsg) {
      setFieldError(emailInput, emailError, emailMsg);
      setFieldError(passwordInput, passwordError, passwordMsg);
      (emailMsg ? emailInput : passwordInput).focus(); /* foco al primer campo con error */
      return;
    }

    setLoading(true);
    window.setTimeout(function () {
      if (email.toLowerCase() === MOCK.email && password === MOCK.password) {
        /* Éxito: el botón sigue bloqueado mientras se redirige */
        saveSession(email.toLowerCase());
        show(alertSuccess, 'Autenticación exitosa. Redirigiendo al panel de control...');
        window.setTimeout(function () {
          window.location.href = 'dashboard/index.html';
        }, 900);
      } else {
        setLoading(false);
        show(alertError, 'Credenciales inválidas. Verifica tu correo y contraseña e inténtalo nuevamente.');
        passwordInput.setAttribute('aria-invalid', 'true');
        passwordInput.classList.add('av-input--error');
        passwordInput.value = '';
        passwordInput.focus(); /* el foco vuelve al campo que hay que corregir */
      }
    }, 850);
  });
})();
