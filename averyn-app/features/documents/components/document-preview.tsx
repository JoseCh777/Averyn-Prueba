import { Icon, type IconName } from "@/components/ui/icon";

import { UNREADABLE_DOCUMENT_MESSAGE } from "../labels";

/** Estado de la captura del documento. */
export type ScanState = "empty" | "reading" | "ready" | "failed";

const MESSAGES: Record<ScanState, { icon: IconName; text: string }> = {
  empty: { icon: "search", text: "Sube o captura el documento." },
  reading: { icon: "arrow-repeat", text: "Leyendo el documento…" },
  ready: { icon: "check-circle", text: "Datos extraídos correctamente." },
  failed: { icon: "x-circle", text: UNREADABLE_DOCUMENT_MESSAGE },
};

/** Estado visual de las esquinas del visor (los estilos del patrón conocen `searching` y `ok`). */
const VIEWER_STATE: Record<ScanState, "searching" | "ok" | "bad"> = { empty: "searching", reading: "searching", ready: "ok", failed: "bad" };

/**
 * Visor del documento: una ilustración del documento con marco de captura y el estado debajo.
 *
 * Es una ilustración, no la imagen real (el archivo lo recibirá el Core). Las esquinas cambian
 * de color y siempre hay un mensaje escrito (`role="status"`).
 *
 * @param props - El estado de la captura y, si hay, el origen (archivo o cámara).
 * @returns El visor.
 */
export function DocumentPreview({ state, source }: { state: ScanState; source?: string }) {
  const message = MESSAGES[state];
  return (
    <div className="pt-doc" data-state={VIEWER_STATE[state]}>
      <span className="av-capture__ready">
        <Icon name="signal" />
        Scanner ready
      </span>
      <div className="pt-doc__card" aria-hidden="true">
        <div className="pt-doc__ph" />
        {([["20%", "46%"], ["38%", "38%"], ["56%", "44%"], ["74%", "30%"]] as const).map(([top, width]) => (
          <div key={top} className="pt-doc__ln" style={{ top, width }} />
        ))}
      </div>
      <div className="pt-doc__corners" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <span className="pt-view__tag">{source ?? "Documento · ilustración"}</span>
      <div className="pt-view__msg" role="status">
        <Icon name={message.icon} />
        <span>{message.text}</span>
      </div>
    </div>
  );
}
