const COL1 = [
  { day: '00', title: 'Fechamento', sub: 'Você está aqui' },
  { day: '00', title: 'Pagamento Realizado' },
  { day: '01', title: 'Reunião de Briefing' },
  { day: '02', title: 'Estudo de concorrentes' },
  { day: '03', title: 'Estratégia de anúncios' },
  { day: '04', title: 'Criativos e landing page' },
];

const COL2 = [
  { day: '05', title: 'Implementação de IA no WhatsApp' },
  { day: '06', title: 'Configuração de ferramentas' },
  { day: '07', title: 'Apresentação do funil completo' },
  { day: '08', title: 'Ativação dos anúncios' },
  { day: '10', title: 'Primeiro feedback semanal' },
  { day: '14', title: 'Primeira consultoria mensal' },
];

const Step = ({ day, title, sub, highlight }) => (
  <div className={`slide16-step${highlight ? ' highlight' : ''}`}>
    <div className="slide16-day">D{day}</div>
    <div className="slide16-step-content">
      <div className="slide16-step-title">{title}</div>
      {sub && <div className="slide16-step-sub">← {sub}</div>}
    </div>
  </div>
);

const Slide16Proximos = ({ step = 0 }) => {
  const lastVisible = step - 1;
  return (
    <div className="slide-base dark">
      <div className="slide-inner wide" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="slide-label" style={{ textAlign: 'center' }}>Próximos passos</div>
        <h2 className="slide-h2" style={{ color: '#fff', textAlign: 'center', marginBottom: 28 }}>
          Como funciona <span className="slide-brand">a partir de agora</span>
        </h2>
        <div className="slide16-wrap">
          <div className="slide16-col">
            {COL1.map((s, i) => (
              <div key={i} className={`slide-step-item${i < step ? ' visible' : ''}`}>
                <Step {...s} highlight={i === lastVisible} />
              </div>
            ))}
          </div>
          <div className="slide16-col">
            {COL2.map((s, i) => {
              const globalIndex = i + COL1.length;
              return (
                <div key={i} className={`slide-step-item${globalIndex < step ? ' visible' : ''}`}>
                  <Step {...s} highlight={globalIndex === lastVisible} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

Slide16Proximos.steps = COL1.length + COL2.length;

export default Slide16Proximos;
