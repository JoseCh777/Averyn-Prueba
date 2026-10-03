# Averyn — Design System "Horizonte" · Documento maestro

> **Versión 1.7 · octubre 2026.** Este archivo reúne, en un solo lugar, todo lo que hay que saber del sistema de diseño de Averyn: qué es, dónde vive, cómo se usa, qué contiene, cómo se valida, qué librerías necesita y qué queda pendiente.
> El catálogo visual y navegable está en [`averyn-design-system-horizonte.html`](./averyn-design-system-horizonte.html) (un solo archivo, se abre con doble clic). Este `.md` es la referencia escrita para los repositorios.

## Índice

1. [Qué es y principios](#1-qué-es-y-principios)
2. [Dónde vive cada cosa](#2-dónde-vive-cada-cosa)
3. [Cómo usarlo](#3-cómo-usarlo)
4. [Fundamentos](#4-fundamentos)
5. [Estados y color semántico](#5-estados-y-color-semántico)
6. [Componentes](#6-componentes)
7. [Gráficos](#7-gráficos)
8. [Patrones biométricos y electorales](#8-patrones-biométricos-y-electorales)
9. [Plantillas y estados de interfaz](#9-plantillas-y-estados-de-interfaz)
10. [Marca y entregables](#10-marca-y-entregables)
11. [Calidad: accesibilidad, microcopy y validación](#11-calidad-accesibilidad-microcopy-y-validación)
12. [Gobernanza y versionado](#12-gobernanza-y-versionado)
13. [Dependencias y librerías](#13-dependencias-y-librerías)
14. [Migración a React (recomendación)](#14-migración-a-react-recomendación)
15. [Deuda conocida y pospuesto](#15-deuda-conocida-y-pospuesto)
16. [Documentos relacionados](#16-documentos-relacionados)

---

## 1. Qué es y principios

**Horizonte** es el sistema de diseño de Averyn, la plataforma institucional de identidad, biometría, documentos y procesos. Su idea central —*"el horizonte que se oscurece"*— es un fondo que parte de un cielo claro y cae hacia un navy profundo: la claridad de la plataforma se convierte en seguridad. Sobre ese horizonte, un trazo fino de arcos (eco del arco de la A del logo) hace de firma.

El tono es sereno e institucional, con la precisión de un instrumento: líneas de 1 px, texto mono para las acciones y **un solo azul de señal**.

| Principio | Qué significa |
|---|---|
| **Una sola señal** | El azul `#145FEE` es el único color que invita a actuar (botones, enlaces, cierre). El cian es trazo o resalte, nunca superficie grande ni estado. |
| **Plano por defecto** | La profundidad la da el tono y las líneas de 1 px, no las sombras ni las tarjetas pesadas. Solo flotan los botones sólidos, el marco del login y los popovers. |
| **Mono en las acciones** | Todo lo que se pulsa o rotula va en JetBrains Mono, mayúsculas. Lo que se lee va en Inter o Space Grotesk. |
| **El horizonte oscurece hacia abajo** | Nunca al revés. El logo negro se apoya en la zona clara; el blanco, sobre navy. |
| **Un solo panel navy por pantalla** | Marca el cambio de información sin romper el ritmo. Toasts, tooltips y scrim no cuentan. |
| **El color nunca es el único canal** | Todo estado, dato o gráfico tiene además texto o icono. |
| **Honestidad de estado** | Lo que no existe se muestra como "Próximamente", no como un enlace roto. |
| **Movimiento con permiso** | Todo respeta `prefers-reduced-motion`; el contenido nunca depende de JavaScript para verse. |

---

## 2. Dónde vive cada cosa

```text
Averyn-Prueba/
├── DESIGN.md                      # Principios y reglas del sistema (formato para herramientas de diseño)
├── PRODUCT.md                     # Contexto del producto
├── averyn-frontend/
│   └── assets/css/
│       ├── tokens.css             # FUENTE DE VERDAD de los valores (--av-*)
│       └── design-system.css      # Estilos del frontend (capa anterior .av-*, ver sección 15)
└── docs/
    ├── averyn-design-system-horizonte.html   # TODO el sistema en un solo archivo para compartir
    ├── averyn-design-system-horizonte.md     # Este documento
    ├── design-system.html                    # Página "Inicio" de la documentación
    ├── design-system.md                      # Guía de la capa anterior (.av-*), conservada como legado
    └── ds/
        ├── *.html                 # Páginas generadas: fundamentos, componentes, graficos,
        │                          #   patrones, plantillas, marca, calidad
        ├── src/                   # FUENTES de las páginas y herramientas de construcción
        │   ├── *-body.html        #   contenido de cada página (aquí se edita)
        │   ├── build.py           #   arma las páginas y valida ids, enlaces y demos
        │   ├── bundle.py          #   genera el HTML único para compartir
        │   ├── emails.py          #   genera los correos transaccionales
        │   └── tokens_export.py   #   exporta tokens.css → tokens.json
        ├── *.css / *.js           # Estilos y demos de cada página
        ├── tokens.json            # Tokens en formato W3C (generado; no editar a mano)
        ├── emails/                # Correos transaccionales de ejemplo
        └── assets/                # Favicons e imagen social
```

**Fuentes de verdad, en orden:** (1) `tokens.css` (valores) · (2) `DESIGN.md` (principios y reglas) · (3) este documento y el catálogo HTML. **Si hay conflicto, gana el valor del token.**

---

## 3. Cómo usarlo

### Ver el sistema
- **Un solo archivo:** abrir `docs/averyn-design-system-horizonte.html` en el navegador. Funciona desde disco (`file://`); necesita internet solo para fuentes e iconos.
- **Por páginas:** servir el repositorio (`python -m http.server`) y abrir `docs/design-system.html`.

### Empezar una pantalla
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
<link href="../assets/css/design-system.css" rel="stylesheet">   <!-- incluye tokens.css -->
```

### Reconstruir la documentación
```bash
python docs/ds/src/build.py     # genera las 8 páginas y VALIDA ids únicos, enlaces, anclas y demos
python docs/ds/src/bundle.py    # regenera el HTML único (docs/averyn-design-system-horizonte.html)
```
`build.py` termina con error si hay un id repetido, un enlace roto o una demo cuyo script no se carga.

### Estructura de la documentación (8 páginas, 4 grupos)

| Grupo | Página | Para qué |
|---|---|---|
| Empezar | **Inicio** | Qué es, mapa, por dónde empezar, novedades, cómo compartir |
| Sistema | **Fundamentos** | Principios, color, tipografía, espacio, iconos y tokens |
| Sistema | **Componentes** | Las piezas reutilizables, agrupadas por familia |
| Sistema | **Gráficos** | Cómo mostrar datos |
| Aplicación | **Patrones** | Soluciones a problemas de producto (biometría, electoral) |
| Aplicación | **Plantillas y estados** | Pantallas completas, estados y páginas de error |
| Marca y calidad | **Marca y entregables** | Ilustración, favicons, correos, impresión |
| Marca y calidad | **Calidad y gobernanza** | Microcopy, accesibilidad, validación, versionado |

---

## 4. Fundamentos

### Color
| Token | Valor | Uso |
|---|---|---|
| Azul de señal `--av-blue` | `#145FEE` (hover `#0F4BC7`) | Botones primarios, enlaces, etiquetas de sección, énfasis |
| Tinte de señal | `#EAF0FE` | Píldoras, avatares, foco suave |
| Navy profundo `--av-navy` | `#000C24` | Texto principal, footer, tramo final del hero |
| Navy nocturno / de horizonte | `#071A36` / `#0A2A66` | Panel oscuro / tramo medio del degradado |
| Cielo / papel azul | `#DCECFF` / `#F4F8FF` | Inicio del hero y fondos alternos |
| Traza cian / brillo cian | `#00ACD2` / `#55D6FF` | Arcos y resaltes; sobre navy |
| Línea | `#DCE5F5` | Separadores y bordes de 1 px |
| Tinta apagada / texto nocturno | `#56637F` / `#B9C9E4` | Texto secundario / texto sobre navy |
| Éxito / error | `#12B76A` / `#F04438` | Base de los estados (ver sección 5) |

Reglas: *The One Signal Rule* (el azul es el único color que invita a actuar) y *The Horizon Rule* (el oscurecimiento va de arriba abajo).

### Tipografía
| Rol | Fuente | Detalle |
|---|---|---|
| Display / titulares | **Space Grotesk** 500–700 | `clamp(2rem, 4.2vw, 3.6rem)`, interlineado 1.06, tracking −0.025em |
| Cuerpo | **Inter** 400–700 | 1 rem, interlineado 1.6 |
| Acciones, rótulos, datos | **JetBrains Mono** 500/700 | 0.75 rem, mayúsculas, tracking 0.06em |

*The Mono Action Rule:* lo que se pulsa o rotula va en mono mayúsculas.

### Espacio, forma y movimiento
- **Rejilla:** 12 columnas, ancho máximo 1240 px; el gutter y los huecos usan `clamp()`. Las secciones respiran con `clamp(5rem, 10vw, 9rem)`. Composición **asimétrica**.
- **Espaciado:** 8, 16, 32, 64 px (y `--av-space-*` de 4 a 64 en `tokens.css`).
- **Radios:** 4 px (media), 8 px (botones y campos), 10 px (píldoras de navegación), 16 px (tarjetas), 24 px (marco), círculo completo.
- **Elevación:** plana. Botón sólido `0 3px 0` (aspecto de tecla), marco del login y popover.
- **Movimiento:** curva `out` y transiciones rápidas; nada anima si `prefers-reduced-motion` está activo.
- **Breakpoints:** menú a botón bajo 1100 px; una columna bajo 900 px; rejillas internas simples bajo 560 px. Se verifica a 1440, 820 y 390 px.

### Iconografía
**Bootstrap Icons 1.11.3** (`bi bi-*`). Los iconos decorativos llevan `aria-hidden="true"`; los que van solos, `aria-label`.

### Tokens y exportación
`tokens.css` es la fuente. `docs/ds/tokens.json` (formato W3C) se **genera** con `tokens_export.py` y trae: `color`, `fontFamily`, `fontSize`, `space`, `radius`, `shadow`, `transition`, `ratio`, `easing` y `chart` (categórica, de resultado y secuencial). Cualquier valor nuevo entra primero como token; no se escriben hex sueltos salvo los documentados.

---

## 5. Estados y color semántico

Una sola tabla **Estado → color**, sobre fondo claro y sobre navy:

| Estado | Color | Ejemplo de texto |
|---|---|---|
| Éxito / verificada | Verde (`--av-success-text`, `--av-success-on-navy`) | "Verificada" |
| Reintento | Ámbar | "Reintento" |
| Rechazo / error | Rojo | "Rechazada" |
| Pendiente | Gris neutro (`--av-neutral-*`) | "Pendiente" |
| Información | Azul | "En revisión" |

**El cian es solo resalte, nunca un estado.**

- **Píldoras de estado** (`hz-chip`): cápsula sin punto, con icono decorativo opcional, en 3 variantes: **suave** (por defecto en tablas y listas), **contorno** y **sólida** (énfasis puntual). Texto ≥ 5:1. Una variante por tabla.
- **Alertas** (`hz-alert`): insignia circular con icono + título + descripción; fondo claro y borde de 1 px, **sin franja lateral**.
- **Panel de actividad:** franja, barras y lista salen de un mismo conjunto de eventos; la suma de las partes es el total.
- **Gráficos de resultado:** `--viz-ok`, `--viz-retry`, `--viz-bad` (≥ 3:1), con icono y palabra en la leyenda.

---

## 6. Componentes

23 secciones en la página **Componentes**, agrupadas por familia. Todas con estados (reposo, hover, foco, activo, deshabilitado, carga, error), teclado completo según WAI-ARIA y objetivos de 44 px.

| Familia | Componentes |
|---|---|
| **Acciones y formularios** | Botones · Campos de formulario · Campo de búsqueda (atajo `/`) · Código de un solo uso de 6 dígitos · Contraseña con indicador de fuerza · Selector de fechas · Combobox · Multi-select y filtros activos · Validación y resumen de errores · Stepper · **Carga de archivos** (zona para soltar; estados cargando, listo, error de red, rechazado) |
| **Datos** | Tablas y píldoras de estado · Tabla avanzada (orden, filtro, selección) · Tarjetas y panel de actividad |
| **Navegación** | Navegación (píldora) · Menú de acciones · Paleta de comandos (Ctrl + K) |
| **Feedback y capas** | Alertas, toast, modal y tooltip · **Estados de carga** (silueta, spinner en botón, barra determinada e indeterminada) · Popover · Drawer lateral |
| **Contenido** | Acordeón |
| **Referencia** | Resumen de teclado |

Reglas de forma de cada componente: botón sólido primario en azul de señal con texto blanco en mono, alto mínimo 44 px, `scale(.97)` al pulsar; campo con fondo blanco, borde de 1 px, radio 8 px y alto 48 px, foco con borde azul y halo de 3 px; errores con `aria-invalid`, `aria-describedby` y foco al primer campo inválido.

---

## 7. Gráficos

Biblioteca de modelos de gráficas, **documentada y con datos de ejemplo** (no hay endpoint real; el contrato de datos es una propuesta).

- **Elegir la forma:** tendencias, comparaciones, partes y metas, resúmenes (KPI con sparkline), distribuciones y flujo (mapa de calor, embudo, histograma con umbral 0.68) y tabla *breakdown*.
- **Color validado** con `validate_palette.js`, en orden fijo: `#145FEE`, `#C77500`, `#0092B5`, `#8A5CF6`, `#C2457A` (+ gris "Otros"). Hasta 3 series sin ayudas; 4–5 solo con etiquetas directas. Secuencial azul de 6 pasos; divergente ámbar ↔ azul con gris neutro. Verde, ámbar y rojo de estado **nunca** son series.
- **Barras "píldora suave"** (24–32 px, máximo 12) como excepción de marca; la variante recta para series densas.
- **Siempre:** tooltip, navegación con flechas, vista en tabla y descarga CSV; cuadrícula de línea fina; sin doble eje; sin número en cada marca; valor siempre disponible como texto.
- **Tarjeta de gráfico:** etiqueta mono, cifra en Space Grotesk, chip de variación (flecha = dirección, color = bueno/malo, texto = cuánto), pie "Datos de ejemplo", y estados cargando, vacío y error.

---

## 8. Patrones biométricos y electorales

> Todas las demos son **simulaciones**: no usan cámara, lector ni datos reales. Son **ejemplos de cómo usar el sistema**, no una copia fiel del producto final.

| Patrón | Idea clave |
|---|---|
| **Reglas biométricas** | Consentimiento antes de captura; guía sin culpar y siempre con texto además de color. |
| **Captura facial** | Óvalo guía, estados de calidad, mensajes accionables. |
| **Captura de huella** | Selector de dedo (mínimo 2 dedos por persona); lector con **huella de arcos anidados** (dibujo del equipo): núcleo con tallo y 6 crestas en cúpula con cortes. Se ilumina de dentro hacia fuera; progreso y calidad en texto. Decorativa (`aria-hidden`); no codifica datos reales. |
| **Resultado de verificación** | Muestra similitud, **umbral (0.68, dato del servidor)** y decisión. |
| **Revisión manual** | Propuesta de diseño: cola de verificaciones dudosas. |
| **Documento y OCR** | Revisión de datos detectados antes de confirmar. |
| **Tarjetón y comprobante** | Dos variantes (abajo). El comprobante **nunca vincula persona y opción**. |
| **Dispositivos** | Estados conectado / desconectado con códigos `CAM-` y `LEC-`. |
| **Consentimiento** | Texto claro, revocable; plazos de conservación por definir con jurídico. |

### Tarjetón (papeleta)
| Variante | Cuándo | Casilla |
|---|---|---|
| **Fórmula** | Un cargo elegido en pareja (presidente y vicepresidente) | 2 fotos, 2 nombres con su cargo, número y logo |
| **Una persona por partido** | Cargo individual: personero, representante, delegado | 1 foto grande, nombre, cargo, número y logo |

Ambas: espacio para foto, número, nombre y logo del partido; opción **Voto en blanco**; orden neutral; selección con radios nativos (flechas del teclado) y texto "Marcada"; pasos Elegir → Revisar → Comprobante. Datos ficticios ("Nombre Apellido", Lista Horizonte/Cima/Raíz).

---

## 9. Plantillas y estados de interfaz

Pantallas completas con sus estados (cargando, vacío, error), vistas a pantalla completa y etiqueta **"Ejemplo de uso"**.

| Grupo | Plantillas |
|---|---|
| Pantallas | Bitácora de auditoría · Configuración · Detalle de persona · Asistente electoral · Notificaciones · Perfil |
| Acceso y cuenta | Recuperar contraseña · Segundo factor · Selección de institución · Aceptar invitación |
| Administración y escrutinio *(propuestas de diseño, pendientes de validar)* | Escrutinio · Mesas y padrón · Roles y permisos |
| Estados de interfaz | Carga, vacío y subida |
| Páginas de error | 404, 403, 500, sin conexión y mantenimiento (concepto *"arcos rotos sobre el horizonte"*: un solo `<h1>`, ruta pedida escapada, siempre una salida) |
| Avisos del sistema | Banner, sesión caducada, módulos pendientes |

Reglas de plantilla: navbar en píldora, ancho de 1200 px, un solo bloque navy por pantalla, tarjetas de 1 px.

---

## 10. Marca y entregables

- **Ilustración con arcos:** una sola figura cambia de estado (vacío, error, éxito).
- **Favicons e imagen social:** `docs/ds/assets/` (favicon 32/48, apple-touch-icon, icon-512, og-image).
- **Correos transaccionales:** tres plantillas con tablas y estilos en línea, generadas con `emails.py`. Pendiente probar en Gmail, Outlook y Apple Mail, y alojar el logo en un dominio público.
- **Impresión (actas):** `print.css` para **A4 real**, tinta mínima, sin botones ni sombras.
- **Logo:** negro sobre la zona clara del degradado, blanco sobre navy. El wordmark se maqueta grande y solo se reduce (nunca ampliarlo por encima de su tamaño nativo).
- **Mapa de entregables:** tabla de qué se entrega, en qué formato y dónde vive.

---

## 11. Calidad: accesibilidad, microcopy y validación

### Accesibilidad (objetivo: WCAG 2.2 AA)
| Área | Requisito |
|---|---|
| Contraste | Texto ≥ 4.5:1 (≥ 3:1 si es grande); componentes y bordes de campo ≥ 3:1. Medir sobre el píxel real. |
| Foco visible | Anillo de 2–3 px, offset 3 px; color según la superficie (azul sobre claro, blanco sobre azul, cian sobre navy). Nunca `outline: none` sin reemplazo. |
| Teclado | Orden = orden visual. Nada con `opacity: 0` recibe foco (usar `visibility: hidden` o `inert`). Escape cierra y devuelve el foco. |
| Objetivos | ≥ 44 × 44 px. |
| Estructura | Un `<h1>` por página, jerarquía sin saltos, landmarks, skip link, `lang="es"`. |
| Formularios | `<label for>` visible; `aria-invalid` + `aria-describedby`; errores con `role="alert"`. |
| Movimiento | `prefers-reduced-motion` respetado; contenido visible sin JS. |
| Color | Nunca único canal. |
| Zoom | Usable a 200 % y 320 px sin scroll horizontal. |

### Microcopy
La voz es **serena, directa e institucional**: habla de tú, en frases cortas, sin exclamaciones ni jerga. Cada mensaje dice qué pasó y qué hacer. Glosario de una palabra por concepto (*Persona*, *Registro biométrico*, *Verificación*, *Prueba de vida*, *Institución*, *Dispositivo*, *Procesar documento*). Formatos: fechas `dd/mm/aaaa, hh:mm`; documento solo dígitos en mono; dispositivos `CAM-001`; porcentajes `50 %`. La biblioteca de mensajes aprobados vive en Calidad y gobernanza → Microcopy.

### Informe de validación (v1.6, vigente en v1.7)
| Prueba | Resultado |
|---|---|
| `axe-core` sobre las 8 páginas (escritorio y móvil) | 0 violaciones, salvo 8 avisos de contraste en Fundamentos que son **muestras demostrativas** de pares que fallan a propósito. |
| Teclado (recorrido con Tab) | 657 elementos enfocables en 8 páginas, 0 sin foco visible ni nombre. |
| Contraste sobre píxel real | Píldoras ≥ 5.02:1; panel navy ≥ 9:1; portada de Inicio ≥ 7.2:1. |
| Impresión | A4 real (595 × 842 pt), 1 página. |
| Detector de diseño (Impeccable) | Corregidos saltos de encabezado, etiquetas de 10 px y barras animadas con `width`. |
| HTML único desde `file://` | Funciona; recorre las 8 páginas sin errores de consola. |

**No probado:** Firefox y Safari · lector de pantalla real (NVDA, Narrador, VoiceOver) · móvil físico (solo se emuló 390 y 820 px) · zoom 200 % con una sesión de usuario.

### Requisitos de navegador
| Función | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| `:has()` | 105 | 15.4 | **121** |
| `color-mix()` | 111 | 16.2 | 113 |
| `<dialog>` | 37 | 15.4 | 98 |

**Mínimo recomendado:** Chrome y Edge 111, Safari 16.2, Firefox 121. Salen de la compatibilidad publicada de cada función, no de pruebas propias.

---

## 12. Gobernanza y versionado

### Un componente está terminado cuando…
- Usa solo tokens (sin hex sueltos salvo los documentados).
- Tiene sus estados: reposo, hover, foco, activo, deshabilitado, carga, error.
- Contraste y foco están verificados sobre cada superficie donde aparece.
- Es responsive a 1440, 820 y 390 px sin scroll horizontal.
- `prefers-reduced-motion` y teclado están probados.
- Está documentado en el catálogo con un ejemplo vivo y su regla de uso.

### Dónde va cada cosa
| Si lo que añades es… | Va en… |
|---|---|
| Un valor o una regla visual | Fundamentos |
| Una pieza reutilizable | Componentes, en su familia |
| Una forma de mostrar datos | Gráficos |
| Una solución a un problema de producto | Patrones |
| Una pantalla completa o su estado | Plantillas y estados |
| Algo que sale de la pantalla | Marca y entregables |
| Una regla de calidad o de proceso | Calidad y gobernanza |

### Cómo añadir o mover una sección
Cada `<section>` en `docs/ds/src/*-body.html` lleva un `id` único en todo el sistema, `data-nav` (etiqueta del índice) y `data-grp` (subgrupo). Sin numeración; el fondo alterno lo calcula `build.py`. Para moverla se corta el bloque a otro `*-body.html` y se ajusta `data-grp`. Después, `python docs/ds/src/build.py`.

### Proponer un cambio
Issue con captura → prototipo en rama → revisión (**nadie valida lo suyo**) → actualizar token, `DESIGN.md` y este documento → merge a `dev`.

### Versionado
**Mayor:** cambia un principio o un token de marca. **Menor:** componente nuevo. **Parche:** corrección de valor o de texto.

### Registro de decisiones
| Decisión | Motivo |
|---|---|
| Estilo "Horizonte" (cielo a navy, arcos, mono en acciones) | Identidad propia y reconocible; la A del logo es la firma. |
| Descartado el estilo brutalista | Perdía la identidad de marca. |
| Plano por defecto: líneas de 1 px | Menos ruido; la profundidad la da el tono. |
| Un solo panel navy por pantalla | Marca el cambio de información. |
| Shell en píldora | Coherencia con el dock anterior y la navegación pública. |
| Wordmark: maquetar grande y reducir | Ampliarlo lo rasterizaba borroso. |
| Módulos sin pantalla: "Próximamente", sin enlace | Honestidad del estado; evita los 404. |
| Estructura por propósito (v1.5) | La gente no sabía dónde buscar. |
| Sin Bootstrap en landing, login y dashboard | Menos peso; se conservan los iconos. |

### Historial de versiones
| Versión | Resumen |
|---|---|
| **v1.7** | Plantillas y patrones declarados *ejemplos de uso*; huella de arcos anidados; componentes de carga de archivos y estados de carga; segundo tarjetón (una persona por partido); guía de migración a React; dependencias y librerías; lista de lo pospuesto. |
| **v1.6** | Formularios nuevos (búsqueda, código de 6 dígitos, contraseña con fuerza, multi-select, validación); flujos de cuenta; propuestas de escrutinio, mesas, roles y revisión manual; tarjetón; informe de validación (axe, teclado, A4). |
| **v1.5** | Reorganización por propósito (8 páginas en 4 grupos), secciones sin numerar, validación automática en `build.py`. |
| **v1.4** | Auditoría del líder: estados unificados, píldoras en 3 variantes, alertas con insignia, panel de actividad desde un solo conjunto de datos. |
| **v1.3** | Cobertura completa: patrones, componentes, plantillas, marca y entregables; HTML único compartible. |
| **v1.2** | Multipágina, páginas de error, biblioteca de gráficos. |
| **v1.1** | Accesibilidad y teclado en landing y login. |
| **v1.0** | Primera versión: fundamentos, 20 componentes, patrones y plantillas. |

---

## 13. Dependencias y librerías

### Para usar el sistema hoy (HTML, CSS y JS estático)
| Dependencia | Versión | Para qué | Cómo se carga |
|---|---|---|---|
| Space Grotesk | pesos 500, 600, 700 | Titulares y cifras | Google Fonts |
| Inter | pesos 400–700 | Texto de interfaz | Google Fonts |
| JetBrains Mono | pesos 500, 700 | Acciones, rótulos, datos | Google Fonts |
| Bootstrap Icons | 1.11.3 | Iconografía | cdnjs |
| Bootstrap | 5.3.3 | **Solo** el frontend actual; este sistema no lo necesita | CDN |
| `tokens.css` / `design-system.css` | del repositorio | Tokens y estilos | Archivos locales |

**JavaScript:** ninguna librería; las demos usan JS propio. **Sin conexión:** fuentes e iconos vienen de CDN; alojarlos en el repositorio es deuda conocida.

### Para construir la documentación
| Herramienta | Versión | Para qué |
|---|---|---|
| Python 3 | 3.x (probado con 3.14) | `build.py`, `bundle.py`, `emails.py`, `tokens_export.py`. **Solo biblioteca estándar**; no hay que instalar paquetes. |
| Servidor estático | cualquiera | `python -m http.server` |
| Navegador | Chrome/Edge 111, Safari 16.2, Firefox 121 o posterior | Ver la documentación |

### Para probar
| Herramienta | Versión | Para qué |
|---|---|---|
| Node.js | probado con 24 | Ejecutar las pruebas |
| Playwright (`playwright-core`) | 1.63.0 | Recorrer páginas, demos, teclado, capturas y PDF A4 (usado con Microsoft Edge) |
| axe-core | 4.10.2 usado · 4.13.0 en npm | Auditoría de accesibilidad (WCAG 2.2 AA); `@axe-core/playwright` 4.13.0 la integra |
| Detector de Impeccable | del repositorio (`.claude/skills/impeccable`) | Revisión de patrones de diseño |

Las pruebas son scripts sueltos, sin `package.json`. Si pasan al repositorio oficial, conviene crearlo con estas tres dependencias de desarrollo.

---

## 14. Migración a React (recomendación)

**Sí se puede migrar, y de forma incremental.** El frontend actual es HTML, CSS y JS estático; esta es una **recomendación documentada, no una migración hecha**.

| Pieza actual | En React |
|---|---|
| `tokens.css` / `tokens.json` | **Sin cambios.** Variables CSS o `@theme` de Tailwind v4. |
| Clases `hz-*` | **Se reutilizan** como CSS global o Módulos CSS. |
| JS de las demos (combobox, fechas, drawer, Ctrl + K, tabla, código de 6 dígitos) | **Se reemplaza** por componentes con comportamiento resuelto; nuestro código sirve como especificación y pruebas de aceptación. |
| Gráficos SVG propios | Se mantienen como componentes o se apoyan en Recharts / Visx. |
| Documentación con `build.py` | Puede seguir igual o pasar a Storybook. |

### Paquetes (versiones consultadas en npm el 3 de octubre de 2026)
Son las **más recientes ese día**, no un compromiso: fijarlas y verificar compatibilidad con Next.js antes de empezar.

| Paquete | Versión | Para qué | Nivel |
|---|---|---|---|
| `react`, `react-dom` | 19.3.0 | Base | Necesario |
| `next` | 16.3.8 (Node ≥ 20.9) | Framework y enrutado por módulos | Necesario |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | Estilos; los tokens `--av-*` pasan a `@theme` | Necesario |
| `shadcn` (CLI) | 4.21.1 (Node ≥ 20.18.1) | Copia los componentes base al repositorio | Necesario |
| `class-variance-authority`, `clsx`, `tailwind-merge` | 0.7.1 · 2.1.1 · 3.7.0 | Variantes (3 variantes de píldora, tamaños) y unión de clases | Necesario |
| `tw-animate-css` | 1.4.0 | Animaciones de entrada y salida | Necesario |
| `@base-ui/react` (o `radix-ui` 1.6.7) | 1.8.0 | Primitivas accesibles | Una de las dos |
| `react-aria-components` | 1.21.1 | Fechas, combobox y tablas | Recomendado |
| `sonner` | 2.0.8 | Toasts con `aria-live` | Recomendado |
| `@tanstack/react-table` | 9.2.4 | Tabla avanzada | Recomendado |
| `cmdk` | 1.1.1 | Paleta Ctrl + K | Recomendado |
| `input-otp` | 1.5.0 | Código de 6 dígitos | Recomendado |
| `react-day-picker` + `date-fns` 4 | 10.0.2 | Selector de fechas (o el de React Aria) | Una de las dos |
| `react-hook-form`, `zod`, `@hookform/resolvers` | 7.89.0 · 4.6.5 · 5.9.1 | Formularios y validación | Recomendado |
| `recharts` (o `@visx/visx` 4.0.0) | 3.10.1 | Gráficos con la paleta `--viz-*` | Opcional |
| `lucide-react` | 1.51.0 | Iconos (o conservar Bootstrap Icons) | Opcional |
| `storybook` | 10.6.1 | Documentación viva y pruebas visuales | Opcional |

### Instalación de referencia
```bash
# 1. Proyecto
npx create-next-app@latest averyn-web --typescript --tailwind --app
# 2. Componentes base (copia el código al repositorio)
npx shadcn@latest init
npx shadcn@latest add button input select badge alert dialog tabs tooltip table
# 3. Complementos
npm i sonner @tanstack/react-table cmdk input-otp react-day-picker date-fns
npm i react-hook-form zod @hookform/resolvers recharts react-aria-components
# 4. Desarrollo y pruebas
npm i -D storybook @playwright/test @axe-core/playwright
```
Los comandos son una guía: `shadcn init` pregunta la base de primitivas y el estilo, y su salida cambia con la versión. Pasar los tokens a `@theme` **antes** de añadir componentes.

### Ruta por fases
1. Next.js, Tailwind v4 y tokens como variables CSS.
2. 8–10 componentes base (Button, Input, Select, Chip/Badge, Alert, Dialog, Tabs, Tooltip, Toast) con las clases `hz-*`.
3. Formularios y tabla avanzada.
4. Patrones biométricos y plantillas.
5. Gráficos.
6. Storybook como documentación viva.

Las pantallas se migran **por módulos**, no de golpe.

### Qué evitar y advertencias
- Kits con estética propia (MUI, Chakra, Tremor, HeroUI, Mantine), salvo que se sobrescriba todo su tema con los tokens.
- shadcn/ui asume Tailwind: habría que introducirlo.
- Las reglas propias (señal única, mono en acciones, plano, color nunca único canal) **no se heredan**: hay que escribirlas como variantes.
- Las recomendaciones salen de comparativas publicadas en 2026, no de pruebas propias; conviene una prueba de concepto con 3 componentes (botón, píldora de estado, alerta) antes de comprometerse.

---

## 15. Deuda conocida y pospuesto

| Tema | Estado |
|---|---|
| **Modo nocturno** | Pospuesto por decisión del equipo. Falta validar paleta de gráficos y tokens sobre superficie oscura. |
| **Mascota de marca** | Próxima creación. Cuando exista, documentar en Marca sus usos, tamaños mínimos, expresiones y reglas de aparición (nunca sustituye un mensaje de estado), con su versión accesible. |
| **Prueba de concepto en React** | Pospuesta; solo está documentada la migración. |
| **Pruebas con personas y otros navegadores** | Firefox, Safari, lector de pantalla real y móvil físico sin probar. |
| **Fuentes e iconos sin conexión** | Se cargan desde Google Fonts y cdnjs; alojarlos en el repositorio. |
| **Módulos del frontend** | Identidad, Documentos, Biometría, Electoral e IA siguen con el estilo anterior (`.av-*`) y Bootstrap. |
| **Píldoras y alertas en el frontend** | Existen en el design system; el frontend (`lg-alert`, `dh-`) aún usa los estilos anteriores. |
| **Prefijos de CSS** | El código usa `mn-`, `lg-` y `dh-`; consolidar en `hz-` o `av-`. |
| **CSS sin usar** | ~50 KB de `components.css`, `modules.css` y `dashboard.css` se cargan sin usarse en landing y login. |
| **Shell de navegación** | La unificación del shell del dashboard espera la señal del equipo. |
| **Propuestas sin validar** | Escrutinio, revisión manual, mesas y padrón, roles y permisos. |
| **Consentimiento biométrico** | Plazos de conservación, canal de revocación y texto legal por definir con el área jurídica. |
| **Correos** | Probar en clientes reales y alojar el logo en un dominio público. |
| **Idiomas** | Todo está en español; revisar textos, fechas y longitudes si se ofrece en otros idiomas. |
| **Aviso de cookies y consentimiento web** | No cubierto; solo existe el consentimiento biométrico. |
| **Patrones, componentes y plantillas** | Son **ejemplos ilustrativos**, no una copia fiel del producto; hay que implementarlos con datos reales y revisarlos con quien opere cámara, lector y padrón. |

---

## 16. Documentos relacionados

| Documento | Qué es |
|---|---|
| [`DESIGN.md`](../DESIGN.md) | Principios y reglas del sistema en formato para herramientas de diseño. |
| [`PRODUCT.md`](../PRODUCT.md) | Contexto del producto: usuarios, propósito, restricciones y principios. |
| [`averyn-design-system-horizonte.html`](./averyn-design-system-horizonte.html) | El catálogo completo en un solo archivo. |
| [`design-system.md`](./design-system.md) | Guía de la capa anterior (`.av-*`) que aún usan los módulos del frontend; legado, a retirar cuando migren. |
| [`ds/tokens.json`](./ds/tokens.json) | Tokens en formato W3C (generado). |
