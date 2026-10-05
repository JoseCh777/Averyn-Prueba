/* Generado desde docs/ds/src por scripts/html-to-tsx.mjs (migración a React, v2.0).
   A partir de aquí este archivo es la fuente: se edita a mano. */
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

export default function InicioContent() {
  return (
    <>
      <section className="ds-sec" id="que-es" data-nav="Qué es Horizonte" data-grp="Presentación" aria-labelledby="h-que-es">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Inicio</span>
          <h2 id="h-que-es">Qué es Horizonte</h2>
          <p className="ds-lead">
            Horizonte es el design system de Averyn: el conjunto de reglas, piezas y pantallas que hacen que la landing, el acceso y el panel se vean y se comporten como un solo producto. Está pensado para una plataforma de identidad y biometría, donde la claridad y la confianza importan más que la decoración.
          </p>
          <div className="ds-grid ds-grid--3 ds-gap-top">
            <div className="stage">
              <h3 className="ds-sub" style={{ margin: "0 0 .5rem", fontSize: "1.15rem" }}>Una sola señal</h3>
              <p className="ds-note" style={{ margin: "0" }}>
                El azul de marca es el único color de acción. El resto es tinta, líneas finas y estados con palabra.
              </p>
            </div>
            <div className="stage">
              <h3 className="ds-sub" style={{ margin: "0 0 .5rem", fontSize: "1.15rem" }}>El horizonte que se oscurece</h3>
              <p className="ds-note" style={{ margin: "0" }}>
                La información va de lo claro a lo oscuro. El fondo cambia cuando el contenido cambia de naturaleza.
              </p>
            </div>
            <div className="stage">
              <h3 className="ds-sub" style={{ margin: "0 0 .5rem", fontSize: "1.15rem" }}>Honestidad</h3>
              <p className="ds-note" style={{ margin: "0" }}>
                Lo que no existe se dice ("Próximamente"). Nada finge datos reales y el color nunca es el único canal.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="mapa" data-nav="Mapa del sistema" data-grp="Presentación" aria-labelledby="h-mapa">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Inicio</span>
          <h2 id="h-mapa">Mapa del sistema</h2>
          <p className="ds-lead">
            El sistema se organiza por{" "}
            <b>propósito</b>
            . Si buscas una pieza reutilizable, está en Componentes; si buscas una pantalla o un flujo, en Patrones o Plantillas; si buscas un valor (color, espacio, token), en Fundamentos.
          </p>
          <div className="map ds-gap-top">
            <a className="map__card" href="/fundamentos">
              <span className="map__k mono">Sistema</span>
              <b>Fundamentos</b>
              <span>Principios, marca y figura de arcos, color, tipografía, espacio, iconografía y tokens exportables.</span>
            </a>
            <a className="map__card" href="/componentes">
              <span className="map__k mono">Sistema</span>
              <b>Componentes</b>
              <span>Botones, formularios, fechas, tablas y píldoras de estado, navegación, alertas, toast, modal, drawer y más.</span>
            </a>
            <a className="map__card" href="/graficos">
              <span className="map__k mono">Sistema</span>
              <b>Gráficos</b>
              <span>12 tipos de gráfico con paleta validada, tooltip, teclado, vista en tabla y modelos de datos.</span>
            </a>
            <a className="map__card" href="/patrones">
              <span className="map__k mono">Aplicación</span>
              <b>Patrones</b>
              <span>
                Patrones de página y los propios de Averyn: captura facial y de huella, verificación, OCR, tarjetón electoral, consentimiento.
              </span>
            </a>
            <a className="map__card" href="/plantillas">
              <span className="map__k mono">Aplicación</span>
              <b>Plantillas y estados</b>
              <span>Pantallas completas (bitácora, configuración, persona…), estados de carga y vacío, y las páginas de error.</span>
            </a>
            <a className="map__card" href="/marca">
              <span className="map__k mono">Marca y calidad</span>
              <b>Marca y entregables</b>
              <span>Ilustración con arcos, favicons e imagen social, correos transaccionales y estilos de impresión.</span>
            </a>
            <a className="map__card" href="/calidad">
              <span className="map__k mono">Marca y calidad</span>
              <b>Calidad y gobernanza</b>
              <span>Microcopy, accesibilidad, versiones y novedades, deuda conocida y cómo usar el sistema en una pantalla nueva.</span>
            </a>
          </div>
        </div>
      </section>
      <section className="ds-sec" id="empezar" data-nav="Por dónde empezar" data-grp="Presentación" aria-labelledby="h-empezar">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Inicio</span>
          <h2 id="h-empezar">Por dónde empezar</h2>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Si eres…</th><th>Empieza por</th><th>Después</th></tr></thead>
              <tbody>
                <tr>
                  <td><b>Diseño</b></td>
                  <td><a href="/fundamentos">Fundamentos</a>: principios, color y tipografía</td>
                  <td><a href="/componentes">Componentes</a>{" "}y{" "}<a href="/plantillas">Plantillas</a></td>
                </tr>
                <tr>
                  <td><b>Frontend</b></td>
                  <td><a href="/calidad#consumo">Consumo e implementación</a>{" "}y{" "}<a href="/fundamentos#tokens">Tokens</a></td>
                  <td><a href="/componentes">Componentes</a>{" "}(anatomía, teclado y ARIA)</td>
                </tr>
                <tr>
                  <td><b>Producto o revisión</b></td>
                  <td><a href="/plantillas">Plantillas</a>, con "Ver a pantalla completa"</td>
                  <td><a href="/patrones">Patrones</a>{" "}biométricos y electorales</td>
                </tr>
                <tr>
                  <td><b>Contenido</b></td>
                  <td><a href="/calidad#microcopy">Microcopy</a></td>
                  <td><a href="/plantillas#copy-errores">Copy de errores</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="ds-sec ds-sec--tint" id="novedades" data-nav="Novedades" data-grp="Estado" aria-labelledby="h-novedades">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">{"Inicio · Versión {{VERSION}}"}</span>
          <h2 id="h-novedades">Novedades</h2>
          <div className="doc-wrap">
            <table className="doc-table">
              <thead><tr><th>Versión</th><th>Qué cambió</th></tr></thead>
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
                    {" "}Las plantillas son ejemplos de uso, no el producto final; huella simplificada; tarjetón de una persona por partido; componentes de carga de archivos y estados de carga; y guía para migrar a React.
                  </td>
                </tr>
                <tr>
                  <td><b>v1.6</b>{" "}· oct 2026</td>
                  <td>
                    <b>Huecos cerrados y validación.</b>
                    {" "}Formularios nuevos (código de 6 dígitos, multi-select, contraseña con fuerza), flujos de cuenta y acceso, propuestas de escrutinio y revisión manual, tarjetón electoral, y un informe de validación con accesibilidad y teclado.
                  </td>
                </tr>
                <tr>
                  <td><b>v1.5</b>{" "}· oct 2026</td>
                  <td>
                    <b>Reorganización por propósito.</b>
                    {" "}8 páginas en 4 grupos, secciones sin numerar, índice por subgrupos, página de inicio, y validación automática de ids y enlaces al construir.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ds-note">El historial completo y la deuda conocida están en{" "}<a href="/calidad#gobernanza">Calidad y gobernanza</a>.</p>
        </div>
      </section>
      <section className="ds-sec" id="compartir" data-nav="Cómo compartirlo" data-grp="Estado" aria-labelledby="h-compartir">
        <div className="ds-wrap">
          <span className="ds-eyebrow mono">Inicio</span>
          <h2 id="h-compartir">Cómo compartir el design system</h2>
          <p className="ds-lead">
            Todo el sistema viaja en{" "}
            <b>un solo archivo HTML</b>
            :{" "}
            <code>averyn-design-system-horizonte.html</code>
            , que es el entregable. Se abre con doble clic, sin servidor, y se puede enviar por correo o Drive. Necesita internet solo para las fuentes de Google y los iconos.
          </p>
          <div className="codeblock">
            <pre id="code-share">
              {"# desde la carpeta de herramientas (ver \"Dónde vive cada archivo\")\npython tokens_export.py   # tokens.json desde tokens.css\npython emails.py          # correos transaccionales\npython build.py           # páginas (valida ids y enlaces)\npython bundle.py          # el HTML único para compartir"}
            </pre>
            <button className="copy" type="button" data-copy="#code-share">Copiar</button>
          </div>
          <p className="ds-note">
            Los gráficos, patrones y plantillas son{" "}
            <b>ejemplos de cómo usar el sistema, con datos ficticios</b>
            : no son una copia fiel del producto final y todavía no existen en el frontend real. El detalle está en la deuda conocida. Entre lo pospuesto: la{" "}
            <b>mascota de marca</b>
            {" "}(próxima creación), el{" "}
            <b>modo oscuro</b>
            {" "}y la prueba de concepto en React.
          </p>
        </div>
      </section>
    </>
  );
}
