import { SkeletonLines } from "@/components/ui/feedback";

/**
 * Estado de carga de Procesos electorales mientras llegan los datos (coding-standard 22).
 *
 * @returns Un esqueleto con su nombre accesible «Cargando procesos electorales».
 */
export default function ElectionsLoading() {
  return <SkeletonLines lines={5} label="Cargando procesos electorales" />;
}
