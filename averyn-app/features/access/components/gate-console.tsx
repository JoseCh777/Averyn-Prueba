"use client";

import { useReducer, useState } from "react";

import { Alert, Spinner } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Segmented } from "@/components/ui/segmented";

import { identifyAction, requestAccessAction, resetDemoAction } from "../actions";
import { directionsOf, nextStep, satisfiedGroups } from "../access-rules";
import { currentStep, gateReducer, initialGateState, type BiometricFactor } from "../gate-flow";
import { METHOD_ICON, METHOD_LABEL } from "../labels";
import type { AccessDirection, AccessFactor, AccessMethod, Candidate, Checkpoint } from "../types";
import { AccessResultCard } from "./access-result";
import { BiometricStep } from "./biometric-step";
import { CandidateList } from "./candidate-list";
import { CheckpointPicker } from "./checkpoint-picker";
import { DemoPanel, type DemoSettings } from "./demo-panel";
import { PolicySteps } from "./policy-steps";
import { QrStep } from "./qr-step";

type GateConsoleProps = {
  /** Al menos uno: la vista no monta la consola si el evento no tiene puntos de control. */
  checkpoints: [Checkpoint, ...Checkpoint[]];
  /** Personas dentro del evento, para elegir quién sale cuando el punto no pide verificación. */
  inside: Candidate[];
  /** Personas del padrón, para el panel de demostración. */
  people: Candidate[];
};

/**
 * Consola del operador de puerta: atiende a una persona a la vez, de la identificación al resultado.
 *
 * El estado del paso a paso vive en `gateReducer` (puro y probado); esta pantalla solo lo despacha
 * y llama a las acciones de servidor. **El navegador nunca decide**: `GRANTED` y `DENIED` llegan del
 * servicio, y la política que se pide también es la del punto de control.
 *
 * @param props - Los puntos de control, quienes están dentro y las personas de la demostración.
 * @returns La consola.
 */
