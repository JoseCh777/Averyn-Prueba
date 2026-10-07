<p align="center">
  <img src="averyn-frontend/assets/img/averyn-BlancoAzul.jpg.jpeg" alt="Averyn" width="760">
</p>

<h1 align="center">Averyn</h1>

<p align="center">
  Espacio de trabajo de José para probar vistas, librerías y experimentos de Averyn.<br>
  <strong>Prototipo HTML · App React · Design System Horizonte</strong>
</p>

---

## ¿Qué es Averyn?

Averyn es una plataforma para organizaciones (universidades, empresas y entidades
públicas) que centraliza la **gestión de identidad**, la **verificación biométrica**,
el **procesamiento documental (OCR)**, la **inteligencia artificial** y los
**procesos institucionales** en un mismo panel.

El módulo electoral es solo uno de los procesos posibles: la plataforma está
pensada como una base de identidad institucional, no como una aplicación de
votaciones.

---

## ¿Qué es este repositorio?

Es un **espacio de trabajo (sandbox)**, no el repositorio oficial: aquí se prueban
vistas, librerías y experimentos antes de llevarlos a los repos oficiales del
proyecto. Conviven varias piezas:

| Carpeta | Qué es |
|---|---|
| **`averyn-frontend/`** | Prototipo **HTML + CSS + JS puro** (Sprint 1). Es la referencia visual: los componentes viven en su Design System por capas y los datos son mock en `localStorage`. |
| **`averyn-app/`** | Frontend en **React + Next.js 16** sobre el Design System Horizonte. Migración del prototipo **a paridad visual completa** (fases 1–6, merge `008391b` en `main`). |
| **`design-system-v2/`** | Design System **Horizonte completo en React**: componentes, patrones biométricos y electorales, gráficos SVG, plantillas de pantalla y su documentación (8 páginas). Es un espacio de preparación; nada de esto está en los repos oficiales hasta que se apruebe el ADR-011. |
| **`averyn-backend/`** | Reservado para la siguiente fase (solo `.gitkeep`). |
| **`docs/`** | Documentación del proyecto: Design System maestro «Horizonte» (`.md` + catálogo navegable), documentación por páginas (`ds/`) y diagnósticos. |

En las tres piezas los datos son **de demostración**: no hay backend conectado.

---

## Estado de la app React (`averyn-app/`)

La migración del prototipo a React quedó **a paridad visual con `averyn-frontend/`**
y mergeada en `main` (merge `--no-ff`, commit `008391b`), sin tocar el prototipo:

| Fase | Commit | Contenido |
|---|---|---|
| Tipografía | `0449166` | Space Grotesk para títulos (DESIGN.md y frontend original) |
| Landing | `18237c3` | Pre-pintado, labels, navbar, ritmo vertical |
| Login | `21240ff` | Volver al inicio, h1, botón 50px, éxito y limpieza de errores |
| Dashboard | `ec7ff31` | Paridad visual con el dashboard del prototipo |
| Módulos | `90248d0` | Identidad, Documentos/OCR, Biometría, Electoral, IA y páginas de sistema (58 archivos) |
| A11y + responsive | `3dd5137` | Contraste de avatares y sin scroll horizontal a 320px |

Verificación aplicada en cada fase:

- `tsc --noEmit` y **215 pruebas unitarias** en verde.
- `next build` con 20 rutas.
- Auditoría de accesibilidad **18/18 rutas con 0 problemas** (axe, WCAG 2.2 AA, a 1440 y 375 px, con sesión simulada).
- **Sin scroll horizontal entre 320 y 1440 px** (1024/768/576/320 verificados).

---

## Cómo ejecutarlo

### Prototipo HTML — `averyn-frontend/`

1. Abre la carpeta del repositorio en VS Code.
2. Usa **Live Server** sobre `averyn-frontend/index.html` (punto de entrada público).

> **Nota:** no abras los archivos con `file://`; usa siempre un servidor local.
> La captura biométrica usa la cámara real del navegador (`getUserMedia`), que
> requiere `localhost` o HTTPS; si se niega el permiso, el flujo continúa con un
> panel de reemplazo.

Punto de entrada interno (requiere inicio de sesión simulado): `averyn-frontend/login.html`.

### App React — `averyn-app/`

```bash
cd averyn-app
npm ci
npm run dev -- -p 3300        # http://localhost:3300
```

Cuenta de demostración del login: `admin@averyn.test` / `Averyn2026`.

```bash
npm run typecheck             # tsc --noEmit
npm run test:unit             # pruebas unitarias (node --test)
npm run build && npm run start -- -p 3300
AUDIT_COOKIE="averyn_mock_session=1" npm run test:a11y   # auditoría completa
```

Detalle de pantallas y estructura en [`averyn-app/README.md`](averyn-app/README.md).

### Design System en React — `design-system-v2/`

```bash
cd design-system-v2
npm install
npm run dev        # http://localhost:3000
```

---

