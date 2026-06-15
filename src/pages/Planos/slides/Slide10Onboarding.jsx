const STEPS = [
  { n: '01', label: 'Reunião de briefing e análise' },
  { n: '02', label: 'Estudo de concorrentes e referências' },
  { n: '03', label: 'Estratégia de marketing e vendas' },
  { n: '04', label: 'Configuração de ferramentas' },
  { n: '05', label: 'Otimização de redes sociais' },
  { n: '06', label: 'Implementação de funil de vendas' },
];

const Slide10Onboarding = ({ step = 0 }) => (
  <div className="slide-base dark" style={{ alignItems: 'stretch', padding: '52px 0 44px' }}>
    <div style={{ display: 'flex', width: '100%', maxWidth: 1000, margin: '0 auto', gap: 0, alignItems: 'stretch', padding: '0 48px' }}>

      {/* Lado esquerdo — conteúdo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 56 }}>
        <div className="slide-label" style={{ marginBottom: 6 }}>Processo de trabalho — Fase 1</div>
        <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 8, fontSize: 'clamp(26px, 3.5vw, 44px)' }}>
          Onboarding<br /><span style={{ color: 'var(--brand-400)' }}>Personalizado</span>
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 32, lineHeight: 1.5 }}>
          Nas primeiras semanas, mergulhamos fundo no seu negócio para construir a base de tudo.
        </p>

        {/* Timeline */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Linha vertical */}
          <div style={{ position: 'absolute', left: 15, top: 12, bottom: 12, width: 1, background: 'rgba(155,50,241,0.2)' }} />
          {STEPS.map((s, i) => (
            <div key={s.n} className={`slide-step-item${i < step ? ' visible' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '7px 0', position: 'relative' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(155,50,241,0.12)',
                border: '1.5px solid rgba(155,50,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                color: 'var(--brand-400)', zIndex: 1,
              }}>{s.n}</div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lado direito — visual */}
      <div style={{
        width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        {/* Círculo de progresso SVG */}
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Fundo */}
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            {/* Progresso — ~75% do círculo */}
            <circle cx="100" cy="100" r="80" fill="none"
              stroke="url(#grad-ring)" strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="377"
              strokeDashoffset="94"
              transform="rotate(-90 100 100)"
            />
            <defs>
              <linearGradient id="grad-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BD8AF7" />
                <stop offset="100%" stopColor="#9B32F1" />
              </linearGradient>
            </defs>
          </svg>
          {/* Centro */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="var(--brand-400)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1, marginTop: 6 }}>2</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>semanas</div>
          </div>
        </div>

        {/* Chips de entregáveis */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          {['Briefing', 'Estratégia', 'Funil', 'Ferramentas'].map(tag => (
            <div key={tag} style={{
              fontSize: 11, fontWeight: 600, color: 'var(--brand-400)',
              border: '1px solid rgba(155,50,241,0.3)', borderRadius: 999,
              padding: '4px 12px', background: 'rgba(155,50,241,0.08)',
            }}>{tag}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

Slide10Onboarding.steps = STEPS.length;

export default Slide10Onboarding;
