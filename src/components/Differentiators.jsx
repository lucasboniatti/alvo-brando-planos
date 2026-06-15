import { useScrollReveal, useChildrenReveal } from '../hooks/useScrollReveal';

const stepStyle = (i, step) => step !== undefined
  ? { visibility: i < step ? 'visible' : 'hidden', opacity: i < step ? 1 : 0, transition: 'opacity 0.35s ease', pointerEvents: i < step ? 'auto' : 'none' }
  : {};

const Differentiators = ({ step }) => {
  const headRef = useScrollReveal({ threshold: 0.15 });
  const ref = useChildrenReveal('[data-reveal]', 60, step !== undefined);
  const items = [
    { icon: "star",     category: "Especialistas", headline: "Estratégia personalizada",        body: "Especialistas da AB analisam seu negócio, pesquisam seu mercado e criam sua estratégia sob medida." },
    { icon: "brush",    category: "Criativos",     headline: "Edição de imagens e vídeos",      body: "Escrevemos, gravamos e editamos os criativos em imagem e vídeo focados em atrair e qualificar leads." },
    { icon: "rocket",   category: "Tráfego Pago",  headline: "Meta Ads e Google Ads",           body: "Criamos e gerenciamos diariamente suas campanhas de tráfego pago para venda e captação de leads." },
    { icon: "heart",    category: "Social Media",  headline: "Gestão de redes sociais",  body: "Gerenciamos seu perfil nas redes sociais para torná-lo uma vitrine que capta e converte clientes." },
    { icon: "monitor",  category: "Landing Page",  headline: "Sites de alta conversão",         body: "Produzimos páginas de altíssima conversão, rápidas e com design premium (como essa aqui)." },
    { icon: "dollar",   category: "Vendas",        headline: "IA de vendas no WhatsApp",        body: "Construímos seu vendedor IA que atua 24/7 atendendo e vendendo direto no seu WhatsApp." },
  ];

  return (
    <section id="diferenciais" style={dfStyles.section}>
      <style>{`
        .diff-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .diff-h2 {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--night-900);
          margin: 0;
        }
        .diff-card {
          transition:
            box-shadow 0.35s cubic-bezier(0.16,1,0.3,1),
            transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .diff-card:hover {
          box-shadow: 0 0 0 1.5px rgba(155,50,241,0.25), 0 8px 28px rgba(155,50,241,0.11), 0 4px 12px rgba(14,23,48,0.06) !important;
          transform: translateY(-3px);
        }
        @media (max-width: 768px) {
          .diff-grid { grid-template-columns: 1fr 1fr; }
          .diff-h2 { font-size: 24px; }
        }
        @media (max-width: 480px) {
          .diff-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div style={dfStyles.inner}>
        <div ref={headRef} style={dfStyles.head}>
          <div style={dfStyles.label}>Diferenciais</div>
          <h2 className="diff-h2">Não é um canal solto. É o funil inteiro trabalhando para você vender mais.</h2>
        </div>
        <div ref={ref} className="diff-grid">
          {items.map((it, i) => (
            <div key={i} data-reveal style={{ ...dfStyles.card, ...stepStyle(i, step) }} className="diff-card">
              <div style={dfStyles.iconWrap} className="diff-icon-wrap">{renderIcon(it.icon)}</div>
              <div style={dfStyles.cat} className="diff-cat">{it.category}</div>
              <div style={dfStyles.headline} className="diff-headline">{it.headline}</div>
              <div style={dfStyles.body} className="diff-body">{it.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const renderIcon = (name) => {
  const props = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    calendar: <g><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></g>,
    rocket: <g><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></g>,
    star: <g><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></g>,
    brain: <g><circle cx="12" cy="12" r="3"/><circle cx="3" cy="6" r="1.5"/><circle cx="21" cy="6" r="1.5"/><circle cx="3" cy="18" r="1.5"/><circle cx="21" cy="18" r="1.5"/><circle cx="12" cy="2" r="1.5"/><circle cx="12" cy="22" r="1.5"/><line x1="9.5" y1="10.5" x2="4.5" y2="7"/><line x1="14.5" y1="10.5" x2="19.5" y2="7"/><line x1="9.5" y1="13.5" x2="4.5" y2="17"/><line x1="14.5" y1="13.5" x2="19.5" y2="17"/><line x1="12" y1="9" x2="12" y2="3.5"/><line x1="12" y1="15" x2="12" y2="20.5"/></g>,
    bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    brush: <g><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></g>,
    heart: <g><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></g>,
    monitor: <g><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></g>,
    dollar: <g><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></g>,
    whatsapp: <g><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></g>,
    eye: <g><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></g>,
    clock: <g><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></g>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  };
  return <svg {...props}>{paths[name]}</svg>;
};

const dfStyles = {
  section: { padding: "80px 24px", background: "var(--sand-100)" },
  inner: { maxWidth: 1200, margin: "0 auto" },
  head: { textAlign: "center", maxWidth: 900, margin: "0 auto 56px" },
  label: { fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 },
  h2: { fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--night-900)", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  card: { background: "white", border: "1px solid var(--border-1)", borderRadius: 18, padding: 26, boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: 4 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, background: "var(--brand-50)", color: "var(--brand-700)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  cat: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 },
  headline: { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--night-900)", marginBottom: 10 },
  body: { fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)" },
};

Differentiators.steps = 6;

export default Differentiators;
