# ADR-011 — Design System Horizonte como guía visual única del frontend

* **Estado:** Propuesto (borrador para revisión; no es vinculante hasta que lo apruebe el responsable técnico)
* **Fecha:** 2026-10-05
* **Decisión propuesta:** El Design System **Horizonte** (v2.0, en React) es la única guía visual del frontend de Averyn. Sus tokens `--av-*` viven en `app/globals.css` y se exponen a **Tailwind v4** con `@theme`; sus componentes se implementan en `components/ui` (React 19 + TypeScript estricto) con **shadcn/ui** como base de comportamiento, **Aceternity UI** solo para efectos de marca y **Bootstrap Icons** (como componentes SVG) como único set de iconos; Lineicons queda como opción futura. Los puntos de §6 se deciden al aprobar el ADR.
* **Ámbito:** `averyn-web`: estilos, componentes, tipografía, breakpoints y revisión de PR. No cambia la arquitectura de carpetas ni la comunicación con el Core.
* **Responsable propuesto:** Daniel (aprobación); José (implementación, AVY-002).

> Borrador preparado fuera de los repositorios oficiales. Para publicarlo: copiarlo a `averyn-docs/decisions/` en una rama `docs/AVY-002-adr-design-system` desde `develop` y abrir PR hacia `develop` (nadie valida su propio trabajo).

## 1. Contexto

`averyn-web/AGENTS.md` §9 fija convenciones de diseño: prefijo `av-`, Plus Jakarta Sans para títulos, Inter para cuerpo, breakpoints 576 / 768 / 1024 / 1280 y tokens en `app/globals.css`. `app/globals.css` hoy solo tiene colores provisionales. El estándar de código exige accesibilidad (§70), responsive probado a 375 y 1440 px (§71) y que todos los componentes usen el Design System, creando ahí el que falte (§72).

Existe un sistema de diseño completo, **Horizonte** (versión 1.7), documentado en un HTML único: fundamentos, 23 secciones de componentes, patrones biométricos y electorales, 15 plantillas de pantalla, estados, calidad y gobernanza. Cumple WCAG 2.2 AA (axe sin violaciones, recorrido de teclado sin problemas) y ya usa los tokens `--av-*` e Inter. Está hecho en HTML, CSS y JavaScript sin framework. El equipo decidió crear la **v2.0 con todos los componentes en React**, con Aceternity UI para efectos de marca; los iconos siguen siendo Bootstrap Icons (Lineicons se evaluó y quedó aplazado).

## 2. Problema

1. El sistema y `AGENTS.md` §9 difieren en tres puntos: prefijo (`hz-` frente a `av-`), fuente de títulos (Space Grotesk frente a Plus Jakarta Sans) y breakpoints (las páginas de la guía usan valores sueltos).
2. No hay un acuerdo escrito de que Horizonte sea la guía vigente, y sin él cada pantalla puede inventar estilos.
3. Hay que portar el sistema a React y TypeScript sin frenar a Jorge y Mateo, que construyen pantallas en paralelo.
4. El estándar (§56) exige justificar cada dependencia nueva, y la v2.0 propone varias (Tailwind, shadcn/ui, Aceternity, `motion`, `react-bootstrap-icons`).

## 3. Decisión propuesta

1. **Horizonte es la única guía visual.** No se crean estilos ni componentes paralelos; si falta un componente, se diseña primero en Horizonte (§72) y después se implementa.
2. **Tokens** `--av-*` de Horizonte en `app/globals.css`, expuestos a Tailwind v4 con `@theme inline` (una sola fuente de verdad, sin duplicar valores). Breakpoints oficiales 576 / 768 / 1024 / 1280 en `@theme`.
3. **Componentes** en `components/ui` (genéricos), `components/shared` (compuestos) y `components/effects` (efectos de marca); lo específico de una funcionalidad en `features/<x>/components/`. Tipados, en inglés (§75) y con `'use client'` solo donde haya interacción.
4. **Una librería por rol** (ver §4): Tailwind v4 (estilos), shadcn/ui con Base UI (comportamiento y accesibilidad; el código se copia al repositorio), Aceternity UI + `motion` (efectos de marca, MIT, también copiado), Bootstrap Icons con `react-bootstrap-icons` (iconos) y `clsx` + `tailwind-merge` + `class-variance-authority` (variantes). Cada una pasa por el checklist de §56 (resumido en §5).
5. **Aceternity solo en superficies de marca** (panel del login, héroes, landing). Nunca en pantallas de datos, formularios, biometría ni votación.
6. **Todo se consume vía `components/*`**; las páginas no importan estas librerías directamente. Cambiar o retirar una es tocar un solo lugar.
7. **Cumplimiento:** la revisión de cada PR de frontend incluye «Consistencia con el Design System» y «sin colores sueltos fuera de tokens».
8. **Alcance del contenido:** las plantillas marcadas «Futuro · fuera del MVP oficial» (2FA, recuperación por correo, invitación, selector de institución, mesas, notificaciones, escrutinio) no se implementan.

