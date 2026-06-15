import { useState, useEffect, useCallback, useRef } from 'react';
import './Planos.css';
import logoSvg from '../../assets/logo-on-dark.svg';

import Slide01Logo from './slides/Slide01Logo';
import Slide02QuemSomos from './slides/Slide02QuemSomos';
import Slide03Amanda from './slides/Slide03Amanda';
import Slide04Lucas from './slides/Slide04Lucas';
import Slide05OQueFazemos from './slides/Slide05OQueFazemos';
import Slide06HowItWorks from './slides/Slide06HowItWorks';
import SlideWhySection from './slides/SlideWhySection';
import SlideROICalc from './slides/SlideROICalc';
import Slide06Numeros from './slides/Slide06Numeros';
import Slide07Resultados from './slides/Slide07Resultados';
import Slide08Atuacao from './slides/Slide08Atuacao';
import Slide09TimeCompleto from './slides/Slide09TimeCompleto';
import Slide10Onboarding from './slides/Slide10Onboarding';
import Slide10bGestao from './slides/Slide10bGestao';
import Slide11Dashboard from './slides/Slide11Dashboard';
import Slide12Garantia from './slides/Slide12Garantia';
import Slide13NPS from './slides/Slide13NPS';
import Slide14Planos from './slides/Slide14Planos';
import Slide15Comparacao from './slides/Slide15Comparacao';
import Slide16Proximos from './slides/Slide16Proximos';

const SENHA = 'alvo26';
const SLIDES = [
  Slide01Logo,          // 0
  Slide02QuemSomos,     // 1
  Slide03Amanda,        // 2
  Slide04Lucas,         // 3
  Slide06Numeros,       // 4  — Nossa trajetória fala por si
  Slide07Resultados,    // 5  — Alguns dos resultados
  Slide05OQueFazemos,   // 6  — Diferenciais
  Slide06HowItWorks,    // 7  — Como Funciona
  SlideROICalc,         // 8  — Calculadora ROI
  SlideWhySection,      // 9  — Processos que vendem
  Slide15Comparacao,    // 10 — Comparação
  Slide08Atuacao,       // 11 — Somos seu Parceiro Estratégico
  Slide09TimeCompleto,  // 12 — Time Completo
  Slide10Onboarding,    // 13 — Onboarding
  Slide10bGestao,       // 14 — Gestão
  Slide11Dashboard,     // 15 — Dashboard
  Slide12Garantia,      // 16 — Garantia
  Slide13NPS,           // 17 — NPS
  Slide14Planos,        // 18 — Planos
  Slide16Proximos,      // 19 — Próximos Passos
];
const TOTAL = SLIDES.length;
const LIGHT_SLIDES = new Set([6, 8, 9, 10, 17, 18]); // Diferenciais, ROI, WhySection, Comparação, NPS, Planos

/* ── Tela de Senha ── */
const AuthScreen = ({ onAuth }) => {
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  const tentar = (e) => {
    e.preventDefault();
    if (valor === SENHA) {
      sessionStorage.setItem('planos_auth', '1');
      onAuth();
    } else {
      setErro('Senha incorreta. Tente novamente.');
      setValor('');
    }
  };

  return (
    <div className="planos-auth">
      <div className="planos-auth-logo">
        <img src={logoSvg} alt="Alvo Brando" style={{ width: 140 }} />
      </div>
      <div className="planos-auth-card">
        <h1 className="planos-auth-title">Proposta Comercial</h1>
        <p className="planos-auth-subtitle">Digite a senha para acessar a apresentação</p>
        <form onSubmit={tentar}>
          <input
            type="password"
            className="planos-auth-input"
            placeholder="Senha de acesso"
            value={valor}
            onChange={e => { setValor(e.target.value); setErro(''); }}
            autoFocus
          />
          <button type="submit" className="planos-auth-btn">
            Acessar apresentação →
          </button>
          {erro && <div className="planos-auth-error">{erro}</div>}
        </form>
      </div>
    </div>
  );
};

