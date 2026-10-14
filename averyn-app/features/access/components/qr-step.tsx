"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

import { QR_CODE_MAX_LENGTH, normalizeQrCode } from "../access-rules";
import { DEMO_QR_SHORTCUTS } from "../mock-access";

type QrStepProps = {
  /** Hay una consulta en curso: se bloquea para evitar un doble envío. */
  busy: boolean;
  /** Recibe el código ya normalizado. */
  onSubmit: (code: string) => void;
};

/**
 * Paso del código QR: un campo que sirve igual para un lector USB (escribe como teclado y envía con
 * Enter) que para escribirlo a mano.
 *
 * El código se vacía del campo en cuanto se envía: no queda en pantalla. Los atajos de prueba son
 * del mock y permiten mostrar cada resultado sin conocer los códigos.
 *
 * @param props - Si hay una consulta en curso y qué hacer con el código.
 * @returns El paso de lectura del QR.
 */
export function QrStep({ busy, onSubmit }: QrStepProps) {
  const [value, setValue] = useState("");

  const submit = (raw: string) => {
    const code = normalizeQrCode(raw);
    if (code === "" || busy) return;
    setValue("");
    onSubmit(code);
  };

  return (
    <form
      className="acc-qr"
      onSubmit={(event) => {
        event.preventDefault();
        submit(value);
      }}
    >
      <Field label="Código de la invitación" help="Escanee el código con el lector o escríbalo y pulse Enter.">
        {(aria) => (
          <Input
            {...aria}
            className="acc-qr__input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            maxLength={QR_CODE_MAX_LENGTH}
            placeholder="AVY-…"
            disabled={busy}
          />
        )}
      </Field>
      <Button type="submit" loading={busy} disabled={normalizeQrCode(value) === ""}>
        Verificar código
      </Button>

      <div className="acc-shortcuts" role="group" aria-label="Códigos de prueba">
        <span className="acc-shortcuts__label">Códigos de prueba · demostración</span>
        <div className="acc-shortcuts__list">
          {DEMO_QR_SHORTCUTS.map((shortcut) => (
            <button key={shortcut.code} type="button" className="acc-shortcut" disabled={busy} onClick={() => submit(shortcut.code)}>
              {shortcut.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
