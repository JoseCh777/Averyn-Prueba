# Averyn — Guía de Diseño (Design System)

> **Estado: legado.** Esta guía describe la capa anterior (`.av-*`) que todavía usan los módulos que no han migrado.
> El sistema vigente es **Horizonte**: ver [`averyn-design-system-horizonte.md`](./averyn-design-system-horizonte.md).
> Se retira cuando el último módulo migre.

> Dirección visual del contenido de los módulos: **"registro civil digital"**.
> Autoridad (azul/marina), precisión (tipografía de datos) y el **sello de verificación**
> como motivo central. El navbar/dock flotante es el patrón de navegación único y **no se modifica**.

## 1. Stack (obligatorio)

- **HTML semántico** (no divitis: `header`, `main`, `nav`, `table`, `dl`, `label`, `ol`, etc.)
- **CSS vanilla** con tokens `:root` (prefijo `--av-*`) en `averyn-frontend/assets/css/design-system.css`
- **Bootstrap 5.3.3** (grid/utilitarios) + **Bootstrap Icons 1.11.3** (CDN)
- **Prohibido:** Tailwind, CSS-in-JS, frameworks JS de UI. No se duplica CSS entre módulos.

Fuente única de estilos: `assets/css/design-system.css`. El navbar se estila en `dashboard-shell.css`
y queda fuera del alcance de esta guía.

## 2. Tipografía

| Fuente | Rol | Carga |
|---|---|---|
| `Space Grotesk` (`--av-font-display`) | Títulos de página, cifras KPI, iniciales de avatar | Google Fonts 500/600/700 |
| `Inter` (`--av-font-body`) | Todo lo demás: tablas, botones, labels, inputs | Google Fonts 400/500/600/700 |

| Token | Valor | Uso |
|---|---|---|
| `--av-text-page-title` | 1.75rem / 700 / `-0.02em` | Título de página |
| `--av-text-kpi` | 1.875rem / 700 / `-0.02em` | Cifra KPI |
| `--av-text-body` | 1rem / 400 | Texto base |
| `--av-text-sm` | 0.875rem | Descripción, nota, fecha |
| `--av-text-xs` | 0.75rem / 600 | Encabezado de tabla, chips, labels |

Reglas: sin mayúsculas sostenidas (labels y estados van en "oración", ej. "En curso", no "EN CURSO"),
sin `em`/`—` decorativos, sin flecha `→` en texto (usar icono `bi-arrow-right`).

## 3. Color

### Marca y neutros (existentes, no reinventar)
`--av-blue #145FEE` · `--av-navy #000C24` · `--av-cyan #00ACD2` · escala gris `--av-gray-50…900`.

### Metadatos (afiliación / rol) — neutro único
El color semántico fuerte se reserva **solo para el estado**. Los metadatos son siempre neutros
gris-azul; la categoría se distingue por ícono + texto, no por color.

| Token | Valor | Contraste |
|---|---|---|
| `--av-meta-bg` | `#EEF1F6` | — |
| `--av-meta-text` | `#475569` | ≈ 7.3:1 (AAA) |
| `--av-meta-icon` | `#64748B` | — |

### Estados (chips — "sello editorial")
Tríada **fondo suave (50-series) / texto oscuro (700-series) / borde (200-series)**. Sin sombra.

| Estado | Texto | Fondo | Borde | Contraste |
|---|---|---|---|---|
| Éxito / Verificado / Procesado | `#047857` | `#ECFDF5` | `#A7F3D0` | ≈ 5.2:1 AA |
| Pendiente / Advertencia | `#B45309` | `#FFFBEB` | `#FDE68A` | ≈ 4.8:1 AA |
| En proceso / Info | `#0369A1` | `#F0F9FF` | `#BAE6FD` | ≈ 5.5:1 AA |
| Error | `#B91C1C` | `#FEF2F2` | `#FECACA` | ≈ 5.9:1 AA |
| Neutral | `#475569` | `#F1F5F9` | `#E2E8F0` | — |

