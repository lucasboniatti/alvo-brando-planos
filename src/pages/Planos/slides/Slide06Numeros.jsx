const STATS = [
  { number: '+180', desc: 'negócios acelerados pelo país' },
  { number: '+5', desc: 'anos atuando em marketing e vendas' },
  { number: '+R$7M', desc: 'aplicados em funis de vendas' },
  { number: '+R$120M', desc: 'em novas vendas geradas' },
];

const Slide06Numeros = ({ step = 0 }) => (
  <div className="slide-base dark" style={{ textAlign: 'center' }}>
    <div className="slide-inner">
      <div className="slide-label">Resultados em números</div>
      <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 48 }}>
        Números da Alvo Brando<br />
        <span className="slide-brand">em cases de sucesso</span>
      </h2>
      <div className="slide06-grid">
        {STATS.map((s, i) => (
          <div
            key={s.number}
            className={`slide06-stat slide06-stat-step${i < step ? ' visible' : ''}`}
          >
            <div className="slide06-number">{s.number}</div>
            <div className="slide06-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

Slide06Numeros.steps = STATS.length;

export default Slide06Numeros;
