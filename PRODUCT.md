# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Dos roles comparten el mismo panel, con permisos distintos:
- **Administradores institucionales** de universidades, empresas y entidades públicas: configuran la plataforma, gestionan personas y supervisan procesos.
- **Operadores de registro y verificación**: registran personas, capturan biometría y verifican identidad en el día a día.

## Product Purpose
Averyn centraliza en un solo panel la gestión de identidad, la verificación biométrica, el procesamiento documental (OCR), la inteligencia artificial y los procesos institucionales. Éxito: una organización puede registrar, verificar y auditar identidades sin saltar entre herramientas.

## Positioning
Averyn es una base de identidad institucional, no una aplicación de votaciones. El módulo electoral es solo uno de los procesos posibles sobre esa base.

## Operating Context
- Flujo central: Identidad (persona) → Documentos/OCR (pre-registro) → Biometría (registro, captura facial con cámara real, verificación 1:1) → procesos como Electoral.
- La captura biométrica usa la cámara del navegador (`getUserMedia`), que exige `localhost` o HTTPS.
- Sprint 1 es un frontend con datos simulados en `localStorage` (`averyn_personas`, `averyn.biometria.*`, `averyn_procesos_electorales`, sesión `averyn.session`); el backend (`averyn-backend/`) no está implementado.

## Capabilities and Constraints
- Módulos completos: Landing, Login, Dashboard, Identidad, Documentos/OCR, Biometría, Electoral. IA en desarrollo; Accesos y Administración pendientes (el dock enlaza a rutas inexistentes).
- Stack actual y a conservar: HTML, CSS y JavaScript sin framework ni paso de compilación; Bootstrap 5.3.3 e iconos por CDN; Design System propio por capas en `averyn-frontend/assets/css/` (clases `.av-*`).
- Una migración futura a React figura en la hoja de ruta del README; no está decidida para este trabajo.
- Terminología: "Identidad", "Biometría", "Documentos / OCR", "Electoral", "Accesos", "Administración".

## Brand Commitments
- Conservar el logo de Averyn (`averyn-frontend/assets/images/`) y los colores de marca: azul `#145FEE`, navy `#000C24` y cian `#00ACD2`.

## Evidence on Hand
- Logos en `averyn-frontend/assets/images/` y `assets/img/`; capturas en `assets/images/captures/`.
- Los datos mostrados en el panel son simulados. No existen clientes, testimonios, métricas reales ni cifras de uso: no inventarlos.

## Product Principles
1. **Base de identidad primero:** ningún módulo se presenta como el producto entero; Electoral es un proceso más.
2. **Datos trazables:** cada cifra del panel debe poder rastrearse a su fuente de datos, sin números inventados.
3. **Una sola fuente de verdad visual:** los módulos consumen el Design System, no crean estilos propios.
4. **Operación diaria sin fricción:** los operadores repiten registro y verificación muchas veces; claridad y rapidez antes que ornamento.
5. **Honestidad sobre el estado:** lo pendiente se muestra como pendiente, no como enlace roto.

## Accessibility & Inclusion
Sin estándar formal confirmado. El Design System ya exige foco visible y respeto a `prefers-reduced-motion`; no se fijó WCAG AA como requisito del producto.
