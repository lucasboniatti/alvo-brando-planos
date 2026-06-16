import { useChildrenReveal } from '../hooks/useScrollReveal';

const stepStyle = (i, step) => step !== undefined
  ? { visibility: i < step ? 'visible' : 'hidden', opacity: i < step ? 1 : 0, transition: 'opacity 0.35s ease', pointerEvents: i < step ? 'auto' : 'none' }
  : {};

const Guarantee = ({ step }) => {
  const ref = useChildrenReveal('[data-reveal]', 80, step !== undefined);
  return (
  <section id="garantia" style={s.section}>
    <style>{`
      .guarantee-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .guarantee-h2 {
        font-family: var(--font-display);
        font-size: 44px;
        font-weight: 600;
        letter-spacing: -0.025em;
        line-height: 1.1;
        color: #FBF7EE;
        margin: 0 0 16px;
      }
      @media (max-width: 768px) {
        .guarantee-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
        .guarantee-h2 { font-size: 24px !important; line-height: 1.2 !important; letter-spacing: -0.02em !important; }
        .guarantee-line1 { display: block; }
        @media (max-width: 768px) { .guarantee-line1 { display: inline; } }
      }
    `}</style>
    <div ref={ref} style={s.inner}>
      <div data-reveal style={s.badge}>✦ Garantia Alvo Brando</div>
      <h2 data-reveal className="guarantee-h2"><span className="guarantee-line1">Implementamos em 2 semanas</span> ou devolvemos 100% do investimento.</h2>
      <p data-reveal style={s.p}>Sem contrato de fidelidade. Cancele quando quiser.</p>
      <div className="guarantee-cards" style={s.cards}>
        <div data-reveal style={{ ...s.card, ...stepStyle(0, step) }} className="hover-card-dark">
          <div style={s.icon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div style={s.cardTitle}>Implementação em 2 semanas</div>
          <div style={s.cardBody}>Nossa equipe configura tudo. Se não estiver rodando o sistema completo em 2 semanas, devolvemos 100% do valor investido.</div>
        </div>
        <div data-reveal style={{ ...s.card, ...stepStyle(1, step) }} className="hover-card-dark">
          <div style={s.icon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
            </svg>
          </div>
          <div style={s.cardTitle}>Sem contrato de fidelidade</div>
          <div style={s.cardBody}>Plano mensal, cancela quando quiser. Sem multa, sem burocracia. Você fica porque tem resultado, não porque assinou contrato.</div>
        </div>
      </div>
    </div>
  </section>
  );
};

const s = {
  section: { padding: "80px 24px", background: "var(--night-900)", position: "relative", overflow: "hidden" },
  inner: { maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 },
  badge: {
    display: "inline-block", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600,
    color: "var(--brand-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20
  },
  h2: {
    fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 600,
    letterSpacing: "-0.025em", lineHeight: 1.1, color: "#FBF7EE", margin: "0 0 16px"
  },
  p: { fontSize: 17, color: "#B5BCCE", marginBottom: 48 },
  cards: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  card: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20, padding: 32, textAlign: "left"
  },
  icon: {
    width: 52, height: 52, borderRadius: 14,
    background: "rgba(155,50,241,0.12)", color: "var(--brand-400)",
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
  },
  cardTitle: {
    fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600,
    color: "#FBF7EE", marginBottom: 10, letterSpacing: "-0.015em"
  },
  cardBody: { fontSize: 12, lineHeight: 1.6, color: "#B5BCCE" },
};

Guarantee.steps = 2;

export default Guarantee;
