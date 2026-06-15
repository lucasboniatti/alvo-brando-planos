import { Link } from 'react-router-dom';

const Footer = ({ blogMode = false }) => {
  const blog = blogMode;
  const textCopy = blog ? 'var(--sand-400)' : 'rgba(255,255,255,0.25)';

  return (
    <footer style={{
      background: blog ? 'linear-gradient(180deg,#F4EEDF 0%,#ECE4D0 100%)' : '#0A1228',
      color: blog ? '#0D0218' : '#F7F2E5',
      padding: '16px 24px',
      borderTop: blog ? '1px solid rgba(209,198,175,0.4)' : '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: textCopy }}>
          © 2026 Alvo Brando LTDA · Todos os direitos reservados
        </span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link
            to="/politica-de-privacidade"
            style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: textCopy, textDecoration: 'none', borderBottom: 'none' }}
          >
            Política de Privacidade
          </Link>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: textCopy }}>
            Florianópolis, SC · Brasil
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
