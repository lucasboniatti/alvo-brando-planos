const ITEMS = [
  { label: 'Otimização diária de campanhas',   icon: 'zap'     },
  { label: 'Relatório semanal de performance', icon: 'bar'     },
  { label: 'Reunião de consultoria mensal',    icon: 'users'   },
  { label: 'Suporte dedicado no WhatsApp',     icon: 'chat'    },
  { label: 'Produção ativa de anúncios',       icon: 'play'    },
  { label: 'Otimização do comercial e IA',     icon: 'cpu'     },
];

const ICONS = {
  zap:   <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  bar:   <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  chat:  <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  play:  <><polygon points="5 3 19 12 5 21 5 3"/></>,
  cpu:   <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
};

const IcoSvg = ({ name }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="var(--brand-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {ICONS[name]}
  </svg>
);

const METRICS = [
  { value: '+23%',  label: 'CPL reduzido' },
  { value: '4.2×',  label: 'ROAS médio'   },
  { value: '98%',  label: 'Satisfação'    },
];

const Slide10bGestao = ({ step = 0 }) => (
  <div className="slide-base dark" style={{ alignItems: 'stretch', padding: '52px 0 44px' }}>
    <div style={{ display: 'flex', width: '100%', maxWidth: 1000, margin: '0 auto', gap: 0, alignItems: 'stretch', padding: '0 48px' }}>

      {/* Lado esquerdo — conteúdo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 56 }}>
        <div className="slide-label" style={{ marginBottom: 6 }}>Processo de trabalho — Fase 2</div>
        <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 8, fontSize: 'clamp(26px, 3.5vw, 44px)' }}>
          Gestão<br /><span style={{ color: 'var(--brand-400)' }}>Estratégica</span>
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 32, lineHeight: 1.5 }}>
          Após o onboarding, nossa equipe atua todos os dias para escalar seus resultados.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ITEMS.map((it, i) => (
            <div key={it.label} className={`slide-step-item${i < step ? ' visible' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: 'rgba(155,50,241,0.12)',
                border: '1px solid rgba(155,50,241,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IcoSvg name={it.icon} />
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{it.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lado direito — dashboard fake */}
      <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>

        {/* Métricas */}
        {METRICS.map(m => (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--brand-400)', letterSpacing: '-0.02em' }}>{m.value}</span>
          </div>
        ))}

        {/* Mini gráfico de barras decorativo */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '16px 20px',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>PERFORMANCE SEMANAL</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 48 }}>
            {[35, 55, 42, 70, 60, 85, 78].map((h, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: 4,
                height: `${h}%`,
                background: i === 5
                  ? 'linear-gradient(180deg, #BD8AF7, #9B32F1)'
                  : 'rgba(155,50,241,0.2)',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {['S','T','Q','Q','S','S','D'].map((d, i) => (
              <span key={i} style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{d}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  </div>
);

Slide10bGestao.steps = ITEMS.length;

export default Slide10bGestao;
