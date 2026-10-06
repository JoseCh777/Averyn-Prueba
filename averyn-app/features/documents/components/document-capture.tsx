"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Segmented } from "@/components/ui/segmented";
import { useToast } from "@/components/ui/overlay";

type Field = { label: string; value: string; confidence: number };
const FIELDS: Field[] = [
  { label: "N.º de documento", value: "12345678", confidence: 99.1 },
  { label: "Apellidos", value: "PÉREZ GARCÍA", confidence: 97.8 },
  { label: "Nombres", value: "MARÍA ELENA", confidence: 97.2 },
  { label: "Fecha de nacimiento", value: "14/03/1998", confidence: 95.4 },
  { label: "Dirección", value: "AV. LOS ALAMOS 245", confidence: 88.9 },
  { label: "Lugar de nacimiento", value: "LIMA", confidence: 86.3 },
];
/** Umbral de ejemplo: lo define el servicio de OCR. */
const LOW = 90;

type Status = { seen: boolean; fixed: boolean };

function Confidence({ f, s }: { f: Field; s: Status }) {
  const low = f.confidence < LOW;
  if (s.fixed) return <span className="pt-conf fixed"><Icon name="pencil" />Corregido</span>;
  if (low && !s.seen) return <span className="pt-conf low"><Icon name="exclamation-triangle" />Revisar · {f.confidence.toFixed(1)}%</span>;
  if (low) return <span className="pt-conf"><Icon name="check2" />Revisado · {f.confidence.toFixed(1)}%</span>;
  return <span className="pt-conf">{f.confidence.toFixed(1)}%</span>;
}

/** Captura de documento + revisión de datos leídos: nunca se avanza sin que la persona haya visto los campos de baja confianza. */
export function DocumentCapture() {
  const toast = useToast();
  const id = useId();
  const [doc, setDoc] = useState<"searching" | "ok">("ok");
  const [values, setValues] = useState(FIELDS.map((f) => f.value));
  const [st, setSt] = useState<Status[]>(FIELDS.map(() => ({ seen: false, fixed: false })));
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const pending = FIELDS.filter((f, i) => f.confidence < LOW && !st[i]!.seen && !st[i]!.fixed).length;
  const patch = (i: number, p: Partial<Status>) => setSt((a) => a.map((x, k) => (k === i ? { ...x, ...p } : x)));

  return (
    <div className="pt-ocr">
        <div>
          <div className="pt-doc" data-state={doc}>
            <div className="pt-doc__card" aria-hidden="true">
              <div className="pt-doc__ph" />
              {[["20%", "46%"], ["38%", "38%"], ["56%", "44%"], ["74%", "30%"]].map(([t, w]) => <div key={t} className="pt-doc__ln" style={{ top: t, width: w }} />)}
            </div>
            <div className="pt-doc__corners" aria-hidden="true"><i /><i /><i /><i /></div>
            <span className="pt-view__tag" style={{ color: "var(--av-night-text)" }}>Documento · simulado</span>
            <div className="pt-view__msg" role="status">
              <Icon name={doc === "ok" ? "check-circle" : "search"} />
              <span>{doc === "ok" ? "Documento detectado." : "Alinea el documento dentro del marco."}</span>
            </div>
          </div>
          <div className="pt-ctrl" style={{ margin: "1rem 0 0" }}>
            <span className="stage__label mono">Estado</span>
            <Segmented label="Estado de la captura del documento" value={doc} onChange={setDoc} options={[{ value: "searching", label: "Buscando" }, { value: "ok", label: "Detectado" }]} />
          </div>
        </div>
        <div>
          <h3 className="pt-card__t">Revisa los datos leídos</h3>
          <p className="pt-card__s" role="status">
            {pending ? `${pending} ${pending === 1 ? "campo con baja confianza. Revísalo" : "campos con baja confianza. Revísalos"} antes de continuar.` : "Todo revisado. Puedes confirmar los datos."}
          </p>
          <div className="pt-fields">
            {FIELDS.map((f, i) => (
              <div className="pt-fld" key={f.label}>
                <label className="av-label" htmlFor={`${id}-${i}`}>{f.label}</label>
                <input
                  className="av-input"
                  id={`${id}-${i}`}
                  autoComplete="off"
                  value={values[i]}
                  onChange={(e) => { setValues((v) => v.map((x, k) => (k === i ? e.target.value : x))); patch(i, { fixed: e.target.value !== f.value, seen: true }); }}
                  onBlur={() => { if (!st[i]!.seen) patch(i, { seen: true }); }}
                />
                <span><Confidence f={f} s={st[i]!} /></span>
              </div>
            ))}
          </div>
          <div className="pt-actions">
            <button className="av-btn av-btn--primary" type="button" disabled={pending > 0} onClick={() => toast({ title: "Datos confirmados", text: "Aquí avanzaría al siguiente paso.", kind: "ok" })}>Confirmar datos →</button>
            <button className="av-btn av-btn--ghost" type="button" onClick={() => { setDoc("searching"); timer.current = setTimeout(() => setDoc("ok"), 1200); }}>Volver a capturar</button>
          </div>
        </div>
    </div>
  );
}
