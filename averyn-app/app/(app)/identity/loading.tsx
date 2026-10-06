import { SkeletonLines } from "@/components/ui/feedback";

/**
 * Estado de carga de Identidad mientras llegan las personas (coding-standard 22).
 *
 * @returns Un esqueleto con su nombre accesible «Cargando personas».
 */
export default function IdentityLoading() {
  return <SkeletonLines lines={7} label="Cargando personas" />;
}