export function GateConsole({ checkpoints, inside, people }: GateConsoleProps) {
  const [first] = checkpoints;
  const [flow, dispatch] = useReducer(gateReducer, undefined, () => initialGateState(first, directionsOf(first.direction)[0] ?? "ENTRY"));
  const [demo, setDemo] = useState<DemoSettings>({ outcome: "match", presenter: "" });
  const [chosen, setChosen] = useState<AccessMethod | undefined>(undefined);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { checkpoint, direction } = flow;
  const step = currentStep(flow);
  const satisfied = satisfiedGroups(checkpoint.policy, flow.factors);

  const restart = (next: Checkpoint, nextDirection: AccessDirection) => {
    setError(undefined);
    setChosen(undefined);
    dispatch({ type: "start", checkpoint: next, direction: nextDirection });
  };

  /** Envía el intento cuando los factores ya cubren la política; si no, espera el siguiente paso. */
  const advance = async (identity: { personId: string; displayName: string }, factors: AccessFactor[]) => {
    if (nextStep(checkpoint.policy, factors, true).kind !== "submit") return;
    setBusy(true);
    const result = await requestAccessAction({ checkpointId: checkpoint.id, personId: identity.personId, direction, factors });
    setBusy(false);
    if (result.ok) dispatch({ type: "result", data: result.data });
    else setError(result.message);
  };

  /** Identifica a la persona con el primer factor (QR, o captura 1:N con confirmación del operador). */
  const identify = async (factor: AccessFactor) => {
    setBusy(true);
    setError(undefined);
    const result = await identifyAction({ checkpointId: checkpoint.id, factor });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const data = result.data;
    if (data.identified && data.personId !== undefined && data.displayName !== undefined) {
      const identity = { personId: data.personId, displayName: data.displayName };
      dispatch({ type: "identified", ...identity, factor });
      await advance(identity, [...flow.factors, factor]);
    } else if (data.candidates.length > 0 && factor.method !== "QR") {
      dispatch({ type: "candidates", candidates: data.candidates, factor });
    } else if (data.reason !== undefined) {
      dispatch({ type: "identity-rejected", reason: data.reason });
    }
  };

  /** Recibe un factor del operador: identifica a la persona o lo suma a quien ya está identificada. */
  const collect = async (factor: AccessFactor) => {
    setError(undefined);
    if (flow.identity === undefined) {
      await identify(factor);
      return;
    }
    dispatch({ type: "factor", factor });
    await advance(flow.identity, [...flow.factors, factor]);
  };

  const biometricFactor = (method: BiometricFactor["method"]): BiometricFactor => ({
    method,
    capture: { simulate: demo.outcome, ...(demo.presenter === "" ? {} : { presenter: demo.presenter }) },
  });

  const confirm = async (candidate: Candidate) => {
    if (flow.pendingFactor === undefined) return;
    const factor: BiometricFactor = { ...flow.pendingFactor, operatorConfirmed: true };
    dispatch({ type: "confirmed", candidate });
    await advance({ personId: candidate.personId, displayName: candidate.displayName }, [...flow.factors, factor]);
  };

  const pickInside = async (candidate: Candidate) => {
    dispatch({ type: "picked", candidate });
    await advance({ personId: candidate.personId, displayName: candidate.displayName }, []);
  };

  const reset = async () => {
    setResetting(true);
    await resetDemoAction();
    setResetting(false);
    restart(checkpoint, direction);
  };

  const methods = step !== undefined && (step.kind === "identify" || step.kind === "factor") ? step.methods : [];
  const active = chosen !== undefined && methods.includes(chosen) ? chosen : methods[0];

  return (
    <div className="acc-console">
      <section className="av-surface av-surface--pad acc-card" aria-label="Punto de control">
        <CheckpointPicker checkpoints={checkpoints} checkpoint={checkpoint} direction={direction} onChange={restart} />
      </section>

      <section className="av-surface av-surface--pad acc-card acc-flow" aria-label="Verificación de la persona" aria-busy={busy}>
        {flow.outcome !== undefined ? (
          <AccessResultCard
            outcome={flow.outcome}
            direction={direction}
            onNext={() => restart(checkpoint, direction)}
            onRetry={() => {
              setError(undefined);
              dispatch({ type: "retry" });
            }}
          />
        ) : (
          <>
            {flow.identity !== undefined ? (
              <p className="acc-person">
                <Icon name="person-badge" /> Persona identificada: <b>{flow.identity.displayName}</b>
              </p>
            ) : null}
            <PolicySteps policy={checkpoint.policy} satisfied={satisfied} />
            {error !== undefined ? (
              <Alert tone="error" title="No se pudo completar el paso">
                {error}
              </Alert>
            ) : null}

            <div className="acc-active">
              {flow.candidates.length > 0 ? (
                <CandidateList
                  title="Confirme quién es"
                  description="Estas personas se parecen a la captura. Compare con quien está frente a usted y elija a la correcta."
                  candidates={flow.candidates}
                  emptyTitle="Sin candidatos"
                  disabled={busy}
                  onSelect={(candidate) => void confirm(candidate)}
                />
              ) : step?.kind === "pick-inside" ? (
                <CandidateList
                  title="¿Quién sale?"
                  description="Elija a la persona que figura dentro del evento."
                  candidates={inside}
                  emptyTitle="No hay personas dentro del evento"
                  disabled={busy}
                  onSelect={(candidate) => void pickInside(candidate)}
                />
              ) : active !== undefined ? (
                <>
                  {methods.length > 1 ? (
                    <Segmented
                      label="Método de verificación"
                      value={active}
                      options={methods.map((method) => ({ value: method, label: METHOD_LABEL[method] }))}
                      onChange={setChosen}
                    />
                  ) : null}
                  <h3 className="acc-subtitle">
                    <Icon name={METHOD_ICON[active]} /> {METHOD_LABEL[active]}
                  </h3>
                  {active === "QR" ? (
                    <QrStep key={`qr-${attempt}`} busy={busy} onSubmit={(code) => void collect({ method: "QR", code })} />
                  ) : (
                    <BiometricStep
                      key={`${active}-${attempt}`}
                      method={active}
                      busy={busy}
                      onCaptured={() => {
                        setAttempt((value) => value + 1);
                        void collect(biometricFactor(active));
                      }}
                    />
                  )}
                </>
              ) : busy ? (
                <p className="acc-wait" role="status">
                  <Spinner /> Registrando el intento…
                </p>
              ) : null}
            </div>
          </>
        )}
      </section>

      <DemoPanel value={demo} people={people} resetting={resetting} onChange={setDemo} onReset={() => void reset()} />
    </div>
  );
}
