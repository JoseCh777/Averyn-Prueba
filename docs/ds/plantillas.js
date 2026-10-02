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
  var chip = function (t, k) { return '<span class="hz-chip hz-chip--' + k + '">' + t + '</span>'; };

  /* ---------- Plantillas ---------- */
  var T = {};

  T.bitacora = function (st) {
    var rows = [['10:42', 'BIOMETRIC_VERIFIED', 'Ana Lucía Pérez', 'CAM-001', 'Aceptada', 'success'], ['10:31', 'LOGIN', 'Carlos Mendoza', 'Web', 'Correcto', 'success'], ['10:15', 'BIOMETRIC_VERIFIED', 'Lucía Ramos', 'LEC-002', 'Rechazada', 'error'],
      ['09:58', 'DOCUMENT_REGISTERED', 'Diego Torres', 'Web', 'Correcto', 'success'], ['09:40', 'PERSON_CREATED', 'Valeria Quispe', 'Web', 'Correcto', 'success'], ['09:12', 'BIOMETRIC_ENROLLED', 'Jorge Salazar', 'CAM-002', 'Correcto', 'success'],
      ['08:55', 'VOTE_CAST', '— (anónimo)', 'KIOSCO-01', 'Registrado', 'info'], ['08:30', 'LOGIN', 'Mariana Cruz', 'Web', 'Fallido', 'warning']];
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
      '<div class="tp-head"><div class="tp-who"><span class="tp-ava" aria-hidden="true">AP</span><div><h1>Ana Lucía Pérez</h1><div class="tp-chips">' + chip('Activa', 'success') + chip('Rostro y huella', 'info') + chip('Estudiante', 'neutral') + '</div></div></div><div style="display:flex;gap:.6rem"><button class="hz-btn hz-btn--primary" type="button">Editar datos</button><button class="tp-btn" type="button" aria-label="Más acciones"><i class="bi bi-three-dots" aria-hidden="true"></i></button></div></div>' +
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

  /* ---------- Documento y marcos ---------- */
  function doc(key, st) { return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=1440">' + styles() + '</head><body class="tp">' + T[key](st) + '</body></html>'; }

  var dlg = document.createElement('dialog'); dlg.className = 'tpfull'; dlg.setAttribute('aria-labelledby', 'tpfull-t');
  dlg.innerHTML = '<div class="tpfull__h"><span id="tpfull-t"></span><button type="button" aria-label="Cerrar vista a pantalla completa"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div><iframe title="Plantilla a pantalla completa"></iframe>';
  document.body.appendChild(dlg);
  $('button', dlg).addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  var frames = [];
  $$('.tpf').forEach(function (host) {
    var key = host.getAttribute('data-t'), title = host.getAttribute('data-title'), st = 'normal', states = host.hasAttribute('data-states');
    host.innerHTML = '<div class="tpf__ctrl"><span class="stage__label mono" style="margin:0">Plantilla · ' + title + '</span>' + (states ? '<div class="vz-seg" role="group" aria-label="Estado de la plantilla ' + title + '"><button type="button" data-s="normal" aria-pressed="true">Normal</button><button type="button" data-s="empty" aria-pressed="false">Vacío</button><button type="button" data-s="loading" aria-pressed="false">Cargando</button><button type="button" data-s="error" aria-pressed="false">Error</button></div>' : '') + '</div>' +
      '<div class="tpf__frame"><div class="dsframe"><iframe title="Vista previa de la plantilla ' + title + '" tabindex="-1" aria-hidden="true"></iframe></div><button class="tpf__open" type="button"><i class="bi bi-arrows-fullscreen" aria-hidden="true"></i>Ver a pantalla completa</button></div>';
    var fr = $('iframe', host);
    function paint() { fr.srcdoc = doc(key, st); }
    $$('.vz-seg button', host).forEach(function (b) { b.addEventListener('click', function () { st = b.getAttribute('data-s'); $$('.vz-seg button', host).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); paint(); }); });
    $('.tpf__open', host).addEventListener('click', function () { $('#tpfull-t').textContent = title; $('iframe', dlg).srcdoc = doc(key, st); dlg.showModal(); });
    frames.push(host); paint();
  });
  function scale() { frames.forEach(function (h) { var box = $('.dsframe', h), f = $('iframe', h), s = box.clientWidth / 1440; f.style.transform = 'scale(' + s + ')'; }); }
  scale(); window.addEventListener('resize', scale);
})();
