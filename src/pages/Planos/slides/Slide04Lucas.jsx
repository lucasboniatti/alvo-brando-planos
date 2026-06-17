import lucasImg from '../../../assets/lucas.png';

const Slide04Lucas = ({ step = 0 }) => {
  const showNome     = step >= 1;
  const showDetalhes = step >= 2;

  return (
    <div className="slide-base dark" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        gap: 56, maxWidth: 860, width: '100%', margin: '0 auto',
      }}>
        <div style={{
          flexShrink: 0, width: 300, height: 380, borderRadius: 24, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>
          <img src={lucasImg} alt="Lucas Boniatti" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Step 1 — label + nome */}
          <div style={{
            opacity: showNome ? 1 : 0,
            transform: showNome ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div className="slide-label" style={{ marginBottom: 6 }}>Estrategista de performance</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.05 }}>
              Lucas Boniatti
            </div>
          </div>

          {/* Step 2 — bullets + citação */}
          <div style={{
            opacity: showDetalhes ? 1 : 0,
            transform: showDetalhes ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {['+6 anos de experiência com tráfego pago', 'Implementou IA em +140 negócios'].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-400)', flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>{s}</span>
                </div>
              ))}
            </div>
            <blockquote style={{
              fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.45)',
              borderLeft: '2px solid var(--brand-400)', paddingLeft: 16, margin: 0, lineHeight: 1.6,
            }}>
              "Sucesso do marketing = vendas realizadas<br />e meta batida."
            </blockquote>
          </div>

        </div>
      </div>
    </div>
  );
};

Slide04Lucas.steps = 2;

export default Slide04Lucas;
