import { Sidebar } from "@/components/docs/sidebar";
import { DocBehaviors } from "@/components/docs/doc-behaviors";
import { ToastProvider } from "@/components/ui/overlay";
import { VERSION } from "@/lib/docs-pages";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <div className="ds-shell">
        <Sidebar />
        <div className="ds-main" id="top">
          {children}
          <footer className="ds-sec" style={{ paddingBlock: "2.4rem", borderTop: "1px solid var(--av-hairline)" }}>
            <div className="ds-wrap">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="mono" style={{ color: "var(--av-gray-500)" }}>Averyn · Design System v{VERSION} Horizonte</span>
                <span className="mono" style={{ color: "var(--av-gray-500)" }}>Fuente: tokens.css · componentes React</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <DocBehaviors />
    </ToastProvider>
  );
}
