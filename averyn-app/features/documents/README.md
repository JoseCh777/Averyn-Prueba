# documents

Módulo de Documentos y OCR: carga de documentos de identidad, lectura de sus datos con OCR y el
pre-registro de una persona (rutas `/documents` y `/documents/pre-registration`).

## Responsabilidad

- **Historial:** subir un documento, ver cómo quedó (procesado, en proceso, con error) y revisar los
  datos que leyó el OCR.
- **Revisión:** el OCR nunca crea identidad por sí solo; deja un borrador que la persona confirma.
- **Pre-registro:** captura el documento, revisa los datos, da de alta a la persona (siempre
  `Pendiente`) y sigue a la captura de rostro de Biometría.

Las reglas son de presentación y de validación. La lectura real la hará el servicio de OCR del Core
(AGENTS §6).

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `types.ts` | Documento, campos OCR, metadatos del archivo y resultados de las acciones |
| `labels.ts` | Tipos de documento, estados, nombres de campo y el aviso de «no se pudo leer» |
| `document-rules.ts` | Funciones puras: validar el archivo y el pre-registro, resumir, nombre completo, validar lo que llega a las acciones |
| `ocr-review.ts` | Funciones puras: umbral de confianza, estado de revisión de cada campo, textos |
| `mock-documents.ts` | **[MOCK]** Los cuatro documentos de demostración |
| `mock-ocr.ts` | **[MOCK]** Lectura OCR simulada |
| `services/document-service.ts` | Interfaz `DocumentService` (la frontera con los datos) |
| `services/mock-document-service.ts` | **[MOCK]** Implementación en memoria del servidor |
| `services/index.ts` | Único lugar que elige la implementación |
| `actions.ts` | Acciones de servidor: subir, leer, confirmar y registrar (comprueban la sesión y validan lo recibido) |
| `use-ocr-review.ts` | Hook con lo que la persona escribe y qué campos ya vio |
| `components/documents-view.tsx` | Pantalla del historial (Server Component asíncrono) |
| `components/upload-document-card.tsx` | Tipo de documento, zona de carga y «Procesar» |
| `components/documents-table.tsx` | Tabla del historial |
| `components/ocr-result-button.tsx` | Botón y diálogo «Resultado OCR» |
| `components/ocr-fields-form.tsx` | Campos de revisión con su indicador de confianza |
| `components/document-preview.tsx` | Visor (ilustración) del documento |
| `components/pre-registration-wizard.tsx`, `pre-registration-view.tsx` | El asistente de pre-registro |

Las rutas están en `app/(app)/documents/` con `loading.tsx` y `error.tsx`. Los estilos propios son
`app/styles/av-documents.css`; el progreso por pasos es `components/ui/step-progress.tsx`.

## Decisiones

- **Revisión por confianza (patrón del Design System):** un campo con confianza por debajo de 90 %
  pide que la persona lo vea antes de confirmar. Cambiar el valor lo marca «Corregido». El umbral es
  de ejemplo; lo definirá el servicio de OCR.
- **Consentimiento primero:** en el pre-registro la captura y los datos están deshabilitados hasta
  que se marca el consentimiento; el servidor también lo exige.
- **No se duplican personas:** si ya hay una con ese documento, el pre-registro continúa con ella.
- **«Datos complementarios»:** solo se pide el correo (opcional). El rol del votante y el puesto de
  votación del prototipo son del módulo Electoral y se capturarán allí.
- **El archivo no pasa por la acción de servidor** (límite de 1 MB): solo viajan sus datos. El Core
  recibirá el archivo por su propia API.
- **Las acciones validan todo lo que reciben:** vienen del navegador y no se asume su forma
  (`parseUploadMetadata`, `parseOcrValues`).

## Estado actual

- **[MOCK]** Datos, OCR y servicio son de demostración (`TODO(AVY-008)`). Cada lectura entrega una
  identidad ficticia distinta; un archivo cuyo nombre diga «error», «borroso», «blur» o «reflejo»
  simula una imagen ilegible.
- **[MOCK]** «Cámara» y «Cámara IP» no abren ninguna cámara: entregan un archivo ficticio al OCR.
- La «Contingencia por QR» del prototipo se muestra como «Próximamente».
- El visor es una ilustración, no la imagen subida.
- Los documentos en proceso del mock no avanzan: no hay un trabajo real detrás.

## Pruebas

`tests/documents/` cubre las reglas (archivo, pre-registro, valores recibidos), la revisión por
confianza y el servicio mock. `tests/lib/` cubre el formato de fechas. Accesibilidad con la sesión de
demostración:

```bash
AUDIT_COOKIE="averyn_mock_session=1" npm run test:a11y -- http://localhost:3300 documents documents/pre-registration
```
