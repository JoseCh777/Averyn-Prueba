const stack = [
  'Next.js 16 (App Router)',
  'React 19',
  'TypeScript 5.9 (strict)',
  'CSS propio con Design System',
];

const branches = ['main', 'develop', 'feature/*', 'release/*', 'hotfix/*'];

export default function HomePage() {
  return (
    <main className="av-container">
      <h1 className="av-title">Averyn</h1>
      <p className="av-lead">
        Base del frontend institucional lista. Este skeleton no contiene logica de negocio.
      </p>

      <section className="av-section">
        <h2 className="av-section-title">Stack</h2>
        <ul className="av-list">
          {stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="av-section">
        <h2 className="av-section-title">Flujo Git</h2>
        <ul className="av-list">
          {branches.map((branch) => (
            <li key={branch}>
              <code>{branch}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="av-section">
        <h2 className="av-section-title">Integracion</h2>
        <p className="av-text">
          El frontend consumira la API de <code>averyn-core</code>. La comunicacion con los
          servicios de biometria ocurre en el Core, nunca desde el navegador.
        </p>
      </section>
    </main>
  );
}
