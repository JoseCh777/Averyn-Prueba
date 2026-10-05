"use client";
/* Piezas interactivas de la página «Plantillas y estados»: avisos descartables, modal de sesión caducada y subida de archivo. */
import { useState, type HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Modal, useToast } from "@/components/ui/overlay";

/** Aviso del sistema que se puede cerrar con su botón «×» (av-banner__x). */
export function DismissibleBanner({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return <div {...props} onClick={(e) => { if ((e.target as HTMLElement).closest(".av-banner__x")) setGone(true); }}>{children}</div>;
}

export function SessionModalDemo() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>Ver modal de sesión caducada</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Tu sesión terminó" actions={<Button onClick={() => { setOpen(false); toast({ title: "Ingresar", text: "Aquí se redirigiría al login.", kind: "ok" }); }}>Ingresar →</Button>}>
        <p>Por seguridad cerramos la sesión tras un rato de inactividad. Ingresa de nuevo para continuar donde ibas.</p>
      </Modal>
    </>
  );
}

export function DropzoneDemo() {
  const toast = useToast();
  const [over, setOver] = useState(false);
  const pick = () => toast({ title: "Elegir archivo", text: "Aquí se abriría el selector del sistema.", kind: "ok" });
  return (
    <div className={`av-drop${over ? " is-over" : ""}`} tabIndex={0} role="button" aria-label="Subir documento" onClick={pick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } }}
      onDragEnter={(e) => { e.preventDefault(); setOver(true); }} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
      onDrop={(e) => { e.preventDefault(); setOver(false); toast({ title: "Documento recibido", text: "Procesando con OCR…", kind: "ok" }); }}>
      <span className="ic"><Icon name="cloud-arrow-up" /></span><b>Arrastra tu documento aquí</b><p>o haz clic para elegirlo · JPG, PNG o PDF · máx. 10 MB</p>
    </div>
  );
}
