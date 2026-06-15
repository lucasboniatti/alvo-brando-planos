import amandaImg from '../../../assets/amanda2.webp';

const Slide03Amanda = () => (
  <div className="slide-base dark" style={{ justifyContent: 'center', alignItems: 'center' }}>
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      gap: 56, maxWidth: 860, width: '100%', margin: '0 auto',
    }}>
      {/* Foto grande */}
      <div style={{ flexShrink: 0, width: 300, height: 380, borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
        <img src={amandaImg} alt="Amanda Boch" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="slide-label" style={{ marginBottom: 6 }}>Estrategista de posicionamento</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.05 }}>Amanda Boch</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {['+2.000 criativos produzidos', 'Especialista em anúncios de alta conversão'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-400)', flexShrink: 0 }} />
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>{s}</span>
            </div>
          ))}
        </div>
        <blockquote style={{ fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', borderLeft: '2px solid var(--brand-400)', paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
          "Rede social serve para atrair e converter clientes,<br />post bonito não vende!"
        </blockquote>
      </div>
    </div>
  </div>
);

export default Slide03Amanda;
