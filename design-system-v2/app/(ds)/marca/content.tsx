/* Generado desde docs/ds/src por scripts/html-to-tsx.mjs (migración a React, v2.0).
   A partir de aquí este archivo es la fuente: se edita a mano. */
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { EmptyStateExamples, IllustrationGrid, MailPreview, PrintPreview } from "@/components/docs/marca-demos";

export default function MarcaContent() {
  return (
    <>
      <section className="ds-sec" id="ilustracion" aria-labelledby="h-ill" data-nav="Ilustración con arcos" data-grp="Identidad visual">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Marca y entregables</span>
          <h2 id="h-ill">Kit de ilustración: los arcos</h2>
          <p className="ds-lead">
            Averyn no usa mascotas ni escenas: una sola figura, los arcos sobre el horizonte, cambia de estado para contar qué pasa. Solo trazos de 1.5–2 px, sin rellenos, con la paleta de marca. Cada pieza se puede copiar o descargar como SVG.
          </p>
          <IllustrationGrid />
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Hacer</strong>
              <ul>
                <li>Una ilustración por pantalla, centrada o anclada a una esquina.</li>
                <li>Trazos con{" "}<code>vector-effect: non-scaling-stroke</code>{" "}para que no engorden al escalar.</li>
                <li><code>aria-hidden="true"</code>{" "}cuando es decorativa; título y descripción solo si comunica algo que el texto no dice.</li>
                <li>Fondo claro con trazos navy/azul/cian; fondo navy con trazos blanco/cian-glow.</li>
              </ul>
            </div>
            <div className="dd dd--dont">
              <strong>No hacer</strong>
              <ul>
                <li>Rellenar los arcos, añadir sombras o degradados.</li>
                <li>Rotar, deformar o cambiar el orden de los colores de los arcos.</li>
                <li>Usar la ilustración de error para estados que no son errores.</li>
                <li>Animar en bucle: el dibujo ocurre una sola vez y respeta{" "}<code>prefers-reduced-motion</code>.</li>
              </ul>
            </div>
          </div>
          <h3 className="ds-sub">Estados vacíos con arcos</h3>
          <EmptyStateExamples />
          <p className="ds-note">
            Estructura fija: ilustración (96 px de alto), titular que dice qué falta, una frase con el siguiente paso y, si hay una salida, un único botón. Nunca "No hay datos".
          </p>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="favicons" aria-labelledby="h-fav" data-nav="Favicons e imagen social" data-grp="Identidad visual">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Marca y entregables</span>
          <h2 id="h-fav">Favicons e imagen para compartir</h2>
          <p className="ds-lead">
            Generados a partir del isotipo oficial (
            <code>averyn-logo-blue</code>
            ) y la figura de arcos; nada redibujado. Los archivos están en la carpeta de recursos del design system (
            <a href="/calidad#ubicacion">Dónde vive cada archivo</a>
            ), listos para copiar al frontend cuando se decida.
          </p>
          <div className="fav-row">
            <figure className="fav">
              <img src="/assets/favicon-32.png" width="32" height="32" alt="Favicon 32 por 32" />
              <figcaption><b>favicon-32.png</b>Pestaña del navegador · 32 × 32, fondo transparente</figcaption>
              <a className="av-btn av-btn--text" href="/assets/favicon-32.png" download="">Descargar</a>
            </figure>
            <figure className="fav">
              <img src="/assets/favicon-48.png" width="48" height="48" alt="Favicon 48 por 48" />
              <figcaption><b>favicon-48.png</b>Atajos y resultados de búsqueda · 48 × 48</figcaption>
              <a className="av-btn av-btn--text" href="/assets/favicon-48.png" download="">Descargar</a>
            </figure>
            <figure className="fav">
              <img src="/assets/apple-touch-icon.png" width="90" height="90" alt="Ícono de pantalla de inicio" style={{ borderRadius: "20px" }} />
              <figcaption><b>apple-touch-icon.png</b>iOS · 180 × 180, fondo azul claro con margen</figcaption>
              <a className="av-btn av-btn--text" href="/assets/apple-touch-icon.png" download="">Descargar</a>
            </figure>
            <figure className="fav">
              <img src="/assets/icon-512.png" width="90" height="90" alt="Ícono grande" style={{ borderRadius: "20px" }} />
              <figcaption><b>icon-512.png</b>PWA y tiendas · 512 × 512</figcaption>
              <a className="av-btn av-btn--text" href="/assets/icon-512.png" download="">Descargar</a>
            </figure>
          </div>
          <h3 className="ds-sub">Imagen para compartir{" "}<small>Open Graph · 1200 × 630</small></h3>
          <div className="og-wrap">
            <img src="/assets/og-image.png" alt="Vista previa de la imagen para compartir: Identidad inteligente para procesos institucionales, con la figura de arcos sobre fondo navy" width="1200" height="630" />
          </div>
          <div className="codeblock">
            <pre id="code-head">
              {"<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/assets/favicon-32.png\">\n<link rel=\"icon\" type=\"image/png\" sizes=\"48x48\" href=\"/assets/favicon-48.png\">\n<link rel=\"apple-touch-icon\" href=\"/assets/apple-touch-icon.png\">\n<meta name=\"theme-color\" content=\"#000C24\">\n<meta property=\"og:type\" content=\"website\">\n<meta property=\"og:title\" content=\"Averyn — Identidad inteligente\">\n<meta property=\"og:description\" content=\"Verificación biométrica para procesos institucionales.\">\n<meta property=\"og:image\" content=\"https://TU-DOMINIO/assets/og-image.png\">\n<meta name=\"twitter:card\" content=\"summary_large_image\">"}
            </pre>
            <button className="copy" type="button" data-copy="#code-head">Copiar</button>
          </div>
          <p className="ds-note">
            La URL de{" "}
            <code>og:image</code>
            {" "}debe ser absoluta y pública. El titular de la imagen es el mismo del hero de la landing; si cambia uno, cambia el otro.
          </p>
        </div>
      </section>
      <section className="ds-sec" id="correos" aria-labelledby="h-mail" data-nav="Correos transaccionales" data-grp="Fuera de la pantalla">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Marca y entregables</span>
          <h2 id="h-mail">Correos transaccionales</h2>
          <p className="ds-lead">
            Tres plantillas de producción: invitación, verificación de correo y recuperación de contraseña. HTML de tablas con estilos en línea (lo que realmente funciona en Gmail, Outlook y Apple Mail), versión en texto y variables{" "}
            <code>{"{{así}}"}</code>
            . Los archivos viven en la carpeta de correos (
            <a href="/calidad#ubicacion">Dónde vive cada archivo</a>
            ).
          </p>
          <MailPreview />
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Regla</th><th>Por qué</th></tr></thead>
              <tbody>
                <tr>
                  <td>Tablas y estilos en línea, 600 px</td>
                  <td>
                    Los clientes de correo eliminan{" "}
                    <code>{"<style>"}</code>
                    {" "}o ignoran flex/grid. Se prueba en Gmail, Outlook (escritorio y web), Apple Mail y móvil.
                  </td>
                </tr>
                <tr>
                  <td>Fuentes con respaldo a Arial</td>
                  <td>Space Grotesk, Inter y JetBrains Mono no existen en la mayoría de clientes: el diseño debe sostenerse sin ellas.</td>
                </tr>
                <tr>
                  <td>Un solo botón principal + enlace en texto</td>
                  <td>Si el botón no carga (imágenes o estilos bloqueados), la persona aún puede copiar el enlace.</td>
                </tr>
                <tr>
                  <td>Logo con URL absoluta y{" "}<code>alt</code></td>
                  <td>
                    Los correos no cargan archivos locales; sin imagen, "Averyn" sigue leyéndose. Poner{" "}
                    <code>{"{{logo_url}}"}</code>
                    {" "}a un PNG alojado en un dominio propio.
                  </td>
                </tr>
                <tr>
                  <td>Sin datos sensibles</td>
                  <td>
                    Nunca incluir contraseñas, plantillas biométricas ni el resultado de una verificación. El código de un solo uso vence en 10 minutos.
                  </td>
                </tr>
                <tr>
                  <td>Modo claro fijado</td>
                  <td><code>color-scheme: light only</code>: los colores están pensados y contrastados solo para fondo claro (botón 5.4:1).</td>
                </tr>
                <tr>
                  <td>Texto de seguridad siempre</td>
                  <td>Cada correo dice qué hacer si la persona no lo solicitó y que Averyn nunca pide códigos por teléfono.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="impresion" aria-labelledby="h-pr" data-nav="Impresión (actas)" data-grp="Fuera de la pantalla">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Marca y entregables</span>
          <h2 id="h-pr">Estilos de impresión: actas y constancias</h2>
          <p className="ds-lead">
            Los documentos oficiales (constancias de verificación, actas electorales, reportes) se imprimen o se guardan en PDF desde el navegador.{" "}
            <code>print.css</code>
            {" "}da formato A4 con tinta mínima, tablas que no se parten y pie con número de página.
          </p>
          <PrintPreview />
          <div className="ds-grid ds-grid--2 ds-gap-top">
            <div className="dd dd--do">
              <strong>Reglas de impresión</strong>
              <ul>
                <li>A4 con márgenes de 18/16/20 mm; pie "Página X de Y" y marca de documento verificable.</li>
                <li>Sin fondos de color: los estados llevan texto y símbolo (✓ / ✕), no dependen de la tinta.</li>
                <li>Encabezados sin huérfanos; tablas y firmas no se parten entre páginas; la cabecera de la tabla se repite.</li>
                <li>Los enlaces externos imprimen su dirección entre paréntesis.</li>
                <li>Se oculta todo lo interactivo (<code>.no-print</code>, navegación, botones).</li>
              </ul>
            </div>
            <div className="dd dd--do">
              <strong>Contenido obligatorio de un acta</strong>
              <ul>
                <li>Folio único, fecha y hora de emisión y quién la emitió.</li>
                <li>Qué se verificó y el resultado en palabras (no solo un icono).</li>
                <li>Espacio para firma y un código QR de validación.</li>
                <li>Una nota de privacidad: el documento{" "}<b>no</b>{" "}incluye datos biométricos ni el sentido de un voto.</li>
              </ul>
            </div>
          </div>
          <div className="codeblock">
            <pre id="code-print">
              {"<link rel=\"stylesheet\" href=\"print.css\">   <!-- carga siempre; las reglas de impresión viven en @media print -->\n\n<main class=\"pr-doc\">\n  <header class=\"pr-head\">…</header>\n  <dl class=\"pr-meta\">…</dl>\n  <table class=\"pr-table\">…</table>\n  <div class=\"pr-sign\">…</div>\n</main>"}
            </pre>
            <button className="copy" type="button" data-copy="#code-print">Copiar</button>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="entregables" aria-labelledby="h-ent" data-nav="Mapa de entregables" data-grp="Entregables">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Marca y entregables</span>
          <h2 id="h-ent">Mapa de entregables</h2>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Entregable</th><th>Qué es</th><th>Estado</th></tr></thead>
              <tbody>
                <tr>
                  <td>Design system en un solo HTML</td>
                  <td>Archivo único, el{" "}<b>entregable</b></td>
                  <td><span className="av-chip av-chip--success">Listo para compartir</span></td>
                </tr>
                <tr>
                  <td>Documento maestro (.md)</td>
                  <td>Referencia escrita para el repositorio</td>
                  <td><span className="av-chip av-chip--success">Listo</span></td>
                </tr>
                <tr>
                  <td>Páginas de error (404, 403, 500, offline, mantenimiento)</td>
                  <td>Páginas y estilos de error del frontend</td>
                  <td><span className="av-chip av-chip--success">En el frontend</span></td>
                </tr>
                <tr>
                  <td>Favicons e imagen social</td>
                  <td>Carpeta de recursos del design system</td>
                  <td><span className="av-chip av-chip--warning">Pendiente de copiar al frontend</span></td>
                </tr>
                <tr>
                  <td>Correos transaccionales</td>
                  <td>Carpeta de correos</td>
                  <td><span className="av-chip av-chip--warning">Pendiente de integrar al servicio de correo</span></td>
                </tr>
                <tr>
                  <td>Estilos de impresión</td>
                  <td>Hoja de impresión</td>
                  <td><span className="av-chip av-chip--warning">Pendiente de usar en actas reales</span></td>
                </tr>
                <tr><td>Tokens W3C</td><td>Archivo de tokens generado</td><td><span className="av-chip av-chip--success">Generado</span></td></tr>
                <tr><td>Modo nocturno</td><td>—</td><td><span className="av-chip av-chip--neutral">Fuera de alcance por ahora</span></td></tr>
                <tr>
                  <td>Gráficos, patrones biométricos y plantillas en el frontend</td>
                  <td>—</td>
                  <td><span className="av-chip av-chip--neutral">Solo documentados; se implementan con datos reales</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">
            Para regenerar todo, desde la carpeta de herramientas:{" "}
            <code>python tokens_export.py</code>
            ,{" "}
            <code>python emails.py</code>
            ,{" "}
            <code>python build.py</code>
            {" "}y, por último,{" "}
            <code>python bundle.py</code>
            {" "}(produce el HTML único). Las rutas de cada cosa están en{" "}
            <a href="/calidad#ubicacion">Dónde vive cada archivo</a>
            .
          </p>
        </div>
      </section>
      {null}
    </>
  );
}
