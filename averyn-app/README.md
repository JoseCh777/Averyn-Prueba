# Averyn App (prueba)

Frontend de Averyn reescrito en React sobre el Design System **Horizonte v2.0**. Reemplaza al
prototipo HTML de `../averyn-frontend/` (que se conserva como referencia) y sigue la misma
estructura que el repositorio oficial `averyn-web`, para portarlo sin friccion.

Todos los datos son **de demostracion** (`[MOCK]`): cada modulo tiene una interfaz de servicio y una
implementacion en memoria. No hay backend.

## Primeros pasos

```bash
npm ci
npm run dev -- -p 3300        # http://localhost:3300
```

Cuenta de demostracion del login: `admin@averyn.test` / `Averyn2026`.

## Verificacion

```bash
npm run typecheck
npm run test:unit
npm run build && npm run start -- -p 3300
AUDIT_COOKIE="averyn_mock_session=1" npm run test:a11y -- http://localhost:3300
```

## Estructura

```text
app/         Rutas (App Router): (auth)/login, (app)/... pantallas con sesion
components/  Design System (ui, charts, effects, errors) y App Shell (layout)
features/    Una carpeta por modulo: authentication, dashboard, landing, identity,
             documents, biometrics, elections, ai
tests/       Pruebas unitarias y auditoria de accesibilidad
```

Las reglas de trabajo son las de `AGENTS.md` y el estandar de codigo del proyecto
(`averyn-docs/development/coding-standard.md`).