### Paleta de avatares (asignada por persona, estable)
`blue #145FEE` · `violet #6C5CE7` · `teal #0E9384` · `amber #E67E22` · `rose #E4578A` · `slate #56637F`
(cada uno con su `-tint` para fondos suaves). El avatar es un **identificador**, no un metadato,
por lo que sí admite color.

## 4. Espaciado, radios y elevación

Base de 8px: `--av-space-1:4 · 2:8 · 3:12 · 4:16 · 6:24 · 8:32 · 12:48 · 16:64`.

| Superficie | Radio |
|---|---|
| Card / KPI | `--av-radius-lg` 16px |
| Controles (input, botón, select, seg) | `--av-radius-md` 10px |
| Badge / etiqueta / chip / icono documento | `--av-radius-sm` 6px |
| Avatar, chip "ready", dot | `--av-radius-full` |
| Tile de ícono del header | 14px |

Proporción del preview de documento: `--av-ratio-doc: 16 / 10` (usar en `.av-capture__stage`,
nunca altura fija en px).

### Escala de elevación (3 niveles, neutros — sin glows de color)

| Nivel | Token | Uso |
|---|---|---|
| L0 | `none` | inputs, botones, **badges, chips, tags**, tabla |
| L1 | `--av-shadow-sm` `0 1px 2px rgba(0,12,36,.06)` | cards, **KPI**, **icono del header** |
| L2 | `--av-shadow-md` `0 4px 12px rgba(0,12,36,.10)` | dropdowns, menús, hover-lift |
| L3 | `--av-shadow-lg` `0 12px 32px rgba(0,12,36,.16)` | modales, dock flotante, toasts |

### Jerarquía de z-index

| Capa | z-index | Componente |
|---|---|---|
| Contenido base | `auto` | `.av-main-content`, cards, tablas |
| Dock flotante / navbar | `100` | `.av-navbar` (fixed) |
| Dropdowns / menús | `120` | `.av-menu` |
| Modal / overlay | `1000` | `.av-modal-overlay`, `.av-modal-backdrop` |
| Toast | `1100` | `.av-toast-container` |

Regla: los overlays (modal/toast) siempre por encima del navbar; el navbar por encima del contenido.

## 5. Componentes reutilizables

Todos viven en `design-system.css`. No reescribir por módulo.

- **`<header class="av-page-header">`** — espina (`__spine`) + ícono contenedor (`__icon`, plano azul, radio 14, elevación L1) + título (`__title`) + descripción (`__desc`) + acciones (`__actions`). Encabezado único de TODO módulo.
- **`.av-kpi` (+ `.av-kpi--blue|success|warning|error|info`)** — cifra + label + nota, acento lateral, elevación L1. Dentro de `.av-kpi-grid`.
- **`.av-toolbar`** — barra de filtros con labels encima de cada campo (`__group`, `__spacer`, `.av-filter-label`).
- **`.av-search-field`** — buscador con ícono + atajo `Ctrl K` (`__kbd`).
- **`.av-chip` (+ variantes de estado)** — estado con ícono de trazo 14px, radio 6px, sin sombra.
- **`.av-tag`** — metadato (afiliación/rol) neutro con ícono.
- **`.av-avatar` (+ `.av-avatar--md|sm` y colores)** — iniciales sobre disco de color.
- **Tabla `.av-table`** — celda persona (`__person`, `__name`, `__sub`), celda documento (`__doc`, `__doc-icon`, `__doc-name`, `__doc-sub`), columna de acciones (`__actions`), fila activa (`tr.is-active`), fila clicable (`__row-clicable`).
- **`.av-card--flush` + `.av-table-wrap` + `.av-pagination`** — tarjeta que aloja tabla, scroll horizontal y paginación numerada.
- **`.av-dropzone`** — carga de documento con tile (`__tile`, `__title`, `__hint`).
- **`.av-detail`** — lista clave/valor para fichas de detalle.
- **`.av-modal-overlay` / `.av-modal`** — diálogo centrado.
- **`.av-wizard`** — layout multi-paso (`__side` sticky + `__body` + `__grid` 2 columnas + `__footer`).
- **`.av-stepper`** — stepper vertical (estándar para futuros wizards): `__step--done|current|locked`, `__marker`, `__title`, `__status`.
- **`.av-banner--success`** — banner de confirmación (`__icon`, `__text`, `__badge`).
- **`.av-seg`** — control segmentado tipo pill (`__btn`, `.is-active`).
- **`.av-input-wrap--ocr` (+ `__check`)** — **variante "OCR detectado"**: input con fondo verde suave y borde sutil, editable; al enfocar vuelve a fondo blanco. Se repite en todo formulario alimentado por OCR.
- **`.av-capture`** — panel de captura (`__stage`, `__media`, `__overlay`, `__ready`, `__preview`, `__actions`, `__note`, `__qr`).
- **`.av-progress`** — barra de progreso (`__fill`, variante `--on-dark`).
- **`.av-techbar`** — footer técnico de estado (`__item`, `__dot`).
- **`.av-form-grid`** — grid de formulario a 2 columnas (`--span` para ancho completo).
- **`.av-card__section-title`** — título de sección dentro de una card (1rem / 600). Reemplaza los `font-size` inline ad-hoc.

