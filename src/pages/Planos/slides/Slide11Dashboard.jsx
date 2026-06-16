import EmbeddedDashboard from '../../../components/EmbeddedDashboard/index.jsx';

const stepStyle = (i, step) => ({
  opacity: i < step ? 1 : 0,
  transform: i < step ? 'translateY(0)' : 'translateY(14px)',
  transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
  pointerEvents: i < step ? 'auto' : 'none',
});

const Slide11Dashboard = ({ step = 0 }) => (
  <div className="slide-base dark" style={{ paddingTop: 28, paddingBottom: 40 }}>
    <div className="slide-inner wide">
      <div style={{ marginBottom: 20, textAlign: 'center', ...stepStyle(0, step) }}
        className="slide-label">Visibilidade total</div>
      <div style={stepStyle(1, step)}>
        <EmbeddedDashboard />
      </div>
    </div>
  </div>
);

Slide11Dashboard.steps = 2;

export default Slide11Dashboard;
