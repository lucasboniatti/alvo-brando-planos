import { useState, useRef } from 'react';

const useDebounce = (fn, delay) => {
  const t = useRef(null);
  return (...args) => { clearTimeout(t.current); t.current = setTimeout(() => fn(...args), delay); };
};

const fmtBRL = (n) => "R$ " + Math.round(n).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
const fmtN = (n) => Math.round(n).toLocaleString("pt-BR");

/* Escala para o investimento (R$ 300, 500, 1000..9500, 10000..95000, 100000) */
const investValues = [
  300,
  ...Array.from({ length: 19 }, (_, i) => 500 + i * 500),     // 500..9500
  ...Array.from({ length: 18 }, (_, i) => 10000 + i * 5000),  // 10000..95000
  100000,
];
const investToIdx = (v) => { let i = investValues.findIndex(x => x >= v); return i === -1 ? investValues.length - 1 : i; };

/* Escala para custo por lead (R$ 1 → R$ 500) */
const cplValues = [
  ...Array.from({ length: 9 }, (_, i) => 1 + i * 1),     // 1..9
  ...Array.from({ length: 18 }, (_, i) => 10 + i * 5),   // 10..95
  ...Array.from({ length: 41 }, (_, i) => 100 + i * 10), // 100..500
];
const cplToIdx = (v) => { let i = cplValues.findIndex(x => x >= v); return i === -1 ? cplValues.length - 1 : i; };

/* Escala para ticket médio (R$ 50 → R$ 10.000.000) */
const ticketValues = [
  50,
  ...Array.from({ length: 19 }, (_, i) => 100 + i * 100),      // 100..1.900
  ...Array.from({ length: 33 }, (_, i) => 2000 + i * 1000),    // 2.000..34.000
  ...Array.from({ length: 14 }, (_, i) => 35000 + i * 5000),   // 35.000..100.000
  ...Array.from({ length: 9 },  (_, i) => 200000 + i * 100000),// 200.000..900.000
  1000000, 1500000, 2000000,                                    // 1M, 1.5M, 2M
  ...Array.from({ length: 8 },  (_, i) => 3000000 + i * 1000000), // 3M..10M
];
const ticketToIdx = (v) => { let i = ticketValues.findIndex(x => x >= v); return i === -1 ? ticketValues.length - 1 : i; };

