import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import logoOnDark from '../assets/logo-on-dark.svg';
import { gaDashboardTabSwitched, gaDashboardConvClicked } from '../lib/ga';

const CONVS = [
  { id: 1, name: "Luiza Almeida",   initial: "L", color: "linear-gradient(135deg,#BD8AF7,#A95BF4)", time: "agora",  preview: "Quero saber mais sobre o serviço", live: true,  temp: "hot",  bill: "480", unread: 2, phone: "+55 11 9 7821-0044", property: "Clínica odontológica", cep: "01310-100", source: "Facebook Ads", score: "92/100",
    messages: [
      { side: "out", text: "Oi, quero saber mais sobre o serviço de IA", t: "14:01" },
      { side: "in",  who: "Vendedor IA", text: "Oi, Luiza! 😊 Aqui é o Vendedor IA da Alvo Brando.", t: "14:02" },
      { side: "in",  who: "Vendedor IA", text: "Pra te mostrar o melhor plano, qual o volume de leads que recebe por mês?", t: "14:02" },
      { side: "out", text: "Umas 80 a 100 por mês", t: "14:03" },
      { side: "in",  who: "Vendedor IA", text: "Com esse volume dá pra qualificar tudo em segundos e nunca perder um lead quente ✨", t: "14:03" },
      { side: "in",  who: "Vendedor IA", text: "Posso agendar uma demonstração gratuita?", t: "14:04" },
      { side: "out", text: "Quero saber mais sobre o serviço", t: "14:04" },
      { side: "dots" },
    ]
  },
  { id: 2, name: "Marcos Tavares",  initial: "M", color: "linear-gradient(135deg,#6BEDBC,#1FC384)", time: "2min",  preview: "Quantos leads consigo atender?", live: true,  temp: "warm", bill: "320",
    messages: [
      { side: "out", text: "Quantos leads consigo atender com a IA?", t: "14:08" },
      { side: "in",  who: "Vendedor IA", text: "Oi, Marcos! Sem limite — a IA atende todos ao mesmo tempo, 24h por dia.", t: "14:08" },
      { side: "in",  who: "Vendedor IA", text: "Hoje você perde leads por demora na resposta?", t: "14:09" },
      { side: "out", text: "Sim, bastante nos finais de semana", t: "14:09" },
      { side: "dots" },
    ]
  },
  { id: 3, name: "Júlia Ribeiro",   initial: "J", color: "linear-gradient(135deg,#C3CADB,#2A3957)", time: "5min",  preview: "Vou pensar e te respondo amanhã", live: false, temp: "cold", bill: "180",
    messages: [
      { side: "in",  who: "Vendedor IA", text: "Oi, Júlia! Você pediu uma demonstração ontem, conseguiu analisar?", t: "14:05" },
      { side: "out", text: "Sim, mas ainda tô pensando", t: "14:06" },
      { side: "in",  who: "Vendedor IA", text: "Faz sentido! Sem pressa. Quer que eu te mande um comparativo de resultados de clientes?", t: "14:06" },
      { side: "out", text: "Vou pensar e te respondo amanhã", t: "14:07" },
    ]
  },
  { id: 4, name: "Eduardo Pacheco", initial: "E", color: "linear-gradient(135deg,#D5B3FB,#B53A12)", time: "8min",  preview: "Tem plano mensal sem fidelidade?", live: true,  temp: "hot",  bill: "720", unread: 1,
    messages: [
      { side: "out", text: "Tem plano mensal sem fidelidade?", t: "14:00" },
      { side: "in",  who: "Vendedor IA", text: "Sim! Temos planos mensais sem fidelidade e com suporte dedicado.", t: "14:01" },
      { side: "in",  who: "Vendedor IA", text: "Com seu volume de leads, o investimento se paga já no primeiro mês 😊", t: "14:01" },
      { side: "dots" },
    ]
  },
  { id: 5, name: "Patrícia Lima",   initial: "P", color: "linear-gradient(135deg,#BD8AF7,#8C1EDB)", time: "14min", preview: "Ótimo, me manda no email então", live: false, temp: "warm", bill: "390",
    messages: [
      { side: "in",  who: "Vendedor IA", text: "Oi, Patrícia! Segue o material completo sobre os planos da Alvo Brando.", t: "13:55" },
      { side: "out", text: "Ótimo, me manda no email então", t: "13:56" },
      { side: "in",  who: "Vendedor IA", text: "Enviado! Qualquer dúvida é só chamar aqui. 😊", t: "13:56" },
    ]
  },
  { id: 6, name: "Bruno Cardoso",   initial: "B", color: "linear-gradient(135deg,#6BEDBC,#119663)", time: "22min", preview: "Integra com meu CRM?", live: false, temp: "cold", bill: "210",
    messages: [
      { side: "out", text: "A IA integra com o meu CRM atual?", t: "13:45" },
      { side: "in",  who: "Vendedor IA", text: "Sim! Integramos com os principais CRMs via API ou Zapier.", t: "13:46" },
      { side: "out", text: "Integra com meu CRM?", t: "13:47" },
      { side: "in",  who: "Vendedor IA", text: "Pode me dizer qual CRM você usa? Confirmo a integração na hora.", t: "13:47" },
    ]
  },
  { id: 7, name: "Cláudia Moreira", initial: "C", color: "linear-gradient(135deg,#D5B3FB,#A95BF4)", time: "31min", preview: "Quanto tempo leva pra configurar?", live: false, temp: "warm", bill: "540",
    messages: [
      { side: "out", text: "Quanto tempo leva pra configurar tudo?", t: "13:30" },
      { side: "in",  who: "Vendedor IA", text: "Em até 7 dias úteis você já está com a IA funcionando no seu WhatsApp.", t: "13:31" },
      { side: "in",  who: "Vendedor IA", text: "Nossa equipe cuida de toda a configuração e treinamento. 😊", t: "13:31" },
    ]
  },
  { id: 8, name: "Rodrigo Sá",      initial: "R", color: "linear-gradient(135deg,#C3CADB,#6B7896)", time: "1h",    preview: "Tem cases de clínicas?", live: false, temp: "hot",  bill: "650",
    messages: [
      { side: "out", text: "Vocês têm cases de clínicas odontológicas?", t: "13:10" },
      { side: "in",  who: "Vendedor IA", text: "Temos sim! Posso te enviar resultados de clínicas com perfil parecido ao seu.", t: "13:11" },
      { side: "in",  who: "Vendedor IA", text: "Quer agendar uma demonstração sem compromisso?", t: "13:11" },
    ]
  },
];

