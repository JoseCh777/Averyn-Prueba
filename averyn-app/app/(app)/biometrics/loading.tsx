import { SkeletonLines } from "@/components/ui/feedback";

/**
 * Estado de carga de Biometría mientras llegan los datos (coding-standard 22).
 *
 * @returns Un esqueleto con su nombre accesible «Cargando biometría».
 */
export default function BiometricsLoading() {
  return <SkeletonLines lines={7} label="Cargando biometría" />;
}
