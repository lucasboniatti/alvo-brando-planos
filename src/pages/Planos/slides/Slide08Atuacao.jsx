/*
  Triângulo invertido perfeito em SVG.
  Vértices: topo-esquerdo (0,0), topo-direito (320,0), ponta (160,340)
  A divisão 60/40 fica em y = 340 * 0.60 = 204.
  Nessa altura, a largura do triângulo é: 320 - (320/340)*204 = 320 - 192 = 128
  então x vai de (320-128)/2=96 até 96+128=224
*/

const W = 440;
const H = 420;
const SPLIT = H * 0.62; // linha divisória — 60% ocupa mais espaço visual

// Largura do triângulo na altura SPLIT
const wAtSplit = W * (1 - SPLIT / H);
const xL = (W - wAtSplit) / 2;
const xR = xL + wAtSplit;

// Borda direita na altura onde o texto fica (30% abaixo do split)
const textY = SPLIT + (H - SPLIT) * 0.3;
const wAtText = W * (1 - textY / H);
const xRAtText = (W + wAtText) / 2;

import { useEffect, useRef, useState } from 'react';

const Slide08Atuacao = ({ step = 0 }) => {
  const show40 = step >= 1;
  const [rendered40, setRendered40] = useState(false);
  const [visible40, setVisible40] = useState(false);

  useEffect(() => {
    if (show40 && !rendered40) {
      setRendered40(true);
      // Pequeno delay para o DOM montar com opacity:0 antes de animar
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible40(true)));
    }
  }, [show40]);

  return (
    <div className="slide-base dark" style={{ textAlign: 'center' }}>
<div className="slide-inner">
        <div className="slide-label">Modelo de atuação</div>
        <h2 className="slide-h2" style={{ color: '#fff', marginBottom: 8 }}>
          Somos seu Parceiro Estratégico
        </h2>
        <p className="slide-body" style={{ marginBottom: 32 }}>
          Pensamos no seu negócio juntos!
        </p>

        <div style={{ position: 'relative', width: W, margin: '0 auto' }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
            <defs>
              <linearGradient id="grad-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9B32F1" />
                <stop offset="100%" stopColor="#6B0FB8" />
              </linearGradient>
              <linearGradient id="grad-bot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
              </linearGradient>
            </defs>

            {/* Triângulo completo — contorno */}
            <polygon
              points={`0,0 ${W},0 ${W/2},${H}`}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />

            {/* Parte superior — 60% */}
            <polygon
              points={`0,0 ${W},0 ${xR},${SPLIT} ${xL},${SPLIT}`}
              fill="url(#grad-top)"
            />

            {/* Texto 60% — centralizado no meio vertical da área roxa */}
            <text x={W/2} y={SPLIT / 2 - 10} textAnchor="middle"
              fontFamily="var(--font-display)" fontSize="38" fontWeight="800"
              fill="#fff" letterSpacing="-1">60%</text>
            <text x={W/2} y={SPLIT / 2 + 18} textAnchor="middle"
              fontFamily="var(--font-display)" fontSize="14" fontWeight="600"
              fill="rgba(255,255,255,0.9)">Estratégico</text>

            {/* Parte inferior — 40% (animada) */}
            {rendered40 && <g style={{ opacity: visible40 ? 1 : 0, transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1)' }}>
              <polygon
                points={`${xL},${SPLIT} ${xR},${SPLIT} ${W/2},${H}`}
                fill="url(#grad-bot)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
              <line
                x1={xL} y1={SPLIT} x2={xR} y2={SPLIT}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <text x={W/2} y={SPLIT + (H - SPLIT) * 0.38} textAnchor="middle"
                fontFamily="var(--font-display)" fontSize="26" fontWeight="800"
                fill="rgba(255,255,255,0.9)" letterSpacing="-0.5">40%</text>
              <text x={W/2} y={SPLIT + (H - SPLIT) * 0.38 + 20} textAnchor="middle"
                fontFamily="var(--font-display)" fontSize="12" fontWeight="600"
                fill="rgba(255,255,255,0.6)">Operacional</text>
            </g>}
          </svg>

          {/* Label lateral 60% */}
          <div style={{ position: 'absolute', left: -148, top: SPLIT / 2 - 20, textAlign: 'right', width: 128 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              Plano que gera<br/>
              <span style={{ color: 'var(--brand-400)', fontWeight: 600 }}>Previsibilidade</span>
            </div>
          </div>

          {/* Label lateral 40% (animado) */}
          {rendered40 && <div style={{ opacity: visible40 ? 1 : 0, transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1)', position: 'absolute', left: xRAtText + 40, top: textY, textAlign: 'left', width: 120 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              Implementação que gera <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Vendas</span>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

Slide08Atuacao.steps = 1;

export default Slide08Atuacao;
