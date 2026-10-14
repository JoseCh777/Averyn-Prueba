# identity

Módulo de Identidad: el catálogo de personas (rutas `/identity`, `/identity/new` y `/identity/[personId]`).

## Responsabilidad

Listar personas con búsqueda y filtro por estado, registrar a una persona nueva (siempre como
`Pendiente`), eliminarla con confirmación y mostrar su ficha. Es el catálogo que usan los demás
módulos (Documentos, Biometría y Electoral): ninguno guarda su propia lista de personas.

Las reglas de este módulo son de presentación y de validación del formulario. El Core será la
autoridad cuando exista el módulo de identidad (AGENTS §6).

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `types.ts` | Persona, afiliación, estado, filtros, resumen y estados del formulario |
| `labels.ts` | Textos, iconos y tonos de cada afiliación y estado |
| `person-rules.ts` | Funciones puras: filtrar, resumir, iniciales, tono de avatar y validar (usado también por Documentos) |
| `person-form.ts` | Funciones puras del alta: campos, validación por campo, nombre completo y petición normalizada |
| `routes.ts` | `IDENTITY_PATH`, `NEW_PERSON_PATH` e `identityPath(id)` |
| `use-new-person-form.ts` | Estado y envío del formulario de alta (cliente) |
| `mock-people.ts` | **[MOCK]** Las ocho personas de demostración |
| `services/person-service.ts` | Interfaz `PersonService` (la frontera con los datos) y `DuplicateDocumentError` |
| `services/mock-person-service.ts` | **[MOCK]** Implementación en memoria del servidor |
| `services/index.ts` | Único lugar que elige la implementación |
| `actions.ts` | Acciones de servidor: crear (vuelve a validar) y eliminar; comprueban la sesión |
| `components/identity-view.tsx` | Pantalla del listado (Server Component asíncrono) |
| `components/person-detail-view.tsx` | Pantalla de la ficha |
| `components/people-filters.tsx` | Búsqueda y filtro; el estado vive en la URL (`?q=` y `?status=`) |
| `components/people-table.tsx` | Tabla de personas |
| `components/new-person-view.tsx` | Pantalla «Nueva persona» (Server Component) |
| `components/new-person-workspace.tsx` | Formulario y vista previa, que comparten lo que se escribe (cliente) |
| `components/new-person-form.tsx` | El formulario en tres secciones, con errores por campo y resumen |
| `components/person-preview.tsx` | Vista previa de la persona mientras se escribe |
| `components/delete-person-button.tsx` | Botón de eliminar con diálogo de confirmación |
| `components/person-avatar.tsx`, `person-badges.tsx` | Avatar con iniciales, etiqueta de afiliación y chip de estado |

Las rutas están en `app/(app)/identity/` con `loading.tsx`, `error.tsx` y, en la ficha,
`not-found.tsx`. Los estilos propios son `app/styles/av-identity.css` (paridad con la v1
`averyn-frontend`, anclado a las etiquetas aria de estas dos pantallas) sobre
`app/styles/av-page.css` (compartido con el resto de pantallas de módulo).

## Alta de persona (`/identity/new`)

Pantalla propia en lugar de un diálogo: el formulario tiene tres secciones (datos personales,
identificación, pertenencia y contacto) y una vista previa de la persona a su lado.

- **Campos del contrato:** primer y segundo nombre, primer y segundo apellido (hasta 80 caracteres,
  sin caracteres de control, espacios normalizados) y fecha de nacimiento (real, desde 1900, no
  futura). Documento (6 a 12 dígitos; acepta puntos y guiones), afiliación y correo opcional.
- **Validación sin sobresaltos:** un campo se valida al salir de él solo si tiene texto; lo vacío se
  reporta al enviar. Con un error visible, se revalida mientras se corrige y desaparece al arreglarlo.
- **Envío:** valida todo, lleva el foco al primer campo con error y muestra un resumen con enlaces a
  cada campo. La acción de servidor vuelve a validar. Un documento repetido se marca en su campo.
- **Éxito:** aviso y paso al detalle; con «Crear y agregar otra» el formulario queda limpio, con la
  afiliación conservada y el foco en el primer nombre, para altas seguidas.
- **Accesibilidad:** asterisco visual más «obligatorio» para lectores de pantalla, errores asociados
  a su campo y aviso de la persona creada en una región `status`. Los autocompletados van en `off`.
- **Pendiente de contrato:** el catálogo de tipos de pertenencia y los documentos adicionales
  (`person-contract`) se añadirán cuando el Core los exponga; hoy la afiliación es un catálogo local.

## Decisiones

- **Filtros en la URL:** el servidor devuelve el listado ya filtrado; se puede compartir el
  enlace y funcionan atrás y adelante. La búsqueda espera 250 ms tras la última tecla.
- **Los indicadores cuentan todas las personas;** los filtros solo afectan a la tabla.
- **Estado vacío dentro de la tabla:** cuando no hay resultados, la fila `tr.av-table__empty`
  ocupa las cuatro columnas (paridad con `dashboard-identity.js`), y el pie sigue informando
  «Mostrando X de Y» con una sola página (los botones de página vienen deshabilitados).
- **La ficha enseña lo mismo que la v1:** perfil (avatar, nombre y documento), `Afiliación` y
  `Estado`, y el enlace «Volver al listado» dentro de la tarjeta.
- **Id de persona eliminada no se reutiliza:** si lo hiciera, un evento antiguo apuntaría a otra
  persona. El mock lleva un contador que no retrocede.
- **Búsqueda sin tildes:** «perez» encuentra a «Pérez».
- **Documento:** solo números, de 6 a 12 dígitos, y único (`DuplicateDocumentError`).
- **Las acciones comprueban la sesión** (`requireSession`): son endpoints públicos y no basta con
  que la pantalla esté protegida por el layout.

## Estado actual

- **[MOCK]** Los datos y el servicio son de demostración (`TODO(AVY-007)`): viven en la memoria
  del servidor y vuelven a la semilla al reiniciarlo.
- «Exportar» está deshabilitado («Próximamente»): no hay formato definido.
- Eliminar no avisa a otros módulos. Cuando Biometría guarde eventos por persona, el servicio
  real deberá decidir qué pasa con ellos.

## Pruebas

`tests/identity/` cubre las reglas (filtro, resumen, iniciales, validación) y el servicio mock
(alta, duplicados, ids, copias). Accesibilidad con la sesión de demostración:

```bash
AUDIT_COOKIE="averyn_mock_session=1" npm run test:a11y -- http://localhost:3300 identity identity/per-0001
```
