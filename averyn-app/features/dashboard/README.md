# dashboard

Pantalla principal tras iniciar sesion (AVY-006, Dashboard base).

## Responsabilidad

Mostrar un panel con datos simples y trazables: la bienvenida, cuatro indicadores, los
accesos rapidos a los modulos y la actividad reciente. Cada cifra es un conteo de los datos
de origen; no hay estadisticas ni cifras inventadas. No contiene reglas de negocio: los
conteos son presentacion y el Core sera la autoridad cuando entregue el resumen (AGENTS 6).

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `types.ts` | Datos de origen (personas, dispositivos, procesos, eventos) y resumen que muestra la pantalla |
| `summary.ts` | `buildDashboardSummary`: arma indicadores, conteo por resultado y actividad reciente (funcion pura) |
| `mock-dashboard-data.ts` | **[MOCK]** Datos de demostracion con personas ficticias |
| `quick-access.ts` | Accesos rapidos y su ruta, tomada del registro de modulos del shell |
| `services/dashboard-service.ts` | Interfaz `DashboardService`: la frontera entre la pantalla y los datos |
| `services/mock-dashboard-service.ts` | **[MOCK]** Implementacion que calcula el resumen sobre los datos de demostracion |
| `services/index.ts` | Unico lugar que elige la implementacion |
| `components/dashboard-view.tsx` | Server Component asincrono: pide el resumen y compone la pantalla |
| `components/dashboard-hero.tsx` | Bienvenida con la figura de arcos |
| `components/quick-access-grid.tsx` | Mosaico de accesos rapidos |
| `components/recent-activity.tsx` | Panel de actividad: barras por resultado y linea de tiempo |

La ruta es `app/(app)/dashboard/page.tsx`, con `loading.tsx` (esqueleto) y `error.tsx`
(aviso y reintento). Los indicadores, mosaicos y el panel de actividad son del Design System
(`Kpi`, `Tile`, `ActivityPanel`); los estilos propios estan en `app/styles/av-dashboard.css`.

## Como se decide cada cifra

| Indicador | Calculo |
|---|---|
| Personas registradas | Cuantas personas hay; detalle: verificadas y pendientes |
| Verificaciones | Eventos de tipo verificacion (los registros no cuentan); detalle: exitosas y rechazadas |
| Procesos electorales | Los abiertos o en borrador; detalle: el total |
| Dispositivos conectados | Los conectados; con alguno desconectado el detalle se marca como atencion |

El grafico de barras cuenta **todos** los eventos del log; la linea de tiempo muestra los 4
mas recientes. `rejected` (no coincide) es un resultado valido de negocio, no un error.
Las fechas se muestran como `dd/mm/aaaa, hh:mm` en hora de Lima (coding-standard 62).

## Estado actual

- **[MOCK]** Los datos y el servicio son de demostracion (`TODO(AVY-006)`): se reemplazan por
  el resumen real del Core cuando existan Identidad, Biometria y Electoral.
- Un acceso rapido sin pantalla se muestra con la etiqueta «Proximamente» y no enlaza. Cuando
  una funcionalidad agrega el `href` de su modulo en `components/layout/modules.ts`, su acceso
  se convierte en enlace sin tocar el dashboard.
- Falta el enlace «Ver historial completo» del prototipo: no existe la pantalla de historial.
- Estados: cargando (`loading.tsx`), vacio (sin eventos muestra «Sin actividad reciente») y
  error (`error.tsx`).

## Pruebas

`tests/dashboard/` cubre el resumen (con los datos de demostracion y casos limite: sin datos,
procesos cerrados, dispositivos todos conectados, persona desconocida), los plurales, el
formato de fechas y los accesos rapidos (`npm run test:unit`). La accesibilidad se comprueba
con la sesion de demostracion:

```bash
AUDIT_COOKIE="averyn_mock_session=1" npm run test:a11y -- http://localhost:3000 dashboard
```

## Decisiones pendientes

- **⚑ Resumen del Core:** definir si el Core entrega el resumen calculado o los datos de origen; hoy se calcula en el frontend solo porque los datos son de demostracion.
- **⚑ Historial y notificaciones:** el enlace de historial y la campana del shell no tienen funcion todavia.
