<p align="center">
  <img src="averyn-frontend/assets/img/averyn-BlancoAzul.jpg.jpeg" alt="Averyn" width="760">
</p>

<h1 align="center">Averyn</h1>

<p align="center">
  Plataforma institucional para la gestión de identidad, biometría, documentos e inteligencia artificial.<br>
  <strong>Sprint 1 — Avance de frontend</strong>
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

El repositorio es un **monolito modular** con dos partes: `averyn-frontend/`
(trabajo activo del Sprint 1) y `averyn-backend/` (reservado para la siguiente fase).

---

## Avances del Sprint 1

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

**Próximos pasos:** módulos de Accesos y Administración.

---

## Capturas

### Landing pública
![Landing pública](averyn-frontend/assets/images/captures/landing.png)

### Documentos y OCR — Nuevo registro
![Nuevo registro](averyn-frontend/assets/images/captures/registro.png)

### Biometría — Registrar biometría
![Registrar biometría](averyn-frontend/assets/images/captures/registro-biometrico.png)

---

## Cómo ejecutarlo

El proyecto es HTML/CSS/JavaScript sin paso de compilación. Para verlo:

1. Abre la carpeta del repositorio en VS Code.
2. Usa **Live Server** sobre `averyn-frontend/index.html` (punto de entrada público).

> **Nota:** no abras los archivos con `file://`; usa siempre un servidor local.
> La captura biométrica usa la cámara real del navegador (`getUserMedia`), que
> requiere `localhost` o HTTPS; si se niega el permiso, el flujo continúa con un
> panel de reemplazo.

Punto de entrada interno (requiere inicio de sesión simulado): `averyn-frontend/login.html`.

---

## Estructura

```text
averyn/
├── averyn-frontend/
│   ├── index.html                  # Landing pública
│   ├── login.html                  # Login simulado
│   ├── assets/
│   │   ├── css/                    # Design System por capas + CSS del shell
│   │   ├── js/                     # Un script por vista + common/ compartido
│   │   └── images/                 # Logos y recursos de marca
│   ├── dashboard/                  # Shell, dashboard, identidad y documentos
│   ├── biometrics/                 # Dashboard, registro, captura, verificación e historial
│   └── modules/                    # IA y Electoral
├── averyn-backend/                 # Reservado (sin implementar)
├── docs/                           # Documentación del proyecto
│   ├── style-guide.html            # Catálogo visual del Design System
│   ├── design-system.md            # Tokens y componentes (referencia)
│   └── diagnostico-densidad-wizard.md
└── README.md
```

---

## Stack

- **HTML + CSS + JavaScript** sin framework (scripts clásicos por vista).
- **Bootstrap 5.3.3** (rejilla y utilidades) y **Bootstrap Icons 1.11.3** vía CDN.
- **Sin librerías de gráficos ni dependencias de UI**: los componentes viven en el Design System.
- Datos **simulados (mock)**: el backend aún no está implementado.

---

## Design System

La apariencia está centralizada, no se define por pantalla:

- `averyn-frontend/assets/css/design-system.css` es el punto de entrada; el contenido
  está dividido por capas: `tokens`, `base`, `components`, `modules` y `dashboard`.
- `docs/style-guide.html` es el catálogo visual de componentes.
- `docs/design-system.md` es la referencia de tokens y componentes.

Los módulos consumen estas clases (`.av-*`) en vez de crear estilos propios.

### Enfoque de datos

Se priorizó un panel con **datos simples y trazables** sobre visualizaciones
complejas: cada número del dashboard es un conteo del mock (en producción, una
consulta agregada por módulo) y la "actividad reciente" es un log de acciones.
Por esa razón no hay gráficos estadísticos sin una fuente de datos real detrás.

---

## Convenciones de trabajo

- **Ramas:** `feature/<actividad>-<descripcion>` desde la rama de integración.
- **Commits:** `<tipo>(<alcance>): <descripción>` — `feat`, `fix`, `style`, `docs`, `refactor`.
- **Integración:** los cambios llegan por Pull Request; ninguna rama de trabajo se
  fusiona directamente a la rama estable.

---

## Equipo

Proyecto académico dirigido por el docente **Sadainer Hernández**.

| Rol | Bloque |
|---|---|
| José Chinchía | Bloque A — Landing y autenticación |
| Jorge Herrera | Bloque B — Dashboard Shell, Identidad y Documentos/OCR |
| Daniel Turizo | Bloque C — Biometría e IA (PO/SM) |
| Mateo Calderón | Bloque D — Módulos de negocio (Electoral, Accesos, Administración) |
