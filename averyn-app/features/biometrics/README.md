# biometrics

Módulo de Biometría: registro y verificación de rostro y huella, captura, historial y dispositivos
(rutas bajo `/biometrics`).

## Responsabilidad

- **Registrar** una modalidad (rostro o huella) para una persona del catálogo de Identidad.
- **Verificar** a una persona comparando su captura con el registro (1:1).
- **Capturar:** pantalla compartida por los dos flujos, con cámara real para el rostro.
- **Historial:** cada registro o verificación deja un evento (auditoría) que se puede filtrar.
- **Dispositivos:** estado de las cámaras y lectores.

Las reglas son de presentación y de simulación. La plantilla biométrica, la coincidencia y el umbral
son del Core (AGENTS §6); el navegador nunca los decide ni los guarda.

## Rutas

| Ruta | Qué muestra |
|---|---|
| `/biometrics` | Accesos, indicadores, actividad reciente y dispositivos |
| `/biometrics/enrollment` | Elegir persona y modalidad para registrar. Con `?done=<evento>` muestra el acta; con `?person=<id>` llega la persona elegida |
| `/biometrics/verification` | Elegir persona y método para verificar |
| `/biometrics/verification/result?event=<evento>` | Resultado de una verificación |
| `/biometrics/capture?mode=…&person=…&method=…` | La captura (la valida el servidor) |
| `/biometrics/history` | Historial con filtros `?method=` y `?result=` |

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `types.ts`, `labels.ts`, `routes.ts` | Tipos, textos/iconos y constructores de rutas |
| `biometric-rules.ts` | Funciones puras: resumen, filtros, disponibilidad de modalidades, simulación del desenlace, validar la URL |
| `capture-state.ts` | Funciones puras: avance, calidad por fase, mensajes de la captura |
| `fingerprint-rings.ts` | Los arcos de la huella y cuántos se iluminan |
| `mock-biometrics.ts` | **[MOCK]** Perfiles, eventos y dispositivos de demostración |
| `services/biometric-service.ts` | Interfaz `BiometricService` |
| `services/mock-biometric-service.ts` | **[MOCK]** Implementación en memoria del servidor |
| `services/index.ts` | Único lugar que elige la implementación |
| `actions.ts` | `completeCaptureAction`: cierra la captura, valida y redirige |
| `use-camera.ts` | Hook de la cámara (`getUserMedia`) |
| `components/*-view.tsx` | Pantallas (Server Components): módulo, flujo, acta, resultado, captura, historial |
| `components/capture-flow.tsx`, `person-picker.tsx` | Flujo de persona y modalidad |
| `components/capture-station.tsx`, `face-view.tsx`, `fingerprint-view.tsx` | La captura |
| `components/events-table.tsx`, `devices-grid.tsx`, `score-scale.tsx`, `profile-chips.tsx`, `history-filters.tsx` | Piezas compartidas |

Los estilos propios son `app/styles/av-biometrics.css`; el visor, el medidor y la escala son los
patrones `.pt-*` del Design System.

## Decisiones

- **El desenlace lo decide el servicio, no la URL:** el resultado y el acta se leen por el id del
  evento. El prototipo aceptaba `?resultado=exito` y tenía un selector de demostración para
  forzarlo; aquí no se puede inventar un resultado.
- **Una verificación exitosa marca a la persona como Verificada** (en el prototipo nunca ocurría).
- **Una modalidad se puede elegir solo si hay un dispositivo conectado;** al verificar, además, la
  persona debe tenerla registrada. La tarjeta dice por qué no está disponible.
- **Consentimiento al registrar:** hace falta marcar que la persona autoriza la captura.
- **El historial se conserva** aunque se elimine a la persona (es auditoría): sale como «Persona eliminada».
- **Se agregaron los dispositivos CAM-003 y BIO-003,** que el prototipo usaba en el historial sin
  listarlos; ahora los indicadores cuentan 2 de 5 conectados.
- **El fotograma capturado** vive solo en la memoria del navegador; al continuar solo viaja el contexto.
- **Los filtros del historial viven en la URL** y se pueden compartir.

## Estado actual

- **[MOCK]** Datos y servicio de demostración (`TODO(AVY-009)`). El desenlace de una verificación es
  aleatorio: 60 % éxito, 25 % fallo, 15 % reintento. El 15 % de las capturas falla a propósito.
- **Cámara real** para el rostro; si no hay permiso o cámara, la captura continúa de forma simulada y
  se avisa. Los lectores de huella no existen todavía: la lectura es simulada y los dos lectores
  están desconectados, así que registrar o verificar con huella no se puede elegir.
- No se elige el dedo (el prototipo tampoco). La prueba de vida es un indicador simulado.
- Los umbrales (0,68) son de ejemplo.

## Pruebas

`tests/biometrics/` cubre las reglas, la lógica de captura y el servicio mock (alta de perfiles,
desenlaces, dispositivos, historial). Accesibilidad con la sesión de demostración:

```bash
AUDIT_COOKIE="averyn_mock_session=1" npm run test:a11y -- http://localhost:3300 biometrics biometrics/enrollment biometrics/verification biometrics/history
```
