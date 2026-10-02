---
name: Averyn
description: Plataforma institucional de identidad, biometría y procesos seguros; claridad que se oscurece en seguridad.
colors:
  signal-blue: "#145FEE"
  signal-blue-hover: "#0F4BC7"
  signal-blue-tint: "#EAF0FE"
  deep-navy: "#000C24"
  night-navy: "#071A36"
  horizon-navy: "#0A2A66"
  sky: "#DCECFF"
  cyan-trace: "#00ACD2"
  cyan-glow: "#55D6FF"
  paper-blue: "#F4F8FF"
  white: "#FFFFFF"
  hairline: "#DCE5F5"
  ink-muted: "#56637F"
  night-text: "#B9C9E4"
  success: "#12B76A"
  error: "#F04438"
typography:
  display:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.6rem)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  hairline: "4px"
  control: "8px"
  pill: "10px"
  frame: "24px"
  tile: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "64px"
  section: "clamp(5rem, 10vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  input-field:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.control}"
    padding: "11px 14px"
    height: "48px"
  nav-pill:
    backgroundColor: "{colors.signal-blue-tint}"
    textColor: "{colors.deep-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "11px 26px"
---

# Design System: Averyn

## Overview

**Creative North Star: "El horizonte que se oscurece"**

Averyn abre con un cielo claro y, a medida que se avanza, el fondo cae hacia un navy profundo: la claridad de la plataforma se convierte en seguridad. Sobre ese horizonte, un trazo fino de arcos (eco del arco de la A del logo) hace de firma. El sistema es sereno e institucional, con la precisión de un instrumento: línea de 1 px, texto mono para las acciones y un único azul de señal.

La densidad es baja y la composición **asimétrica**: titulares a un lado, contenido desplazado al otro, mucho aire. No hay tarjetas pesadas; las superficies son planas y se separan con líneas finas. El impacto se concentra en momentos concretos (el hero guiado por scroll, la figura de arcos), no en cada sección.

**Key Characteristics:**
- Fondo de cielo a navy como gesto central; el logo negro vive en la zona clara.
- Un solo azul de señal; el cian aparece como trazo o resalte, nunca como superficie grande.
- Acciones en JetBrains Mono mayúsculas; titulares en Space Grotesk 500 con tracking ajustado.
- Líneas de 1 px y espacio en blanco en lugar de cajas; sombra solo en el marco del login y en los botones.
- Espacios reservados (`.mn-media`) para imágenes y video futuros.

## Colors

Paleta de marca disciplinada: un azul de señal, tres navys por profundidad, un par de cianes y neutros azulados.

