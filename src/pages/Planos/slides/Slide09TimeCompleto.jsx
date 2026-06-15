const ROLES = [
  { n: 1,  label: 'Estrategista',         icon: 'target'    },
  { n: 2,  label: 'Gestor de Tráfego',    icon: 'rocket'    },
  { n: 3,  label: 'Copywriter',           icon: 'pen'       },
  { n: 4,  label: 'Social Media',         icon: 'grid'      },
  { n: 5,  label: 'Designer',             icon: 'brush'     },
  { n: 6,  label: 'Editor de Vídeos',     icon: 'film'      },
  { n: 7,  label: 'Dev Web',              icon: 'code'      },
  { n: 8,  label: 'Automações',           icon: 'zap'       },
  { n: 9,  label: 'Especialista em IA',   icon: 'cpu'       },
  { n: 10, label: 'Consultor Comercial',  icon: 'dollar'    },
  { n: 11, label: 'Redator de SEO',       icon: 'search'    },
  { n: 12, label: 'Sucesso do Cliente',   icon: 'heart'     },
];

const ICONS = {
  target:  <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  rocket:  <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></>,
  pen:     <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  grid:    <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
  brush:   <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
  film:    <><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></>,
  code:    <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
  zap:     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  cpu:     <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
  dollar:  <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  search:  <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  heart:   <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
};

const Icon = ({ name }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="var(--brand-400)" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round">
    {ICONS[name]}
  </svg>
);

const Slide09TimeCompleto = ({ step = 0 }) => (
  <div className="slide-base dark" style={{ textAlign: 'center' }}>
    <div className="slide-inner wide">
      <div className="slide-label">Time completo</div>
      <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 8 }}>
        <span style={{ color: 'var(--brand-400)' }}>12 especialistas</span> em marketing,<br />vendas e tecnologia
      </h2>
      <p className="slide-body" style={{ marginBottom: 28, color: '#fff' }}>
        Pelo preço de <span style={{ color: '#fff', fontWeight: 600 }}>1 funcionário CLT</span>
      </p>
      <div className="slide09-grid">
        {ROLES.map((r, i) => {
          const isAtual = i === step - 1;
          return (
            <div key={r.n} className={`slide09-role slide-step-item${i < step ? ' visible' : ''}`} style={isAtual ? { border: '1px solid rgba(155,50,241,0.55)', boxShadow: '0 0 8px rgba(155,50,241,0.12)' } : {}}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
                  {String(r.n).padStart(2, '0')}
                </span>
                <Icon name={r.icon} />
              </div>
              <div>{r.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

Slide09TimeCompleto.steps = ROLES.length;

export default Slide09TimeCompleto;
