import { Chip } from "@/components/ui/feedback";

import { DEVICE_STATUS_CHIP, METHOD_LABEL } from "../labels";
import type { BiometricDevice } from "../types";

/**
 * Tarjetas con el estado de los dispositivos de captura.
 *
 * @param props - Los dispositivos.
 * @returns La lista de tarjetas.
 */
export function DevicesGrid({ devices }: { devices: readonly BiometricDevice[] }) {
  return (
    <ul className="bio-devices">
      {devices.map((device) => {
        const status = DEVICE_STATUS_CHIP[device.status];
        return (
          <li key={device.id} className="av-surface av-surface--pad bio-device">
            <div className="bio-device__head">
              <div>
                <h3>{device.name}</h3>
                <p>
                  {device.id} · {METHOD_LABEL[device.kind]}
                </p>
              </div>
              <Chip tone={status.tone} icon={status.icon}>
                {status.label}
              </Chip>
            </div>
            <dl className="av-detail">
              <div>
                <dt>Modelo</dt>
                <dd>{device.model}</dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>{device.location}</dd>
              </div>
              <div>
                <dt>Serial</dt>
                <dd className="av-cell-mono">{device.serial}</dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}
