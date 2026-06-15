import logoSvg from '../../../assets/logo-on-dark.svg';

const Slide01Logo = () => (
  <div className="slide-base dark" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
    {/* Logo gigante de fundo com 5% de opacidade */}
    <img
      src={logoSvg}
      alt=""
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '200vw',
        height: '200vh',
        objectFit: 'contain',
        opacity: 0.01,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
    {/* Conteúdo por cima */}
    <div className="slide01-logo-wrap">
      <img src={logoSvg} alt="Alvo Brando" className="slide01-logo-img" />
      <div className="slide01-divider" />
      <p className="slide01-tagline">Assessoria Completa em Marketing &amp; Vendas<br />com Inteligência Artificial</p>
    </div>
  </div>
);

export default Slide01Logo;
