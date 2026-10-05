/* Generado desde docs/ds/src por scripts/html-to-tsx.mjs (migración a React, v2.0).
   A partir de aquí este archivo es la fuente: se edita a mano. */
/* eslint-disable react/no-unescaped-entities */
import { ColorSwatches, ContrastTable, IconGrid, RadiiGrid, SpaceScale } from "@/components/docs/foundation-demos";
import { TokenSwatches, TokensExport } from "@/components/docs/tokens-export";
import { Icon } from "@/components/ui/icon";

export default function FundamentosContent() {
  return (
    <>
      <section className="ds-sec" id="principios" aria-labelledby="h-principios" data-nav="Principios" data-grp="Identidad">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Fundamentos · Identidad</span>
          <h2 id="h-principios">Principios del sistema</h2>
          <p className="ds-lead">
            <b>North Star: "El horizonte que se oscurece".</b>
            {" "}Averyn abre con un cielo claro y, a medida que se avanza, el fondo cae hacia un navy profundo: la claridad de la plataforma se convierte en seguridad. Sobre ese horizonte, un trazo fino de arcos —eco del arco de la A del logo— hace de firma. Sereno e institucional, con la precisión de un instrumento.
          </p>
          <div className="ds-gap-top">
            <div className="hz-line">
              <span className="n mono">R1</span>
              <div>
                <h3>La regla de la señal única</h3>
                <p>
                  El azul de señal #145FEE es el único color que invita a actuar: botones, enlaces y un cierre a pantalla completa. El cian es trazo o resalte; nunca superficie.
                </p>
              </div>
            </div>
            <div className="hz-line">
              <span className="n mono">R2</span>
              <div>
                <h3>La regla del horizonte</h3>
                <p>
                  El oscurecimiento va de arriba (claro) hacia abajo (navy), nunca al revés. El logo negro vive en la zona clara; el blanco, sobre navy.
                </p>
              </div>
            </div>
            <div className="hz-line">
              <span className="n mono">R3</span>
              <div>
                <h3>La regla de la acción en mono</h3>
                <p>
                  Lo que se pulsa o rotula (botones, navegación, etiquetas) va en JetBrains Mono mayúsculas. Lo que se lee va en Inter o Space Grotesk.
                </p>
              </div>
            </div>
            <div className="hz-line">
              <span className="n mono">R4</span>
              <div>
                <h3>Plano por defecto</h3>
                <p>
                  Una superficie en reposo no tiene sombra. Solo la llevan los botones sólidos, el marco del login y los popovers. La profundidad se logra con tono y líneas de 1 px.
                </p>
              </div>
            </div>
            <div className="hz-line">
              <span className="n mono">R5</span>
              <div>
                <h3>Asimetría con intención</h3>
                <p>
                  Titular y contenido en columnas desiguales, listas escalonadas, paneles fijos. Nunca tres tarjetas iguales centradas como solución por defecto.
                </p>
              </div>
            </div>
            <div className="hz-line">
              <span className="n mono">R6</span>
              <div>
                <h3>Honestidad del estado</h3>
                <p>
                  Lo que no existe se muestra como "Próximamente", atenuado y sin enlace; nunca como un vínculo que lleva a un 404. Lo que no se sabe no se promete ("Conexión segura" solo si lo es).
                </p>
              </div>
            </div>
            <div className="hz-line">
              <span className="n mono">R7</span>
              <div>
                <h3>Nunca ampliar el wordmark</h3>
                <p>El logo mide 1144 px de ancho nativo: se maqueta grande y solo se reduce. Ampliarlo lo vuelve borroso.</p>
              </div>
            </div>
            <div className="hz-line" style={{ borderBottom: "1px solid var(--av-hairline)" }}>
              <span className="n mono">R8</span>
              <div>
                <h3>El color nunca es el único canal</h3>
                <p>Todo dato con color lleva también texto, forma o posición. Los estados se leen sin ver el color.</p>
              </div>
            </div>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Se hizo y se mantiene</strong>
              <ul>
                <li>Hero guiado por scroll: la A, la palabra y la figura de arcos.</li>
                <li>Espacios reservados para imagen y video en lugar de relleno.</li>
                <li>Un solo panel navy por pantalla para marcar un cambio de información.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>Se probó y se descartó</strong>
              <ul>
                <li>Estilo brutalista (mayúsculas gigantes, sombras duras en todo): perdía identidad.</li>
                <li>Tarjetas con sombra y círculos de seis colores en el dashboard.</li>
                <li>Franjas laterales gruesas, glows de color y retículas decorativas.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="marca" aria-labelledby="h-marca" data-nav="Marca y figura" data-grp="Identidad">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Fundamentos · Identidad</span>
          <h2 id="h-marca">Marca y figura de arcos</h2>
          <p className="ds-lead">
            El wordmark "Averyn" parte de una A cuyo arco es la firma de la marca. Hay tres piezas: wordmark, isotipo (la A sola) y lockup (isotipo sobre wordmark).
          </p>
          <h3 className="ds-sub">Logotipo{" "}<small>wordmark · 1144 × 371</small></h3>
          <div className="ds-grid ds-grid--4">
            <div className="logo-cell"><img src="/assets/images/averyn-logo-font-black.avif" alt="Wordmark negro" /></div>
            <div className="logo-cell logo-cell--dark"><img src="/assets/images/averyn-logo-font-white.avif" alt="Wordmark blanco" /></div>
            <div className="logo-cell"><img src="/assets/images/averyn-logo-font-blue.avif" alt="Wordmark azul" /></div>
            <div className="logo-cell logo-cell--dark"><img src="/assets/images/averyn-logo-font-cyan.avif" alt="Wordmark cian" /></div>
          </div>
          <h3 className="ds-sub">Isotipo y lockup{" "}<small>786 × 661 · 1144 × 657</small></h3>
          <div className="ds-grid ds-grid--4">
            <div className="logo-cell logo-cell--sky"><img src="/assets/images/averyn-logo-black.avif" alt="Isotipo negro" /></div>
            <div className="logo-cell logo-cell--dark"><img src="/assets/images/averyn-logo-white.avif" alt="Isotipo blanco" /></div>
            <div className="logo-cell"><img src="/assets/images/averyn-logo-lockup-black.avif" alt="Lockup negro" /></div>
            <div className="logo-cell logo-cell--blue"><img src="/assets/images/averyn-logo-lockup-white.avif" alt="Lockup blanco" /></div>
          </div>
          <h3 className="ds-sub">Qué logo sobre qué fondo</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Superficie</th><th>Logo</th><th>Motivo</th></tr></thead>
              <tbody>
                <tr>
                  <td>Blanco, papel azul, cielo (#DCECFF)</td>
                  <td>Negro (o azul en formularios)</td>
                  <td>Contraste 17:1 o más; es la zona clara del horizonte.</td>
                </tr>
                <tr><td>Navy, navy nocturno, footer</td><td>Blanco</td><td>Mantiene la regla del horizonte: blanco solo sobre oscuro.</td></tr>
                <tr><td>Azul de señal (CTA final)</td><td>Blanco</td><td>5.38:1. El cian no se usa como logo sobre azul.</td></tr>
                <tr>
                  <td>Tramo medio del degradado (gris pizarra)</td>
                  <td>Ninguno</td>
                  <td>La banda intermedia se atraviesa: el logo se reduce y sube antes de llegar a ella.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Hacer</strong>
              <ul>
                <li>Altura mínima: 22 px el wordmark en barras; 96 px el lockup.</li>
                <li>Zona de respeto igual a la altura de la A a cada lado.</li>
                <li>Maquetar a tamaño nativo y reducir con{" "}<code>transform: scale()</code>.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>No hacer</strong>
              <ul>
                <li>Ampliar por encima de 1144 px (borroso). No usar{" "}<code>will-change</code>{" "}sobre el logo que se escala.</li>
                <li>Deformar, rotar, añadir sombra o contorno, recolorear fuera de las variantes.</li>
                <li>Mostrar dos wordmarks completos a la vez en la misma pantalla.</li>
              </ul>
            </div>
          </div>
          <h3 className="ds-sub">Figura de arcos{" "}<small>firma gráfica</small></h3>
          <p className="ds-note">
            Tres arcos concéntricos (eco del arco de la A), una base y una o dos diagonales paralelas (el trazo largo de la A). Es siempre{" "}
            <b>línea fina</b>
            {" "}con extremos redondeados,{" "}
            <code>vector-effect: non-scaling-stroke</code>
            {" "}y{" "}
            <code>pathLength="1"</code>
            {" "}para poder dibujarla con{" "}
            <code>stroke-dashoffset</code>
            .
          </p>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="stage stage--sky">
              <span className="stage__label mono">Sobre claro</span>
              <svg viewBox="0 0 640 300" width="100%" aria-hidden="true">
                <path d="M0 290 H640" stroke="#CFDCF3" fill="none" />
                <path d="M30 290 C110 60 330 40 450 290" stroke="#145FEE" strokeWidth="1.5" fill="none" />
                <path d="M90 290 C150 110 300 95 390 290" stroke="#00ACD2" strokeWidth="2" fill="none" />
                <path d="M150 290 C190 170 270 160 330 290" stroke="#145FEE" strokeWidth="1" fill="none" />
                <path d="M300 8 L545 290" stroke="#145FEE" strokeWidth="1.5" fill="none" />
                <path d="M326 -32 L605 290" stroke="#00ACD2" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div className="stage stage--night">
              <span className="stage__label mono">Sobre navy</span>
              <svg viewBox="0 0 640 300" width="100%" aria-hidden="true">
                <path d="M0 290 H640" stroke="rgba(255,255,255,.22)" fill="none" />
                <path d="M30 290 C110 60 330 40 450 290" stroke="#fff" strokeWidth="1.5" fill="none" />
                <path d="M90 290 C150 110 300 95 390 290" stroke="#00ACD2" strokeWidth="2" fill="none" />
                <path d="M150 290 C190 170 270 160 330 290" stroke="#55D6FF" strokeWidth="1.5" fill="none" />
                <path d="M300 8 L545 290" stroke="#3D86FF" strokeWidth="2" fill="none" />
                <path d="M326 -32 L605 290" stroke="#3D86FF" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
          <div className="codeblock">
            <pre id="code-arcs">
              {"<svg viewBox=\"0 0 640 300\" aria-hidden=\"true\">\n  <path d=\"M0 290 H640\" stroke=\"rgba(255,255,255,.22)\"/>\n  <path d=\"M30 290 C110 60 330 40 450 290\" stroke=\"#fff\"     stroke-width=\"1.5\" pathLength=\"1\"/>\n  <path d=\"M90 290 C150 110 300 95 390 290\" stroke=\"#00ACD2\" stroke-width=\"2\"   pathLength=\"1\"/>\n  <path d=\"M150 290 C190 170 270 160 330 290\" stroke=\"#55D6FF\" stroke-width=\"1.5\" pathLength=\"1\"/>\n  <path d=\"M300 8 L545 290\"  stroke=\"#3D86FF\" stroke-width=\"2\" pathLength=\"1\"/>\n  <path d=\"M326 -32 L605 290\" stroke=\"#3D86FF\" stroke-width=\"2\" pathLength=\"1\"/>\n</svg>"}
            </pre>
            <button className="copy" type="button" data-copy="#code-arcs">Copiar</button>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="colores" aria-labelledby="h-colores" data-nav="Color" data-grp="Sistema visual">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Fundamentos · Sistema visual</span>
          <h2 id="h-colores">Colores</h2>
          <p className="ds-lead">
            Paleta de marca disciplinada: un azul de señal, tres navys por profundidad, un par de cianes y neutros azulados. Haz clic en cualquier muestra para copiar su valor.
          </p>
          <h3 className="ds-sub">Marca{" "}<small>acción</small></h3>
          <ColorSwatches group="brand" />
          <h3 className="ds-sub">Horizonte{" "}<small>profundidad</small></h3>
          <ColorSwatches group="horizon" />
          <h3 className="ds-sub">Neutros{" "}<small>texto y estructura</small></h3>
          <ColorSwatches group="neutral" />
          <h3 className="ds-sub">Semánticos{" "}<small>estado</small></h3>
          <ColorSwatches group="semantic" />
          <p className="ds-note">
            <b>Base vs. texto.</b>
            {" "}Los colores base (#12B76A, #F79009, #F04438) sirven para puntos, rellenos e iconos; no alcanzan 4.5:1 como texto sobre blanco (2.35–3.76:1). Para texto usa siempre la variante{" "}
            <code>-text</code>
            {" "}(5.0–6.5:1). El cian de información como texto es #0369A1.
          </p>
          <h3 className="ds-sub">El degradado Horizonte</h3>
          <div className="ds-grid ds-grid--3">
            <div>
              <div className="stage" style={{ height: "200px", background: "linear-gradient(180deg,#DCECFF 0%,#EAF0FE 14%,#0A2A66 54%,#000C24 82%)", border: "0" }} />
              <p className="ds-note"><b>Completo.</b>{" "}Hero de la landing: el navy cae a medida que se hace scroll.</p>
            </div>
            <div>
              <div className="stage" style={{ height: "200px", background: "linear-gradient(180deg,#DCECFF 0%,#EAF0FE 12%,#0A2A66 40%,#000C24 68%)", border: "0" }} />
              <p className="ds-note"><b>Compacto.</b>{" "}Panel de marca del login: el navy llega antes.</p>
            </div>
            <div>
              <div className="stage" style={{ height: "200px", background: "linear-gradient(180deg,#DCECFF 0%,#EAF0FE 55%,#fff 100%)" }} />
              <p className="ds-note"><b>Cielo a blanco.</b>{" "}Bienvenida del dashboard: solo la zona clara.</p>
            </div>
          </div>
          <div className="codeblock">
            <pre id="code-grad">
              {"/* Completo (hero) · el navy entra con opacidad guiada por scroll */\nbackground: linear-gradient(180deg, "}
              <b>{"#DCECFF"}</b>
              {" 0%, "}
              <b>{"#EAF0FE"}</b>
              {" 14%, "}
              <b>{"#0A2A66"}</b>
              {" 54%, "}
              <b>{"#000C24"}</b>
              {" 82%);\n/* Compacto (login) */\nbackground: linear-gradient(180deg, #DCECFF 0%, #EAF0FE 12%, #0A2A66 40%, #000C24 68%);\n/* Cielo a blanco (dashboard) */\nbackground: linear-gradient(180deg, #DCECFF 0%, #EAF0FE 55%, #fff 100%);"}
            </pre>
            <button className="copy" type="button" data-copy="#code-grad">Copiar</button>
          </div>
          <p className="ds-note">
            En el tramo medio (≈ #66708A) no se coloca texto ni logo: se atraviesa. Si el texto ancla en la parte baja, el contraste se mide contra el navy, no contra el primer color del degradado.
          </p>
          <h3 className="ds-sub">Pares aprobados{" "}<small>contraste calculado en vivo</small></h3>
          <ContrastTable />
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Hacer</strong>
              <ul>
                <li>Texto sobre azul de señal: blanco (5.38:1) o #F0F5FF (4.92:1).</li>
                <li>#9DB6E6 solo sobre navy (8.49:1) o como decoración.</li>
                <li>Bordes de campo en #6E86B0 (3.68:1); los hairlines son separadores, no bordes de control.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>No hacer</strong>
              <ul>
                <li>Texto #DCE8FF sobre azul de señal (4.37:1: falla).</li>
                <li>Texto con gray-300 (2.09:1) o gray-400 (3.52:1) salvo grande y decorativo.</li>
                <li>Cian como fondo grande o como color de botón principal.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="tipografia" aria-labelledby="h-tipografia" data-nav="Tipografía" data-grp="Sistema visual">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Fundamentos · Sistema visual</span>
          <h2 id="h-tipografia">Tipografía</h2>
          <p className="ds-lead">
            Una grotesca geométrica con carácter para titulares, un cuerpo neutro y legible, y un mono técnico que da tono de instrumento a todo lo accionable.
          </p>
          <div className="ds-grid ds-grid--3 ds-gap-top">
            <div className="stage">
              <span className="stage__label mono">Display · Headline</span>
              <div style={{ font: "500 3.6rem/1 var(--av-font-heading)", letterSpacing: "-.03em" }}>Aa</div>
              <p className="ds-note"><b>Space Grotesk</b>{" "}500 / 600 / 700. Titulares y cifras.</p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Cuerpo</span>
              <div style={{ font: "400 3.6rem/1 var(--av-font-body)", letterSpacing: "-.02em" }}>Aa</div>
              <p className="ds-note"><b>Inter</b>{" "}400 / 500 / 600 / 700. Párrafos, campos y tablas.</p>
            </div>
            <div className="stage">
              <span className="stage__label mono">Acción · Etiqueta</span>
              <div style={{ font: "500 3.6rem/1 var(--av-font-mono)" }}>Aa</div>
              <p className="ds-note"><b>JetBrains Mono</b>{" "}500 / 700. Botones, navegación, rótulos y datos técnicos.</p>
            </div>
          </div>
          <h3 className="ds-sub">Escala</h3>
          <div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Display XL<br />clamp(2.4rem, 6vw, 5rem)</div>
              <div style={{ font: "500 clamp(2.4rem,6vw,4.4rem)/.98 var(--av-font-heading)", letterSpacing: "-.035em" }}>Ingresa. Automatiza.</div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Display<br />clamp(2rem, 4.2vw, 3.6rem)</div>
              <div style={{ font: "500 clamp(2rem,4.2vw,3.6rem)/1.06 var(--av-font-heading)", letterSpacing: "-.025em", textWrap: "balance" }}>
                Una plataforma institucional
              </div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Cifra KPI<br />clamp(3rem, 4.6vw, 4rem)</div>
              <div style={{ font: "500 clamp(3rem,4.6vw,4rem)/1 var(--av-font-heading)", letterSpacing: "-.04em" }}>1.284</div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Headline · 1.5–1.8rem<br />500 · 1.15 · -.02em</div>
              <div style={{ font: "500 1.75rem/1.15 var(--av-font-heading)", letterSpacing: "-.02em" }}>Gestionar personas</div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Title · 1.25rem<br />500 · 1.2</div>
              <div style={{ font: "500 1.25rem/1.2 var(--av-font-heading)", letterSpacing: "-.02em" }}>Procesar documento</div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Lead · 1.05rem<br />400 · 1.6 · máx. 46–62ch</div>
              <div style={{ font: "400 1.05rem/1.6 var(--av-font-body)", color: "var(--av-gray-500)", maxWidth: "56ch" }}>
                Centraliza la identificación, la autenticación y la automatización de procesos institucionales mediante biometría y seguridad.
              </div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Body · 1rem<br />400 · 1.6</div>
              <div style={{ font: "400 1rem/1.6 var(--av-font-body)", maxWidth: "62ch" }}>
                Averyn gestiona su propio modelo de identidad, independiente de las bases de datos institucionales.
              </div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Small · .875rem<br />400/600 · 1.45</div>
              <div style={{ font: "400 .875rem/1.45 var(--av-font-body)", color: "var(--av-gray-500)" }}>
                3 pendientes de verificación · actualizado hace 2 min
              </div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Label · .75rem mono<br />500 · .06em · MAYÚSC.</div>
              <div className="mono" style={{ color: "var(--av-blue)" }}>Procesos electorales activos</div>
            </div>
            <div className="type-spec">
              <div className="type-spec__meta mono">Micro · .6875rem mono<br />500 · .06em</div>
              <div className="mono" style={{ fontSize: ".6875rem", color: "var(--av-gray-500)" }}>Próximamente · CAM-001 · 13/09/2026, 20:42</div>
            </div>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Hacer</strong>
              <ul>
                <li><code>text-wrap: balance</code>{" "}en titulares;{" "}<code>letter-spacing: -.025em</code>{" "}a -.04em según tamaño.</li>
                <li>Mono mayúsculas solo para etiquetas cortas (≤ 4 palabras).</li>
                <li>Cuerpo mínimo 16 px; secundarios 14 px; micro 11–12 px solo en mono y nunca como único portador de información.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>No hacer</strong>
              <ul>
                <li>Párrafos en mayúsculas o en mono.</li>
                <li>Tracking menor a -.06em (pierde la forma de los caracteres).</li>
                <li>Más de tres familias; negritas 700 en titulares (el peso de marca es 500).</li>
              </ul>
            </div>
          </div>
          <p className="ds-note">
            <b>Decisión v1.4.</b>
            {" "}Se mantiene Space Grotesk para titulares, Inter para el cuerpo y JetBrains Mono para lo accionable. No hay una decisión tomada de cambiar a otra familia; si se propone, se discute y se registra aquí.
          </p>
        </div>
      </section>
      <section className="ds-sec" id="espacio" aria-labelledby="h-espacio" data-nav="Espacio, forma y movimiento" data-grp="Sistema visual">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Fundamentos · Sistema visual</span>
          <h2 id="h-espacio">Espacio, forma y movimiento</h2>
          <p className="ds-lead">
            Poco ruido y mucho aire. La estructura la dan las líneas de 1 px, la rejilla de 12 columnas y un ritmo vertical generoso; las formas son contenidas.
          </p>
          <h3 className="ds-sub">Espaciado{" "}<small>base 8 px</small></h3>
          <SpaceScale />
          <h3 className="ds-sub">Rejilla y contenedores</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Elemento</th><th>Valor</th><th>Notas</th></tr></thead>
              <tbody>
                <tr><td>Columnas</td><td><code>repeat(12, minmax(0, 1fr))</code></td><td>Hueco{" "}<code>clamp(1rem, 2.4vw, 2rem)</code>.</td></tr>
                <tr><td>Contenedor</td><td><code>min(100%, 1240px)</code></td><td>Documentación: 1060 px. Texto corrido: 46–62 caracteres.</td></tr>
                <tr><td>Gutter lateral</td><td><code>clamp(1.25rem, 4vw, 3rem)</code></td><td>Mínimo 16 px en móvil.</td></tr>
                <tr>
                  <td>Ritmo de sección</td>
                  <td><code>clamp(5rem, 10vw, 9rem)</code></td>
                  <td>Entre bloques del dashboard:{" "}<code>clamp(4rem, 8vw, 7rem)</code>.</td>
                </tr>
                <tr>
                  <td>Línea estructural</td>
                  <td>1 px{" "}<code>--av-hairline</code>{" "}/{" "}<code>--av-hairline-strong</code></td>
                  <td>Reemplaza a las cajas con sombra.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="ds-grid ds-grid--3 ds-gap-top">
            <div className="stage stage--tint">
              <span className="stage__label mono">5 / 7</span>
              <div className="pat" style={{ gridTemplateColumns: "5fr 7fr" }}><div className="t">Titular</div><div>Contenido</div></div>
            </div>
            <div className="stage stage--tint">
              <span className="stage__label mono">7 / 4 desplazado</span>
              <div className="pat" style={{ gridTemplateColumns: "7fr 1fr 4fr" }}>
                <div className="t">Titular</div>
                <span />
                <div style={{ marginTop: "28px" }}>Texto</div>
              </div>
            </div>
            <div className="stage stage--tint">
              <span className="stage__label mono">Escalonado 4 · 4 · 4</span>
              <div className="pat" style={{ gridTemplateColumns: "repeat(3,1fr)", alignItems: "start" }}>
                <div className="t">1</div>
                <div style={{ marginTop: "20px" }}>2</div>
                <div className="t" style={{ marginTop: "40px" }}>3</div>
              </div>
            </div>
          </div>
          <h3 className="ds-sub">Radios</h3>
          <RadiiGrid />
          <h3 className="ds-sub">Elevación{" "}<small>plano por defecto</small></h3>
          <div className="ds-grid ds-grid--4">
            <div className="stage stage--tint">
              <div className="shd" style={{ border: "1px solid var(--av-hairline-strong)" }}>Plano<br />línea de 1 px</div>
              <p className="ds-note">Tarjetas, secciones, filas. Sin sombra.</p>
            </div>
            <div className="stage stage--tint">
              <div className="shd" style={{ boxShadow: "var(--av-shadow-key)", borderRadius: "8px", background: "var(--av-blue)", color: "#fff" }}>
                Tecla
                <br />
                0 3px 0 .3
              </div>
              <p className="ds-note">Botones sólidos. Baja 2 px al pulsar.</p>
            </div>
            <div className="stage stage--tint">
              <div className="shd" style={{ boxShadow: "var(--av-shadow-md)" }}>Popover<br />0 4px 12px .10</div>
              <p className="ds-note">Menús, tooltips y avisos flotantes.</p>
            </div>
            <div className="stage stage--tint">
              <div className="shd" style={{ boxShadow: "var(--av-shadow-frame)", borderRadius: "24px" }}>Marco<br />0 24px 60px .14</div>
              <p className="ds-note">Una sola pieza flota por pantalla: login, modal.</p>
            </div>
          </div>
          <h3 className="ds-sub">Capas y alturas</h3>
          <div className="ds-grid ds-grid--2">
            <div className="doc-wrap">
              <table className="doc-table">
                <thead><tr><th>Capa</th><th>z-index</th></tr></thead>
                <tbody>
                  <tr><td>Contenido</td><td><code>0</code></td></tr>
                  <tr><td>Sticky de sección</td><td><code>10</code></td></tr>
                  <tr><td>Volver arriba</td><td><code>40</code></td></tr>
                  <tr><td>Header / navbar</td><td><code>50</code></td></tr>
                  <tr><td>Menú desplegable</td><td><code>120</code></td></tr>
                  <tr><td>Skip link</td><td><code>200</code></td></tr>
                  <tr><td>Modal</td><td><code>300</code></td></tr>
                  <tr><td>Toast</td><td><code>400</code></td></tr>
                </tbody>
              </table>
            </div>
            <div className="doc-wrap">
              <table className="doc-table">
                <thead><tr><th>Control</th><th>Altura</th></tr></thead>
                <tbody>
                  <tr><td>Objetivo táctil mínimo</td><td><code>44 px</code></td></tr>
                  <tr><td>Botón</td><td><code>44 px</code></td></tr>
                  <tr><td>Campo, select</td><td><code>48 px</code></td></tr>
                  <tr><td>Ítem del dock</td><td><code>40 px</code>{" "}(la píldora completa mide 48)</td></tr>
                  <tr><td>Icon-button circular</td><td><code>42 px</code></td></tr>
                  <tr><td>Compacto (solo puntero fino)</td><td><code>36 px</code></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <h3 className="ds-sub">Puntos de quiebre</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Ancho</th><th>Qué cambia</th></tr></thead>
              <tbody>
                <tr><td><code>1400</code></td><td>El dashboard oculta nombre y rol del usuario.</td></tr>
                <tr><td><code>1280</code></td><td>El dock muestra solo el icono salvo el activo.</td></tr>
                <tr><td><code>1100</code></td><td>La navegación pública pasa a menú desplegable.</td></tr>
                <tr><td><code>1023 / 900</code></td><td>Dos columnas pasan a una; indicadores 4 → 2.</td></tr>
                <tr><td><code>700 / 560</code></td><td>Mosaico a 2 columnas; indicadores a 1; se ocultan figuras decorativas.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            Breakpoints oficiales (
            <code>averyn-web</code>
            {" "}AGENTS §9):{" "}
            <b>576 · 768 · 1024 · 1280</b>
            . Son los únicos que se usan en el código portado; los valores sueltos de las páginas de este sitio (560, 640, 820, 860, 1000, 1100) son una deuda de la documentación y no se copian.
          </p>
          <h3 className="ds-sub">Movimiento</h3>
          <div className="ds-grid ds-grid--2">
            <div className="doc-wrap">
              <table className="doc-table">
                <thead><tr><th>Token</th><th>Valor</th><th>Uso</th></tr></thead>
                <tbody>
                  <tr>
                    <td><code>--av-ease-out</code></td>
                    <td><code>cubic-bezier(.23, 1, .32, 1)</code></td>
                    <td>Todo: respuesta inmediata, nunca{" "}<code>ease-in</code>.</td>
                  </tr>
                  <tr><td>Estado</td><td><code>150 ms</code></td><td>Color, borde, foco.</td></tr>
                  <tr><td>Transformación</td><td><code>200 ms</code></td><td>Hover lift, flechas, desplazamientos.</td></tr>
                  <tr><td>Entrada de datos</td><td><code>450 ms</code></td><td>Barras, toasts, paneles.</td></tr>
                  <tr><td>Revelado</td><td><code>600 ms</code></td><td>Secciones al entrar en pantalla.</td></tr>
                  <tr><td>Dibujo de trazos</td><td><code>1.4 s</code>{" "}una vez</td><td>Arcos del login.</td></tr>
                </tbody>
              </table>
            </div>
            <div className="dd dd--do">
              <strong>Reglas</strong>
              <ul>
                <li>
                  Anima solo{" "}
                  <code>transform</code>
                  {" "}y{" "}
                  <code>opacity</code>
                  ; nunca{" "}
                  <code>width</code>
                  ,{" "}
                  <code>height</code>
                  {" "}ni{" "}
                  <code>padding</code>
                  {" "}(la barra de progreso usa{" "}
                  <code>scaleX</code>
                  ).
                </li>
                <li>Pulsar:{" "}<code>scale(.97)</code>{" "}inmediato. Hover lift solo con{" "}<code>@media (hover: hover)</code>.</li>
                <li>Nada que se repite 100 veces al día se anima.</li>
                <li><code>prefers-reduced-motion</code>: sin sticky ni dibujo; estado final directo.</li>
                <li>No uses{" "}<code>will-change</code>{" "}en elementos que se amplían: rasteriza borroso.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="iconografia" aria-labelledby="h-iconos" data-nav="Iconografía" data-grp="Sistema visual">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Fundamentos · Sistema visual</span>
          <h2 id="h-iconos">Iconografía</h2>
          <p className="ds-lead">
            Bootstrap Icons 1.11.3 (trazo uniforme). Cada módulo tiene un icono que representa su función, no una decoración. Haz clic en uno para copiar su clase.
          </p>
          <IconGrid />
          <div className="ds-grid ds-grid--3 ds-gap-top">
            <div className="stage">
              <span className="stage__label mono">Sobre claro</span>
              <div className="row">
                <span className="hz-tile__icon" style={{ background: "var(--av-blue-tint)", color: "var(--av-blue)" }}>
                  <Icon name="fingerprint" />
                </span>
                <span className="hz-tile__icon" style={{ background: "#fff", border: "1px solid var(--av-hairline)", color: "var(--av-blue)" }}>
                  <Icon name="person-vcard" />
                </span>
              </div>
              <p className="ds-note">Azul de señal en círculo tinte o blanco.</p>
            </div>
            <div className="stage stage--night">
              <span className="stage__label mono">Sobre navy</span>
              <div className="row">
                <span className="hz-tile__icon" style={{ background: "rgba(85,214,255,.16)", color: "var(--av-cyan-glow)" }}>
                  <Icon name="fingerprint" />
                </span>
              </div>
              <p className="ds-note" style={{ color: "var(--av-night-text)" }}>Cian-glow en círculo translúcido.</p>
            </div>
            <div className="stage stage--blue">
              <span className="stage__label mono">Sobre azul</span>
              <div className="row">
                <span className="hz-tile__icon" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}><Icon name="person-vcard" /></span>
              </div>
              <p className="ds-note" style={{ color: "#F0F5FF" }}>Blanco en círculo translúcido.</p>
            </div>
          </div>
          <p className="ds-note">
            Tamaños: 16 px en línea, 20 px en botones, 24 px en navegación, 28–34 px en círculos de tile (48–60 px). Un solo tono por pantalla: el color del icono lo da la superficie, no el módulo. Los iconos decorativos llevan{" "}
            <code>aria-hidden="true"</code>
            ; los que están solos llevan{" "}
            <code>aria-label</code>
            .
          </p>
        </div>
      </section>
      <section className="ds-sec" id="tokens" aria-labelledby="h-tk" data-nav="Tokens y exportación" data-grp="Tokens">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Fundamentos · Tokens</span>
          <h2 id="h-tk">Tokens exportables (W3C)</h2>
          <p className="ds-lead">
            Los tokens salen de{" "}
            <code>tokens.css</code>
            {" "}—la fuente de verdad— con{" "}
            <code>python tokens_export.py</code>
            , en el formato de Design Tokens del W3C (
            <code>$value</code>
            ,{" "}
            <code>$type</code>
            ). Sirven para Figma (Tokens Studio), Style Dictionary o cualquier herramienta que lo lea. Nunca se editan a mano.
          </p>
          <TokensExport />
          <h3 className="ds-sub">Colores exportados{" "}<small>clic para copiar</small></h3>
          <TokenSwatches />
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Para…</th><th>Cómo</th></tr></thead>
              <tbody>
                <tr>
                  <td>Figma · Tokens Studio</td>
                  <td>
                    Importar{" "}
                    <code>tokens.json</code>
                    {" "}como "Single file"; los grupos{" "}
                    <code>color</code>
                    ,{" "}
                    <code>space</code>
                    ,{" "}
                    <code>radius</code>
                    {" "}y{" "}
                    <code>shadow</code>
                    {" "}se mapean a estilos.
                  </td>
                </tr>
                <tr>
                  <td>Style Dictionary</td>
                  <td>
                    Usar el archivo como fuente; el formato{" "}
                    <code>$value</code>
                    {" "}/{" "}
                    <code>$type</code>
                    {" "}es el del borrador del W3C.
                  </td>
                </tr>
                <tr>
                  <td>Mantener sincronizado</td>
                  <td>Cada cambio en{" "}<code>tokens.css</code>{" "}exige volver a ejecutar el script; el resultado se versiona.</td>
                </tr>
                <tr>
                  <td>Fuera del JSON</td>
                  <td>
                    Los breakpoints (comentario en{" "}
                    <code>tokens.css</code>
                    ) no son variables CSS y no se exportan: 576, 768, 1024 y 1280 px.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {null}
    </>
  );
}
