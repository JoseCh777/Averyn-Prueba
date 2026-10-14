# access

Módulo de Accesos: la **consola del operador de puerta** (ruta `/access`). Atiende a una persona a
la vez, de la identificación al resultado `GRANTED` / `DENIED`, y muestra el aforo del evento.

Es la UI de AVY-052 y trabaja contra un mock del contrato `contracts/access-contract.md` v0.1.

## Responsabilidad

- Elegir el **punto de control** (y el sentido si admite entrada y salida) y mostrar su política.
- Pedir los factores de la política, grupo por grupo: `QR`, `FACE`, `FINGERPRINT`.
- Identificar a la persona: leyendo el QR, o con una captura 1:N cuyo candidato **confirma el operador**.
- Mostrar el resultado de lejos y de un vistazo, con el motivo en una frase.
- Mostrar el aforo y los accesos recientes, que se refrescan solos tras cada intento.

No decide nada de negocio: la política, el anti-passback, el aforo y el desenlace biométrico son del
servicio (AGENTS §6). El navegador nunca decide un `GRANTED`.

## Flujo

```text
Punto de control ─▶ Grupo 1 ─▶ Grupo 2 ─▶ … ─▶ access-requests ─▶ GRANTED | DENIED
                    │
                    ├─ QR ........ identify (QR) ───────────▶ persona identificada
                    └─ Rostro .... identify 1:N ─▶ candidatos ─▶ el operador confirma
```

- Un grupo se cumple con **cualquiera** de sus métodos; para entrar se cumplen **todos**.
- Una salida sin política solo pide elegir quién sale de entre quienes están dentro.
- Tras `NO_MATCH`, `LIVENESS_FAILED` o `VERIFICATION_ERROR` se puede **repetir la verificación**
  conservando a la persona y el QR (el QR no se consume si el acceso no se concede).

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `types.ts` | Tipos del contrato: métodos, política, punto de control, decisión, motivos, aforo y registro |
| `access-rules.ts` | Funciones puras: paso siguiente, comprobaciones previas en orden, normalizar el QR, validar lo que llega del navegador |
| `gate-flow.ts` | Estado puro del paso a paso (`gateReducer`) y paso actual |
| `labels.ts` | Textos en **usted**, chips, iconos y resumen de la política |
| `routes.ts` | `ACCESS_PATH` |
| `actions.ts` | `identifyAction`, `requestAccessAction` y `resetDemoAction` (mock): exigen sesión y validan de nuevo |
| `mock-access.ts` | **[MOCK]** Evento, puntos de control, padrón y códigos QR de demostración |
| `services/access-service.ts` | Interfaz `AccessService` y `InvalidAccessRequestError` |
| `services/mock-access-service.ts` | **[MOCK]** Implementación en memoria del servidor |
| `services/index.ts` | Único lugar que elige la implementación |
| `components/access-view.tsx` | Pantalla (Server Component): lee y compone |
| `components/gate-console.tsx` | Consola interactiva (cliente): despacha el estado y llama a las acciones |
| `components/checkpoint-picker.tsx`, `policy-steps.tsx` | Punto de control y pasos de la política |
| `components/qr-step.tsx`, `biometric-step.tsx`, `candidate-list.tsx` | Lectura del QR, captura facial o de huella, y elección de persona |
| `components/access-result.tsx` | Tarjeta de resultado grande |
| `components/occupancy-panel.tsx`, `recent-access.tsx` | Aforo y accesos recientes (Server Components) |
| `components/demo-panel.tsx` | **[MOCK]** Fuerza el resultado de la captura y reinicia la demostración |

Las rutas están en `app/(app)/access/` con `loading.tsx` y `error.tsx`. Los estilos propios son
`app/styles/av-access.css`; reutiliza el stepper de `av-elections.css` y los visores de Biometría.

## Escenario de demostración

Evento «Asamblea anual 2026», aforo 5, con 2 personas dentro.

| Punto de control | Sentido | Política |
|---|---|---|
| Puerta principal | Entrada y salida | `Código QR` y (`Rostro` o `Huella`) |
| Acceso preferente | Entrada | `Rostro` (identificación 1:N) |
| Salida lateral | Salida | Sin verificación |

Los atajos del campo de QR muestran cada resultado: válido, vencido, ya usado, ya dentro, revocado,
sin biometría registrada e inválido. El panel «Demostración» fuerza el resultado de la captura
(coincide, no coincide, vivacidad, servicio no disponible) y permite que otra persona se presente
ante el lector para ver un rechazo por suplantación.

## Privacidad

- La imagen de la cámara no se guarda, no se envía ni queda en el estado; solo se avisa que terminó.
- El valor del QR vive en la memoria del navegador hasta enviar el intento y se vacía del campo al
  enviarlo. El registro de accesos nunca lo guarda.
- No hay `localStorage` ni `sessionStorage`.

## Decisiones y pendientes

- **Catálogo de `DenyReason` abierto (⚑).** El contrato v0.1 no lo cierra; la interfaz decide por el
  código, nunca por el texto.
- **Forma de `capture` abierta (⚑).** Depende de Face (`face-contract.md`) y Fingerprint; el mock
  solo lleva el desenlace simulado.
- **Sin decisión manual del operador:** fuera del MVP según el contrato.
- **Permisos:** el repositorio no tiene modelo de permisos. El Core validará `event:checkin`
  (`TODO(AVY-005)`).
- **Cambio al servicio real:** `TODO(AVY-048)` en `services/index.ts`; retirar `mock-access.ts`,
  `resetDemoAction` y `demo-panel.tsx`.

## Pruebas

`tests/access/`: reglas puras (`access-rules`), estado del paso a paso (`gate-flow`) y el servicio
mock (`mock-access-service`). Ruta `access` incluida en `npm run test:a11y`.
