import { nextStep, type GateStep } from "./access-rules";
import type { AccessDirection, AccessFactor, AccessResult, Candidate, Checkpoint, DenyReason } from "./types";

/**
 * Estado del paso a paso de una persona en la puerta. Es puro: la pantalla solo lo despacha y lo
 * pinta. Los valores sensibles (el código QR) viven aquí, en la memoria del navegador, hasta que se
 * envía el intento; nada se guarda en el almacenamiento del navegador.
 */

/** Una captura biométrica (rostro o huella), con el desenlace que simula el mock. */
export type BiometricFactor = Extract<AccessFactor, { capture: unknown }>;

/** Cómo terminó el intento: una decisión de acceso o una persona que no se pudo identificar. */
export type GateOutcome = { kind: "access"; data: AccessResult } | { kind: "identity"; reason: DenyReason };

export interface GateFlowState {
  checkpoint: Checkpoint;
  direction: AccessDirection;
  identity: { personId: string; displayName: string } | undefined;
  /** Factores ya aportados, en el orden de la política. */
  factors: AccessFactor[];
  /** Personas propuestas por una identificación 1:N que el operador debe confirmar. */
  candidates: Candidate[];
  /** Captura biométrica que originó los candidatos; se reenvía con `operatorConfirmed`. */
  pendingFactor: BiometricFactor | undefined;
  outcome: GateOutcome | undefined;
}

export type GateFlowAction =
  | { type: "start"; checkpoint: Checkpoint; direction: AccessDirection }
  | { type: "identified"; personId: string; displayName: string; factor: AccessFactor }
  | { type: "identity-rejected"; reason: DenyReason }
  | { type: "candidates"; candidates: Candidate[]; factor: BiometricFactor }
  | { type: "confirmed"; candidate: Candidate }
  | { type: "picked"; candidate: Candidate }
  | { type: "factor"; factor: AccessFactor }
  | { type: "result"; data: AccessResult }
  | { type: "retry" };

/**
 * Estado inicial de una persona nueva en un punto de control.
 *
 * @param checkpoint - Punto de control elegido.
 * @param direction - Sentido del paso.
 * @returns El estado sin nada verificado.
 */
export function initialGateState(checkpoint: Checkpoint, direction: AccessDirection): GateFlowState {
  return { checkpoint, direction, identity: undefined, factors: [], candidates: [], pendingFactor: undefined, outcome: undefined };
}

/**
 * Aplica una acción al estado del paso a paso.
 *
 * @param state - Estado actual.
 * @param action - Lo que ocurrió.
 * @returns El estado nuevo (nunca modifica el anterior).
 */
export function gateReducer(state: GateFlowState, action: GateFlowAction): GateFlowState {
  switch (action.type) {
    case "start":
      return initialGateState(action.checkpoint, action.direction);
    case "identified":
      return { ...state, identity: { personId: action.personId, displayName: action.displayName }, factors: [...state.factors, action.factor] };
    case "identity-rejected":
      return { ...state, outcome: { kind: "identity", reason: action.reason } };
    case "candidates":
      return { ...state, candidates: action.candidates, pendingFactor: action.factor };
    case "confirmed":
      return {
        ...state,
        identity: { personId: action.candidate.personId, displayName: action.candidate.displayName },
        factors: state.pendingFactor === undefined ? state.factors : [...state.factors, { ...state.pendingFactor, operatorConfirmed: true }],
        candidates: [],
        pendingFactor: undefined,
      };
    case "picked":
      return { ...state, identity: { personId: action.candidate.personId, displayName: action.candidate.displayName } };
    case "factor":
      return { ...state, factors: [...state.factors, action.factor] };
    case "result":
      return { ...state, outcome: { kind: "access", data: action.data } };
    case "retry":
      // Se repite solo la verificación biométrica: el QR no se consumió porque el acceso no se concedió.
      return { ...state, outcome: undefined, candidates: [], pendingFactor: undefined, factors: state.factors.filter((factor) => factor.method === "QR") };
  }
}

/**
 * Paso que toca ahora, o `undefined` mientras se espera la confirmación del operador o ya hay resultado.
 *
 * @param state - Estado actual.
 * @returns El paso, o `undefined` si no hay nada que pedir.
 */
export function currentStep(state: GateFlowState): GateStep | undefined {
  if (state.outcome !== undefined || state.candidates.length > 0) return undefined;
  return nextStep(state.checkpoint.policy, state.factors, state.identity !== undefined);
}

/** Motivos tras los que tiene sentido repetir la verificación biométrica con la misma persona. */
export const RETRYABLE_REASONS: readonly DenyReason[] = ["NO_MATCH", "LIVENESS_FAILED", "VERIFICATION_ERROR"];
