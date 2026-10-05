# Propuesta de reescritura — `averyn-web/AGENTS.md` §9

> Borrador. Solo se aplica cuando ADR-011 pase a **Aceptado**. Los valores marcados ⚑ dependen de los puntos abiertos de §6 del ADR.

## Texto actual

```markdown
## 9. Design System

Los componentes visuales deben respetar el Design System definido por Averyn.

No crear estilos o componentes visuales paralelos que contradigan las decisiones existentes.

Convenciones vigentes:

* prefijo `av-` para clases y nombres de componentes
* Plus Jakarta Sans para headings
* Inter para body
* breakpoints: 576, 768, 1024 y 1280
* los tokens globales viven en `app/globals.css`

Los componentes del Design System deben crecer de forma ordenada: genéricos y reutilizables en `components/`, específicos de una funcionalidad dentro de `features/<funcionalidad>/components/`.
```

## Texto propuesto

```markdown
## 9. Design System

El Design System **Horizonte** es la única guía visual de Averyn (ADR-011). Todo componente y toda pantalla lo usan; no se crean estilos ni componentes paralelos.

Convenciones vigentes:

* tokens `--av-*` en `app/globals.css`, expuestos a Tailwind v4 con `@theme` ⚑
* Plus Jakarta Sans para headings ⚑
* Inter para body
* breakpoints: 576, 768, 1024 y 1280
* no se usan colores, tamaños ni sombras sueltos fuera de los tokens
* accesibilidad WCAG 2.2 AA y responsive probado a 375 y 1440 px (coding-standard §70 y §71)

Dónde vive cada cosa:

* genéricos y reutilizables: `components/ui/`
* compuestos que mezclan varios genéricos: `components/shared/`
* efectos de marca (Aceternity adaptado): `components/effects/`, solo en superficies de marca
* específicos de una funcionalidad: `features/<funcionalidad>/components/`

Reglas de trabajo:

* si falta un componente, se diseña primero en Horizonte y luego se implementa (coding-standard §72)
* los componentes son tipados, con nombres en inglés (§75), y usan `'use client'` solo cuando tienen interacción
* librerías de UI aprobadas en ADR-011: Tailwind v4 (estilos), shadcn/ui con Base UI (comportamiento), Aceternity UI y `motion` (solo efectos de marca, en `components/effects/`) y Lineicons (iconos); cualquier otra pasa por el checklist de §56 y un ADR (ver §8)
* las páginas no importan esas librerías directamente: se consumen desde `components/*`
* la revisión de cada PR de frontend incluye la casilla «Consistencia con el Design System»
* las plantillas marcadas «Futuro · fuera del MVP oficial» en la documentación de Horizonte no se implementan
```

## Qué cambia

| Punto | Antes | Después |
|---|---|---|
| Autoridad | «el Design System definido por Averyn» | Horizonte, citado por ADR-011 |
| Tokens | Viven en `app/globals.css` | Igual, y se prohíben valores sueltos |
| Carpetas | `components/` | `components/ui/` y `components/shared/` (alineado con arquitectura 10 §16) |
| Calidad | No se mencionaba | Accesibilidad AA y prueba a 375 y 1440 px |
| Dependencias | No se mencionaba | Remite a §8 y §56 |

`AGENTS.md` §12 exige documentar y aprobar los cambios arquitectónicos antes de hacerlos: por eso esta reescritura viaja junto con el ADR, en la misma PR.
