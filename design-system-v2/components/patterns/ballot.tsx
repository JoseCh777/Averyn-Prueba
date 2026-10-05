"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Segmented } from "@/components/ui/segmented";
import { useToast } from "@/components/ui/overlay";

type Mode = "formula" | "unica";
type Who = [string, string][];
type Option = { v: string; n: string; party: string; who: Who | null };

const FORM: Who = [["Presidente", "Nombre Apellido"], ["Vicepresidente", "Nombre Apellido"]];
const SOLO: Who = [["Candidata a representante", "Nombre Apellido"]];
/* NOTA: en el modelo oficial hoy un candidato es una persona por cargo y la selección es única; la variante «fórmula» no tiene respaldo. */
const MODES: Record<Mode, { title: [string, string]; sub: string; rule: string; who: Who }> = {
  formula: { title: ["Voto por la fórmula de", "Presidente y Vicepresidente"], sub: "Elecciones de ejemplo · Periodo 2026 – 2030", rule: "Marque solo una opción de su preferencia", who: FORM },
  unica: { title: ["Voto por el representante", "de los estudiantes"], sub: "Elecciones de ejemplo · Un cargo, una persona por lista", rule: "Marque solo una persona de su preferencia", who: SOLO },
};
const optionsFor = (m: Mode): Option[] => [
  { v: "1", n: "1", party: "Lista Horizonte", who: MODES[m].who },
  { v: "2", n: "2", party: "Lista Cima", who: MODES[m].who },
  { v: "3", n: "3", party: "Lista Raíz", who: MODES[m].who },
  { v: "blanco", n: "", party: "Voto en blanco", who: null },
];

