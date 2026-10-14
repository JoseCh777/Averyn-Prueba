import { SkeletonLines } from "@/components/ui/feedback";

/**
 * Estado de carga de Accesos mientras llegan los datos del evento.
 *
 * @returns Un esqueleto con su nombre accesible «Cargando control de acceso».
 */
export default function AccessLoading() {
  return <SkeletonLines lines={5} label="Cargando control de acceso" />;
}
