import { Demos } from "./demos";

export const metadata = { title: "Componentes · Horizonte 2.0" };

export default function Page() {
  return (
    <main id="main">
      <div className="ds-wrap" style={{ paddingBlock: "2rem 0" }}>
        <span className="ds-eyebrow mono">Horizonte 2.0 · React</span>
        <h1>Componentes</h1>
      </div>
      <Demos />
    </main>
  );
}
