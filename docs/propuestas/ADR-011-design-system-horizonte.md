# ADR-011 — Design System Horizonte como guía visual única del frontend

* **Estado:** Propuesto (borrador para revisión; no es vinculante hasta que lo apruebe el responsable técnico)
* **Fecha:** 2026-10-05
* **Decisión propuesta:** El Design System **Horizonte** es la única guía visual del frontend de Averyn. Sus tokens viven en `app/globals.css`, sus componentes se implementan en `components/ui` (React 19 + TypeScript estricto, CSS propio, sin dependencias nuevas en la primera semana) y toda pantalla nueva los usa. Los puntos de §6 se deciden al aprobar el ADR.
* **Ámbito:** `averyn-web`: estilos, componentes, tipografía, breakpoints y revisión de PR. No cambia la arquitectura de carpetas ni la comunicación con el Core.
* **Responsable propuesto:** Daniel (aprobación); José (implementación, AVY-002).

> Borrador preparado fuera de los repositorios oficiales. Para publicarlo: copiarlo a `averyn-docs/decisions/` en una rama `docs/AVY-002-adr-design-system` desde `develop` y abrir PR hacia `develop` (nadie valida su propio trabajo).

## 1. Contexto

`averyn-web/AGENTS.md` §9 fija convenciones de diseño: prefijo `av-`, Plus Jakarta Sans para títulos, Inter para cuerpo, breakpoints 576 / 768 / 1024 / 1280 y tokens en `app/globals.css`. `app/globals.css` hoy solo tiene colores provisionales. El estándar de código exige accesibilidad (§70), responsive probado a 375 y 1440 px (§71) y que todos los componentes usen el Design System, creando ahí el que falte (§72).

Existe un sistema de diseño completo, **Horizonte** (versión 1.7), documentado en un HTML único: fundamentos, 23 secciones de componentes, patrones biométricos y electorales, 15 plantillas de pantalla, estados, calidad y gobernanza. Cumple WCAG 2.2 AA (axe sin violaciones, recorrido de teclado sin problemas) y ya usa los tokens `--av-*` e Inter. Está hecho en HTML, CSS y JavaScript sin framework.

## 2. Problema

1. El sistema y `AGENTS.md` §9 difieren en tres puntos: prefijo (`hz-` frente a `av-`), fuente de títulos (Space Grotesk frente a Plus Jakarta Sans) y breakpoints (las páginas de la guía usan valores sueltos).
2. No hay un acuerdo escrito de que Horizonte sea la guía vigente, y sin él cada pantalla puede inventar estilos.
3. Hay que portar el sistema a React y TypeScript sin frenar a Jorge y Mateo, que construyen pantallas en paralelo.
4. El estándar (§56) exige justificar cada dependencia nueva.

## 3. Decisión propuesta

1. **Horizonte es la única guía visual.** No se crean estilos ni componentes paralelos; si falta un componente, se diseña primero en Horizonte (§72) y después se implementa.
2. **Tokens** de Horizonte en `app/globals.css` con nombres `--av-*`.
3. **Componentes** en `components/ui` (genéricos) y `components/shared` (compuestos); lo específico de una funcionalidad en `features/<x>/components/`. Tipados, en inglés (§75) y con `'use client'` solo donde haya interacción.
4. **Sin dependencias nuevas** en la primera semana (AVY-001 a AVY-005); cualquier librería posterior pasa por la checklist de §56 y su propio ADR.
5. **Cumplimiento:** la revisión de cada PR de frontend incluye «Consistencia con el Design System» y «sin colores sueltos fuera de tokens».
6. **Alcance del contenido:** las plantillas marcadas «Futuro · fuera del MVP oficial» (2FA, recuperación por correo, invitación, selector de institución, mesas, notificaciones, escrutinio) no se implementan.

## 4. Comparación de alternativas

| Alternativa | Ventajas | Inconvenientes |
|---|---|---|
| **A. Horizonte como guía única, portado con CSS propio (propuesta)** | Sin dependencias; coincide con la pila actual; se reutiliza lo ya diseñado y probado | Hay que portar y mantener los componentes a mano |
| B. Horizonte sobre Tailwind + shadcn/ui | Componentes accesibles ya hechos | Dependencias fundamentales nuevas (§56, `AGENTS.md` §8) y cambio de pila; costo de adopción en la semana más cargada |
| C. Mantener solo `AGENTS.md` §9 y diseñar sobre la marcha | Sin trabajo de portado | Cada pantalla diverge; se pierde lo ya validado en accesibilidad |

Se propone A. B queda como evolución posible, con ADR propio, después del Gate 1.

## 5. Cómo se aplica en el MVP

* **AVY-001 (App Shell):** tokens y piezas mínimas (Button, Field/Input, Alert, Chip, Spinner/Skeleton) en `components/ui`.
* **AVY-002 (integración):** incremental; cada componente se publica en `components/ui` y se marca en la documentación de Horizonte. Jorge y Mateo consumen lo que ya existe.
* **AVY-003 (Login):** plantilla «Login» de Horizonte con sus cinco estados, decididos por el `code` de la API.
* **Pruebas:** axe y teclado en cada pantalla; ancho de 375 y 1440 px sin scroll horizontal.
* **Reglas de Auth y biometría** (mensajes genéricos, ERROR distinto de NO_MATCH, consentimiento antes de capturar) ya están en los patrones de Horizonte.

## 6. Decisiones que deben tomarse al aprobar ⚑

| # | Punto | Propuesta |
|---|---|---|
| 1 | Prefijo de clases | **Mantener `av-`** y renombrar `hz-*` al portar; así `AGENTS.md` §9 no cambia en este punto |
| 2 | Fuente de títulos | **Plus Jakarta Sans** (ya cargada con `next/font`), o Space Grotesk si se decide así, pero una sola; actualizar el sistema o el `AGENTS.md` |
| 3 | Fuente monoespaciada | JetBrains Mono no está cargada en `layout.tsx`; cargarla con `next/font` o usar la mono del sistema |
| 4 | Breakpoints | **576 / 768 / 1024 / 1280** (ya alineados en la guía) |
| 5 | Dependencias | Ninguna nueva hasta el Gate 1 |
| 6 | Dónde vive la documentación de Horizonte en la organización | Sin decidir; pendiente de acuerdo con el equipo |

## 7. Consecuencias

**Positivas:** una sola guía; menos retrabajo en las pantallas de Jorge y Mateo; accesibilidad conocida; revisión de PR con criterio claro.

**Negativas:** hay que portar el sistema a React (el esfuerzo es de la semana 1 y debe avanzar por piezas); la guía en HTML y los componentes pueden desincronizarse si no se actualizan juntos.

**Riesgo principal:** el Día 3 ya concentra AVY-002, AVY-003 y AVY-004. Mitigación: portar solo lo que cada pantalla necesita ese día.

## 8. Relación con otros documentos

* `averyn-web/AGENTS.md` §8 (dependencias), §9 (Design System; ver propuesta de reescritura) y §12 (cambios arquitectónicos).
* `development/coding-standard.md` §56, §70, §71, §72, §75 y §21–23.
* ADR-010 y `contracts/auth-contract.md` v0.2 (códigos de error que alimentan las pantallas).
* Documento maestro y HTML único de Horizonte (v1.7), sección «Alineación con la arquitectura oficial».

## 9. Estado

**Propuesto.** No modifica ningún ADR aceptado. Para pasar a **Aceptado** debe revisarlo alguien distinto de quien lo redactó y aprobarlo el responsable técnico; al aceptarse, se actualiza `AGENTS.md` §9 con el texto de `averyn-web-AGENTS-seccion-9.md`.
