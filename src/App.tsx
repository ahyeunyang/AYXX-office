import "./App.css";

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">AYXX Office</p>
        <h1>프로젝트의 첫 화면을 바로 시작합니다.</h1>
        <p className="description">
          React와 TypeScript 기반으로 빠르게 개발할 수 있는 기본 구조가 준비되어
          있습니다. 이제 기능을 하나씩 확장해 나가면 됩니다.
        </p>
        <div className="pill-group">
          <span className="pill">React</span>
          <span className="pill">TypeScript</span>
          <span className="pill">Vite</span>
        </div>
      </section>
    </main>
  );
}

export default App;
