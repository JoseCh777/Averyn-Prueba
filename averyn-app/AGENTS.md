# Averyn Web — Development Instructions

## 1. Propósito

Este repositorio contiene exclusivamente el frontend web de Averyn, desarrollado con Next.js + TypeScript.

La arquitectura definida en este documento es obligatoria salvo que exista una decisión arquitectónica posterior que la modifique explícitamente.

## 2. Estructura obligatoria

La estructura principal del proyecto es:

```text
app/
components/
features/
lib/
types/
public/
tests/
```

No se deben crear carpetas adicionales en la raíz sin justificar previamente su necesidad.

## 3. Responsabilidad de cada carpeta

### `app/`

Contiene el routing y la composición de páginas utilizando Next.js App Router.

Aquí deben ubicarse:

* layouts
* pages
* loading
* error
* not-found
* route handlers cuando exista una necesidad específica

No utilizar `app/` como repositorio general de lógica de negocio.

### `components/`

Componentes reutilizables entre diferentes funcionalidades.

Ejemplos:

* botones
* modales
* formularios genéricos
* tablas
* componentes de navegación
* componentes del Design System

Un componente específico de una funcionalidad debe permanecer en `features/`.

### `features/`

Contiene la lógica específica de cada funcionalidad.

Ejemplo:

```text
features/
├── authentication/
├── identity/
├── biometrics/
├── electoral/
├── access/
└── administration/
```

Una funcionalidad puede contener sus propios:

```text
components/
hooks/
services/
types/
utils/
```

No crear estas carpetas si la funcionalidad no las necesita.

### `lib/`

Contiene infraestructura y utilidades generales del frontend.

Ejemplos:

* cliente HTTP
* configuración
* manejo de autenticación
* utilidades generales
* integración con APIs

No utilizar `lib/` como carpeta genérica para colocar código que no tenga una responsabilidad clara.

### `types/`

Contiene tipos compartidos del frontend.

No copiar automáticamente entidades, modelos Prisma o clases del backend.

### `public/`

Recursos estáticos.

### `tests/`

Pruebas que no tengan una ubicación más apropiada dentro de una funcionalidad.

## 4. Regla fundamental

Antes de crear una carpeta nueva, responder:

1. ¿Existe una carpeta actual donde este código pertenece?
2. ¿La nueva carpeta representa una responsabilidad real?
3. ¿La nueva estructura está respaldada por la arquitectura de Averyn?
4. ¿La nueva carpeta evita un problema real o solamente organiza por preferencia personal?

Si la respuesta no es clara, no crear la carpeta.

## 5. Arquitectura de ejecución

Next.js utiliza Server Components por defecto.

Utilizar Client Components únicamente cuando exista una necesidad real de APIs o interacción del navegador, por ejemplo:

* cámara
* captura facial
* lector de huella
* formularios interactivos
* modales interactivos

No convertir páginas completas en Client Components sin necesidad.

## 6. Backend

El frontend NO es autoridad para:

* autenticación
* autorización
* permisos
* reglas electorales
* validaciones críticas
* aislamiento de tenants
* reglas de negocio

Estas responsabilidades pertenecen a `averyn-core`.

El frontend consume la API de NestJS.

## 7. Biometría

Flujo facial:

```text
Browser
   ↓
Next.js
   ↓
NestJS Core
   ↓
Face Service
```

El frontend no debe comunicarse directamente con Face Service.

Flujo de huella:

```text
Browser
   ↓
Fingerprint NativeService
   ↓
DigitalPersona SDK
   ↓
Hardware
```

La comunicación local con el NativeService es una excepción explícita a la regla anterior.

## 8. Dependencias

No introducir una nueva librería solamente porque simplifica una tarea pequeña.

Antes de agregar una dependencia importante, verificar:

* necesidad real
* mantenimiento
* tamaño
* compatibilidad
* impacto en arquitectura
* si ya existe una solución en el proyecto

## 9. Design System

Los componentes visuales deben respetar el Design System definido por Averyn.

No crear estilos o componentes visuales paralelos que contradigan las decisiones existentes.

Convenciones vigentes:

* prefijo `av-` para clases y nombres de componentes
* Space Grotesk para headings (DESIGN.md y frontend original; decisión registrada en fix/paridad-frontend)
* Inter para body
* breakpoints: 576, 768, 1024 y 1280
* los tokens globales viven en `app/globals.css`

Los componentes del Design System deben crecer de forma ordenada: genéricos y reutilizables en `components/`, específicos de una funcionalidad dentro de `features/<funcionalidad>/components/`.

## 10. Variables de entorno

Acceder a las variables de entorno únicamente a través de configuración centralizada en `lib/`, nunca leyendo `process.env` de forma dispersa en componentes o páginas.

Los valores de ejemplo se documentan en `.env.example`, que sí se versiona. Los archivos `.env.local` y `.env` no se versionan bajo ninguna circunstancia.

## 11. Git Flow

El proyecto usa Git Flow. Ramas principales: `main` y `develop`. Ramas temporales: `feature/*`, `release/*`, `hotfix/*`.

* `main` representa codigo estable.
* `develop` representa la integracion del desarrollo.
* Las nuevas funcionalidades se crean desde `develop` en ramas `feature/*`.
* Las features se integran mediante Pull Request hacia `develop`.
* Las releases parten de `develop`.
* Los hotfixes parten de `main`.
* No trabajar directamente sobre `main`.
* No crear ramas arbitrarias que contradigan este flujo.

## 12. Cambios arquitectónicos

Si una tarea requiere modificar:

* estructura de carpetas
* patrón arquitectónico
* comunicación con Core
* autenticación
* manejo de biometría
* estrategia de estado
* dependencias fundamentales

no realizar el cambio silenciosamente.

Primero debe documentarse la necesidad y obtener aprobación del responsable técnico del proyecto.

## 13. Regla para IA

Las herramientas de IA deben respetar estas instrucciones.

No generar estructuras alternativas por iniciativa propia.

Antes de proponer una nueva carpeta, módulo, dependencia o patrón arquitectónico, revisar este documento y la documentación de `averyn-docs`.

El código generado por IA debe ser comprendido, revisado y validado por el desarrollador responsable.
