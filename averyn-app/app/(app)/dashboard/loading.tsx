import { SkeletonLines } from "@/components/ui/feedback";

/**
 * Estado de carga del dashboard mientras llega el resumen (coding-standard 22).
 *
 * @returns Un esqueleto con su nombre accesible «Cargando el dashboard».
 */
export default function DashboardLoading() {
  return <SkeletonLines lines={6} label="Cargando el dashboard" />;
}