## Avances del Sprint 1 (prototipo `averyn-frontend/`)

| Módulo | Estado | Qué incluye |
|---|---|---|
| **Design System** | Completo | Tokens (color, tipografía, espaciado, breakpoints) y componentes reutilizables (`design-system.css` por capas + catálogo). |
| **Landing pública** | Completo | Página institucional con hero, secciones informativas y navegación. |
| **Login** | Completo | Formulario con validación, estados de error/carga/éxito y sesión simulada. |
| **Dashboard Shell** | Completo | Navbar superior y **dock flotante** reutilizable por todos los módulos autenticados. |
| **Dashboard** | Completo | Bienvenida, KPIs, accesos rápidos y actividad reciente. |
| **Identidad** | Completo | Listado de personas con búsqueda y filtro por estado, detalle de persona, creación y eliminación. |
| **Documentos / OCR** | Completo | Listado de documentos, carga simulada, resultado OCR editable y wizard de pre-registro. |
| **Biometría** | Completo | Módulo completo: dashboard, **registro biométrico**, **captura facial con cámara real**, **verificación 1:1**, historial y estado de dispositivos. |
| **IA** | En desarrollo | Placeholder "en desarrollo"; el dock no apunta a una ruta rota. |
| **Electoral** | Completo | Listado de procesos con su estado y creación de proceso. |
| **Accesos** | Pendiente | Carpeta de módulo reservada (`.gitkeep`); el dock aún apunta a un 404. |
| **Administración** | Pendiente | Carpeta de módulo reservada (`.gitkeep`); el dock aún apunta a un 404. |

En la app React, Accesos y Administración aparecen como «Próximamente» en el dock
(sin enlaces rotos) y todos los módulos activos ya están a paridad.

---

## Auditoría Sprint 1 (F1–F4)

Antes de estabilizar el prototipo se aplicaron correcciones de auditoría sobre el árbol portado:

| Fase | Commit | Qué se corrigió |
|---|---|---|
| **F1 — Datos y flujos** | `31d42d0` | Catálogo único de personas (`personas-catalogo.js`, clave `averyn_personas`) como fuente de verdad para Identidad, Biometría y Electoral; verificación por modalidad seleccionada (gate + panel de huella sin cámara); logout dinámico con guard de sesión (`averyn.session`); el wizard OCR crea/reutiliza la persona y navega a captura con `?modo=registro&persona=<id>`. |
| **F2 — Consistencia visual** | `b20f9c6` | Favicon AVIF en todas las páginas internas; spine de cabecera en Electoral; tipografía de encabezados a *Space Grotesk*; dock sin glow de color (elevación neutra); deduplicación de tokens (`:root` solo en `design-system.css`); landing y login con CDN cdnjs (Bootstrap 5.3.3 + icons 1.11.3) y carga del Design System. |
| **F3 — Trazabilidad** | `737de5c` | KPIs y actividad reciente construidos desde los datos reales de la demo (`averyn_personas`, `averyn.biometria.*`, `averyn_procesos_electorales`) en vez de cifras inventadas; fechas relativas en el historial de documentos; copy del login neutro. |
| **F4 — Robustez** | `737de5c` | Empty state en la tabla de documentos; `procesoEnCreacion.id = generarId()` antes de guardar el proceso electoral; KPIs del módulo de documentos calculados desde la fuente de datos. |

---

## Capturas

### Landing pública
![Landing pública](averyn-frontend/assets/images/captures/landing.png)

### Documentos y OCR — Nuevo registro
![Nuevo registro](averyn-frontend/assets/images/captures/registro.png)

### Biometría — Registrar biometría
![Registrar biometría](averyn-frontend/assets/images/captures/registro-biometrico.png)

---

## Estructura

```text
averyn-prueba/
├── averyn-frontend/              # Prototipo HTML (Sprint 1) — referencia visual
│   ├── index.html                # Landing pública
│   ├── login.html                # Login simulado
│   ├── assets/
│   │   ├── css/                  # Design System por capas + CSS del shell
│   │   ├── js/                   # Un script por vista + common/ compartido
│   │   └── images/               # Logos, recursos de marca y capturas
│   ├── dashboard/                # Shell, dashboard, identidad y documentos
│   ├── biometrics/               # Dashboard, registro, captura, verificación e historial
│   └── modules/                  # IA, Electoral, Accesos y Admin (IA+Electoral activos)
├── averyn-app/                   # Frontend React (Next.js 16) — a paridad con el prototipo
│   ├── app/                      # Rutas (App Router), layouts, páginas de sistema y estilos
│   ├── components/               # Design System (ui, charts, effects, errors) y App Shell
│   ├── features/                 # Un módulo por carpeta (landing, authentication, identity…)
│   ├── lib/, types/, public/     # Infraestructura, tipos compartidos y estáticos
│   └── tests/                    # Unitarias + auditoría de accesibilidad (axe)
├── design-system-v2/             # Design System Horizonte completo en React (preparación ADR-011)
├── averyn-backend/               # Reservado (sin implementar)
├── docs/                         # Documentación del proyecto
│   ├── averyn-design-system-horizonte.md    # Documento maestro del Design System "Horizonte"
│   ├── averyn-design-system-horizonte.html  # El mismo sistema, navegable, en un solo archivo
│   ├── ds/                       # Documentación por páginas
│   └── diagnostico-densidad-wizard.md
├── DESIGN.md                     # Principios y reglas del Design System
├── PRODUCT.md                    # Contexto del producto
└── README.md
```

