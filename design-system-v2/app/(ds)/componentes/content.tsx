/* Generado desde docs/ds/src por scripts/html-to-tsx.mjs (migración a React, v2.0).
   A partir de aquí este archivo es la fuente: se edita a mano. */
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { AccordionDemo, ActionMenuDemo, AvatarMenuDemo, ButtonLoadDemo, ComboboxDemo, CommandDemo, DatePickerDemo, DrawerDemo, LoadingDemo, ModalDemo, MultiSelectDemo, OtpDemo, PasswordDemo, PasswordFieldDemo, PopoverDemo, SearchDemo, StepperDemo, SwitchDemo, TableDemo, TabsPagerDemo, ToastButtons, UploadDemo, ValidationDemo } from "@/components/docs/demos";
import { ActivityKpi, ActivityPanelDemo, ChipMatrix } from "@/components/docs/foundation-demos";
import { Icon } from "@/components/ui/icon";

export default function ComponentesContent() {
  return (
    <>
      <section className="ds-sec" id="botones" aria-labelledby="h-botones" data-nav="Botones" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-botones">Botones</h2>
          <p className="ds-lead">
            Esquinas contenidas (8 px), 44 px de alto, texto mono en mayúsculas y respuesta inmediata al pulsar. Un solo botón primario por vista.
          </p>
          <div className="stage ds-gap-top">
            <span className="stage__label mono">Sobre claro · variantes</span>
            <div className="row">
              <button className="hz-btn hz-btn--primary" type="button">Ingresar →</button>
              <button className="hz-btn hz-btn--ghost" type="button">Conocer Averyn ↓</button>
              <button className="hz-btn hz-btn--text" type="button">Ver historial completo →</button>
              <button className="hz-btn hz-btn--danger" type="button">Eliminar persona</button>
              <button className="hz-btn hz-btn--primary" type="button" disabled>Deshabilitado</button>
              <ButtonLoadDemo />
            </div>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="stage stage--blue on-blue">
              <span className="stage__label mono">Sobre azul de señal</span>
              <div className="row">
                <button className="hz-btn hz-btn--light" type="button">Ingresar al sistema →</button>
                <button className="hz-btn hz-btn--ghost-inv" type="button">Saber más</button>
              </div>
            </div>
            <div className="stage stage--night on-night">
              <span className="stage__label mono">Sobre navy</span>
              <div className="row">
                <button className="hz-btn hz-btn--primary" type="button">Ingresar →</button>
                <button className="hz-btn hz-btn--ghost-inv" type="button">Conocer Averyn ↓</button>
              </div>
            </div>
          </div>
          <div className="stage ds-gap-top">
            <span className="stage__label mono">Icon-buttons · ancho completo</span>
            <div className="row">
              <button className="hz-iconbtn" type="button" aria-label="Buscar"><Icon name="search" /></button>
              <button className="hz-iconbtn" type="button" aria-label="Notificaciones, 3 sin leer">
                <Icon name="bell" />
                <span className="badge" aria-hidden="true">3</span>
              </button>
            </div>
            <div style={{ marginTop: "1rem", maxWidth: "360px" }}>
              <button className="hz-btn hz-btn--primary hz-btn--block" type="button">Ingresar de forma segura →</button>
            </div>
          </div>
          <div className="codeblock">
            <pre id="code-btn">
              {"<button class=\"hz-btn hz-btn--primary\">Ingresar →</button>\n<button class=\"hz-btn hz-btn--ghost\">Conocer Averyn ↓</button>\n\n.hz-btn { min-height: 44px; padding: 11px 20px; border-radius: "}
              <b>{"8px"}</b>
              {";\n  font: 700 .75rem var(--av-font-mono); letter-spacing: .06em; text-transform: uppercase;\n  transition: transform .15s var(--av-ease-out), background-color .15s var(--av-ease-out); }\n.hz-btn:active { transform: "}
              <b>{"scale(.97)"}</b>
              {"; }\n.hz-btn--primary { background: var(--av-blue); color: #fff; box-shadow: var(--av-shadow-key); }"}
            </pre>
            <button className="copy" type="button" data-copy="#code-btn">Copiar</button>
          </div>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Variante</th><th>Cuándo</th><th>Etiqueta</th></tr></thead>
              <tbody>
                <tr><td>Primary</td><td>La acción principal de la vista (una).</td><td>Verbo + flecha: "Ingresar →", "Verificar", "Guardar".</td></tr>
                <tr><td>Light / ghost invertido</td><td>Sobre azul o navy.</td><td>Igual; sin sombra de tecla en ghost.</td></tr>
                <tr><td>Ghost</td><td>Acción secundaria.</td><td>"Conocer Averyn ↓".</td></tr>
                <tr><td>Text</td><td>Enlace-acción discreto.</td><td>"Ver historial completo →".</td></tr>
                <tr>
                  <td>Danger</td>
                  <td>Acción destructiva; siempre con confirmación (modal).</td>
                  <td>Nombra lo que se elimina: "Eliminar persona".</td>
                </tr>
                <tr><td>Disabled</td><td>Mientras falte un requisito; explica por qué en el texto de ayuda.</td><td>Sin cambio de etiqueta.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="campos" aria-labelledby="h-campos" data-nav="Campos de formulario" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-campos">Campos de formulario</h2>
          <p className="ds-lead">
            Etiqueta siempre visible encima; el placeholder solo da un ejemplo. Borde de 3.68:1 (cumple 1.4.11), foco con borde azul y halo, error en texto y con{" "}
            <code>aria-invalid</code>
            .
          </p>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="stage">
              <span className="stage__label mono">Texto · ayuda · contraseña</span>
              <form className="row row--col" style={{ gap: "1.1rem" }} data-nosubmit="true" noValidate>
                <div className="hz-field">
                  <label className="hz-label" htmlFor="f-email">Correo electrónico</label>
                  <input className="hz-input" id="f-email" type="email" placeholder="nombre@organizacion.com" autoComplete="email" />
                  <span className="hz-help">Usa el correo que registró tu institución.</span>
                </div>
                <div className="hz-field">
                  <div className="hz-label__row">
                    <label className="hz-label" htmlFor="f-pass">Contraseña</label>
                    <button type="button" className="hz-btn hz-btn--text" style={{ minHeight: "24px", fontSize: ".8125rem", textTransform: "none", letterSpacing: "0", fontFamily: "var(--av-font-body)", fontWeight: "500" }}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <PasswordFieldDemo />
                </div>
              </form>
            </div>
            <div className="stage">
              <span className="stage__label mono">Estados</span>
              <div className="row row--col" style={{ gap: "1.1rem" }}>
                <div className="hz-field">
                  <label className="hz-label" htmlFor="f-err">Documento (error)</label>
                  <input className="hz-input" id="f-err" defaultValue="12A" aria-invalid="true" aria-describedby="f-err-m" />
                  <span className="hz-err" id="f-err-m"><Icon name="exclamation-circle" />El documento debe tener solo números.</span>
                </div>
                <div className="hz-field">
                  <label className="hz-label" htmlFor="f-ok">Documento (válido)</label>
                  <input className="hz-input hz-input--ok" id="f-ok" defaultValue="10234567" />
                  <span className="hz-help" style={{ color: "var(--av-success-text)" }}>Documento verificado.</span>
                </div>
                <div className="hz-field">
                  <label className="hz-label" htmlFor="f-dis">Institución (deshabilitado)</label>
                  <input className="hz-input" id="f-dis" defaultValue="Sede Central" disabled />
                </div>
              </div>
            </div>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="stage">
              <span className="stage__label mono">Select · textarea</span>
              <div className="row row--col" style={{ gap: "1.1rem" }}>
                <div className="hz-field">
                  <label className="hz-label" htmlFor="f-sel">Afiliación</label>
                  <select className="hz-select" id="f-sel"><option>Estudiante</option><option>Docente</option><option>Empleado</option></select>
                </div>
                <div className="hz-field">
                  <label className="hz-label" htmlFor="f-ta">Observaciones</label>
                  <textarea className="hz-textarea" id="f-ta" placeholder="Notas sobre el registro" />
                </div>
              </div>
            </div>
            <div className="stage">
              <span className="stage__label mono">Casilla · opciones · interruptor</span>
              <div className="row row--col" style={{ gap: ".2rem" }}>
                <label className="hz-check"><input type="checkbox" defaultChecked />Recordar mi institución</label>
                <label className="hz-check"><input type="radio" name="mod" defaultChecked />Rostro</label>
                <label className="hz-check"><input type="radio" name="mod" />Huella</label>
                <div className="row" style={{ marginTop: ".6rem" }}><SwitchDemo /><span>Notificaciones por correo</span></div>
              </div>
            </div>
          </div>
          <div className="codeblock">
            <pre id="code-field">
              {"<div class=\"hz-field\">\n  <label class=\"hz-label\" for=\"doc\">Documento</label>\n  <input class=\"hz-input\" id=\"doc\" "}
              <b>{"aria-invalid=\"true\" aria-describedby=\"doc-m\""}</b>
              {">\n  <span class=\"hz-err\" id=\"doc-m\">El documento debe tener solo números.</span>\n</div>\n.hz-input { min-height: 48px; border: 1px solid "}
              <b>{"var(--av-field-border)"}</b>
              {"; border-radius: 8px; }\n.hz-input:focus { border-color: var(--av-blue); box-shadow: 0 0 0 3px rgba(20,95,238,.18); }"}
            </pre>
            <button className="copy" type="button" data-copy="#code-field">Copiar</button>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Hacer</strong>
              <ul>
                <li>Validar al salir del campo y al enviar; un mensaje por campo, junto al campo.</li>
                <li>Tras un envío con error, mover el foco al primer campo inválido.</li>
                <li>Reservar el espacio de la alerta para que el formulario no salte.</li>
                <li>El botón de mostrar contraseña cambia el texto y{" "}<code>aria-pressed</code>, no la etiqueta.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>No hacer</strong>
              <ul>
                <li>Marcar en rojo un campo que no falla (p. ej. la contraseña cuando solo el correo es inválido).</li>
                <li>Placeholder como única etiqueta. Bordes de campo con el hairline (2.5:1).</li>
                <li>Mensajes genéricos ("Error", "Inválido") sin decir cómo arreglarlo.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="busqueda" aria-labelledby="h-busqueda" data-nav="Campo de búsqueda" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-busqueda">Campo de búsqueda</h2>
          <p className="ds-lead">
            Para filtrar una lista que ya está en pantalla. Filtra mientras se escribe, dice cuántos resultados hay y se limpia con un botón o con{" "}
            <kbd className="cp-k">Esc</kbd>
            . El atajo{" "}
            <kbd className="cp-k">/</kbd>
            {" "}lo enfoca desde cualquier parte de la página.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><SearchDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Teclado</h3>
                <ul>
                  <li><kbd>/</kbd>{" "}enfoca el campo (si no estás escribiendo en otro).</li>
                  <li><kbd>Esc</kbd>{" "}limpia el texto; con el campo vacío, quita el foco.</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li><code>type="search"</code>{" "}con etiqueta oculta para lectores de pantalla (el icono no es una etiqueta).</li>
                  <li>El conteo se anuncia con{" "}<code>role="status"</code>: "3 resultados" o "Sin resultados para «x»".</li>
                  <li>El botón de limpiar solo aparece con texto y mide 44 px.</li>
                  <li>Sin resultados: ofrecer cómo salir ("Quita algún filtro"), no una lista vacía.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="otp" aria-labelledby="h-otp" data-nav="Código de un solo uso" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-otp">Código de un solo uso (6 dígitos)</h2>
          <p className="ds-lead">
            Para confirmar el correo o el segundo factor. Seis casillas que se comportan como un solo campo: avanzan solas, aceptan pegar el código completo y avisan sin culpar si falla. Es el mismo código que prometen los correos de verificación.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><OtpDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Teclado</h3>
                <ul>
                  <li>Cada dígito avanza a la siguiente casilla;{" "}<kbd>Retroceso</kbd>{" "}en una casilla vacía vuelve a la anterior.</li>
                  <li>
                    <kbd>←</kbd>
                    {" "}
                    <kbd>→</kbd>
                    {" "}se mueven entre casillas;{" "}
                    <kbd>Inicio</kbd>
                    /
                    <kbd>Fin</kbd>
                    {" "}saltan a la primera y a la última.
                  </li>
                  <li>Pegar (<kbd>Ctrl</kbd>+<kbd>V</kbd>) reparte los dígitos; se ignoran espacios y guiones.</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>
                    <code>inputmode="numeric"</code>
                    {" "}y{" "}
                    <code>autocomplete="one-time-code"</code>
                    {" "}para que el móvil sugiera el código del SMS o del correo.
                  </li>
                  <li>Un{" "}<code>fieldset</code>{" "}con{" "}<code>legend</code>; cada casilla tiene su etiqueta ("Dígito 3 de 6").</li>
                  <li>Al completarse, se verifica sola; el botón existe para quien no confía en la automatización.</li>
                  <li>
                    Error: borde rojo{" "}
                    <b>y</b>
                    {" "}texto ("Código incorrecto. Te quedan 2 intentos."). Tras 3 fallos, se bloquea con el motivo y cuándo se puede reintentar.
                  </li>
                  <li>"Reenviar" se activa tras una espera visible; nunca se dice si el correo existe.</li>
                </ul>
              </div>
              <div>
                <h3>Copy aprobado</h3>
                <ul>
                  <li>Error: "Código incorrecto. Te quedan 2 intentos."</li>
                  <li>Bloqueo: "Demasiados intentos. Vuelve a intentarlo en 5 minutos."</li>
                  <li>Éxito: "Correo confirmado."</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="contrasena" aria-labelledby="h-contrasena" data-nav="Contraseña y fuerza" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-contrasena">Contraseña con indicador de fuerza</h2>
          <p className="ds-lead">
            Muestra qué se pide{" "}
            <b>antes</b>
            {" "}de escribir y cómo va la contraseña mientras se escribe: una barra de cuatro tramos, una palabra y una lista de requisitos con icono. El color nunca es el único aviso.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><PasswordDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Los requisitos se ven desde el principio, no como regaño tras el primer error.</li>
                  <li>Cada requisito lleva icono{" "}<b>y</b>{" "}estado en texto ("cumplido" / "falta") para lectores de pantalla.</li>
                  <li>
                    La barra tiene 4 tramos y una palabra: Muy débil, Débil, Buena, Fuerte. La palabra se anuncia de forma educada (
                    <code>aria-live="polite"</code>
                    ).
                  </li>
                  <li>Mostrar/Ocultar es un botón con{" "}<code>aria-pressed</code>; nunca se deshabilita pegar.</li>
                  <li><code>autocomplete="new-password"</code>{" "}para que el gestor de contraseñas proponga una.</li>
                  <li>Mínimo 10 caracteres; sin tope máximo menor a 64.</li>
                </ul>
              </div>
              <div>
                <h3>Importante</h3>
                <p style={{ margin: "0" }}>
                  La fuerza de esta demo es una estimación simple. En producción la validación definitiva (y la lista de contraseñas filtradas) la hace el servidor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="fechas" aria-labelledby="h-fechas" data-nav="Selector de fechas" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-fechas">Selector de fechas y rangos</h2>
          <p className="ds-lead">
            Para filtrar gráficos, bitácoras y reportes. Atajos a la izquierda para lo habitual (hoy, 7 días, 30 días, trimestre) y un calendario para el rango exacto. No se pueden elegir fechas futuras: no hay datos de lo que aún no pasó.
          </p>
          <div className="cp-grid">
            <DatePickerDemo />
            <div className="cp-side">
              <div>
                <h3>Teclado</h3>
                <ul>
                  <li><kbd>←</kbd>{" "}<kbd>→</kbd>{" "}día ·{" "}<kbd>↑</kbd>{" "}<kbd>↓</kbd>{" "}semana</li>
                  <li><kbd>Inicio</kbd>{" "}/{" "}<kbd>Fin</kbd>{" "}primer y último día de la semana</li>
                  <li><kbd>RePág</kbd>{" "}/{" "}<kbd>AvPág</kbd>{" "}mes anterior y siguiente</li>
                  <li><kbd>Enter</kbd>{" "}o{" "}<kbd>Espacio</kbd>{" "}marca el inicio y luego el fin</li>
                  <li><kbd>Esc</kbd>{" "}cierra y devuelve el foco al botón</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>El botón muestra el periodo vigente en texto ("1 sep – 30 sep 2026"), no solo "Personalizado".</li>
                  <li>Los atajos aplican al instante; el rango manual necesita "Aplicar".</li>
                  <li>Fechas futuras deshabilitadas con{" "}<code>aria-disabled</code>{" "}y en gris claro, no ocultas.</li>
                  <li>Días de 40 px y rejilla con{" "}<code>role="grid"</code>; el rango se dice en texto bajo el calendario.</li>
                  <li>Semana desde lunes. Formato{" "}<code>es-PE</code>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="combobox" aria-labelledby="h-cb" data-nav="Combobox" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-cb">Combobox con autocompletar</h2>
          <p className="ds-lead">
            Para elegir un valor de una lista larga (instituciones, personas, dispositivos). Se escribe para filtrar; el texto coincidente se resalta y el lector de pantalla anuncia cuántos resultados hay.
          </p>
          <div className="cp-grid">
            <div className="cp-demo cp-demo--open"><ComboboxDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Teclado</h3>
                <ul>
                  <li>
                    <kbd>↓</kbd>
                    {" "}
                    <kbd>↑</kbd>
                    {" "}mueven la opción activa (
                    <code>aria-activedescendant</code>
                    ); el foco se queda en el campo.
                  </li>
                  <li><kbd>Enter</kbd>{" "}elige ·{" "}<kbd>Esc</kbd>{" "}cierra, y una segunda vez limpia el texto.</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Roles ARIA 1.2:{" "}<code>combobox</code>{" "}+{" "}<code>listbox</code>{" "}+{" "}<code>option</code>.</li>
                  <li>Opciones de 44 px; el texto buscado en azul y negrita, no solo con fondo.</li>
                  <li>Sin resultados: "Sin resultados para «x»", nunca una lista vacía.</li>
                  <li>Para menos de 7 opciones, usa un{" "}<code>{"<select>"}</code>{" "}(<code>hz-select</code>).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="multiselect" aria-labelledby="h-multiselect" data-nav="Multi-select y filtros activos" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-multiselect">Multi-select y filtros activos</h2>
          <p className="ds-lead">
            Para elegir varios valores de una lista (dispositivos, estados, instituciones). Lo elegido se ve como chips que se quitan uno a uno, y los filtros activos quedan resumidos sobre la tabla con una salida clara: "Limpiar filtros".
          </p>
          <div className="cp-grid">
            <div className="cp-demo cp-demo--open" style={{ minHeight: 420 }}><MultiSelectDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Teclado</h3>
                <ul>
                  <li>
                    <kbd>↓</kbd>
                    {" "}
                    <kbd>↑</kbd>
                    {" "}mueven la opción activa;{" "}
                    <kbd>Espacio</kbd>
                    {" "}o{" "}
                    <kbd>Enter</kbd>
                    {" "}marcan o desmarcan y{" "}
                    <b>mantienen abierta</b>
                    {" "}la lista.
                  </li>
                  <li><kbd>Retroceso</kbd>{" "}con el campo vacío quita el último chip;{" "}<kbd>Esc</kbd>{" "}cierra la lista.</li>
                  <li>Cada chip es un botón (<kbd>Tab</kbd>,{" "}<kbd>Enter</kbd>{" "}o{" "}<kbd>Supr</kbd>{" "}lo quitan).</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>
                    <code>listbox</code>
                    {" "}con{" "}
                    <code>aria-multiselectable="true"</code>
                    {" "}y opciones con{" "}
                    <code>aria-selected</code>
                    ; la marca es un check{" "}
                    <b>más</b>
                    {" "}el texto.
                  </li>
                  <li>
                    Cada chip es un botón que dice "Quitar CAM-001" (
                    <code>aria-label</code>
                    ), con área de 28 px dentro de una píldora de 32 px (mínimo 24 px en WCAG 2.2); no es solo un ✕ sin nombre.
                  </li>
                  <li>Los filtros activos viven en una fila propia sobre los resultados, con el conteo ("5 eventos") y "Limpiar filtros".</li>
                  <li>Más de 5 chips: se resumen ("+3 más") con su detalle en el tooltip.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="validacion" aria-labelledby="h-validacion" data-nav="Validación y resumen de errores" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-validacion">Validación de formularios y resumen de errores</h2>
          <p className="ds-lead">
            Cuándo avisar y cómo. Se valida{" "}
            <b>al salir del campo</b>
            {" "}(no mientras se escribe por primera vez) y de nuevo al enviar. Si hay errores, una alerta arriba los resume con enlaces a cada campo y recibe el foco.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><ValidationDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Cuándo validar</h3>
                <ul>
                  <li><b>Al salir del campo</b>{" "}(<code>blur</code>), solo si la persona ya lo tocó; así no se grita al empezar.</li>
                  <li>Una vez inválido,{" "}<b>revalida mientras escribe</b>{" "}para que el error desaparezca en cuanto se corrige.</li>
                  <li><b>Al enviar</b>, valida todo, muestra el resumen y mueve el foco a él.</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>
                    Error en el campo: borde rojo, icono, texto bajo el campo (
                    <code>aria-describedby</code>
                    ) y{" "}
                    <code>aria-invalid="true"</code>
                    .
                  </li>
                  <li>
                    Resumen:{" "}
                    <code>role="alert"</code>
                    ,{" "}
                    <code>tabindex="-1"</code>
                    {" "}para recibir el foco, y enlaces que llevan al campo.
                  </li>
                  <li>El mensaje dice qué hacer ("Escribe un correo como nombre@dominio.com"), no solo qué está mal.</li>
                  <li>Nunca se vacía un formulario por un error; nunca se deshabilita el botón de enviar como única señal.</li>
                </ul>
              </div>
              <div>
                <h3>Copy aprobado</h3>
                <ul>
                  <li>Resumen: "Corrige 2 campos para continuar."</li>
                  <li>Nombre: "Escribe el nombre completo."</li>
                  <li>Correo: "Escribe un correo como nombre@dominio.com."</li>
                  <li>Documento: "El documento tiene 8 dígitos."</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="stepper" aria-labelledby="h-st" data-nav="Stepper" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-st">Stepper y asistente</h2>
          <p className="ds-lead">
            Para procesos de varios pasos (registrar una persona, configurar una elección). Muestra dónde estás y cuánto falta; valida cada paso antes de avanzar y deja volver sin perder lo escrito.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><StepperDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Anatomía</h3>
                <ol>
                  <li>
                    <b>Lista de pasos</b>
                    {" "}con círculos numerados: completado (azul con número), actual (borde azul, negrita), pendiente (gris).
                  </li>
                  <li><b>Panel del paso</b>{" "}con su titular; el foco va a él al cambiar.</li>
                  <li><b>Contador</b>{" "}"Paso 2 de 4" en{" "}<code>role="status"</code>.</li>
                  <li><b>Acciones:</b>{" "}Atrás (secundaria) y Siguiente (principal); en el último, "Guardar".</li>
                </ol>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Cada paso se valida al avanzar; el error se muestra bajo el campo y el foco va a él.</li>
                  <li>Atrás nunca borra lo escrito.</li>
                  <li>Máximo 6 pasos; con más, se divide en dos procesos.</li>
                  <li>En móvil solo se rotula el paso actual; el resto son círculos.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="carga-archivos" aria-labelledby="h-carga-archivos" data-nav="Carga de archivos" data-grp="Acciones y formularios">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Acciones y formularios</span>
          <h2 id="h-carga-archivos">Carga de archivos</h2>
          <p className="ds-lead">
            Para subir documentos de identidad, constancias o padrones. Una zona para soltar archivos que también funciona con teclado, y una lista donde cada archivo dice su estado con texto: cargando, listo, error o rechazado. Ningún archivo se sube de verdad en esta demo.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><UploadDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Estados de cada archivo</h3>
                <ul>
                  <li><b>Cargando:</b>{" "}barra con porcentaje y botón "Cancelar".</li>
                  <li><b>Listo:</b>{" "}chip verde con "Listo"; el botón pasa a "Quitar".</li>
                  <li><b>Error de red:</b>{" "}chip ámbar y botón "Reintentar" (se puede volver a intentar).</li>
                  <li>
                    <b>Rechazado:</b>
                    {" "}chip rojo con el motivo ("Formato no permitido", "Pesa más de 5 MB"); no se reintenta, se elige otro archivo.
                  </li>
                </ul>
              </div>
              <div>
                <h3>Teclado</h3>
                <ul>
                  <li><kbd>Tab</kbd>{" "}llega a la zona (el campo real es nativo, con foco visible en toda la zona).</li>
                  <li><kbd>Enter</kbd>{" "}o{" "}<kbd>Espacio</kbd>{" "}abre el selector de archivos.</li>
                  <li>Cada fila tiene su botón de acción de 44 px.</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Arrastrar es una mejora: siempre debe existir la vía de elegir con el selector.</li>
                  <li>Dilo antes de subir: formatos y tamaño máximo están a la vista, no solo en el error.</li>
                  <li>Valida en el navegador para avisar rápido y{" "}<b>otra vez en el servidor</b>: el navegador no es de fiar.</li>
                  <li>El avance se anuncia sin ruido: cada archivo anuncia "Listo" o su error, no cada porcentaje.</li>
                  <li>Los documentos de identidad son datos sensibles: avisar dónde se guardan y quién los ve.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="datos" aria-labelledby="h-datos" data-nav="Tablas y píldoras de estado" data-grp="Datos">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Datos</span>
          <h2 id="h-datos">Tablas, chips y datos</h2>
          <p className="ds-lead">
            Las tablas son líneas, no cajas: encabezado en mono, filas separadas por un hairline y un hover tenue. Los estados se dicen con una{" "}
            <b>píldora</b>
            {" "}que lleva la palabra y, si ayuda, un icono.
          </p>
          <div className="stage ds-gap-top">
            <div className="doc-wrap">
              <table className="hz-table">
                <thead>
                  <tr>
                    <th scope="col">Persona</th>
                    <th scope="col">Documento</th>
                    <th scope="col">Afiliación</th>
                    <th scope="col">Estado</th>
                    <th scope="col" style={{ textAlign: "right" }}>Última verificación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="who"><i>AT</i>Ana Torres</span></td>
                    <td className="num">10234567</td>
                    <td>Estudiante</td>
                    <td><span className="hz-chip hz-chip--success"><Icon name="check-circle" />Verificada</span></td>
                    <td className="num" style={{ textAlign: "right" }}>02/10/2026, 10:42</td>
                  </tr>
                  <tr>
                    <td><span className="who"><i>LP</i>Luis Pérez</span></td>
                    <td className="num">10345678</td>
                    <td>Docente</td>
                    <td><span className="hz-chip hz-chip--neutral"><Icon name="clock" />Pendiente</span></td>
                    <td style={{ textAlign: "right" }}>Sin verificar</td>
                  </tr>
                  <tr>
                    <td><span className="who"><i>LD</i>Laura Díaz</span></td>
                    <td className="num">10456789</td>
                    <td>Empleada</td>
                    <td><span className="hz-chip hz-chip--error"><Icon name="x-circle" />Rechazada</span></td>
                    <td className="num" style={{ textAlign: "right" }}>02/10/2026, 10:31</td>
                  </tr>
                  <tr>
                    <td><span className="who"><i>AM</i>Andrés Molina</span></td>
                    <td className="num">10567890</td>
                    <td>Estudiante</td>
                    <td><span className="hz-chip hz-chip--warning"><Icon name="arrow-repeat" />Reintento</span></td>
                    <td className="num" style={{ textAlign: "right" }}>02/10/2026, 09:55</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="ds-note">
            El marco con borde alrededor de la tabla es de la documentación, no del componente: en una pantalla real la tabla vive sobre el fondo de la página, sin caja.
          </p>
          <h3 className="ds-sub">Píldoras de estado{" "}<small>3 variantes</small></h3>
          <ChipMatrix />
          <div className="ds-grid ds-grid--3 ds-gap-top">
            <div className="stage">
              <span className="stage__label mono">Suave · por defecto</span>
              <p className="ds-note" style={{ margin: ".5rem 0 0" }}>
                Fondo tintado y texto del tono, sin borde. Es la que se usa en{" "}
                <b>tablas y listas</b>
                : se lee de un vistazo y no compite con los datos.
              </p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Contorno</span>
              <p className="ds-note" style={{ margin: ".5rem 0 0" }}>
                Borde y texto del tono, sin relleno. Para estados{" "}
                <b>secundarios</b>
                : borrador, "Sin dispositivo", etiquetas dentro de una tarjeta ya coloreada.
              </p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Sólida</span>
              <p className="ds-note" style={{ margin: ".5rem 0 0" }}>
                Fondo del tono y texto blanco. Para{" "}
                <b>énfasis puntual</b>
                : un contador, "Nueva", un estado crítico. Nunca más de una por fila.
              </p>
            </div>
          </div>
          <p className="ds-note">
            <b>Reglas.</b>
            {" "}Una sola variante por tabla. Sin punto: el estado lo dice la palabra; el icono es opcional, decorativo (
            <code>aria-hidden</code>
            ) y siempre el mismo para el mismo estado. Contraste del texto ≥ 5:1: sobre el fondo suave (los tonos{" "}
            <code>-strong</code>
            {" "}de Éxito y Aviso lo garantizan), blanco sobre el tono{" "}
            <code>-text</code>
            {" "}en la sólida y tono sobre blanco en el contorno. La píldora no es interactiva; si lo fuera, sería un botón.
          </p>
          <div className="stage ds-gap-top">
            <span className="stage__label mono">Etiqueta mono</span>
            <div className="row">
              <span className="hz-tag">Próximamente</span>
              <span className="hz-tag">Beta</span>
              <span className="hz-tag">CAM-001</span>
            </div>
            <p className="ds-note">Para metadatos y módulos pendientes. No es un estado de negocio.</p>
          </div>
          <h3 className="ds-sub">Tabla única de estados{" "}<small>una semántica, dos fondos</small></h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead>
                <tr><th>Estado de negocio</th><th>Píldora</th><th>Icono</th><th>Sobre fondo claro</th><th>Sobre navy (panel, toast)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Verificada · Aceptada · Éxito</td>
                  <td><span className="hz-chip hz-chip--success"><Icon name="check-circle" />Verificada</span></td>
                  <td><code>bi-check-circle</code></td>
                  <td>Verde{" "}<code>#047857</code>{" "}sobre{" "}<code>#E8F8F0</code></td>
                  <td>Verde{" "}<code>#6EE7B7</code></td>
                </tr>
                <tr>
                  <td>Reintento · Reintento requerido</td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="arrow-repeat" />Reintento</span></td>
                  <td><code>bi-arrow-repeat</code></td>
                  <td>Ámbar{" "}<code>#92400E</code>{" "}sobre{" "}<code>#FEF3E2</code></td>
                  <td>Ámbar{" "}<code>#FFC15A</code></td>
                </tr>
                <tr>
                  <td>Rechazada · Rechazo · Error</td>
                  <td><span className="hz-chip hz-chip--error"><Icon name="x-circle" />Rechazada</span></td>
                  <td><code>bi-x-circle</code></td>
                  <td>Rojo{" "}<code>#B91C1C</code>{" "}sobre{" "}<code>#FDECEA</code></td>
                  <td>Rojo suave{" "}<code>#FCA5A5</code></td>
                </tr>
                <tr>
                  <td>Pendiente · Sin verificar</td>
                  <td><span className="hz-chip hz-chip--neutral"><Icon name="clock" />Pendiente</span></td>
                  <td><code>bi-clock</code></td>
                  <td>Gris{" "}<code>#3B4664</code>{" "}sobre{" "}<code>#F4F6FA</code></td>
                  <td>Gris azulado{" "}<code>#B9C9E4</code></td>
                </tr>
                <tr>
                  <td>Desconectado</td>
                  <td><span className="hz-chip hz-chip--warning"><Icon name="plug" />Desconectado</span></td>
                  <td><code>bi-plug</code></td>
                  <td>Ámbar (como Reintento: requiere acción)</td>
                  <td>Ámbar{" "}<code>#FFC15A</code></td>
                </tr>
                <tr>
                  <td>Sin dispositivo</td>
                  <td><span className="hz-chip hz-chip--neutral hz-chip--outline">Sin dispositivo</span></td>
                  <td>—</td>
                  <td>Gris, variante contorno</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Información · En revisión</td>
                  <td><span className="hz-chip hz-chip--info"><Icon name="info-circle" />En revisión</span></td>
                  <td><code>bi-info-circle</code></td>
                  <td>Azul{" "}<code>#0369A1</code>{" "}sobre{" "}<code>#E3F6FA</code></td>
                  <td>No se usa sobre navy</td>
                </tr>
                <tr>
                  <td>Cian (<code>#00ACD2</code>{" "}/{" "}<code>#55D6FF</code>)</td>
                  <td>—</td>
                  <td>—</td>
                  <td colSpan={2}><b>Solo resalte</b>: trazos de la figura, índices y hover. Nunca es un estado.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            Una misma palabra tiene un mismo color en chips, panel, toasts y gráficos. Los{" "}
            <b>gráficos de resultado</b>
            {" "}(exitosas / reintentos / rechazadas) usan estos colores de estado; los gráficos de categorías (por método, por institución) usan la paleta categórica.
          </p>
          <p className="ds-note">
            <b>Datos técnicos</b>
            {" "}(documentos, códigos de dispositivo, fechas) van en JetBrains Mono. Fechas:{" "}
            <code>dd/mm/aaaa, hh:mm</code>
            {" "}(24 h). Una tabla vacía muestra un estado vacío con acción, no una tabla sin filas.
          </p>
        </div>
      </section>
      <section className="ds-sec" id="tabla" aria-labelledby="h-ta" data-nav="Tabla avanzada" data-grp="Datos">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Datos</span>
          <h2 id="h-ta">Tabla avanzada</h2>
          <p className="ds-lead">
            Para listas de personas, dispositivos o eventos con las que se trabaja: búsqueda, orden, selección, acciones masivas, densidad y paginación. Misma línea fina de 1 px del resto del sistema.
          </p>
          <div style={{ marginTop: "1.8rem" }}><TableDemo /></div>
          <div className="cp-grid" style={{ marginTop: "1.4rem" }}>
            <div className="cp-side">
              <div>
                <h3>Anatomía</h3>
                <ol>
                  <li>
                    <b>Barra:</b>
                    {" "}búsqueda a la izquierda, densidad a la derecha. Al seleccionar filas se reemplaza por la barra de acciones masivas con el conteo.
                  </li>
                  <li><b>Cabecera:</b>{" "}columnas ordenables como botones con{" "}<code>aria-sort</code>; flecha azul en la activa.</li>
                  <li><b>Filas</b>{" "}de 60 px (cómoda) o 44 px (compacta), con casilla de 44 px de área.</li>
                  <li><b>Pie:</b>{" "}"Mostrando 1–5 de 12" y paginación con página actual marcada.</li>
                </ol>
              </div>
            </div>
            <div className="cp-side">
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>La casilla de cabecera selecciona solo la página visible y queda "indeterminada" si hay parcial.</li>
                  <li>El conteo seleccionado se anuncia con{" "}<code>role="status"</code>.</li>
                  <li>La tabla se desplaza dentro de su contenedor en móvil (con foco y nombre), no desborda la página.</li>
                  <li>Sin resultados: una fila con mensaje y cómo limpiar el filtro.</li>
                  <li>Las acciones masivas destructivas piden confirmación.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="superficies" aria-labelledby="h-superficies" data-nav="Tarjetas y panel de actividad" data-grp="Datos">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Datos</span>
          <h2 id="h-superficies">Tarjetas y superficies</h2>
          <p className="ds-lead">
            Casi nada es una "tarjeta con sombra". Las superficies son tiles de color (acciones), líneas de 1 px (listas y datos), un panel navy (el cambio de información) y marcos reservados para media.
          </p>
          <h3 className="ds-sub">Tiles de acceso{" "}<small>mosaico asimétrico · 6 columnas</small></h3>
          <div className="stage stage--tint">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: "1rem" }}>
              <a className="hz-tile hz-tile--signal" href="#superficies" style={{ gridColumn: "span 3", minHeight: "230px" }}>
                <span className="hz-tile__icon" aria-hidden="true"><Icon name="person-vcard" /></span>
                <span>
                  <span className="hz-tile__title" style={{ fontSize: "1.8rem" }}>Gestionar personas</span>
                  <span className="hz-tile__desc">Listado y verificación de identidad</span>
                </span>
                <span className="hz-tile__arrow" aria-hidden="true">↗</span>
              </a>
              <a className="hz-tile hz-tile--night" href="#superficies" style={{ gridColumn: "span 3", minHeight: "230px" }}>
                <span className="hz-tile__icon" aria-hidden="true"><Icon name="fingerprint" /></span>
                <span>
                  <span className="hz-tile__title" style={{ fontSize: "1.8rem" }}>Biometría</span>
                  <span className="hz-tile__desc">Registro y verificación de rostro y huella</span>
                </span>
                <span className="hz-tile__arrow" aria-hidden="true">↗</span>
              </a>
              <a className="hz-tile hz-tile--tint" href="#superficies" style={{ gridColumn: "span 2" }}>
                <span className="hz-tile__icon" aria-hidden="true"><Icon name="file-earmark-text" /></span>
                <span><span className="hz-tile__title">Procesar documento</span><span className="hz-tile__desc">OCR · nuevo registro</span></span>
                <span className="hz-tile__arrow" aria-hidden="true">↗</span>
              </a>
              <a className="hz-tile hz-tile--tint" href="#superficies" style={{ gridColumn: "span 2" }}>
                <span className="hz-tile__icon" aria-hidden="true"><Icon name="card-checklist" /></span>
                <span><span className="hz-tile__title">Procesos electorales</span><span className="hz-tile__desc">Convocatorias y mesas</span></span>
                <span className="hz-tile__arrow" aria-hidden="true">↗</span>
              </a>
              <a className="hz-tile hz-tile--tint" href="#superficies" style={{ gridColumn: "span 2" }}>
                <span className="hz-tile__icon" aria-hidden="true"><Icon name="stars" /></span>
                <span><span className="hz-tile__title">Consultas con IA</span><span className="hz-tile__desc">Sobre identidad y procesos</span></span>
                <span className="hz-tile__arrow" aria-hidden="true">↗</span>
              </a>
              <div className="hz-tile hz-tile--soon" aria-disabled="true" style={{ gridColumn: "span 3", minHeight: "140px" }}>
                <span className="hz-tile__icon" aria-hidden="true"><Icon name="person-gear" /></span>
                <span><span className="hz-tile__title">Gestionar usuarios</span><span className="hz-tile__desc">Cuentas y roles</span></span>
                <span className="hz-tile__tag hz-tag">Próximamente</span>
              </div>
              <div className="hz-tile hz-tile--soon" aria-disabled="true" style={{ gridColumn: "span 3", minHeight: "140px" }}>
                <span className="hz-tile__icon" aria-hidden="true"><Icon name="clipboard-data" /></span>
                <span>
                  <span className="hz-tile__title">Reportes y auditoría</span>
                  <span className="hz-tile__desc">Trazabilidad y exportación</span>
                </span>
                <span className="hz-tile__tag hz-tag">Próximamente</span>
              </div>
            </div>
          </div>
          <p className="ds-note">
            Reglas: radio 16 px;{" "}
            <b>grandes</b>
            {" "}(2 por fila) para lo más usado,{" "}
            <b>medianos</b>
            {" "}(3) en azul tenue,{" "}
            <b>pendientes</b>
            {" "}atenuados con borde discontinuo y sin enlace. Hover (solo con puntero fino): sube 4 px y la flecha avanza. Foco: anillo navy de 3 px (visible también sobre el tile azul).
          </p>
          <h3 className="ds-sub">Franja de indicadores</h3>
          <div className="hz-kpis">
            <div className="hz-kpi">
              <span className="hz-kpi__label mono">Personas registradas</span>
              <span className="hz-kpi__value">8</span>
              <span className="hz-kpi__delta hz-kpi__delta--ok">5 verificadas</span>
              <span className="hz-kpi__note">3 pendientes de verificación</span>
            </div>
            <ActivityKpi />
            <div className="hz-kpi">
              <span className="hz-kpi__label mono">Procesos electorales</span>
              <span className="hz-kpi__value">0</span>
              <span className="hz-kpi__delta">0 en total</span>
              <span className="hz-kpi__note">Abiertos o en borrador</span>
            </div>
            <div className="hz-kpi">
              <span className="hz-kpi__label mono">Dispositivos</span>
              <span className="hz-kpi__value">2</span>
              <span className="hz-kpi__delta hz-kpi__delta--warn">1 desconectado</span>
              <span className="hz-kpi__note">de 3 dispositivos</span>
            </div>
          </div>
          <p className="ds-note">
            Cuatro máximo por franja.{" "}
            <b>Cada cifra es un conteo trazable:</b>
            {" "}la franja, las barras y la lista del panel de abajo salen del mismo conjunto de 6 eventos, y la suma de las partes siempre es el total; el texto del detalle concuerda en número ("1 desconectado", "3 desconectados") y nunca expone claves técnicas de almacenamiento.
          </p>
          <h3 className="ds-sub">Panel de actividad{" "}<small>el único panel oscuro de contenido</small></h3>
          <div className="ds-grid ds-grid--2">
            <ActivityPanelDemo />
            <div>
              <p className="ds-note" style={{ marginTop: "0" }}>
                <b>Cuándo usar el panel.</b>
                {" "}Cuando un bloque cambia de naturaleza (de "acciones" a "registro de lo ocurrido"), el fondo cambia con él. Máximo un panel oscuro{" "}
                <b>de contenido</b>
                {" "}por pantalla; el resto, claro. Los toasts, los tooltips y el fondo de los diálogos son superficies flotantes y no cuentan.
              </p>
              <p className="ds-note">
                <b>Gráficos.</b>
                {" "}Barras horizontales de 8 px sobre pista translúcida, con la etiqueta y el conteo en texto (la barra es decorativa,{" "}
                <code>aria-hidden</code>
                ). Animación de entrada con{" "}
                <code>scaleX</code>
                {" "}≤ 450 ms. Colores canónicos de estado sobre navy: verde #6EE7B7 (éxito), rojo suave #FCA5A5 (rechazo) y ámbar #FFC15A (reintento), todos ≥ 9:1; el cian no se usa para estados.
              </p>
              <p className="ds-note">
                <b>Línea de tiempo.</b>
                {" "}Riel de 1 px, un punto de 9 px por evento con su color de estado y un halo del color de fondo. Muestra los 3 eventos más recientes de 6 ("Últimos 3 de 6").
              </p>
            </div>
          </div>
          <h3 className="ds-sub">Filas de línea, media y personas</h3>
          <div className="ds-grid ds-grid--3">
            <div>
              <div className="hz-line">
                <span className="n mono">01</span>
                <div><h3>Identidad</h3><p>Personas con identificadores propios de Averyn y afiliaciones por institución.</p></div>
              </div>
              <div className="hz-line" style={{ borderBottom: "1px solid var(--av-hairline)" }}>
                <span className="n mono">02</span>
                <div><h3>Biometría</h3><p>Enrolamiento y verificación por huella y rostro.</p></div>
              </div>
            </div>
            <div>
              <div className="hz-media" style={{ ["--ratio" as string]: "4/5", maxWidth: "200px" }}>
                <span className="hz-media__hint mono">Imagen · 4:5</span>
              </div>
              <p className="ds-note">
                Espacio reservado: al insertar un{" "}
                <code>{"<img>"}</code>
                {" "}o{" "}
                <code>{"<video>"}</code>
                {" "}rellena el marco con{" "}
                <code>object-fit: cover</code>
                {" "}y la etiqueta se oculta. Proporciones: 4:5, 16:9, 21:9.
              </p>
            </div>
            <div>
              <a className="hz-person" href="#superficies">
                <span className="hz-person__ini" aria-hidden="true">DD</span>
                <strong>Daniel David Turizo Chacon</strong>
                <small>Core, Arquitectura e Integraciones críticas</small>
                <span className="mono" style={{ color: "var(--av-blue)", textTransform: "none" }}>@ddturizo-eng ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="navegacion" aria-labelledby="h-nav" data-nav="Navegación" data-grp="Navegación">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Navegación</span>
          <h2 id="h-nav">Navegación</h2>
          <p className="ds-lead">
            Todo el sistema comparte una forma: la píldora. En la landing, una píldora centrada con enlaces mono; en el panel, una píldora completa con icono y etiqueta; en ambos, chips redondeados para logo y acciones.
          </p>
          <h3 className="ds-sub">Navbar pública</h3>
          <div className="stage stage--sky">
            <div className="hz-nav">
              <span className="hz-brandchip"><img src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" /></span>
              <nav className="hz-pill mono" aria-label="Ejemplo de navegación pública">
                <a href="#navegacion">Qué es</a>
                <a href="#navegacion">Capacidades</a>
                <a href="#navegacion">Soluciones</a>
                <a href="#navegacion">Seguridad</a>
                <a href="#navegacion">Equipo</a>
              </nav>
              <a className="hz-btn hz-btn--primary" href="#navegacion">Ingresar</a>
            </div>
          </div>
          <p className="ds-note">
            Logo a la izquierda (aparece cuando el del hero ya se redujo), píldora centrada translúcida con enlaces mono y un único botón "Ingresar". Bajo 1100 px pasa a botón{" "}
            <b>MENÚ</b>
            {" "}con{" "}
            <code>aria-expanded</code>
            ; el menú es el siguiente elemento en el DOM y Escape devuelve el foco al botón.
          </p>
          <h3 className="ds-sub">Dock del panel</h3>
          <div className="stage stage--sky">
            <div className="hz-nav">
              <span className="hz-brandchip"><img src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" /></span>
              <nav className="hz-dock" aria-label="Ejemplo de dock">
                <ul style={{ display: "contents", listStyle: "none", margin: "0", padding: "0" }}>
                  <li style={{ display: "contents" }}><a href="#navegacion" aria-current="page"><Icon name="grid-1x2" />Dashboard</a></li>
                  <li style={{ display: "contents" }}><a href="#navegacion"><Icon name="person-vcard" />Identidad</a></li>
                  <li style={{ display: "contents" }}><a href="#navegacion"><Icon name="fingerprint" />Biometría</a></li>
                  <li style={{ display: "contents" }}><a href="#navegacion"><Icon name="camera" />OCR</a></li>
                  <li style={{ display: "contents" }}><a href="#navegacion"><Icon name="check2-square" />Electoral</a></li>
                  <li style={{ display: "contents" }}>
                    <span className="soon" aria-disabled="true" title="Próximamente"><Icon name="door-open" />Accesos</span>
                  </li>
                </ul>
              </nav>
              <AvatarMenuDemo />
            </div>
            {null}
          </div>
          <p className="ds-note">
            Forma de píldora completa (9999 px), icono + etiqueta en Space Grotesk 600, ítem activo en píldora azul de señal. Bajo 1280 px solo el activo conserva la etiqueta (los demás quedan en icono con{" "}
            <code>title</code>
            {" "}y nombre accesible). Los módulos sin pantalla se atenúan y no enlazan. Haz clic en el usuario para ver el menú.
          </p>
          <h3 className="ds-sub">Encabezado de página, pestañas y paginación</h3>
          <div className="stage">
            <p className="hz-crumb mono"><a href="#navegacion">Dashboard</a>{" "}/{" "}<b>Identidad</b></p>
            <div className="row" style={{ justifyContent: "space-between", margin: ".6rem 0 1.4rem" }}>
              <h3 style={{ fontSize: "2.4rem", lineHeight: "1.05" }}>Personas verificadas</h3>
              <button className="hz-btn hz-btn--primary" type="button">+ Nueva persona</button>
            </div>
            <TabsPagerDemo />
            {null}
            {null}
            {null}
            {null}
          </div>
          <p className="ds-note">
            Pestañas con teclado: ← → cambian de pestaña (patrón{" "}
            <i>roving tabindex</i>
            ). Paginación con objetivos de 44 px y el número actual en azul de señal.
          </p>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="menu-acciones" aria-labelledby="h-menu" data-nav="Menú de acciones" data-grp="Navegación">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Navegación</span>
          <h2 id="h-menu">Menú de acciones (⋯)</h2>
          <p className="ds-lead">
            Agrupa las acciones secundarias de una fila o tarjeta. La acción principal nunca vive aquí: si es la más usada, va visible. Lo destructivo va al final, separado y en rojo con su texto.
          </p>
          <div className="cp-grid">
            <div className="cp-demo" style={{ minHeight: "300px" }}>
              <div className="am-row"><div><b>Ana Lucía Pérez</b><small>Registrada hace 3 días</small></div><ActionMenuDemo /></div>
            </div>
            <div className="cp-side">
              <div>
                <h3>Teclado</h3>
                <ul>
                  <li><kbd>Enter</kbd>,{" "}<kbd>Espacio</kbd>{" "}o{" "}<kbd>↓</kbd>{" "}abre y enfoca el primer ítem.</li>
                  <li><kbd>↑</kbd>{" "}<kbd>↓</kbd>{" "}recorren (con vuelta),{" "}<kbd>Inicio</kbd>/<kbd>Fin</kbd>{" "}saltan.</li>
                  <li><kbd>Esc</kbd>{" "}cierra y devuelve el foco al botón;{" "}<kbd>Tab</kbd>{" "}cierra y sigue.</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Botón de 44 px con{" "}<code>aria-label</code>{" "}que nombra la fila ("Acciones de Ana Lucía Pérez").</li>
                  <li>Máximo 6 ítems; con más, la acción merece una pantalla.</li>
                  <li>"Eliminar…" con puntos suspensivos: abre una confirmación, no borra directo.</li>
                  <li>Cada ítem con icono{" "}<b>y</b>{" "}texto.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="comandos" aria-labelledby="h-cmd" data-nav="Paleta de comandos" data-grp="Navegación">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Navegación</span>
          <h2 id="h-cmd">Paleta de comandos{" "}<kbd className="cp-k">Ctrl</kbd>{" "}<kbd className="cp-k">K</kbd></h2>
          <p className="ds-lead">
            Un acceso rápido a cualquier pantalla o acción escribiendo. Complementa la navegación, no la reemplaza. Lo que aún no existe aparece como "Próximamente" y no se puede abrir, igual que en el dock.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><CommandDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>
                    Atajo global{" "}
                    <kbd>Ctrl</kbd>
                    /
                    <kbd>⌘</kbd>
                    {" "}+{" "}
                    <kbd>K</kbd>
                    ; siempre hay también un botón visible para quien no usa atajos.
                  </li>
                  <li>Grupos: "Ir a" y "Acciones". Máximo 8 resultados por grupo.</li>
                  <li>Los ítems sin pantalla llevan la etiqueta "Próximamente" y{" "}<code>aria-disabled</code>.</li>
                  <li>Sin resultados: "Nada coincide con «x»".</li>
                  <li>Las acciones destructivas no van aquí.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="feedback" aria-labelledby="h-feedback" data-nav="Alertas, toast, modal y tooltip" data-grp="Feedback y capas">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Feedback y capas</span>
          <h2 id="h-feedback">Alertas y feedback</h2>
          <p className="ds-lead">
            El feedback es sobrio y específico: dice qué pasó y qué hacer. Las alertas persisten hasta que se resuelven; los toasts confirman acciones y desaparecen.
          </p>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="hz-alert hz-alert--error" role="alert">
              <strong>Credenciales inválidas</strong>
              Verifica tu correo y contraseña e inténtalo nuevamente.
            </div>
            <div className="hz-alert hz-alert--success" role="status"><strong>Autenticación exitosa</strong>Redirigiendo al panel de control…</div>
            <div className="hz-alert hz-alert--warning" role="status">
              <strong>Dispositivo desconectado</strong>
              El lector LEC-002 no responde. Revisa la conexión.
            </div>
            <div className="hz-alert hz-alert--info" role="status">
              <strong>Recuperación no disponible</strong>
              Por ahora, pide a tu administrador que restablezca tu acceso.
            </div>
          </div>
          <p className="ds-note">
            Insignia circular con icono (del color -text del estado), fondo claro y borde de 1 px:{" "}
            <b>sin franja lateral</b>
            . Texto ≥ 5:1. Errores con{" "}
            <code>role="alert"</code>
            ; el resto con{" "}
            <code>role="status"</code>
            . La alerta ocupa un espacio reservado: no empuja el formulario.
          </p>
          <div className="ds-grid ds-grid--3 ds-gap-top">
            <div className="stage">
              <span className="stage__label mono">Toast</span>
              <ToastButtons />
              <div className="hz-toast" role="presentation" style={{ marginTop: "1rem", animation: "none" }}>
                <div><b>Persona registrada</b><span>El registro se guardó correctamente.</span></div>
              </div>
              <p className="ds-note">Los botones disparan el toast real (abajo a la derecha). El bloque navy muestra su aspecto.</p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Modal</span>
              <ModalDemo />
              <p className="ds-note">
                Elemento{" "}
                <code>{"<dialog>"}</code>
                {" "}nativo: atrapa el foco, cierra con Escape y devuelve el foco al botón.
              </p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Tooltip</span>
              <span className="hz-tip">
                <button className="hz-iconbtn" type="button" aria-describedby="tip1" aria-label="¿Qué significa Verificada?">
                  <Icon name="question-circle" />
                </button>
                <span className="hz-tip__bubble" role="tooltip" id="tip1">Verificada: la identidad superó el umbral</span>
              </span>
              <p className="ds-note">
                Aparece con hover y con foco. Usa un icono de ayuda, nunca el de un estado. Solo complementa: nunca es el único portador de información.
              </p>
            </div>
          </div>
          {null}
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Componente</th><th>Cuándo</th><th>Duración</th><th>Rol ARIA</th></tr></thead>
              <tbody>
                <tr>
                  <td>Alerta</td>
                  <td>Errores y avisos que requieren acción.</td>
                  <td>Hasta resolverse</td>
                  <td><code>alert</code>{" "}/{" "}<code>status</code></td>
                </tr>
                <tr>
                  <td>Toast</td>
                  <td>Confirmar una acción ya hecha.</td>
                  <td>5 s; pausa con el cursor encima</td>
                  <td><code>status</code>{" "}en región{" "}<code>aria-live="polite"</code></td>
                </tr>
                <tr>
                  <td>Modal</td>
                  <td>Confirmaciones destructivas o decisiones que bloquean.</td>
                  <td>Hasta decidir</td>
                  <td><code>dialog</code>{" "}+{" "}<code>aria-labelledby</code></td>
                </tr>
                <tr>
                  <td>Tooltip</td>
                  <td>Nombrar un icono o aclarar un dato.</td>
                  <td>Mientras hay hover/foco</td>
                  <td><code>tooltip</code>{" "}+{" "}<code>aria-describedby</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="estados-carga" aria-labelledby="h-estados-carga" data-nav="Estados de carga" data-grp="Feedback y capas">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Feedback y capas</span>
          <h2 id="h-estados-carga">Estados de carga</h2>
          <p className="ds-lead">
            Tres formas de decir "estoy trabajando", según lo que se espere: una{" "}
            <b>silueta</b>
            {" "}(skeleton) cuando se carga contenido, un{" "}
            <b>spinner dentro del botón</b>
            {" "}cuando se envía una acción y una{" "}
            <b>barra</b>
            {" "}cuando se conoce el avance. Todas respetan el movimiento reducido y no cambian el tamaño de la pantalla al terminar.
          </p>
          <div className="cp-grid">
            <LoadingDemo />
            <div className="cp-side">
              <div>
                <h3>Cuál usar</h3>
                <ul>
                  <li><b>Silueta:</b>{" "}listas, tablas y tarjetas que van a aparecer. Misma altura y columnas que el contenido real.</li>
                  <li>
                    <b>Spinner en el botón:</b>
                    {" "}acciones de envío. El botón queda desactivado, cambia su texto ("Guardando…") y conserva su ancho.
                  </li>
                  <li><b>Barra determinada:</b>{" "}cargas y lecturas con avance real.{" "}<b>Indeterminada</b>{" "}solo si no se puede saber.</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>No mostrar nada si tarda menos de ~300 ms: un parpadeo es peor que esperar.</li>
                  <li>
                    El contenedor marca{" "}
                    <code>aria-busy="true"</code>
                    {" "}mientras carga y un mensaje{" "}
                    <code>role="status"</code>
                    {" "}dice "Lista cargada" al terminar.
                  </li>
                  <li>El brillo de la silueta es lento y suave; con{" "}<code>prefers-reduced-motion</code>{" "}queda fija.</li>
                  <li>Si pasa de ~10 s, decirlo con texto y ofrecer cancelar.</li>
                  <li>Si falla, la silueta se reemplaza por el estado de error con "Reintentar", nunca se queda cargando para siempre.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="popover" aria-labelledby="h-po" data-nav="Popover" data-grp="Feedback y capas">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Feedback y capas</span>
          <h2 id="h-po">Popover</h2>
          <p className="ds-lead">
            Panel pequeño y no modal anclado a un botón. Para una explicación que merece más que un tooltip (título, párrafo y un enlace) sin sacar a la persona de lo que hace.
          </p>
          <div className="cp-grid">
            <div className="cp-demo" style={{ minHeight: "260px" }}><PopoverDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Popover, tooltip o modal</h3>
                <div className="doc-wrap" style={{ margin: "0" }}>
                  <table className="doc-table">
                    <thead><tr><th /><th>Contiene</th><th>Se abre</th></tr></thead>
                    <tbody>
                      <tr><td>Tooltip</td><td>Una frase, sin acciones</td><td>Foco o cursor</td></tr>
                      <tr><td>Popover</td><td>Texto con título y acción</td><td>Clic o Enter</td></tr>
                      <tr><td>Modal</td><td>Decisión que bloquea</td><td>Acción explícita</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li><kbd>Esc</kbd>{" "}o clic fuera cierra y devuelve el foco al botón.</li>
                  <li>No atrapa el foco (no es modal) pero{" "}<kbd>Tab</kbd>{" "}sale del botón hacia el contenido.</li>
                  <li>Ancho máximo de 20 rem; nunca más de 2 acciones.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="drawer" aria-labelledby="h-dr" data-nav="Drawer lateral" data-grp="Feedback y capas">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Feedback y capas</span>
          <h2 id="h-dr">Drawer lateral</h2>
          <p className="ds-lead">
            Para ver o editar el detalle de algo sin perder la lista de fondo. Entra desde la derecha, atrapa el foco (es un{" "}
            <code>{"<dialog>"}</code>
            {" "}modal) y se cierra con{" "}
            <kbd className="cp-k">Esc</kbd>
            , la X o un clic en la sombra.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><DrawerDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Ancho de 26 rem (100% en móvil); cabecera, cuerpo con scroll y pie con las acciones.</li>
                  <li>
                    Foco inicial en el botón de cerrar o en el primer campo; al cerrar vuelve al botón que lo abrió (lo hace{" "}
                    <code>{"<dialog>"}</code>
                    ).
                  </li>
                  <li>Un drawer no abre otro drawer. Si hace falta, el contenido es una página.</li>
                  <li>Entrada de 280 ms, desde la derecha; sin movimiento con{" "}<code>prefers-reduced-motion</code>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="acordeon" aria-labelledby="h-ac" data-nav="Acordeón" data-grp="Contenido">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Contenido</span>
          <h2 id="h-ac">Acordeón</h2>
          <p className="ds-lead">
            Para contenido de lectura opcional (preguntas frecuentes, ayuda, detalles). Líneas de 1 px y títulos en Space Grotesk, sin cajas ni sombras.
          </p>
          <div className="cp-grid">
            <div className="cp-demo"><AccordionDemo /></div>
            <div className="cp-side">
              <div>
                <h3>Teclado</h3>
                <ul>
                  <li><kbd>Enter</kbd>{" "}/{" "}<kbd>Espacio</kbd>{" "}abre o cierra.</li>
                  <li>
                    <kbd>↑</kbd>
                    {" "}
                    <kbd>↓</kbd>
                    {" "}pasan entre títulos,{" "}
                    <kbd>Inicio</kbd>
                    /
                    <kbd>Fin</kbd>
                    {" "}saltan al primero y al último.
                  </li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Botón dentro de un encabezado (<code>h3</code>) con{" "}<code>aria-expanded</code>{" "}y{" "}<code>aria-controls</code>.</li>
                  <li>El panel es una{" "}<code>region</code>{" "}con su título como nombre.</li>
                  <li>Por defecto abre uno a la vez; "varios" solo si se comparan respuestas.</li>
                  <li>Nunca esconder en un acordeón lo que la persona necesita para completar la tarea.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="resumen-teclado" aria-labelledby="h-rt" data-nav="Resumen de teclado" data-grp="Referencia">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Componentes · Referencia</span>
          <h2 id="h-rt">Resumen de teclado y banner</h2>
          <p className="ds-lead">
            El{" "}
            <b>banner de sistema</b>
            {" "}ya está documentado en{" "}
            <a href="/plantillas#otros-estados">Plantillas y estados</a>
            : no se repite aquí. Esta tabla junta los patrones de teclado de todos los componentes interactivos.
          </p>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Componente</th><th>Rol ARIA</th><th>Abrir / activar</th><th>Moverse</th><th>Cerrar</th></tr></thead>
              <tbody>
                <tr>
                  <td>Selector de fechas</td>
                  <td><code>dialog</code>{" "}+{" "}<code>grid</code></td>
                  <td>Enter, Espacio</td>
                  <td>Flechas, RePág/AvPág, Inicio/Fin</td>
                  <td>Esc</td>
                </tr>
                <tr>
                  <td>Menú de acciones</td>
                  <td><code>menu</code>/<code>menuitem</code></td>
                  <td>Enter, Espacio, ↓</td>
                  <td>↑ ↓, Inicio/Fin</td>
                  <td>Esc, Tab</td>
                </tr>
                <tr>
                  <td>Combobox</td>
                  <td><code>combobox</code>/<code>listbox</code></td>
                  <td>Escribir, ↓</td>
                  <td>↑ ↓ (foco en el campo)</td>
                  <td>Esc (2.ª vez limpia)</td>
                </tr>
                <tr>
                  <td>Campo de búsqueda</td>
                  <td><code>search</code>{" "}+{" "}<code>status</code></td>
                  <td><kbd>/</kbd>{" "}enfoca</td>
                  <td>—</td>
                  <td>Esc limpia</td>
                </tr>
                <tr>
                  <td>Código de un solo uso</td>
                  <td><code>group</code>{" "}+ 6 campos</td>
                  <td>Escribir o pegar</td>
                  <td>← →, Inicio/Fin</td>
                  <td>—</td>
                </tr>
                <tr><td>Contraseña con fuerza</td><td><code>status</code>{" "}(polite)</td><td>Botón Mostrar</td><td>Tab</td><td>—</td></tr>
                <tr>
                  <td>Multi-select</td>
                  <td><code>combobox</code>{" "}multiselectable</td>
                  <td>Escribir, ↓</td>
                  <td>↑ ↓, Espacio marca</td>
                  <td>Esc; Retroceso quita chip</td>
                </tr>
                <tr>
                  <td>Resumen de errores</td>
                  <td><code>alert</code>{" "}con foco</td>
                  <td>Enviar el formulario</td>
                  <td>Tab a los enlaces</td>
                  <td>—</td>
                </tr>
                <tr><td>Acordeón</td><td>botón +{" "}<code>region</code></td><td>Enter, Espacio</td><td>↑ ↓, Inicio/Fin</td><td>—</td></tr>
                <tr><td>Stepper</td><td>lista +{" "}<code>status</code></td><td>Botones Atrás/Siguiente</td><td>Tab</td><td>—</td></tr>
                <tr><td>Popover</td><td><code>dialog</code>{" "}no modal</td><td>Enter, Espacio</td><td>Tab</td><td>Esc, clic fuera</td></tr>
                <tr><td>Drawer</td><td><code>dialog</code>{" "}modal</td><td>Botón</td><td>Tab atrapado</td><td>Esc, X, sombra</td></tr>
                <tr><td>Paleta de comandos</td><td><code>combobox</code>/<code>listbox</code></td><td>Ctrl/⌘ K</td><td>↑ ↓</td><td>Esc</td></tr>
                <tr>
                  <td>Tabla avanzada</td>
                  <td><code>table</code>{" "}+{" "}<code>aria-sort</code></td>
                  <td>Enter en cabecera</td>
                  <td>Tab, Espacio en casillas</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
