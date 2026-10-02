---
target: login
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:C:\\Users\\ASUS\\Documents\\UPC\\Proyectos\\Averyn-Prueba\\averyn-frontend\\login.html"
target_fingerprint: "sha256:b2de265390b138fe205139544376dfbeeffe248d7cbc0177b29e3f2fa7fdc1be"
target_path: "C:\\Users\\ASUS\\Documents\\UPC\\Proyectos\\Averyn-Prueba\\averyn-frontend\\login.html"
timestamp: 2026-10-02T02-55-57Z
slug: averyn-frontend-login-html
---
Method: dual-agent (A: diseño · B: detector y navegador). Objetivos: landing (index.html) y login (login.html).

## Design Health Score
Landing 19/32 (7 y 10 n/a, 59 %, Aceptable) · Login 24/40 (60 %, Aceptable).
Heurísticas landing: 1=3, 2=2, 3=2, 4=3, 5=2, 6=2, 7=n/a, 8=3, 9=2, 10=n/a.
Heurísticas login: 1=3, 2=2, 3=3, 4=3, 5=2, 6=3, 7=2, 8=3, 9=2, 10=1.

## Design Specificity Verdict
Landing: parcialmente específica; el hero (A que se vuelve palabra, cielo a navy, arcos) es propio, el resto es una fórmula intercambiable y no muestra rostro, huella ni documento (hay 3 capturas reales sin usar en assets/images/captures/).
Login: más específico; el formulario es genérico para un producto multi-institución.
Deterministic scan: 26 hallazgos, sin patrones de slop; falsos positivos medidos (cramped-padding x14, low-contrast login x2, all-caps-body x1); derivas reales de tokens.

## What's Working
1. Gesto de marca del hero (recorte diagonal medido, arcos que se dibujan, reduced-motion correcto).
2. Sistema disciplinado (mono en acciones, un solo azul, líneas de 1 px).
3. Base técnica sólida (sin desbordes, 0 errores de consola, skip link, aria-expanded).

## Priority Issues
- [P1] Hero retiene el mensaje (propuesta al 92 % de 330 vh), sin <h1>, cortes del wordmark en p≈.15 y .3. Fix: hero ~220vh, bajada antes, <h1>, promesa concreta. Comandos: clarify, animate.
- [P1] La landing no muestra el producto ni da camino a quien no tiene cuenta; la regla del horizonte se rompe tras el hero. Fix: capturas reales en los marcos, CTA de demostración, seguir oscureciendo. Comandos: layout, clarify.
- [P1] Teclado en la landing: anillo de foco invisible sobre el CTA azul (1,00:1); foco en elementos con opacity 0 al cargar; en el menú móvil el nav va antes del botón y Escape pierde el foco. Comandos: harden, audit.
- [P1] Login: foco a body al enviar, salto de 42 px, correo inválido marca la contraseña, sin aria-invalid, bordes ~1,4:1 y placeholders 3,5:1. Comandos: harden, clarify, polish.
- [P2] Contraste (1,92:1 en .mn-media__hint y palabras 3n de Tecnología; 4,37:1 en .mn-cta__side p) y contenido repetido con jerga. Comandos: distill, clarify, colorize.

## Persona Red Flags
Jordan: sin demostración, jerga, "olvidé" no hace nada. Sam: sin h1, foco invisible, "Mostrar" anuncia "Ocultar contraseña, pulsado". Casey: CTA tras ~2,3 pantallas, popover no funciona al tocar, objetivos < 44 px.

## Minor Observations
Dos wordmarks visibles a la vez; .lg-card con borde 1px y sombra 60px; radios 20/6 px fuera de escala; ~50 KB de CSS no usado; botón de menú de 11,2 px.

## Questions to Consider
¿Qué delata biometría si quitas el logo? ¿Para quién es la página? ¿Qué hace quien no tiene cuenta?
