import { useState, useEffect } from 'react';
import logoOnDark from '../assets/logo-on-dark.svg';
import { gaLoginModalOpened, gaLoginAttempted, gaLoginFailed, gaCreateAccountClicked } from '../lib/ga';

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const LoginModal = ({ isOpen, onClose, onCreateAccount }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) gaLoginModalOpened({ origem: 'nav' });
  }, [isOpen]);

  if (!isOpen) return null;

  const canSubmit = isValidEmail(email) && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    gaLoginAttempted();
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setError('not_found');
    gaLoginFailed();
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setLoading(false);
    onClose();
  };

  const handleCreateAccount = ({ origem } = {}) => {
    gaCreateAccountClicked({ origem: origem || (error === 'not_found' ? 'login_failed' : 'direto') });
    handleClose();
    onCreateAccount();
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div style={s.modal}>
        {/* Close */}
        <button style={s.closeBtn} onClick={handleClose} aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Logo */}
        <div style={s.logoWrap}>
          <img src={logoOnDark} style={{ height: 36 }} alt="Alvo Brando" />
        </div>

        <h2 style={s.title}>Área do cliente Alvo Brando</h2>
        <p style={s.subtitle}>Acesse seu CRM e Dashboard de métricas da Alvo Brando</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.fieldWrap}>
            <label style={s.label}>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              style={{ ...s.input, ...(error ? s.inputError : {}) }}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div style={s.fieldWrap}>
            <label style={s.label}>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              style={{ ...s.input, ...(error ? s.inputError : {}) }}
              autoComplete="current-password"
            />
          </div>

          {error === 'not_found' && (
            <div style={s.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A95BF4" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Conta não cadastrada. Crie sua conta para acessar o painel.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            style={{ ...s.btnPrimary, opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? 'pointer' : 'default' }}
          >
            {loading ? 'Verificando...' : 'Acessar Dashboard'}
          </button>
        </form>

        <div style={s.divider}>
          <span style={s.dividerLine} />
          <span style={s.dividerText}>ainda não tem conta?</span>
          <span style={s.dividerLine} />
        </div>

        <button
          style={{ ...s.btnSecondary, ...(error === 'not_found' ? s.btnSecondaryHighlight : {}) }}
          onClick={() => handleCreateAccount({ origem: error === 'not_found' ? 'login_failed' : 'direto' })}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { background: 'rgba(52,229,161,0.08)', border: '1.5px solid rgba(52,229,161,0.35)', color: '#34E5A1', fontWeight: '600' })}
          onMouseLeave={e => {
            if (error === 'not_found') return;
            Object.assign(e.currentTarget.style, { background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', fontWeight: '500' });
          }}
        >
          {error === 'not_found' ? '✦ Quero ser Cliente agora' : 'Quero ser Cliente'}
        </button>

        <p style={s.safe}>🔒 Ambiente seguro · Alvo Brando</p>
      </div>
    </div>
  );
};

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 10000,
    background: 'rgba(7, 12, 27, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  },
  modal: {
    background: 'linear-gradient(180deg, #18213D 0%, #0D0218 60%, #0A1228 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 24,
    padding: '40px 40px 32px',
    width: '100%', maxWidth: 420,
    boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
    position: 'relative',
    animation: 'modalIn 0.28s cubic-bezier(0.2,0.7,0.2,1)',
  },
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    background: 'rgba(255,255,255,0.06)', border: 'none',
    color: 'rgba(255,255,255,0.5)', borderRadius: 10,
    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', outline: 'none',
  },
  logoWrap: {
    display: 'flex', justifyContent: 'center', marginBottom: 24,
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
    color: '#F7F2E5', textAlign: 'center', margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 14, color: 'rgba(255,255,255,0.4)',
    textAlign: 'center', margin: '0 0 28px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase', letterSpacing: '0.07em',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '12px 16px',
    color: '#F7F2E5', fontSize: 15,
    fontFamily: 'var(--font-body)', outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputError: {
    borderColor: 'rgba(255,107,61,0.5)',
  },
  errorBox: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    background: 'rgba(255,107,61,0.08)',
    border: '1px solid rgba(255,107,61,0.2)',
    borderRadius: 10, padding: '12px 14px',
    fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5,
  },
  btnPrimary: {
    background: 'linear-gradient(180deg, #BD8AF7 0%, #9B32F1 55%, #8C1EDB 100%)',
    color: '#FFFFFF', fontWeight: 700, fontSize: 15,
    padding: '13px 20px', borderRadius: 12, border: 'none',
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 16px rgba(155,50,241,0.3)',
    transition: 'opacity 0.18s', marginTop: 4,
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px',
  },
  dividerLine: {
    flex: 1, height: 1, background: 'rgba(255,255,255,0.07)',
  },
  dividerText: {
    fontSize: 11, color: 'rgba(255,255,255,0.3)',
    whiteSpace: 'nowrap', textTransform: 'lowercase',
  },
  btnSecondary: {
    background: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.55)', fontWeight: 500, fontSize: 14,
    padding: '12px 20px', borderRadius: 12,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    transition: 'all 0.18s', width: '100%',
  },
  btnSecondaryHighlight: {
    background: 'rgba(52,229,161,0.08)',
    border: '1.5px solid rgba(52,229,161,0.35)',
    color: '#34E5A1', fontWeight: 600,
  },
  safe: {
    fontSize: 11, color: 'rgba(255,255,255,0.2)',
    textAlign: 'center', margin: '20px 0 0',
  },
};

export default LoginModal;
