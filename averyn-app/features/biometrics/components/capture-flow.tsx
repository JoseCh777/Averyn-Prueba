"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { StepProgress, type ProgressStep } from "@/components/ui/step-progress";
import { cn } from "@/lib/utils";

import { connectedDeviceFor, methodAvailability } from "../biometric-rules";
import { METHOD_LABEL, METHODS } from "../labels";
import { capturePath, flowPath } from "../routes";
import type { BiometricDevice, BiometricMethod, CaptureMode, PickerPerson } from "../types";
import { PersonPicker } from "./person-picker";

type CaptureFlowProps = {
  mode: CaptureMode;
  people: readonly PickerPerson[];
  devices: readonly BiometricDevice[];
  /** Persona que llega elegida desde otra pantalla (`?person=`); si es válida se salta al paso 2. */
  initialPersonId?: string;
};

/** Textos que cambian entre registrar y verificar. */
const COPY = {
  enrollment: {
    searchLabel: "Buscar persona",
    stepTwo: "Modalidad",
    legend: "¿Qué biometría deseas registrar?",
    summary: "Asocia un perfil biométrico a una persona ya registrada en la institución.",
  },
  verification: {
    searchLabel: "Identificar persona",
    stepTwo: "Método biométrico",
    legend: "Método biométrico",
    summary: "Identifica a la persona y comprueba que su biometría coincide con el registro.",
  },
} as const;

/** Pasos del flujo; la captura es el tercero y se hace en otra pantalla. */
function stepsFor(copy: (typeof COPY)[CaptureMode], step: 1 | 2): ProgressStep[] {
  return [
    { title: "Persona", state: step === 1 ? "current" : "done" },
    { title: copy.stepTwo, state: step === 2 ? "current" : "locked" },
    { title: "Captura", state: "locked" },
  ];
}

/**
 * Flujo previo a la captura biométrica: elegir la persona y la modalidad.
 *
 * Sirve para registrar y para verificar. Una modalidad solo se puede elegir si hay un dispositivo
 * conectado (y, al verificar, si la persona la tiene registrada); si no, la tarjeta dice por qué.
 * Al registrar hace falta el consentimiento de la persona. «Continuar» lleva a la captura.
 *
 * @param props - El modo, las personas con su perfil, los dispositivos y la persona preelegida.
 * @returns El asistente de dos pasos.
 */
export function CaptureFlow({ mode, people, devices, initialPersonId }: CaptureFlowProps) {
  const router = useRouter();
  const consentId = useId();
  const copy = COPY[mode];
  const preselected = people.some((person) => person.id === initialPersonId) ? initialPersonId : undefined;
  const [personId, setPersonId] = useState<string | undefined>(preselected);
  const [step, setStep] = useState<1 | 2>(preselected === undefined ? 1 : 2);
  const [method, setMethod] = useState<BiometricMethod | undefined>(undefined);
  const [consent, setConsent] = useState(false);

  const person = people.find((candidate) => candidate.id === personId);
  const availability = new Map(METHODS.map((option) => [option, methodAvailability({ mode, method: option, profile: person?.profile, devices })] as const));
  const firstAvailable = METHODS.find((option) => availability.get(option)?.available === true);
  const chosen = method !== undefined && availability.get(method)?.available === true ? method : firstAvailable;
  const needsConsent = mode === "enrollment";
  const canContinue = step === 1 ? person !== undefined : chosen !== undefined && (!needsConsent || consent);

  const next = () => {
    if (step === 1 && person !== undefined) setStep(2);
    else if (step === 2 && person !== undefined && chosen !== undefined) router.push(capturePath({ mode, personId: person.id, method: chosen }));
  };

  return (
    <div className="av-wizard">
      <aside className="av-wizard__side av-surface av-surface--pad">
        <StepProgress steps={stepsFor(copy, step)} label="Pasos del proceso" />
      </aside>

      <div className="av-wizard__body">
        <section className="av-surface av-surface--pad" aria-labelledby="flow-title">
          <div className="av-surface__head">
            <h2 id="flow-title">{step === 1 ? "1. Persona" : `2. ${copy.stepTwo}`}</h2>
            <p>{copy.summary}</p>
          </div>

          {step === 1 ? (
            <div className="wiz-step">
              <PersonPicker people={people} selectedId={personId} onSelect={setPersonId} searchLabel={copy.searchLabel} />
            </div>
          ) : person === undefined ? null : (
            <div className="bio-step wiz-step">
              <p className="av-note">
                Persona seleccionada: <strong>{person.name}</strong> · Cédula {person.document} · {person.affiliation}
              </p>

              <fieldset className="bio-methods">
                <legend>{copy.legend}</legend>
                {METHODS.map((option) => {
                  const state = availability.get(option);
                  const available = state?.available === true;
                  const device = connectedDeviceFor(devices, option);
                  return (
                    <label key={option} className={cn("bio-method", !available && "is-disabled")}>
                      <input type="radio" name="method" value={option} disabled={!available} checked={chosen === option} onChange={() => setMethod(option)} />
                      <span className="bio-method__text">
                        <b>{METHOD_LABEL[option]}</b>
                        <small>
                          {available ? (
                            `Disponible · ${device?.name ?? ""} ${device?.id ?? ""}`.trim()
                          ) : (
                            <>
                              <Icon name="plug" /> {state?.available === false ? state.reason : ""}
                            </>
                          )}
                        </small>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              {mode === "enrollment" && chosen !== undefined && person.profile[chosen] ? (
                <Alert tone="info" title={`Ya tiene ${chosen === "face" ? "el rostro" : "la huella"} registrado`}>
                  Al continuar se actualizará su perfil biométrico.
                </Alert>
              ) : null}

              {mode === "verification" && chosen === undefined ? (
                <Alert tone="warning" title="No hay un método disponible para esta persona">
                  Primero registra su biometría o conecta el dispositivo para poder verificarla.{" "}
                  <Link className="av-link" href={flowPath("enrollment", person.id)}>
                    Registrar biometría <Icon name="arrow-right" />
                  </Link>
                </Alert>
              ) : null}

              {needsConsent ? (
                <Checkbox
                  id={consentId}
                  label="La persona autoriza la captura y el tratamiento de sus datos biométricos."
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
              ) : null}
            </div>
          )}

          <div className="wiz-footer bio-footer">
            <Button variant="ghost" onClick={() => setStep(1)} disabled={step === 1}>
              <Icon name="arrow-left" /> Atrás
            </Button>
            <Button onClick={next} disabled={!canContinue}>
              {step === 1 ? "Continuar" : "Continuar a captura"} <Icon name="arrow-right" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
