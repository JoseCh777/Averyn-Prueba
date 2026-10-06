"use client";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Diálogo modal nativo (<dialog>): el navegador atrapa el foco y cierra con Esc. */
export function Modal({ open, onClose, title, children, actions }: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  /** Botones del pie; el primero con foco inicial lo decide quien llama. */
  actions?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const tid = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="av-modal" aria-labelledby={tid} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="av-modal__body"><h3 id={tid}>{title}</h3>{children}</div>
      {actions && <div className="av-modal__foot">{actions}</div>}
    </dialog>
  );
}

/** Tooltip: aparece con hover y con foco de teclado; el disparador queda descrito por la burbuja. */
export function Tooltip({ text, children }: { text: ReactNode; children: (a: { "aria-describedby": string }) => ReactNode }) {
  const id = useId();
  return (
    <span className="av-tip">
      {children({ "aria-describedby": id })}
      <span className="av-tip__bubble" role="tooltip" id={id}>{text}</span>
    </span>
  );
}

type ToastKind = "ok" | "bad" | "warn";
type ToastItem = { id: number; title: string; text?: string; kind: ToastKind };
const ToastCtx = createContext<((t: Omit<ToastItem, "id">) => void) | null>(null);

/** Región aria-live con avisos que se cierran solos a los 5 s. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { ...t, id }]);
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 5000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="av-toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={cn("av-toast", t.kind !== "ok" && `av-toast--${t.kind}`)}>
            <div><b>{t.title}</b>{t.text && <span>{t.text}</span>}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const push = useContext(ToastCtx);
  if (!push) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return push;
}
