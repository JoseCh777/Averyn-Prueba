import { Search1Outlined, CheckCircle1Outlined, XmarkCircleOutlined, Camera1Outlined, Locked1Outlined } from "@lineiconshq/free-icons";
import { BackgroundBeams } from "@/components/effects/background-beams";
import { Icon } from "@/components/ui/icon";
import { AlertCircle, Fingerprint, InfoCircle } from "@/components/ui/icons";

/* Página de prueba de la Fase 0: marco del login con haces de marca y los iconos de Lineicons + propios. */
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-av-sky to-av-paper px-4 py-10">
      <h1 className="sr-only">Horizonte 2.0 · prueba de Fase 0</h1>
      <div className="mx-auto grid max-w-[1020px] overflow-hidden rounded-frame bg-white shadow-frame md:grid-cols-[1.1fr_1fr]">
        <section className="relative isolate flex min-h-[260px] flex-col justify-end bg-gradient-to-b from-av-sky via-av-navy-horizon to-av-navy p-8 text-white md:min-h-[460px]">
          <BackgroundBeams />
          <p className="font-heading text-2xl font-semibold">Todo listo para continuar.</p>
        </section>
        <section className="flex flex-col gap-4 p-8">
          <h2 className="font-heading text-3xl text-av-navy">Bienvenido de nuevo.</h2>
          <label className="text-sm font-semibold text-av-navy" htmlFor="q">Buscar persona</label>
          <div className="flex items-center gap-2 rounded-control border border-av-field-border px-3 py-2 text-av-gray-600">
            <Icon icon={Search1Outlined} />
            <input id="q" className="w-full bg-transparent text-av-navy outline-none placeholder:text-av-placeholder" placeholder="Nombre o documento" />
          </div>
          <ul className="flex flex-wrap gap-3 text-av-navy">
            <li className="flex items-center gap-1 text-[#047857]"><Icon icon={CheckCircle1Outlined} label="Éxito" /> Aceptada</li>
            <li className="flex items-center gap-1 text-[#B91C1C]"><Icon icon={XmarkCircleOutlined} label="Error" /> Rechazada</li>
            <li className="flex items-center gap-1"><Icon icon={Camera1Outlined} label="Cámara" /> Cámara</li>
            <li className="flex items-center gap-1"><Icon icon={Locked1Outlined} label="Seguro" /> Seguro</li>
            <li className="flex items-center gap-1"><InfoCircle aria-label="Info" role="img" /> Info (propio)</li>
            <li className="flex items-center gap-1"><AlertCircle aria-label="Aviso" role="img" /> Aviso (propio)</li>
            <li className="flex items-center gap-1"><Fingerprint aria-label="Huella" role="img" /> Huella (propio)</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
