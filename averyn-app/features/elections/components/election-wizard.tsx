"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/overlay";
import { parseAffiliation } from "@/features/identity/person-rules";
import type { Person } from "@/features/identity/types";

import { createElectionAction } from "../actions";
import { countParticipants, validateGeneralInfo, validateSettings } from "../election-rules";
import type { GeneralInfoField, GeneralInfoInput, SettingsField, SettingsInput } from "../types";
import { ElectionStepper } from "./election-stepper";
import { GeneralStep } from "./general-step";
import { ParticipantsStep } from "./participants-step";
import { ReviewStep } from "./review-step";
import { SettingsStep } from "./settings-step";

const STEPS = ["Información general", "Configuración", "Participantes", "Revisión"] as const;

const EMPTY_GENERAL: GeneralInfoInput = { name: "", description: "", institution: "", kind: "", startDate: "", endDate: "" };
const DEFAULT_SETTINGS: SettingsInput = { votingType: "", choicesPerVote: "1", mode: "online", anonymous: true, blankVote: false, showResults: true, allowVoteChange: false };

type ElectionWizardProps = {
  /** El padrón: las personas del catálogo de Identidad. */
  people: readonly Person[];
  /** Nombres de los procesos que ya existen (el nombre no puede repetirse). */
  existingNames: readonly string[];
  /** Hoy en `aaaa-mm-dd`, hora de Lima. */
  today: string;
};

/**
 * Asistente de cuatro pasos para crear un proceso electoral: información general, configuración,
 * participantes y revisión.
 *
 * Cada paso se valida al continuar con las mismas reglas que usa el servidor; «Atrás» nunca borra lo
 * escrito. Al crear, el servidor vuelve a validar y el proceso nace como borrador; luego se vuelve
 * al listado con un aviso.
 *
 * @param props - El padrón, los nombres existentes y el día de hoy.
 * @returns El asistente.
 */
export function ElectionWizard({ people, existingNames, today }: ElectionWizardProps) {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [general, setGeneral] = useState(EMPTY_GENERAL);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [affiliation, setAffiliation] = useState("all");
  const [query, setQuery] = useState("");
  const [generalErrors, setGeneralErrors] = useState<Partial<Record<GeneralInfoField, string>>>({});
  const [settingsErrors, setSettingsErrors] = useState<Partial<Record<SettingsField, string>>>({});
  const [participantsError, setParticipantsError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  /* Tras cambiar de paso el foco va al título del paso (no en la primera carga). */
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [step]);

  /* Si la validación falla, el foco va al primer campo con error, una vez pintados los mensajes. */
  useEffect(() => {
    if (focusRequest > 0) document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [focusRequest]);

  const go = (target: number) => {
    moved.current = true;
    setFormError(undefined);
    setStep(target);
  };

  const validatedGeneral = validateGeneralInfo(general, { existingNames, today });
  const validatedSettings = validateSettings(settings);
  const chosenAffiliation = parseAffiliation(affiliation) ?? "all";

  const next = async () => {
    if (step === 1) {
      if (!validatedGeneral.ok) {
        setGeneralErrors(validatedGeneral.errors);
        setFocusRequest((count) => count + 1);
        return;
      }
      setGeneralErrors({});
      go(2);
    } else if (step === 2) {
      if (!validatedSettings.ok) {
        setSettingsErrors(validatedSettings.errors);
        setFocusRequest((count) => count + 1);
        return;
      }
      setSettingsErrors({});
      go(3);
    } else if (step === 3) {
      if (countParticipants(people, chosenAffiliation).eligible === 0) {
        setParticipantsError("No hay personas con esa afiliación en el padrón. Elige otra.");
        return;
      }
      setParticipantsError(undefined);
      go(4);
    } else {
      await create();
    }
  };

  const create = async () => {
    setSaving(true);
    setFormError(undefined);
    const result = await createElectionAction({ general, settings, affiliation });
    if (result.ok) {
      // Se mantiene «Creando…» hasta salir de la pantalla: así no se crea dos veces.
      toast({ title: result.message, kind: "ok" });
      router.push("/elections");
      return;
    }
    setSaving(false);
    if (result.generalErrors) {
      setGeneralErrors(result.generalErrors);
      go(1);
    } else if (result.settingsErrors) {
      setSettingsErrors(result.settingsErrors);
      go(2);
    }
    setFormError(result.message);
  };

  const title = STEPS[step - 1] ?? STEPS[0];

  return (
    <div className="av-wizard elec-wizard">
      <aside className="av-wizard__side av-surface av-surface--pad">
        <ElectionStepper steps={STEPS} current={step} label="Progreso del proceso electoral" />
      </aside>

      <div className="av-wizard__body">
        <section className="av-surface av-surface--pad" aria-labelledby="election-step-title">
          <div className="av-surface__head">
            <h2 id="election-step-title" tabIndex={-1} ref={heading}>
              {title}
            </h2>
            <p>
              Paso {step} de {STEPS.length}
            </p>
          </div>

          {formError ? (
            <Alert tone="error" className="elec-alert">
              {formError}
            </Alert>
          ) : null}

          <div key={step} className="wiz-step">
          {step === 1 ? (
            <GeneralStep
              values={general}
              errors={generalErrors}
              today={today}
              onChange={(field, value) => {
                setGeneral((current) => ({ ...current, [field]: value }));
                setGeneralErrors((current) => ({ ...current, [field]: undefined }));
              }}
            />
          ) : null}
          {step === 2 ? (
            <SettingsStep
              values={settings}
              errors={settingsErrors}
              onChange={(changes) => {
                setSettings((current) => ({ ...current, ...changes }));
                setSettingsErrors({});
              }}
            />
          ) : null}
          {step === 3 ? (
            <ParticipantsStep
              people={people}
              affiliation={affiliation}
              query={query}
              error={participantsError}
              onQuery={setQuery}
              onAffiliation={(value) => {
                setAffiliation(value);
                setParticipantsError(undefined);
              }}
            />
          ) : null}
          {step === 4 && validatedGeneral.ok && validatedSettings.ok ? (
            <ReviewStep general={general} settings={validatedSettings.value} affiliation={affiliation} query={query} people={people} institution={validatedGeneral.value.institution} kind={validatedGeneral.value.kind} />
          ) : null}
          </div>
        </section>

        <div className="wiz-footer elec-footer">
          <Button variant="ghost" onClick={() => go(step - 1)} disabled={step === 1 || saving}>
            <Icon name="arrow-left" /> Atrás
          </Button>
          <Button onClick={() => void next()} loading={saving}>
            {step === 4 ? (saving ? "Creando…" : <>Crear proceso electoral <Icon name="check2-circle" /></>) : <>Continuar <Icon name="arrow-right" /></>}
          </Button>
        </div>

        {/* Footer técnico del original: proceso, estado y versión de la aplicación. */}
        <div className="av-techbar">
          <span className="av-techbar__item">Proceso: <strong>Nuevo</strong></span>
          <span className="av-techbar__item">
            <span className="av-techbar__dot" aria-hidden="true" /> Estado: Borrador
          </span>
          <span className="av-techbar__item av-techbar__item--end">v0.1.0</span>
        </div>
      </div>
    </div>
  );
}
