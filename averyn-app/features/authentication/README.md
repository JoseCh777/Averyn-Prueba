# authentication

Inicio y cierre de sesion de la aplicacion (AVY-003, Login UI).

## Responsabilidad

La pantalla `/login`, sus reglas de formulario y la frontera con el servicio de
autenticacion. **El frontend no es la autoridad de la autenticacion** (AGENTS 6): decide
el Core. Aqui solo se recoge el correo y la contrasena, se valida lo basico para ayudar a
quien escribe y se muestra el resultado.

## Estructura de los ficheros

| Fichero | Responsabilidad |
|---|---|
| `types.ts` | Credenciales, resultado del login, codigos de error y estado del formulario |
| `validation.ts` | Validacion de campos antes de enviar (funcion pura) |
| `messages.ts` | Texto que ve la persona para cada codigo de error (funcion pura) |
| `routes.ts` | Rutas `/login` y la de destino tras entrar |
| `actions.ts` | Server Actions `loginAction` y `logoutAction` |
| `services/auth-service.ts` | Interfaz `AuthService`: la frontera entre la UI y quien autentica |
| `services/mock-auth-service.ts` | **[MOCK]** Implementacion de demostracion con una cuenta fija |
| `services/mock-session.ts` | **[MOCK]** Sesion de demostracion con una cookie `HttpOnly` |
| `services/index.ts` | Unico lugar que elige la implementacion de `AuthService` |
| `components/login-view.tsx` | Server Component: compone el panel de marca y el formulario |
| `components/login-brand-panel.tsx` | Logo, figura de arcos y mensaje de bienvenida |
| `components/login-form.tsx` | Client Component: formulario, estados y foco |
| `components/secure-connection-note.tsx` | Nota «Conexion segura» solo si la pagina va por HTTPS |

Los estilos estan en `app/styles/av-login.css`; los campos, alertas y botones son los del
Design System. La ruta es `app/(auth)/login/page.tsx` y el guard de las pantallas
autenticadas esta en `app/(app)/layout.tsx`.

## Flujo

```text
LoginForm -> loginAction -> validateLoginFields
                         -> authService.login   (hoy MockAuthService)
                         -> startMockSession    (cookie HttpOnly)
                         -> mensaje de exito    -> el formulario espera 900 ms
                                                  y navega a /dashboard
```

Estados del formulario (coding-standard 21): inicial, enviando («Verificando…», boton
bloqueado), error (junto al campo o alerta general; el foco va al campo a corregir; al
escribir en un campo se limpia su error) y exito (alerta «Autenticacion exitosa…», boton
bloqueado un momento y navegacion al dashboard, igual que `login.js` del frontend original).
`AUTH_INVALID_CREDENTIALS` lleva siempre el mismo mensaje, sin decir si fallo el correo o
la contrasena (auth-contract 2.1 y 4).

## Estado actual

- **[MOCK]** Cuenta de demostracion `admin@averyn.test` / `Averyn2026` (la del prototipo; no da
  acceso a nada real). `TODO(AVY-005)`: eliminar `MockAuthService` y `mock-session.ts` y usar un
  cliente HTTP del `POST /auth/login`; el guard pasara a decidirse con `GET /auth/me`.
- La sesion de demostracion es una cookie `HttpOnly` sin datos. **No se usa `localStorage`**
  (auth-contract 1.3). No lleva `Secure` porque en desarrollo se sirve por HTTP; la cookie real
  la fijara el Core.
- «¿Olvidaste tu contrasena?» solo muestra un aviso: la recuperacion no existe todavia.
- El enlace «← Volver al inicio» y el logo enlazado llevan a `/` (la landing migrada).
- Los codigos `AUTH_TOO_MANY_ATTEMPTS`, `SERVICE_UNAVAILABLE` e `INTERNAL_ERROR` ya tienen
  mensaje, pero el mock no los produce todavia.

## Pruebas

`tests/authentication/` cubre la validacion, los mensajes y el servicio mock
(`npm run test:unit`). El flujo completo (validacion, credenciales invalidas, exito, guard y
cierre de sesion) se comprobo a mano en el navegador, y la accesibilidad con
`npm run test:a11y` (ruta `login`).

## Decisiones pendientes

- **Contrato de Auth (#05):** dado por aprobado por Jose para avanzar; **⚑ Daniel** debe pasarlo a «Aceptado».
- **⚑ Cookie `Secure`:** decidir como se activa por configuracion cuando exista la configuracion centralizada de `lib/`.
- **⚑ Recuperacion de contrasena y segundo factor:** fuera del MVP oficial; las plantillas existen en el Design System.
