import EmbeddedDashboard from '../../../components/EmbeddedDashboard/index.jsx';

const Slide11Dashboard = () => (
  <div className="slide-base dark" style={{ paddingTop: 40, paddingBottom: 40 }}>
    <div className="slide-inner wide">
      <div className="slide-label" style={{ marginBottom: 16, textAlign: 'center' }}>Visibilidade total</div>
      <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 28, textAlign: 'center' }}>
        Dashboard de Marketing<br />
        <span className="slide-brand">e Vendas</span>
      </h2>
      <EmbeddedDashboard />
    </div>
  </div>
);

export default Slide11Dashboard;