---

## Stack

**`averyn-frontend/` (prototipo)**

- **HTML + CSS + JavaScript** sin framework (scripts clásicos por vista).
- **Bootstrap 5.3.3** (rejilla y utilidades) y **Bootstrap Icons 1.11.3** vía CDN.
- **Sin librerías de gráficos ni dependencias de UI**: los componentes viven en el Design System.
- Datos **simulados (mock)** en `localStorage`; sin backend.

**`averyn-app/` (app React)**

- **Next.js 16** (App Router) + **React 19** + TypeScript estricto.
- Tokens y estilos como variables CSS `--av-*` (Horizonte) + Tailwind v4 para utilidades;
  `clsx`/`tailwind-merge` para clases y `motion` para animaciones.
- Verificación con `tsc`, `node --test` y `axe-core` sobre `playwright-core`.

**`design-system-v2/` (Design System en React)**

- **Next.js 16** + React 19 + **Tailwind v4**, TypeScript estricto.
- Gráficos SVG propios, sin librerías de charts.

---

## Design System

La apariencia está centralizada, no se define por pantalla:

- **La única guía de diseño es "Horizonte".** La referencia es `docs/averyn-design-system-horizonte.md`
  y el catálogo navegable es `docs/averyn-design-system-horizonte.html` (un solo archivo).
  Los principios viven en `DESIGN.md`.
- En el prototipo, `averyn-frontend/assets/css/design-system.css` es el punto de entrada
  (capas `tokens`, `base`, `components`, `modules` y `dashboard`); los módulos consumen
  las clases `.av-*` en vez de crear estilos propios.
- En la app React los tokens viven en `averyn-app/app/globals.css` y el CSS por módulo en
  `averyn-app/app/styles/` (`av-core`, `av-shell`, `av-page` y una hoja por módulo), con
  convenciones de `AGENTS.md` (prefijo `av-`, Space Grotesk en títulos, Inter en cuerpo,
  breakpoints 576/768/1024/1280).
- `design-system-v2/` concentra el DS completo en React (componentes, patrones, gráficos,
  plantillas y documentación) como preparación del ADR-011.

### Enfoque de datos

Se priorizó un panel con **datos simples y trazables** sobre visualizaciones
complejas: cada número del dashboard es un conteo de la capa de datos simulada
(alojada en `localStorage`: `averyn_personas`, `averyn.biometria.*` y
`averyn_procesos_electorales`), no una cifra inventada. La "actividad reciente"
es un log de eventos biométricos. Por esa razón no hay gráficos estadísticos
sin una fuente de datos real detrás. La app React mantiene el mismo enfoque con
servicios en memoria (`[MOCK]`).

---

## Hoja de ruta

1. **Pulido de diseño** — completar pendientes visuales: placeholders de los
   módulos de Accesos y Administración, revisión de estados vacíos/error y
   pasadas de accesibilidad (contraste, foco, etiquetas).
2. **Migración a React** — **completada**: `averyn-app/` está a paridad visual
   con el prototipo (ver *Estado de la app React*). Siguiente paso cuando haya
   API: reemplazar la capa de servicios en memoria por el cliente HTTP.
3. **Backend** — implementar `averyn-backend/` (reservado) y conectar los
   módulos a una API real, reemplazando la capa de datos simulada.

---

## Convenciones de trabajo

- **Ramas:** `feature/<actividad>-<descripcion>` desde `dev` y `fix/<auditoria>-<detalle>`
  desde `main` para correcciones. `dev` es la rama de integración.
- **Commits:** `<tipo>(<alcance>): <descripción>` — `feat`, `fix`, `style`, `docs`, `refactor`.
- **Integración:** los cambios llegan por Pull Request a `dev` y desde `dev` a
  `main`; las correcciones directas (`fix/*`) se fusionan a `main` tras revisión
  y verificación (`node --check` + revisión de referencias).

---

## Equipo

Proyecto académico dirigido por el docente **Sadainer Hernández**.

| Rol | Bloque |
|---|---|
| José Chinchía | Bloque A — Landing y autenticación |
| Jorge Herrera | Bloque B — Dashboard Shell, Identidad y Documentos/OCR |
| Daniel Turizo | Bloque C — Biometría e IA (PO/SM) |
| Mateo Calderón | Bloque D — Módulos de negocio (Electoral, Accesos, Administración) |
