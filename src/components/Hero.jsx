import heroTeam from '../assets/hero-team.webp';
import { gaCtaClicked } from '../lib/ga';

const Hero = ({ onCtaClick }) => {
  return (
    <section className="hero-section" style={heroStyles.section}>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: stretch;
          min-height: 610px;
          position: relative;
          z-index: 2;
        }
        .hero-h1 {
          font-family: var(--font-display);
          font-size: clamp(40px, 5.5vw, 76px);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.02;
          color: var(--night-900);
          margin: 0 0 24px;
        }
        .hero-enter-1 { animation: heroFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .hero-enter-2 { animation: heroFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .hero-enter-3 { animation: heroFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .hero-enter-4 { animation: heroFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .hero-enter-5 { animation: heroFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s both; }

        /* Coluna da foto — camada 1 (mais ao fundo) */
        .hero-photo-col {
          position: absolute;
          top: 0;
          right: 0;
          left: 25%;
          bottom: 0;
          overflow: visible;
          pointer-events: none;
          z-index: 0;
        }
        .hero-photo-col img {
          position: absolute;
          top: 0; left: 60px; right: 0;
          width: calc(100% + 60px);
          height: 100%;
          object-fit: cover;
          object-position: left top;
          display: block;
        }
        /* Fade sem efeito — o degradê ficou separado */
        .hero-photo-col-fade-left {
          display: none;
        }
        /* Degradê — camada 2, sempre abaixo do texto (z-index 1) */
        .hero-fade-ext {
          position: absolute;
          top: 0; bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            to right,
            var(--bg-canvas) 28%,
            rgba(248,244,251,0.85) 38%,
            rgba(248,244,251,0.5) 50%,
            rgba(248,244,251,0.1) 62%,
            rgba(248,244,251,0.0) 70%
          );
          z-index: 1;
          pointer-events: none;
        }
        /* Degradê de cima — suaviza a borda superior da foto */
        .hero-fade-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 80px;
          background: linear-gradient(
            to bottom,
            var(--bg-canvas) 0%,
            rgba(248,244,251,0.0) 100%
          );
          z-index: 1;
          pointer-events: none;
        }
        .hero-photo-col-fade-bottom { display: none; }

        @media (max-width: 768px) {
          .hero-inner {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .hero-photo-col { display: none; }
          .hero-section { padding: 56px 24px 32px !important; }
        }
        @media (max-width: 480px) {
          .hero-h1 { font-size: 42px; }
          .btn-hero-primary {
            box-shadow: 0 4px 16px rgba(155,50,241,0.18), inset 0 1px 0 rgba(255,255,255,0.3) !important;
          }
          .hero-proof-row { gap: 16px !important; }
          .hero-stat-num { font-size: 24px !important; white-space: nowrap; }
          .hero-stat-lab { font-size: 11px !important; max-width: 80px !important; }
          .hero-p { font-size: 16px !important; }
          .hero-eyebrow { font-size: 11px !important; }
        }
      `}</style>

      {/* Glow decorativo fundo */}
      <div className="hero-glow" style={heroStyles.glow}></div>

      {/* Degradê superior — suaviza borda do topo */}
      <div className="hero-fade-top"></div>
      {/* Fade estendido atrás do texto (z-index 0, abaixo do hero-inner z-index 1) */}
      <div className="hero-fade-ext"></div>

      {/* Foto de fundo — cola no topo e na direita, fora do grid */}
      <div className="hero-photo-col">
        <img src={heroTeam} alt="Equipe Alvo Brando" draggable={false} />
        <div className="hero-photo-col-fade-left"></div>
        <div className="hero-photo-col-fade-bottom"></div>
      </div>


      <div className="hero-inner" style={{ padding: "80px 0 60px 24px" }}>
        {/* Coluna esquerda — copy */}
        <div style={heroStyles.copy}>
          <div style={heroStyles.eyebrow} className="hero-enter hero-enter-1 hero-eyebrow">★ PARA EMPRESAS VENDEREM MAIS</div>
          <h1 className="hero-h1 hero-enter hero-enter-2">
            Atraímos. Qualificamos. <em style={heroStyles.em}>Vendemos.</em>
          </h1>
          <p style={heroStyles.p} className="hero-enter hero-enter-3 hero-p">
            Você não precisa de mais anúncios. <strong>Precisa de um sistema integrado</strong> que não perde o cliente depois que ele clicou.
          </p>
          <div style={heroStyles.ctas} className="hero-enter hero-enter-4">
            <button
              onClick={() => { gaCtaClicked({ origem: 'hero' }); onCtaClick(); }}
              style={heroStyles.primary}
              className="btn-shimmer btn-hero-primary"
            >
              Quero vender mais →
            </button>
          </div>
          <div className="hero-proof-row hero-enter hero-enter-5" style={heroStyles.proofRow}>
            <div style={heroStyles.statItem}>
              <div className="hero-stat-num" style={heroStyles.statNum}>+5 anos</div>
              <div className="hero-stat-lab" style={heroStyles.statLab}>em marketing e vendas</div>
            </div>
            <div style={heroStyles.statDiv}></div>
            <div style={heroStyles.statItem}>
              <div className="hero-stat-num" style={heroStyles.statNum}>+180</div>
              <div className="hero-stat-lab" style={heroStyles.statLab}>empresas parceiras</div>
            </div>
            <div style={heroStyles.statDiv}></div>
            <div style={heroStyles.statItem}>
              <div className="hero-stat-num" style={heroStyles.statNum}>+120mi</div>
              <div className="hero-stat-lab" style={heroStyles.statLab}>gerado em vendas</div>
            </div>
          </div>
        </div>

        {/* Coluna direita — vazia, espaço ocupado pela foto absoluta */}
        <div></div>
      </div>
    </section>
  );
};

const heroStyles = {
  section: {
    position: "relative",
    overflow: "hidden",
    padding: 0,
    background: "var(--bg-canvas)",
    minHeight: 0,
  },
  glow: {
    position: "absolute", right: "-200px", top: "-100px", width: 700, height: 700,
    background: "radial-gradient(circle, rgba(155,50,241,0.20), transparent 65%)",
    pointerEvents: "none", zIndex: 0
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: 48,
    paddingBottom: 0,
  },
  eyebrow: {
    fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600,
    color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 20
  },
  em: { fontStyle: "normal", color: "var(--brand-500)" },
  p: { fontSize: 19, lineHeight: 1.55, color: "var(--fg-2)", marginBottom: 32 },
  ctas: { display: "flex", gap: 16, alignItems: "center", marginBottom: 36 },
  primary: {
    background: "linear-gradient(180deg, #BD8AF7 0%, #9B32F1 55%, #8C1EDB 100%)",
    color: "#FFFFFF", fontWeight: 600,
    fontSize: 15, padding: "13px 20px", borderRadius: 12, border: "none",
    fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
    boxShadow: "0 0 0 4px rgba(155,50,241,0.18), 0 8px 32px rgba(155,50,241,0.32), inset 0 1px 0 rgba(255,255,255,0.4)",
    display: "inline-block", cursor: "pointer",
  },
  proofRow: { display: "flex", alignItems: "center", gap: 28 },
  statItem: {},
  statNum: { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--night-900)", lineHeight: 1 },
  statLab: { fontSize: 12, color: "var(--fg-2)", marginTop: 4, lineHeight: 1.3, maxWidth: 140 },
  statDiv: { width: 1, height: 36, background: "var(--sand-300)" },
};

export default Hero;