function Box({ o, radio, checked, onChange }: { o: Option; radio?: boolean; checked?: boolean; onChange?: () => void }) {
  const name = o.who ? `${o.party}, número ${o.n}. ${o.who.map((w) => `${w[0]} ${w[1]}`).join(". ")}` : "Voto en blanco";
  return (
    <label className={`tj-opt${o.who ? (o.who.length === 1 ? " tj-opt--solo" : "") : " tj-opt--blank"}`}>
      {radio && <input type="radio" name="voto" value={o.v} aria-label={name} checked={checked} onChange={onChange} />}
      <span className="tj-opt__ok"><Icon name="check-lg" />Marcada</span>
      {o.who ? (
        <>
          <span className="tj-opt__n">{o.n}</span>
          <span className="tj-opt__ph">{o.who.map((_, i) => <span key={i} className="tj-opt__f"><Icon name="person-fill" /></span>)}</span>
          <span className="tj-opt__who">{o.who.map((w) => <span key={w[0]}>{w[0]}<b>{w[1]}</b></span>)}</span>
          <span className="tj-opt__logo">Logo · {o.party}</span>
        </>
      ) : <span className="tj-opt__mid">Voto<br />en blanco</span>}
    </label>
  );
}

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const rnd = (n: number) => Array.from({ length: n }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");

/**
 * Tarjetón en tres pasos: elegir → revisar → comprobante. El comprobante prueba que un voto fue emitido sin decir cuál ni de quién;
 * el código es de ejemplo (en producción lo genera el servidor al azar).
 */
export function Ballot() {
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("formula");
  const [step, setStep] = useState(0);
  const [vote, setVote] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ code: string; time: string } | null>(null);
  const heads = [useRef<HTMLHeadingElement>(null), useRef<HTMLHeadingElement>(null), useRef<HTMLHeadingElement>(null)];
  const moved = useRef(false);
  useEffect(() => { if (moved.current) heads[step].current?.focus(); }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const opts = optionsFor(mode);
  const chosen = opts.find((o) => o.v === vote);
  const M = MODES[mode];
  const go = (i: number, focus?: boolean) => { moved.current = !!focus; setStep(i); };

  return (
    <div className="pt-card tj-card" style={{ marginTop: "1.8rem" }}>
      <ol className="pt-ballot-step" aria-label="Pasos de la votación">
        {["1 Elegir", "2 Revisar", "3 Comprobante"].map((t, i) => <li key={t} aria-current={i === step ? "step" : undefined}>{t}</li>)}
      </ol>
      <div hidden={step !== 0}>
        <div className="pt-ctrl">
          <span className="stage__label mono">Tipo de tarjetón</span>
          <Segmented<Mode> label="Tipo de tarjetón" value={mode} onChange={(m) => { setMode(m); setVote(null); }} options={[{ value: "formula", label: "Fórmula (2 personas)" }, { value: "unica", label: "Una persona por partido" }]} />
        </div>
        <fieldset className="tj-fs">
          <legend className="sr-only">Tarjetón: elige una opción</legend>
          <div className="tj">
            <span className="tj__mark" aria-hidden="true">Muestra · no válida para votar</span>
            <header className="tj__head">
              <span className="tj__crest" aria-hidden="true">Logo de la elección</span>
              <div><h3 className="tj__title">{M.title[0]}<br />{M.title[1]}</h3><p className="tj__sub">{M.sub}</p></div>
              <span className="tj__code mono" aria-hidden="true">Serie 000001</span>
            </header>
            <p className="tj__rule">{M.rule}</p>
            <div className="tj__grid">{opts.map((o) => <Box key={o.v} o={o} radio checked={vote === o.v} onChange={() => setVote(o.v)} />)}</div>
          </div>
        </fieldset>
        <div className="pt-actions">
          <button className="hz-btn hz-btn--primary" type="button" disabled={!vote} onClick={() => go(1, true)}>Revisar mi voto →</button>
          <span className="hz-help" role="status">{chosen ? `Marcaste: ${chosen.who ? `${chosen.party} (número ${chosen.n})` : "voto en blanco"}.` : "Aún no has elegido una opción."}</span>
        </div>
      </div>
      <div hidden={step !== 1}>
        <h3 className="pt-card__t" tabIndex={-1} ref={heads[1]}>Revisa antes de confirmar</h3>
        <p className="pt-card__s">Después de confirmar no podrás cambiar tu voto.</p>
        <div className="tj-rev">{chosen && step === 1 && <Box o={chosen} />}</div>
        <div className="pt-actions">
          <button className="hz-btn hz-btn--primary" type="button" onClick={() => { setReceipt({ code: `AV-${rnd(4)}-${rnd(4)}`, time: new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date()) }); go(2, true); }}>Confirmar voto</button>
          <button className="hz-btn hz-btn--ghost" type="button" onClick={() => go(0)}>Volver</button>
        </div>
      </div>
      <div hidden={step !== 2}>
        <h3 className="pt-card__t" tabIndex={-1} ref={heads[2]}>Tu voto fue registrado.</h3>
        <p className="pt-card__s">Guarda este código para comprobar que tu voto fue contado.</p>
        <div className="pt-rc">
          <span className="stage__label mono">Código de comprobante</span>
          <p className="pt-rc__code">{receipt?.code ?? "AV-7K3Q-92XD"}</p>
          <dl><dt>Emitido</dt><dd>{receipt?.time ?? "—"}</dd><dt>Elección</dt><dd>Elecciones de ejemplo</dd></dl>
        </div>
        <p className="ds-note"><Icon name="shield-lock" /> Este comprobante no contiene tu elección ni tu identidad.</p>
        <div className="pt-actions">
          <button className="hz-btn hz-btn--primary" type="button" onClick={() => { navigator.clipboard?.writeText(receipt?.code ?? ""); toast({ title: "Copiado", text: "Código de comprobante", kind: "ok" }); }}>Copiar código</button>
          <button className="hz-btn hz-btn--ghost" type="button" onClick={() => { setVote(null); setReceipt(null); go(0); }}>Reiniciar demo</button>
        </div>
      </div>
    </div>
  );
}
