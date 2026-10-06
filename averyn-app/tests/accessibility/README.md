# accessibility

Auditoria de accesibilidad del frontend (coding-standard 70 y 71).

## Responsabilidad

Comprobar que las paginas cumplen WCAG 2.2 AA y se pueden usar con teclado, sin
scroll horizontal y sin errores de consola, a 1440 px y a 375 px. No contiene
logica del producto: solo recorre paginas y reporta.

No sustituye la prueba con lector de pantalla (NVDA, Narrador, VoiceOver), ni la
de otros navegadores, ni la de un movil fisico.

## Requisitos

- Node.js >= 20.9.
- Un navegador instalado. Por defecto Microsoft Edge; para otro, `BROWSER_CHANNEL=chrome`.
- Dependencias de desarrollo (`npm ci`): `playwright-core`, `axe-core` y `tsx`.

## Uso

```bash
npm run build && npm run start        # en otra terminal (npm run start -- -p 3200 si el 3000 esta ocupado)

npm run test:a11y                                           # todas las pantallas, en localhost:3000
npm run test:a11y -- http://localhost:3200                  # otro servidor
npm run test:a11y -- http://localhost:3000 dashboard login  # rutas concretas
```

Para pantallas que exigen sesion (como `dashboard`), `AUDIT_COOKIE=nombre=valor` envia esa
cookie en cada peticion; con la sesion de demostracion: `AUDIT_COOKIE="averyn_mock_session=1"`.

Las rutas se escriben **sin barra inicial**: en Git Bash un argumento que empieza
por `/` se convierte en una ruta de Windows.

El proceso termina con codigo `1` si encuentra algun problema, de modo que sirve
para CI.

## Que comprueba

| Comprobacion | Como | Ancho |
|---|---|---|
| Accesibilidad | axe-core con las reglas `wcag2a`, `wcag2aa` y `wcag22aa` | 1440 y 375 |
| Desborde horizontal | `scrollWidth - clientWidth` | 1440 y 375 |
| Errores de consola | `pageerror` y mensajes de tipo `error` | 1440 y 375 |
| Teclado | Tab recorre la pagina: cada elemento debe mostrar foco y tener nombre accesible | 1440 |
| Respuesta HTTP | una pagina con codigo >= 400 es un problema | 1440 y 375 |

No se excluye ningun elemento de axe (`AXE_EXCLUDED_SELECTORS` esta vacio): la aplicacion no tiene muestras
de ejemplo que fallen a proposito.

## Estructura

| Fichero | Responsabilidad |
|---|---|
| `run-accessibility-audit.ts` | Punto de entrada: abre el navegador, audita cada ruta y fija el codigo de salida |
| `route-audit.ts` | Audita una ruta: carga la pagina en cada ancho y reune los problemas |
| `axe-audit.ts` | Ejecuta axe-core y mide el desborde horizontal |
| `keyboard-audit.ts` | Recorre la pagina con Tab y revisa foco y nombre accesible |
| `cli-arguments.ts` | Interpreta los argumentos y construye las URL |
| `report.ts` | Tipos del informe, formato de salida y codigo de salida |
| `audit-settings.ts` | Constantes: anchos, reglas, rutas por defecto, esperas |
| `*.test.ts` | Pruebas unitarias de `cli-arguments` y `report` |

## Pruebas

```bash
npm run test:unit
```

Las pruebas unitarias cubren las funciones puras (argumentos y informe). El
recorrido con navegador se ejecuta con `npm run test:a11y` sobre un servidor
levantado; no hay prueba de integracion automatica todavia.

## Dependencias (coding-standard 56)

| Paquete | Version | Para que | Licencia |
|---|---|---|---|
| `playwright-core` | 1.63.0 | Controlar el navegador (sin descargar navegadores propios) | Apache-2.0 |
| `axe-core` | 4.10.2 | Motor de reglas de accesibilidad | MPL-2.0 |
| `tsx` | 4.20.6 | Ejecutar TypeScript sin compilar (ya se usa en `averyn-core`) | MIT |

Las tres son `devDependencies` con version exacta y no entran en el bundle.

## Decisiones pendientes

- **Integracion en CI:** falta decidir si se ejecuta en cada PR (requiere un navegador en el runner).
- **Framework de pruebas del frontend:** se usa el runner nativo `node:test` con `tsx`, igual que `averyn-core`; la eleccion global sigue abierta.
- **Rutas del producto:** cuando existan Login y Dashboard se anaden a `DEFAULT_ROUTES`.
