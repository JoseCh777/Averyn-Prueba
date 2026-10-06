# identity

Módulo de Identidad: el catálogo de personas (rutas `/identity` y `/identity/[personId]`).

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
| `person-rules.ts` | Funciones puras: filtrar, resumir, iniciales, tono de avatar y validar el formulario |
| `mock-people.ts` | **[MOCK]** Las ocho personas de demostración |
| `services/person-service.ts` | Interfaz `PersonService` (la frontera con los datos) y `DuplicateDocumentError` |
| `services/mock-person-service.ts` | **[MOCK]** Implementación en memoria del servidor |
| `services/index.ts` | Único lugar que elige la implementación |
| `actions.ts` | Acciones de servidor: crear y eliminar (comprueban la sesión) |
| `components/identity-view.tsx` | Pantalla del listado (Server Component asíncrono) |
| `components/person-detail-view.tsx` | Pantalla de la ficha |
| `components/people-filters.tsx` | Búsqueda y filtro; el estado vive en la URL (`?q=` y `?status=`) |
| `components/people-table.tsx` | Tabla de personas |
| `components/new-person-dialog.tsx` | Botón y diálogo «Nueva persona» |
| `components/delete-person-button.tsx` | Botón de eliminar con diálogo de confirmación |
| `components/person-avatar.tsx`, `person-badges.tsx` | Avatar con iniciales, etiqueta de afiliación y chip de estado |

Las rutas están en `app/(app)/identity/` con `loading.tsx`, `error.tsx` y, en la ficha,
`not-found.tsx`. Los estilos propios son `app/styles/av-page.css` (compartido con el resto de
pantallas de módulo).

## Decisiones

- **Filtros en la URL:** el servidor devuelve el listado ya filtrado; se puede compartir el
  enlace y funcionan atrás y adelante. La búsqueda espera 250 ms tras la última tecla.
- **Los indicadores cuentan todas las personas;** los filtros solo afectan a la tabla.
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
