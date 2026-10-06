"use client";

import { Field, Select, Switch } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";

import { CHOICES_PER_VOTE_OPTIONS, SETTING_SWITCHES, VOTING_MODES, VOTING_MODE_LABEL, VOTING_TYPES, VOTING_TYPE_LABEL } from "../labels";
import type { SettingsField, SettingsInput, VotingMode } from "../types";

type SettingsStepProps = {
  values: SettingsInput;
  errors: Partial<Record<SettingsField, string>>;
  onChange: (changes: Partial<SettingsInput>) => void;
};

/**
 * Paso 2 del asistente: configuración de la votación.
 *
 * En voto único cada votante marca una sola opción, así que «Número de opciones por voto» queda
 * fijo en 1 y deshabilitado.
 *
 * @param props - Los valores, los errores y quién avisa de los cambios.
 * @returns Los campos del paso.
 */
export function SettingsStep({ values, errors, onChange }: SettingsStepProps) {
  const single = values.votingType === "single";
  return (
    <div className="elec-settings">
      <div className="av-form-grid">
        <Field id="election-voting-type" label="Tipo de votación" error={errors.votingType}>
          {(a) => (
            <Select {...a} value={values.votingType} onChange={(event) => onChange({ votingType: event.target.value, choicesPerVote: event.target.value === "single" ? "1" : values.choicesPerVote })}>
              <option value="">Selecciona un tipo de votación</option>
              {VOTING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {VOTING_TYPE_LABEL[type]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="election-choices" label="Número de opciones por voto" error={errors.choicesPerVote} help={single ? "En voto único se marca una sola opción." : undefined}>
          {(a) => (
            <Select {...a} value={single ? "1" : values.choicesPerVote} disabled={single} onChange={(event) => onChange({ choicesPerVote: event.target.value })}>
              {CHOICES_PER_VOTE_OPTIONS.map((count) => (
                <option key={count} value={String(count)}>
                  {count} {count === 1 ? "opción" : "opciones"}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <div className="av-field">
        <span className="av-label">Modalidad</span>
        <Segmented<VotingMode>
          label="Modalidad"
          value={VOTING_MODES.find((mode) => mode === values.mode) ?? "online"}
          onChange={(mode) => onChange({ mode })}
          options={VOTING_MODES.map((mode) => ({ value: mode, label: VOTING_MODE_LABEL[mode] }))}
        />
        {errors.mode ? <span className="av-err">{errors.mode}</span> : null}
      </div>

      <h3 className="elec-subtitle">Opciones de votación</h3>
      <div className="elec-switches">
        {SETTING_SWITCHES.map((option) => (
          <div key={option.key} className="sw-row">
            <Switch label={option.label} checked={values[option.key]} onCheckedChange={(checked) => onChange({ [option.key]: checked })} />
            <span aria-hidden="true" onClick={() => onChange({ [option.key]: !values[option.key] })}>
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
