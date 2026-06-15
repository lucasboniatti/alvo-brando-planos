import { useEffect, useState } from 'react';

const EVENTS = [
  { icon: 'check', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Lead qualificado', sub: 'Perfil aprovado · decisor confirmado', dot: null },
  { icon: 'user',  color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Novo lead cadastrado', sub: 'Lead via Meta Ads · agora', dot: '#1FCE7C' },
  { icon: 'check', color: '#1FCE7C', bg: 'rgba(31,206,124,0.1)', title: 'Venda fechada', sub: 'Contrato assinado · R$ 12.000', dot: null },
  { icon: 'cal',   color: '#FFB020', bg: 'rgba(255,176,32,0.1)', title: 'Reunião agendada', sub: 'Novo agendamento confirmado', dot: null },
  { icon: 'check', color: '#9B32F1', bg: 'rgba(155,50,241,0.1)', title: 'Lead qualificado', sub: 'Perfil aprovado · decisor confirmado', dot: null },
];

function IconCheck({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IconUser({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function IconCal({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function EventIcon({ type, color }) {
  if (type === 'check') return <IconCheck color={color} />;
  if (type === 'user')  return <IconUser color={color} />;
  if (type === 'cal')   return <IconCal color={color} />;
  return null;
}

function LandingPageMock() {
  return (
    <div style={mock.wrap}>
      {/* Barra de URL */}
      <div style={mock.urlBar}>
        <div style={mock.dots}>
          <span style={{ ...mock.dot, background: '#FF5F57' }}/>
          <span style={{ ...mock.dot, background: '#FEBC2E' }}/>
          <span style={{ ...mock.dot, background: '#28C840' }}/>
        </div>
        <div style={mock.url}>alvobrando.com.br/diagnostico</div>
      </div>
      {/* Conteúdo simulado */}
      <div style={mock.body}>
        <div style={mock.lineGreen}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
          <div style={{ ...mock.line, width: '80%', height: 8 }}/>
          <div style={{ ...mock.line, width: '60%', height: 8 }}/>
          <div style={{ ...mock.line, width: '70%', height: 8 }}/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div style={mock.inputBox}/>
          <div style={mock.inputBox}/>
        </div>
        <div style={mock.btnGreen}>Quero vender mais</div>
      </div>
      {/* Footer do card */}
      <div style={mock.footer}>
        <div>
          <div style={mock.footerTitle}>alvobrando — Diagnóstico gratuito</div>
          <div style={mock.footerSub}>Meta Ads · campanha ativa</div>
        </div>
        <div style={mock.badge}>✓ Conv. 8,4%</div>
      </div>
    </div>
  );
}

const mock = {
  wrap: {
    background: '#fff',
    border: '1px solid var(--border-1)',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
  },
  urlBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderBottom: '1px solid var(--border-1)',
    background: 'var(--bg-canvas)',
  },
  dots: { display: 'flex', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 999, display: 'inline-block' },
  url: {
    flex: 1,
    background: '#fff',
    border: '1px solid var(--border-1)',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--fg-2)',
  },
  body: {
    padding: '20px 18px',
    flex: 1,
  },
  lineGreen: {
    width: '55%',
    height: 10,
    borderRadius: 4,
    background: 'rgba(31,206,124,0.35)',
    marginBottom: 14,
  },
  line: {
    borderRadius: 4,
    background: 'var(--border-1)',
  },
  inputBox: {
    height: 36,
    borderRadius: 8,
    border: '1px solid var(--border-1)',
    background: 'var(--bg-canvas)',
  },
  btnGreen: {
    height: 44,
    borderRadius: 10,
    background: '#1FCE7C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: 14,
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid var(--border-1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 13,
    color: 'var(--night-900)',
  },
  footerSub: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'var(--fg-2)',
    marginTop: 2,
  },
  badge: {
    background: 'rgba(31,206,124,0.12)',
    border: '1px solid rgba(31,206,124,0.3)',
    color: '#0A5C36',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 999,
    whiteSpace: 'nowrap',
  },
};

export default function CRMSection() {
  const [visible, setVisible] = useState(2);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(v => v < EVENTS.length ? v + 1 : v);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="crm" style={s.section}>
      <style>{`
        .crm-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: center;
        }
        @media (max-width: 860px) {
          .crm-cols { grid-template-columns: 1fr; }
          .crm-right { display: none; }
        }
        .crm-event {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid var(--border-1);
          border-radius: 14px;
          box-shadow: var(--shadow-sm);
          animation: crmSlideIn 0.35s cubic-bezier(0.2,0.8,0.2,1) both;
        }
        @keyframes crmSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={s.inner}>
        <div className="crm-cols">
          {/* Esquerda */}
          <div>
            <div style={s.eyebrow}>MARKETING</div>
            <h2 style={s.h2}>Receba diariamente leads altamente qualificados no seu WhatsApp e CRM</h2>
            <div style={s.feed}>
              {EVENTS.slice(0, visible).map((ev, i) => (
                <div key={i} className="crm-event">
                  <div style={{ ...s.iconWrap, background: ev.bg }}>
                    <EventIcon type={ev.icon} color={ev.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={s.eventTitle}>{ev.title}</div>
                    <div style={s.eventSub}>{ev.sub}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={s.agora}>agora</span>
                    {ev.dot && <span style={{ width: 8, height: 8, borderRadius: 999, background: ev.dot, display: 'inline-block' }}/>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direita — landing page mock */}
          <div className="crm-right">
            <LandingPageMock />
          </div>
        </div>
      </div>
    </section>
  );
}

const s = {
  section: {
    padding: '80px 24px',
    background: 'var(--bg-canvas)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  eyebrow: {
    display: 'inline-block',
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--brand-600)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'rgba(155,50,241,0.08)',
    border: '1px solid rgba(155,50,241,0.2)',
    borderRadius: 999,
    padding: '4px 12px',
    marginBottom: 20,
  },
  h2: {
    fontFamily: 'var(--font-display)',
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: '-0.025em',
    lineHeight: 1.1,
    color: 'var(--night-900)',
    margin: '0 0 32px',
    maxWidth: 480,
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--night-900)',
    lineHeight: 1.2,
  },
  eventSub: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'var(--fg-2)',
    marginTop: 2,
  },
  agora: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'var(--fg-2)',
  },
};
