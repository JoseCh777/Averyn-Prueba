# Averyn Design Lab — Informe de sistemas de diseño

**Fecha:** 1 de octubre de 2026
**Alcance:** 6 sistemas de diseño completos para el frontend de Averyn, comparados y verificados en `design-lab/`
**Estado de la implementación existente:** intacta (`averyn-frontend/` no fue modificado; HEAD en `44be285`)

---

## 1. Resumen ejecutivo

Se construyeron **seis sistemas de diseño completos y ejecutables** para Averyn. No son seis paletas de color: cada dirección redefine **composición, grid, jerarquía, tipografía, densidad, componentes, navegación, espaciado, motion y responsive**, manteniendo la identidad de marca, el contenido, las funcionalidades, la arquitectura y la accesibilidad del producto real.

Cada variante incluye **tres páginas funcionales con datos reales del mock del producto**:

| Página | Contenido |
|---|---|
| `index.html` | Landing pública: hero, capacidades, módulos, demostración de estados, CTA, pie |
| `dashboard.html` | Panel autenticado: KPIs calculados, tabla de eventos biométricos filtrable, procesos, estados de sistema, estado vacío, botón con estado de carga |
| `login.html` | Acceso con validación, alerta de error (`role="alert"`), botón de carga y sesión real en `localStorage` |

**Recomendación técnica:** dirección **01 — Minimal / Swiss** como sistema base (justificación en §8).

---

## 2. Restricciones aplicadas a las seis

- Responsive **320 / 375 / 768 / 1024 / 1440 px** sin scroll horizontal.
- Accesibilidad **WCAG 2.1 AA**: contraste ≥ 4.5:1, un solo `h1` por página, campos etiquetados, `aria-*` en menús/errores/estados, skip link, focus visible, operación por teclado.
- **Estados completos** en componentes: hover, active, focus-visible, disabled, error, loading.
- **Motion con propósito:** micro 100–150 ms · normal 150–250 ms · compleja 250–400 ms; todo desactivado con `prefers-reduced-motion`.
- Sin glassmorphism, sin abuso de gradientes/sombras/radios/tarjetas.
- Sin mockups: producto real, ejecutable abriendo el HTML (sin build).
- Cada variante **independiente**: no importa CSS/JS de otra variante ni del producto existente.

---

## 3. Metodología

1. **Auditoría** del frontend actual (15 HTML, CSS por capas `tokens → base → components → modules → dashboard`, 18 JS, datos mock en `localStorage`).
2. **Arquitectura documentada:** capas de estilos, shells de navegación (landing nav / dock del panel), flujos (landing → login → panel → identidad/biometría/documentos/electoral) y fuentes de datos.
3. **Tokens base compartidos** (`design-lab/shared/tokens.css`): neutros, semánticos, escala tipográfica, espaciado base 4px, radios, sombras, motion, z-index, reset y `prefers-reduced-motion`.
4. **Lógica compartida** (`design-lab/shared/app.js`): API `window.AVERYN` con catálogo de personas, eventos biométricos, dispositivos, procesos electorales, sesión y formateo — misma semántica de datos que el producto.
5. **Componentes base** con estados → **6 sistemas** que los reinterpretan por completo.
6. **`design-lab/index.html`** como laboratorio comparativo.
7. **Verificación automatizada** (§7) y correcciones.

---

## 4. Los seis sistemas

### 01 — Minimal / Swiss
- **Filosofía:** la estructura es la decoración. Retícula visible, filetes de 1px y jerarquía por escala/tipo, no por color.
- **Composición:** 12 columnas, gutter 24px, secciones a ancho completo separadas por reglas fuertes; la app usa dock lateral de 240px con indicador de acento.
- **Tipografía:** Space Grotesk (display, clamp hasta 7rem) + Inter; etiquetas en mayúsculas con tracking 0.14em; mono para índices (`01`, `02`).
- **Color:** negro/blanco con un solo acento `#0066CC`.
- **Detalles:** radios 0–4px, sin sombras, botones con borde que invierten al hover, tablas con cabecera en mayúsculas.
- **Motion:** 100–150 ms, casi sin transformaciones.

### 02 — Brutalist Digital
- **Filosofía:** la interfaz como objeto físico; nada esconde su construcción.
- **Composición:** grid asimétrico de 8 columnas, bloques desfasados, reglas gruesas de 3–6px.
- **Tipografía:** display monumental en mayúsculas (hasta 10rem), cuerpo 1.125rem.
- **Color:** blanco/negro + `#FF3300` y amarillo `#FFFF00` como resaltador.
- **Detalles:** radio 0, sombras duras desplazadas (`8px 8px 0 #000`), botones que **se hunden** al pulsar (translate = offset de la sombra), nav superior numerada + tira de estado tipo ticker.
- **Motion:** 50–100 ms, snaps.

