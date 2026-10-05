import type { ComponentProps } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { cn } from "@/lib/utils";

/* Único punto de entrada a los iconos: las páginas nunca importan Lineicons directamente.
   Los iconos que el set gratuito no tiene (huella, información, advertencia…) viven en ./icons como SVG propios. */
type LineiconsProps = ComponentProps<typeof Lineicons>;

export type IconProps = Omit<LineiconsProps, "size"> & {
  /** Nombre accesible. Sin él, el icono es decorativo y se oculta a los lectores de pantalla. */
  label?: string;
  size?: number;
};

export function Icon({ label, size = 20, className, ...props }: IconProps) {
  return (
    <Lineicons
      {...props}
      size={size}
      strokeWidth={1.75}
      className={cn("shrink-0", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: "false" })}
    />
  );
}
