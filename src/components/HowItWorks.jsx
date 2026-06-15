import { useScrollReveal, useChildrenReveal } from '../hooks/useScrollReveal';
import { gaCtaClicked } from '../lib/ga';

const stepStyle = (i, step) => step !== undefined
  ? { visibility: i < step ? 'visible' : 'hidden', opacity: i < step ? 1 : 0, transition: 'opacity 0.35s ease', pointerEvents: i < step ? 'auto' : 'none' }
  : {};

const HowItWorks = ({ onCtaClick, step }) => {
  const headRef = useScrollReveal({ threshold: 0.15 });
  const ref = useChildrenReveal('[data-reveal]', 100, step !== undefined);
  const steps = [
    {
      n: "01",
      title: "Onboarding",
      body: "Desenhamos o processo ideal de marketing e vendas para o seu negócio, montamos a estratégia e você aprova.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9B32F1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="6" height="4" rx="1"/><rect x="15" y="3" width="6" height="4" rx="1"/><rect x="9" y="17" width="6" height="4" rx="1"/><line x1="6" y1="7" x2="6" y2="12"/><line x1="18" y1="7" x2="18" y2="12"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="12" x2="12" y2="17"/>
        </svg>
      )
    },
    {
      n: "02",
      title: "Implementação",
      body: "Configuramos todas as ferramentas, produzimos todo material criativo, ativamos sua IA e seus anúncios.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9B32F1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      )
    },
    {
      n: "03",
      title: "Gestão",
      body: "Analisamos as métricas e otimizamos diariamente, e apresentamos relatórios para você semanalmente.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9B32F1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
        </svg>
      )
    }
  ];

  return (
    <section id="how" style={hwStyles.section}>
      <style>{`
        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .how-h2 {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #FBF7EE;
          margin: 0 0 56px;
          max-width: 720px;
        }
        .how-step {
          transition:
            background 0.35s cubic-bezier(0.16,1,0.3,1),
            border-color 0.35s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.35s cubic-bezier(0.16,1,0.3,1),
            transform 0.35s cubic-bezier(0.16,1,0.3,1);
          cursor: default;
        }
        .how-step:hover {
          border-color: rgba(155,50,241,0.40) !important;
          box-shadow: 0 0 0 1px rgba(155,50,241,0.20), 0 16px 40px rgba(0,0,0,0.20) !important;
          transform: translateY(-4px);
        }
        .how-step:hover .how-step-icon {
          background: rgba(155,50,241,0.22) !important;
          transform: scale(1.1);
        }
        .how-step-icon {
          transition: background 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        @media (max-width: 768px) {
          .how-grid { grid-template-columns: 1fr; gap: 16px; }
          .how-h2 { font-size: 24px; margin-bottom: 36px; }
        }
      `}</style>
      <div style={hwStyles.inner}>
        <div ref={headRef}>
          <div style={hwStyles.label}>Como funciona</div>
          <h2 className="how-h2">Nossa equipe configura e<br/>gerencia tudo para você.</h2>
        </div>
        <div ref={ref} className="how-grid">
          {steps.map((s, i) => (
            <div key={s.n} data-reveal style={{ ...hwStyles.step, ...stepStyle(i, step) }} className="how-step">
              <div style={hwStyles.stepIcon} className="how-step-icon">{s.icon}</div>
              <div style={hwStyles.stepNum}>{s.n}</div>
              <div style={hwStyles.stepTitle}>{s.title}</div>
              <div style={hwStyles.stepBody}>{s.body}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const hwStyles = {
  section: { padding: "80px 24px", background: "var(--night-900)" },
  inner: { maxWidth: 1200, margin: "0 auto" },
  label: { fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--brand-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 },
  h2: { fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#FBF7EE", margin: "0 0 56px", maxWidth: 720 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  step: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28 },
  stepIcon: { width: 56, height: 56, background: "rgba(155,50,241,0.12)", color: "var(--brand-400)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  stepNum: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand-400)", letterSpacing: "0.08em", marginBottom: 8 },
  stepTitle: { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", color: "#FBF7EE", marginBottom: 10, lineHeight: 1.2 },
  stepBody: { fontSize: 15, lineHeight: 1.55, color: "#B5BCCE" }
};

HowItWorks.steps = 3;

export default HowItWorks;
