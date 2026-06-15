import { useState, useRef } from 'react';
import { useChildrenReveal, useScrollReveal } from '../hooks/useScrollReveal';
import { gaRoiInteracted, gaCtaClicked } from '../lib/ga';

const useDebounce = (fn, delay) => {
  const t = useRef(null);
  return (...args) => { clearTimeout(t.current); t.current = setTimeout(() => fn(...args), delay); };
};

const ticketValues = [
  ...Array.from({ length: 20 }, (_, i) => (i + 1) * 50),
  ...Array.from({ length: 420 }, (_, i) => 1100 + i * 100),
  ...Array.from({ length: 115 }, (_, i) => 43500 + i * 500),
].filter(v => v <= 100000);
const ticketToIndex = (v) => {
  let idx = ticketValues.findIndex(x => x >= v);
  return idx === -1 ? ticketValues.length - 1 : idx;
};

const ROICalc = ({ onCtaClick }) => {
  const leftRef = useChildrenReveal('[data-reveal]', 80);
  const rightRef = useScrollReveal({ threshold: 0.1 });
  const [leads, setLeads] = useState(200);
  const [fastResponse, setFastResponse] = useState(20);
  const [ticketIdx, setTicketIdx] = useState(ticketToIndex(8000));
  const ticket = ticketValues[ticketIdx];
  const trackRoi = useDebounce(gaRoiInteracted, 800);

  const lostLeads = Math.round(leads * (1 - fastResponse / 100));
  const recoveredLeads = Math.round(leads * (0.95 - fastResponse / 100));
  const withAI = Math.round(leads * 0.95);
  const revenueLost = Math.max(0, recoveredLeads * ticket * 0.12);
  const fmt = (n) => "R$ " + n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

  return (
    <section id="roi" style={roiStyles.section}>
      <style>{`
        .roi-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .roi-results {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .roi-big {
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1;
          margin-bottom: 4px;
        }
        .roi-source {
          margin-top: 16px;
          font-size: 12px;
          color: var(--fg-3);
          font-style: italic;
          line-height: 1.5;
        }
        .roi-cta-wrap button { display: block; }
        @media (max-width: 768px) {
          .roi-inner { grid-template-columns: 1fr; gap: 32px; }
          .roi-big { font-size: 24px; }
          .roi-big-revenue { font-size: 56px !important; word-break: break-word; }
          .roi-h2 { font-size: 24px !important; }
          .roi-res-label { font-size: 9px !important; letter-spacing: 0.04em !important; }
          .roi-res-sub { font-size: 11px !important; }
          .roi-cta-wrap { display: flex; justify-content: center; }
          .roi-cta-wrap button { width: 100% !important; }
        }
      `}</style>
      <div className="roi-inner">
        {/* Coluna esquerda — stagger em cada elemento */}
        <div ref={leftRef}>
          <div data-reveal style={roiStyles.label}>Calcular ROI</div>
          <h2 data-reveal style={roiStyles.h2} className="roi-h2">Seu time está perdendo vendas agora</h2>
          <p data-reveal style={roiStyles.p}>
            Leads respondidos em menos de 5 minutos têm <strong>9x mais chance de fechar</strong>. Arraste os controles e veja quanto sua empresa está deixando na mesa por demora no atendimento.
          </p>
          <div data-reveal style={roiStyles.controls}>
            <Slider label="Leads por mês" value={leads} min={50} max={2000} step={50} unit="" onChange={v => { setLeads(v); trackRoi({ campo: 'leads', valor: v }); }} onDirectInput={v => { const clamped = Math.min(2000, Math.max(50, v)); setLeads(clamped); }} />
            <Slider label="% atendidos em menos de 5 min" value={fastResponse} min={0} max={80} step={5} unit="%" onChange={v => { setFastResponse(v); trackRoi({ campo: 'resposta_rapida', valor: v }); }} onDirectInput={v => { const clamped = Math.min(80, Math.max(0, v)); setFastResponse(clamped); }} />
            <Slider label="Ticket médio" value={ticketIdx} min={0} max={ticketValues.length - 1} step={1} unit="" prefix="R$" displayValue={ticket} onChange={v => { setTicketIdx(v); trackRoi({ campo: 'ticket', valor: ticketValues[v] }); }} onDirectInput={v => { setTicketIdx(ticketToIndex(v)); }} />
          </div>
        </div>

        {/* Coluna direita — bloco entra junto */}
        <div ref={rightRef}>
          <div className="roi-results" style={roiStyles.results}>
            <div style={roiStyles.resultCard}>
              <div className="roi-res-label" style={roiStyles.resLabel}>Leads perdidos hoje</div>
              <div className="roi-big" style={{ ...roiStyles.resBig, color: "var(--brand-600)" }}>{lostLeads}</div>
              <div className="roi-res-sub" style={{ fontSize: 13, color: "var(--fg-3)" }}>sem resposta rápida</div>
            </div>
            <div style={{ ...roiStyles.resultCard, background: "var(--brand-400)" }}>
              <div className="roi-res-label" style={{ ...roiStyles.resLabel, color: "rgba(255,255,255,0.7)" }}>Com atendimento imediato</div>
              <div className="roi-big" style={{ ...roiStyles.resBig, color: "#FFFFFF" }}>{withAI}</div>
              <div className="roi-res-sub" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "#FFFFFF" }}>
                +{Math.max(0, recoveredLeads)} leads aproveitados
              </div>
            </div>
            <div style={{ ...roiStyles.resultCard, background: "var(--night-900)", color: "#fff", gridColumn: "1 / -1" }}>
              <div className="roi-res-label" style={{ ...roiStyles.resLabel, color: "var(--mint-500)" }}>Receita que você está deixando na mesa</div>
              <div className="roi-big roi-big-revenue" style={{ ...roiStyles.resBig, color: "white" }}>{fmt(revenueLost)}</div>
              <div className="roi-res-sub" style={{ fontSize: 13, color: "#B5BCCE" }}>por mês · estimativa com 12% de fechamento</div>
            </div>
          </div>
          <p className="roi-source">* Leads respondidos em menos de 5 minutos têm 9x mais chance de fechar. Fonte: Harvard Business Review.</p>
        </div>
      </div>
    </section>
  );
};

