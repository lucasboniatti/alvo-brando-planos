import { useScrollReveal } from '../hooks/useScrollReveal';

const LOGO_BRANDS = ["Clínicas", "Imobiliárias", "Serviços B2B e B2C", "Tecnologia", "Restaurantes", "Distribuidoras", "Lojas"];

const LogoStrip = () => {
  const ref = useScrollReveal({ threshold: 0.2 });

  return (
    <section style={lsStyles.section} className="logo-strip-section">
      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .logo-strip-item { font-size: 11px !important; padding: 0 14px !important; }
          .logo-strip-mark { font-size: 10px !important; }
          .logo-strip-card { border-radius: 0 !important; border-left: none !important; border-right: none !important; }
          .logo-strip-section { padding: 0 !important; }
        }
      `}</style>
      <div ref={ref}>
        <div style={lsStyles.card} className="logo-strip-card">
          <div style={lsStyles.overflow}>
            <div className="marquee-track">
              {[...LOGO_BRANDS, ...LOGO_BRANDS].map((n, i) => (
                <div key={i} style={lsStyles.logo} className="logo-strip-item">
                  <span style={lsStyles.logoMark} className="logo-strip-mark">●</span>{n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const lsStyles = {
  section: {
    position: "relative",
    zIndex: 10,
    maxWidth: 1200,
    margin: "-27px auto -27px",
    padding: "0 24px",
  },
  label: {
    fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
    letterSpacing: "0.1em", textAlign: "center", marginBottom: 6,
    padding: "0 24px",
  },
  card: {
    background: "#F9F4FC",
    border: "1px solid var(--brand-100)",
    borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
    padding: "16px 0",
    overflow: "hidden",
  },
  overflow: {
    overflow: "hidden",
    maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
  },
  logo: {
    fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600,
    color: "var(--night-700)", letterSpacing: "-0.02em",
    display: "flex", alignItems: "center", gap: 6,
    opacity: 0.55,
    padding: "0 28px", whiteSpace: "nowrap",
  },
  logoMark: { color: "var(--brand-500)", fontSize: 10 }
};

export default LogoStrip;
