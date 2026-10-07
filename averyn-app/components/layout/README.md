# layout

Marco de las pantallas con sesion iniciada: el App Shell (AVY-001).

## Responsabilidad

Lo que no cambia al pasar de una pantalla a otra: cabecera con la marca, el dock de
modulos, la busqueda, las notificaciones y el menu de usuario; el enlace
"Saltar al contenido" y el contenedor `<main id="contenido">` donde cada pantalla
pone lo suyo.

No contiene logica de negocio ni llama a la API. Las pantallas de cada
funcionalidad viven en `features/` y se montan dentro del shell desde
`app/(app)/layout.tsx`.

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `app-shell.tsx` | Server Component: skip link, cabecera y contenido principal |
| `app-navbar.tsx` | Client Component: dock con el modulo actual, buscador y menu de usuario |
| `notifications-menu.tsx` | Client Component: campana con los avisos recientes (`NotificationItem`) |
| `modules.ts` | Modulos del dock (`APP_MODULES`) y `isModuleActive` |
| `use-dismiss.ts` | Hook que cierra un desplegable con un clic fuera o con Escape |

Los estilos estan en `app/styles/av-shell.css` y reutilizan `av-nav`, `av-dock`,
`av-avatar`, `av-menu` e `av-iconbtn` del Design System.

## Como se usa

```tsx
// app/(app)/layout.tsx
<AppShell user={user} onLogout={logout} notifications={avisos}>{children}</AppShell>
```

## Estado actual

- El usuario de `app/(app)/layout.tsx` es de demostracion (`TODO(AVY-005)`).
- **[MOCK]** Los avisos de la campana son los ultimos eventos biometricos que el
  layout de servidor arma con `biometricService.listEvents()`; las verificaciones
  enlazan a su resultado y los registros al historial filtrado por persona.
  `TODO(AVY-006)`: reemplazar por `GET /notifications` cuando exista el modulo.
- El menu de usuario muestra "Cerrar sesion" solo si recibe `onLogout`.
- El buscador navega con Enter al listado de Identidad con el texto como filtro
  (`/identity?q=...`), que es el unico modulo con busqueda hoy.

## Pruebas

`tests/layout/modules.test.ts` cubre `isModuleActive` y la lista de modulos
(`npm run test:unit`). La accesibilidad y el teclado se comprueban con
`npm run test:a11y` (ver `tests/accessibility/README.md`).

## Decisiones pendientes

- **⚑ Sesion:** el usuario real y el cierre de sesion dependen del contrato de Auth (#05) y de AVY-005.
