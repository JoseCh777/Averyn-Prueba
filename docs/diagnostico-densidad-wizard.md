# Diagnóstico — Vista "Nuevo registro" (wizard OCR): problema de densidad NO resuelto

> Handoff para el próximo dev. Estado: **el fix de densidad de esta sesión NO resolvió
> el problema percibido en el live preview**. Aquí está todo lo verificado, lo aplicado
> y las hipótesis que quedan por descartar.

## 1. Contexto

- **Vista:** `averyn-frontend/dashboard/documents/pre-registro.html` — wizard de 5 pasos
  (Consentimiento > Pre-Registro > Captura de rostro > Huella > Verificación).
- **Rama:** `fix/navbar-dock-flotante-glassmorphism-v2`.
- **Síntoma reportado:** elementos "inflados" para el espacio disponible, desbordes y
  scroll vertical excesivo en pantallas grandes.
- **Stack real:** HTML estático + CSS vanilla + Bootstrap 5.3.3 (CDN). **No hay React ni
  Tailwind** (los viejos prompts los mencionaban por error); el "layout raíz" es
  `dashboard-shell.css/js` + `.av-page` + `.av-navbar`.

## 2. Verificación clave (hecha, con números)

**El wizard NO usa una escala distinta a la de Identidad.** Ambos módulos enlazan el
mismo `design-system.css` y reutilizan los mismos componentes. Comparación real:

| Componente | Token / valor (design-system.css) | Wizard | Identidad |
|---|---|---|---|
| Input `.av-input` (L245) | `height: 44px` / `padding: 0 12px` | igual | igual |
| Botón `.av-btn` (L183) | `height: 44px` / `padding: 0 16px` | igual | igual |
| Label `.av-label` | `font-size: 0.875rem` | igual | igual |
| Card `.av-card` (L269) | `padding: 24px` | igual | igual |
| Contenedor `.av-page` (L685–687) | `max-width: 1200px` centrado | igual | igual |

**Conclusión:** el contenedor ya está limitado a 1200px (no crece al 100% del viewport)
y los inputs/botones ya están en el mismo tamaño que el resto del sistema. **"Reducir la
densidad" no se puede lograr tocando solo esta vista**: cualquier reducción real
(inputs 44→40px, cards 24→16px) es un cambio de **tokens globales** que afecta a todo el
sistema y debe decidirlo el equipo (o gestarse como variante compacta, ej.
`.av-card--compact`).

## 3. Cambios YA aplicados en este branch (no rehacer)

1. **Navbar fijo + altura dinámica** — `dashboard-shell.css` (L9–14: `--navbar-height: 72px`
   fallback; L203–208: `.av-main-content { padding-top: calc(var(--navbar-height) + 16px) }`)
   y `dashboard-shell.js` (`inicializarAlturaNavbar()` con `ResizeObserver`).
2. **Design system** — `design-system.css` (L127 `--av-ratio-doc: 16/10`; chips de estado
   700/50/200, metadatos neutrales, paleta de avatares, componente `.av-card__section-title`
   L969, wizard/stepper/banner/seg/input-ocr/capture/techbar). Guía vigente: `docs/averyn-design-system-horizonte.md` (la guía anterior se retiró).
3. **Densidad del wizard** (lo que "debería" haber arreglado la escala):
   - `.av-wizard` (L1014): sidebar `240px → 220px`, gap `24px → 16px`.
   - `.av-capture__stage` (L1105–1108): `min-height: 220px` → `aspect-ratio: 16/10` +
     `max-height: 360px`; borde `2px → 1px` dashed.
   - `.av-seg__btn` (L1068): `padding: 6px 14px → 6px 12px` (14px estaba fuera de escala).
   - `<h3>` de sección: inline `font-size: 1rem` → clase `.av-card__section-title`.
4. **Módulos pulidos** — Identidad (`dashboard/identity/index.html`, `detalle.html`,
   `assets/js/dashboard-identity.js`) y Documentos (`dashboard/documents/index.html`,
   `pre-registro.html`, `assets/js/dashboard-documents.js`). Solo presentación; la lógica de
   negocio y el flujo del wizard quedaron intactos.

## 4. Hipótesis por descartar (siguiente paso del dev)

1. **Cache del navegador.** El live preview puede estar sirviendo `design-system.css`
   viejo. Hacer *hard reload* (Ctrl+Shift+R) y confirmar que existe `--av-ratio-doc` (L127).
2. **El scroll vertical es estructural, no de escala.** La vista junta stepper (5 pasos) +
   panel de captura + formulario OCR (9 campos) en 1200px de ancho. Ningún ajuste "local" lo
   va a eliminar; las opciones reales son decisiones de sistema:
   - variante compacta `.av-input--sm` / `.av-btn--sm` (40px) solo en wizards;
   - `.av-card--compact` (padding 16px) para el panel OCR;
   - colapsar secciones o reducir el stepper a iconos.
3. **Aire lateral en >1200px.** En 1920px hay ~360px de aire a cada lado (por el
   `max-width`). Si el reporte es "se ve inflado", puede ser esto, no los componentes.
4. **Desborde horizontal puntual.** `.av-seg` con 4 opciones ("Pasaporte" es ancha) dentro
   de columnas ~430px; y `.av-form-grid` con labels largos ("Número de identificación").
   Verificar en ≤1280px y en mobile que no haya scroll-x (`.av-seg` no tiene `flex-wrap`).
5. **`aspect-ratio` en columnas estrechas.** `16/10` en un panel <576px deja el stage
   <220px de alto; si queda visualmente chico, agregar `min-height: 200px` junto al ratio.
6. **Sticky del stepper.** `.av-wizard__side { top: calc(var(--navbar-height) + 16px) }`
   depende de `--navbar-height`; con JS deshabilitado el fallback (72px) puede dejar el
   stepper pegado/encimado al hacer scroll.
7. **Reunir el síntoma exacto del usuario:** ¿elementos grandes, scroll excesivo, desborde
   horizontal, o aire a los lados? Cada uno tiene un fix distinto (ver puntos 2–3).

## 5. Checklist QA (al validar el fix)

| Ancho | Qué verificar |
|---|---|
| 1920px | Layout centrado (1200px), sin desborde; aire lateral intencional |
| 1440px | 2 columnas del panel derecho equilibradas |
| 1280px | Sidebar (220px) + grid sin colapso; `.av-seg` sin scroll-x |
| 1024px | Grid a 1 columna (captura arriba, formulario abajo); stage proporcional |
| ≤480px | Botones de captura en grid 3×, footer apilado, sin scroll horizontal |

## 6. Archivos clave

- `averyn-frontend/assets/css/design-system.css` (tokens y componentes — el estándar)
- `averyn-frontend/assets/css/dashboard-shell.css` + `assets/js/dashboard-shell.js` (layout)
- `averyn-frontend/dashboard/documents/pre-registro.html` (vista del problema)
- `docs/averyn-design-system-horizonte.md` (guía oficial del sistema visual; la anterior, `design-system.md`, se retiró)