const Slider = ({ label, value, min, max, step, unit = "", prefix = "", displayValue, onChange, onDirectInput }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const shown = displayValue ?? value;

  const startEdit = () => { setDraft(shown.toString()); setEditing(true); };
  const commitEdit = () => {
    const raw = draft.replace(/\D/g, '');
    const num = Number(raw);
    if (!isNaN(num) && num > 0 && onDirectInput) onDirectInput(num);
    setEditing(false);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>{label}</span>
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(false); }}
            style={{
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18,
              color: "var(--night-900)", border: "none", borderBottom: "2px solid var(--brand-400)",
              background: "transparent", outline: "none", width: 120, textAlign: "right",
            }}
          />
        ) : (
          <span
            onClick={startEdit}
            title="Clique para digitar"
            style={{
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18,
              color: "var(--night-900)", cursor: "text",
              borderBottom: "1px dashed var(--border-1)",
            }}
          >
            {prefix && prefix + " "}{shown.toLocaleString("pt-BR")}{unit}
          </span>
        )}
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#9B32F1" }}
      />
    </div>
  );
};

const roiStyles = {
  section: { padding: "80px 24px", background: "var(--sand-100)" },
  label: { fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 },
  h2: { fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--night-900)", margin: "0 0 20px" },
  p: { fontSize: 16, lineHeight: 1.6, color: "var(--fg-2)", marginBottom: 32 },
  controls: { background: "white", borderRadius: 16, padding: 24, border: "1px solid var(--border-1)" },
  results: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  resultCard: { background: "white", borderRadius: 16, padding: 24, border: "1px solid var(--border-1)" },
  resLabel: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 },
  resBig: { fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 4 }
};

export default ROICalc;