const tempColors = {
  hot:  { bg: "#FFEFE8", color: "#B53A12", label: "Quente" },
  warm: { bg: "#F5EBFE", color: "#7517B5", label: "Morno" },
  cold: { bg: "#E8EBF2", color: "#2A3957", label: "Frio" },
};

const navItems = [
  { label: "Painel", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
  { label: "Conversas", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, count: 8, active: true },
  { label: "Leads", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/></svg>, count: 142 },
  { label: "Agenda", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: "Analytics", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="20" x2="21" y2="20"/><rect x="6" y="10" width="3" height="10"/><rect x="11" y="6" width="3" height="14"/><rect x="16" y="13" width="3" height="7"/></svg> },
  { label: "Integrações", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2v6M15 2v6M5 8h14v3a7 7 0 01-14 0z"/><path d="M12 18v4"/></svg> },
  { label: "Configurações", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

const DashboardPreview = () => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileTab, setMobileTab] = useState('chat');
  const ref = useScrollReveal();

  const switchConv = (i) => {
    if (i === active) return;
    gaDashboardConvClicked({ nome: CONVS[i].name, posicao: i + 1, temp: CONVS[i].temp });
    setVisible(false);
    setTimeout(() => { setActive(i); setVisible(true); }, 150);
  };

  const switchMobileTab = (aba) => {
    gaDashboardTabSwitched({ aba });
    setMobileTab(aba);
  };

  const conv = CONVS[active];
  const tc = tempColors[conv.temp];

  return (
    <section style={s.section}>
      <style>{`
        .dash-section-inner { max-width: 1200px; margin: 0 auto; }
        .dash-frame {
          display: grid;
          grid-template-columns: 220px 1fr;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--border-1);
          box-shadow: 0 40px 100px rgba(14,23,48,0.18), 0 12px 32px rgba(14,23,48,0.1);
          height: 600px;
          background: white;
        }
        .dash-main { display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
        .dash-content { flex: 1; display: flex; min-height: 0; padding: 16px 20px 20px; gap: 0; }
        .dash-inner-frame { display: flex; flex: 1; background: white; border-radius: 14px; border: 1px solid var(--border-1); overflow: hidden; }
        .dash-conv-item { width: 100%; display: flex; gap: 10px; padding: 12px; border-radius: 10px; background: transparent; border: none; cursor: pointer; text-align: left; font-family: inherit; transition: background 0.15s; }
        .dash-conv-item:hover { background: var(--sand-50); }
        .dash-conv-item.active { background: var(--sand-100); }
        @keyframes dashPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes dashBounce { 0%,80%,100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
        .dash-scroll-wrap { }

        /* Tablet (769px–1024px): sidebar some, painel lateral some, inner-frame reorganizado */
        @media (max-width: 1024px) {
          .dash-frame {
            grid-template-columns: 1fr;
            height: auto;
            min-height: 560px;
          }
          .dash-sidebar-col { display: none !important; }
          .dash-stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .dash-panel-col { display: none !important; }
          .dash-inner-frame { flex-direction: row; }
          .dash-list-col { width: 220px !important; flex-shrink: 0; }
          .dash-detail-col { flex: 1; min-width: 0; }
          .dash-mobile-tabs { display: none !important; }
        }

        /* Mobile (≤768px): sidebar + painel lateral somem, abas para lista/chat */
        @media (max-width: 768px) {
          .dash-h2 { font-size: 26px !important; line-height: 1.2 !important; }
          .dash-frame {
            border-radius: 14px;
            height: auto;
            min-height: unset;
          }
          .dash-main { height: auto; }
          .dash-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-topbar-search { display: none !important; }
          .dash-topbar-title { display: none !important; }
          .dash-topbar-actions { display: none !important; }
          .dash-content { padding: 10px 10px 10px !important; flex: none !important; }
          .dash-inner-frame { flex-direction: column !important; border-radius: 10px !important; height: 340px; }
          .dash-list-col { width: 100% !important; display: none !important; flex: 1; min-height: 0; overflow: hidden; }
          .dash-list-col.tab-active { display: flex !important; }
          .dash-detail-col { display: none !important; flex: 1; min-height: 0; overflow: hidden; }
          .dash-detail-col.tab-active { display: flex !important; }
          .dash-mobile-tabs { display: flex !important; }
        }

        .dash-mobile-tabs {
          display: none;
          gap: 0;
          border-bottom: 1px solid var(--border-1);
          background: white;
        }
        .dash-mobile-tab {
          flex: 1;
          padding: 10px 0;
          border: none;
          background: transparent;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 600;
          color: var(--fg-3);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: color 0.15s;
        }
        .dash-mobile-tab.active {
          color: var(--night-900);
          border-bottom-color: var(--brand-400);
        }
      `}</style>

      <div ref={ref} className="dash-section-inner">
        <div style={s.head}>
          <div style={s.label}>Painel Alvo Brando</div>
          <h2 style={s.h2} className="dash-h2">Seu dashboard de marketing com<br />métricas que viram vendas</h2>
          <p style={s.sub}>Conversas ao vivo, leads qualificados, visitas agendadas e taxa de conversão num painel feito para o gestor que quer crescer.</p>
        </div>

        <div className="dash-frame">
          {/* Sidebar — oculta em tablet e mobile */}
          <aside className="dash-sidebar-col" style={s.sidebar}>
            <div style={s.sidebarBrand}>
              <img src={logoOnDark} style={{ height: 28 }} alt="Alvo Brando" />
            </div>
            <div style={s.personaCard}>
              <div style={s.personaTop}>
                <div style={s.personaAvWrap}>
                  <div style={s.personaAv}>M</div>
                  <span style={s.onlineDot} />
                </div>
                <div>
                  <div style={s.personaName}>Vendedor IA</div>
                  <div style={s.personaRole}><span style={{ color: "#34E5A1" }}>● </span>respondendo agora</div>
                </div>
              </div>
              <div style={s.personaStats}>
                <span><strong>3</strong> ativas</span>
                <span><strong>14</strong> hoje</span>
                <span><strong>3.2s</strong> resp</span>
              </div>
            </div>
            <nav style={s.nav}>
              {navItems.map(item => (
                <div key={item.label} style={{ ...s.navItem, ...(item.active ? s.navActive : {}) }}>
                  <span style={{ opacity: item.active ? 1 : 0.6 }}>{item.icon}</span>
                  <span style={s.navLabel}>{item.label}</span>
                  {item.count && <span style={s.navCount}>{item.count}</span>}
                </div>
              ))}
            </nav>
            <div style={s.sidebarFooter}>
              <div style={s.userRow}>
                <div style={{ ...s.userAv, background: "linear-gradient(135deg,#D5B3FB,#B53A12)" }}>R</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#FBF7EE", fontWeight: 600 }}>Rafael Mendes</div>
                  <div style={{ fontSize: 10, color: "#B5BCCE" }}>Alvo Brando · Admin</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="dash-main">
            {/* Topbar */}
            <header style={s.topbar}>
              <div>
                <div className="dash-topbar-title" style={s.topbarTitle}>Conversas</div>
                <div style={s.topbarSub}>8 ativas · Vendedor IA respondendo em tempo real</div>
              </div>
              <div className="dash-topbar-search" style={s.searchBar}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#847557" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span style={{ fontSize: 13, color: "var(--fg-3)", fontFamily: "var(--font-body)" }}>Buscar lead, telefone, mensagem...</span>
                <span style={s.kbd}>⌘K</span>
              </div>
              <div className="dash-topbar-actions" style={{ display: "flex", gap: 8 }}>
                <button style={s.iconBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                  <span style={s.notifDot} />
                </button>
                <button style={s.primaryBtn}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D0218" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Novo lead
                </button>
              </div>
            </header>

            {/* Stats */}
            <div className="dash-stats-grid" style={s.statsGrid}>
              {[
                { label: "Conversas hoje", value: "142", delta: "↑ 12 vs ontem", up: true, variant: "light" },
                { label: "Visitas agendadas", value: "24", delta: "★ Meta atingida", up: true, variant: "brand" },
                { label: "Taxa de conversão", value: "17%", delta: "↑ 2.4pp", up: true, variant: "dark" },
                { label: "Tempo médio resp.", value: "3.2s", delta: "· estável", up: null, variant: "light" },
              ].map(t => (
                <div key={t.label} style={{ ...s.statTile, ...statVariants[t.variant] }}>
                  <div style={s.statLabel}>{t.label}</div>
                  <div style={s.statValue}>{t.value}</div>
                  <div style={{ ...s.statDelta, color: t.variant === "dark" ? "#34E5A1" : t.variant === "brand" ? "#0D0218" : t.up ? "#1FC384" : "#847557" }}>{t.delta}</div>
                </div>
              ))}
            </div>

            {/* Abas mobile — visíveis só em ≤768px via CSS */}
            <div className="dash-mobile-tabs">
              <button className={`dash-mobile-tab${mobileTab === 'lista' ? ' active' : ''}`} onClick={() => switchMobileTab('lista')}>Conversas</button>
              <button className={`dash-mobile-tab${mobileTab === 'chat' ? ' active' : ''}`} onClick={() => switchMobileTab('chat')}>Chat</button>
            </div>

            {/* Content */}
            <div className="dash-content">
              <div className="dash-inner-frame">
                {/* Lista */}
                <div className={`dash-list-col${mobileTab === 'lista' ? ' tab-active' : ''}`} style={s.list}>
                  <div style={s.listHead}>
                    <span style={s.listTitle}>Conversas ao vivo</span>
                    <span style={s.liveBadge}><span style={{ width: 6, height: 6, borderRadius: 999, background: "#1FC384", display: "inline-block", animation: "dashPulse 1.6s infinite", marginRight: 5 }} />{CONVS.filter(c => c.live).length} ao vivo</span>
                  </div>
                  <div style={s.listTabs}>
                    {["Todas 8", "Quentes 3", "Aguardando 2", "Transfer."].map((t, i) => (
                      <span key={t} style={{ ...s.listTab, ...(i === 0 ? s.listTabActive : {}) }}>{t}</span>
                    ))}
                  </div>
                  <div className="dash-list-scroll" style={s.listScroll}>
                    {CONVS.map((c, i) => (
                      <button key={c.id} className={`dash-conv-item${i === active ? " active" : ""}`} onClick={() => switchConv(i)}>
                        <div style={{ ...s.av, background: c.color }}>{c.initial}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                            <span style={s.convName}>{c.name}</span>
                            <span style={s.convTime}>{c.time}</span>
                          </div>
                          <div style={s.convPreview}>{c.preview}</div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                            {c.live && <span style={s.metaLive}>● IA</span>}
                            <span style={{ ...s.metaTemp, background: tempColors[c.temp].bg, color: tempColors[c.temp].color }}>{tempColors[c.temp].label}</span>
                            <span style={s.metaBill}>R$ {c.bill}/mês</span>
                          </div>
                        </div>
                        {c.unread && <span style={s.unread}>{c.unread}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversa */}
                <div className={`dash-detail-col${mobileTab === 'chat' ? ' tab-active' : ''}`} style={s.detail}>
                  <div style={s.detailHead}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ ...s.av, background: conv.color }}>{conv.initial}</div>
                      <div>
                        <div style={s.detailName}>{conv.name}</div>
                        {conv.live && <div style={{ fontSize: 11, color: "#119663", fontWeight: 600, marginTop: 1 }}>● ao vivo com Vendedor IA</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[
                        <path d="M17 1 21 5 17 9M3 11V9a4 4 0 014-4h14M7 23 3 19 7 15M21 13v2a4 4 0 01-4 4H3"/>,
                        <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
                        <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
                      ].map((path, i) => (
                        <button key={i} style={s.iconBtnSm}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ ...s.transcript, opacity: visible ? 1 : 0, transition: "opacity 0.15s ease" }}>
                    {conv.messages.map((msg, i) => {
                      if (msg.side === "dots") return (
                        <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                          <div style={s.bubbleIn}>
                            {[0, 0.15, 0.3].map((d, j) => (
                              <span key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(14,23,48,0.35)", display: "inline-block", marginRight: 3, animation: `dashBounce 1.2s ${d}s infinite ease-in-out` }} />
                            ))}
                          </div>
                        </div>
                      );
                      const isAgent = msg.side === "in";
                      return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isAgent ? "flex-end" : "flex-start", marginBottom: 4 }}>
                          {msg.who && <div style={{ ...s.bubbleWho, alignSelf: "flex-end" }}>{msg.who}</div>}
                          <div style={isAgent ? s.bubbleIn : s.bubbleOut}>
                            {msg.text}
                            <span style={s.bubbleTime}>{msg.t}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={s.composer}>
                    <button style={s.composerBtn}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                    </button>
                    <div style={s.composerWrap}>
                      <input style={s.composerInput} type="text" placeholder="Enviar mensagem" readOnly />
                      <button style={s.composerEmoji}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                      </button>
                    </div>
                    <button style={s.composerBtn}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    </button>
                  </div>
                </div>

                {/* Painel lateral — oculto em tablet e mobile */}
                <div className="dash-panel-col" style={s.panel}>
                  <div style={s.panelSection}>
                    <div style={s.panelLabel}>Perfil do lead</div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                      <div style={{ ...s.av, background: conv.color, width: 40, height: 40, fontSize: 15 }}>{conv.initial}</div>
                      <div>
                        <div style={s.panelName}>{conv.name}</div>
                        <div style={s.panelMeta}>{conv.phone || "+55 11 9 ····-····"}</div>
                      </div>
                    </div>
                    <div style={s.fields}>
                      {[
                        ["Conta de luz", conv.bill ? `R$ ${conv.bill}/mês` : "·"],
                        ["Imóvel", conv.property || "·"],
                        ["CEP", conv.cep || "·"],
                        ["Origem", conv.source || "·"],
                        ["Score IA", conv.score ? <span style={{ color: "#119663", fontWeight: 700 }}>{conv.score}</span> : "·"],
                      ].map(([label, value]) => (
                        <div key={label} style={s.field}>
                          <span style={s.fieldLabel}>{label}</span>
                          <span style={s.fieldValue}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={s.panelSection}>
                    <div style={s.panelLabel}>Próxima ação</div>
                    <div style={s.actionCard}>
                      <div style={s.actionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0218" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--night-900)" }}>Visita técnica</div>
                        <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 1 }}>Amanhã · 14:00 · Rafael Mendes</div>
                      </div>
                    </div>
                    <button style={s.reagendar}>Reagendar</button>
                  </div>
                  <div style={s.panelSection}>
                    <div style={s.panelLabel}>Histórico</div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        ["#A89878", "Lead chegou", "14:02 · campanha Facebook"],
                        ["#34E5A1", "Vendedor IA iniciou conversa", "14:02 · resposta em 4s"],
                        ["#9B32F1", "Lead qualificado A", "14:03 · conta R$ 480, casa própria"],
                        ["#A95BF4", "Visita agendada", "14:04 · amanhã 14h"],
                      ].map(([color, title, meta]) => (
                        <li key={title} style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--fg-1)" }}>
                          <span style={{ width: 8, height: 8, borderRadius: 999, background: color, flexShrink: 0, marginTop: 4 }} />
                          <div><strong>{title}</strong><div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 1 }}>{meta}</div></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={s.footnote}>Produto real · Dados simulados para demonstração</p>
      </div>
    </section>
  );
};

const statVariants = {
  light: { background: "white", border: "1px solid var(--border-1)", color: "var(--night-900)" },
  brand: { background: "linear-gradient(135deg,#BD8AF7,#9B32F1)", color: "var(--night-900)" },
  dark:  { background: "linear-gradient(180deg,#131B33 0%,#0D0218 100%)", color: "white" },
};

const s = {
  section: { padding: "80px 24px", background: "var(--sand-100)" },
  head: { textAlign: "center", maxWidth: 640, margin: "0 auto 48px" },
  label: { fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--brand-600)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 },
  h2: { fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--night-900)", margin: "0 0 12px" },
  sub: { fontSize: 16, color: "var(--fg-2)", lineHeight: 1.6, margin: 0 },

  sidebar: { background: "linear-gradient(180deg,#131B33 0%,#0D0218 60%,#0A1228 100%)", display: "flex", flexDirection: "column", padding: "18px 0", borderRight: "1px solid rgba(255,255,255,0.05)" },
  sidebarBrand: { padding: "0 18px 18px" },
  personaCard: { margin: "0 14px 18px", padding: 12, borderRadius: 12, background: "rgba(255,176,32,0.08)", border: "1px solid rgba(155,50,241,0.18)" },
  personaTop: { display: "flex", gap: 8, alignItems: "center", marginBottom: 10 },
  personaAvWrap: { position: "relative" },
  personaAv: { width: 34, height: 34, borderRadius: 999, background: "linear-gradient(135deg,#BD8AF7,#A95BF4)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  onlineDot: { position: "absolute", right: -1, bottom: -1, width: 10, height: 10, borderRadius: 999, background: "#34E5A1", border: "2px solid #0D0218", display: "block" },
  personaName: { fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "#FBF7EE" },
  personaRole: { fontSize: 10, color: "#B5BCCE", marginTop: 1 },
  personaStats: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "#B5BCCE" },
  nav: { padding: "0 10px", flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, color: "#B5BCCE", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  navActive: { background: "rgba(155,50,241,0.12)", color: "#9B32F1" },
  navLabel: { flex: 1 },
  navCount: { fontSize: 10, fontWeight: 600, background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 999, fontFamily: "var(--font-mono)", color: "#B5BCCE" },
  sidebarFooter: { padding: "12px 14px 0", borderTop: "1px solid rgba(255,255,255,0.06)" },
  userRow: { display: "flex", gap: 8, alignItems: "center" },
  userAv: { width: 28, height: 28, borderRadius: 999, color: "white", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  topbar: { display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: "1px solid var(--border-1)", background: "var(--bg-canvas)" },
  topbarTitle: { fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--night-900)", lineHeight: 1.1 },
  topbarSub: { fontSize: 12, color: "var(--fg-2)", marginTop: 1 },
  searchBar: { flex: 1, maxWidth: 380, marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid var(--border-1)", borderRadius: 10, padding: "7px 12px" },
  kbd: { fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-mono)", background: "var(--sand-100)", padding: "1px 5px", borderRadius: 4 },
  iconBtn: { position: "relative", width: 36, height: 36, borderRadius: 8, background: "white", border: "1px solid var(--border-1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--fg-1)", flexShrink: 0 },
  notifDot: { position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 999, background: "#A95BF4", border: "2px solid white" },
  primaryBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "linear-gradient(180deg,#BD8AF7 0%,#9B32F1 55%,#8C1EDB 100%)", color: "var(--night-900)", border: "none", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, padding: "14px 20px 0" },
  statTile: { padding: "14px 16px", borderRadius: 12, display: "flex", flexDirection: "column", gap: 4 },
  statLabel: { fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.75 },
  statValue: { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1 },
  statDelta: { fontSize: 11, fontWeight: 600 },

  list: { width: 260, background: "white", borderRight: "1px solid var(--border-1)", display: "flex", flexDirection: "column", flexShrink: 0 },
  listHead: { padding: "12px 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-2)" },
  listTitle: { fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "var(--night-900)" },
  liveBadge: { fontSize: 10, color: "#119663", fontWeight: 600, background: "#E6FBF3", padding: "2px 8px", borderRadius: 999, display: "flex", alignItems: "center" },
  listTabs: { display: "flex", borderBottom: "1px solid var(--border-2)", padding: "0 8px" },
  listTab: { padding: "8px 8px", fontSize: 11, color: "var(--fg-2)", fontWeight: 500, cursor: "pointer", borderBottom: "2px solid transparent" },
  listTabActive: { color: "var(--night-900)", borderBottomColor: "var(--brand-400)" },
  listScroll: { flex: 1, overflowY: "auto", padding: 6 },

  av: { width: 36, height: 36, borderRadius: 999, color: "white", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  convName: { fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "var(--night-900)" },
  convTime: { fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-mono)" },
  convPreview: { fontSize: 11, color: "var(--fg-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 },
  metaLive: { fontSize: 9, color: "#119663", fontWeight: 600, background: "#E6FBF3", padding: "1px 6px", borderRadius: 999 },
  metaTemp: { fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 999 },
  metaBill: { fontSize: 9, color: "var(--fg-3)", fontFamily: "var(--font-mono)" },
  unread: { background: "var(--brand-400)", color: "var(--night-900)", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 999, alignSelf: "center", flexShrink: 0 },

  detail: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  detailHead: { padding: "12px 16px", borderBottom: "1px solid var(--border-1)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  detailName: { fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--night-900)", letterSpacing: "-0.01em" },
  iconBtnSm: { width: 28, height: 28, borderRadius: 7, background: "var(--sand-100)", border: "none", color: "var(--fg-1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },

  transcript: { flex: 1, overflowY: "auto", padding: "14px 16px", background: "var(--sand-50)", display: "flex", flexDirection: "column", gap: 2 },
  bubbleWho: { fontSize: 9, color: "var(--fg-3)", fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 },
  bubbleIn: { background: "linear-gradient(180deg,#FFE082,#BD8AF7)", borderRadius: 12, borderBottomRightRadius: 3, padding: "8px 11px 16px", fontSize: 12, lineHeight: 1.4, color: "var(--night-900)", maxWidth: "78%", position: "relative" },
  bubbleOut: { background: "white", borderRadius: 12, borderBottomLeftRadius: 3, padding: "8px 11px 16px", fontSize: 12, lineHeight: 1.4, color: "var(--fg-1)", maxWidth: "78%", position: "relative", boxShadow: "0 1px 2px rgba(14,23,48,0.06)" },
  bubbleTime: { position: "absolute", right: 7, bottom: 3, fontSize: 9, color: "rgba(14,23,48,0.35)", fontFamily: "var(--font-mono)" },

  composer: { padding: "8px 12px", borderTop: "1px solid var(--border-1)", background: "white", display: "flex", alignItems: "center", gap: 6 },
  composerBtn: { width: 30, height: 30, borderRadius: "50%", border: "none", background: "transparent", color: "var(--fg-2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  composerWrap: { flex: 1, display: "flex", alignItems: "center", background: "var(--sand-50)", border: "1.5px solid var(--border-1)", borderRadius: 20, paddingLeft: 12, paddingRight: 4 },
  composerInput: { flex: 1, background: "transparent", border: "none", padding: "7px 0", fontSize: 12, color: "var(--fg-1)", fontFamily: "var(--font-body)", outline: "none" },
  composerEmoji: { width: 26, height: 26, borderRadius: "50%", border: "none", background: "transparent", color: "var(--fg-2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },

  panel: { width: 240, background: "var(--sand-50)", borderLeft: "1px solid var(--border-1)", padding: "16px 16px 20px", overflowY: "auto", flexShrink: 0 },
  panelSection: { marginBottom: 22 },
  panelLabel: { fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 10 },
  panelName: { fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--night-900)", letterSpacing: "-0.01em" },
  panelMeta: { fontSize: 11, color: "var(--fg-2)", marginTop: 1, fontFamily: "var(--font-mono)" },
  fields: { background: "white", borderRadius: 10, border: "1px solid var(--border-1)", padding: "2px 12px" },
  field: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-2)", fontSize: 11 },
  fieldLabel: { color: "var(--fg-2)" },
  fieldValue: { color: "var(--fg-1)", fontWeight: 500 },
  actionCard: { display: "flex", gap: 10, alignItems: "center", background: "white", border: "1px solid var(--border-1)", borderRadius: 10, padding: 12, marginBottom: 8 },
  actionIcon: { width: 34, height: 34, borderRadius: 8, background: "var(--brand-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  reagendar: { width: "100%", padding: "7px 10px", borderRadius: 8, background: "transparent", border: "1px solid var(--sand-300)", color: "var(--night-900)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, cursor: "pointer" },

  footnote: { textAlign: "center", fontSize: 12, color: "var(--fg-3)", marginTop: 20 },
};

export default DashboardPreview;
