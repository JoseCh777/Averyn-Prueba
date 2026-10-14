"use client";

import { Segmented } from "@/components/ui/segmented";

import { directionsOf } from "../access-rules";
import { DIRECTION_LABEL, policyLabel } from "../labels";
import type { AccessDirection, Checkpoint } from "../types";

type CheckpointPickerProps = {
  checkpoints: readonly Checkpoint[];
  checkpoint: Checkpoint;
  direction: AccessDirection;
  onChange: (checkpoint: Checkpoint, direction: AccessDirection) => void;
};

/**
 * Selector del punto de control que atiende el operador y, si el punto admite ambos sentidos, de
 * entrada o salida. Debajo resume la política que se aplicará.
 *
 * Cambiar de punto o de sentido vuelve a empezar con la persona en curso, para no mezclar factores
 * de políticas distintas.
 *
 * @param props - Los puntos, el actual, el sentido y qué hacer al cambiar.
 * @returns El selector.
 */
export function CheckpointPicker({ checkpoints, checkpoint, direction, onChange }: CheckpointPickerProps) {
  const directions = directionsOf(checkpoint.direction);
  return (
    <div className="acc-picker">
      <div className="acc-picker__row">
        <span className="acc-label" id="acc-checkpoint-label">
          Punto de control
        </span>
        <Segmented
          label="Punto de control"
          value={checkpoint.id}
          options={checkpoints.map((item) => ({ value: item.id, label: item.name }))}
          onChange={(id) => {
            const next = checkpoints.find((item) => item.id === id);
            if (next !== undefined) onChange(next, directionsOf(next.direction)[0] ?? "ENTRY");
          }}
        />
      </div>
      {directions.length > 1 ? (
        <div className="acc-picker__row">
          <span className="acc-label">Sentido</span>
          <Segmented
            label="Sentido del paso"
            value={direction}
            options={directions.map((item) => ({ value: item, label: DIRECTION_LABEL[item] }))}
            onChange={(next) => onChange(checkpoint, next)}
          />
        </div>
      ) : null}
      <p className="acc-hint">
        Verificación: <b>{policyLabel(checkpoint.policy)}</b>
        {directions.length === 1 ? ` · Solo ${DIRECTION_LABEL[direction].toLowerCase()}` : ""}
      </p>
    </div>
  );
}
