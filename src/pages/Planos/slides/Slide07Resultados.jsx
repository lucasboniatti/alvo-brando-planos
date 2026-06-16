import logoOrtodoctor from '../../../assets/logo-ortodoctor.png';
import logoGetpower from '../../../assets/logo-getpower.png';
import logoSolaria from '../../../assets/logo-solaria.png';
import logoSegenergy from '../../../assets/logo-segenergy.png';
import logoSolarprime from '../../../assets/logo-solarprime.png';
import logoKinsol from '../../../assets/logo-kinsol.png';
import logoDeyson from '../../../assets/logo-deysonpontes.png';
import logoConstrutec from '../../../assets/logo-construtec.png';

const LOGOS = [
  { src: logoKinsol,     alt: 'Kinsol WEG',   h: 32 },
  { src: logoOrtodoctor, alt: 'Ortodoctor',    h: 32 },
  { src: logoGetpower,   alt: 'GetPower',      h: 28 },
  { src: logoSolarprime, alt: 'SolarPrime',    h: 32 },
  { src: logoSegenergy,  alt: 'SegEnergy',     h: 28 },
  { src: logoDeyson,     alt: 'Deyson Pontes', h: 36 },
  { src: logoSolaria,    alt: 'Solar.ia',      h: 32 },
  { src: logoConstrutec, alt: 'Construtec',    h: 34 },
];

const stepStyle = (i, step) => ({
  opacity: i < step ? 1 : 0,
  transform: i < step ? 'translateY(0)' : 'translateY(14px)',
  transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
  pointerEvents: i < step ? 'auto' : 'none',
});

const Slide07Resultados = ({ step = 0 }) => (
  <div className="slide-base dark" style={{ alignItems: 'stretch', padding: '52px 0 44px' }}>
    <div style={{ display: 'flex', width: '100%', maxWidth: 1000, margin: '0 auto', gap: 0, alignItems: 'center', padding: '0 48px' }}>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 56 }}>
        <div style={stepStyle(0, step)}>
          <div className="slide-label" style={{ marginBottom: 6 }}>Cases de sucesso</div>
          <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 20, textAlign: 'left' }}>
            Alguns dos resultados<br />que já entregamos
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, textAlign: 'left', margin: 0, maxWidth: 420 }}>
            O que essas empresas têm em comum? Usando a nossa solução, conseguiram otimizar investimentos, impulsionar o crescimento e garantir mais previsibilidade nas vendas.
          </p>
        </div>
      </div>

      <div style={{ flexShrink: 0, width: 380 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px 56px' }}>
          {LOGOS.map((l, i) => (
            <div key={l.alt} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-start', minHeight: 56,
              opacity: (i + 1) < step ? 1 : 0,
              transform: (i + 1) < step ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.38s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms, transform 0.38s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms`,
            }}>
              <img src={l.src} alt={l.alt} style={{ height: l.h + 46, maxWidth: 160, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.75 }} />
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

Slide07Resultados.steps = 9;

export default Slide07Resultados;