### 03 — Editorial / Magazine
- **Filosofía:** leer es la acción principal; el producto se cuenta como una crónica.
- **Composición:** masthead con línea de fecha y número de edición + cuerpo a múltiples columnas (`columns` CSS), crónica principal y sidebar "En breve".
- **Tipografía:** Fraunces (serif) en titulares con interlínea 0.95, capitulares, cursivas de énfasis, versalitas para secciones; Inter en UI.
- **Color:** papel `#F6F3EC`, tinta `#1A1614`, ladrillo `#C1341F`.
- **Detalles:** filetes simples y dobles, bylines, pies de foto, pull-quotes; alertas como "avisos editoriales".
- **Motion:** 150–400 ms, reveals suaves.

### 04 — Bento / Modular
- **Filosofía:** cada capacidad es un módulo visible; el panel es un mosaico comprensible de un vistazo.
- **Composición:** CSS Grid de 12 columnas con tiles de distinto span (2×1, 1×2, 2×2), gap 16px.
- **Tipografía:** Space Grotesk + Inter, jerarquía compacta dentro de tiles.
- **Color:** neutros fríos + color **por módulo** (azul identidad, verde biometría, violeta documentos, ámbar electoral, rosa IA) en tintes planos.
- **Detalles:** radios 16px, elevación por capas, hover con elevación de 2px; nav flotante en píldora con buscador central (sin dock).
- **Motion:** 100–300 ms.

### 05 — Premium Tech
- **Filosofía:** confianza institucional con respiración; el espacio en negro es parte del diseño.
- **Composición:** columna de contenido estrecha (720px) sobre lienzo oscuro, bandas alternadas, riel de iconos + barra de comandos en la app.
- **Tipografía:** Space Grotesk con tracking negativo, micro-etiquetas amplias, cifras grandes.
- **Color:** `#020617` / `#0F172A` + cian `#22D3EE`; hairlines `#1E293B`.
- **Detalles:** radios amplios, glow cian solo en hover de tarjeta primaria, **una** frontera animada en hero/CTA; nav en píldora flotante sólida (sin `backdrop-filter`).
- **Motion:** 150–400 ms.

### 06 — Developer Tool
- **Filosofía:** el panel es una herramienta operativa; densidad y trazabilidad sobre todo.
- **Composición:** shell de IDE — árbol lateral (`~/identidad`, `~/biometria`…), pestañas de editor, área principal y barra de estado inferior.
- **Tipografía:** JetBrains Mono en todo, 13px de consola, interlínea fija.
- **Color:** GitHub-dark `#0D1117` con acentos de resaltado de sintaxis (azul/verde/ámbar/rojo).
- **Detalles:** radio 0, sin sombras, medidores ASCII (`[██████░░░░] 62 %`), login enmarcado como sesión de terminal (sigue siendo un formulario accesible real).
- **Motion:** 0–150 ms, cursor parpadeante con `steps()`.

---

## 5. Tabla comparativa

| Sistema | Composición / grid | Tipografía | Navegación | Densidad | Motion |
|---|---|---|---|---|---|
| 01 Minimal | 12 col, filetes 1px, secciones con regla fuerte | Space Grotesk + Inter, escala clamp amplia | Top bar + dock lateral en app | Media, aire horizontal | 100–150 ms |
| 02 Brutalist | 8 col asimétrico, bloques desfasados, reglas 3–6px | Monumental mayúsculas, cuerpo 1.125rem | Barra numerada + ticker | Alta, bloques justapuestos | 50–100 ms, snap |
| 03 Editorial | Masthead + columnas CSS + sidebar | Fraunces serif + Inter, capitulares | Masthead + filetes de sección | Media-alta en texto | 150–400 ms, reveal |
| 04 Bento | Grid de tiles con spans, gap 16px | Space Grotesk + Inter compacta | Nav píldora flotante | Media, tiles densos | 100–300 ms, elevación |
| 05 Premium | Columna 720px sobre lienzo oscuro | Space Grotesk tracking negativo | Nav píldora + riel de iconos | Baja, mucho negro | 150–400 ms, glow |
| 06 Devtool | Shell IDE: árbol + pestañas + status bar | JetBrains Mono en todo | Árbol + pestañas + status bar | Muy alta, base 4px | 0–150 ms, caret |

---

## 6. Qué NO cambia en ninguna variante

- Marca **Averyn** y copy en español.
- Módulos: identidad, biometría (enrolamiento/captura/verificación/historial), documentos con OCR, procesos electorales, IA, accesos/administración.
- Arquitectura: HTML/CSS/JS estático, datos por `localStorage`, misma API de datos (`shared/app.js` replica la semántica de `averyn-frontend/assets/js/common/`).
- Accesibilidad y responsive como restricción dura, no como opcional.

---

## 7. Verificación

Chequeos automatizados (Node, scripts en el entorno temporal del agente, no en el repo):

