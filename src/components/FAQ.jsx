import { useState } from 'react';
import { useChildrenReveal } from '../hooks/useScrollReveal';
import { gaFaqOpened } from '../lib/ga';

const FAQ = () => {
  const [open, setOpen] = useState(0);
  const ref = useChildrenReveal('[data-reveal]', 60);
  const items = [
    { q: "Vocês garantem resultado?", a: "Nenhuma assessoria honesta garante resultado. O que garantimos é o sistema funcionando com processo validado em mais de 180 empresas. Resultado é consequência de execução bem feita. E se não estiver satisfeito, você cancela quando quiser." },
    { q: "Quais serviços vocês entregam?", a: "Montamos e operamos o sistema completo de marketing e vendas: Meta Ads, Google Ads, social media, landing page, design de criativos, IA no WhatsApp, CRM e playbook de vendas. Tudo no mesmo contrato, um time só." },
    { q: "Posso cancelar quando quiser?", a: "Sim, não prendemos você com contrato. Você cancela quando quiser, sem multa e sem burocracia." },
    { q: "Em quanto tempo vejo resultado?", a: "Nos primeiros 30 dias o sistema completo está no ar e os primeiros clientes chegam. Entre 60 e 90 dias os resultados ficam consistentes. A partir do 4º mês a escala é previsível." },
    { q: "Quanto custa?", a: "Depende dos canais e do seu objetivo. No Diagnóstico Gratuito montamos uma proposta personalizada para o seu negócio. Sem pacote de prateleira, é um projeto sob medida para o seu orçamento." },
    { q: "Vocês atendem meu nicho?", a: "Na maioria dos casos, sim. Já atendemos clínicas, lojas, escolas, restaurantes, imobiliárias, indústrias, franquias e prestadores de serviço B2B e B2C. Se você tem um produto ou serviço vendável, nós te ajudamos a vendê-lo." },
  ];

  return (
    <section id="faq" style={faqStyles.section}>
      <style>{`
        .faq-h2 {
          font-family: var(--font-display);
          font-size: 40px;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--night-900);
          margin: 0 0 48px;
          text-align: center;
        }
        .faq-answer {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition:
            grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .faq-answer.open {
          grid-template-rows: 1fr;
          opacity: 1;
        }
        .faq-answer-inner {
          overflow: hidden;
        }
        .faq-btn:hover {
          background: var(--sand-50);
        }
        .faq-btn:active {
          background: var(--sand-100);
        }
        @media (max-width: 768px) {
          .faq-h2 { font-size: 26px; margin-bottom: 32px; }
        }
      `}</style>
      <div ref={ref} style={faqStyles.inner}>
        <div data-reveal style={faqStyles.label}>Perguntas frequentes</div>
        <h2 data-reveal className="faq-h2">Ficou com alguma dúvida?</h2>
        <div style={faqStyles.list}>
          {items.map((it, i) => (
            <div key={i} data-reveal style={{ ...faqStyles.item, ...(open === i ? faqStyles.itemOpen : {}) }}>
              <button
                onClick={() => {
                  if (open !== i) gaFaqOpened({ pergunta: it.q, index: i });
                  setOpen(open === i ? -1 : i);
                }}
                style={faqStyles.q}
                className="faq-btn"
              >
                <span>{it.q}</span>
                <span style={{ ...faqStyles.chev, transform: open === i ? "rotate(180deg)" : "none" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </button>
              <div className={`faq-answer${open === i ? ' open' : ''}`}>
                <div className="faq-answer-inner">
                  <div style={faqStyles.a}>{it.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const faqStyles = {
  section: { padding: "80px 24px", background: "var(--bg-canvas)" },
  inner: { maxWidth: 820, margin: "0 auto" },
  label: { fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, textAlign: "center" },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  item: { background: "white", border: "1px solid var(--border-1)", borderRadius: 14, overflow: "hidden", transition: "box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s cubic-bezier(0.16,1,0.3,1)" },
  itemOpen: { boxShadow: "0 8px 32px rgba(14,23,48,0.10), 0 2px 8px rgba(14,23,48,0.05)", borderColor: "var(--sand-300)" },
  q: { width: "100%", textAlign: "left", padding: "18px 22px", background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, color: "var(--night-900)", letterSpacing: "-0.01em" },
  chev: { color: "var(--fg-3)", transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)", display: "inline-flex", flexShrink: 0 },
  a: { padding: "0 22px 22px", fontSize: 15, lineHeight: 1.6, color: "var(--fg-2)" }
};

export default FAQ;