/* ── Player de Slides ── */
const SlidePlayer = () => {
  const [atual, setAtual] = useState(0);
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState(null); // 'next' | 'prev'
  const touchStart = useRef(null);
  const wrapRef = useRef(null);

  const slideSteps = SLIDES[atual].steps ?? 0;

  const ir = useCallback((idx, resetStep = true) => {
    if (idx < 0 || idx >= TOTAL) return;
    setAnimDir(idx > atual ? 'next' : 'prev');
    setAtual(idx);
    if (resetStep) setStep(0);
  }, [atual]);

  // → seta direita: preenche tudo de uma vez se incompleto, senão avança slide
  const proximoRapido = useCallback(() => {
    if (step < slideSteps) {
      setStep(slideSteps);
    } else {
      ir(atual + 1);
    }
  }, [ir, atual, step, slideSteps]);

  // ↓ espaço / botão / swipe: avança um step por vez
  const proximo = useCallback(() => {
    if (step < slideSteps) {
      setStep(s => s + 1);
    } else {
      ir(atual + 1);
    }
  }, [ir, atual, step, slideSteps]);

  // ← seta esquerda: limpa tudo de uma vez se tem algo visível, senão volta slide
  const anteriorRapido = useCallback(() => {
    if (step > 0) {
      setStep(0);
    } else {
      ir(atual - 1);
    }
  }, [ir, atual, step]);

  // ↑ botão na tela: recolhe um step por vez
  const anterior = useCallback(() => {
    if (step > 0) {
      setStep(s => s - 1);
    } else {
      ir(atual - 1);
    }
  }, [ir, atual, step]);

  /* Teclado */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); proximoRapido(); }
      if (e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); proximo(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); anterior(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [proximoRapido, proximo, anteriorRapido, anterior]);

  /* Swipe touch */
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const delta = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? proximo() : anterior();
    touchStart.current = null;
  };

  /* Scroll ao trocar slide */
  useEffect(() => {
    if (wrapRef.current) wrapRef.current.scrollTop = 0;
  }, [atual]);

  const SlideComponent = SLIDES[atual];
  const progressoPct = ((atual + 1) / TOTAL) * 100;

  return (
    <div
      className="planos-player"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Barra de progresso */}
      <div className="planos-progress" style={{ width: `${progressoPct}%` }} />

      {/* Slide atual */}
      <div
        ref={wrapRef}
        key={atual}
        className={`planos-slide-wrap${animDir === 'next' ? ' entering' : animDir === 'prev' ? ' entering-back' : ''}`}
      >
        <SlideComponent step={step} />
      </div>

      {/* Logo marca d'água */}
      <div className={`planos-watermark${LIGHT_SLIDES.has(atual) ? ' dark-text' : ''}`}>
        <span className="planos-watermark-alvo">alvo</span><span className="planos-watermark-brando">brando</span>
      </div>

      {/* Seta anterior */}
      <button
        className={`planos-arrow planos-arrow-prev${LIGHT_SLIDES.has(atual) ? ' light' : ''}`}
        onClick={anterior}
        disabled={atual === 0}
        aria-label="Slide anterior"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Seta próxima */}
      <button
        className={`planos-arrow planos-arrow-next${LIGHT_SLIDES.has(atual) ? ' light' : ''}`}
        onClick={proximo}
        disabled={atual === TOTAL - 1}
        aria-label="Próximo slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className={`planos-dots${LIGHT_SLIDES.has(atual) ? ' light' : ''}`}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`planos-dot${i === atual ? ' active' : ''}`}
            onClick={() => ir(i)}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Contador */}
      <div className={`planos-counter${LIGHT_SLIDES.has(atual) ? ' light' : ''}`}>{atual + 1} / {TOTAL}</div>
    </div>
  );
};

/* ── Root ── */
const PlanosPage = () => {
  const [autenticado, setAutenticado] = useState(
    () => sessionStorage.getItem('planos_auth') === '1'
  );

  return (
    <div className="planos-root">
      {autenticado
        ? <SlidePlayer />
        : <AuthScreen onAuth={() => setAutenticado(true)} />
      }
    </div>
  );
};

export default PlanosPage;
