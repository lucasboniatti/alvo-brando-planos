import heroTeam from '../../../assets/hero-team.webp';

const Star = ({ id }) => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    </defs>
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill={`url(#${id})`}
      stroke="#FCD34D"
      strokeWidth="0.5"
    />
  </svg>
);

const Stars = () => (
  <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
    {[0,1,2,3,4].map(i => <Star key={i} id={`star-grad-${i}`} />)}
  </div>
);

const stepStyle = (i, step) => ({
  opacity: i < step ? 1 : 0,
  transform: i < step ? 'translateY(0)' : 'translateY(14px)',
  transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
  pointerEvents: i < step ? 'auto' : 'none',
});

const Slide13NPS = ({ step = 0 }) => (
  <div style={s.slide}>
    <style>{`
      .nps-photo-col {
        position: absolute;
        top: 0; right: 0; bottom: 0;
        left: 30%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
      }
      .nps-photo-col img {
        position: absolute;
        top: 0; left: 0; right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: left top;
      }
      .nps-fade-left {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to right,
          var(--night-50) 0%,
          rgba(248,244,251,0.92) 12%,
          rgba(248,244,251,0.6) 26%,
          rgba(248,244,251,0.1) 38%,
          rgba(248,244,251,0.0) 48%
        );
        z-index: 1;
      }
      .nps-fade-top {
        position: absolute;
        top: 0; left: 0; right: 0; height: 40px;
        background: linear-gradient(to bottom, var(--night-50) 0%, rgba(248,244,251,0) 100%);
        z-index: 1;
      }
      .nps-fade-bottom {
        position: absolute;
        bottom: 0; left: 0; right: 0; height: 80px;
        background: linear-gradient(to top, var(--night-50) 0%, rgba(248,244,251,0) 100%);
        z-index: 1;
      }
      .nps-copy {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 500px;
        padding: 0 0 0 64px;
      }
    `}</style>

    <div className="nps-photo-col">
      <img src={heroTeam} alt="Equipe Alvo Brando" draggable={false} />
      <div className="nps-fade-left" />
      <div className="nps-fade-top" />
    </div>

    <div className="nps-copy">
      <div style={s.label}>Excelência reconhecida</div>
      <div>
        <Stars />
        <div style={s.nps}>97,2</div>
        <div style={s.title}>Nosso NPS</div>
      </div>
      <p style={{ ...s.body, ...stepStyle(0, step) }}>
        Esse índice reflete o alto nível de satisfação dos nossos clientes — que além de
        aprovarem nosso trabalho, recomendam para outras empresas.
      </p>
      <div style={{ display: 'flex', gap: 24, marginTop: 28, ...stepStyle(0, step) }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--brand-500)', letterSpacing: '-0.02em' }}>+180</div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>clientes atendidos</div>
        </div>
        <div style={{ width: 1, background: 'var(--border-1)' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--brand-500)', letterSpacing: '-0.02em' }}>98%</div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>taxa de retenção</div>
        </div>
      </div>
    </div>
  </div>
);

const s = {
  slide: {
    height: '100vh',
    background: 'var(--night-50)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'var(--font-display)',
    fontSize: 11, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'var(--brand-600)', marginBottom: 16,
  },
  nps: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(80px, 11vw, 130px)',
    fontWeight: 800, color: 'var(--brand-400)',
    lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 4,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 28, fontWeight: 600,
    color: 'var(--night-900)', letterSpacing: '-0.02em', marginBottom: 16,
  },
  body: {
    fontSize: 15, lineHeight: 1.65,
    color: 'var(--fg-2)', maxWidth: 400,
  },
};

Slide13NPS.steps = 1;

export default Slide13NPS;
