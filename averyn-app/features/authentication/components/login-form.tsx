"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/field";

import { loginAction } from "../actions";
import { AFTER_LOGIN_PATH } from "../routes";
import { INITIAL_LOGIN_FORM_STATE } from "../types";
import { SecureConnectionNote } from "./secure-connection-note";

const RECOVERY_UNAVAILABLE_MESSAGE = "La recuperación aún no está disponible; contacta a tu administrador.";

/** Pausa con el botón bloqueado tras el éxito, igual que `login.js` del frontend original. */
const SUCCESS_REDIRECT_DELAY_MS = 900;

/** Lo que la persona ya corrigió escribiendo: el error de un campo desaparece al teclear. */
type CorrectedFields = { email: boolean; password: boolean; message: boolean };

const NOTHING_CORRECTED: CorrectedFields = { email: false, password: false, message: false };

/**
 * Formulario de inicio de sesión.
 *
 * Estados (coding-standard 21): inicial, enviando (botón con «Verificando…» y bloqueado),
 * error (mensajes junto a cada campo o alerta general) y éxito (alerta «Autenticación
 * exitosa…», botón bloqueado un momento y navegación al dashboard). Al escribir en un
 * campo se limpia su error, como en el frontend original. Tras un error el foco va al
 * primer campo que hay que corregir.
 *
 * Es un Client Component porque usa `useActionState` y devuelve el foco con refs.
 *
 * @returns El formulario, la alerta de recuperación y la nota de conexión segura.
 */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_LOGIN_FORM_STATE);
  const [showRecoveryNotice, setShowRecoveryNotice] = useState(false);
  const [corrected, setCorrected] = useState<CorrectedFields>(NOTHING_CORRECTED);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /* Un estado nuevo del servidor vuelve a mostrar sus errores: lo corregido se descuenta. */
  useEffect(() => {
    setCorrected(NOTHING_CORRECTED);
  }, [state]);

  useEffect(() => {
    if (state.fieldErrors.email) {
      emailInput.current?.focus();
    } else if (state.fieldErrors.password || state.errorMessage) {
      passwordInput.current?.focus();
    }
  }, [state]);

  const isRedirecting = state.successMessage !== undefined;

  /* La navegación espera lo suficiente para que se lea la alerta de éxito (login.js: 900 ms). */
  useEffect(() => {
    if (!state.successMessage) return;
    const timer = window.setTimeout(() => router.push(AFTER_LOGIN_PATH), SUCCESS_REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [state, router]);

  const emailError = state.fieldErrors.email && !corrected.email ? state.fieldErrors.email : undefined;
  const passwordError = state.fieldErrors.password && !corrected.password ? state.fieldErrors.password : undefined;
  const loginError = state.errorMessage && !corrected.message ? state.errorMessage : undefined;

  /* Al escribir se limpia solo lo que corresponde (login.js: el correo limpia su error;
     la contraseña limpia el suyo y además la alerta general). */
  const onEmailInput = () => {
    if (!state.fieldErrors.email || corrected.email) return;
    setCorrected((current) => ({ ...current, email: true }));
  };
  const onPasswordInput = () => {
    const touchesPassword = Boolean(state.fieldErrors.password) && !corrected.password;
    const touchesMessage = Boolean(state.errorMessage) && !corrected.message;
    if (!touchesPassword && !touchesMessage) return;
    setCorrected((current) => ({ ...current, password: true, message: true }));
  };

  const onRecoveryClick = () => {
    setCorrected({ email: true, password: true, message: true });
    setShowRecoveryNotice(true);
  };

  return (
    <>
      <form action={formAction} noValidate aria-busy={isPending || isRedirecting}>
        <Field label="Correo electrónico" error={emailError}>
          {(aria) => (
            <Input
              ref={emailInput}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@organizacion.com"
              defaultValue={state.email}
              onChange={onEmailInput}
              {...aria}
            />
          )}
        </Field>

        <Field
          label="Contraseña"
          error={passwordError}
          aside={
            <button type="button" className="av-login__link" onClick={onRecoveryClick}>
              ¿Olvidaste tu contraseña?
            </button>
          }
        >
          {(aria) => (
            <PasswordInput
              ref={passwordInput}
              name="password"
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              onChange={onPasswordInput}
              {...aria}
              /* Credenciales inválidas: se marca la contraseña sin repetir el mensaje junto al campo. */
              aria-invalid={aria["aria-invalid"] || loginError ? true : undefined}
            />
          )}
        </Field>

        {loginError && <Alert tone="error">{loginError}</Alert>}
        {state.successMessage && <Alert tone="success">{state.successMessage}</Alert>}
        {showRecoveryNotice && <Alert tone="info">{RECOVERY_UNAVAILABLE_MESSAGE}</Alert>}

        <Button type="submit" block loading={isPending || isRedirecting}>
          {isPending || isRedirecting ? "Verificando…" : "Ingresar"}
        </Button>
      </form>
      <SecureConnectionNote />
    </>
  );
}
