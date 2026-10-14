"use client";

import { useNewPersonForm } from "../use-new-person-form";
import { NewPersonForm } from "./new-person-form";
import { PersonPreview } from "./person-preview";

/**
 * Espacio de trabajo del alta: el formulario a la izquierda y, a su lado, la vista previa de la
 * persona. Es un Client Component porque ambos comparten lo que se va escribiendo.
 *
 * @returns El formulario y su vista previa.
 */
export function NewPersonWorkspace() {
  const controller = useNewPersonForm();
  return (
    <div className="idn-layout">
      <NewPersonForm controller={controller} />
      <PersonPreview fields={controller.fields} />
    </div>
  );
}