## 6. Estados de interacción

- **Botones:** primary `hover → --av-blue-hover`, `active → --av-blue-active`; secondary `hover → fondo --av-blue-tint`. `:disabled` gris.
- **Inputs/selects:** `:focus` borde `--av-blue` + anillo `0 0 0 3px --av-blue-tint`.
- **Filas de tabla:** `hover` fondo `--av-gray-50`; **activa** borde izquierdo `3px --av-blue` + fondo `--av-blue-tint`.
- **Foco visible:** nunca se elimina sin reemplazo (outline `2px --av-blue`, offset 2px).
- **`prefers-reduced-motion`:** respetar en cualquier animación.

## 7. Gobernanza

1. Cualquier color/radio/espaciado/sombra nuevo va como token en `:root`, nunca hardcodeado.
2. Un solo `av-btn-primary` por pantalla; el resto son `secondary`/`ghost`.
3. **Jerarquía de color:** el color semántico fuerte es solo para estados. Metadatos = neutro.
4. **Elevación:** solo L1/L2/L3. Nada de "glows" de color decorativos.
5. Los componentes de esta guía se reutilizan en Biometría, OCR, IA, Electoral, Accesos y Administración **sin duplicar CSS**.
6. Cambios que mezclen lógica y presentación se señalan y se confirman antes de tocar.

## 8. Extensión Dashboard (pantalla principal)

Componentes y tokens propios del Dashboard (`dashboard/index.html` + `assets/js/dashboard.js`).
Todos viven en `design-system.css` § 8; el JS solo renderiza y reutiliza.

### 8.1 Tokens nuevos (`:root` en `design-system.css`)

| Token | Valor | Uso |
|---|---|---|
| `--av-indigo` / `--av-indigo-tint` | `#4F46E5` / `#EEF0FE` | Categoría de módulo **Accesos** (KPI, tile, evento). Única adición cromática del Dashboard; el resto reutiliza la paleta existente. |
| `--av-cyan-tint` | `#DFF4FA` | Tint suave del celeste de marca (`--av-cyan #00ACD2`): dispositivos biométricos. |
| `--av-text-welcome` | `clamp(1.75rem, 1.15rem + 1.5vw, 2.375rem)` | Título de bienvenida del Dashboard. |

El morado **no es token nuevo**: `--av-avatar-violet #6C5CE7` (+ `--av-avatar-violet-tint`) ya existía en la paleta de avatares (ver § 3) y se reutiliza tal cual. El verde/ámbar/rojo de variación reutilizan los chips de estado (texto 700-series).

### 8.2 Paleta de categorías de módulo (tabla única de referencia)

