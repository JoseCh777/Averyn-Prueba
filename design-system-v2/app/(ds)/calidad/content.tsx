/* Generado desde docs/ds/src por scripts/html-to-tsx.mjs (migración a React, v2.0).
   A partir de aquí este archivo es la fuente: se edita a mano. */
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function Content() {
  return (
    <>
      <section className="ds-sec" id="microcopy" aria-labelledby="h-micro" data-nav="Microcopy" data-grp="Contenido">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Calidad y gobernanza · Contenido</span>
          <h2 id="h-micro">Microcopy</h2>
          <p className="ds-lead">
            La voz de Averyn es serena, directa e institucional: habla de tú, en frases cortas, sin exclamaciones y sin jerga. Cada mensaje dice qué pasó y qué hacer.
          </p>
          <h3 className="ds-sub">Tono</h3>
          <div className="ds-grid ds-grid--3">
            <div className="stage">
              <span className="stage__label mono">Claro</span>
              <p>"Ingresa tus credenciales para continuar."</p>
              <p className="ds-note">Un verbo y un objeto. Sin rodeos.</p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Tranquilo</span>
              <p>"Credenciales inválidas. Verifica tu correo y contraseña e inténtalo nuevamente."</p>
              <p className="ds-note">Sin culpar al usuario ni dramatizar.</p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Honesto</span>
              <p>"La recuperación aún no está disponible; contacta a tu administrador."</p>
              <p className="ds-note">No prometas lo que no ocurre.</p>
            </div>
          </div>
          <h3 className="ds-sub">Glosario{" "}<small>una palabra por concepto</small></h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Concepto</th><th>Decimos</th><th>No decimos</th></tr></thead>
              <tbody>
                <tr><td>Quien existe en el sistema</td><td><b>Persona</b></td><td>Usuario, votante, registro (salvo en Electoral: "votante")</td></tr>
                <tr><td>Quien inicia sesión</td><td><b>Cuenta</b>{" "}/ usuario del panel</td><td>Persona</td></tr>
                <tr><td>Alta de rasgos biométricos</td><td><b>Registro biométrico</b></td><td>Enrolamiento, enrollment</td></tr>
                <tr><td>Comparar contra lo registrado</td><td><b>Verificación</b></td><td>Matching, autenticación facial</td></tr>
                <tr><td>Prueba de que es una persona real</td><td><b>Prueba de vida</b></td><td>Liveness, anti-spoofing</td></tr>
                <tr><td>Organización cliente</td><td><b>Institución</b></td><td>Tenant, cliente, inquilino</td></tr>
                <tr><td>Equipo de captura</td><td><b>Dispositivo</b>{" "}(cámara, lector de huella)</td><td>Hardware, endpoint</td></tr>
                <tr>
                  <td>Lectura de un documento</td>
                  <td><b>Procesar documento</b>{" "}(OCR entre paréntesis la primera vez)</td>
                  <td>Parsear, scraping</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            <b>Jerga que nunca va en pantalla:</b>
            {" "}tenant, monolito, MCP, RBAC, liveness, template, embedding, UUID, claves de almacenamiento (
            <code>averyn_personas</code>
            ). En la landing, los términos técnicos se explican por su beneficio o se reservan a una sección técnica aparte.
          </p>
          <h3 className="ds-sub">Formato de datos</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Dato</th><th>Formato</th><th>Ejemplo</th></tr></thead>
              <tbody>
                <tr><td>Fecha y hora</td><td><code>dd/mm/aaaa, hh:mm</code>{" "}(24 h)</td><td className="num">13/09/2026, 20:42</td></tr>
                <tr><td>Documento</td><td>Solo dígitos, sin puntos, en mono</td><td><code>10234567</code></td></tr>
                <tr><td>Dispositivo</td><td>Código en mono</td><td><code>CAM-001</code>{" "}·{" "}<code>LEC-003</code></td></tr>
                <tr><td>Conteos</td><td>Número + sustantivo concordado</td><td>1 desconectado · 3 desconectados</td></tr>
                <tr><td>Porcentajes</td><td>Entero +{" "}<code>%</code></td><td>50 %</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Librería de mensajes</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Situación</th><th>Mensaje aprobado</th></tr></thead>
              <tbody>
                <tr><td>Campos vacíos</td><td>Completa tu correo electrónico y contraseña para continuar.</td></tr>
                <tr><td>Correo inválido</td><td>Ingresa un correo electrónico válido, por ejemplo nombre@organizacion.com.</td></tr>
                <tr><td>Credenciales inválidas</td><td>Credenciales inválidas. Verifica tu correo y contraseña e inténtalo nuevamente.</td></tr>
                <tr><td>Sesión caducada</td><td>Tu sesión terminó por inactividad. Ingresa de nuevo para continuar.</td></tr>
                <tr><td>Sin conexión</td><td>No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.</td></tr>
                <tr><td>Sin permiso</td><td>No tienes permiso para esta acción. Pídelo a tu administrador.</td></tr>
                <tr>
                  <td>Documento ilegible</td>
                  <td>No pudimos leer el documento. Sube una foto nítida, sin reflejos y con las cuatro esquinas visibles.</td>
                </tr>
                <tr><td>Rostro no detectado</td><td>No detectamos un rostro. Colócate de frente, con buena luz, y vuelve a intentarlo.</td></tr>
                <tr><td>Calidad insuficiente</td><td>La captura no tiene calidad suficiente. Acércate a la cámara y evita el contraluz.</td></tr>
                <tr><td>Dispositivo desconectado</td><td>El dispositivo CAM-002 no responde. Revisa la conexión y reintenta.</td></tr>
                <tr><td>Verificación rechazada</td><td>La verificación no coincidió. Puedes reintentar o validar con otro método.</td></tr>
                <tr><td>Estado vacío (lista)</td><td>Aún no hay personas registradas. Registra la primera para empezar.</td></tr>
                <tr><td>Módulo pendiente</td><td>Próximamente. Estamos trabajando en este módulo.</td></tr>
                <tr><td>Recuperar contraseña (sin servicio)</td><td>La recuperación aún no está disponible; contacta a tu administrador.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Hacer</strong>
              <ul>
                <li>Botones con verbo y flecha cuando avanzan: "Ingresar →".</li>
                <li>Un único nombre por acción: "Ingresar" en navbar, hero, cierre, footer y login (en v1.1 se unificó el footer).</li>
                <li>Explica la causa y el siguiente paso en la misma frase.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>No hacer</strong>
              <ul>
                <li>"Todo listo para continuar" antes de que el usuario haga algo (reemplazado por "Ingresa a tu panel.").</li>
                <li>"Conexión segura y protegida" como adorno: el login solo la muestra si la página va por HTTPS.</li>
                <li>"Te enviaremos instrucciones…" si no existe el envío.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="accesibilidad" aria-labelledby="h-a11y" data-nav="Accesibilidad" data-grp="Calidad">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Calidad y gobernanza · Calidad</span>
          <h2 id="h-a11y">Accesibilidad</h2>
          <p className="ds-lead">
            Objetivo: WCAG 2.2 AA. Estos mínimos salen de las mediciones reales sobre landing, login y dashboard, incluidos los fallos que encontramos.
          </p>
          <h3 className="ds-sub">Anillo de foco según la superficie</h3>
          <p className="ds-note">
            El anillo nunca tiene el color de la superficie que lo rodea. Se elige por el fondo{" "}
            <b>adyacente</b>
            {" "}(el espacio de 3 px entre el elemento y el anillo).
          </p>
          <div className="ds-grid ds-grid--4">
            <div className="stage" style={{ textAlign: "center" }}>
              <button className="hz-btn hz-btn--ghost" type="button" style={{ outline: "2px solid var(--av-blue)", outlineOffset: "3px" }}>
                Claro
              </button>
              <p className="ds-note"><b>Azul #145FEE</b><br />5.38:1 sobre blanco</p>
            </div>
            <div className="stage stage--blue" style={{ textAlign: "center" }}>
              <button className="hz-btn hz-btn--light" type="button" style={{ outline: "2px solid #fff", outlineOffset: "3px" }}>Sobre azul</button>
              <p className="ds-note" style={{ color: "#F0F5FF" }}><b>Blanco</b><br />5.38:1 sobre #145FEE</p>
            </div>
            <div className="stage stage--night" style={{ textAlign: "center" }}>
              <button className="hz-btn hz-btn--ghost-inv" type="button" style={{ outline: "2px solid var(--av-cyan-glow)", outlineOffset: "3px" }}>
                Sobre navy
              </button>
              <p className="ds-note" style={{ color: "var(--av-night-text)" }}><b>Cian-glow</b><br />10.29:1 sobre #071A36</p>
            </div>
            <div className="stage stage--tint" style={{ textAlign: "center" }}>
              <span className="hz-tile hz-tile--signal" style={{ minHeight: "0", padding: ".7rem 1rem", outline: "3px solid var(--av-navy)", outlineOffset: "3px", display: "inline-block" }}>
                Tile azul
              </span>
              <p className="ds-note"><b>Navy 3 px</b><br />17:1 sobre la página</p>
            </div>
          </div>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Área</th><th>Requisito</th><th>Cómo se verifica</th></tr></thead>
              <tbody>
                <tr>
                  <td>Contraste</td>
                  <td>Texto ≥ 4.5:1 (≥ 3:1 si es grande: 24 px, o 19 px en negrita). Componentes y bordes de campo ≥ 3:1.</td>
                  <td>Tabla de pares aprobados; medir sobre el píxel real, no sobre el primer color de un degradado.</td>
                </tr>
                <tr>
                  <td>Foco visible</td>
                  <td>Anillo de 2–3 px, offset 3 px, color según superficie. Nunca{" "}<code>outline: none</code>{" "}sin reemplazo.</td>
                  <td>Tab por toda la página; capturar sobre cada fondo.</td>
                </tr>
                <tr>
                  <td>Teclado</td>
                  <td>
                    Orden = orden visual. Nada con{" "}
                    <code>opacity: 0</code>
                    {" "}recibe foco: usar{" "}
                    <code>visibility: hidden</code>
                    {" "}o{" "}
                    <code>inert</code>
                    . Escape cierra menús y devuelve el foco al disparador.
                  </td>
                  <td>Recorrer sin ratón; el menú móvil va justo después de su botón en el DOM.</td>
                </tr>
                <tr>
                  <td>Objetivos</td>
                  <td>≥ 44 × 44 px (mínimo absoluto 24 px). Enlaces de texto en línea exentos.</td>
                  <td>Medir a 390 px: marca, "Volver", "¿Olvidaste…?" y enlaces de footer deben cumplir.</td>
                </tr>
                <tr>
                  <td>Estructura</td>
                  <td>
                    Un{" "}
                    <code>{"<h1>"}</code>
                    {" "}por página (visible o{" "}
                    <code>sr-only</code>
                    ), jerarquía sin saltos, landmarks (
                    <code>header</code>
                    ,{" "}
                    <code>nav</code>
                    ,{" "}
                    <code>main</code>
                    ,{" "}
                    <code>footer</code>
                    ), skip link,{" "}
                    <code>lang="es"</code>
                    .
                  </td>
                  <td>Revisar el esquema de encabezados.</td>
                </tr>
                <tr>
                  <td>Formularios</td>
                  <td>
                    <code>{"<label for>"}</code>
                    {" "}visible,{" "}
                    <code>aria-invalid</code>
                    {" "}+{" "}
                    <code>aria-describedby</code>
                    {" "}en error, errores con{" "}
                    <code>role="alert"</code>
                    , foco al primer inválido.
                  </td>
                  <td>Probar vacío, inválido y correcto con lector de pantalla.</td>
                </tr>
                <tr>
                  <td>Movimiento</td>
                  <td>
                    <code>prefers-reduced-motion</code>
                    : sin sticky, sin dibujo, sin deslizamientos; el contenido nunca depende de JS para verse.
                  </td>
                  <td>Emular reduced-motion; probar con JS desactivado.</td>
                </tr>
                <tr><td>Color</td><td>Nunca único canal. Estados con texto; gráficos con valor en texto.</td><td>Ver en escala de grises.</td></tr>
                <tr>
                  <td>Estados</td>
                  <td>
                    Los módulos pendientes usan{" "}
                    <code>aria-disabled="true"</code>
                    {" "}y no son enlaces. Los iconos decorativos{" "}
                    <code>aria-hidden</code>
                    ; los solos con{" "}
                    <code>aria-label</code>
                    .
                  </td>
                  <td>Revisar el árbol de accesibilidad.</td>
                </tr>
                <tr><td>Zoom y reflujo</td><td>Usable a 200 % y a 320 px de ancho sin scroll horizontal.</td><td>Probar 1440, 768 y 375 px.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="informe-validacion" aria-labelledby="h-informe-validacion" data-nav="Informe de validación" data-grp="Calidad">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Calidad y gobernanza · Calidad</span>
          <h2 id="h-informe-validacion">Informe de validación (v1.6)</h2>
          <p className="ds-lead">
            Qué se comprobó antes de compartir el sistema, cómo, qué se encontró y qué{" "}
            <b>no</b>
            {" "}se pudo probar. Las pruebas automáticas se hicieron en Edge (Chromium), a 1440 y 390 px (el estándar oficial pide 375 y 1440: ver «Alineación con la arquitectura oficial»); lo que necesita una persona o un dispositivo real está marcado como pendiente.
          </p>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Prueba</th><th>Cómo</th><th>Resultado</th></tr></thead>
              <tbody>
                <tr>
                  <td>Accesibilidad automática (WCAG 2.2 AA)</td>
                  <td><code>axe-core</code>{" "}4.10 sobre las 8 páginas, en escritorio y móvil</td>
                  <td>
                    <span className="hz-chip hz-chip--success"><Icon name="check-circle" />Corregido</span>
                    {" "}Se encontraron 5 tipos de incumplimiento (contraste en etiquetas y muestras, regiones desplazables sin teclado, tooltip sin nombre, lista con rol cambiado). Todos corregidos. Quedan 8 avisos de contraste en Fundamentos que son{" "}
                    <b>muestras demostrativas</b>
                    {" "}de pares que fallan a propósito (marcadas como decorativas, con su razón al lado).
                  </td>
                </tr>
                <tr>
                  <td>Teclado</td>
                  <td>Recorrido con{" "}<kbd>Tab</kbd>{" "}de cada página; se comprueba indicador de foco y nombre accesible en cada elemento</td>
                  <td>
                    <span className="hz-chip hz-chip--success"><Icon name="check-circle" />Sin problemas</span>
                    {" "}657 elementos enfocables recorridos en 8 páginas; ninguno sin indicador de foco ni sin nombre.
                  </td>
                </tr>
                <tr>
                  <td>Contraste sobre el píxel real</td>
                  <td>Medición de las píldoras (18 combinaciones), portadas y paneles navy</td>
                  <td>
                    <span className="hz-chip hz-chip--success"><Icon name="check-circle" />Cumple</span>
                    {" "}Píldoras ≥ 5.02:1; panel navy ≥ 9:1. La portada de Inicio estaba en 2.4:1 (texto sobre la zona clara del degradado) y se oscureció a ≥ 7.2:1.
                  </td>
                </tr>
                <tr>
                  <td>Impresión</td>
                  <td>PDF real de la constancia desde Edge</td>
                  <td>
                    <span className="hz-chip hz-chip--success"><Icon name="check-circle" />Corregido</span>
                    {" "}Salía en tamaño Carta: el navegador descartaba la regla{" "}
                    <code>@page</code>
                    {" "}por los cuadros de pie anidados. Ahora A4 real (595 × 842 pt), 1 página, sin botones ni sombras.
                  </td>
                </tr>
                <tr>
                  <td>Revisión de diseño</td>
                  <td>Detector de Impeccable sobre las 8 páginas</td>
                  <td>
                    <span className="hz-chip hz-chip--success"><Icon name="check-circle" />Corregido</span>
                    {" "}Saltos de encabezado (h2 → h4), etiquetas de 10 px en la barra lateral y barras de progreso animadas con{" "}
                    <code>width</code>
                    . El resto son decisiones de marca (mono en mayúsculas, borde inferior de las teclas) o ruido del documento.
                  </td>
                </tr>
                <tr>
                  <td>Demos y enlaces</td>
                  <td><code>build.py</code>{" "}valida ids únicos, enlaces, anclas y que cada página cargue el script de sus demos</td>
                  <td>
                    <span className="hz-chip hz-chip--success"><Icon name="check-circle" />Automático</span>
                    {" "}La validación de demos huérfanas nació de un fallo real: la demo del hero dejó de funcionar al reorganizar.
                  </td>
                </tr>
                <tr>
                  <td>Archivo único para compartir</td>
                  <td>Abrir{" "}<code>averyn-design-system-horizonte.html</code>{" "}desde disco (<code>file://</code>) y navegar las 8 páginas</td>
                  <td>
                    <span className="hz-chip hz-chip--success"><Icon name="check-circle" />Funciona</span>
                    {" "}Sin errores de consola, vistas en vivo de páginas de error incluidas. Necesita internet solo para fuentes e iconos.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Lo que no se pudo probar</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Pendiente</th><th>Por qué</th><th>Cómo cerrarlo</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Firefox y Safari</span></td>
                  <td>No están disponibles en el entorno de pruebas (la descarga de navegadores estaba bloqueada).</td>
                  <td>Abrir el HTML único en ambos y recorrer las 8 páginas. Ver los mínimos de abajo.</td>
                </tr>
                <tr>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Lector de pantalla real</span></td>
                  <td>Necesita una persona escuchando NVDA, Narrador o VoiceOver;{" "}<code>axe-core</code>{" "}no sustituye eso.</td>
                  <td>Probar 5 flujos: tarjetón, captura facial, tabla avanzada, Ctrl + K y formulario con errores.</td>
                </tr>
                <tr>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Móvil físico</span></td>
                  <td>Solo se emuló el tamaño (390 y 820 px); no hay pruebas táctiles reales.</td>
                  <td>Abrir en un teléfono y probar los componentes con gesto (drawer, menús, código de 6 dígitos).</td>
                </tr>
                <tr>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Zoom 200 % y movimiento reducido</span></td>
                  <td>Se verificó por CSS (<code>prefers-reduced-motion</code>{" "}en cada animación) pero no con una sesión de usuario.</td>
                  <td>Activar la preferencia del sistema y ampliar al 200 % en cada página.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Requisitos de navegador</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Función usada</th><th>Dónde</th><th>Chrome / Edge</th><th>Safari</th><th>Firefox</th></tr></thead>
              <tbody>
                <tr><td><code>:has()</code></td><td>Selección del tarjetón, tarjetas de opción</td><td>105</td><td>15.4</td><td><b>121</b></td></tr>
                <tr><td><code>color-mix()</code></td><td>Borde de la píldora de contorno (con respaldo)</td><td>111</td><td>16.2</td><td>113</td></tr>
                <tr>
                  <td><code>{"<dialog>"}</code>{" "}y{" "}<code>showModal()</code></td>
                  <td>Modal, drawer, paleta Ctrl + K</td>
                  <td>37</td>
                  <td>15.4</td>
                  <td>98</td>
                </tr>
                <tr><td><code>iframe srcdoc</code></td><td>Vistas de plantillas y correos; el HTML único</td><td>20</td><td>6</td><td>25</td></tr>
                <tr>
                  <td><code>aspect-ratio</code>,{" "}<code>backdrop-filter</code>,{" "}<code>accent-color</code></td>
                  <td>Marcos de media, paleta, casillas</td>
                  <td>88 / 76 / 93</td>
                  <td>15 / 9 / 15.4</td>
                  <td>89 / 103 / 92</td>
                </tr>
                <tr>
                  <td><code>text-wrap: balance</code></td>
                  <td>Titulares (mejora progresiva: si no existe, se ignora)</td>
                  <td>114</td>
                  <td>17.5</td>
                  <td>121</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            <b>Mínimo recomendado para el design system:</b>
            {" "}Chrome y Edge 111, Safari 16.2 y Firefox 121. Las versiones salen de la compatibilidad publicada de cada función, no de pruebas propias en esos navegadores. En un navegador anterior se pierde el realce de la opción marcada del tarjetón; el texto "Marcada" y el botón de continuar siguen funcionando.
          </p>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="alineacion-oficial" aria-labelledby="h-alineacion" data-nav="Alineación con la arquitectura oficial" data-grp="Calidad">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Calidad y gobernanza · Calidad</span>
          <h2 id="h-alineacion">Alineación con la arquitectura oficial</h2>
          <p className="ds-lead">
            Horizonte es la única guía visual de Averyn. Esta matriz compara el sistema con las reglas de{" "}
            <code>averyn-web</code>
            {" "}(AGENTS) y{" "}
            <code>averyn-docs</code>
            {" "}(estándar de código y diccionario de datos). «Decidir» significa que lo resuelve el ADR propuesto para que lo apruebe el responsable técnico.
          </p>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Regla oficial</th><th>Horizonte hoy</th><th>Estado</th><th>Resolución</th></tr></thead>
              <tbody>
                <tr>
                  <td>Accesibilidad (§70)</td>
                  <td>WCAG 2.2 AA, axe sin violaciones, teclado completo</td>
                  <td>Cumple</td>
                  <td>Mantener en cada componente portado.</td>
                </tr>
                <tr>
                  <td>Estados de UI y biometría (§21–23)</td>
                  <td>Carga, vacío, error, éxito y deshabilitado; mapa de estados oficiales</td>
                  <td>Cumple</td>
                  <td>Ver{" "}<i>Patrones › Estados oficiales</i>.</td>
                </tr>
                <tr>
                  <td>Tokens{" "}<code>--av-*</code>{" "}e Inter</td>
                  <td>Mismos nombres y fuente de cuerpo</td>
                  <td>Cumple</td>
                  <td>Portar a{" "}<code>app/globals.css</code>.</td>
                </tr>
                <tr>
                  <td>Prefijo{" "}<code>av-</code></td>
                  <td>Clases{" "}<code>hz-*</code></td>
                  <td>Decidir</td>
                  <td>Renombrar al portar o declarar{" "}<code>hz-</code>{" "}en el ADR.</td>
                </tr>
                <tr>
                  <td>Plus Jakarta Sans en títulos</td>
                  <td>Space Grotesk (y JetBrains Mono, que{" "}<code>layout.tsx</code>{" "}no carga)</td>
                  <td>Decidir</td>
                  <td>El ADR fija la fuente de títulos y si se mantiene la mono.</td>
                </tr>
                <tr>
                  <td>Breakpoints 576 · 768 · 1024 · 1280</td>
                  <td>Documentados; este sitio usa valores sueltos</td>
                  <td>Alineado en la guía</td>
                  <td>Solo los oficiales en el código portado.</td>
                </tr>
                <tr>
                  <td>Responsive a 375 y 1440 (§71)</td>
                  <td>Probado a 390 y 1440</td>
                  <td>Pendiente</td>
                  <td>Añadir 375 px a la prueba de cada pantalla portada.</td>
                </tr>
                <tr>
                  <td>React 19 + TypeScript estricto</td>
                  <td>HTML, CSS y JS sin framework</td>
                  <td>Portar</td>
                  <td>Componentes tipados en{" "}<code>components/ui</code>;{" "}<code>'use client'</code>{" "}solo con interacción.</td>
                </tr>
                <tr>
                  <td>Código en inglés (§75)</td>
                  <td>Ids y estructura de la documentación en español</td>
                  <td>Portar</td>
                  <td>Componentes y props en inglés; la documentación sigue en español.</td>
                </tr>
                <tr>
                  <td>Dependencias nuevas (§56)</td>
                  <td>La guía recomienda librerías</td>
                  <td>Aplazar</td>
                  <td>Sin dependencias nuevas en la primera semana; cada una con ADR.</td>
                </tr>
                <tr>
                  <td>Contenido sin respaldo del MVP</td>
                  <td>2FA, recuperación por correo, invitación, selector de institución, mesas, notificaciones, escrutinio</td>
                  <td>Marcado</td>
                  <td>Cada plantilla lleva el aviso «Futuro · fuera del MVP oficial».</td>
                </tr>
                <tr>
                  <td>Modelo de datos del tarjetón</td>
                  <td>Variante fórmula, fotos y logos</td>
                  <td>Marcado</td>
                  <td>Ver nota en{" "}<i>Patrones › Papeleta</i>.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            Para que sea ley y no solo guía: ADR en estado{" "}
            <i>Propuesto</i>
            {" "}aprobado por el responsable técnico, reescritura de{" "}
            <code>AGENTS.md</code>
            {" "}§9, componentes en{" "}
            <code>components/ui</code>
            {" "}y la casilla «Consistencia con el Design System» en la revisión de cada PR. Un componente que falta se crea primero en el sistema (§72).
          </p>
        </div>
      </section>
      <section className="ds-sec" id="gobernanza" aria-labelledby="h-gob" data-nav="Gobernanza y novedades" data-grp="Gobernanza">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Calidad y gobernanza · Gobernanza</span>
          <h2 id="h-gob">Gobernanza</h2>
          <p className="ds-lead">
            El sistema vive en el repositorio. Los tokens son la fuente de verdad; este documento y{" "}
            <code>DESIGN.md</code>
            {" "}los explican.
          </p>
          <div className="ds-grid ds-grid--3 ds-gap-top">
            <div className="stage">
              <span className="stage__label mono">Fuentes de verdad</span>
              <p className="ds-note" style={{ marginTop: "0" }}>
                1.{" "}
                <code>tokens.css</code>
                {" "}(valores)
                <br />
                2.{" "}
                <code>DESIGN.md</code>
                {" "}(principios y reglas)
                <br />
                3. Este documento (catálogo)
                <br />
                Si hay conflicto, gana el número del token.
              </p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Versionado</span>
              <p className="ds-note" style={{ marginTop: "0" }}>
                <b>Mayor</b>
                : cambia un principio o un token de marca.
                <br />
                <b>Menor</b>
                : componente nuevo.
                <br />
                <b>Parche</b>
                : corrección de valor o de texto.
              </p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Proponer un cambio</span>
              <p className="ds-note" style={{ marginTop: "0" }}>
                Issue con captura → prototipo en rama → revisión (nadie valida lo suyo) → actualizar token,{" "}
                <code>DESIGN.md</code>
                {" "}y este documento → merge a{" "}
                <code>dev</code>
                .
              </p>
            </div>
          </div>
          <h3 className="ds-sub">Un componente está terminado cuando…</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <tbody>
                <tr>
                  <td>✓ Usa solo tokens (sin hex sueltos salvo los documentados)</td>
                  <td>✓ Estados: reposo, hover, foco, activo, deshabilitado, carga, error</td>
                </tr>
                <tr>
                  <td>✓ Contraste y foco verificados sobre cada superficie donde aparece</td>
                  <td>✓ Responsive: 1440, 820 y 390 px sin scroll horizontal (375 px: ver alineación)</td>
                </tr>
                <tr>
                  <td>✓{" "}<code>prefers-reduced-motion</code>{" "}y teclado probados</td>
                  <td>✓ Documentado aquí con un ejemplo vivo y su regla de uso</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Dónde va cada cosa</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Si lo que añades es…</th><th>Va en…</th><th>Ejemplos</th></tr></thead>
              <tbody>
                <tr>
                  <td>Un{" "}<b>valor</b>{" "}o una regla visual</td>
                  <td><a href="/fundamentos">Fundamentos</a></td>
                  <td>Un color, una escala de espacio, un token</td>
                </tr>
                <tr>
                  <td>Una{" "}<b>pieza reutilizable</b></td>
                  <td><a href="/componentes">Componentes</a>, en su familia</td>
                  <td>Botón, campo, tabla, alerta, drawer</td>
                </tr>
                <tr>
                  <td>Una{" "}<b>forma de mostrar datos</b></td>
                  <td><a href="/graficos">Gráficos</a></td>
                  <td>Un tipo de gráfico, una regla de color de serie</td>
                </tr>
                <tr>
                  <td>Una{" "}<b>solución a un problema de producto</b>{" "}(varias piezas juntas)</td>
                  <td><a href="/patrones">Patrones</a></td>
                  <td>Captura facial, tarjetón, consentimiento</td>
                </tr>
                <tr>
                  <td>Una{" "}<b>pantalla</b>{" "}completa o un estado de pantalla</td>
                  <td><a href="/plantillas">Plantillas y estados</a></td>
                  <td>Bitácora, página 404, estado vacío</td>
                </tr>
                <tr>
                  <td>Algo que{" "}<b>sale de la pantalla</b></td>
                  <td><a href="/marca">Marca y entregables</a></td>
                  <td>Correo, impresión, favicon</td>
                </tr>
                <tr>
                  <td>Una{" "}<b>regla de calidad o de proceso</b></td>
                  <td>Calidad y gobernanza (aquí)</td>
                  <td>Microcopy, accesibilidad, versión</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Cómo añadir o mover una sección</h3>
          <ul className="ds-note" style={{ paddingLeft: "1.1rem", display: "grid", gap: ".4rem" }}>
            <li>
              Cada{" "}
              <code>{"<section>"}</code>
              {" "}lleva{" "}
              <code>id</code>
              {" "}único en{" "}
              <b>todo</b>
              {" "}el sistema,{" "}
              <code>data-nav</code>
              {" "}(la etiqueta del índice) y{" "}
              <code>data-grp</code>
              {" "}(su subgrupo dentro de la página). Los nombres dicen{" "}
              <b>qué es</b>
              , nunca cuándo se hizo.
            </li>
            <li>
              <b>Sin numeración</b>
              : el orden lo da la posición. El fondo alterno de las secciones lo calcula{" "}
              <code>build.py</code>
              ; no se pone a mano.
            </li>
            <li>
              Para mover una sección, se corta el bloque completo a otro{" "}
              <code>src/*-body.html</code>
              {" "}y se ajusta su{" "}
              <code>data-grp</code>
              ; el contenido no cambia.
            </li>
            <li>
              <code>python build.py</code>
              {" "}(desde la carpeta de herramientas){" "}
              <b>valida</b>
              {" "}ids repetidos, anclas internas y enlaces entre páginas (con su{" "}
              <code>#fragmento</code>
              ) y termina con error si algo se rompe.
            </li>
            <li>Los nombres de página son del propósito (Componentes, Patrones…); las versiones y novedades se anotan en el changelog de abajo.</li>
          </ul>
          <h3 className="ds-sub">Registro de decisiones</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Decisión</th><th>Motivo</th></tr></thead>
              <tbody>
                <tr>
                  <td>Estilo "Horizonte" (cielo a navy, arcos, mono en acciones)</td>
                  <td>Identidad propia y reconocible; la A del logo es la firma.</td>
                </tr>
                <tr><td>Descartado el estilo brutalista</td><td>Perdía la identidad de marca; se concentra el impacto solo en el hero.</td></tr>
                <tr><td>Plano por defecto: líneas de 1 px, no tarjetas</td><td>Menos ruido; la profundidad la da el tono.</td></tr>
                <tr><td>Un solo panel navy por pantalla</td><td>Marca el cambio de información sin romper el ritmo.</td></tr>
                <tr><td>Shell en píldora (landing y dashboard)</td><td>Coherencia con el dock anterior y con la navegación pública.</td></tr>
                <tr><td>Wordmark: maquetar grande y reducir</td><td>Ampliarlo (o{" "}<code>will-change</code>) lo rasterizaba borroso.</td></tr>
                <tr><td>Módulos sin pantalla: "Próximamente", sin enlace</td><td>Honestidad del estado; evita los 404.</td></tr>
                <tr>
                  <td>Estructura por propósito, no por orden de llegada (v1.5)</td>
                  <td>
                    El sistema había crecido por capas y la gente no sabía dónde buscar; ahora cada cosa tiene un único lugar y una regla para decidirlo.
                  </td>
                </tr>
                <tr>
                  <td>Migración a React sobre Next.js</td>
                  <td>Decisión del equipo; shadcn/ui y los complementos recomendados funcionan sobre Next.js.</td>
                </tr>
                <tr>
                  <td>Documentación sin rutas fijas; entregable = HTML único</td>
                  <td>El sistema se mudará al repositorio oficial de la organización; solo una tabla guarda las rutas.</td>
                </tr>
                <tr><td>Sin Bootstrap en landing, login y dashboard</td><td>Menos peso y estilos propios; Bootstrap Icons se conserva.</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Changelog</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <tbody>
                <tr>
                  <td><b>v2.0</b>{" "}· oct 2026</td>
                  <td>
                    <b>Todo en React.</b>
                    {" "}Componentes, patrones biométricos y electorales, gráficos, plantillas y esta documentación pasan a React 19 + TypeScript sobre Next.js, con Tailwind v4 y los tokens <code>--av-*</code> como fuente de verdad. Iconos: Bootstrap Icons como componentes SVG (Lineicons queda como opción futura). Los efectos de Aceternity UI se adaptan antes de usarse y solo en superficies de marca. Se añaden las plantillas Login y Organización no encontrada, los errores de la API y los estados oficiales de biometría.
                  </td>
                </tr>
                <tr>
                  <td><b>v1.7</b>{" "}· oct 2026</td>
                  <td>
                    <b>Aclaraciones y guía de migración.</b>
                    {" "}Plantillas y patrones se declaran{" "}
                    <i>ejemplos de uso del sistema</i>
                    , no una copia fiel del producto final. Huella dactilar de arcos anidados según el dibujo del equipo (núcleo con tallo, 6 crestas en cúpula con cortes y patas largas), con el estilo de arcos de la marca.{" "}
                    <i>Componentes nuevos:</i>
                    {" "}carga de archivos (zona para soltar, estados cargando / listo / error de red / rechazado) y estados de carga (silueta, spinner en botón, barra). Segundo tarjetón:{" "}
                    <i>una persona por partido</i>
                    {" "}(personero, representante) junto al de fórmula. Guía de migración a React ampliada: qué pasa sin cambios, qué se reemplaza, librerías recomendadas, qué evitar y ruta por fases.{" "}
                    <i>Dependencias y librerías</i>
                    : lo necesario para usar, construir y probar el sistema, y los paquetes de la migración con su versión en npm.{" "}
                    <i>Independencia de la arquitectura:</i>
                    {" "}la documentación habla de roles, no de rutas; una sola tabla, "Dónde vive cada archivo", concentra las rutas para mudar el sistema a otro repositorio. El entregable es el HTML único.
                  </td>
                </tr>
                <tr>
                  <td><b>v1.6</b>{" "}· oct 2026</td>
                  <td>
                    <b>Huecos cerrados y validación.</b>
                    {" "}
                    <i>Formularios nuevos:</i>
                    {" "}campo de búsqueda, código de un solo uso de 6 dígitos, contraseña con indicador de fuerza, multi-select con filtros activos y validación con resumen de errores.{" "}
                    <i>Acceso y cuenta:</i>
                    {" "}recuperar contraseña, segundo factor, selección de institución y aceptar invitación.{" "}
                    <i>Propuestas de diseño (pendientes de validar con el equipo):</i>
                    {" "}revisión manual de verificaciones, escrutinio, mesas y padrón, roles y permisos.{" "}
                    <i>Tarjetón</i>
                    {" "}electoral con espacio para foto, número, nombre y logo.{" "}
                    <i>Validación:</i>
                    {" "}auditoría{" "}
                    <code>axe-core</code>
                    {" "}y de teclado sobre las 8 páginas, A4 real en impresión, portada de Inicio con contraste ≥ 7:1, demo del hero restaurada y verificación automática de demos huérfanas. Informe completo en esta página.
                  </td>
                </tr>
                <tr>
                  <td><b>v1.5</b>{" "}· oct 2026</td>
                  <td>
                    <b>Reorganización por propósito.</b>
                    {" "}De 7 páginas por orden de llegada a 8 por propósito, en 4 grupos de la barra lateral:{" "}
                    <i>Inicio</i>
                    {" "}·{" "}
                    <i>Fundamentos, Componentes, Gráficos</i>
                    {" "}·{" "}
                    <i>Patrones, Plantillas y estados</i>
                    {" "}·{" "}
                    <i>Marca y entregables, Calidad y gobernanza</i>
                    . Los componentes que estaban repartidos en dos páginas son uno solo; "Estados del sistema" pasa a ser parte de Plantillas y estados; los tokens pasan de Marca a Fundamentos; microcopy, accesibilidad y gobernanza viven juntos. Secciones sin numeración, índice por subgrupos, ids únicos (los de Gráficos con prefijo{" "}
                    <code>grafico-</code>
                    ) y{" "}
                    <b>validación automática</b>
                    {" "}de ids y enlaces en{" "}
                    <code>build.py</code>
                    . Nueva página de Inicio con mapa y novedades.
                  </td>
                </tr>
                <tr>
                  <td><b>v1.4</b>{" "}· oct 2026</td>
                  <td>
                    <b>Auditoría del líder.</b>
                    {" "}
                    <i>Estados unificados:</i>
                    {" "}una sola tabla Estado → color (verde éxito, ámbar reintento, rojo rechazo, gris pendiente, azul info; el cian queda solo como resalte) en fondo claro y sobre navy, con tokens nuevos{" "}
                    <code>-strong</code>
                    {" "}y{" "}
                    <code>-on-navy</code>
                    .{" "}
                    <i>Píldoras de estado</i>
                    {" "}en 3 variantes (suave por defecto en tablas, contorno y sólida), sin punto y con icono opcional; contraste ≥ 5:1.{" "}
                    <i>Alertas</i>
                    {" "}con insignia circular de icono en lugar de franja lateral.{" "}
                    <i>Panel de actividad</i>
                    {" "}y franja de indicadores generados desde un solo conjunto de 6 eventos (las partes suman el total). Gráficos de resultado con colores de estado. Correcciones de contenido: IDs de dispositivo (LEC-/CAM-), concordancia ("Huella rechazada"), "Sin verificar", fechas, tooltip con icono de ayuda y demo de toast con acciones. Nueva sección "Implementación recomendada" (librerías, solo documentada).
                  </td>
                </tr>
                <tr>
                  <td><b>v1.3</b>{" "}· oct 2026</td>
                  <td>
                    <b>Cobertura completa.</b>
                    {" "}
                    <i>Patrones de Averyn:</i>
                    {" "}captura facial y de huella, resultado de verificación frente al umbral 0.68, documento y OCR con revisión de datos, papeleta y comprobante sin vincular persona↔voto, dispositivos y consentimiento biométrico.{" "}
                    <i>Componentes:</i>
                    {" "}selector de fechas, menú de acciones, combobox, acordeón, stepper, popover, drawer, paleta de comandos Ctrl+K y tabla avanzada, todos con teclado completo.{" "}
                    <i>Plantillas:</i>
                    {" "}bitácora, configuración, detalle de persona, asistente electoral, notificaciones y perfil, con estados y vista a pantalla completa.{" "}
                    <i>Marca y entregables:</i>
                    {" "}kit de ilustración con arcos y estados vacíos, favicons e imagen social, tres correos transaccionales,{" "}
                    <code>print.css</code>
                    {" "}para actas y exportación de tokens W3C (
                    <code>tokens.json</code>
                    ). Nuevo:{" "}
                    <b>HTML único</b>
                    {" "}compartible (
                    <code>averyn-design-system-horizonte.html</code>
                    ).
                  </td>
                </tr>
                <tr>
                  <td><b>v1.2</b>{" "}· oct 2026</td>
                  <td>
                    Design system multipágina (inicio, gráficos y estados del sistema) con{" "}
                    <code>ds.css</code>
                    {" "}y{" "}
                    <code>ds.js</code>
                    {" "}compartidos.{" "}
                    <b>Estados del sistema:</b>
                    {" "}páginas 404, 403, 500, sin conexión y mantenimiento (concepto "arcos rotos sobre el horizonte"), ruta pedida escapada,{" "}
                    <code>{"<base>"}</code>
                    {" "}para rutas anidadas, banners y modal de sesión.{" "}
                    <b>Biblioteca de gráficos:</b>
                    {" "}paleta categórica validada (azul, ámbar, cian de gráfico, violeta, magenta), tarjeta de gráfico con estados, área, barras de píldora y rectas, ranking, apiladas, anillo, bullet, KPI con sparkline, mapa de calor, embudo, histograma con umbral 0.68 y tabla "breakdown"; tooltip, teclado y vista en tabla en todos; contrato de datos propuesto.
                  </td>
                </tr>
                <tr>
                  <td><b>v1.1</b>{" "}· oct 2026</td>
                  <td>
                    Accesibilidad y teclado en landing y login. Landing: hero de 220 vh con{" "}
                    <code>{"<h1>"}</code>
                    {" "}real,{" "}
                    <code>inert</code>
                    {" "}en lo invisible, figura anclada al texto, anillo de foco por superficie (blanco sobre azul, cian sobre navy), menú móvil con botón antes del nav y Escape que devuelve el foco, contrastes corregidos, objetivos ≥ 44 px, contenido visible sin JS. Login: errores por campo con{" "}
                    <code>aria-invalid</code>
                    , foco al primer inválido y a la contraseña tras credenciales inválidas, sin salto de layout, botón bloqueado durante la redirección, "Mostrar/Ocultar" sin contradicción de nombre, nota de seguridad solo en HTTPS. Tokens nuevos aplicados a{" "}
                    <code>tokens.css</code>
                    .
                  </td>
                </tr>
                <tr>
                  <td><b>v1.0</b>{" "}· oct 2026</td>
                  <td>
                    Primera versión del sistema Horizonte: fundamentos, 20 componentes, patrones y plantillas. Tokens nuevos:{" "}
                    <code>--av-field-border</code>
                    {" "}(#6E86B0) y{" "}
                    <code>--av-placeholder</code>
                    {" "}(#667390), variantes{" "}
                    <code>-text</code>
                    {" "}de estado, reglas de foco por superficie.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Deuda conocida y pospuesto{" "}<small>v1.7</small></h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Tema</th><th>Qué falta</th></tr></thead>
              <tbody>
                <tr>
                  <td>Prefijos</td>
                  <td>
                    El código usa{" "}
                    <code>mn-</code>
                    ,{" "}
                    <code>lg-</code>
                    {" "}y{" "}
                    <code>dh-</code>
                    ; consolidar en{" "}
                    <code>hz-</code>
                    {" "}o{" "}
                    <code>av-</code>
                    .
                  </td>
                </tr>
                <tr>
                  <td>CSS</td>
                  <td>
                    ~50 KB de{" "}
                    <code>components.css</code>
                    ,{" "}
                    <code>modules.css</code>
                    {" "}y{" "}
                    <code>dashboard.css</code>
                    {" "}se cargan sin usarse en landing y login.
                  </td>
                </tr>
                <tr><td>Módulos</td><td>Identidad, Documentos, Biometría, Electoral e IA siguen con el estilo anterior y con Bootstrap.</td></tr>
                <tr>
                  <td>Píldoras y alertas en el frontend</td>
                  <td>
                    Las píldoras de 3 variantes y las alertas con insignia están en el design system; el frontend (
                    <code>lg-alert</code>
                    ,{" "}
                    <code>dh-</code>
                    ) aún usa los estilos anteriores.
                  </td>
                </tr>
                <tr>
                  <td>Librerías de componentes</td>
                  <td>La recomendación React / shadcn / Sonner / TanStack está documentada, pendiente de decisión del equipo.</td>
                </tr>
                <tr>
                  <td>Fuentes e iconos sin conexión</td>
                  <td>
                    Se cargan desde Google Fonts y cdnjs. Para trabajar sin internet o con políticas de red estrictas hay que alojarlos en el repositorio.
                  </td>
                </tr>
                <tr>
                  <td>Pruebas con personas y otros navegadores</td>
                  <td>Firefox, Safari, lector de pantalla real y móvil físico siguen sin probarse (ver el informe de validación).</td>
                </tr>
                <tr>
                  <td>Modo nocturno</td>
                  <td>
                    <b>Pospuesto por decisión del equipo.</b>
                    {" "}Faltaría validar la paleta de gráficos y los tokens contra una superficie oscura.
                  </td>
                </tr>
                <tr>
                  <td>Mascota de marca</td>
                  <td>
                    <b>Próxima creación.</b>
                    {" "}Aún no existe: cuando esté definida habrá que documentar en Marca y entregables sus usos, tamaños mínimos, expresiones y reglas de aparición (por ejemplo, que nunca sustituya un mensaje de estado), con su versión accesible.
                  </td>
                </tr>
                <tr>
                  <td>Prueba de concepto en React</td>
                  <td>
                    <b>Pospuesta.</b>
                    {" "}Se eligió solo documentar la migración; la prueba con 3 componentes (botón, píldora de estado y alerta) está descrita pero no hecha.
                  </td>
                </tr>
                <tr>
                  <td>Idiomas</td>
                  <td>
                    Todo el sistema está en español. Si el producto se ofrece en otros idiomas hay que revisar textos, fechas y longitudes de etiqueta.
                  </td>
                </tr>
                <tr><td>Aviso de cookies y consentimiento web</td><td>No está cubierto; solo existe el consentimiento biométrico.</td></tr>
                <tr>
                  <td>Patrones, componentes y plantillas</td>
                  <td>
                    Son{" "}
                    <b>ejemplos ilustrativos de uso del sistema</b>
                    , no una copia fiel del producto final. Están documentados como simulaciones; no existen aún en el frontend del producto. Hay que implementarlos con datos reales y revisar con quien opere cámara, lector y padrón.
                  </td>
                </tr>
                <tr>
                  <td>Consentimiento biométrico</td>
                  <td>Plazos de conservación, canal de revocación y texto legal pendientes de definir con el área jurídica.</td>
                </tr>
                <tr>
                  <td>Correos</td>
                  <td>
                    Probar en clientes reales (Gmail, Outlook, Apple Mail) y alojar el logo en un dominio público para{" "}
                    <code>{"{{logo_url}}"}</code>
                    .
                  </td>
                </tr>
                <tr>
                  <td>Shell de navegación</td>
                  <td>La unificación del shell del dashboard con el resto de páginas espera la señal del equipo.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--night" id="consumo" aria-labelledby="h-consumo" data-nav="Consumo e implementación" data-grp="Gobernanza">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Calidad y gobernanza · Gobernanza</span>
          <h2 id="h-consumo">Consumo</h2>
          <p className="ds-lead">Cómo usar el sistema en una pantalla nueva y en qué estado está cada una.</p>
          <h3 className="ds-sub">Empezar una pantalla</h3>
          <div className="codeblock">
            <pre id="code-start">
              {"<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;600;700&display=swap\" rel=\"stylesheet\">\n<link href=\"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css\" rel=\"stylesheet\">\n<link href=\"RUTA/design-system.css\" rel=\"stylesheet\">   "}
              <b>{"<!-- tokens.css -->"}</b>
              {"\n<link href=\"RUTA/mi-pantalla.css\" rel=\"stylesheet\">    "}
              <b>{"<!-- solo lo propio, acotado a body.av-mi-pantalla -->"}</b>
              {"\n\nbody.av-mi-pantalla { background: #fff; color: var(--av-navy); font-family: var(--av-font-body); }\n.av-mi-pantalla :focus-visible { outline: 2px solid var(--av-blue); outline-offset: 3px; }"}
            </pre>
            <button className="copy" type="button" data-copy="#code-start">Copiar</button>
          </div>
          <h3 className="ds-sub">Equivalencias con el código</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Componente (este documento)</th><th>Landing</th><th>Login</th><th>Dashboard</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>hz-btn--primary / ghost</code></td>
                  <td><code>mn-btn--blue / --ghost</code></td>
                  <td><code>lg-submit</code></td>
                  <td>—</td>
                </tr>
                <tr><td><code>hz-input · hz-field</code></td><td>—</td><td><code>lg-input · lg-field</code></td><td>—</td></tr>
                <tr><td><code>hz-alert</code></td><td>—</td><td><code>lg-alert</code></td><td>—</td></tr>
                <tr><td><code>hz-tile</code></td><td>—</td><td>—</td><td><code>dh-tile</code>{" "}/{" "}<code>dh-cell</code></td></tr>
                <tr><td><code>hz-kpis</code></td><td>—</td><td>—</td><td><code>dh-kpis</code></td></tr>
                <tr><td><code>hz-panel · hz-bars · hz-feed</code></td><td>—</td><td>—</td><td><code>dh-panel · dh-bars · dh-feed</code></td></tr>
                <tr>
                  <td><code>hz-pill · hz-brandchip</code></td>
                  <td><code>mn-pill · mn-brand</code></td>
                  <td><code>lg-brand</code></td>
                  <td><code>av-navbar__brand</code>{" "}(acotado)</td>
                </tr>
                <tr><td><code>hz-dock</code></td><td>—</td><td>—</td><td><code>av-dock</code>{" "}(acotado a{" "}<code>body.av-dash</code>)</td></tr>
                <tr><td><code>hz-line · hz-media · hz-person</code></td><td><code>mn-row · mn-media · mn-person</code></td><td>—</td><td>—</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Estado de adopción</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Pantalla</th><th>Estado</th><th>Archivos</th></tr></thead>
              <tbody>
                <tr>
                  <td>Landing</td>
                  <td className="pass">Horizonte v1.1</td>
                  <td><code>index.html</code>{" "}·{" "}<code>landing.css</code>{" "}·{" "}<code>home.js</code></td>
                </tr>
                <tr>
                  <td>Login</td>
                  <td className="pass">Horizonte v1.1</td>
                  <td><code>login.html</code>{" "}·{" "}<code>login.css</code>{" "}·{" "}<code>login.js</code></td>
                </tr>
                <tr>
                  <td>Dashboard</td>
                  <td className="pass">Horizonte v1.0 (shell acotado)</td>
                  <td><code>dashboard/index.html</code>{" "}·{" "}<code>dashboard-page.css</code>{" "}·{" "}<code>dashboard.js</code></td>
                </tr>
                <tr>
                  <td>Shell global (dock en las demás pantallas)</td>
                  <td className="fail">Pendiente: lo decide el equipo</td>
                  <td><code>dashboard-shell.css</code>{" "}·{" "}<code>components.css</code></td>
                </tr>
                <tr>
                  <td>Identidad, Documentos, Biometría, Electoral, IA</td>
                  <td className="fail">Estilo anterior</td>
                  <td><code>modules.css</code>{" "}y páginas de cada módulo</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Migrar un módulo</h3>
          <ol className="ds-note" style={{ color: "var(--av-night-text)", paddingLeft: "1.2rem" }}>
            <li>Acota los estilos a una clase de body (<code>body.av-identidad</code>) y crea su CSS propio.</li>
            <li>Cambia el contenedor a la rejilla de 12 columnas y aplica el ritmo de sección.</li>
            <li>Sustituye tarjetas con sombra por líneas de 1 px; usa un panel navy solo si hay un cambio de información.</li>
            <li>Pasa botones, campos y chips a los componentes de este documento.</li>
            <li>Define carga, vacío y error; revisa foco, contraste y reduced-motion.</li>
            <li>Quita Bootstrap de la página si ya no se usa (se conservan los iconos).</li>
          </ol>
          <h3 className="ds-sub">Migración a React{" "}<small>informe de auditoría v1.3 · ampliado en v1.7</small></h3>
          <p className="ds-note" style={{ color: "var(--av-night-text)" }}>
            Es una{" "}
            <b>recomendación documentada</b>
            , no una migración: el frontend actual es HTML, CSS y JavaScript estático y no se ha tocado.{" "}
            <b>Sí se puede migrar a React, y de forma incremental</b>
            : lo que define el estilo (los tokens) pasa sin cambios y lo que se reemplaza es el comportamiento de los componentes. Verificar versiones, compatibilidad con la versión de Next.js en uso y licencias antes de adoptar cualquier librería.
          </p>
          <h4 className="ds-sub">Qué pasa a React y cómo</h4>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Pieza actual</th><th>En React</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>tokens.css</code>{" "}y{" "}<code>tokens.json</code>{" "}(color, tipografía, radios, sombras, movimiento)</td>
                  <td>
                    <b>Sin cambios.</b>
                    {" "}Variables CSS, o{" "}
                    <code>@theme</code>
                    {" "}de Tailwind v4 si se usa shadcn/ui. Siguen siendo la fuente de verdad.
                  </td>
                </tr>
                <tr>
                  <td>Clases{" "}<code>hz-*</code>{" "}(botones, chips, alertas, tablas, tarjetas)</td>
                  <td><b>Se reutilizan.</b>{" "}Como CSS global o Módulos CSS; los componentes React solo ponen las clases y las variantes.</td>
                </tr>
                <tr>
                  <td>JavaScript de las demos (combobox, fechas, drawer, Ctrl + K, tabla avanzada, código de 6 dígitos)</td>
                  <td>
                    <b>Se reemplaza</b>
                    {" "}por componentes con foco, teclado y ARIA ya resueltos. Nuestro código sirve como especificación y como pruebas de aceptación.
                  </td>
                </tr>
                <tr>
                  <td>Gráficos SVG propios</td>
                  <td>Se mantienen como componentes React (estilo "píldora" propio) o se apoyan en Recharts / Visx con formas personalizadas.</td>
                </tr>
                <tr>
                  <td>Documentación generada con{" "}<code>build.py</code></td>
                  <td>Puede seguir igual, o pasar a Storybook cuando existan los componentes.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 className="ds-sub">Librería recomendada</h4>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Componente</th><th>Librería recomendada</th><th>Por qué</th></tr></thead>
              <tbody>
                <tr>
                  <td>Base: botones, campos, modal, popover, tooltip, menú, drawer, alertas</td>
                  <td><b>shadcn/ui</b></td>
                  <td>
                    El código se copia al repositorio (no es una dependencia opaca) y se tematiza con los tokens{" "}
                    <code>--av-*</code>
                    . Es lo que propone la auditoría del líder.
                  </td>
                </tr>
                <tr>
                  <td>Primitivas bajo shadcn/ui</td>
                  <td><b>React Aria</b>, Base UI o Radix UI</td>
                  <td>
                    shadcn/ui permite elegir la base.{" "}
                    <b>Decisión sugerida:</b>
                    {" "}React Aria Components para fechas, combobox y tablas, donde la accesibilidad pesa más; el resto con la base por defecto. Base UI es una alternativa de API simple; Radix sigue siendo válido, aunque su ritmo de lanzamientos se ha reducido.
                  </td>
                </tr>
                <tr><td>Toasts</td><td>Sonner</td><td>Apilado, pausa al pasar el cursor,{" "}<code>aria-live</code>{" "}y animación listos.</td></tr>
                <tr>
                  <td>Tabla avanzada</td>
                  <td>TanStack Table + tabla de shadcn/ui</td>
                  <td>Orden, filtro, selección y paginación robustos; el aspecto sigue siendo "líneas, no cajas".</td>
                </tr>
                <tr><td>Paleta Ctrl + K</td><td>cmdk</td><td>Búsqueda y navegación por teclado listas.</td></tr>
                <tr><td>Código de 6 dígitos</td><td>input-otp</td><td>Pegado, autocompletado y foco entre casillas.</td></tr>
                <tr><td>Fechas</td><td>react-day-picker, o React Aria</td><td>Navegación por teclado incluida.</td></tr>
                <tr>
                  <td>Formularios y validación</td>
                  <td>React Hook Form + Zod</td>
                  <td>Resumen de errores y mensajes por campo según el patrón de este documento.</td>
                </tr>
                <tr>
                  <td>Píldoras de estado</td>
                  <td><code>Badge</code>{" "}de shadcn/ui con variantes</td>
                  <td>Una sola definición de las 3 variantes y los tonos, consumida en toda la app.</td>
                </tr>
                <tr>
                  <td>Gráficos y panel de actividad</td>
                  <td>Recharts o Visx</td>
                  <td>Barras, líneas y KPIs con la paleta{" "}<code>--viz-*</code>{" "}y los colores de estado.</td>
                </tr>
                <tr>
                  <td>Documentación viva y pruebas visuales</td>
                  <td>Storybook</td>
                  <td>Cada componente con sus estados, controles y comprobaciones de accesibilidad.</td>
                </tr>
                <tr><td>Iconos</td><td>lucide-react, o Bootstrap Icons para continuidad</td><td>—</td></tr>
              </tbody>
            </table>
          </div>
          <h4 className="ds-sub">Qué evitar</h4>
          <p className="ds-note" style={{ color: "var(--av-night-text)" }}>
            Los kits con estética propia (MUI, Chakra, Tremor, HeroUI, Mantine) salvo que se sobrescriba todo su tema con los tokens: el riesgo es justo el que la auditoría quiere evitar, que la aplicación se vea genérica.
          </p>
          <h4 className="ds-sub">Ruta por fases</h4>
          <ol className="ds-note" style={{ color: "var(--av-night-text)", paddingLeft: "1.2rem" }}>
            <li><b>Base:</b>{" "}Next.js, Tailwind v4 y los tokens como variables CSS.</li>
            <li>
              <b>Componentes base</b>
              {" "}(8–10): Button, Input, Select, Chip / Badge, Alert, Dialog, Tabs, Tooltip y Toast, con las clases{" "}
              <code>hz-*</code>
              .
            </li>
            <li><b>Formularios y tabla avanzada.</b></li>
            <li><b>Patrones biométricos y plantillas.</b></li>
            <li><b>Gráficos.</b></li>
            <li><b>Storybook</b>{" "}como documentación viva.</li>
          </ol>
          <p className="ds-note" style={{ color: "var(--av-night-text)" }}>Las pantallas del producto se migran por módulos, no de golpe.</p>
          <h4 className="ds-sub">Advertencias</h4>
          <ul className="ds-note" style={{ color: "var(--av-night-text)", paddingLeft: "1.2rem" }}>
            <li>shadcn/ui asume Tailwind: habría que introducirlo si hoy no se usa.</li>
            <li>
              Las reglas propias (señal única, mono en acciones, plano por defecto, el color nunca es el único canal){" "}
              <b>no se heredan</b>
              : deben escribirse como variantes de los componentes.
            </li>
            <li>
              La librería aporta mecánica, no estética: una sola tabla de estados consumida por píldoras, panel, toasts y gráficos evita que cada componente decida por su cuenta.
            </li>
            <li>
              Las recomendaciones salen de comparativas publicadas en 2026, no de pruebas propias; conviene una prueba de concepto con 3 componentes antes de comprometerse.
            </li>
          </ul>
        </div>
      </section>
      <section className="ds-sec" id="dependencias" aria-labelledby="h-dependencias" data-nav="Dependencias y librerías" data-grp="Gobernanza">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Calidad y gobernanza · Gobernanza</span>
          <h2 id="h-dependencias">Dependencias y librerías</h2>
          <p className="ds-lead">
            Todo lo que hace falta para usar el sistema, para construir esta documentación, para probarla y, si el equipo decide migrar, para llevarla a React. La primera tabla es lo único{" "}
            <b>obligatorio hoy</b>
            : el sistema es HTML, CSS y JavaScript sin paso de compilación.
          </p>
          <h3 className="ds-sub">Para usar el sistema hoy{" "}<small>HTML, CSS y JS estático</small></h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Dependencia</th><th>Versión</th><th>Para qué</th><th>Cómo se carga</th></tr></thead>
              <tbody>
                <tr>
                  <td><b>Space Grotesk</b></td>
                  <td>pesos 500, 600, 700</td>
                  <td>Titulares y cifras</td>
                  <td rowSpan={3}>Google Fonts, una sola hoja de estilos (ver "Empezar una pantalla")</td>
                </tr>
                <tr><td><b>Inter</b></td><td>pesos 400, 500, 600, 700</td><td>Texto de interfaz</td></tr>
                <tr><td><b>JetBrains Mono</b></td><td>pesos 500, 700</td><td>Acciones, rótulos y datos</td></tr>
                <tr>
                  <td><b>Bootstrap Icons</b></td>
                  <td>1.11.3</td>
                  <td>Iconografía (<code>bi bi-*</code>)</td>
                  <td>cdnjs, hoja de estilos con la fuente de iconos</td>
                </tr>
                <tr>
                  <td><b>Bootstrap</b></td>
                  <td>5.3.3</td>
                  <td>Solo el frontend actual;{" "}<b>este sistema no lo necesita</b></td>
                  <td>CDN, hasta que cada módulo migre</td>
                </tr>
                <tr>
                  <td><b><code>tokens.css</code>{" "}/{" "}<code>design-system.css</code></b></td>
                  <td>del repositorio</td>
                  <td>Colores, tipografía, radios, sombras y movimiento (<code>--av-*</code>)</td>
                  <td>Archivos del repositorio;{" "}<code>tokens.json</code>{" "}es el mismo contenido para otras herramientas</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            <b>JavaScript:</b>
            {" "}ninguna librería. Las demos usan JS propio sin dependencias.{" "}
            <b>Sin internet:</b>
            {" "}las fuentes y los iconos vienen de un CDN; para trabajar sin conexión hay que descargarlos y servirlos desde el repositorio (aún no está hecho, ver la deuda conocida).
          </p>
          <h3 className="ds-sub">Para construir la documentación{" "}<small>herramientas de este repositorio</small></h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Herramienta</th><th>Versión</th><th>Para qué</th></tr></thead>
              <tbody>
                <tr>
                  <td><b>Python 3</b></td>
                  <td>3.x (probado con 3.14)</td>
                  <td>
                    <code>build.py</code>
                    {" "}arma las 8 páginas y valida ids, enlaces y demos;{" "}
                    <code>bundle.py</code>
                    {" "}genera el HTML único;{" "}
                    <code>emails.py</code>
                    {" "}y{" "}
                    <code>tokens_export.py</code>
                    {" "}generan correos y{" "}
                    <code>tokens.json</code>
                    . Usan solo la{" "}
                    <b>biblioteca estándar</b>
                    : no hay que instalar paquetes.
                  </td>
                </tr>
                <tr>
                  <td><b>Servidor estático</b></td>
                  <td>cualquiera</td>
                  <td>
                    Para ver las páginas por separado:{" "}
                    <code>python -m http.server</code>
                    {" "}desde la carpeta que contiene las páginas generadas.
                  </td>
                </tr>
                <tr>
                  <td><b>Navegador</b></td>
                  <td>Chrome / Edge 111, Safari 16.2, Firefox 121 o posterior</td>
                  <td>Mínimos por{" "}<code>:has()</code>{" "}y{" "}<code>color-mix()</code>{" "}(ver el informe de validación).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Para probar{" "}<small>calidad y accesibilidad</small></h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Herramienta</th><th>Versión</th><th>Para qué</th></tr></thead>
              <tbody>
                <tr><td><b>Node.js</b></td><td>probado con 24</td><td>Ejecuta las pruebas.</td></tr>
                <tr>
                  <td><b>Playwright</b>{" "}(<code>playwright-core</code>)</td>
                  <td>1.63.0</td>
                  <td>Recorrer las páginas, probar demos, teclado, capturas y PDF A4. Usado con Microsoft Edge.</td>
                </tr>
                <tr>
                  <td><b>axe-core</b></td>
                  <td>4.10.2 usado · en npm: 4.13.0</td>
                  <td>
                    Auditoría de accesibilidad automática (WCAG 2.2 AA).{" "}
                    <code>@axe-core/playwright</code>
                    {" "}4.13.0 la integra con Playwright.
                  </td>
                </tr>
                <tr>
                  <td><b>Detector de Impeccable</b></td>
                  <td>del repositorio</td>
                  <td>Revisión de patrones de diseño (skill Impeccable del repositorio).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            Las pruebas están hechas con scripts sueltos, no con un{" "}
            <code>package.json</code>
            . Si pasan a ser parte del repositorio oficial, conviene crearlo con estas tres dependencias de desarrollo.
          </p>
          <h3 className="ds-sub">Para migrar a React{" "}<small>recomendación, aún sin adoptar</small></h3>
          <p className="ds-lead" style={{ maxWidth: "70ch" }}>
            Versiones consultadas en el registro de npm el 3 de octubre de 2026. Son las{" "}
            <b>más recientes ese día</b>
            , no un compromiso: hay que fijarlas y verificar compatibilidad con la versión de Next.js antes de empezar.
          </p>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Paquete</th><th>Versión en npm</th><th>Para qué</th><th>Nivel</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>react</code>,{" "}<code>react-dom</code></td>
                  <td>19.3.0</td>
                  <td>Base</td>
                  <td><span className="hz-chip hz-chip--success"><Icon name="check-circle" />Necesario</span></td>
                </tr>
                <tr>
                  <td><code>next</code></td>
                  <td>16.3.8 · Node ≥ 20.9</td>
                  <td>Framework y enrutado por módulos</td>
                  <td><span className="hz-chip hz-chip--success"><Icon name="check-circle" />Necesario</span></td>
                </tr>
                <tr>
                  <td><code>tailwindcss</code>,{" "}<code>@tailwindcss/postcss</code></td>
                  <td>4.3.3</td>
                  <td>Estilos. Los tokens{" "}<code>--av-*</code>{" "}pasan a{" "}<code>@theme</code></td>
                  <td><span className="hz-chip hz-chip--success"><Icon name="check-circle" />Necesario</span></td>
                </tr>
                <tr>
                  <td><code>shadcn</code>{" "}(CLI)</td>
                  <td>4.21.1 · Node ≥ 20.18.1</td>
                  <td>Copia los componentes base al repositorio</td>
                  <td><span className="hz-chip hz-chip--success"><Icon name="check-circle" />Necesario</span></td>
                </tr>
                <tr>
                  <td><code>class-variance-authority</code>,{" "}<code>clsx</code>,{" "}<code>tailwind-merge</code></td>
                  <td>0.7.1 · 2.1.1 · 3.7.0</td>
                  <td>Variantes de componentes (las 3 variantes de píldora, tamaños de botón) y unión de clases</td>
                  <td><span className="hz-chip hz-chip--success"><Icon name="check-circle" />Necesario</span></td>
                </tr>
                <tr>
                  <td><code>tw-animate-css</code></td>
                  <td>1.4.0</td>
                  <td>Animaciones de entrada y salida de los componentes de shadcn</td>
                  <td><span className="hz-chip hz-chip--success"><Icon name="check-circle" />Necesario</span></td>
                </tr>
                <tr>
                  <td><code>@base-ui/react</code></td>
                  <td>1.8.0</td>
                  <td>Primitivas accesibles (foco, teclado, ARIA). Alternativa:{" "}<code>radix-ui</code>{" "}1.6.7</td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />Una de las dos</span></td>
                </tr>
                <tr>
                  <td><code>react-aria-components</code></td>
                  <td>1.21.1</td>
                  <td>Fechas, combobox y tablas, donde la accesibilidad pesa más</td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />Recomendado</span></td>
                </tr>
                <tr>
                  <td><code>sonner</code></td>
                  <td>2.0.8</td>
                  <td>Toasts apilados con{" "}<code>aria-live</code></td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />Recomendado</span></td>
                </tr>
                <tr>
                  <td><code>@tanstack/react-table</code></td>
                  <td>9.2.4</td>
                  <td>Tabla avanzada: orden, filtro, selección, paginación</td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />Recomendado</span></td>
                </tr>
                <tr>
                  <td><code>cmdk</code></td>
                  <td>1.1.1</td>
                  <td>Paleta de comandos Ctrl + K</td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />Recomendado</span></td>
                </tr>
                <tr>
                  <td><code>input-otp</code></td>
                  <td>1.5.0</td>
                  <td>Código de un solo uso de 6 dígitos</td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />Recomendado</span></td>
                </tr>
                <tr>
                  <td><code>react-day-picker</code></td>
                  <td>10.0.2 · requiere{" "}<code>date-fns</code>{" "}4</td>
                  <td>Selector de fechas (o el de React Aria)</td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />Una de las dos</span></td>
                </tr>
                <tr>
                  <td><code>react-hook-form</code>,{" "}<code>zod</code>,{" "}<code>@hookform/resolvers</code></td>
                  <td>7.89.0 · 4.6.5 · 5.9.1</td>
                  <td>Formularios, validación y resumen de errores</td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />Recomendado</span></td>
                </tr>
                <tr>
                  <td><code>recharts</code></td>
                  <td>3.10.1</td>
                  <td>Gráficos con la paleta{" "}<code>--viz-*</code>. Alternativa:{" "}<code>@visx/visx</code>{" "}4.0.0</td>
                  <td><span className="hz-chip hz-chip--neutral"><Icon name="dash-circle" />Opcional</span></td>
                </tr>
                <tr>
                  <td><code>lucide-react</code></td>
                  <td>1.51.0</td>
                  <td>Iconos. Se puede conservar Bootstrap Icons por continuidad</td>
                  <td><span className="hz-chip hz-chip--neutral"><Icon name="dash-circle" />Opcional</span></td>
                </tr>
                <tr>
                  <td><code>storybook</code></td>
                  <td>10.6.1</td>
                  <td>Documentación viva de los componentes y pruebas visuales</td>
                  <td><span className="hz-chip hz-chip--neutral"><Icon name="dash-circle" />Opcional</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 className="ds-sub">Instalación de referencia</h4>
          <div className="codeblock">
            <pre id="code-react">
              {"1. Proyecto\n   npx create-next-app@latest averyn-web --typescript --tailwind --app\n2. Componentes base (copia el código al repositorio)\n   npx shadcn@latest init\n   npx shadcn@latest add button input select badge alert dialog tabs tooltip table\n3. Complementos\n   npm i sonner @tanstack/react-table cmdk input-otp react-day-picker date-fns\n   npm i react-hook-form zod @hookform/resolvers recharts react-aria-components\n4. Desarrollo y pruebas\n   npm i -D storybook @playwright/test @axe-core/playwright"}
            </pre>
            <button className="copy" type="button" data-copy="#code-react">Copiar</button>
          </div>
          <p className="ds-note">
            Los comandos son una guía:{" "}
            <code>shadcn init</code>
            {" "}pregunta la base de primitivas (Base UI o Radix) y el estilo, y su salida cambia con la versión. Los tokens de{" "}
            <code>tokens.css</code>
            {" "}se pasan a{" "}
            <code>@theme</code>
            {" "}
            <b>antes</b>
            {" "}de añadir componentes, para que nada herede el tema por defecto.
          </p>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="ubicacion" aria-labelledby="h-ubicacion" data-nav="Dónde vive cada archivo" data-grp="Gobernanza">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Calidad y gobernanza · Gobernanza</span>
          <h2 id="h-ubicacion">Dónde vive cada archivo</h2>
          <p className="ds-lead">
            El resto de la documentación habla de{" "}
            <b>roles</b>
            {" "}("la fuente de tokens", "la carpeta de herramientas"), no de rutas. Esta es la{" "}
            <b>única tabla con rutas</b>
            : al mover el sistema a otro repositorio solo hay que actualizarla (y los marcadores{" "}
            <code>{"{{FE}}"}</code>
            ,{" "}
            <code>{"{{DS}}"}</code>
            {" "}y{" "}
            <code>{"{{DOCS}}"}</code>
            {" "}del script de construcción).
          </p>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Rol</th><th>Hoy (repositorio de pruebas)</th><th>En el repositorio oficial</th></tr></thead>
              <tbody>
                <tr>
                  <td><b>Fuente de verdad de los valores</b>{" "}(tokens)</td>
                  <td><code>averyn-frontend/assets/css/tokens.css</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Estilos de los componentes</b>{" "}en el frontend</td>
                  <td><code>averyn-frontend/assets/css/design-system.css</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Principios y reglas</b></td>
                  <td><code>DESIGN.md</code>{" "}(raíz)</td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Documento maestro</b>{" "}(.md)</td>
                  <td><code>docs/averyn-design-system-horizonte.md</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>HTML único</b>{" "}(el entregable)</td>
                  <td><code>docs/averyn-design-system-horizonte.html</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Fuentes de las páginas</b>{" "}y herramientas de construcción</td>
                  <td>
                    <code>docs/ds/src/</code>
                    {" "}(
                    <code>*-body.html</code>
                    {" "}y los scripts{" "}
                    <code>build.py</code>
                    ,{" "}
                    <code>bundle.py</code>
                    ,{" "}
                    <code>emails.py</code>
                    ,{" "}
                    <code>tokens_export.py</code>
                    )
                  </td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Páginas generadas</b>{" "}(salida de la construcción; no se entregan)</td>
                  <td><code>docs/ds/*.html</code></td>
                  <td><span className="hz-chip hz-chip--neutral">No se versionan o se regeneran</span></td>
                </tr>
                <tr>
                  <td><b>Tokens en formato W3C</b>{" "}(generado)</td>
                  <td><code>docs/ds/tokens.json</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Correos transaccionales</b></td>
                  <td><code>docs/ds/emails/</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Favicons e imagen social</b></td>
                  <td><code>docs/ds/assets/</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Estilos de impresión</b></td>
                  <td><code>docs/ds/print.css</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Páginas de error</b>{" "}reales</td>
                  <td>
                    <code>averyn-frontend/</code>
                    {" "}(
                    <code>404.html</code>
                    ,{" "}
                    <code>403.html</code>
                    ,{" "}
                    <code>500.html</code>
                    ,{" "}
                    <code>offline.html</code>
                    ,{" "}
                    <code>mantenimiento.html</code>
                    ) y{" "}
                    <code>assets/css/error.css</code>
                  </td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
                <tr>
                  <td><b>Logos</b></td>
                  <td><code>averyn-frontend/assets/images/</code></td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="exclamation-circle" />Por definir</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            <b>Qué se entrega:</b>
            {" "}el HTML único y el documento maestro. Las páginas por separado existen solo para construir el HTML único y se pueden regenerar en cualquier momento.
          </p>
        </div>
      </section>
    </>
  );
}
