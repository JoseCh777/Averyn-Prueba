# Averyn App (prueba)

Frontend de Averyn reescrito en React sobre el Design System **Horizonte v2.0**. Reemplaza al
prototipo HTML de `../averyn-frontend/` (que se conserva como referencia) y sigue la misma
estructura que el repositorio oficial `averyn-web`, para portarlo sin friccion.

Todos los datos son **de demostracion** (`[MOCK]`): cada modulo tiene una interfaz de servicio y una
implementacion en memoria del servidor (se pierde al reiniciarlo). No hay backend.

## Primeros pasos

```bash
npm ci
npm run dev -- -p 3300        # http://localhost:3300
```

Cuenta de demostracion del login: `admin@averyn.test` / `Averyn2026`.

## Pantallas

| Ruta | Pantalla | Funcionalidad |
|---|---|---|
| `/` | Landing publica con hero guiado por scroll | [`features/landing`](features/landing/README.md) |
| `/login` | Inicio de sesion | [`features/authentication`](features/authentication/README.md) |
| `/dashboard` | Panel: indicadores, accesos y actividad (lee los demas modulos) | [`features/dashboard`](features/dashboard/README.md) |
| `/identity`, `/identity/[personId]` | Personas: listado con filtros, alta, baja y ficha | [`features/identity`](features/identity/README.md) |
| `/documents`, `/documents/pre-registration` | Documentos con OCR y pre-registro de una persona | [`features/documents`](features/documents/README.md) |
| `/biometrics`, `/biometrics/enrollment`, `/biometrics/verification`, `/biometrics/capture`, `/biometrics/history` | Registro, verificacion, captura (camara real), resultado e historial | [`features/biometrics`](features/biometrics/README.md) |
| `/elections`, `/elections/new` | Procesos electorales y asistente de creacion | [`features/elections`](features/elections/README.md) |
| `/ai` | Marcador del modulo de IA | [`features/ai`](features/ai/README.md) |
| `/forbidden`, `/offline`, `/maintenance`, 404, 500 | Paginas de sistema | `components/errors` |

Accesos y Administracion aun no tienen pantalla: el dock los muestra como «Proximamente».

## Como se conectan los modulos

Identidad es el catalogo de personas: Documentos crea personas, Biometria las registra y verifica (una
verificacion exitosa las marca como verificadas), Electoral las usa como padron y el dashboard las cuenta.
Cada modulo accede a los demas **solo por su servicio** (`services/index.ts`), que es el unico sitio que
elige la implementacion; cuando el Core exponga cada modulo se cambia esa linea.

## Verificacion

```bash
npm run typecheck
npm run test:unit
npm run build && npm run start -- -p 3300
AUDIT_COOKIE="averyn_mock_session=1" npm run test:a11y -- http://localhost:3300
```

`test:a11y` sin rutas audita las 18 pantallas (axe WCAG 2.2 AA, teclado, desborde y consola, a 1440 y
375 px). Detalle en [`tests/accessibility`](tests/accessibility/README.md).

## Estructura

```text
app/         Rutas (App Router): (auth)/login, (app)/... pantallas con sesion, paginas de sistema
components/  Design System (ui, charts, effects, errors) y App Shell (layout)
features/    Una carpeta por modulo: authentication, dashboard, landing, identity,
             documents, biometrics, elections, ai
lib/         Utilidades comunes (clases, fechas en hora de Lima)
tests/       Pruebas unitarias y auditoria de accesibilidad
```

Las reglas de trabajo son las de `AGENTS.md` y el estandar de codigo del proyecto
(`averyn-docs/development/coding-standard.md`).