| Categoría | Tono | Tokens |
|---|---|---|
| Identidad / Personas | azul | `--av-blue` / `--av-blue-tint` |
| Usuarios / cuentas | verde éxito | `--av-success` / `--av-success-bg` |
| Procesos electorales | morado | `--av-avatar-violet` / `--av-avatar-violet-tint` |
| Dispositivos biométricos | celeste | `--av-cyan` / `--av-cyan-tint` |
| Accesos | índigo | `--av-indigo` / `--av-indigo-tint` |
| OCR / documentos | teal | `--av-avatar-teal` / `--av-avatar-teal-tint` |
| Reportes / auditoría | slate neutro | `--av-gray-500` / `--av-gray-100` |

Los colores de categoría **se usan solo en contenedores de tinte suave** (`.av-tint-circle`) y acentos; los estados siguen usando los chips de § 3.

### 8.3 Componentes nuevos

- **`.av-dash-grid` (+ `--welcome | --bottom`)** — filas del dashboard: welcome = `1fr + 320px`, bottom = `1fr + 380px`; separación vertical de `--av-space-6` entre filas; colapsan a una columna ≤ 1023px.
- **`.av-welcome`** — bloque de bienvenida: `__eyebrow` (kicker en mayúsculas con tracking — única excepción al sentence-case de § 2, es decorativo y no un estado/label), `__title` y `__desc` (max-width 500px).
- **`.av-brand-strip`** — franja de marca: card con tinte azul (`--av-blue-tint`) y el logo (lockup) centrado. Reemplaza al banner de gradiente en la fila superior para no sobrecargarla ni competir con los KPIs.
- **`.av-tint-circle` (+ tonos y `--sm`)** — círculo de tinte suave reutilizable en KPI, tiles de acceso y feed. Reemplaza al patrón ad-hoc de "icono en contenedor circular".
- **`.av-kpi` (KpiCard) ampliado** — nuevas variantes `--violet` / `--indigo` (acento lateral), bloque `__icon` (círculo de tinte), `__delta` (`--up/--down/--flat`) y `hover → shadow-md` (elevación L1→L2, "hover-lift" de § 4). Compatible con los KPIs de Identidad/OCR existentes.
  - **Estándar de spacing del KpiCard** (aplica a todos los módulos): `padding: var(--av-space-6)` (**24px** en los 4 lados, misma retícula que `.av-card`); separación ícono → bloque de texto `var(--av-space-4)` (**16px**, `.av-kpi__icon`); altura homogénea entre las cards de una misma fila vía `.av-kpi-grid { align-items: stretch }` (así textos de distinta longitud, ej. "Procesos electorales activos" vs. "Personas registradas", no rompen la alineación).
- **Gráficos — retirados por decisión de producto.** El Dashboard prioriza datos simples y trazables sobre visualizaciones complejas: se retiraron el gráfico de línea y el donut porque no tenían una fuente de datos real detrás. Cada elemento del panel debe poder explicarse (conteos y un log de acciones). No hay librería de charts instalada: el stack es solo Bootstrap + Bootstrap Icons por CDN.
- **`.av-quick` + `.av-quick-grid`** — tiles de acceso rápido: `grid-cols 2 / 3 / 4` (576px / 1024px), ícono en `.av-tint-circle`, título, descripción y flecha `bi-arrow-right` que se desplaza `translateX(4px)` en hover/focus (`prefers-reduced-motion` respeta la regla general).
- **`.av-feed`** — lista de actividad reciente: ícono circular por tipo de evento, título, descripción y meta `"hace Xh · sede"`. Colores por tipo (§ 8.2): usuario=verde, biometría=azul, electoral=morado, acceso=índigo, dispositivo=celeste.
- **`.av-link`** — enlace inline con flecha `bi-arrow-right` (la flecha `→` de texto sigue prohibida, § 2).

### 8.4 Extensiones del navbar / shell

Ninguna. El dock, el header y el fix de overlap por scroll (`--navbar-height` + `ResizeObserver` en `dashboard-shell.js`) quedan intactos y se prueban en el Dashboard igual que en Identidad/OCR.