const ROICalcProposta = () => {
  const [investIdx, setInvestIdx] = useState(investToIdx(2000));
  const [cplIdx, setCplIdx] = useState(cplToIdx(5));
  const [conversao, setConversao] = useState(10);  // 0.5..100 %
  const [ticketIdx, setTicketIdx] = useState(ticketToIdx(1500));
  const [margem, setMargem] = useState(15);         // 1..100 %

  const investido = investValues[investIdx];
  const cpl = cplValues[cplIdx];
  const ticket = ticketValues[ticketIdx];

  const leads = cpl > 0 ? Math.floor(investido / cpl) : 0;
  const vendas = Math.floor(leads * (conversao / 100));
  const faturamento = vendas * ticket;
  const lucro = faturamento * (margem / 100);
  const roi = investido > 0 ? ((lucro - investido) / investido) * 100 : 0;
  const cac = vendas > 0 ? investido / vendas : 0;
  const roas = investido > 0 ? faturamento / investido : 0;

  return (
    <section style={S.section}>
      <style>{`
        .roi-prop-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 56px; align-items: start; max-width: 1160px; margin: 0 auto; }
        .roi-prop-results { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .margem-track { position: relative; width: 100%; height: 6px; border-radius: 999px; background: var(--border-1); margin-top: 10px; }
        .margem-fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #1FCE7C, #128A52); transition: width 0.1s; }
        @media (max-width: 860px) {
          .roi-prop-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 480px) {
          .roi-prop-results { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="roi-prop-grid">
        {/* Esquerda — controles */}
        <div>
          <div style={S.eyebrow}>Calculadora de ROI</div>
          <h2 style={S.h2}>Quanto você pode faturar<br />com a gente?</h2>
          <p style={S.p}>Coloque os seus números e veja em tempo real o retorno esperado com tráfego pago, gestão estratégica e inteligência artificial com dados aplicada ao seu negócio.</p>
          <div style={S.box}>
            <Slider
              label="Valor investido em tráfego"
              value={investIdx}
              min={0} max={investValues.length - 1} step={1}
              displayValue={investido}
              prefix="R$"
              onChange={setInvestIdx}
              onDirectInput={v => setInvestIdx(investToIdx(v))}
            />
            <Slider
              label="Custo por lead"
              value={cplIdx}
              min={0} max={cplValues.length - 1} step={1}
              displayValue={cpl}
              prefix="R$"
              onChange={setCplIdx}
              onDirectInput={v => setCplIdx(cplToIdx(v))}
            />
            <Slider
              label="Taxa de conversão"
              value={conversao}
              min={0.5} max={100} step={0.5}
              displayValue={conversao}
              suffix="%"
              onChange={setConversao}
              onDirectInput={v => setConversao(Math.min(100, Math.max(0.5, v)))}
            />
            <Slider
              label="Ticket médio"
              value={ticketIdx}
              min={0} max={ticketValues.length - 1} step={1}
              displayValue={ticket}
              prefix="R$"
              onChange={setTicketIdx}
              onDirectInput={v => setTicketIdx(ticketToIdx(v))}
            />
          </div>
        </div>

        {/* Direita — resultados */}
        <div>
          <div style={S.resHeader}>Resultado projetado</div>
          <div className="roi-prop-results">
            <ResultCard label="Leads gerados" value={fmtN(leads)} />
            <ResultCard label="Vendas fechadas" value={fmtN(vendas)} />
            <ResultCard label="CAC" value={cac > 0 ? fmtBRL(cac) : '—'} hint="Custo por cliente adquirido" />
            <ResultCard label="ROAS" value={roas > 0 ? roas.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'x' : '—'} hint="Receita por R$ investido" />
            <ResultCard label="Faturamento total" value={fmtBRL(faturamento)} accent wide />
          </div>

          {/* Slider de margem de lucro + resultado */}
          <div style={S.margemBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-2)' }}>Margem de lucro</span>
              <MargemValor margem={margem} setMargem={setMargem} />
            </div>
            <input
              type="range" min={1} max={100} step={1} value={margem}
              onChange={e => setMargem(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#1FCE7C' }}
            />
            <div style={S.margemResults}>
              <div style={S.margemItem}>
                <div style={S.margemLabel}>Lucro estimado</div>
                <div style={S.margemValue}>{fmtBRL(lucro)}</div>
              </div>
              <div style={{ width: 1, background: 'rgba(31,206,124,0.2)' }} />
              <div style={S.margemItem}>
                <div style={S.margemLabel}>ROI</div>
                <div style={{ ...S.margemValue, color: roi > 0 ? 'var(--mint-600)' : 'var(--fg-3)' }}>
                  {roi > 0 ? `+${Math.round(roi)}%` : '—'}
                </div>
              </div>
            </div>
          </div>

          <p style={S.disclaimer}>* Projeção baseada nos valores inseridos. Resultados reais dependem do mercado, estratégia e performance comercial.</p>
        </div>
      </div>
    </section>
  );
};

const Slider = ({ label, value, min, max, step, displayValue, prefix, suffix, onChange, onDirectInput }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const startEdit = () => { setDraft(displayValue.toString()); setEditing(true); };
  const commitEdit = () => {
    const normalized = draft.replace(',', '.');
    const num = Number(normalized);
    if (!isNaN(num) && num > 0 && onDirectInput) onDirectInput(num);
    setEditing(false);
  };

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-2)' }}>{label}</span>
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(false); }}
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--night-900)', border: 'none', borderBottom: '2px solid var(--brand-400)', background: 'transparent', outline: 'none', width: 130, textAlign: 'right' }}
          />
        ) : (
          <span
            onClick={startEdit}
            title="Clique para digitar"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--night-900)', cursor: 'text', borderBottom: '1px dashed var(--border-1)' }}
          >
            {prefix && prefix + ' '}{Number(displayValue).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}{suffix}
          </span>
        )}
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#9B32F1' }}
      />
    </div>
  );
};

const MargemValor = ({ margem, setMargem }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const startEdit = () => { setDraft(margem.toString()); setEditing(true); };
  const commitEdit = () => {
    const num = Number(draft.replace(',', '.'));
    if (!isNaN(num) && num >= 1 && num <= 100) setMargem(Math.round(num));
    setEditing(false);
  };

  if (editing) return (
    <input
      autoFocus
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commitEdit}
      onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(false); }}
      style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--mint-600)', border: 'none', borderBottom: '2px solid var(--mint-500)', background: 'transparent', outline: 'none', width: 70, textAlign: 'right' }}
    />
  );

  return (
    <span
      onClick={startEdit}
      title="Clique para digitar"
      style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--mint-600)', cursor: 'text', borderBottom: '1px dashed var(--mint-300)' }}
    >
      {margem}%
    </span>
  );
};

const ResultCard = ({ label, value, accent, wide, hint }) => (
  <div style={{
    background: accent ? 'var(--night-900)' : 'white',
    border: `1.5px solid ${accent ? 'transparent' : 'var(--border-1)'}`,
    borderRadius: 16,
    padding: '20px 24px',
    gridColumn: wide ? '1 / -1' : 'auto',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {accent && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(155,50,241,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />}
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent ? 'var(--mint-500)' : 'var(--fg-3)', marginBottom: 10 }}>
      {label}
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: accent ? 48 : 36, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, color: accent ? 'white' : 'var(--night-900)', wordBreak: 'break-word' }}>
      {value}
    </div>
    {hint && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-body)' }}>{hint}</div>}
  </div>
);

const S = {
  section: { padding: '72px 24px', background: 'var(--sand-100)' },
  eyebrow: { fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 },
  h2: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--night-900)', margin: '0 0 16px' },
  p: { fontSize: 15, lineHeight: 1.65, color: 'var(--fg-2)', margin: '0 0 28px' },
  box: { background: 'white', borderRadius: 18, padding: 24, border: '1px solid var(--border-1)' },
  resHeader: { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-3)', marginBottom: 16 },
  margemBox: { marginTop: 12, background: 'white', borderRadius: 16, padding: '18px 20px', border: '1.5px solid var(--mint-100)' },
  margemResults: { display: 'flex', gap: 0, marginTop: 14, background: 'var(--mint-50)', borderRadius: 12, overflow: 'hidden' },
  margemItem: { flex: 1, padding: '14px 18px' },
  margemLabel: { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mint-600)', marginBottom: 6 },
  margemValue: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--night-900)' },
  disclaimer: { marginTop: 14, fontSize: 11, color: 'var(--fg-3)', fontStyle: 'italic', lineHeight: 1.5 },
};

export default ROICalcProposta;
