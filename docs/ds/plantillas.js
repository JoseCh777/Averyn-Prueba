/* Plantillas: cada pantalla se arma como un documento HTML (srcdoc) con los mismos estilos de esta página
   y se muestra escalada en un marco; "Ver a pantalla completa" la abre a tamaño real en un diálogo. */
(function () {
  'use strict';
  var DS = window.DS, $ = DS.$, $$ = DS.$$;
  var logo = ($('.ds-side__brand img') || {}).src || '';

  /* Estilos de la página actual (links o <style>), para que el iframe se vea igual */
  function styles() {
    return $$('head link[rel="stylesheet"], head style').map(function (n) { return n.outerHTML; }).join('\n');
  }

  /* ---------- Piezas comunes ---------- */
  var DOCK = [['Panel', 'p'], ['Personas', 'personas'], ['Documentos', 'docs'], ['Biometría', 'bio'], ['Accesos', 'soon'], ['Reportes', 'soon']];
  function shell(active, inner) {
    var dock = DOCK.map(function (d) { return d[1] === 'soon' ? '<span class="soon" title="Próximamente">' + d[0] + '</span>' : '<a href="#"' + (d[1] === active ? ' aria-current="page"' : '') + '>' + d[0] + '</a>'; }).join('');
    return '<header class="hz-nav"><span class="hz-brandchip"><img src="' + logo + '" alt="Averyn"></span><nav class="hz-dock" aria-label="Módulos">' + dock + '</nav>' +
      '<button class="hz-avatar" type="button"><span class="hz-avatar__c" aria-hidden="true">UD</span><span><b>Usuario Demo</b><small>Administrador</small></span></button></header><main class="tp-main">' + inner + '</main>';
  }
  var head = function (crumb, title, sub, actions) {
    return '<div class="tp-head"><div><p class="hz-crumb mono">' + crumb + '</p><h1>' + title + '</h1><p class="tp-sub">' + sub + '</p></div><div style="display:flex;gap:.6rem">' + (actions || '') + '</div></div>';
  };
  var sk = function (n) { var s = ''; for (var i = 0; i < n; i++) s += '<i style="width:' + (100 - i * 9) + '%"></i>'; return '<div class="tp-sk" role="status" aria-label="Cargando">' + s + '</div>'; };
  var STATE = {
    empty: function (ic, t, p, btn) { return '<div class="tp-state"><i class="bi ' + ic + '" aria-hidden="true"></i><b>' + t + '</b><p>' + p + '</p>' + (btn ? '<button class="hz-btn hz-btn--ghost" type="button">' + btn + '</button>' : '') + '</div>'; },
    loading: sk,
    error: function () { return '<div class="hz-alert hz-alert--error" role="alert"><strong>No pudimos cargar los datos</strong>Revisa tu conexión e inténtalo de nuevo.</div><div style="margin-top:.8rem"><button class="hz-btn hz-btn--ghost" type="button">Reintentar</button></div>'; }
  };
  var ICON = { success: 'bi-check-circle', error: 'bi-x-circle', warning: 'bi-exclamation-circle', info: 'bi-info-circle', neutral: 'bi-clock', brand: 'bi-stars' };
  var chip = function (t, k, ic) { return '<span class="hz-chip hz-chip--' + k + '"><i class="bi ' + (ic || ICON[k]) + '" aria-hidden="true"></i>' + t + '</span>'; };

  /* ---------- Plantillas ---------- */
  var T = {};

  T.bitacora = function (st) {
    var rows = [['10:42', 'BIOMETRIC_VERIFIED', 'Ana Lucía Pérez', 'CAM-001', 'Aceptada', 'success'], ['10:31', 'LOGIN', 'Carlos Mendoza', 'Web', 'Correcto', 'success'], ['10:15', 'BIOMETRIC_VERIFIED', 'Lucía Ramos', 'LEC-002', 'Rechazada', 'error'],
      ['09:58', 'DOCUMENT_REGISTERED', 'Diego Torres', 'Web', 'Correcto', 'success'], ['09:40', 'PERSON_CREATED', 'Valeria Quispe', 'Web', 'Correcto', 'success'], ['09:12', 'BIOMETRIC_ENROLLED', 'Jorge Salazar', 'CAM-002', 'Correcto', 'success'],
      ['08:55', 'VOTE_CAST', '— (anónimo)', 'KIOSCO-01', 'Registrado', 'info'], ['08:30', 'LOGIN', 'Mariana Cruz', 'Web', 'Fallido', 'error']];
    var data = st === 'empty' ? STATE.empty('bi-journal-text', 'Sin eventos en este periodo', 'Prueba con un periodo más amplio o quita algún filtro.', 'Ampliar a 90 días')
      : st === 'loading' ? sk(7) : st === 'error' ? STATE.error()
      : '<table class="tp-t"><thead><tr><th>Hora</th><th>Evento</th><th>Persona</th><th>Dispositivo</th><th>Resultado</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td class="tp-mono">' + r[0] + '</td><td class="tp-ev">' + r[1] + '</td><td>' + r[2] + '</td><td class="tp-mono">' + r[3] + '</td><td>' + chip(r[4], r[5]) + '</td></tr>'; }).join('') + '</tbody></table><div class="tp-foot"><span>Mostrando 1–8 de 1,953</span><div class="hz-pager" role="navigation" aria-label="Paginación"><button type="button" disabled aria-label="Anterior">←</button><button type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><button type="button" aria-label="Siguiente">→</button></div></div>';
    return shell('p', head('Panel / <b>Bitácora</b>', 'Bitácora de auditoría', 'Quién hizo qué y cuándo. Solo lectura.', '<button class="hz-btn hz-btn--ghost" type="button">Exportar CSV</button>') +
      '<div class="tp-bar"><span class="tp-btn"><i class="bi bi-calendar3" aria-hidden="true"></i>Últimos 30 días<i class="bi bi-chevron-down" aria-hidden="true"></i></span><select class="hz-select" aria-label="Tipo de evento"><option>Todos los eventos</option></select><input class="hz-input" type="search" placeholder="Buscar persona o dispositivo" aria-label="Buscar"></div>' +
      '<div class="tp-card">' + data + '</div>');
  };

  T.configuracion = function () {
    var sw = function (on, l, d) { return '<div class="tp-row"><div><b>' + l + '</b><small>' + d + '</small></div><button class="hz-switch" role="switch" aria-checked="' + on + '" aria-label="' + l + '" type="button"></button></div>'; };
    return shell('bio', head('Panel / Configuración / <b>Biometría</b>', 'Configuración', 'Ajustes de tu institución.') +
      '<div class="tp-cols"><nav class="tp-sub-nav" aria-label="Secciones"><a href="#">General</a><a href="#">Seguridad</a><a href="#" aria-current="page">Biometría</a><a href="#">Notificaciones</a><a href="#">Dispositivos</a></nav><div>' +
      '<section class="tp-card"><h2>Umbral de verificación</h2><p>Puntaje mínimo para aceptar una verificación.</p><div class="hz-field" style="max-width:14rem"><label class="hz-label" for="u">Umbral (0 a 1)</label><input class="hz-input" id="u" value="0.68" readonly aria-describedby="uh"><span class="hz-help" id="uh">Lo define el servidor. Cambiarlo requiere permiso de Administrador.</span></div></section>' +
      '<section class="tp-card"><h2>Dispositivos</h2><p>Qué hacer cuando algo falla.</p>' + sw(true, 'Avisar si un dispositivo se desconecta', 'Notificación y banner en el panel.') + sw(true, 'Reintentar la lectura automáticamente', 'Hasta 2 veces antes de pedir ayuda.') + sw(false, 'Permitir verificación sin conexión', 'Desactivado: requiere conexión con el servidor.') + '</section>' +
      '<section class="tp-card"><h2>Retención de datos</h2><p>Cuánto tiempo se conservan las plantillas biométricas tras el fin del vínculo.</p><div class="hz-field" style="max-width:20rem"><label class="hz-label" for="r">Eliminar a los</label><select class="hz-select" id="r"><option>30 días</option><option>90 días</option></select></div></section>' +
      '<div class="tp-save"><span><i class="bi bi-dot" style="color:var(--av-blue)" aria-hidden="true"></i>Tienes cambios sin guardar.</span><span style="display:flex;gap:.6rem"><button class="hz-btn hz-btn--ghost" type="button">Descartar</button><button class="hz-btn hz-btn--primary" type="button">Guardar cambios</button></span></div>' +
      '<section class="tp-card tp-danger" style="margin-top:1.4rem"><h2>Zona de peligro</h2><p>Estas acciones no se pueden deshacer.</p><button class="hz-btn hz-btn--danger" type="button">Revocar todos los consentimientos…</button></section></div></div>');
  };

  T.persona = function (st) {
    var feed = st === 'loading' ? sk(5) : st === 'error' ? '<div class="hz-alert hz-alert--error" role="alert"><strong>No pudimos cargar la actividad</strong>Los datos de la persona sí se cargaron.</div>'
      : '<ul class="hz-feed"><li><b>Verificación biométrica</b><span>Rostro verificado · 0.82</span><small>HOY, 10:42 · CAM-001</small></li><li><b>Inicio de sesión</b><span>Correcto</span><small>AYER, 08:15 · WEB</small></li><li class="retry"><b>Verificación biométrica</b><span>Huella con reintento</span><small>30 SEP, 12:20 · LEC-001</small></li><li><b>Biometría registrada</b><span>Rostro y huella</span><small>29 SEP, 17:30 · CAM-002</small></li></ul>';
    return shell('personas', '<p class="hz-crumb mono" style="margin-bottom:1.2rem">Panel / Personas / <b>Ana Lucía Pérez</b></p>' +
      '<div class="tp-head"><div class="tp-who"><span class="tp-ava" aria-hidden="true">AP</span><div><h1>Ana Lucía Pérez</h1><div class="tp-chips">' + chip('Activa', 'success') + chip('Rostro y huella', 'info', 'bi-fingerprint') + chip('Estudiante', 'neutral', 'bi-mortarboard') + '</div></div></div><div style="display:flex;gap:.6rem"><button class="hz-btn hz-btn--primary" type="button">Editar datos</button><button class="tp-btn" type="button" aria-label="Más acciones"><i class="bi bi-three-dots" aria-hidden="true"></i></button></div></div>' +
      '<div class="tp-split"><div><section class="tp-card"><h2>Datos</h2><dl class="tp-kv"><div><dt>Documento</dt><dd>12345678</dd></div><div><dt>Correo</dt><dd>ana.perez@ejemplo.edu</dd></div><div><dt>Teléfono</dt><dd>+51 999 000 111</dd></div><div><dt>Institución</dt><dd>Universidad Horizonte · Sede Central</dd></div><div><dt>Registrada</dt><dd>29 sep 2026</dd></div></dl></section>' +
      '<section class="tp-card"><h2>Biometría</h2><dl class="tp-kv"><div><dt>Rostro</dt><dd>Registrado el 29 sep · calidad 92/100</dd></div><div><dt>Huella</dt><dd>2 dedos · calidad 86/100</dd></div><div><dt>Consentimiento</dt><dd>Aceptado el 29 sep · <a href="#" style="color:var(--av-error-text);font-weight:600">Revocar</a></dd></div></dl></section></div>' +
      '<aside class="tp-night"><h2>Actividad reciente</h2>' + feed + '</aside></div>');
  };

  T.asistente = function () {
    var steps = ['Datos', 'Candidaturas', 'Padrón', 'Revisión'], li = steps.map(function (s, i) { var k = i < 2 ? 'done' : i === 2 ? 'now' : 'pending'; return '<li class="st__li" data-s="' + k + '"' + (i === 2 ? ' aria-current="step"' : '') + '><span class="st__n" aria-hidden="true">' + (k === 'done' ? '✓' : i + 1) + '</span><span class="st__t">' + s + '</span></li>'; }).join('');
    return shell('p', head('Panel / Electoral / <b>Nueva elección</b>', 'Nueva elección', 'Elecciones de ejemplo · borrador guardado hace 2 min.') +
      '<div class="tp-card"><ol class="st__list tp-steps" aria-label="Pasos">' + li + '</ol><h2>Padrón electoral</h2><p>Sube el listado de personas habilitadas para votar. Aceptamos CSV o Excel.</p>' +
      '<div class="hz-drop" tabindex="0" role="button" aria-label="Subir padrón"><span class="ic"><i class="bi bi-cloud-arrow-up" aria-hidden="true"></i></span><b>Arrastra el archivo aquí</b><p>o haz clic para elegirlo · CSV o XLSX · máx. 10 MB</p></div>' +
      '<div style="margin-top:1.1rem" class="hz-alert hz-alert--warning" role="status"><strong>1,240 personas leídas · 3 sin documento</strong>Puedes continuar: las 3 filas se pueden corregir luego en Personas.</div>' +
      '<div class="tp-foot-bar"><span class="st__count">Paso 3 de 4</span><span style="display:flex;gap:.6rem"><button class="hz-btn hz-btn--ghost" type="button">Atrás</button><button class="hz-btn hz-btn--primary" type="button">Siguiente →</button></span></div></div>');
  };

  T.notificaciones = function (st) {
    var item = function (ic, k, t, d, tm, u, a) { return '<div class="tp-n' + (u ? ' unread' : '') + '"><span class="tp-n__ic ' + k + '"><i class="bi ' + ic + '" aria-hidden="true"></i></span><div><b>' + t + '</b><small>' + d + ' · ' + tm + '</small></div><button class="hz-btn hz-btn--text" type="button" style="min-height:44px">' + a + '</button></div>'; };
    var data = st === 'empty' ? STATE.empty('bi-bell', 'No tienes notificaciones', 'Cuando haya novedades, aparecerán aquí.') : st === 'loading' ? sk(6)
      : '<p class="tp-n-grp">Hoy</p>' + item('bi-camera-video-off', 'tp-n__ic--warn', 'Dispositivo desconectado', 'CAM-002 no responde desde las 08:10', 'hace 2 h', true, 'Ver dispositivo') + item('bi-x-circle', 'tp-n__ic--bad', 'Verificación rechazada', 'Lucía Ramos · LEC-002', 'hace 30 min', true, 'Ver detalle') + item('bi-person-plus', '', 'Persona registrada', 'Valeria Quispe se registró en Sede Central', 'hace 1 h', true, 'Ver persona') +
        '<p class="tp-n-grp">Ayer</p>' + item('bi-file-earmark-check', '', 'Padrón cargado', '1,240 personas · Elecciones de ejemplo', 'ayer, 17:20', false, 'Ver padrón') + item('bi-shield-check', '', 'Cambio de umbral solicitado', 'Pendiente de aprobación del administrador', 'ayer, 11:05', false, 'Revisar');
    return shell('p', head('Panel / <b>Notificaciones</b>', 'Notificaciones', 'Lo que pasó mientras no mirabas.', '<button class="hz-btn hz-btn--ghost" type="button">Marcar todas como leídas</button>') +
      '<div class="tp-card"><div class="hz-tabs" role="tablist" aria-label="Filtro" style="margin-bottom:1rem"><button class="hz-tab" role="tab" aria-selected="true" type="button">Todas · 5</button><button class="hz-tab" role="tab" aria-selected="false" type="button">Sin leer · 3</button></div>' + data + '</div>');
  };

  T.perfil = function () {
    return shell('p', head('Panel / <b>Perfil</b>', 'Tu perfil', 'Datos de tu cuenta, seguridad y privacidad.') +
      '<div class="tp-cols"><aside class="tp-card" style="text-align:center"><span class="tp-ava" style="margin:0 auto .8rem" aria-hidden="true">UD</span><b style="font:500 1.2rem var(--av-font-heading)">Usuario Demo</b><p style="margin:.2rem 0 .8rem;color:var(--av-gray-600);font-size:.875rem">Administrador · Sede Central</p>' + chip('Biometría registrada', 'success') + '</aside><div>' +
      '<section class="tp-card"><h2>Datos personales</h2><p>El correo no se puede cambiar desde aquí.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem"><div class="hz-field"><label class="hz-label" for="n">Nombre</label><input class="hz-input" id="n" value="Usuario Demo"></div><div class="hz-field"><label class="hz-label" for="t">Teléfono</label><input class="hz-input" id="t" value="+51 999 000 111"></div><div class="hz-field" style="grid-column:1/-1"><label class="hz-label" for="c">Correo</label><input class="hz-input" id="c" value="usuario@ejemplo.edu" readonly></div></div><div style="margin-top:1rem"><button class="hz-btn hz-btn--primary" type="button">Guardar</button></div></section>' +
      '<section class="tp-card"><h2>Seguridad</h2><p>Contraseña y sesiones abiertas.</p><div class="tp-row"><div><b>Contraseña</b><small>Cambiada hace 3 meses</small></div><button class="hz-btn hz-btn--ghost" type="button">Cambiar</button></div><div class="tp-row"><div><b>Este dispositivo · Windows, Edge</b><small>Lima · activa ahora</small></div>' + chip('Sesión actual', 'info') + '</div><div class="tp-row"><div><b>Móvil · Android, Chrome</b><small>Lima · hace 2 días</small></div><button class="hz-btn hz-btn--ghost" type="button">Cerrar sesión</button></div></section>' +
      '<section class="tp-card"><h2>Biometría y privacidad</h2><p>Guardamos una plantilla matemática, nunca fotos.</p><div class="tp-row"><div><b>Rostro</b><small>Registrado el 29 sep</small></div>' + chip('Activo', 'success') + '</div><div class="tp-row"><div><b>Huella</b><small>2 dedos · 29 sep</small></div>' + chip('Activo', 'success') + '</div><div style="margin-top:.6rem"><button class="hz-btn hz-btn--text" type="button" style="color:var(--av-error-text)">Retirar mi consentimiento…</button></div></section></div></div>');
  };


  /* ---------- Acceso y cuenta (mismo marco del login) ---------- */
  var ARCS = '<svg viewBox="0 0 640 300" aria-hidden="true"><path d="M0 290 H640" stroke="rgba(255,255,255,.22)" fill="none"/><path d="M30 290 C110 60 330 40 450 290" stroke="#fff" stroke-width="1.5" fill="none"/><path d="M90 290 C150 110 300 95 390 290" stroke="#00ACD2" stroke-width="2" fill="none"/><path d="M150 290 C190 170 270 160 330 290" stroke="#55D6FF" stroke-width="1.5" fill="none"/><path d="M300 8 L545 290" stroke="#3D86FF" stroke-width="2" fill="none"/><path d="M326 -32 L605 290" stroke="#3D86FF" stroke-width="2" fill="none"/></svg>';
  function auth(inner, claim) {
    return '<div class="tp-auth"><div class="hz-frame"><div class="hz-frame__brand"><img src="' + logo + '" alt="Averyn">' + ARCS + '<div><h4>' + (claim || 'Todo listo para continuar.') + '</h4></div></div><div class="hz-frame__form">' + inner + '</div></div></div>';
  }
  var back = '<a href="#" class="mono tp-back">← Volver a ingresar</a>';
  var alertH = function (k, t, d, role) { return '<div class="hz-alert hz-alert--' + k + '" role="' + (role || 'status') + '"><strong>' + t + '</strong>' + d + '</div>'; };
  var field = function (id, label, val, extra) { return '<div class="hz-field"><label class="hz-label" for="' + id + '">' + label + '</label><input class="hz-input" id="' + id + '" value="' + (val || '') + '" ' + (extra || '') + '></div>'; };
  var btn = function (t, k, dis) { return '<button class="hz-btn hz-btn--' + (k || 'primary') + ' hz-btn--block" type="button"' + (dis ? ' disabled' : '') + '>' + t + '</button>'; };

  /* Login y organización no encontrada: errores decididos por el `code` de la API (contrato de Auth v0.2) */
  T.login = function (st) {
    var busy = st === 'cargando', lock = st === 'bloqueado';
    var msg = st === 'error' ? alertH('error', 'Correo o contraseña incorrectos', 'Revisa los datos e inténtalo de nuevo. Por seguridad no indicamos cuál de los dos falló.', 'alert')
      : lock ? alertH('warning', 'Demasiados intentos', 'Por seguridad bloqueamos el acceso un momento. Podrás volver a intentarlo en <b>14:32</b>.', 'alert')
      : st === 'inesperado' ? alertH('error', 'Algo falló de nuestro lado', 'No pudimos iniciar tu sesión. Inténtalo de nuevo; si sigue pasando, comparte este código con tu administrador: <span class="mono">7f3c9a1e</span>', 'alert') : '';
    var off = busy || lock ? ' disabled' : '';
    return auth('<h1 class="tp-h1">Bienvenido de nuevo.</h1><p class="tp-p">Ingresa con tu cuenta de <b>Universidad Horizonte</b>.</p>' + msg +
      field('lg-em', 'Correo electrónico', st === 'normal' ? '' : 'ana@horizonte.edu', 'type="email" autocomplete="username" placeholder="nombre@organizacion.com"' + off) +
      field('lg-pw', 'Contraseña', st === 'normal' ? '' : 'contrasena-demo', 'type="password" autocomplete="current-password" placeholder="Ingresa tu contraseña"' + off) +
      (busy ? '<button class="hz-btn hz-btn--primary hz-btn--block" type="button" aria-busy="true" disabled>Ingresando…</button>' : btn('Ingresar de forma segura →', 'primary', lock)) +
      '<p class="tp-p" style="margin-top:1rem;font-size:.82rem">¿Olvidaste tu contraseña? La recuperación aún no está disponible; contacta a tu administrador.</p>');
  };

  T.tenant = function () {
    return auth('<span class="mono" style="color:var(--av-gray-500)">Error 404 · Organización no encontrada</span><h1 class="tp-h1">No encontramos esta organización.</h1><p class="tp-p">La dirección que abriste no corresponde a una organización de Averyn. Revisa que esté bien escrita o pide el enlace correcto a tu administrador.</p>' +
      alertH('info', 'Código de soporte', 'TENANT_NOT_FOUND · <span class="mono">7f3c9a1e</span>') + '<p class="tp-p" style="font-size:.82rem">No decimos por qué: la misma pantalla aparece si la organización no existe o no está disponible.</p>', 'Cada organización, su propio espacio.');
  };

  T.recuperar = function (st) {
    var body;
    if (st === 'enviado') body = '<h1 class="tp-h1">Revisa tu correo</h1><p class="tp-p">Si hay una cuenta con ese correo, te enviamos un enlace para elegir una nueva contraseña. Puede tardar unos minutos; revisa también la carpeta de spam.</p>' + alertH('info', 'Por seguridad no confirmamos si el correo existe', 'El mensaje es el mismo para cualquier dirección.') + btn('Reenviar enlace (disponible en 30 s)', 'ghost', true);
    else if (st === 'nueva') body = '<h1 class="tp-h1">Elige una nueva contraseña</h1><p class="tp-p">Usa al menos 10 caracteres. Este enlace solo sirve una vez.</p>' +
      '<div class="hz-field"><label class="hz-label" for="p1">Nueva contraseña</label><input class="hz-input" id="p1" type="password" value="Horizonte26"></div><div class="pw" data-lv="3" style="margin:-.2rem 0 .3rem"><div class="pw__bar" aria-hidden="true"><i></i><i></i><i></i><i></i></div><p class="pw__st">Seguridad: Buena. Cumples 3 de 4 requisitos.</p></div>' + field('p2', 'Confirma la contraseña', '', 'type="password"') + btn('Guardar contraseña');
    else if (st === 'vencido') body = '<h1 class="tp-h1">Este enlace venció</h1><p class="tp-p">Por seguridad, los enlaces de recuperación duran 30 minutos y solo se pueden usar una vez.</p>' + alertH('warning', 'No pasa nada: puedes pedir uno nuevo', 'Te lo enviaremos al mismo correo.') + btn('Pedir un enlace nuevo');
    else body = '<h1 class="tp-h1">Recupera tu acceso</h1><p class="tp-p">Escribe el correo de tu cuenta y te enviaremos un enlace para elegir una nueva contraseña.</p>' + field('em', 'Correo electrónico', '', 'placeholder="nombre@organizacion.com" type="email"') + btn('Enviar enlace →');
    return auth(back + body);
  };

  T.segundo = function (st) {
    var cells = '', vals = st === 'ok' ? '482913' : '';
    for (var i = 0; i < 6; i++) cells += '<input class="otp__d" value="' + (vals[i] || '') + '" aria-label="Dígito ' + (i + 1) + ' de 6"' + (st === 'bloqueado' || st === 'ok' ? ' disabled' : '') + '>';
    var msg = st === 'error' ? 'Código incorrecto. Te quedan 2 intentos.' : st === 'bloqueado' ? 'Demasiados intentos. Vuelve a intentarlo en 5 minutos.' : st === 'ok' ? 'Identidad confirmada.' : '';
    return auth(back + '<h1 class="tp-h1">Confirma que eres tú</h1><p class="tp-p">Ingresa el código de 6 dígitos que enviamos a <b>a•••@ejemplo.edu</b>.</p><fieldset class="otp" data-s="' + (st === 'error' ? 'error' : st === 'ok' ? 'ok' : '') + '"><legend class="sr-only">Código de verificación</legend><div class="otp__row">' + cells + '</div><p class="otp__msg" role="status">' + msg + '</p></fieldset>' + btn(st === 'ok' ? 'Continuar →' : 'Verificar', 'primary', st === 'bloqueado') + '<p class="tp-p" style="margin:.4rem 0 0;text-align:center">¿No te llegó? <a href="#" class="tp-link">Reenviar código</a> · <a href="#" class="tp-link">Usar otro método</a></p>');
  };

  T.institucion = function (st) {
    var rows = [['Universidad Horizonte', 'Sede Central · Lima'], ['Universidad Horizonte', 'Sede Norte · Trujillo'], ['Instituto Cima', 'Campus Arequipa']];
    var body = st === 'sin' ? '<h1 class="tp-h1">Tu cuenta aún no tiene instituciones</h1><p class="tp-p">Pide a tu administrador que te agregue a una institución para continuar.</p>' + alertH('info', 'Te avisaremos por correo', 'Cuando te agreguen, podrás entrar con esta misma cuenta.') + btn('Cerrar sesión', 'ghost')
      : '<h1 class="tp-h1">Elige tu institución</h1><p class="tp-p">Tu cuenta pertenece a más de una. Puedes cambiar de institución después desde tu perfil.</p><div class="tp-inst" role="radiogroup" aria-label="Institución">' + rows.map(function (r, i) { return '<label class="tp-inst__o"><input type="radio" name="inst"' + (i === 0 ? ' checked' : '') + '><span><b>' + r[0] + '</b><small>' + r[1] + '</small></span></label>'; }).join('') + '</div>' + btn('Continuar →');
    return auth(body, 'Una cuenta, varias instituciones.');
  };

  T.invitacion = function (st) {
    var body;
    if (st === 'vencida') body = '<h1 class="tp-h1">Esta invitación venció</h1><p class="tp-p">Las invitaciones duran 48 horas. Pide una nueva a quien te invitó.</p>' + alertH('warning', 'Invitada por Carlos Mendoza', 'Universidad Horizonte · enviada el 28 sep 2026') + btn('Volver al inicio', 'ghost');
    else if (st === 'usada') body = '<h1 class="tp-h1">Esta invitación ya se usó</h1><p class="tp-p">Si ya creaste tu cuenta, ingresa con tu correo y tu contraseña.</p>' + btn('Ingresar →');
    else body = '<span class="mono" style="color:var(--av-gray-500)">Invitación de Carlos Mendoza</span><h1 class="tp-h1">Te invitaron a Averyn</h1><p class="tp-p"><b>Universidad Horizonte</b> te invitó a crear tu cuenta. Tardas unos minutos.</p>' + field('inv-n', 'Nombre completo', 'Ana Torres') + field('inv-p', 'Crea una contraseña', '', 'type="password" placeholder="Al menos 10 caracteres"') + '<label class="hz-check"><input type="checkbox"> Acepto los términos de uso</label><p class="tp-p" style="margin:0">El consentimiento para usar tu rostro y huella se pide más adelante, antes de la primera captura.</p>' + btn('Crear mi cuenta →');
    return auth(body, 'Bienvenido a tu panel.');
  };


  /* ---------- Escrutinio, mesas y roles (propuesta de diseño) ---------- */
  T.escrutinio = function (st) {
    var fin = st === 'final';
    var lists = fin ? [['Lista 1 · Horizonte', 1021], ['Lista 2 · Cima', 812], ['Lista 3 · Raíz', 487], ['Voto en blanco', 128]] : [['Lista 1 · Horizonte', 812], ['Lista 2 · Cima', 648], ['Lista 3 · Raíz', 391], ['Voto en blanco', 102]];
    var tot = lists.reduce(function (s, l) { return s + l[1]; }, 0), max = Math.max.apply(null, lists.map(function (l) { return l[1]; }));
    var kpi = function (l, v, n) { return '<article class="kt"><h3 class="cc__label" style="margin:0">' + l + '</h3><p class="cc__value">' + v + '</p><p class="cc__meta"><span>' + n + '</span></p></article>'; };
    if (st === 'sin') return shell('p', head('Panel / Electoral / <b>Escrutinio</b>', 'Escrutinio', 'Elecciones de ejemplo') + '<div class="tp-card">' + STATE.empty('bi-inbox', 'Aún no hay mesas reportadas', 'Cuando la primera mesa reporte, aquí aparecerán la participación y los votos por lista.') + '</div>');
    var mesas = [['Mesa 01', 'Aula 101', 'success', 'Reportada', 'bi-check-circle', '312', '19:42'], ['Mesa 02', 'Aula 102', 'success', 'Reportada', 'bi-check-circle', '298', '19:48'], ['Mesa 03', 'Aula 201', 'info', 'En conteo', 'bi-hourglass-split', '—', '—'], ['Mesa 04', 'Auditorio', 'neutral', 'Sin reportar', 'bi-clock', '—', '—'], ['Mesa 05', 'Biblioteca', 'success', 'Reportada', 'bi-check-circle', '276', '19:55']];
    if (fin) mesas = mesas.map(function (m) { return [m[0], m[1], 'success', 'Reportada', 'bi-check-circle', m[5] === '—' ? '254' : m[5], m[6] === '—' ? '20:10' : m[6]]; });
    return shell('p', head('Panel / Electoral / <b>Escrutinio</b>', 'Escrutinio', 'Elecciones de ejemplo · actualizado hace 2 min', chip(fin ? 'Resultados finales' : 'En conteo', fin ? 'success' : 'info', fin ? 'bi-check-circle' : 'bi-hourglass-split') + ' <button class="hz-btn hz-btn--ghost" type="button">Exportar acta</button>') +
      '<div class="kpi-grid" style="margin-bottom:1rem">' + kpi('Participación', fin ? '81%' : '72%', 'Meta 80% · ' + (fin ? 'cumplida' : 'por debajo')) + kpi('Mesas reportadas', fin ? '24 de 24' : '18 de 24', fin ? 'Todas las mesas' : '6 por reportar') + kpi('Votos emitidos', tot.toLocaleString('es-PE'), 'de 2,712 habilitados') + '</div>' +
      '<div class="tp-split"><div class="tp-card"><h2>Votos por lista</h2><p>Totales por opción. Los porcentajes se calculan sobre los votos emitidos.</p><ul class="hb">' + lists.map(function (l) { return '<li class="hb__row" style="grid-template-columns:minmax(0,11rem) minmax(0,1fr) 8.5rem"><span class="hb__name">' + l[0] + '</span><span class="hb__track" role="img" aria-label="' + l[0] + ': ' + l[1] + ' votos"><span class="hb__fill" style="width:' + (l[1] / max * 100) + '%;animation:none"></span></span><span class="hb__val">' + l[1].toLocaleString('es-PE') + ' · ' + (l[1] / tot * 100).toFixed(1) + '%</span></li>'; }).join('') + '</ul></div>' +
      '<div class="tp-card"><h2>Participación frente a la meta</h2><p>Votos emitidos entre habilitados.</p><ul class="bl"><li class="bl__row" style="grid-template-columns:minmax(0,5rem) minmax(0,1fr) 3.4rem"><span class="hb__name">General</span><span class="bl__track" role="img" aria-label="Participación ' + (fin ? 81 : 72) + '% de una meta de 80%"><span class="bl__fill" style="width:' + (fin ? 81 : 72) + '%;animation:none"></span><span class="bl__goal" style="left:calc(80% - 1px)"></span></span><span class="hb__val">' + (fin ? 81 : 72) + '%</span></li></ul></div></div>' +
      '<div class="tp-card" style="margin-top:1rem"><h2>Mesas</h2><p>Estado de cada mesa y votos reportados.</p><table class="tp-t"><thead><tr><th>Mesa</th><th>Local</th><th>Estado</th><th>Votos</th><th>Reportada</th></tr></thead><tbody>' + mesas.map(function (m) { return '<tr><td class="tp-ev">' + m[0] + '</td><td>' + m[1] + '</td><td>' + chip(m[3], m[2], m[4]) + '</td><td class="tp-mono">' + m[5] + '</td><td class="tp-mono">' + m[6] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<div style="margin-top:1rem">' + alertH('info', 'Solo se muestran totales', 'Ningún dato de esta pantalla permite saber quién votó por quién.') + '</div>');
  };

  T.mesas = function (st) {
    var rows = [['Mesa 01', 'Aula 101', '312', 'Carla Rojas', 'success', 'Asignada', 'bi-check-circle'], ['Mesa 02', 'Aula 102', '305', 'Diego Torres', 'success', 'Asignada', 'bi-check-circle'], ['Mesa 03', 'Aula 201', '298', '—', 'warning', 'Sin responsable', 'bi-exclamation-circle'], ['Mesa 04', 'Auditorio', '420', 'Lucía Ramos', 'success', 'Asignada', 'bi-check-circle'], ['Mesa 05', 'Biblioteca', '276', '—', 'warning', 'Sin responsable', 'bi-exclamation-circle']];
    var data = st === 'vacio' ? STATE.empty('bi-grid-3x3-gap', 'Aún no hay mesas', 'Importa el padrón para crearlas automáticamente o añade la primera a mano.', 'Importar padrón')
      : '<table class="tp-t"><thead><tr><th>Mesa</th><th>Local</th><th>Habilitados</th><th>Responsable</th><th>Estado</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td class="tp-ev">' + r[0] + '</td><td>' + r[1] + '</td><td class="tp-mono">' + r[2] + '</td><td>' + (r[3] === '—' ? 'Sin asignar' : r[3]) + '</td><td>' + chip(r[5], r[4], r[6]) + '</td></tr>'; }).join('') + '</tbody></table><div class="tp-foot"><span>Mostrando 1–5 de 24 mesas</span><div class="hz-pager" role="navigation" aria-label="Paginación"><button type="button" disabled aria-label="Anterior">←</button><button type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><button type="button" aria-label="Siguiente">→</button></div></div>';
    return shell('p', head('Panel / Electoral / <b>Mesas y padrón</b>', 'Mesas y padrón', '24 mesas · 2,712 personas habilitadas', '<button class="hz-btn hz-btn--ghost" type="button">Importar padrón</button> <button class="hz-btn hz-btn--primary" type="button">Nueva mesa</button>') +
      '<div class="tp-bar"><input class="hz-input" type="search" placeholder="Buscar mesa o responsable" aria-label="Buscar"><select class="hz-select" aria-label="Estado"><option>Todos los estados</option></select></div><div class="tp-card">' + data + '</div>');
  };

  T.roles = function (st) {
    var dirty = st === 'cambios';
    var R = ['Administrador', 'Operador', 'Auditor', 'Solo lectura'];
    var P = [['Ver personas', [1, 1, 1, 1]], ['Registrar personas', [1, 1, 0, 0]], ['Verificar identidad', [1, 1, 0, 0]], ['Ver la bitácora', [1, 0, 1, 0]], ['Exportar datos', [1, 0, 1, 0]], ['Revocar consentimientos', [1, 0, 0, 0]], ['Administrar usuarios y roles', [1, 0, 0, 0]]];
    return shell('p', head('Panel / Configuración / <b>Roles y permisos</b>', 'Roles y permisos', 'Qué puede hacer cada rol en tu institución.') + (dirty ? alertH('warning', 'Quitar permisos a Administrador pide confirmación', 'Al guardar te pediremos que lo confirmes.') + '<div style="height:1rem"></div>' : '') +
      '<div class="tp-card"><table class="tp-t tp-matrix"><thead><tr><th scope="col">Permiso</th>' + R.map(function (r) { return '<th scope="col" style="text-align:center">' + r + '</th>'; }).join('') + '</tr></thead><tbody>' + P.map(function (p, ri) { return '<tr><th scope="row">' + p[0] + '</th>' + p[1].map(function (v, ci) { var locked = ri === P.length - 1 && ci === 0, on = v && !(dirty && ri === 3 && ci === 1) || (dirty && ri === 3 && ci === 1); return '<td style="text-align:center">' + (locked ? '<span class="tp-lock"><i class="bi bi-lock" aria-hidden="true"></i> Siempre</span>' : '<input type="checkbox" ' + (on ? 'checked ' : '') + 'aria-label="' + R[ci] + ': ' + p[0] + '">') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' +
      (dirty ? '<div class="tp-save"><span><i class="bi bi-dot" style="color:var(--av-blue)" aria-hidden="true"></i>Tienes 1 cambio sin guardar.</span><span style="display:flex;gap:.6rem"><button class="hz-btn hz-btn--ghost" type="button">Descartar</button><button class="hz-btn hz-btn--primary" type="button">Guardar cambios</button></span></div>' : '<p class="tp-p" style="margin-top:1rem">El rol Administrador siempre puede administrar usuarios: no se puede quitar para evitar que la institución se quede sin administración.</p>'));
  };

  /* ---------- Documento y marcos ---------- */
  function doc(key, st) { return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=1440">' + styles() + '</head><body class="tp">' + T[key](st) + '</body></html>'; }

  var dlg = document.createElement('dialog'); dlg.className = 'tpfull'; dlg.setAttribute('aria-labelledby', 'tpfull-t');
  dlg.innerHTML = '<div class="tpfull__h"><span id="tpfull-t"></span><button type="button" aria-label="Cerrar vista a pantalla completa"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div><iframe title="Plantilla a pantalla completa"></iframe>';
  document.body.appendChild(dlg);
  $('button', dlg).addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  var frames = [];
  $$('.tpf').forEach(function (host) {
    var key = host.getAttribute('data-t'), title = host.getAttribute('data-title'), spec = host.getAttribute('data-states');
    var list = !spec ? [] : spec === '1' ? [['normal', 'Normal'], ['empty', 'Vacío'], ['loading', 'Cargando'], ['error', 'Error']] : spec.split(',').map(function (x) { return x.split(':'); });
    var st = list.length ? list[0][0] : 'normal';
    host.innerHTML = '<div class="tpf__ctrl"><span class="stage__label mono" style="margin:0">Ejemplo de uso · ' + title + '</span>' + (list.length ? '<div class="vz-seg" role="group" aria-label="Estado de la plantilla ' + title + '">' + list.map(function (s, i) { return '<button type="button" data-s="' + s[0] + '" aria-pressed="' + (i === 0) + '">' + s[1] + '</button>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="tpf__frame"><div class="dsframe"><iframe title="Vista previa de la plantilla ' + title + '" tabindex="-1" aria-hidden="true"></iframe></div><button class="tpf__open" type="button"><i class="bi bi-arrows-fullscreen" aria-hidden="true"></i>Ver a pantalla completa</button></div>';
    var fr = $('iframe', host);
    function paint() { fr.srcdoc = doc(key, st); }
    $$('.vz-seg button', host).forEach(function (b) { b.addEventListener('click', function () { st = b.getAttribute('data-s'); $$('.vz-seg button', host).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); paint(); }); });
    $('.tpf__open', host).addEventListener('click', function () { $('#tpfull-t').textContent = title + ' · ejemplo ilustrativo, no es el producto final'; $('iframe', dlg).srcdoc = doc(key, st); dlg.showModal(); });
    frames.push(host); paint();
  });
  function scale() { frames.forEach(function (h) { var box = $('.dsframe', h), f = $('iframe', h), s = box.clientWidth / 1440; f.style.transform = 'scale(' + s + ')'; }); }
  scale(); window.addEventListener('resize', scale);
})();
