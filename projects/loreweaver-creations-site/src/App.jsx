import "./App.css";

function App() {
  return (
    <main className="coming-soon-shell">
      <div
        className="background-mark background-mark--left"
        aria-hidden="true"
      />

      <div
        className="background-mark background-mark--right"
        aria-hidden="true"
      />

      <section className="coming-soon-card" aria-labelledby="page-title">
        <img
          className="coming-soon-logo"
          src="/loreweaver-creations-logo.png"
          alt="Loreweaver Creations"
        />
        <p className="eyebrow" id="page-title">
          Coming Soon
        </p>

        <p className="tagline">Stories take many forms.</p>

        <div className="ornament" aria-hidden="true">
          <span />
          <span className="ornament__diamond" />
          <span />
        </div>

        <p className="message">
          A new home for publishing, digital projects, and creative work is
          being woven.
        </p>

        <p className="status">
          The full Loreweaver Creations website is currently in development.
        </p>
      </section>

      <footer className="site-footer">
        © {new Date().getFullYear()} Loreweaver Creations
      </footer>
    </main>
  );
}

export default App;
