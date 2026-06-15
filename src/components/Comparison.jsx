import { useScrollReveal, useChildrenReveal } from '../hooks/useScrollReveal';
import { gaCtaClicked } from '../lib/ga';

const ITEMS = [
  {
    sdr: { text: <>Responde em <strong>minutos ou horas</strong></> },
    sol: { text: <>Responde em <strong>menos de 5 segundos</strong></> },
  },
  {
    sdr: { text: <>Trabalha <strong>8h por dia</strong>, 5 dias na semana</> },
    sol: { text: <><strong>24h por dia</strong>, 7 dias na semana</> },
  },
  {
    sdr: { text: <>Custa <strong>R$ 3.000 a R$ 5.000/mês</strong> com encargos</> },
    sol: { text: <>A partir de <strong>R$ 490/mês</strong>, sem encargos</> },
  },
  {
    sdr: { text: <><strong>Esquece follow-ups</strong> e perde leads quentes</> },
    sol: { text: <><strong>Follow-up automático</strong> em todos os leads</> },
  },
  {
    sdr: { text: <>Férias, atestados e <strong>rotatividade alta</strong></> },
    sol: { text: <><strong>Nunca tira férias</strong> nem dá atestado</> },
  },
  {
    sdr: { text: <>Qualificação <strong>inconsistente</strong> entre atendentes</> },
    sol: { text: <>Qualificação <strong>100% padronizada</strong> sempre</> },
  },
];

const ico = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' };

// Pessoa cansada: silhueta humana padrão Lucide + gota de suor
const IconHuman = () => (
  <svg {...ico}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Robô: padrão Lucide bot
const IconBot = () => (
  <svg {...ico}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth="2.5" />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth="2.5" />
  </svg>
);

const stepStyle = (i, step) => step !== undefined
  ? { visibility: i < step ? 'visible' : 'hidden', opacity: i < step ? 1 : 0, transition: 'opacity 0.35s ease', pointerEvents: i < step ? 'auto' : 'none' }
  : {};

const Comparison = ({ onCtaClick, step }) => {
  const headRef = useScrollReveal({ threshold: 0.15 });
  const ref = useChildrenReveal('[data-reveal]', 60, step !== undefined);

  return (
    <section id="comparacao" style={s.section}>
      <style>{`
        .cmp-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .cmp-h2 {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--night-900);
          margin: 0 0 16px;
        }
        .cmp-card {
          background: #fff;
          border: 1px solid var(--border-1);
          border-radius: 20px;
          padding: 32px 28px;
          text-align: left;
          box-shadow: var(--shadow-sm);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .cmp-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .cmp-card-brand {
          border: 1.5px solid var(--brand-400);
          box-shadow: 0 4px 24px rgba(155,50,241,0.12), 0 1px 3px rgba(70,50,10,0.06);
          position: relative;
        }
        .cmp-card-brand:hover {
          box-shadow: 0 20px 48px rgba(155,50,241,0.18), 0 6px 16px rgba(14,23,48,0.07);
        }
        .cmp-badge-rec {
          position: absolute;
          top: -13px; left: 50%; transform: translateX(-50%);
          background: var(--grad-brand);
          color: #fff;
          font-family: var(--font-display);
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 3px 14px; border-radius: var(--r-pill);
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(155,50,241,0.4);
        }
        .cmp-dot-bad {
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--coral-50); border: 1px solid var(--coral-300);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
          font-size: 9px; color: var(--coral-600); font-weight: 700;
        }
        .cmp-dot-good {
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--brand-50); border: 1px solid var(--brand-300);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
          font-size: 9px; color: var(--brand-700); font-weight: 700;
        }
        @media (max-width: 640px) {
          .cmp-cards { grid-template-columns: 1fr !important; }
          .cmp-h2 { font-size: 24px !important; }
          .cmp-card { padding: 24px 20px !important; }
        }
      `}</style>

      <div style={s.inner}>
        <div ref={headRef} style={s.head}>
          <div style={s.label}>Comparação</div>
          <h2 className="cmp-h2">O vendedor IA que não dorme, não esquece e <span style={{ color: 'var(--brand-600)' }}>custa 7x menos</span></h2>
          <p style={s.subtitle}>Compare e veja por que <strong>+180 empresas</strong> trocaram o SDR humano por IA no WhatsApp.</p>
        </div>

        <div ref={ref} className="cmp-cards">

          {/* SDR Humano */}
          <div className="cmp-card" data-reveal style={stepStyle(0, step)}>
            <div style={s.iconWrap}>
              <IconHuman />
            </div>
            <div style={s.cardName}>SDR Humano</div>
            <div style={s.items}>
              {ITEMS.map((item, i) => (
                <div key={i} style={s.item}>
                  <div className="cmp-dot-bad">✕</div>
                  <div style={s.itemText}>{item.sdr.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendedor IA */}
          <div className="cmp-card cmp-card-brand" data-reveal style={stepStyle(1, step)}>
            <div className="cmp-badge-rec">Recomendado</div>
            <div style={{ ...s.iconWrap, background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
              <IconBot />
            </div>
            <div style={{ ...s.cardName, color: 'var(--brand-700)' }}>Vendedor IA</div>
            <div style={s.items}>
              {ITEMS.map((item, i) => (
                <div key={i} style={s.item}>
                  <div className="cmp-dot-good">✓</div>
                  <div style={s.itemText}>{item.sol.text}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <p style={s.footnote}>* Estimativa baseada em CLT com salário de R$ 2.500 + encargos (~40%) + benefícios</p>

      </div>
    </section>
  );
};

const s = {
  section:  { padding: '80px 24px', background: 'var(--bg-canvas)', scrollMarginTop: 72 },
  inner:    { maxWidth: 860, margin: '0 auto' },
  head:     { textAlign: 'center', maxWidth: 720, margin: '0 auto 52px' },
  label:    { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 },
  subtitle: { fontSize: 17, color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 0, marginTop: 12 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, background: 'var(--night-50)', color: 'var(--night-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  cardName: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--night-900)', marginBottom: 24, letterSpacing: '-0.01em' },
  items:    { display: 'flex', flexDirection: 'column', gap: 12 },
  item:     { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, lineHeight: 1.45 },
  itemText: { color: 'var(--fg-2)' },
  footnote: { marginTop: 24, fontSize: 12, color: 'var(--fg-3)', textAlign: 'center' },
};

Comparison.steps = 2;

export default Comparison;
