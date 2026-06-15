import { useState } from 'react';
import imgClinica from '../assets/site-clinica.webp';
import imgImobiliaria from '../assets/site-imobiliaria.webp';
import imgConcessionaria from '../assets/site-concessionaria.webp';
import imgAcademia from '../assets/site-academia.webp';

const nichos = [
  { name: "Clínica", nicho: "Saúde & Clínicas", color: "#1FC384", badge: "↗ 6,2% conversão", img: imgClinica },
  { name: "Imobiliária", nicho: "Imobiliário", color: "#3B82F6", badge: "↗ 5,8% conversão", img: imgImobiliaria },
  { name: "Concessionária", nicho: "Automóveis", color: "#F59E0B", badge: "↗ 7,1% conversão", img: imgConcessionaria },
  { name: "Academia", nicho: "Fitness & Academia", color: "#EF4444", badge: "↗ 9,3% conversão", img: imgAcademia },
];

const SiteCarousel = () => {
  const [active, setActive] = useState(0);
  const prev = () => setActive(a => (a - 1 + nichos.length) % nichos.length);
  const next = () => setActive(a => (a + 1) % nichos.length);

  const n = nichos[active];

  return (
    <section style={{ padding: "80px 0", background: "var(--bg-canvas)", overflow: "hidden" }}>
      <style>{`
        .sc-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px; }
        .sc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .sc-header-label {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--night-900);
          letter-spacing: -0.01em;
        }
        .sc-header-label span {
          color: var(--brand-500);
        }
        .sc-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .sc-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .sc-frame {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(14,23,48,0.14), 0 4px 16px rgba(14,23,48,0.07);
          background: #fff;
          cursor: pointer;
          user-select: none;
        }
        .sc-frame img {
          display: block;
          width: 100%;
          height: auto;
        }
        .sc-badge {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 999px;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          backdrop-filter: blur(10px);
          transition: background 0.3s, color 0.3s;
        }
        @media (max-width: 600px) {
          .sc-header-label { font-size: 13px; }
          .sc-badge { font-size: 11px; padding: 6px 10px; bottom: 12px; right: 12px; }
        }
      `}</style>

      {/* Título da seção acima */}
      <div style={{ textAlign: "center", marginBottom: 40, padding: "0 24px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Exemplos de sites
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--night-900)", margin: "0 0 16px" }}>
          Sites que geram leads de verdade
        </h2>
        <p style={{ fontSize: 17, color: "var(--fg-2)", maxWidth: 540, margin: "0 auto" }}>
          Cada nicho tem uma estratégia e um site personalizado para converter visitantes em clientes.
        </p>
      </div>

      <div className="sc-wrap">
        {/* Header do card: label + dots */}
        <div className="sc-header">
          <div className="sc-header-label">
            Site de alta conversão — <span>{n.nicho}</span>
          </div>
          <div className="sc-dots">
            {nichos.map((dot, i) => (
              <button
                key={i}
                className="sc-dot"
                onClick={() => setActive(i)}
                aria-label={dot.name}
                style={{
                  background: i === active ? n.color : "var(--sand-300)",
                  transform: i === active ? "scale(1.35)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Frame da imagem */}
        <div
          className="sc-frame"
          onMouseDown={(e) => { e._startX = e.clientX; }}
          onClick={(e) => {
            const dx = Math.abs(e.clientX - (e._startX || e.clientX));
            if (dx < 6) next();
          }}
        >
          <img src={n.img} alt={`Site ${n.nicho}`} draggable={false} />
          <div
            className="sc-badge"
            style={{
              background: `${n.color}22`,
              color: n.color,
              border: `1px solid ${n.color}44`,
            }}
          >
            {n.badge}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteCarousel;