## 4. Comparación de alternativas

| Alternativa | Ventajas | Inconvenientes |
|---|---|---|
| **A. Tailwind v4 + shadcn/ui + Aceternity (efectos) + Bootstrap Icons, con tokens `--av-*` (propuesta)** | Componentes accesibles ya resueltos; efectos de marca sin escribirlos de cero; tokens propios como ley; el código es nuestro | Introduce Tailwind y varias dependencias (§56); requiere disciplina para que Aceternity no entre en pantallas de datos |
| B. CSS propio, sin dependencias nuevas | Cambio mínimo de pila; cero dependencias | Hay que escribir a mano comportamiento y accesibilidad de modal, menú y combobox; los efectos hay que reimplementarlos |
| C. Mantener solo `AGENTS.md` §9 y diseñar sobre la marcha | Sin trabajo de portado | Cada pantalla diverge; se pierde lo validado en accesibilidad |

Se propone A. B queda como respaldo si el equipo no aprueba Tailwind.

## 5. Evaluación de cada librería (checklist §56)

Medido en `design-system-v2/` (Next 16.3.8, React 19.2.8), 5 de octubre de 2026.

| Librería | Rol | Licencia | Peso medido | Hallazgos |
|---|---|---|---|---|
| Tailwind v4 | Estilos | MIT | Solo CSS | Requisito de shadcn y Aceternity |
| shadcn/ui + Base UI | Comportamiento | MIT | Código copiado | El CLI trae `lucide-react` y un paquete `cn` ajeno si se acepta el valor por defecto: se retiraron; los iconos se resuelven con Bootstrap Icons |
| Aceternity UI | Efectos de marca | MIT (componentes gratis; bloques Pro de pago, fuera de alcance) | Depende de `motion` | **Cada componente se revisa antes de usarse**: «Background Beams» trae 50 degradados animados sin fin, `Math.random()` en el render (rompe la hidratación en SSR), colores violeta fuera de la paleta y no respeta `prefers-reduced-motion`. Se adaptó (13 haces, determinista, tokens de marca, estático con movimiento reducido) |
| `motion` | Animación | MIT | **≈ 48 KB gzip** (≈ 22 % del JS de la página de prueba) | `MotionConfig reducedMotion="user"` **no** detiene animaciones de atributos SVG: se usa `useReducedMotion()` |
| Bootstrap Icons (`react-bootstrap-icons`) | Iconos | MIT | Despreciable: iconos como componentes SVG importados uno a uno (tree-shaking); registro propio en `components/ui/icon.tsx` | Cubre los 76 iconos que usa Horizonte con el mismo nombre que en la v1.7 (`bi-check-circle` → `name="check-circle"`), incluidos información, advertencia y huella. Es la decisión del equipo (5-oct-2026) |
| Lineicons (evaluado, **aplazado**) | Iconos (opción futura) | MIT (set gratis); los Pro no están en npm | Con tree-shaking | El set gratis tiene **855 iconos** (no los 31 204 que anuncia su README: esa cifra es del plan Pro) y **faltan** información, advertencia, huella y reloj. Solo se retomaría con la licencia Pro |

Cobertura de iconos: de los 76 de Bootstrap Icons que usa Horizonte, el set gratuito de Lineicons cubría aproximadamente la mitad, por lo que el equipo decidió **seguir con Bootstrap Icons** y dejar Lineicons mencionado para un posible uso futuro (p. ej. con la licencia Pro).

