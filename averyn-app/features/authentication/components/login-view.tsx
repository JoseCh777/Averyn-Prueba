import Link from "next/link";

import { LANDING_PATH } from "../routes";
import { LoginBrandPanel } from "./login-brand-panel";
import { LoginForm } from "./login-form";

/**
 * Pantalla de inicio de sesión: panel de marca a la izquierda y formulario a la derecha
 * (arriba el de marca en pantallas estrechas). El enlace «← Volver al inicio» va encima
 * del formulario, como en `login.html` del frontend original.
 *
 * Es un Server Component: solo compone; la interacción vive en `LoginForm`.
 *
 * @returns La pantalla completa del login.
 */
export function LoginView() {
  return (
    <main className="av-login" aria-label="Página de inicio de sesión">
      <div className="av-login__card">
        <LoginBrandPanel />
        <section className="av-login__panel" aria-labelledby="login-title">
          <Link className="av-login__back" href={LANDING_PATH}>
            ← Volver al inicio
          </Link>
          <div className="av-login__form">
            <h1 id="login-title">Bienvenido de nuevo.</h1>
            <p className="av-login__lead">Ingresa tus credenciales para continuar.</p>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
