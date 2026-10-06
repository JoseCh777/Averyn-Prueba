# elections

Módulo Electoral: la lista de procesos y el asistente para crear uno (rutas `/elections` y
`/elections/new`).

## Responsabilidad

Listar las convocatorias creadas con su estado y crear una nueva por pasos: información general,
configuración de la votación, participantes y revisión. Un proceso nuevo siempre nace como
**borrador**. El padrón es el catálogo de Identidad: no hay una lista aparte de votantes.

No incluye todavía candidatos, votación ni resultados: el modelo actual no tiene candidatos y el
tarjetón de demostración del Design System se retiró de la aplicación (sigue en el catálogo).

Las reglas son de validación y de conteo. El Core será la autoridad sobre un proceso (AGENTS §6).

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `types.ts` | Proceso, estado, configuración, participantes y datos del formulario |
| `labels.ts` | Textos de institución, tipo, votación, modalidad y chip de cada estado |
| `election-rules.ts` | Funciones puras: validar cada paso, contar el padrón, validar lo que llega a la acción |
| `services/election-service.ts` | Interfaz `ElectionService` y `DuplicateElectionNameError` |
| `services/mock-election-service.ts` | **[MOCK]** Implementación en memoria del servidor (empieza vacía) |
| `services/index.ts` | Único lugar que elige la implementación |
| `actions.ts` | `createElectionAction`: valida de nuevo todo y crea el proceso |
| `components/elections-view.tsx`, `elections-table.tsx` | Listado (Server Components) |
| `components/new-election-view.tsx` | Pantalla del asistente (Server Component) |
| `components/election-wizard.tsx` | El asistente (estado y navegación) |
| `components/general-step.tsx`, `settings-step.tsx`, `participants-step.tsx`, `review-step.tsx` | Los cuatro pasos |

Las rutas están en `app/(app)/elections/` con `loading.tsx` y `error.tsx`. Los estilos propios son
`app/styles/av-elections.css`; el progreso, las superficies y el formulario son de `av-page.css`.

## Reglas de validación

| Campo | Regla |
|---|---|
| Nombre | Obligatorio, hasta 120 caracteres y único (sin distinguir mayúsculas ni tildes) |
| Descripción | Obligatoria, hasta 500 caracteres |
| Institución, tipo | Una de las opciones |
| Fecha de inicio | Una fecha que existe y no anterior a hoy (hoy en hora de Lima) |
| Fecha de fin | Una fecha que existe y no anterior a la de inicio |
| Tipo de votación, modalidad | Obligatorios |
| Opciones por voto | De 1 a 5; en **voto único** siempre 1 |
| Participantes | La afiliación elegida debe tener al menos una persona en el padrón |

## Decisiones

- **El padrón sale de Identidad:** una persona nueva aparece al instante como posible participante.
- **Se convoca por afiliación** (o a todas) y el resumen separa a los **verificados**, que son
  quienes podrán votar; avisa si hay pendientes. En el prototipo el filtro era solo informativo y la
  cantidad siempre era el total del padrón.
- **Voto único fija las opciones en 1:** antes se podía guardar «voto único» con 4 opciones.
- **El nombre repetido se rechaza también en el servidor** (dos personas podían crear el mismo a la vez).
- **Las fechas se validan de verdad:** el prototipo dejaba pasar fechas que no existen.
- **La modalidad no puede quedar vacía** (el prototipo tenía una validación que nunca se activaba).

## Estado actual

- **[MOCK]** El servicio es de demostración (`TODO(AVY-010)`): los procesos viven en la memoria del
  servidor y empiezan vacíos, como el prototipo. Los demás estados (en curso, cerrado, conteo…) existen
  para pintar el chip, pero ninguna pantalla cambia el estado todavía.
- El listado no tiene detalle, edición ni cancelación de un proceso.
- «Rol del votante» y «Puesto de votación» (que el prototipo pedía en el pre-registro) se capturarán aquí
  cuando exista el padrón electoral propio.

## Pruebas

`tests/elections/` cubre las reglas (cada paso, el padrón, lo que llega a la acción) y el servicio mock.
Accesibilidad con la sesión de demostración:

```bash
AUDIT_COOKIE="averyn_mock_session=1" npm run test:a11y -- http://localhost:3300 elections elections/new
```
