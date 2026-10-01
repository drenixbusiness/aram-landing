export type LegalSection = { id: string; title: string; body: React.ReactNode };

type Props = {
  title: string;
  effective: string;
  intro: React.ReactNode;
  sections: LegalSection[];
};

export default function LegalPage({ title, effective, intro, sections }: Props) {
  return (
    <main id="top" className="legal">
      <div className="container legal-layout">
        <header className="legal-head" data-reveal>
          <p className="kicker kicker--line">Legal</p>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-date">Effective {effective}</p>
          <div className="legal-intro">{intro}</div>
        </header>

        <nav className="legal-toc" aria-label="Contents">
          <p className="legal-toc-label">Contents</p>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  <span className="legal-toc-num">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal-body">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="legal-section">
              <h2>
                <span className="legal-num">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
