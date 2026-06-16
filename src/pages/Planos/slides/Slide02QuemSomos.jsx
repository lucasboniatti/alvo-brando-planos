const stepStyle = (i, step) => ({
  opacity: i < step ? 1 : 0,
  transform: i < step ? 'translateY(0)' : 'translateY(14px)',
  transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
  pointerEvents: i < step ? 'auto' : 'none',
});

const Slide02QuemSomos = ({ step = 0 }) => (
  <div className="slide-base dark" style={{ textAlign: 'center' }}>
    <div className="slide-inner">
      <div style={stepStyle(0, step)} className="slide-label">A equipe</div>
      <h1 className="slide-h1" style={{ color: '#fff', ...stepStyle(1, step) }}>
        Quem está por trás<br />
        <span className="slide-brand">dos resultados?</span>
      </h1>
      <p className="slide-body" style={{ maxWidth: 520, margin: '0 auto', ...stepStyle(2, step) }}>
        Conheça os estrategistas que vão acelerar o crescimento do seu negócio.
      </p>
    </div>
  </div>
);

Slide02QuemSomos.steps = 3;

export default Slide02QuemSomos;
