# Horizonte 2.0 · componentes en React

> **Cómo correrlo si es tu primera vez:** ver la sección «Primeros pasos» al final.

Proyecto Next.js (16, React 19, TypeScript estricto, Tailwind v4) con **todo el Design System Horizonte en React**: componentes, patrones biométricos y electorales, gráficos, plantillas de pantalla, páginas de error y la propia documentación (8 páginas). Es un espacio de preparación: nada de esto está en los repositorios oficiales de `averyn-platform` hasta que el ADR-011 (`docs/propuestas/ADR-011-design-system-horizonte.md`) sea aprobado.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # compila y comprueba tipos
npm run typecheck  # next typegen + tsc
```

## Estructura

| Carpeta | Contenido |
|---|---|
| `app/(ds)/` | Páginas de la documentación: `/` (Inicio), `/fundamentos`, `/componentes`, `/graficos`, `/patrones`, `/plantillas`, `/marca`, `/calidad`. Cada una tiene `content.tsx` (texto y demos) y `sections.ts` (índice lateral) |
| `app/errores/[code]` | Páginas de error de pantalla completa: 403, 404, 500, offline y mantenimiento. `app/not-found.tsx` y `app/error.tsx` usan las mismas |
| `app/playground/` | Página de prueba con todos los componentes base |
| `app/tokens.css`, `app/styles/` | Tokens `--av-*` (fuente de verdad) y el CSS portado de Horizonte (`av-core.css`, `av-advanced.css`, `av-patterns.css`, `av-charts.css`, `av-templates.css`…) |
| `components/ui/` | Componentes genéricos: Button, Field, Alert, Chip, Modal, Tabs, Table, DataTable, Combobox, MultiSelect, DateRangePicker, OtpInput, FileUpload, CommandPalette, Drawer, Stepper… |
| `components/patterns/` | Captura facial, huella, resultado de verificación, revisión manual, documento/OCR, tarjetón y comprobante, dispositivos, consentimiento |
| `components/charts/` | Gráficos SVG propios (área, barras, apiladas, anillo, bullet, mapa de calor, embudo, histograma, desglose, KPI con sparkline), tarjeta con tabla alternativa y tooltip con teclado |
| `components/templates/` | 15 plantillas de pantalla (con sus estados) y los marcos de revisión |
| `components/effects/` | Efectos de marca derivados de Aceternity UI (revisados y adaptados) |
| `components/docs/`, `components/errors/` | Piezas de la documentación y páginas de error |
| `scripts/` | Herramientas: `html-to-tsx.mjs` (conversor que se usó una vez para migrar la documentación v1.7), `gen-icons.mjs`, `gen-docs-index.mjs` |

## Decisiones (5-oct-2026)

1. **Una librería por rol:** Tailwind v4 (estilos), shadcn/ui con Base UI (comportamiento), Aceternity UI + `motion` (efectos de marca) y **Bootstrap Icons** (iconos, como SVG con `react-bootstrap-icons`). **Lineicons** queda mencionado como opción futura: su set gratuito no trae los iconos de información, advertencia ni huella.
2. Las páginas no importan las librerías directamente: iconos con `<Icon name="check-circle" />` (`components/ui/icon.tsx`, generado por `npm run icons`), efectos desde `components/effects/`.
3. Aceternity solo en superficies de marca; cada efecto se revisa (reduced motion, hidratación, paleta) antes de entrar.
4. Con `shadcn add` hay que revisar lo que instala: el valor por defecto añade `lucide-react` y un paquete `cn` ajeno (ya retirados). El registro de Aceternity está en `components.json`.
5. **Prefijo `av-`** (decidido el 5-oct-2026, coincide con `averyn-web/AGENTS.md` §9): todas las clases de componentes usan `av-` (`av-btn`, `av-field`, `av-chip`…). Los tokens siguen siendo variables `--av-*`.

## Verificación (5-oct-2026)

axe sin violaciones en las 8 páginas de la documentación a 1440 y 375 px (salvo las 8 muestras de contraste que son ejemplos de lo que no se debe hacer), recorrido de teclado sin problemas (mismos elementos enfocables que la v1.7), sin scroll horizontal y sin errores de consola.

## Primeros pasos (si nunca has usado React)

1. **Instala Node.js** (versión 20.9 o superior; recomendada la LTS) desde https://nodejs.org. Comprueba en una terminal: `node -v` y `npm -v`.
2. **Abre una terminal en esta carpeta** (`Averyn-Prueba/design-system-v2`). En VS Code: menú Terminal › Nueva terminal.
3. **Instala las dependencias** (solo la primera vez, tarda uno o dos minutos): `npm install`
4. **Arráncalo:** `npm run dev`. Cuando diga `Ready`, abre http://localhost:3000 en el navegador.
5. **Edítalo:** al guardar un archivo, la página se actualiza sola. Para parar el servidor, `Ctrl + C` en la terminal.
6. **Versión de producción** (la que se despliega): `npm run build` y luego `npm run start`.

Dónde tocar cada cosa: el texto y las demos de cada página están en `app/(ds)/<página>/content.tsx`; los componentes, en `components/ui/`; los colores y medidas, en `app/tokens.css`; los estilos, en `app/styles/`.
