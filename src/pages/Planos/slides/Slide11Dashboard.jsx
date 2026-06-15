import dashImg from '../../../assets/dashboard-screenshot.png';

const Slide11Dashboard = () => (
  <div className="slide-base dark" style={{ textAlign: 'center' }}>
    <div className="slide-inner wide">
      <div className="slide-label">Visibilidade total</div>
      <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 24 }}>
        Dashboard de Marketing<br />
        <span className="slide-brand">e Vendas</span>
      </h2>
      <img
        src={dashImg}
        alt="Dashboard de Marketing e Vendas"
        style={{
          width: '100%',
          maxWidth: 900,
          borderRadius: 14,
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          display: 'block',
          margin: '0 auto',
        }}
        draggable={false}
      />
    </div>
  </div>
);

export default Slide11Dashboard;
