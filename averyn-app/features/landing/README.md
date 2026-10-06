# landing

Página pública de presentación de Averyn (ruta `/`). No exige sesión: vive fuera del grupo `(app)`.

## Responsabilidad

Presentar el producto (qué es, capacidades, soluciones, tecnología, proceso, arquitectura,
seguridad y equipo) y llevar al login. No tiene datos ni reglas de negocio.

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `content.ts` | Textos de la página (menú, secciones, equipo) |
| `hero-phases.ts` | Matemática del hero guiado por scroll (funciones puras) |
| `use-hero-scroll.ts` | Hook que escucha el scroll y escribe las fases como variables CSS |
| `components/landing-view.tsx` | Compone la página |
| `components/hero-scroll-scope.tsx` | Raíz `.mn`: conduce el hero y comparte su estado con el encabezado |
| `components/landing-header.tsx` | Encabezado fijo con menú desplegable en pantallas angostas |
| `components/landing-hero.tsx` | Hero: logo, figura de arcos, título y botones |
| `components/product-sections.tsx` | Qué es, Capacidades y Soluciones |
| `components/platform-sections.tsx` | Tecnología, Proceso, Arquitectura y Seguridad |
| `components/closing-sections.tsx` | Equipo, cierre y pie de página |
| `components/landing-parts.tsx` | Piezas comunes: espacio para medios, rótulo y lista |
| `components/arcs-figure.tsx` | Figuras de arcos de la marca (decorativas) |
| `components/reveal.tsx` | Revelado suave al entrar en pantalla |
| `components/back-to-top.tsx` | Botón «Volver arriba» |

Los estilos (`mn-*`) están en `app/styles/av-landing.css`.

## Cómo funciona el hero

La sección `#inicio` mide 220 vh y contiene un escenario fijo (`position: sticky`). El
progreso del scroll (0 a 1) se reparte en tres fases que la hoja de estilos lee como
`--t1`, `--t2` y `--t3`:

| Fase | Tramo | Qué pasa |
|---|---|---|
| `t1` | 4 %–30 % | La «A» negra se abre y aparece la palabra «Averyn» |
| `t2` | 30 %–50 % | El logo se reduce y sube; el navy cae desde abajo; aparece el logo del encabezado |
| `t3` | 42 %–72 % | Aparecen la figura de arcos, el título y los botones |

Las variables se escriben directo en el DOM, una vez por cuadro, sin volver a renderizar.
Solo cambia el estado de React cuando el logo del encabezado o el texto pasan de ocultos a
visibles: lo que no se ve lleva `inert` (no recibe foco ni lo leen los lectores de pantalla).

## Accesibilidad

- Con `prefers-reduced-motion` se muestra el estado final, sin escenario fijo ni revelados.
- Sin JavaScript el hero muestra su estado final y todo el contenido se ve.
- Enlace «Saltar al contenido», foco visible en cada superficie y menú que se cierra con Escape.

## Pruebas

`tests/landing/` cubre las fases del hero, el progreso, la escala del logo y el contenido
(`npm run test:unit`). La accesibilidad: `npm run test:a11y -- http://localhost:3300 ""`.

## Pendientes

- Los espacios «Imagen · 4:5», «Imagen o video · 21:9» y «Video · 16:9» esperan sus medios.
- El contacto del pie dice «Próximamente».
- Los avatares del equipo se cargan desde GitHub (servicio externo).
