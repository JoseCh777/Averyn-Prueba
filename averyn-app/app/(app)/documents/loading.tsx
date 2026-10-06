import { SkeletonLines } from "@/components/ui/feedback";

/**
 * Estado de carga de Documentos mientras llega el historial (coding-standard 22).
 *
 * @returns Un esqueleto con su nombre accesible «Cargando documentos».
 */
export default function DocumentsLoading() {
  return <SkeletonLines lines={7} label="Cargando documentos" />;
}
