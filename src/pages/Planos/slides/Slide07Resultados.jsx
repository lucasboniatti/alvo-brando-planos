import logoOrtodoctor from '../../../assets/logo-ortodoctor.png';
import logoGetpower from '../../../assets/logo-getpower.png';
import logoSolaria from '../../../assets/logo-solaria.png';
import logoSegenergy from '../../../assets/logo-segenergy.png';
import logoSolarprime from '../../../assets/logo-solarprime.png';
import logoKinsol from '../../../assets/logo-kinsol.png';
import logoDeyson from '../../../assets/logo-deysonpontes.png';
import logoConstrutec from '../../../assets/logo-construtec.png';

const LOGOS_TOP = [
  { src: logoSolarprime, alt: 'SolarPrime' },
  { src: logoOrtodoctor, alt: 'Ortodoctor' },
  { src: logoSolaria,    alt: 'Solar.ia'   },
  { src: logoKinsol,     alt: 'Kinsol WEG' },
];

const LOGOS_BOTTOM = [
  { src: logoSegenergy,  alt: 'SegEnergy',    h: 36, filter: true  },
  { src: logoDeyson,     alt: 'Deyson Pontes', h: 48, filter: true  },
  { src: logoGetpower,   alt: 'GetPower',     h: 36, filter: true  },
  { src: logoConstrutec, alt: 'Construtec',   h: 44, filter: false },
];

const Slide07Resultados = () => (
  <div className="slide-base dark" style={{ textAlign: 'center' }}>
    <div className="slide-inner">
      <div className="slide-label">Cases de sucesso</div>
      <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 24 }}>
        Alguns dos resultados<br />que já entregamos
      </h2>
      <p className="slide07-intro">
        O que essas empresas têm em comum? Usando a nossa solução, conseguiram otimizar
        investimentos, impulsionar o crescimento, automatizar processos e garantir mais
        previsibilidade nas vendas.
      </p>
      <div className="slide07-logos">
        {LOGOS_TOP.map(l => (
          <div key={l.alt} className="slide07-logo-chip">
            <img src={l.src} alt={l.alt} style={{ height: 36, maxWidth: 120, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
          </div>
        ))}
      </div>
      <div className="slide07-logos slide07-logos-bottom">
        {LOGOS_BOTTOM.map(l => (
          <div key={l.alt} className="slide07-logo-chip">
            <img src={l.src} alt={l.alt} style={{ height: l.h, maxWidth: 130, objectFit: 'contain', filter: l.filter ? 'brightness(0) invert(1)' : 'none', opacity: 0.9 }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Slide07Resultados;
