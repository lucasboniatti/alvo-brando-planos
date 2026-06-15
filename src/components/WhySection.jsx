import { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const tabs = [
  {
    id: "humanizada",
    label: "Conversa humanizada",
    tag: "Clínica", tagBg: "rgba(255,255,255,0.15)", tagColor: "#ffffff",
    desc: "Conversa como um humano, sem menus, sem botões, sem \"Digite 1 para...\".",
    messages: [
      { type: "out", text: "Oi, vi o anúncio de vocês no Instagram" },
      { type: "in",  text: "Oi, Ana! Que bom que chegou até a gente. 😊" },
      { type: "in",  text: "Aqui é a Maria da Clínica Sorrir." },
      { type: "in",  text: "Você tem interesse em clareamento ou algum outro tratamento?" },
      { type: "out", text: "Quero fazer clareamento dental" },
      { type: "in",  text: "Ótima escolha! Temos opções a partir de R$ 350." },
      { type: "in",  text: "Posso te agendar uma avaliação gratuita esta semana?" },
      { type: "out", text: "Sim, quero!" },
      { type: "dots" },
    ]
  },
  {
    id: "objecoes",
    label: "Quebra de objeções",
    tag: "Imobiliária", tagBg: "rgba(255,255,255,0.15)", tagColor: "#ffffff",
    desc: "Contorna todas objeções do seu cliente como o seu melhor vendedor faria.",
    messages: [
      { type: "out", text: "Tá muito caro, vi apartamentos mais baratos" },
      { type: "in",  text: "Entendo Sofia, faz sentido comparar! 😊" },
      { type: "in",  text: "O outro tinha vaga e área de lazer também?" },
      { type: "out", text: "Não, só o apartamento" },
      { type: "in",  text: "Exato! No metro quadrado o nosso fica bem competitivo." },
      { type: "in",  text: "Que tal visitar o imóvel essa semana para você ver pessoalmente?" },
      { type: "out", text: "Pode ser, tenho quinta de tarde livre" },
      { type: "in",  text: "Perfeito! Visita marcada para quinta às 15h. Te esperamos lá! 🏠" },
      { type: "in",  text: "Vou te mandar um lembrete no dia." },
      { type: "dots" },
    ]
  },
  {
    id: "bant",
    label: "Qualificação BANT",
    tag: "Energia Solar", tagBg: "rgba(255,255,255,0.15)", tagColor: "#ffffff",
    desc: "Perguntas de qualificação para conduzir apenas leads com potencial para você.",
    messages: [
      { type: "in",  text: "Qual o principal desafio comercial da sua empresa hoje?" },
      { type: "out", text: "Temos muitos leads mas baixa conversão" },
      { type: "in",  text: "Entendo! Quantos vendedores atende esse volume?" },
      { type: "in",  text: "O processo é pelo WhatsApp ou outro canal?" },
      { type: "out", text: "WhatsApp, mas demora muito pra responder" },
      { type: "in",  text: "Certo. Você é o responsável pela decisão de contratar?" },
      { type: "out", text: "Sim, sou o dono" },
      { type: "in",  text: "E tem alguma urgência ou ainda está pesquisando?" },
      { type: "out", text: "Quero resolver isso esse trimestre" },
      { type: "dots" },
    ]
  },
  {
    id: "followup",
    label: "Follow-ups ativos",
    tag: "Concessionária", tagBg: "rgba(255,255,255,0.15)", tagColor: "#ffffff",
    desc: "Retoma contato com leads que sumiram no momento certo, eles não te esquecem.",
    messages: [
      { type: "in",  text: "Oi, Pedro! Aqui é a Maria da Central Car. 🚗" },
      { type: "in",  text: "Você fez um test drive conosco semana passada." },
      { type: "in",  text: "O que achou do HB20?" },
      { type: "out", text: "Gostei bastante, mas ainda tô pensando" },
      { type: "in",  text: "Faz sentido! Posso te ajudar a comparar as condições?" },
      { type: "in",  text: "Essa semana temos uma oferta especial de financiamento." },
      { type: "out", text: "Que condições são essas?" },
      { type: "in",  text: "Entrada reduzida e 60x sem juros. Quer que eu te passe os detalhes?" },
      { type: "dots" },
    ]
  },
  {
    id: "lembretes",
    label: "Lembretes automáticos",
    tag: "Academia", tagBg: "rgba(255,255,255,0.15)", tagColor: "#ffffff",
    desc: "Lembrete antes e no dia, maior taxa de comparecimento em reuniões e consultas.",
    messages: [
      { type: "in",  text: "Oi, Carlos! Aqui é a Maria. 💪" },
      { type: "in",  text: "Lembrete: amanhã às 19h é sua aula experimental na academia." },
      { type: "in",  text: "Podemos contar com seu comparecimento?" },
      { type: "out", text: "Oi! Amanhã não vou conseguir, pode remarcar?" },
      { type: "in",  text: "Claro! Sem problema. 😊" },
      { type: "in",  text: "Temos quinta às 18h ou sábado às 10h. Qual fica melhor?" },
      { type: "out", text: "Sábado às 10h perfeito" },
      { type: "in",  text: "Ótimo! Remarquei para sábado às 10h." },
      { type: "in",  text: "Te esperamos aqui na Viva Fit! 💪" },
      { type: "dots" },
    ]
  },
];

const WhySection = () => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const chatRef = useRef(null);
  const sectionRef = useScrollReveal({ threshold: 0.06 });

  const switchTab = (i) => {
    if (i === active) return;
    setVisible(false);
    setTimeout(() => {
      setActive(i);
      setVisible(true);
    }, 180);
  };

  const tab = tabs[active];

  const chatBlock = (
    <div className="why-phone" style={s.right}>
      <div style={s.phone}>
        <div style={s.phoneHeader} ref={chatRef}>
          <div style={s.phoneAvatar}>IA</div>
          <div style={{ flex: 1 }}>
            <div style={s.phoneName}>Maria</div>
            <div style={s.phoneStatus}>online</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ background: tab.tagBg, color: tab.tagColor, fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-display)', padding: '4px 10px', borderRadius: 999, letterSpacing: '0.03em', border: `1px solid ${tab.tagColor}33` }}>
              {tab.tag}
            </div>
            <button
              onClick={() => switchTab((active - 1 + tabs.length) % tabs.length)}
              style={s.navBtn}
              aria-label="Anterior"
            >‹</button>
            <button
              onClick={() => switchTab((active + 1) % tabs.length)}
              style={s.navBtn}
              aria-label="Próximo"
            >›</button>
          </div>
        </div>
        <div style={{ ...s.chat, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {tab.messages.map((msg, i) => {
            const time = `${14 + Math.floor(i / 6)}:${String((i * 3) % 60).padStart(2, "0")}`;
            if (msg.type === "dots") return (
              <div key={i} style={s.dots}>
                <span style={{ ...s.dot, animationDelay: "0s" }} />
                <span style={{ ...s.dot, animationDelay: "0.15s" }} />
                <span style={{ ...s.dot, animationDelay: "0.3s" }} />
              </div>
            );
            return (
              <div key={i} style={msg.type === "in" ? s.bubbleIn : s.bubbleOut}>
                {msg.text}
                <span style={s.bubbleTime}>{time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section id="why" style={s.section}>
      <style>{`
        .why-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        /* No desktop: phone fica na coluna direita (segunda coluna) */
        .why-phone-desktop { display: block; }
        .why-phone-mobile  { display: none; }

        .why-tab-btn:not(.why-tab-active):hover {
          background: var(--sand-50) !important;
        }
        .why-tab-btn:active {
          transform: scale(0.99);
        }
        @media (max-width: 768px) {
          .why-inner {
            display: flex;
            flex-direction: column;
            gap: 0;
          }
          /* No mobile: título → chat → subtítulo → tabs */
          .why-phone-desktop { display: none; }
          .why-phone-mobile  { display: block; margin-bottom: 24px; }
          .why-heading { margin-bottom: 24px; }
          .why-sub { margin-bottom: 16px !important; }
          .why-h2 { font-size: 24px !important; }
        }
      `}</style>
      <div ref={sectionRef} className="why-inner">
        {/* Coluna esquerda — chat (desktop) */}
        <div className="why-phone-desktop">
          {chatBlock}
        </div>

        {/* Coluna direita — textos e tabs */}
        <div style={s.left}>
          <div className="why-heading">
            <div style={s.label}>PROCESSOS QUE VENDEM</div>
            <h2 style={s.h2} className="why-h2">IA de vendas no seu WhatsApp atendendo e vendendo 24/7.</h2>
          </div>

          {/* Chat aparece aqui SOMENTE no mobile (entre título e subtítulo) */}
          <div className="why-phone-mobile">
            {chatBlock}
          </div>

          <div style={s.tabs}>
            {tabs.map((t, i) => (
              <button
                key={t.id}
                onClick={() => switchTab(i)}
                style={{ ...s.tab, ...(active === i ? s.tabActive : {}) }}
                className={`why-tab-btn${active === i ? ' why-tab-active' : ''}`}
              >
                <div style={{ ...s.tabDot, ...(active === i ? s.tabDotActive : {}) }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ ...s.tabLabel, ...(active === i ? s.tabLabelActive : {}) }}>{t.label}</div>
                  <div style={{ fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--fg-3)', opacity: 0.5, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.03em', whiteSpace: 'nowrap', border: '1px solid var(--border-1)' }}>{t.tag}</div>
                </div>
                  {active === i && <div style={s.tabDesc}>{t.desc}</div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes wblink {
          0%, 70%, 100% { opacity: 0.25; transform: translateY(0) scale(0.85); }
          35% { opacity: 1; transform: translateY(-4px) scale(1); }
        }
      `}</style>
    </section>
  );

};

const s = {
  section: { padding: "80px 24px" , background: "var(--sand-50)" },
  left: {},
  label: { fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 },
  h2: { fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--night-900)", margin: "0 0 12px" },
  sub: { fontSize: 15, color: "var(--fg-2)", marginBottom: 32 },
  tabs: { display: "flex", flexDirection: "column", gap: 2 },
  tab: { display: "flex", gap: 14, alignItems: "flex-start", background: "transparent", border: "none", borderRadius: 14, padding: "11px 16px", cursor: "pointer", textAlign: "left", transition: "background 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)" },
  tabActive: { background: "white", boxShadow: "0 4px 20px rgba(14,23,48,0.09), 0 1px 4px rgba(14,23,48,0.05)" },
  tabDot: { width: 8, height: 8, borderRadius: "50%", background: "var(--sand-300)", marginTop: 6, flexShrink: 0, transition: "background 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)" },
  tabDotActive: { background: "var(--brand-500)" },
  tabLabel: { fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--fg-2)", lineHeight: 1.3 },
  tabLabelActive: { color: "var(--night-900)", fontWeight: 600 },
  tabDesc: { fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5, marginTop: 4 },

  right: { display: "flex", flexDirection: "column" },
  phone: {
    borderRadius: 20, overflow: "hidden",
    boxShadow: "0 30px 80px rgba(14,23,48,0.2), 0 8px 24px rgba(14,23,48,0.1)",
    display: "flex", flexDirection: "column",
  },
  phoneHeader: {
    display: "flex", gap: 10, alignItems: "center", padding: "12px 16px",
    background: "#075E54",
  },
  phoneAvatar: {
    width: 36, height: 36, borderRadius: 999, flexShrink: 0,
    background: "linear-gradient(135deg,#BD8AF7,#A95BF4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-display)"
  },
  navBtn: {
    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
    color: 'white', fontSize: 18, fontWeight: 400, lineHeight: 1,
    width: 28, height: 28, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', padding: 0, flexShrink: 0,
    transition: 'background 0.15s',
  },
  phoneName: { fontSize: 14, fontWeight: 600, color: "white", lineHeight: 1.2 },
  phoneStatus: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  chat: {
    background: "#E5DDD5", padding: 14,
    display: "flex", flexDirection: "column", gap: 6,
    flex: 1, overflow: "hidden",
  },
  bubbleIn: {
    background: "#fff", color: "#111", fontSize: 13, padding: "7px 10px",
    borderRadius: 8, borderBottomLeftRadius: 2,
    alignSelf: "flex-start", maxWidth: "80%", lineHeight: 1.45,
    boxShadow: "0 1px 1px rgba(0,0,0,0.1)"
  },
  bubbleOut: {
    background: "#DCF8C6", color: "#111", fontSize: 13, padding: "7px 10px",
    borderRadius: 8, borderBottomRightRadius: 2,
    alignSelf: "flex-end", maxWidth: "80%", lineHeight: 1.45,
    boxShadow: "0 1px 1px rgba(0,0,0,0.1)"
  },
  bubbleTime: { fontSize: 10, color: "#888", marginLeft: 8, whiteSpace: "nowrap" },
  dots: { display: "flex", gap: 4, padding: "7px 10px", alignSelf: "flex-start", background: "#fff", borderRadius: 8, borderBottomLeftRadius: 2, boxShadow: "0 1px 1px rgba(0,0,0,0.1)" },
  dot: {
    width: 7, height: 7, borderRadius: "50%", background: "#888",
    display: "inline-block", animation: "wblink 1.2s infinite ease-in-out"
  },
};

export default WhySection;