### Primary
- **Azul de señal** (#145FEE): botones primarios, enlaces, etiquetas de sección, bordes de énfasis, el CTA final a pantalla completa. Hover más oscuro (#0F4BC7).
- **Tinte de señal** (#EAF0FE): fondo de píldoras y chips del header, avatares, estados de foco suaves.

### Secondary
- **Traza cian** (#00ACD2): arcos y diagonal de las figuras, acentos en superficies oscuras. **Brillo cian** (#55D6FF): índices y hover sobre navy.

### Neutral
- **Navy profundo** (#000C24): texto principal, fondo del footer y del tramo final del hero.
- **Navy nocturno** (#071A36): sección oscura de Capacidades. **Navy de horizonte** (#0A2A66): tramo medio del degradado.
- **Cielo** (#DCECFF) y **papel azul** (#F4F8FF): inicio del hero, fondos alternos de sección.
- **Línea** (#DCE5F5): separadores y bordes de 1 px. **Tinta apagada** (#56637F): texto secundario. **Texto nocturno** (#B9C9E4): texto sobre navy.

### Named Rules
**The One Signal Rule.** El azul de señal es el único color que invita a actuar; ocupa botones, enlaces y un cierre a pantalla completa, y nada más. El cian nunca es superficie.
**The Horizon Rule.** El oscurecimiento va de arriba (claro) hacia abajo (navy), nunca al revés; el logo negro siempre se apoya en la zona clara.

## Typography

**Display Font:** Space Grotesk (con Inter y sistema de respaldo)
**Body Font:** Inter
**Label/Mono Font:** JetBrains Mono

**Character:** Una grotesca geométrica con carácter para titulares, un cuerpo neutro y legible, y un mono técnico que da tono de instrumento a las acciones y rótulos.

### Hierarchy
- **Display** (500, clamp(2rem, 4.2vw, 3.6rem), 1.06): titulares de sección; `text-wrap: balance`. En el cierre sube a clamp(2.4rem, 6vw, 5rem).
- **Headline** (500, 1.4–1.6rem, 1.2): títulos de fila, de solución y de integrante.
- **Body** (400, 1rem, 1.6): párrafos; el texto de apoyo usa 1.05rem en tinta apagada, máximo ~46 caracteres por línea.
- **Label** (500/700, 0.75rem, 0.06em, mayúsculas, mono): botones, navegación, rótulos de sección, notas al pie.

### Named Rules
**The Mono Action Rule.** Todo lo que se pulsa o rotula (botones, enlaces del menú, etiquetas) va en JetBrains Mono mayúsculas; el contenido que se lee va en Inter o Space Grotesk.

## Layout

Rejilla de 12 columnas, ancho máximo 1240 px, gutter `clamp(1.25rem, 4vw, 3rem)` y hueco de columna `clamp(1rem, 2.4vw, 2rem)`. Las secciones respiran con `clamp(5rem, 10vw, 9rem)` de relleno vertical. La composición es deliberadamente asimétrica: titulares en 5–7 columnas, contenido desplazado a las 4–7 restantes, listas escalonadas (cada ítem con un margen superior distinto) y paneles laterales fijos al hacer scroll. Bajo 1100 px el menú pasa a botón; bajo 900 px todo colapsa a una columna; bajo 560 px se simplifican las rejillas internas.

El hero es una escena fija (`position: sticky`, ~330 vh) guiada por tres fases de scroll: la A negra, la palabra completa que sale en horizontal, y la figura de arcos con la bajada.

## Elevation & Depth

Sistema plano: la profundidad se logra con tono (cielo → navy, papel azul) y líneas de 1 px, no con sombras difusas. Las sombras existen solo donde hay un objeto físico que flota.

### Shadow Vocabulary
- **Botón sólido** (`box-shadow: 0 3px 0 rgba(0, 12, 36, .3)`): aspecto de tecla; baja 2 px al pulsar.
- **Marco del login** (`box-shadow: 0 24px 60px rgba(0, 12, 36, .14)`): la única tarjeta que flota.
- **Popover** (`var(--av-shadow-md)`): el aviso del perfil del integrante.

### Named Rules
**The Flat-By-Default Rule.** Una superficie en reposo no tiene sombra. Solo la llevan los botones, el marco del login y los popovers.

## Shapes

Geometría contenida: 8 px en botones y campos, 10 px en píldoras del header, 24 px en el marco del login, 4 px en los espacios de media y círculos completos en avatares y chips del flujo. Los bordes son líneas de 1 px; los acentos de énfasis son líneas de 1 px en azul de señal. No hay franjas laterales gruesas de color. Las figuras (arcos concéntricos y una o dos diagonales) son trazos finos con extremos redondeados.

## Components

### Buttons
- **Shape:** esquinas contenidas (8 px), alto mínimo 44 px.
- **Primary:** azul de señal sólido, texto blanco en mono mayúsculas, relleno 11×20 px. En superficies azules se invierte a blanco con texto navy.
- **Hover / Focus:** el azul oscurece (#0F4BC7); al pulsar, `scale(.97)` inmediato. Foco con contorno azul de 2 px.
- **Ghost:** borde de 1 px `#CFDCF3` (blanco 45 % sobre navy), sin relleno.

### Navigation
- Píldora centrada en azul tenue translúcido con desenfoque, enlaces en mono pequeño en mayúsculas, hover a azul de señal. A la izquierda el wordmark aparece solo cuando el del hero ya se redujo; a la derecha un único botón "Ingresar". En móvil pasa a menú desplegable con `aria-expanded`.

### Inputs / Fields
- **Style:** fondo blanco, borde de 1 px `#CFDCF3`, radio 8 px, alto 48 px; el control de mostrar contraseña vive dentro del campo en mono.
- **Focus:** borde azul de señal y halo de 3 px al 15 %.
- **Error:** borde rojo y mensaje en una alerta con borde izquierdo de 3 px; el estado de carga bloquea el botón.

### Shell del dashboard (píldora)
- Dock en **píldora completa** (9999 px) en azul tenue translúcido con línea de 1 px, icono + etiqueta en Space Grotesk 600 y el ítem activo en píldora azul de señal. Logo, búsqueda, notificaciones y usuario son chips en píldora del mismo material. Bajo 1280 px solo el ítem activo conserva su etiqueta; los demás quedan en icono (con `title` y nombre accesible). Los módulos sin pantalla se atenúan y no enlazan.

### Mosaico de accesos
- Rejilla de 6 columnas con tarjetas asimétricas (radio 16 px): dos grandes (azul de señal y navy nocturno), tres medianas en azul tenue y las pendientes atenuadas con borde discontinuo y la etiqueta "Próximamente". Cada una lleva un icono que representa su función (tarjeta de identidad, huella, documento, lista de verificación, destellos de IA). Hover solo en dispositivos con hover: sube 4 px y la flecha avanza.

### Panel de actividad
- El único bloque oscuro de la pantalla (navy nocturno, radio 24 px): marca el cambio de información. Resume el log con tres barras (exitosas, rechazadas, reintentos) con su conteo en texto, y una línea de tiempo con puntos cian, rojo suave y ámbar.

### Filas y listas (componente firma)
- Listas hechas de líneas de 1 px con índice mono pequeño, título en Space Grotesk y descripción en tinta apagada; el hover solo cambia el color del título. Sirven para capacidades, soluciones y arquitectura.

### Espacio para media
- Marco con `aspect-ratio` configurable (`--ratio`), fondo papel azul, borde de 1 px y etiqueta mono "Imagen · 16:9". Al insertar un `<img>` o `<video>` rellena el marco con `object-fit: cover` y la etiqueta se oculta.

### Gráficos (v1.2, documentados en `docs/ds/graficos.html`)
- Tarjeta plana de 1 px (radio 16): etiqueta mono, cifra grande en Space Grotesk, chip de variación (flecha = dirección, color = bueno/malo, texto = cuánto) y pie "Datos de ejemplo". Estados: cargando (esqueleto), vacío y error.
- Paleta categórica validada con `validate_palette.js`, en orden fijo: `#145FEE`, `#C77500`, `#0092B5`, `#8A5CF6`, `#C2457A` (+ gris "Otros"); hasta 3 series sin ayudas, 4–5 solo con etiquetas directas. Secuencial azul de 6 pasos; divergente ámbar ↔ azul con gris neutro. Verde/ámbar/rojo de estado nunca son series.
- Barras "píldora suave" (24–32 px, degradado azul→casi blanco, máx. 12) como excepción de marca a la guía de 4 px; la variante recta se usa en series densas. Cuadrícula sólida de línea fina, sin doble eje, sin número en cada marca.
- Todo gráfico incluye tooltip, navegación con flechas, vista en tabla y descarga CSV; el contrato de datos es una propuesta, no un endpoint.

### Páginas de error (v1.2)
- 404, 403, 500, sin conexión y mantenimiento comparten `error.css`/`error.js`: horizonte cielo→navy, figura de arcos que se dibuja y se parte, número decorativo (`aria-hidden`), un solo `<h1>`, ruta pedida escapada y siempre una salida. Los módulos pendientes muestran "Próximamente", no un error.

### Patrones, componentes, plantillas y marca (v1.3, documentados en `docs/ds/`)
- **Patrones biométricos** (`patrones.html`): consentimiento antes de la captura; guía sin culpar y siempre con texto además de color; un resultado de verificación muestra similitud, umbral (0.68, dato del servidor) y decisión; el comprobante de voto nunca vincula persona y opción.
- **Componentes** (`componentes.html`): selector de fechas, menú ⋯, combobox, acordeón, stepper, popover, drawer (`<dialog>` modal), paleta Ctrl+K y tabla avanzada, con patrones de teclado WAI-ARIA y objetivos de 44 px.
- **Plantillas** (`plantillas.html`): navbar en píldora, ancho de 1200 px, un solo bloque navy por pantalla, tarjetas de 1 px y estados cargando/vacío/error resueltos.
- **Marca y entregables** (`marca.html`): una sola figura (arcos) cambia de estado; correos con tablas y estilos en línea; `print.css` para A4 con tinta mínima; `tokens.json` W3C generado desde `tokens.css`. Modo nocturno fuera de alcance.

### Estados y píldoras (v1.4)
- **Una sola semántica Estado → color**, en fondo claro y sobre navy: éxito/verificada = verde (`--av-success-text` / `--av-success-on-navy`), reintento = ámbar, rechazo/error = rojo, pendiente = gris neutro (`--av-neutral-*`), información = azul. **El cian es solo resalte**, nunca un estado.
- **Píldoras de estado** (`hz-chip`): cápsula sin punto, con icono opcional decorativo, en 3 variantes: **suave** (por defecto en tablas y listas), **contorno** (secundarios) y **sólida** (énfasis puntual). Texto ≥ 5:1 (tonos `--av-success-strong` y `--av-warning-strong` sobre el fondo suave). Una variante por tabla.
- **Alertas** (`hz-alert`): insignia circular con icono + título + descripción, fondo claro y borde de 1 px; sin franja lateral.
- **Panel de actividad**: franja, barras y lista salen de un mismo conjunto de eventos; la suma de las partes es el total. Un solo panel oscuro de contenido por pantalla (toasts, tooltips y scrim no cuentan).
- Series de resultado en gráficos usan `--viz-ok`, `--viz-retry` y `--viz-bad` (los mismos tonos, más oscuros, ≥ 3:1) con icono y palabra en la leyenda.

## Do's and Don'ts

### Do:
- **Do** mantener el logo negro sobre la zona clara del degradado (#DCECFF → #EAF0FE) y el blanco sobre navy.
- **Do** separar con líneas de 1 px y espacio en blanco antes que con tarjetas.
- **Do** usar JetBrains Mono mayúsculas para botones, rótulos y navegación.
- **Do** respetar `prefers-reduced-motion`: sin sticky ni dibujo de trazos, estado final directo.
- **Do** componer de forma asimétrica: titular y contenido en columnas desiguales.
- **Do** reservar el navy a un solo panel por pantalla para marcar un cambio de información.
- **Do** acompañar todo dato gráfico con su valor en texto; el color nunca es el único canal.

### Don't:
- **Don't** usar el cian como superficie grande ni el azul de señal como decoración.
- **Don't** añadir sombras difusas, glows de color ni franjas laterales gruesas en tarjetas.
- **Don't** volver al estilo brutalista (mayúsculas gigantes, sombras duras en todo): se probó y se descartó por perder identidad.
- **Don't** centrar y repetir tres tarjetas iguales como solución por defecto.
- **Don't** ampliar el wordmark por encima de su tamaño nativo (1144 px): se maqueta grande y solo se reduce, o se ve borroso.
