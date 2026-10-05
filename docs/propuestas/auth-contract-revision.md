# Revisión del contrato de Auth (`contracts/auth-contract.md` v0.2)

> Borrador de comentarios de José (Frontend / Auth) para Daniel. El contrato está pendiente de su revisión; esto no modifica el documento. Revisado contra ADR-010, el diccionario de datos y el estado de `averyn-web` y `averyn-core` del 2026-10-05.

## 1. Puntos marcados ⚑ (§6 del contrato)

| # | Punto | Recomendación | Motivo |
|---|---|---|---|
| 1 | Acceso 15 min; refresh 7 días deslizante, 30 absoluto | **Aceptar** | Es corto para limitar un robo y largo para que la demo no pida login. Debe ser configurable por variable de entorno |
| 2 | 5 intentos, bloqueo de 15 min | **Aceptar** | Estándar. La pantalla de login ya tiene el estado «Bloqueado» con cuenta atrás por `Retry-After` |
| 3 | Cookies `averyn_at` y `averyn_rt` con sus `Path` | **Aceptar** | `Path=/api/v1` y `/api/v1/auth` evitan enviar el refresh en cada petición. Exige que todo cuelgue de `/api/v1` en el mismo origen (ver §2.3) |
| 4 | Sin token CSRF; validar `Origin` y `SameSite` | **Aceptar con condición** | Con `Lax` en el acceso y `Strict` en el refresh es suficiente si el Core **rechaza los métodos que cambian estado cuando `Origin` falta o no coincide** con el host del tenant. Dejarlo escrito en el contrato y probado |
| 5 | Endpoint de cambio de contraseña en el MVP | **Dentro, pero al final** | `must_change_password` existe en el modelo, así que el flujo es necesario para cuentas sembradas. No bloquea AVY-005; la pantalla de Horizonte «Perfil» ya lo cubre |
| 6 | Ventana de gracia para el refresh anterior | **Aceptar 10 s como mitigación** | Con el refresh de vuelo único en el cliente basta casi siempre, pero dos pestañas abiertas pueden competir. Sin ventana, una carrera cierra la sesión por «robo» |
| 7 | Límite de intentos de correos inexistentes en memoria | **Memoria** | Una sola instancia en el MVP. Anotar que se pierde al reiniciar |

## 2. Puntos nuevos para confirmar

### 2.1 Server Components no pueden rotar cookies
El refresh devuelve cookies nuevas (`Set-Cookie`). En Next.js, un Server Component no puede escribir cookies; solo un route handler, un Server Action o el navegador. **Propuesta:** el refresh lo hace el cliente (`lib/api/client.ts`, de vuelo único) o un route handler; las páginas del servidor solo leen. Si una página del servidor recibe `401`, redirige a una ruta que refresca y vuelve, en vez de reintentar sola.

### 2.2 `Retry-After` y el `429`
El contrato dice que el `429` lleva `Retry-After`. Falta fijar si va en **segundos** (propuesta) y si también aparece en el cuerpo `problem+json`, para que la pantalla muestre la cuenta atrás sin leer cabeceras. Además, nombrar el `code` del `429` (propuesta: `AUTH_RATE_LIMITED`), porque el frontend traduce por `code`.

### 2.3 Mismo origen y `Host` tras el proxy
El contrato pide mismo origen (`demo.localhost:3000`) y que el frontend reenvíe `/api/v1`. Tres riesgos:

1. **Puerto:** web y Core usan 3000 por defecto. Hay que fijar otro para el Core (propuesta: 3001) y documentarlo.
2. **`Host`:** el Core resuelve el tenant solo por la cabecera `Host` e ignora `X-Forwarded-Host`. Un `rewrite` de Next hacia el Core probablemente cambia el `Host` y daría `TENANT_NOT_FOUND`. Hay que **verificarlo** el Día 3 antes de construir sobre ello; si ocurre, o el Core lee `X-Forwarded-Host` solo cuando la petición viene del proxy de confianza, o el rewrite conserva el `Host`.
3. **`.env.example` de web:** apunta a `http://localhost:3000/api` (otro origen y sin `/v1`). Debe cambiar a una ruta relativa `/api/v1`.

### 2.4 Códigos de error que necesita el frontend
Con los códigos del contrato el frontend ya puede traducir: `AUTH_INVALID_CREDENTIALS`, `AUTH_UNAUTHENTICATED`, `AUTH_REFRESH_INVALID`, `TENANT_NOT_FOUND`. Pedir además:

* un `code` para la cuenta bloqueada: ¿el login devuelve `429` o `423`? Fijarlo.
* `AUTH_ACCOUNT_DISABLED` frente a credenciales inválidas: **recomendación:** que una cuenta deshabilitada responda igual que credenciales inválidas, para no revelar que existe.
* `VALIDATION_ERROR` con la lista de campos (`errors[]` con `field` y `code`) para marcarlos en el formulario.

### 2.5 Después del login
`GET /auth/me` debería devolver `roles` **y** `permissions` (`recurso:acción`) además de los datos del usuario y del tenant, para que la interfaz oculte lo que no corresponde sin cálculo propio. Recordar que el frontend **no** es frontera de seguridad: oculta, el Core decide.

### 2.6 Cierre de sesión y tabs
`POST /auth/logout` debe borrar ambas cookies con los mismos `Path`. El frontend avisa a otras pestañas (`BroadcastChannel`) y vuelve al login. Aclarar que `logout` es idempotente (responde `204` aunque ya no haya sesión).

### 2.7 Contradicción pendiente en la arquitectura
`08` §5 todavía dice «JWT Bearer» y ADR-010 y este contrato usan cookies `HttpOnly`. Conviene corregir `08` para que el equipo no implemente el esquema equivocado.

## 3. Lo que José hace con cada respuesta

| Decisión de Daniel | Efecto en el trabajo de José |
|---|---|
| Confirma ⚑ 1–7 | AVY-004 y AVY-005 se escriben sin cambios de nombres |
| Fija puerto del Core y mismo origen | AVY-005 configura el `rewrite` y las variables de entorno |
| Confirma el `code` del `429` y el cuerpo de `VALIDATION_ERROR` | Se completa la tabla «Errores de la API» del sistema de diseño |
| Resuelve el `Host` tras el proxy | Se mantiene el tenant por subdominio sin cambiar el Core |

## 4. Orden sugerido
1. **Hoy (Día 1):** enviar este documento a Daniel; verificar el comportamiento del `Host` con un `rewrite` mínimo.
2. **Día 2:** respuestas de §1 y §2.3 antes de empezar AVY-004.
3. **Día 3:** AVY-003 con mock y AVY-004 con los valores confirmados.
