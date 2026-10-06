"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/field";

import { loginAction } from "../actions";
import { INITIAL_LOGIN_FORM_STATE } from "../types";
import { SecureConnectionNote } from "./secure-connection-note";

const RECOVERY_UNAVAILABLE_MESSAGE = "La recuperación aún no está disponible; contacta a tu administrador.";

/**
 * Formulario de inicio de sesión.
 *
 * Estados (coding-standard 21): inicial, enviando (botón con «Verificando…» y bloqueado),
 * error (mensajes junto a cada campo o alerta general) y éxito (la acción redirige al
 * dashboard). Tras un error el foco va al primer campo que hay que corregir.
 *
 * Es un Client Component porque usa `useActionState` y devuelve el foco con refs.
 *
 * @returns El formulario, la alerta de recuperación y la nota de conexión segura.
 */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_LOGIN_FORM_STATE);
  const [showRecoveryNotice, setShowRecoveryNotice] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.fieldErrors.email) {
      emailInput.current?.focus();
    } else if (state.fieldErrors.password || state.errorMessage) {
      passwordInput.current?.focus();
    }
  }, [state]);

  return (
    <>
      <form action={formAction} noValidate aria-busy={isPending}>
        <Field label="Correo electrónico" error={state.fieldErrors.email}>
          {(aria) => (
            <Input
              ref={emailInput}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@organizacion.com"
              defaultValue={state.email}
              {...aria}
            />
          )}
        </Field>

        <Field
          label="Contraseña"
          error={state.fieldErrors.password}
          aside={
            <button type="button" className="av-login__link" onClick={() => setShowRecoveryNotice(true)}>
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
              {...aria}
            />
          )}
        </Field>

        {state.errorMessage && <Alert tone="error">{state.errorMessage}</Alert>}
        {showRecoveryNotice && <Alert tone="info">{RECOVERY_UNAVAILABLE_MESSAGE}</Alert>}

        <Button type="submit" block loading={isPending}>
          {isPending ? "Verificando…" : "Ingresar"}
        </Button>
      </form>
      <SecureConnectionNote />
    </>
  );
}
