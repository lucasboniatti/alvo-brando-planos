import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.svg';
import { gaCtaClicked, gaNavLinkClicked } from '../lib/ga';

const Nav = ({ onCtaClick, onLoginClick }) => {
  const [scroll, setScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScroll(Math.min(window.scrollY / 280, 1));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        @keyframes navEnter {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-links { display: flex; gap: 28px; position: absolute; left: 50%; transform: translateX(-50%); }
        .nav-links a { transition: color 0.2s ease !important; }
        .nav-links a:hover { color: var(--brand-700) !important; }
        .nav-cta-wrap { margin-left: auto; display: flex; align-items: center; gap: 16px; }
        .nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; color: var(--night-900); }
        .nav-mobile-menu { display: none; }
        .nav-login-btn { transition: color 0.15s; }
        .nav-login-btn:hover { color: var(--night-900) !important; }

        @media (max-width: 1024px) {
          .nav-links { display: none; }
          .nav-cta-wrap { display: flex; }
          .nav-hamburger { display: flex; align-items: center; margin-left: 12px; }
          .nav-mobile-menu {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: calc(100% + 8px);
            left: 16px;
            right: 16px;
            background: rgba(255,255,255,0.82);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(209,198,175,0.4);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(14,23,48,0.1), 0 2px 8px rgba(14,23,48,0.05);
            padding: 8px;
            z-index: 100;
            animation: dropIn 0.18s cubic-bezier(0.2,0.7,0.2,1);
          }
          @keyframes dropIn {
            from { opacity: 0; transform: translateY(-10px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .nav-mobile-menu a {
            padding: 12px 16px;
            font-size: 15px;
            font-weight: 500;
            color: var(--fg-1);
            border-bottom: none;
            border-radius: 10px;
            font-family: var(--font-body);
            display: flex;
            align-items: center;
            transition: background 0.15s, color 0.15s;
            cursor: pointer;
            text-decoration: none;
          }
          .nav-mobile-menu a:hover,
          .nav-mobile-menu a:focus { background: var(--sand-150); color: var(--night-900); outline: none; }
          .nav-mobile-menu a:active { background: var(--sand-200); color: var(--night-900); transform: scale(0.97); outline: none; }
          .nav-mobile-divider {
            height: 1px;
            background: var(--border-1);
            margin: 6px 8px;
          }
          .nav-mobile-actions {
            display: flex;
            flex-direction: row;
            gap: 8px;
            padding: 6px 8px 8px;
          }
          .nav-mobile-cta {
            background: linear-gradient(180deg,#BD8AF7 0%,#9B32F1 55%,#8C1EDB 100%);
            color: #FFFFFF;
            font-weight: 600;
            font-size: 15px;
            padding: 13px 20px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            font-family: var(--font-body);
            width: fit-content;
            box-shadow: 0 1px 2px rgba(38,6,70,0.12), inset 0 1px 0 rgba(255,255,255,0.35);
          }
          .nav-mobile-login {
            background: transparent;
            border: 1.5px solid var(--border-1);
            border-bottom: 1.5px solid var(--border-1);
            color: var(--fg-2);
            font-weight: 500;
            font-size: 14px;
            padding: 11px 20px;
            border-radius: 12px;
            cursor: pointer;
            font-family: var(--font-body);
            width: fit-content;
            text-decoration: none;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .nav-mobile-divider { display: none; }
          .nav-mobile-actions { display: none; }
          .nav-mobile-menu { left: auto; right: 16px; width: 50%; }
        }
        @media (max-width: 768px) {
          .nav-cta-wrap { display: none; }
          .nav-hamburger { margin-left: auto; }
        }
      `}</style>
      <nav ref={navRef} style={{
        ...navStyles.bar,
        background: menuOpen ? 'var(--bg-canvas)' : `rgba(248,244,251,${scroll * 0.88})`,
        borderBottomColor: menuOpen ? 'var(--border-2)' : `rgba(213,179,251,${scroll * 0.45})`,
        backdropFilter: scroll > 0 ? `blur(${scroll * 16}px) saturate(${1 + scroll * 0.4})` : 'none',
        WebkitBackdropFilter: scroll > 0 ? `blur(${scroll * 16}px) saturate(${1 + scroll * 0.4})` : 'none',
      }}>
        <div style={navStyles.inner}>
          <a href="#" style={navStyles.brandLink}>
            <img src={logo} style={{ height: 36, width: 36 }} alt="Alvo Brando" />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em", marginLeft: 10 }}>
              <span style={{ color: "var(--fg-1)" }}>alvo</span><span style={{ color: "var(--brand-400)" }}>brando</span>
            </span>
          </a>
          <div className="nav-links">
            <a href="#marketing" style={navStyles.link} onClick={() => gaNavLinkClicked({ destino: 'marketing' })}>Marketing</a>
            <a href="#why" style={navStyles.link} onClick={() => gaNavLinkClicked({ destino: 'why' })}>Vendas</a>
            <a href="#diferenciais" style={navStyles.link} onClick={() => gaNavLinkClicked({ destino: 'diferenciais' })}>Diferenciais</a>
            <a href="#garantia" style={navStyles.link} onClick={() => gaNavLinkClicked({ destino: 'garantia' })}>Garantia</a>
          </div>
          <div className="nav-cta-wrap">
            <button onClick={() => { gaCtaClicked({ origem: 'nav' }); onCtaClick(); }} style={{ ...navStyles.cta, border: 'none', cursor: 'pointer' }} className="btn-shimmer">Agendar Diagnóstico</button>
          </div>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            {menuOpen
              ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>
        {menuOpen && (
          <div className="nav-mobile-menu">
            <a href="#marketing" onClick={() => { gaNavLinkClicked({ destino: 'marketing' }); closeMenu(); }}>Marketing</a>
            <a href="#why" onClick={() => { gaNavLinkClicked({ destino: 'why' }); closeMenu(); }}>Vendas</a>
            <a href="#diferenciais" onClick={() => { gaNavLinkClicked({ destino: 'diferenciais' }); closeMenu(); }}>Diferenciais</a>
            <a href="#how" onClick={() => { gaNavLinkClicked({ destino: 'garantia' }); closeMenu(); }}>Garantia</a>
            <div className="nav-mobile-divider" />
            <div className="nav-mobile-actions">
              <button className="nav-mobile-cta btn-shimmer" onClick={() => { gaCtaClicked({ origem: 'nav_mobile' }); onCtaClick(); closeMenu(); }}>
                Agendar Diagnóstico
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const navStyles = {
  bar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    borderBottom: '1px solid transparent',
    transition: 'background 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.5s ease',
    isolation: 'isolate',
    animation: 'navEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'relative' },
  brandLink: { display: 'flex', alignItems: 'center', borderBottom: 'none' },
  link: { color: '#6B7896', fontWeight: 500, fontSize: 14, borderBottom: 'none', fontFamily: 'var(--font-body)' },
  login: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #6B7896',
    color: '#6B7896',
    fontWeight: 500,
    fontSize: 14,
    padding: 0,
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  },
  cta: {
    background: 'linear-gradient(180deg,#BD8AF7 0%,#9B32F1 55%,#8C1EDB 100%)',
    color: '#FFFFFF', fontWeight: 600, fontSize: 14,
    padding: '9px 16px', borderRadius: 10, borderBottom: 'none',
    boxShadow: '0 1px 2px rgba(38,6,70,0.12), inset 0 1px 0 rgba(255,255,255,0.35)',
    fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  }
};

export default Nav;
