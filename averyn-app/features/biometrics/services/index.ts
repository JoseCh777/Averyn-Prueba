import type { BiometricService } from "./biometric-service";
import { MockBiometricService } from "./mock-biometric-service";

/**
 * Servicio biométrico que usa la aplicación: único lugar que elige la implementación.
 * TODO(AVY-009): cambiar `MockBiometricService` por el servicio que llama al Core.
 */
export const biometricService: BiometricService = new MockBiometricService();

export type { BiometricService, OperationInput } from "./biometric-service";
