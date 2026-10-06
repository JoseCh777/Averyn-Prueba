# ai

Módulo de IA (ruta `/ai`).

## Responsabilidad

Es un marcador: explica que los modelos de inteligencia artificial (reconocimiento facial, detección de
vida, clasificación de documentos) se integran en una fase posterior. Los modelos los ejecuta el Core
(AGENTS §6); el navegador no los ejecuta.

## Ficheros

| Fichero | Responsabilidad |
|---|---|
| `components/ai-view.tsx` | La pantalla con su cabecera y el aviso |

La ruta es `app/(app)/ai/page.tsx`.

## Estado actual

Sin datos, sin servicio y sin acciones. Cuando exista el módulo en el Core se agregarán el servicio
(interfaz + implementación) y las pantallas.