## 6. Cómo se aplica en el MVP

* **AVY-001 (App Shell):** tokens y piezas mínimas (Button, Field/Input, Alert, Chip, Spinner/Skeleton, Icon) en `components/ui`.
* **AVY-002 (integración):** incremental; cada componente se publica en `components/ui` y se marca en la documentación de Horizonte. Jorge y Mateo consumen lo que ya existe.
* **AVY-003 (Login):** plantilla «Login» de Horizonte con sus cinco estados; el panel de marca puede llevar `BackgroundBeams`.
* **Pruebas:** axe y teclado en cada pantalla; ancho de 375 y 1440 px sin scroll horizontal; efectos con `prefers-reduced-motion`.
* **Reglas de Auth y biometría** (mensajes genéricos, ERROR distinto de NO_MATCH, consentimiento antes de capturar) ya están en los patrones de Horizonte.

## 7. Decisiones que deben tomarse al aprobar ⚑

| # | Punto | Propuesta |
|---|---|---|
| 1 | Introducir Tailwind v4 | **Sí**, con los tokens `--av-*` como fuente de verdad |
| 2 | Prefijo de clases | Con Tailwind desaparecen las clases `hz-*`; los tokens mantienen `--av-*` y los componentes React usan nombres en inglés. `AGENTS.md` §9 pasa a hablar de tokens, no de clases |
| 3 | Fuente de títulos | **Plus Jakarta Sans** (ya cargada con `next/font`), o Space Grotesk si se decide así, pero una sola; en el proyecto de prueba es una sola línea de `layout.tsx` |
| 4 | Fuente monoespaciada | JetBrains Mono no está cargada en `averyn-web`; cargarla con `next/font` o usar la mono del sistema |
| 5 | Breakpoints | **576 / 768 / 1024 / 1280** (ya en `@theme`) |
| 6 | Versiones | `averyn-web` usa Next 16.3.6; el proyecto de prueba, 16.3.8 |
| 7 | Aceternity Pro | Fuera de alcance mientras no haya decisión de licencia |
| 8 | Set de iconos | **Bootstrap Icons** (decidido); Lineicons Pro solo si el equipo compra la licencia |
| 9 | Dónde vive la documentación de Horizonte en la organización | Sin decidir; pendiente de acuerdo con el equipo |

## 8. Consecuencias

**Positivas:** una sola guía; menos retrabajo en las pantallas de Jorge y Mateo; accesibilidad resuelta por componentes probados; efectos de marca sin escribirlos de cero; revisión de PR con criterio claro.

**Negativas:** varias dependencias nuevas con su mantenimiento; hay que portar el sistema a React; la guía en HTML y los componentes pueden desincronizarse si no se actualizan juntos; `motion` suma ≈ 48 KB gzip a las páginas que lo usen (se carga solo donde haya efectos).

**Riesgos:** (1) un efecto de Aceternity sin revisar rompe accesibilidad o hidratación; (2) AVY-002, AVY-003 y AVY-004 avanzan a la vez; (3) cambiar de set de iconos más adelante. Mitigaciones: revisión obligatoria de cada efecto antes de entrar, portar solo lo que cada pantalla necesita y un único punto de entrada (`Icon`) para poder sustituir el set.

## 9. Relación con otros documentos

* `averyn-web/AGENTS.md` §8 (dependencias), §9 (Design System; ver propuesta de reescritura) y §12 (cambios arquitectónicos).
* `development/coding-standard.md` §56, §70, §71, §72, §75 y §21–23.
* ADR-010 y `contracts/auth-contract.md` v0.2 (códigos de error que alimentan las pantallas).
* Documento maestro y HTML único de Horizonte, sección «Alineación con la arquitectura oficial».
* Prototipo `design-system-v2/` (Averyn-Prueba): base de las mediciones de §5.

## 10. Estado

**Propuesto.** No modifica ningún ADR aceptado. Para pasar a **Aceptado** debe revisarlo alguien distinto de quien lo redactó y aprobarlo el responsable técnico; al aceptarse, se actualiza `AGENTS.md` §9 con el texto de `averyn-web-AGENTS-seccion-9.md`.
