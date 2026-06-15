import ROICalcProposta from '../../components/ROICalcProposta';
import logoSvg from '../../assets/logo-on-dark.svg';

const CalculadoraPage = () => (
  <div style={{ minHeight: '100vh', background: 'var(--sand-100)', display: 'flex', flexDirection: 'column' }}>
    <header style={{
      padding: '20px 32px',
      background: 'var(--night-900)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <img src={logoSvg} alt="Alvo Brando" style={{ height: 28 }} />
    </header>
    <main style={{ flex: 1 }}>
      <ROICalcProposta />
    </main>
    <footer style={{
      padding: '16px 32px',
      textAlign: 'center',
      fontSize: 12,
      color: 'var(--fg-3)',
      borderTop: '1px solid var(--border-1)',
      background: 'white',
    }}>
      © {new Date().getFullYear()} Alvo Brando · alvobrando.com
    </footer>
  </div>
);

export default CalculadoraPage;