| Chequeo | Qué valida | Resultado |
|---|---|---|
| `node --check` | Sintaxis de `shared/app.js` | OK |
| Enlaces internos | Todo `href`/`src` local resuelve a un archivo existente (19 páginas) | OK |
| IDs duplicados / balance de tags | Estructura HTML de las 19 páginas | OK |
| Semántica de página | 1 `h1`, `lang="es"`, viewport en todas | OK |
| Cobertura de clases | Toda clase usada en HTML existe en el CSS de su variante (ganchos JS tipo `js-*`/`menu-icon` excluidos) | OK |
| Balance CSS | Llaves y paréntesis en `tokens.css`/`components.css` de las 6 | OK |
| Tokens | Ninguna `var(--…)` sin declarar; `--chars/--dur/--delay` declarados inline con fallback | OK |
| Contraste de texto (1.4.3) | Pares texto/superficie/fondo de los tokens + usos reales de acento | ≥ 4.5:1 en los 6 sistemas (los acentos se usan como relleno con texto oscuro o sobre fondos oscuros: 5.7:1–10.6:1) |
| Contraste no textual (1.4.11) | Bordes de campos/botones e indicadores de foco | ≥ 3:1 — **corregido en el pase final:** bordes de `.input/.search/.btn` en 01/04/05/06 y anillos de foco de 04 (`#0EA5E9` 2.65:1 → `#0284C7` 4.09:1) |
| A11y estática | Labels en todo campo, botones con nombre, `alt`, `aria-controls`/`labelledby`/`for` existentes, sin `tabindex` positivo | OK |
| Dependencias | Cero referencias a Bootstrap/CDN de iconos; sin `backdrop-filter` | OK |
| Repo | `git status`: solo `design-lab/` (y prototipos previos); `averyn-frontend/` sin cambios | OK |

**Responsive y teclado:** cada variante fue diseñada con quiebres explícitos en 320/375/768/1024/1440 (nav colapsable con `aria-expanded`, tablas en contenedor con scroll propio, grids que pasan a 1 columna) y revisada en código para focus-visible, skip link y operación por teclado.

---

## 8. Recomendación técnica

### Sistema base recomendado: **01 — Minimal / Swiss**

Criterios de decisión:

| Criterio | 01 Minimal | 02 Brutalist | 03 Editorial | 04 Bento | 05 Premium | 06 Devtool |
|---|---|---|---|---|---|---|
| Confianza institucional | **Alta** | Baja | Alta | Alta | Alta | Media |
| Escalabilidad a React (fase 2) | **Alta** | Media | Media | Alta | Media | Media |
| Accesibilidad / contraste | **AAA fácil** | Riesgo con acento | Buena | Requiere cuidado | Buena | Buena |
| Mantenimiento con el equipo actual | **Bajo** | Bajo | Alto (tipografía editorial) | Medio | Alto (tema oscuro) | Medio |
| Densidad para módulos operativos | **Buena** | Ruidosa | Pesada en tablas | Buena | Escasa | **Excelente** |
| Velocidad de iteración | **Alta** | Media | Baja | Alta | Media | Media |

**Por qué 01:**
1. **Jerarquía sin ruido:** el producto es de datos críticos (identidad, biometría, procesos electorales); la interfaz debe priorizar lectura y trazabilidad, y la Swiss maximiza señal por unidad de espacio.
2. **Accesibilidad por diseño:** contraste alto estructural (negro sobre blanco = 21:1), foco visible nativo y tipografía con escala predecible; es la dirección con menos trabajo correctivo.
3. **Migración limpia a React (fase 2 del README):** sus componentes son previsibles (`btn`, `card`, `table`, `dock`) y viven sobre tokens planos; el mapeo a componentes React es directo.
4. **Riesgo de marca mínimo:** mantiene el azul institucional `#145FEE`/`#0066CC` y el lenguaje tipográfico ya instalado (Space Grotesk + Inter).

### Cómo complementarla (sin cambiar de sistema)

- **Panel denso →** adoptar la **densidad de 06** en las tablas del módulo de identidad/historial (mono para IDs y timestamps, filas de 4px base).
- **Landing →** usar el **mosaico de 04** para la sección de módulos (tiles de color por capacidad) sobre la retícula Swiss.
- **Estados de sistema →** los medidores y badges de 06 como componente de "salud de servicios" en el panel.
- **Evitar:** 02 (ruido vs. confianza institucional) y 05 como sistema único (el tema oscuro complica impresión/exportación y soporte a usuarios con baja visión); ambos son válidos como **modos** futuros, no como base.

---

## 9. Entregados

```
design-lab/
├── index.html              ← laboratorio comparativo (filosofía, color, tipografía, comparativa, criterios)
├── shared/
│   ├── tokens.css          ← tokens base + reset + reduced-motion
│   └── app.js              ← API de datos compartida (window.AVERYN)
├── 01-minimal/             tokens · components · index · dashboard · login
├── 02-brutalist/           tokens · components · index · dashboard · login
├── 03-editorial/           tokens · components · index · dashboard · login
├── 04-bento/               tokens · components · index · dashboard · login
├── 05-premium/             tokens · components · index · dashboard · login
└── 06-devtool/             tokens · components · index · dashboard · login
```

**Cómo verlo:** abrir `design-lab/index.html` en el navegador y navegar a cada sistema (o abrir directamente `design-lab/<variante>/index.html`). Credenciales de demo en todos los login: `admin@averyn.test` / `Averyn2026`.
