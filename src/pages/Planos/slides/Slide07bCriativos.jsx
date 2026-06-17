import c1 from '../../../assets/criativos/1.webp';
import c2 from '../../../assets/criativos/2.webp';
import c3 from '../../../assets/criativos/3.webp';
import c4 from '../../../assets/criativos/4.webp';
import c5 from '../../../assets/criativos/5.webp';
import c6 from '../../../assets/criativos/6.webp';
import c7 from '../../../assets/criativos/7.webp';
import c8 from '../../../assets/criativos/8.webp';
import c9 from '../../../assets/criativos/9.webp';
import c10 from '../../../assets/criativos/10.webp';

const CRIATIVOS = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];

// step vem do player: 0..9 mapeia direto para o índice da imagem
const Slide07bCriativos = ({ step = 0 }) => {
  const atual = Math.min(step, CRIATIVOS.length - 1);
  const prev  = (atual - 1 + CRIATIVOS.length) % CRIATIVOS.length;
  const next  = (atual + 1) % CRIATIVOS.length;

  return (
    <div className="slide-base dark" style={{ overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        padding: '18px 0 16px',
        boxSizing: 'border-box',
        gap: 0,
      }}>

        {/* Cabeçalho compacto */}
        <div style={{ textAlign: 'center', marginBottom: 14, flexShrink: 0 }}>
          <div className="slide-label" style={{ marginBottom: 4 }}>Portfólio</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            lineHeight: 1.2,
          }}>
            Criativos que{' '}
            <span className="slide-brand">converteram</span>
          </h2>
        </div>

        {/* Área do carrossel */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          flex: 1,
          minHeight: 0,
        }}>

          {/* Fantasma esquerdo (prévia) */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-340px)',
            zIndex: 1,
            opacity: 0.18,
            filter: 'blur(1px)',
            pointerEvents: 'none',
          }}>
            <img
              src={CRIATIVOS[prev]}
              alt=""
              style={{ height: 320, width: 'auto', borderRadius: 12, display: 'block' }}
            />
          </div>

          {/* Imagem principal */}
          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 28px 72px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.07)',
              transition: 'opacity 0.12s ease, transform 0.12s ease',
            }}>
              <img
                key={atual}
                src={CRIATIVOS[atual]}
                alt={`Criativo ${atual + 1}`}
                style={{
                  height: 'min(460px, calc(100vh - 180px))',
                  width: 'auto',
                  maxWidth: '90vw',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Fantasma direito (próximo) */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(100px)',
            zIndex: 1,
            opacity: 0.18,
            filter: 'blur(1px)',
            pointerEvents: 'none',
          }}>
            <img
              src={CRIATIVOS[next]}
              alt=""
              style={{ height: 320, width: 'auto', borderRadius: 12, display: 'block' }}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

Slide07bCriativos.steps = CRIATIVOS.length - 1;
// ↑ pula direto pro próximo slide sem percorrer todos os criativos
Slide07bCriativos.skipFastSteps = true;

export default Slide07bCriativos;
