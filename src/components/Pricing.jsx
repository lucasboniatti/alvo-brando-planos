import { useScrollReveal, useChildrenReveal } from '../hooks/useScrollReveal';
import { gaCtaClicked } from '../lib/ga';

const stepStyle = (i, step) => step !== undefined
  ? { visibility: i < step ? 'visible' : 'hidden', opacity: i < step ? 1 : 0, transition: 'opacity 0.35s ease', pointerEvents: i < step ? 'auto' : 'none' }
  : {};

const Pricing = ({ onCtaClick, step }) => {
  const headRef = useScrollReveal({ threshold: 0.15 });
  const ref = useChildrenReveal('[data-reveal]', 80, step !== undefined);
  const tiers = [
    {
      name: "Starter", price: "R$ 1.500", per: "/mês",
      desc: "Para empresas implementarem um funil de vendas com alta conversão.",
      features: ["Tráfego pago: Meta Ads", "Criativos para anúncios", "IA de vendas no WhatsApp", "Pesquisa de mercado", "Estratégia personalizada", "Suporte diário + consultoria mensal"],
      cta: "Falar com consultor", highlight: false
    },
    {
      name: "Growth", price: "R$ 2.500", per: "/mês",
      desc: "Para empresas dominarem o mercado com presença digital estratégica.",
      features: ["Tudo do Starter +", "Tráfego pago: Google Ads", "Landing page para anúncios", "CRM com automações", "Dashboard personalizado", "3 WhatsApp conectados"],
      cta: "Falar com consultor", highlight: true
    },
    {
      name: "Scale", price: "R$ 5.000", per: "/mês",
      desc: "Para empresas escalarem com assessoria completa em marketing e vendas.",
      features: ["Tudo do Starter + Growth +", "Gestão de tráfego orgânico", "12 posts no feed por mês", "Site completo com SEO", "Playbook de vendas", "5 WhatsApp conectados"],
      cta: "Falar com consultor", highlight: false
    }
  ];

  return (
    <section id="pricing" style={priceStyles.section}>
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .pricing-tier {
          align-self: start;
        }
        .pricing-h2 {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--night-900);
          margin: 0 0 16px;
        }
        .pricing-divider {
          width: 100%;
          height: 1px;
          background: rgba(0,0,0,0.08);
          margin: 20px 0;
        }
        .pricing-divider.dark {
          background: rgba(255,255,255,0.1);
        }
        .pricing-invest-label {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brand-500);
          margin-bottom: 6px;
        }
        .pricing-invest-label.dark {
          color: var(--brand-400);
        }
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr; max-width: 100%; margin: 0 auto; }
          .pricing-h2 { font-size: 26px; }
        }
        @media (max-width: 480px) {
          .pricing-tier { padding: 24px 20px !important; }
          .pricing-price-big { font-size: 36px !important; }
          .pricing-cta { font-size: 14px !important; padding: 11px 16px !important; }
        }
      `}</style>
      <div style={priceStyles.inner}>
        <div ref={headRef} style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}>
          <div style={priceStyles.label}>Escopos de parceria</div>
        </div>
        <div ref={ref} className="pricing-grid">
          {tiers.map((t, ti) => (
            <div key={t.name} data-reveal style={{ ...priceStyles.tier, ...(t.highlight ? priceStyles.highlight : {}), ...stepStyle(ti, step) }} className={`pricing-tier ${t.highlight ? 'pricing-highlight-card' : 'hover-card'}`}>
              {t.highlight && <div style={priceStyles.badge}>★ Mais escolhido</div>}

              {/* Nome + descrição */}
              <div style={{ ...priceStyles.tierName, color: t.highlight ? "#fff" : "var(--night-900)" }}>{t.name}</div>
              <div style={{ ...priceStyles.desc, color: t.highlight ? "rgba(255,255,255,0.75)" : "var(--fg-2)" }}>{t.desc}</div>

              {/* Separador 1 */}
              <div className={`pricing-divider${t.highlight ? ' dark' : ''}`} />

              {/* Features */}
              <ul style={priceStyles.features}>
                {t.features.map((f, i) => (
                  <li key={i} style={{ ...priceStyles.feature, color: t.highlight ? "rgba(255,255,255,0.95)" : "var(--fg-1)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.highlight ? "var(--brand-400)" : "var(--brand-500)"} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Separador 2 + preço — entra sem mover o topo do card */}
              <div style={step !== undefined ? { display: (ti + 4) < step ? 'block' : 'none' } : {}}>
                <div className={`pricing-divider${t.highlight ? ' dark' : ''}`} />
                <div className={`pricing-invest-label${t.highlight ? ' dark' : ''}`}>Investimento</div>
                <div style={priceStyles.priceRow}>
                  <span className="pricing-price-big" style={{ ...priceStyles.priceBig, color: t.highlight ? "var(--brand-400)" : "var(--night-900)" }}>{t.price}</span>
                  <span style={{ ...priceStyles.per, color: t.highlight ? "rgba(255,255,255,0.6)" : "var(--fg-3)" }}>{t.per}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Pergunta intermediária — aparece no step 4, some quando os preços começam */}
        {step !== undefined && (
          <div style={{
            textAlign: 'center',
            marginTop: 40,
            opacity: step === 4 ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--night-900)', margin: 0 }}>
              Qual escopo faz mais sentido para você?
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

const priceStyles = {
  section: { padding: "80px 24px", background: "var(--bg-canvas)" },
  inner: { maxWidth: 1200, margin: "0 auto" },
  label: { display: "inline-block", fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 500, color: "var(--brand-500)", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid rgba(155,50,241,0.35)", borderRadius: 999, padding: "5px 14px", marginBottom: 8, background: "transparent" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" },
  tier: { background: "white", border: "1px solid var(--border-1)", borderRadius: 20, paddingTop: 32, paddingLeft: 32, paddingRight: 32, paddingBottom: 32, display: "flex", flexDirection: "column", position: "relative", boxShadow: "var(--shadow-sm)" },
  highlight: { background: "linear-gradient(180deg, #18213D 0%, #0D0218 60%, #0A1228 100%)", color: "white", border: "none", boxShadow: "0 24px 60px rgba(14,23,48,0.25)" },
  badge: { position: "absolute", top: -14, left: 32, background: "var(--brand-400)", color: "#FFFFFF", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 11, padding: "5px 11px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.06em" },
  tierName: { fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 4 },
  priceBig: { fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 },
  per: { fontSize: 14 },
  desc: { fontSize: 14, lineHeight: 1.5 },
  features: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 },
  feature: { display: "flex", gap: 10, fontSize: 14, lineHeight: 1.45, alignItems: "flex-start" },
  cta: { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, padding: "13px 20px", borderRadius: 12, cursor: "pointer", width: "100%" }
};

Pricing.steps = 8;

export default Pricing;
