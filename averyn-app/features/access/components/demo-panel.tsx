"use client";

import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { Tag } from "@/components/ui/feedback";
import { Segmented } from "@/components/ui/segmented";

import { OUTCOME_LABEL } from "../labels";
import type { Candidate, SimulatedOutcome } from "../types";

/** Lo que fuerza la demostración en la próxima captura biométrica. */
export interface DemoSettings {
  outcome: SimulatedOutcome;
  /** Persona que se presenta ante el lector; vacío es «la misma persona que se verifica». */
  presenter: string;
}

type DemoPanelProps = {
  value: DemoSettings;
  people: readonly Candidate[];
  resetting: boolean;
  onChange: (value: DemoSettings) => void;
  onReset: () => void;
};

const OUTCOMES = (Object.keys(OUTCOME_LABEL) as SimulatedOutcome[]).map((outcome) => ({ value: outcome, label: OUTCOME_LABEL[outcome] }));

/**
 * [MOCK] Panel de demostración: fuerza el resultado de la próxima verificación biométrica y
 * devuelve la demo a su estado inicial. No existe en producción: ahí decide el servicio biométrico.
 * TODO(AVY-048): retirar cuando el servicio sea el del Core.
 *
 * @param props - Los ajustes, las personas y las acciones.
 * @returns El panel plegable.
 */
export function DemoPanel({ value, people, resetting, onChange, onReset }: DemoPanelProps) {
  return (
    <details className="acc-demo">
      <summary>
        Demostración <Tag>Mock</Tag>
      </summary>
      <div className="acc-demo__body">
        <p className="acc-hint">Defina qué responderá el servicio biométrico en la próxima captura.</p>
        <div className="acc-demo__field">
          <span className="acc-label">Resultado de la captura</span>
          <Segmented label="Resultado de la captura" value={value.outcome} options={OUTCOMES} onChange={(outcome) => onChange({ ...value, outcome })} />
        </div>
        <Field label="Persona frente al lector" help="Elija otra persona para ver un rechazo por suplantación.">
          {(aria) => (
            <Select {...aria} value={value.presenter} onChange={(event) => onChange({ ...value, presenter: event.target.value })}>
              <option value="">La misma persona que se verifica</option>
              {people.map((person) => (
                <option key={person.personId} value={person.personId}>
                  {person.displayName}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Button variant="light" onClick={onReset} loading={resetting}>
          Reiniciar demostración
        </Button>
      </div>
    </details>
  );
}
