"use client";
import { useState } from "react";
import { Chip } from "@/components/ui/feedback";
import { Icon, type IconName } from "@/components/ui/icon";
import { useToast } from "@/components/ui/overlay";

type DeviceState = "on" | "off" | "err";
type Device = { id: string; name: string; location: string; state: DeviceState; last: string; icon: IconName; why?: string };

const INITIAL: Device[] = [
  { id: "CAM-001", name: "Cámara de ingreso", location: "Puerta 1", state: "on", last: "Hace 1 min", icon: "camera-video" },
  { id: "LEC-001", name: "Lector de huella", location: "Puerta 1", state: "on", last: "Hace 1 min", icon: "fingerprint" },
  { id: "CAM-002", name: "Cámara de oficina", location: "Secretaría", state: "off", last: "Hace 2 h", icon: "camera-video-off" },
  { id: "LEC-002", name: "Lector de huella", location: "Secretaría", state: "err", last: "Hace 4 min", icon: "fingerprint", why: "Lectura inestable" },
  { id: "KIOSCO-01", name: "Kiosco de votación", location: "Sala B", state: "on", last: "Hace 3 min", icon: "display" },
];
const CHIP = { on: ["success", "Conectado", "check-circle"], off: ["warning", "Desconectado", "plug"], err: ["error", "Con error", "x-circle"] } as const;

/** Estado de dispositivos: estado en texto + icono, última señal y una acción por fila. */
export function DeviceList() {
  const toast = useToast();
  const [devices, setDevices] = useState(INITIAL);
  const [connecting, setConnecting] = useState<string | null>(null);

  const act = (d: Device) => {
    if (d.state === "off") {
      setConnecting(d.id);
      setTimeout(() => {
        setDevices((ds) => ds.map((x) => (x.id === d.id ? { ...x, state: "on", last: "Ahora" } : x)));
        setConnecting(null);
        toast({ title: `${d.id} conectado`, text: "El dispositivo volvió a responder.", kind: "ok" });
      }, 900);
    } else if (d.state === "err") toast({ title: "Prueba fallida", text: `${d.id} sigue respondiendo con errores.`, kind: "bad" });
    else toast({ title: "Prueba correcta", text: `${d.id} respondió en 0.4 s.`, kind: "ok" });
  };

  return (
    <ul className="pt-devs">
      {devices.map((d) => {
        const [tone, text, icon] = CHIP[d.state];
        const verb = d.state === "off" ? "Reconectar" : "Probar";
        return (
          <li key={d.id} className="pt-dev" data-st={d.state}>
            <span className="pt-dev__ic"><Icon name={d.icon} /></span>
            <div>
              <b>{d.id} · {d.name}</b>
              <small>{d.location} · Última señal <span title="Hora de ejemplo">{d.last}</span>{d.why ? ` · ${d.why}` : ""}</small>
            </div>
            <Chip tone={tone} icon={icon}>{text}</Chip>
            <button className="pt-dev__act" type="button" aria-label={`${verb} ${d.id}`} disabled={connecting === d.id} onClick={() => act(d)}>{connecting === d.id ? "Conectando…" : verb}</button>
          </li>
        );
      })}
    </ul>
  );
}

/** Consentimiento biométrico: va antes de la primera captura; la casilla nunca viene marcada. El texto legal lo fija el área jurídica. */
export function BiometricConsent() {
  const toast = useToast();
  const [checked, setChecked] = useState(false);
  const [msg, setMsg] = useState("");
  return (
    <div className="pt-card pt-cons">
      <h3 className="pt-card__t">Tu rostro y tu huella, con tu permiso</h3>
      <p className="pt-card__s">Antes de empezar, esto es lo que vamos a hacer con tus datos.</p>
      <dl>
        <div><dt>Qué guardamos</dt><dd>Una plantilla matemática de tu rostro y huella. No guardamos fotos ni imágenes de tu huella.</dd></div>
        <div><dt>Para qué</dt><dd>Solo para verificar que eres tú cuando ingresas o participas en un proceso de tu institución.</dd></div>
        <div><dt>Cuánto tiempo</dt><dd>Mientras tengas vínculo con tu institución. Después se eliminan.</dd></div>
        <div><dt>Cómo revocar</dt><dd>Desde tu perfil o escribiendo a tu administrador. Revocar no afecta a tus datos de cuenta.</dd></div>
      </dl>
      <label className="hz-check"><input type="checkbox" checked={checked} onChange={(e) => { setChecked(e.target.checked); setMsg(""); }} /> Entiendo y acepto el tratamiento de mis datos biométricos.</label>
      <div className="pt-actions">
        <button className="hz-btn hz-btn--primary" type="button" disabled={!checked} onClick={() => { setMsg("Gracias. Continuamos con la captura."); toast({ title: "Consentimiento registrado", text: "Se guardaría con la fecha y la versión del texto.", kind: "ok" }); }}>Aceptar y continuar →</button>
        <button className="hz-btn hz-btn--ghost" type="button" onClick={() => setMsg("Entendido. Sin tu permiso no podemos usar cámara ni huella; puedes volver cuando quieras.")}>Ahora no</button>
      </div>
      <p className="hz-help" role="status" style={{ marginTop: ".8rem" }}>{msg}</p>
    </div>
  );
}
