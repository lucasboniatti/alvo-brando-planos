import { Link } from 'react-router-dom';
import amandaPhoto from '../assets/amanda3.webp';
import logoOnDark from '../assets/logo-on-dark.svg';
import { gaCtaClicked } from '../lib/ga';
import { useScrollReveal } from '../hooks/useScrollReveal';

const WA_NUMBER = '5548991122590';
const WA_MSG = encodeURIComponent('Olá! Vim pelo site da Alvo Brando e quero saber mais sobre os serviços.');

const CtaDiagnostico = ({ onCtaClick, onLoginClick }) => {
  const ref = useScrollReveal({ threshold: 0.1 });

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: '#0D0218',
    }}>
      <style>{`
        .cta-diag-photo-wrap {
          position: absolute;
          left: 0; top: 0;
          width: 52%; height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        .cta-diag-photo {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .cta-diag-fade {
          position: absolute;
          left: 0; top: 0;
          width: 65%; height: 100%;
          background: linear-gradient(to right, transparent 45%, #0D0218 72%);
          z-index: 1;
          pointer-events: none;
        }
        .cta-diag-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: flex-end;
        }
        .cta-diag-text {
          text-align: left;
          max-width: 500px;
          padding: 100px 0;
          margin-right: auto;
          margin-left: 48%;
        }
        .cta-diag-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .cta-diag-logo-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .cta-diag-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          color: var(--brand-400);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 20px;
        }
        .cta-diag-badge::before { content: '✦'; }
        .cta-diag-h2 {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #FBF7EE;
          margin: 0 0 16px;
        }
        .cta-diag-sub {
          font-size: 16px;
          color: #8D96AA;
          line-height: 1.65;
          margin-bottom: 36px;
        }
        .cta-diag-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cta-diag-social-btn {
          width: 42px; height: 42px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #ffffff;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
        }
        .cta-diag-social-btn:hover {
          background: rgba(155,50,241,0.18);
          border-color: rgba(155,50,241,0.5);
          color: #BD8AF7;
        }
        .cta-diag-name {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 600;
          color: rgba(247,242,229,0.3);
          margin-top: 20px;
          letter-spacing: 0.02em;
        }
        .cta-diag-socials {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .cta-diag-socials-mobile {
          display: none;
        }
        .cta-diag-socials-desktop {
          display: flex;
        }
        .cta-diag-copyright {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .cta-diag-mobile-banner {
          display: none;
        }

        @media (max-width: 900px) {
          .cta-diag-photo-wrap { display: none; }
          .cta-diag-fade { display: none; }
          .cta-diag-content { justify-content: center; }
          .cta-diag-text { text-align: center; max-width: 100%; padding: 48px 0 40px; margin-left: 0 !important; }
          .cta-diag-logo { justify-content: center; }
          .cta-diag-badge { justify-content: center; }
          .cta-diag-h2 { font-size: 28px; }
          .cta-diag-actions { justify-content: center; flex-direction: column; align-items: center; }
          .cta-diag-socials-mobile { display: flex; gap: 12px; margin-top: 16px; justify-content: center; }
          .cta-diag-socials-desktop { display: none !important; }
          .cta-diag-copyright { position: static; transform: none; white-space: nowrap; flex: 1; text-align: center; }

          .cta-diag-mobile-banner {
            display: block;
            width: calc(100% + 48px);
            margin-left: -24px;
            margin-right: -24px;
            height: 240px;
            position: relative;
            overflow: hidden;
          }
          .cta-diag-mobile-banner img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center top;
            display: block;
          }
          .cta-diag-mobile-banner-fade-bottom {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 100px;
            background: linear-gradient(to bottom, transparent, #0D0218);
            pointer-events: none;
          }
          .cta-diag-mobile-banner-fade-top {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 80px;
            background: linear-gradient(to top, transparent, #0D0218);
            pointer-events: none;
          }
        }
      `}</style>

      <div className="cta-diag-photo-wrap">
        <img src={amandaPhoto} alt="Amanda, estrategista Alvo Brando" className="cta-diag-photo" />
      </div>
      <div className="cta-diag-fade" />

      <div className="cta-diag-content" ref={ref}>
        <div className="cta-diag-text">

          {/* Logo */}
          <div className="cta-diag-logo">
            <img src={logoOnDark} style={{ height: 32 }} alt="Alvo Brando" />
            <span className="cta-diag-logo-name">
              <span style={{ color: '#FBF7EE' }}>alvo</span><span style={{ color: 'var(--brand-400)' }}>brando</span>
            </span>
          </div>

          <h2 className="cta-diag-h2">Vamos achar onde seu funil perde vendas.</h2>

          {/* Banner da Amanda — só mobile */}
          <div className="cta-diag-mobile-banner">
            <img src={amandaPhoto} alt="Amanda, estrategista Alvo Brando" />
            <div className="cta-diag-mobile-banner-fade-top"></div>
            <div className="cta-diag-mobile-banner-fade-bottom"></div>
          </div>

          <p className="cta-diag-sub">Fale com nossa estrategista e identifique o plano de ação ideal para o seu negócio vender mais.</p>

          {/* Botão */}
          <div className="cta-diag-actions">
            <button
              onClick={() => { gaCtaClicked({ origem: 'cta-diagnostico' }); onCtaClick && onCtaClick(); }}
              style={{
                background: 'linear-gradient(180deg,#BD8AF7 0%,#9B32F1 55%,#8C1EDB 100%)',
                color: '#FFFFFF', fontWeight: 600, fontSize: 15,
                padding: '13px 24px', borderRadius: 12, border: 'none',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
                boxShadow: '0 0 0 4px rgba(155,50,241,0.18), 0 8px 32px rgba(155,50,241,0.32), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
              className="btn-shimmer"
            >
              Agendar Diagnóstico Gratuito →
            </button>
          </div>

          {/* Sociais — mobile (abaixo do botão) */}
          <div className="cta-diag-socials cta-diag-socials-mobile">
            <a href="https://www.instagram.com/alvo.brando" target="_blank" rel="noopener noreferrer" className="cta-diag-social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="cta-diag-social-btn" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>

        </div>
      </div>

      {/* Copyright + sociais desktop */}
      <div style={{ position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
          <span className="cta-diag-copyright" style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.35)' }}>
            © 2026 Alvo Brando LTDA &nbsp;&nbsp;·&nbsp;&nbsp; <Link to="/politica-de-privacidade" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', borderBottom: 'none' }}>Política de Privacidade</Link>
          </span>
          <div className="cta-diag-socials cta-diag-socials-desktop">
            <a href="https://www.instagram.com/alvo.brando" target="_blank" rel="noopener noreferrer" className="cta-diag-social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="cta-diag-social-btn" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaDiagnostico;
