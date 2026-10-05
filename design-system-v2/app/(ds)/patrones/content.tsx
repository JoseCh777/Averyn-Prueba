/* Generado desde docs/ds/src por scripts/html-to-tsx.mjs (migración a React, v2.0).
   A partir de aquí este archivo es la fuente: se edita a mano. */
/* eslint-disable react/no-unescaped-entities */
import { Ballot, BiometricConsent, DeviceList, DocumentCapture, FaceCapture, FingerprintCapture, HeroSlider, HeroStage, ManualReview, VerificationResult } from "@/components/patterns";
import { Icon } from "@/components/ui/icon";

export default function PatronesContent() {
  return (
    <>
      <section className="ds-sec" id="patrones" aria-labelledby="h-patrones" data-nav="Patrones de página" data-grp="Patrones de página">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Patrones de página</span>
          <h2 id="h-patrones">Patrones de página</h2>
          <p className="ds-lead">
            Cómo se combinan las piezas. El impacto se concentra en momentos concretos (el hero, la figura); el resto respira.
          </p>
          <p className="ds-note">Los patrones y sus demos son{" "}<b>ejemplos de cómo usar el sistema</b>, no una copia fiel del producto final.</p>
          <h3 className="ds-sub">Hero guiado por scroll{" "}<small>demo en vivo</small></h3>
          <HeroStage />
          <HeroSlider />
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Fase</th><th>Rango de scroll</th><th>Qué ocurre</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>--t1</code></td>
                  <td>6 % → 42 %</td>
                  <td>
                    La A sale sola, grande y centrada; "veryn" emerge en horizontal con un recorte{" "}
                    <b>inclinado</b>
                    {" "}(pendiente 0,564 medida sobre el AVIF, para no dejar astillas de la "v").
                  </td>
                </tr>
                <tr>
                  <td><code>--t2</code></td>
                  <td>42 % → 66 %</td>
                  <td>El wordmark completo se reduce y sube; el navy cae desde abajo (opacidad).</td>
                </tr>
                <tr>
                  <td><code>--t3</code></td>
                  <td>62 % → 92 %</td>
                  <td>Se dibuja la figura de arcos (<code>stroke-dashoffset</code>) y aparecen la bajada y los botones.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Aplicado en v1.1</strong>
              <ul>
                <li>Stage acortado de 330 a 220 vh; la bajada aparece hacia el 50 % del recorrido (fases: 4–30 %, 30–50 %, 42–72 %).</li>
                <li><code>{"<h1>"}</code>{" "}real y visible: "Identidad inteligente para procesos institucionales".</li>
                <li>
                  La marca de la cabecera y el bloque de texto llevan{" "}
                  <code>inert</code>
                  {" "}mientras están invisibles: no reciben foco ni los lee un lector de pantalla.
                </li>
                <li>La figura de arcos se ancla sobre el texto (<code>bottom: calc(100% + 1.2rem)</code>): nunca se pisan.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>Reglas fijas</strong>
              <ul>
                <li>Solo{" "}<code>transform</code>,{" "}<code>clip-path</code>{" "}y{" "}<code>opacity</code>.</li>
                <li>Con{" "}<code>prefers-reduced-motion</code>: sin sticky, estado final estático.</li>
                <li>El wordmark se maqueta grande y se reduce: nunca se amplía.</li>
              </ul>
            </div>
          </div>
          <h3 className="ds-sub">Secciones asimétricas</h3>
          <div className="ds-grid ds-grid--2">
            <div className="stage">
              <span className="stage__label mono">Titular + texto desplazado</span>
              <div className="pat" style={{ gridTemplateColumns: "7fr 1fr 4fr" }}>
                <div className="t" style={{ minHeight: "96px", textAlign: "left", placeItems: "center start" }}>Titular (Display) · 7 col</div>
                <span />
                <div style={{ marginTop: "42px", minHeight: "54px" }}>Lead · 4 col</div>
              </div>
            </div>
            <div className="stage">
              <span className="stage__label mono">Lado fijo + lista</span>
              <div className="pat" style={{ gridTemplateColumns: "4fr 1fr 7fr" }}>
                <div className="t" style={{ minHeight: "140px" }}>Sticky 4 col</div>
                <span />
                <div style={{ minHeight: "140px", placeItems: "start", textAlign: "left" }}>Lista de líneas · 7 col</div>
              </div>
            </div>
          </div>
          <p className="ds-note">
            Alterna fondos entre secciones: blanco, papel azul (#F4F8FF), navy nocturno (una vez) y azul de señal (el cierre). Cada sección: rótulo mono azul + titular Display + texto de apoyo de 46 caracteres.{" "}
            <b>No numeres</b>
            {" "}todas las secciones ("01 / …"): es un patrón repetido por las plantillas genéricas.
          </p>
          <h3 className="ds-sub">Espacio para media futura</h3>
          <div className="ds-grid ds-grid--3">
            <div className="hz-media" style={{ ["--ratio" as string]: "4/5" }}><span className="hz-media__hint mono">Imagen · 4:5</span></div>
            <div className="hz-media" style={{ ["--ratio" as string]: "16/9" }}><span className="hz-media__hint mono">Video · 16:9</span></div>
            <div className="hz-media" style={{ ["--ratio" as string]: "21/9" }}><span className="hz-media__hint mono">Imagen · 21:9</span></div>
          </div>
          <p className="ds-note">
            Usa capturas reales del producto (registro, captura biométrica) en el mismo lenguaje de línea fina. Un hueco vacío resta más de lo que reserva: si no hay media, no pongas el marco.
          </p>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="principios-bio" aria-labelledby="h-pb" data-nav="Reglas biométricas" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-pb">Cuando la pantalla toca el cuerpo de alguien</h2>
          <p className="ds-lead">
            Rostro, huella, documento y voto son los momentos más delicados del producto. Estos patrones fijan cómo se pide permiso, cómo se guía sin culpar y cómo se muestra una decisión sin esconder el número. Todas las demos de esta página son{" "}
            <b>simulaciones</b>
            : no usan cámara, lector ni datos reales. Son ejemplos de uso del sistema, no una copia fiel del producto final.
          </p>
          <div className="ds-grid ds-grid--3 ds-gap-top">
            <div className="stage">
              <h3 className="ds-sub" style={{ margin: "0 0 .5rem", fontSize: "1.15rem" }}>Consentimiento primero</h3>
              <p className="ds-note" style={{ margin: "0" }}>
                Antes de pedir cámara o huella, se explica qué se guarda, para qué y cuánto tiempo. Quien no acepta tiene una salida clara, no un callejón.
              </p>
            </div>
            <div className="stage">
              <h3 className="ds-sub" style={{ margin: "0 0 .5rem", fontSize: "1.15rem" }}>Guiar sin culpar</h3>
              <p className="ds-note" style={{ margin: "0" }}>
                "Acércate un poco más", no "Rostro inválido". Cada indicación dice qué hacer, y el color nunca es el único canal: siempre icono y texto.
              </p>
            </div>
            <div className="stage">
              <h3 className="ds-sub" style={{ margin: "0 0 .5rem", fontSize: "1.15rem" }}>Decisión con su número</h3>
              <p className="ds-note" style={{ margin: "0" }}>
                Una verificación muestra la similitud, el umbral y la decisión juntos. Nunca solo "✓" o "✗". El umbral lo manda el servidor; la interfaz no lo fija.
              </p>
            </div>
          </div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Siempre</strong>
              <ul>
                <li>Un solo paso por pantalla y una acción principal.</li>
                <li>Estado visible en texto, anunciado con{" "}<code>role="status"</code>.</li>
                <li>Una salida en cada pantalla (cancelar, reintentar, pedir ayuda).</li>
                <li>Mostrar la plantilla guardada como "huella matemática", nunca la foto o el dibujo.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>Nunca</strong>
              <ul>
                <li>Mostrar una foto del rostro o la huella almacenada tras la captura.</li>
                <li>Dar a entender que un rechazo es culpa de la persona.</li>
                <li>Vincular a una persona con su voto, ni en pantalla ni en el comprobante.</li>
                <li>Usar cuenta atrás que apure a quien tiene dificultad para posicionarse.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="rostro" aria-labelledby="h-rostro" data-nav="Captura facial" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-rostro">Captura facial</h2>
          <p className="ds-lead">
            Un óvalo guía, tres indicadores de calidad en texto y una prueba de vida en pasos cortos. La vista de cámara es una superficie navy: el único lugar de la captura donde el fondo es oscuro.
          </p>
          <div className="pt-grid">
            <FaceCapture />
            <div className="pt-side">
              <div>
                <h3>Anatomía</h3>
                <ol>
                  <li><b>Óvalo guía.</b>{" "}Punteado mientras busca, sólido cian cuando está listo, verde al éxito, rojo claro al error.</li>
                  <li><b>Mensaje en vivo.</b>{" "}Una sola indicación imperativa y amable, dentro de la vista.</li>
                  <li>
                    <b>Calidad en tres criterios.</b>
                    {" "}Cada fila: barra de 3 segmentos{" "}
                    <b>más</b>
                    {" "}icono y palabra ("Buena", "Mejorar", "Insuficiente").
                  </li>
                  <li><b>Prueba de vida.</b>{" "}Tres pasos numerados; el actual en negrita y azul.</li>
                  <li><b>Acción única.</b>{" "}El botón cambia de verbo según el estado y se desactiva si no se puede avanzar.</li>
                </ol>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Sin cuenta atrás ni límite de tiempo visible.</li>
                  <li>El mensaje se anuncia con{" "}<code>role="status"</code>; el cambio de estado no mueve el foco.</li>
                  <li>"Sin cámara" ofrece un camino alterno ("Usar otro dispositivo") si existe; si no, lo dice.</li>
                  <li>Tras el éxito, no se muestra la foto: solo "Rostro registrado".</li>
                </ul>
              </div>
              <div>
                <h3>Copy aprobado</h3>
                <ul>
                  <li>Buscando: "Centra tu rostro en el óvalo."</li>
                  <li>Listo: "Perfecto, no te muevas."</li>
                  <li>Capturando: "Capturando…"</li>
                  <li>Éxito: "Rostro registrado."</li>
                  <li>Error: "No logramos verla bien. Busca más luz y reintenta."</li>
                  <li>Sin cámara: "No pudimos usar la cámara."</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="huella" aria-labelledby="h-huella" data-nav="Captura de huella" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-huella">Captura de huella</h2>
          <p className="ds-lead">
            La huella se dibuja de forma simplificada —arcos anidados alrededor de un núcleo con tallo, con patas largas y algunos cortes— tal como la dibujó el equipo con el trazo limpio y los colores de la marca, sin imitar los detalles de una huella real. Las crestas se iluminan de dentro hacia fuera a medida que avanza la lectura; el porcentaje y la calidad se dicen en texto.
          </p>
          <div className="pt-grid">
            <FingerprintCapture />
            <div className="pt-side">
              <div>
                <h3>Anatomía</h3>
                <ol>
                  <li>
                    <b>Lector.</b>
                    {" "}Superficie navy con 11 trazos vectoriales (núcleo con tallo y 6 crestas en cúpula con cortes); las activas pasan de blanco tenue a cian, verde (éxito) o ámbar (calidad baja).
                  </li>
                  <li><b>Selector de dedo.</b>{" "}Radios nativos de 44 px; los dedos ya registrados llevan una marca ✓ en texto.</li>
                  <li>
                    <b>Mensaje + progreso.</b>
                    {" "}Titular en{" "}
                    <code>role="status"</code>
                    , barra con{" "}
                    <code>role="progressbar"</code>
                    {" "}y calidad en 0–100.
                  </li>
                </ol>
              </div>
              <div>
                <h3>Estados</h3>
                <ul>
                  <li><b>Calidad baja:</b>{" "}arcos en ámbar y la causa en una frase ("Presiona un poco más y no muevas el dedo").</li>
                  <li><b>Éxito:</b>{" "}arcos verdes y "Huella registrada. 86 de calidad."</li>
                  <li><b>Error:</b>{" "}"No pudimos leer la huella. Límpiala y reintenta."</li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Al menos dos dedos por persona; el avance dice "1 de 2 dedos".</li>
                  <li>
                    Nunca se dibuja la huella real de la persona; las crestas son una ilustración genérica, decorativa (
                    <code>aria-hidden</code>
                    ), y no codifican datos.
                  </li>
                  <li>El umbral de calidad aceptable lo define el servidor.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="resultado" aria-labelledby="h-res" data-nav="Resultado de verificación" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-res">Resultado de verificación</h2>
          <p className="ds-lead">
            Muestra la similitud, el umbral y la decisión a la vez. La barra reserva el tramo del umbral con una marca oscura y su rótulo; el texto dice cuánto se pasó o faltó. Mueve el control para ver cómo cambia la decisión.
          </p>
          <div className="pt-grid">
            <div className="pt-card"><VerificationResult /></div>
            <div className="pt-side">
              <div>
                <h3>Anatomía</h3>
                <ol>
                  <li><b>Decisión</b>{" "}en cápsula con icono y palabra: "Aceptada" / "Rechazada".</li>
                  <li><b>Puntaje grande</b>{" "}(Space Grotesk, cifras tabulares) y una frase que explica la distancia al umbral.</li>
                  <li>
                    <b>Escala 0–1</b>
                    {" "}con el umbral rotulado; relleno azul = puntaje. El tramo bajo el umbral es cálido, el superior es azul claro.
                  </li>
                  <li><b>Motivos</b>{" "}en filas clave/valor con icono: rostro, prueba de vida, documento.</li>
                  <li><b>Siguiente acción:</b>{" "}continuar o reintentar.</li>
                </ol>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>El umbral (0.68) es un dato del servidor; la maqueta lo muestra, no lo calcula.</li>
                  <li>Un rechazo explica qué se puede intentar, nunca "usted no es quien dice ser".</li>
                  <li>La decisión nunca se comunica solo por color.</li>
                  <li>Los puntajes cerca del umbral no se disfrazan: se muestran con su número exacto.</li>
                </ul>
              </div>
              <div>
                <h3>Copy aprobado</h3>
                <ul>
                  <li>Aceptada: "Identidad verificada."</li>
                  <li>Rechazada: "No pudimos confirmar la identidad. Intenta de nuevo con mejor luz."</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="revision-manual" aria-labelledby="h-revision-manual" data-nav="Revisión manual" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-revision-manual">Revisión manual de verificaciones</h2>
          <p className="ds-lead">
            Cuando un puntaje cae cerca del umbral, una persona autorizada decide. Una cola de casos, el detalle con el puntaje frente al umbral y una decisión que{" "}
            <b>exige motivo</b>
            {" "}y queda en la bitácora.{" "}
            <span className="hz-chip hz-chip--info hz-chip--outline hz-chip--wrap">
              <Icon name="lightbulb" />
              Propuesta de diseño, pendiente de validar con el equipo
            </span>
          </p>
          <div className="pt-grid rv-grid">
            <ManualReview />
            <div className="pt-side">
              <div>
                <h3>Anatomía</h3>
                <ol>
                  <li><b>Cola</b>{" "}ordenada por antigüedad, con el puntaje y la distancia al umbral en texto.</li>
                  <li>
                    <b>Detalle</b>
                    : puntaje grande, escala con el umbral, y los datos del intento (dispositivo, calidad, prueba de vida, intentos previos).
                  </li>
                  <li><b>Decisión</b>: aprobar o rechazar, con{" "}<b>motivo obligatorio</b>{" "}y nota opcional.</li>
                  <li>
                    <b>Registro</b>
                    : la decisión guarda quién, cuándo y por qué en la bitácora (
                    <code>BIOMETRIC_VERIFIED</code>
                    {" "}con origen "revisión manual").
                  </li>
                </ol>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>La{" "}<b>banda de revisión</b>{" "}(aquí 0.60–0.75) la define el servidor, igual que el umbral.</li>
                  <li>
                    Esta propuesta compara{" "}
                    <b>puntajes y metadatos</b>
                    ; si el revisor puede ver imágenes es una decisión de privacidad por tomar.
                  </li>
                  <li>Nadie revisa sus propios casos (el sistema excluye al usuario implicado).</li>
                  <li>Decidir no es reversible desde esta pantalla; un error se corrige con una nueva revisión que deja rastro.</li>
                </ul>
              </div>
              <div>
                <h3>Copy aprobado</h3>
                <ul><li>Cola vacía: "No hay casos pendientes. Buen trabajo."</li><li>Tras decidir: "Decisión registrada. Quedan 3 casos."</li></ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="ocr" aria-labelledby="h-ocr" data-nav="Documento y OCR" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-ocr">Captura de documento y revisión de datos</h2>
          <p className="ds-lead">
            La cámara lee, la persona confirma. Cada campo extraído se muestra editable con su confianza en texto; los de baja confianza se piden revisar antes de continuar.
          </p>
          <div className="pt-card" style={{ marginTop: "1.8rem" }}><DocumentCapture /></div>
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="pt-side">
              <div>
                <h3>Anatomía</h3>
                <ul>
                  <li>
                    <b>Marco con esquinas</b>
                    {" "}(relación 16:10 del token{" "}
                    <code>--av-ratio-doc</code>
                    ); blancas buscando, verdes al detectar.
                  </li>
                  <li><b>Campos editables</b>{" "}con etiqueta, valor y confianza en mono y texto (95.4%).</li>
                  <li><b>"Revisar"</b>{" "}en ámbar con icono cuando la confianza es menor a 90%; al corregir pasa a "Corregido".</li>
                </ul>
              </div>
            </div>
            <div className="pt-side">
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>Nunca se avanza con datos sin que la persona los haya visto.</li>
                  <li>El umbral de 90% es un valor de ejemplo: lo define el servicio de OCR.</li>
                  <li>Los datos de la maqueta son ficticios.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="papeleta" aria-labelledby="h-pap" data-nav="Tarjetón y comprobante" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-pap">Tarjetón electoral y comprobante</h2>
          <p className="ds-lead">
            La papeleta digital imita al tarjetón de papel que la gente ya conoce: cada opción es una casilla grande con espacio para la{" "}
            <b>foto</b>
            , el{" "}
            <b>número</b>
            , el{" "}
            <b>nombre</b>
            {" "}y el{" "}
            <b>logo</b>
            {" "}de la lista, y el voto en blanco es una casilla igual de grande. El comprobante prueba que{" "}
            <b>un voto fue emitido</b>
            {" "}sin decir cuál ni de quién.
          </p>
          <Ballot />
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="pt-side">
              <div>
                <h3>Anatomía del tarjetón</h3>
                <ol>
                  <li><b>Encabezado:</b>{" "}espacio para el logo de la elección, título en dos líneas y serie.</li>
                  <li><b>Instrucción en rojo:</b>{" "}"Marque solo una opción", en mono mayúsculas.</li>
                  <li>
                    <b>Casilla de opción:</b>
                    {" "}borde navy de 2 px; dentro, de arriba abajo: número,{" "}
                    <b>foto(s)</b>
                    , cargo y nombre, y{" "}
                    <b>logo</b>
                    {" "}de la lista.
                  </li>
                  <li><b>Voto en blanco:</b>{" "}casilla del mismo tamaño y peso, con el texto centrado.</li>
                  <li><b>Marca de agua</b>{" "}diagonal "Muestra · no válida para votar" mientras sea una demostración.</li>
                </ol>
              </div>
              <div>
                <h3>Dos variantes del tarjetón</h3>
                <div className="hz-alert hz-alert--warning" role="note" style={{ margin: "0 0 .8rem" }}>
                  <strong>La «fórmula» no tiene respaldo en el modelo</strong>
                  Hoy un candidato es una persona por cargo y la selección es única. Foto, logo y partido tampoco tienen columnas en{" "}
                  <code>election_candidate</code>
                  {" "}(solo{" "}
                  <code>display_name</code>
                  {" "}y{" "}
                  <code>ballot_order</code>
                  ). Construir primero «una persona por partido» y solo con nombre y orden; la fórmula y las imágenes esperan a que el modelo cambie.
                </div>
                <div className="doc-wrap" style={{ margin: "0" }}>
                  <table className="doc-table">
                    <thead><tr><th>Variante</th><th>Cuándo</th><th>Casilla</th></tr></thead>
                    <tbody>
                      <tr>
                        <td><b>Fórmula</b></td>
                        <td>Un cargo que se elige en pareja (presidente y vicepresidente).</td>
                        <td>2 fotos, 2 nombres con su cargo, número y logo.</td>
                      </tr>
                      <tr>
                        <td><b>Una persona por partido</b></td>
                        <td>Un cargo individual: personero, representante, delegado.</td>
                        <td>1 foto grande, nombre, cargo, número y logo.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3>Espacios para imagen</h3>
                <ul>
                  <li>
                    Foto: relación 3:4 con fondo azul claro y un icono de persona hasta que se cargue (
                    <code>{"<img>"}</code>
                    {" "}con{" "}
                    <code>object-fit: cover</code>
                    ).
                  </li>
                  <li>Una casilla admite 1 foto (un cargo) o 2 (fórmula presidente + vicepresidente).</li>
                  <li>Logo de la lista: recuadro de 16:6; nunca se estira, se contiene con{" "}<code>object-fit: contain</code>.</li>
                  <li>Toda imagen lleva{" "}<code>alt</code>{" "}con el nombre ("Foto de …"); el nombre y el número siempre están en texto.</li>
                </ul>
              </div>
            </div>
            <div className="pt-side">
              <div>
                <h3>Selección y teclado</h3>
                <ul>
                  <li>
                    Cada casilla es un radio nativo:{" "}
                    <kbd>←</kbd>
                    {" "}
                    <kbd>→</kbd>
                    {" "}o{" "}
                    <kbd>↑</kbd>
                    {" "}
                    <kbd>↓</kbd>
                    {" "}cambian de opción,{" "}
                    <kbd>Espacio</kbd>
                    {" "}elige.
                  </li>
                  <li>Seleccionada = borde azul grueso, relleno claro, marca ✓ y la palabra "Marcada" (no solo color).</li>
                  <li>Un solo paso por pantalla; el foco pasa al titular de cada paso (<code>tabindex="-1"</code>).</li>
                  <li>Móvil: las casillas pasan a una columna y la foto se reduce para que se vean tres a la vez.</li>
                </ul>
              </div>
              <div>
                <h3>Reglas de privacidad</h3>
                <ul>
                  <li>El código se genera al azar en el servidor; no se deriva de la persona, la opción ni la hora.</li>
                  <li>Ninguna pantalla posterior repite la opción elegida.</li>
                  <li>No se registra en bitácora quién eligió qué: solo que votó.</li>
                  <li>El orden de las casillas y la prominencia visual no favorecen a ninguna lista; el orden lo define la autoridad electoral.</li>
                  <li>Los nombres y números de la maqueta son de ejemplo.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="dispositivos" aria-labelledby="h-dev" data-nav="Dispositivos" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-dev">Estado de dispositivos</h2>
          <p className="ds-lead">
            Cámaras y lectores son fuentes de datos: si fallan, la persona que administra debe saberlo a primera vista y poder actuar. Cada fila tiene estado en texto, última señal y una acción.
          </p>
          <div className="pt-grid">
            <div className="pt-card">
              <h3 className="pt-card__t">Dispositivos</h3>
              <p className="pt-card__s">Sede Central · datos de ejemplo</p>
              <DeviceList />
            </div>
            <div className="pt-side">
              <div>
                <h3>Estados</h3>
                <ul>
                  <li>
                    <span className="hz-chip hz-chip--success"><Icon name="check-circle" />Conectado</span>
                    {" "}responde dentro del tiempo esperado.
                  </li>
                  <li><span className="hz-chip hz-chip--warning"><Icon name="plug" />Desconectado</span>{" "}sin señal; se ofrece "Reconectar".</li>
                  <li>
                    <span className="hz-chip hz-chip--error"><Icon name="x-circle" />Con error</span>
                    {" "}responde mal; se ofrece "Probar" y el motivo.
                  </li>
                </ul>
              </div>
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>La píldora lleva la{" "}<b>palabra</b>{" "}y un icono; el icono del dispositivo cambia de tono pero no es la única señal.</li>
                  <li>"Última señal" en tiempo relativo ("Hace 2 min") con la hora exacta en{" "}<code>title</code>.</li>
                  <li>Un dispositivo caído se refleja también como banner del sistema (ver{" "}<i>Plantillas y estados › Avisos del sistema</i>).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="consentimiento" aria-labelledby="h-cons" data-nav="Consentimiento" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-cons">Consentimiento de datos biométricos</h2>
          <p className="ds-lead">
            Va antes de la primera captura. Cuatro respuestas en lenguaje llano: qué guardamos, para qué, por cuánto tiempo y cómo se revoca. El texto legal definitivo lo fija el área jurídica; este patrón fija la{" "}
            <b>estructura</b>
            .
          </p>
          <div className="pt-grid">
            <BiometricConsent />
            <div className="pt-side">
              <div>
                <h3>Reglas</h3>
                <ul>
                  <li>La casilla{" "}<b>nunca</b>{" "}viene marcada; el botón principal solo se activa al marcarla.</li>
                  <li>"Ahora no" es un botón de igual altura, no un enlace escondido; explica qué no podrá hacer.</li>
                  <li>Sin letra pequeña ni desplazamiento oculto: lo esencial cabe sin scroll en móvil.</li>
                  <li>El consentimiento se guarda con fecha y versión del texto (para auditoría), sin datos biométricos.</li>
                </ul>
              </div>
              <div>
                <h3>Pendiente de definir</h3>
                <ul><li>Plazos de conservación exactos y canal de revocación.</li><li>Texto legal y enlace a la política de privacidad.</li></ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="estados-oficiales" aria-labelledby="h-eo" data-nav="Estados oficiales de biometría" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-eo">Estados oficiales: del dato a la pantalla</h2>
          <p className="ds-lead">
            Los patrones biométricos se pintan con los valores del diccionario de datos y con la máquina de estados de captura del estándar de código (§23). Un resultado distinto es un mensaje distinto:{" "}
            <b>ERROR nunca se muestra como NO_MATCH</b>
            .
          </p>
          <h3 className="ds-sub">Resultado de verificación</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th><code>verification_outcome</code></th><th>Píldora</th><th>Mensaje</th><th>Acción</th></tr></thead>
              <tbody>
                <tr><td><code>MATCH</code></td><td>Aceptada · éxito</td><td>Identidad verificada.</td><td>Continuar.</td></tr>
                <tr>
                  <td><code>NO_MATCH</code></td>
                  <td>Rechazada · error</td>
                  <td>No coincide con la persona registrada.</td>
                  <td>Reintentar o usar otra vía.</td>
                </tr>
                <tr>
                  <td><code>LIVENESS_FAILED</code></td>
                  <td>Rechazada · aviso</td>
                  <td>No pudimos confirmar que es una persona real.</td>
                  <td>Reintentar con buena luz y sin fotos ni pantallas.</td>
                </tr>
                <tr>
                  <td><code>QUALITY_REJECTED</code></td>
                  <td>Calidad baja · aviso</td>
                  <td>La captura no tiene calidad suficiente.</td>
                  <td>Repetir la captura con la guía de calidad.</td>
                </tr>
                <tr>
                  <td><code>ERROR</code></td>
                  <td>Error del sistema · neutro</td>
                  <td>No pudimos completar la verificación.</td>
                  <td>Reintentar; con código de soporte. No cuenta como rechazo.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Estado del enrolamiento</h3>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th><code>biometric_enrollment</code></th><th>Píldora</th><th>Significado en pantalla</th></tr></thead>
              <tbody>
                <tr><td><code>PENDING</code></td><td>Pendiente · neutro</td><td>Falta completar la captura.</td></tr>
                <tr><td><code>ACTIVE</code></td><td>Activo · éxito</td><td>Listo para verificar.</td></tr>
                <tr><td><code>FAILED</code></td><td>Fallido · error</td><td>La captura no se pudo registrar; permitir repetirla.</td></tr>
                <tr><td><code>REVOKED</code></td><td>Revocado · neutro</td><td>El consentimiento se retiró; no se usa.</td></tr>
                <tr>
                  <td><code>SUPERSEDED</code></td>
                  <td>Reemplazado · neutro</td>
                  <td>Existe un registro más reciente; solo se muestra en el historial.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="ds-sub">Máquina de estados de la captura</h3>
          <p className="ds-note">
            <b>IDLE → INITIALIZING → CAPTURING → PROCESSING → VERIFYING → SUCCESS | FAILURE.</b>
            {" "}Cada estado tiene mensaje propio y se anuncia con{" "}
            <code>role="status"</code>
            ; la interfaz no avanza sola de FAILURE a CAPTURING. El consentimiento biométrico se acepta antes de salir de IDLE. La huella agrega el estado «lector no disponible» cuando el servicio local no responde.
          </p>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="copy-patrones" aria-labelledby="h-cp" data-nav="Resumen de estados y canales" data-grp="Biométricos y electorales">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Patrones · Biométricos y electorales</span>
          <h2 id="h-cp">Resumen de estados y canales</h2>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Patrón</th><th>Estados</th><th>Canales (nunca solo color)</th><th>Anuncio</th></tr></thead>
              <tbody>
                <tr>
                  <td>Captura facial</td>
                  <td>Buscando, listo, capturando, éxito, error, sin cámara</td>
                  <td>Óvalo + mensaje + calidad en texto + botón</td>
                  <td><code>role="status"</code>{" "}en el mensaje</td>
                </tr>
                <tr>
                  <td>Huella</td>
                  <td>Esperando, leyendo, calidad baja, éxito, error</td>
                  <td>Arcos + titular + % + calidad</td>
                  <td>Titular{" "}<code>role="status"</code>,{" "}<code>progressbar</code></td>
                </tr>
                <tr>
                  <td>Resultado</td>
                  <td>Aceptada, rechazada</td>
                  <td>Cápsula con icono y palabra + número + frase</td>
                  <td><code>role="status"</code>{" "}en la decisión</td>
                </tr>
                <tr>
                  <td>Documento / OCR</td>
                  <td>Buscando, detectado; campo OK, revisar, corregido</td>
                  <td>Esquinas + mensaje + % en texto + chip "Revisar"</td>
                  <td>Resumen en{" "}<code>role="status"</code></td>
                </tr>
                <tr>
                  <td>Papeleta</td>
                  <td>Elegir, revisar, comprobante</td>
                  <td>Borde + relleno + ✓ + paso numerado</td>
                  <td>Foco al titular de cada paso</td>
                </tr>
                <tr>
                  <td>Dispositivos</td>
                  <td>Conectado, desconectado, con error</td>
                  <td>Chip con punto y palabra + icono + última señal</td>
                  <td>Toast al reconectar</td>
                </tr>
                <tr>
                  <td>Consentimiento</td>
                  <td>Sin aceptar, aceptado, rechazado</td>
                  <td>Casilla + texto + botón activado/desactivado</td>
                  <td>Mensaje{" "}<code>role="status"</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
