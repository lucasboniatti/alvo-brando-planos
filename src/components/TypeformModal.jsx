import { useState, useEffect, useRef } from 'react';
import {
  gaFormOpened,
  gaStepCompleted,
  gaFormSubmitted,
  gaExitIntent,
} from '../lib/ga';

const WEBHOOK_URL = 'https://n8n2.dr-flow.com/webhook-test/site-ab';
const TRACKING_URL = 'https://n8n2.dr-flow.com/webhook/alvo-brando-tracking';

const track = (event, data = {}) => {
  const params = new URLSearchParams(window.location.search);
  fetch(TRACKING_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      site: 'Alvo Brando',
      pagina: window.location.pathname,
      timestamp: new Date().toISOString(),
      utm: {
        source:   params.get('utm_source')   || '',
        medium:   params.get('utm_medium')   || '',
        campaign: params.get('utm_campaign') || '',
      },
      ...data,
    }),
  }).catch(() => {});
};

const maskPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const isValidPhone = (val) => {
  const d = (val || '').replace(/\D/g, '');
  return d.length >= 10 && d.length <= 11;
};

const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val || '');

// Dias disponíveis: próximos 30 dias, excluindo domingo
const buildAvailableSet = () => {
  const set = new Set();
  const now = new Date();
  let cursor = new Date(now);
  cursor.setDate(cursor.getDate() + 1);
  for (let i = 0; i < 30; i++) {
    if (cursor.getDay() !== 0) {
      set.add(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return set;
};

const AVAILABLE_SET = buildAvailableSet();

const isAvailable = (date) =>
  AVAILABLE_SET.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);

const isSameDay = (a, b) =>
  a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Componente de calendário estilo Calendly
const CalendlyCalendar = ({ selected, onSelect }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const DOW = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const canGoPrev = (() => {
    const now = new Date();
    return !(viewYear === now.getFullYear() && viewMonth === now.getMonth());
  })();

  const canGoNext = (() => {
    const limit = new Date();
    limit.setDate(limit.getDate() + 30);
    const nextMonth = new Date(viewYear, viewMonth + 1, 1);
    return nextMonth <= limit;
  })();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

  const prevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (!canGoNext) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div style={sc.cal} className="tf-cal">
      {/* Header do mês */}
      <div style={sc.calHeader}>
        <button style={{ ...sc.calArrow, opacity: canGoPrev ? 1 : 0.2, cursor: canGoPrev ? 'pointer' : 'default' }} onClick={prevMonth}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={sc.calMonthLabel} className="tf-cal-month">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button style={{ ...sc.calArrow, opacity: canGoNext ? 1 : 0.2, cursor: canGoNext ? 'pointer' : 'default' }} onClick={nextMonth}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Cabeçalho dias da semana */}
      <div style={sc.calDowRow}>
        {DOW.map(d => <div key={d} style={sc.calDow} className="tf-cal-dow">{d}</div>)}
      </div>

      {/* Grade de dias */}
      <div style={sc.calGrid}>
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;
          const avail = isAvailable(date);
          const sel   = isSameDay(date, selected);
          return (
            <button
              key={date.getDate()}
              disabled={!avail}
              onClick={() => avail && onSelect(date)}
              className="tf-cal-day"
              style={{
                ...sc.calDay,
                ...(avail ? sc.calDayAvail : sc.calDayDisabled),
                ...(sel ? sc.calDaySelected : {}),
              }}
            >
              {date.getDate()}
              {sel && <span style={sc.calDot} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const HOURS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

const formatDate = (date) => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
};

const formatDateFull = (date) => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
};

// IDs de cada tela
const SCREEN = {
  NOME: 'nome',
  WHATSAPP: 'whatsapp',
  INSTAGRAM: 'instagram',
  FATURAMENTO: 'faturamento',
  FILTRO_INVESTIMENTO: 'filtro_investimento',
  UPSELL_SITE: 'upsell_site',
  FINAL_NAO: 'final_nao',
  AGENDAMENTO_DIA: 'agendamento_dia',
  AGENDAMENTO_HORA: 'agendamento_hora',
  EMAIL: 'email',
  CONFIRMACAO: 'confirmacao',
};

const FATURAMENTO_OPTIONS = [
  { value: 'ate-30k',       label: 'Até R$ 30.000' },
  { value: '30k-50k',       label: 'Entre R$ 30.000 e R$ 50.000' },
  { value: '50k-100k',      label: 'Entre R$ 50.000 e R$ 100.000' },
  { value: '100k-400k',     label: 'Entre R$ 100.000 e R$ 400.000' },
  { value: '400k-1m',       label: 'Entre R$ 400.000 e R$ 1.000.000' },
  { value: 'acima-1m',      label: 'Acima de R$ 1.000.000' },
];

const FATURAMENTO_BAIXO = 'ate-30k';

// Sequência principal (sem ramificações)
const MAIN_FLOW = [
  SCREEN.NOME,
  SCREEN.WHATSAPP,
  SCREEN.INSTAGRAM,
  SCREEN.FATURAMENTO,
];

const TypeformModal = ({ isOpen, onClose, origem, plano }) => {
  const [screen, setScreen]     = useState(SCREEN.NOME);
  const [direction, setDirection] = useState('forward');
  const [animating, setAnimating] = useState(false);
  const [answers, setAnswers]   = useState({});
  const [fieldError, setFieldError] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const inputRef = useRef(null);

  const firstName = (answers.nome || '').split(' ')[0] || '';

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) {
      setScreen(SCREEN.NOME);
      setAnswers({});
      setFieldError('');
      setShowExitConfirm(false);
      setDirection('forward');
      gaFormOpened({ origem: origem || undefined, plano: plano || undefined });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Foco automático em inputs de texto
  useEffect(() => {
    if (!isOpen) return;
    const textScreens = [SCREEN.NOME, SCREEN.WHATSAPP, SCREEN.INSTAGRAM, SCREEN.EMAIL];
    if (textScreens.includes(screen)) {
      setTimeout(() => inputRef.current?.focus(), 320);
    }
  }, [screen, isOpen]);

  // Atalho Enter
  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') handleCloseRequest();
      if (e.key === 'Enter' && showExitConfirm) { setShowExitConfirm(false); return; }
      if (e.key === 'Enter') {
        const textScreens = [SCREEN.NOME, SCREEN.WHATSAPP, SCREEN.INSTAGRAM, SCREEN.EMAIL];
        if (textScreens.includes(screen)) handleNext();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, screen, answers, showExitConfirm]);

  const goTo = (next, dir = 'forward') => {
    if (animating) return;
    setFieldError('');
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setScreen(next);
      setAnimating(false);
    }, 260);
  };

  const handleCloseRequest = () => {
    const endScreens = [SCREEN.CONFIRMACAO, SCREEN.FINAL_NAO];
    if (endScreens.includes(screen)) { onClose(); return; }
    gaExitIntent({ tela: screen });
    setShowExitConfirm(true);
  };

  // Validação da tela atual
  const canAdvance = () => {
    if (screen === SCREEN.NOME) {
      return typeof answers.nome === 'string' && answers.nome.trim().length >= 3;
    }
    if (screen === SCREEN.WHATSAPP) return isValidPhone(answers.whatsapp);
    if (screen === SCREEN.INSTAGRAM) {
      return typeof answers.instagram === 'string' && answers.instagram.trim().length >= 3;
    }
    if (screen === SCREEN.EMAIL) return isValidEmail(answers.email);
    return false;
  };

  const handleNext = () => {
    if (!canAdvance()) {
      if (screen === SCREEN.WHATSAPP) setFieldError('Digite um número válido com DDD, ex: (51) 9 9999-9999');
      if (screen === SCREEN.EMAIL) setFieldError('Digite um e-mail válido');
      return;
    }
    setFieldError('');
    gaStepCompleted({ step_id: screen });

    if (screen === SCREEN.NOME) goTo(SCREEN.WHATSAPP);
    else if (screen === SCREEN.WHATSAPP) goTo(SCREEN.INSTAGRAM);
    else if (screen === SCREEN.INSTAGRAM) goTo(SCREEN.FATURAMENTO);
    else if (screen === SCREEN.EMAIL) submitLead();
  };

  const handleFaturamento = (value) => {
    const newAnswers = { ...answers, faturamento: value };
    setAnswers(newAnswers);
    gaStepCompleted({ step_id: 'faturamento', resposta: value });

    if (value === FATURAMENTO_BAIXO) {
      goTo(SCREEN.FILTRO_INVESTIMENTO);
    } else {
      submitLeadDireto({ ...answers, faturamento: value });
      goTo(SCREEN.CONFIRMACAO);
    }
  };

  const handleFiltroInvestimento = (opcao) => {
    const newAnswers = { ...answers, filtro_investimento: opcao };
    setAnswers(newAnswers);

    if (opcao === 'sim') {
      submitLeadDireto({ ...answers, filtro_investimento: opcao });
      goTo(SCREEN.CONFIRMACAO);
    } else {
      goTo(SCREEN.UPSELL_SITE);
    }
  };

  const handleUpsellSite = (opcao) => {
    const newAnswers = { ...answers, upsell_site: opcao };
    setAnswers(newAnswers);

    if (opcao === 'sim') {
      submitLeadDireto({ ...answers, upsell_site: opcao });
      goTo(SCREEN.CONFIRMACAO);
    } else {
      submitLeadFinal(newAnswers);
      goTo(SCREEN.FINAL_NAO);
    }
  };


  const submitLeadDireto = (overrides = {}) => {
    const params = new URLSearchParams(window.location.search);
    const a = { ...answers, ...overrides };
    const payload = {
      lead: {
        nome:      a.nome || '',
        telefone:  a.whatsapp || '',
        email:     '',
        instagram: a.instagram || '',
        campos_extras: {
          faturamento:         a.faturamento || '',
          filtro_investimento: a.filtro_investimento || '',
          upsell_site:         a.upsell_site || '',
        },
      },
      site:    'Alvo Brando',
      pagina:  window.location.pathname,
      origem:  origem || '',
      tipo_submissao: 'lead_confirmado',
      utm: {
        source:   params.get('utm_source')   || '',
        medium:   params.get('utm_medium')   || '',
        campaign: params.get('utm_campaign') || '',
        content:  params.get('utm_content')  || '',
        term:     params.get('utm_term')     || '',
      },
    };
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
    track('form_submitted', { tipo: 'lead', faturamento: a.faturamento });
    gaFormSubmitted({ plano: 'lead' });
  };

  const submitLeadFinal = (overrides = {}) => {
    gaFormSubmitted({ plano: 'descartado' });
  };

  const progress = (() => {
    const order = [
      SCREEN.NOME, SCREEN.WHATSAPP, SCREEN.INSTAGRAM, SCREEN.FATURAMENTO,
      SCREEN.FILTRO_INVESTIMENTO, SCREEN.UPSELL_SITE,
    ];
    const idx = order.indexOf(screen);
    if (idx < 0) return 100;
    return Math.round(((idx + 1) / order.length) * 100);
  })();

  if (!isOpen) return null;

  return (
    <div style={s.overlay} className="tf-overlay-inner" onClick={(e) => e.target === e.currentTarget && handleCloseRequest()}>
      <div style={s.modal} className="tf-modal">
        {/* Barra de progresso */}
        <div style={s.progressTrack}>
          <div style={{ ...s.progressFill, width: `${progress}%` }} />
        </div>

        {/* Botão fechar */}
        <button style={s.closeBtn} onClick={handleCloseRequest} aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Overlay de saída */}
        {showExitConfirm && (
          <div style={s.exitOverlay}>
            <div style={s.exitBox}>
              <div style={s.exitTitle}>Quase lá!</div>
              <div style={s.exitBody}>Falta pouco para você agendar seu Diagnóstico Gratuito. Tem certeza que quer sair?</div>
              <div style={s.exitBtns}>
                <button style={s.exitBtnPrimary} onClick={() => setShowExitConfirm(false)}>Continuar</button>
                <button style={s.exitBtnSecondary} onClick={() => { setShowExitConfirm(false); onClose(); }}>Sair</button>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo animado */}
        <div style={s.body} className="tf-modal-body">
          <div style={{
            ...s.slide,
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === 'forward' ? 'translateY(20px)' : 'translateY(-20px)'
              : 'translateY(0)',
            transition: 'opacity 0.26s ease, transform 0.26s ease',
          }}>

            {/* ── TELA 01: NOME ── */}
            {screen === SCREEN.NOME && (
              <>
                <div style={s.introLabel}>Menos de 1 minuto</div>
                <h2 style={s.question} className="tf-question">Preencha o formulário para agendar seu diagnóstico gratuito.</h2>
                <p style={s.hint} className="tf-hint">Isso leva menos de 1 minuto.</p>
                <label style={s.label}>Qual é o seu nome?</label>
                <div style={s.inputWrap}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Nome completo"
                    value={answers.nome || ''}
                    onChange={e => { setAnswers(a => ({ ...a, nome: e.target.value })); setFieldError(''); }}
                    style={s.input}
                    className="tf-input"
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                  />
                  {fieldError
                    ? <div style={s.fieldError}>{fieldError}</div>
                    : <div style={s.inputHint}>Pressione <kbd style={s.kbd}>Enter ↵</kbd> para continuar</div>
                  }
                </div>
                <div style={s.nav}>
                  <button
                    style={{ ...s.btnPrimary, opacity: canAdvance() ? 1 : 0.4, cursor: canAdvance() ? 'pointer' : 'default' }}
                    onClick={canAdvance() ? handleNext : undefined}
                  >
                    Próximo
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 02: WHATSAPP ── */}
            {screen === SCREEN.WHATSAPP && (
              <>
                <h2 style={s.question} className="tf-question">Qual é o seu WhatsApp?</h2>
                <label style={s.label}>DDD + número</label>
                <div style={s.inputWrap}>
                  <input
                    ref={inputRef}
                    type="tel"
                    placeholder="(51) 9 9999-9999"
                    value={answers.whatsapp || ''}
                    onChange={e => { setAnswers(a => ({ ...a, whatsapp: maskPhone(e.target.value) })); setFieldError(''); }}
                    style={{ ...s.input, ...(fieldError ? { borderColor: '#A95BF4' } : {}) }}
                    className="tf-input"
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                  />
                  {fieldError
                    ? <div style={s.fieldError}>{fieldError}</div>
                    : <div style={s.inputHint}>Pressione <kbd style={s.kbd}>Enter ↵</kbd> para continuar</div>
                  }
                </div>
                <p style={s.privacyNote}>Usado apenas para enviar o link da reunião. Sem spam.</p>
                <div style={s.nav}>
                  <button style={s.btnBack} onClick={() => goTo(SCREEN.NOME, 'back')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                  <button
                    style={{ ...s.btnPrimary, marginLeft: 'auto', opacity: canAdvance() ? 1 : 0.4, cursor: canAdvance() ? 'pointer' : 'default' }}
                    onClick={canAdvance() ? handleNext : undefined}
                  >
                    Próximo
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 03: INSTAGRAM ── */}
            {screen === SCREEN.INSTAGRAM && (
              <>
                <h2 style={s.question} className="tf-question">Qual o Instagram ou site da sua empresa?</h2>
                <div style={s.inputWrap}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="@empresa ou empresa.com.br"
                    value={answers.instagram || ''}
                    onChange={e => { setAnswers(a => ({ ...a, instagram: e.target.value })); setFieldError(''); }}
                    style={s.input}
                    className="tf-input"
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                  />
                  {fieldError
                    ? <div style={s.fieldError}>{fieldError}</div>
                    : <div style={s.inputHint}>Pressione <kbd style={s.kbd}>Enter ↵</kbd> para continuar</div>
                  }
                </div>
                <div style={s.nav}>
                  <button style={s.btnBack} onClick={() => goTo(SCREEN.WHATSAPP, 'back')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                  <button
                    style={{ ...s.btnPrimary, marginLeft: 'auto', opacity: canAdvance() ? 1 : 0.4, cursor: canAdvance() ? 'pointer' : 'default' }}
                    onClick={canAdvance() ? handleNext : undefined}
                  >
                    Próximo
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 04: FATURAMENTO ── */}
            {screen === SCREEN.FATURAMENTO && (
              <>
                <h2 style={s.question} className="tf-question">Qual é o seu faturamento médio mensal?</h2>
                <div style={s.selectList}>
                  {FATURAMENTO_OPTIONS.map((opt, idx) => (
                    <button
                      key={opt.value}
                      style={{ ...s.selectItem, ...(answers.faturamento === opt.value ? s.selectSelected : {}) }}
                      className="tf-select-item"
                      onClick={() => handleFaturamento(opt.value)}
                    >
                      <span style={s.selectLetter}>{String.fromCharCode(65 + idx)}</span>
                      <span style={s.selectLabel}>{opt.label}</span>
                      {answers.faturamento === opt.value && (
                        <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BD8AF7" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  ))}
                </div>
                <div style={{ ...s.nav, marginTop: 20 }}>
                  <button style={s.btnBack} onClick={() => goTo(SCREEN.INSTAGRAM, 'back')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 05A: FILTRO INVESTIMENTO ── */}
            {screen === SCREEN.FILTRO_INVESTIMENTO && (
              <>
                <h2 style={s.question} className="tf-question">Nossos planos completos partem de <span style={{ color: '#1FCE7C' }}>R$&nbsp;1.500/mês</span>. Faz sentido para você neste momento?</h2>
                <p style={s.hint} className="tf-hint">Isso cobre o time de especialistas trabalhando no seu negócio todos os dias.</p>
                <div style={s.selectList}>
                  <button
                    style={{ ...s.selectItem, ...(answers.filtro_investimento === 'sim' ? s.selectSelected : {}) }}
                    className="tf-select-item"
                    onClick={() => handleFiltroInvestimento('sim')}
                  >
                    <span style={s.selectLetter}>A</span>
                    <span style={s.selectLabel}>Sim, faz sentido. Quero seguir.</span>
                  </button>
                  <button
                    style={{ ...s.selectItem, ...(answers.filtro_investimento === 'nao' ? s.selectSelected : {}) }}
                    className="tf-select-item"
                    onClick={() => handleFiltroInvestimento('nao')}
                  >
                    <span style={s.selectLetter}>B</span>
                    <span style={s.selectLabel}>Ainda não consigo esse investimento agora.</span>
                  </button>
                </div>
                <div style={{ ...s.nav, marginTop: 20 }}>
                  <button style={s.btnBack} onClick={() => goTo(SCREEN.FATURAMENTO, 'back')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 05B: UPSELL SITE ── */}
            {screen === SCREEN.UPSELL_SITE && (
              <>
                <h2 style={s.question} className="tf-question">Tudo bem, {firstName}. A assessoria completa pode não ser o momento certo agora.</h2>
                <div style={s.upsellCard} className="tf-upsell-card">
                  <div style={s.upsellBadge}>Solução alternativa</div>
                  <div style={s.upsellTitle} className="tf-upsell-title">Site Estratégico por <span style={{ color: '#1FCE7C' }}>R$&nbsp;490</span></div>
                  <div style={s.upsellSub}>Investimento único</div>
                  <p style={s.upsellDesc}>Um site profissional, rápido e otimizado para conversão. Pronto para você ser encontrado no Google orgânico e fechar mais vendas.</p>
                </div>
                <p style={{ ...s.hint, marginTop: 4 }}>Tem interesse?</p>
                <div style={s.selectList}>
                  <button
                    style={{ ...s.selectItem, ...(answers.upsell_site === 'sim' ? s.selectSelected : {}) }}
                    className="tf-select-item"
                    onClick={() => handleUpsellSite('sim')}
                  >
                    <span style={s.selectLetter}>A</span>
                    <span style={s.selectLabel}>Sim, quero saber mais sobre o site.</span>
                  </button>
                  <button
                    style={{ ...s.selectItem, ...(answers.upsell_site === 'nao' ? s.selectSelected : {}) }}
                    className="tf-select-item"
                    onClick={() => handleUpsellSite('nao')}
                  >
                    <span style={s.selectLetter}>B</span>
                    <span style={s.selectLabel}>Não, obrigado.</span>
                  </button>
                </div>
                <div style={{ ...s.nav, marginTop: 20 }}>
                  <button style={s.btnBack} onClick={() => goTo(SCREEN.FILTRO_INVESTIMENTO, 'back')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 05C: FINAL NÃO ── */}
            {screen === SCREEN.FINAL_NAO && (
              <>
                <div style={s.successIcon}>
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                  </svg>
                </div>
                <h2 style={s.successTitle} className="tf-success-title">Sem problema, {firstName}.</h2>
                <p style={s.successSub} className="tf-success-sub">Quando o momento certo chegar, estaremos aqui.</p>
                <p style={{ ...s.successSub, marginTop: -8 }}>Boa sorte no seu negócio.</p>
                <div style={{ ...s.nav, marginTop: 24 }}>
                  <button style={s.btnBack} onClick={() => goTo(SCREEN.UPSELL_SITE, 'back')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                  <button style={s.btnPrimary} onClick={onClose}>Fechar</button>
                </div>
              </>
            )}

            {/* ── TELA 06: AGENDAMENTO — DIA ── */}
            {screen === SCREEN.AGENDAMENTO_DIA && (
              <>
                <h2 style={s.question} className="tf-question">Perfeito, {firstName}. Escolha o melhor dia para o seu Diagnóstico Gratuito.</h2>
                <p style={s.hint} className="tf-hint">A reunião dura entre 15–30 minutos. Você sai com um plano de ação aplicável.</p>
                <CalendlyCalendar
                  selected={answers.dia}
                  onSelect={handleDia}
                />
                <div style={{ ...s.nav, marginTop: 16 }}>
                  <button style={s.btnBack} onClick={() => {
                    const prev = answers.faturamento === FATURAMENTO_BAIXO
                      ? (answers.filtro_investimento === 'nao' ? SCREEN.UPSELL_SITE : SCREEN.FILTRO_INVESTIMENTO)
                      : SCREEN.FATURAMENTO;
                    goTo(prev, 'back');
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 07: AGENDAMENTO — HORA ── */}
            {screen === SCREEN.AGENDAMENTO_HORA && (
              <>
                <h2 style={s.question} className="tf-question">Qual horário funciona melhor para você?</h2>
                {answers.dia && <p style={s.hint} className="tf-hint">{formatDateFull(answers.dia)}</p>}
                <div style={s.hoursGrid} className="tf-hours-grid">
                  {HOURS.map((h) => {
                    const selected = answers.hora === h;
                    return (
                      <button
                        key={h}
                        style={{ ...s.hourBtn, ...(selected ? s.hourSelected : {}) }}
                        className="tf-hour-btn"
                        onClick={() => handleHora(h)}
                      >
                        {h}
                        {selected && (
                          <svg style={{ marginLeft: 8, flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BD8AF7" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div style={{ ...s.nav, marginTop: 20 }}>
                  <button style={s.btnBack} onClick={() => goTo(SCREEN.AGENDAMENTO_DIA, 'back')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 08: E-MAIL ── */}
            {screen === SCREEN.EMAIL && (
              <>
                <h2 style={s.question} className="tf-question">Qual é o seu e-mail para receber o convite na agenda?</h2>
                <div style={s.inputWrap}>
                  <input
                    ref={inputRef}
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={answers.email || ''}
                    onChange={e => { setAnswers(a => ({ ...a, email: e.target.value })); setFieldError(''); }}
                    style={{ ...s.input, ...(fieldError ? { borderColor: '#A95BF4' } : {}) }}
                    className="tf-input"
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                  />
                  {fieldError
                    ? <div style={s.fieldError}>{fieldError}</div>
                    : <div style={s.inputHint}>Pressione <kbd style={s.kbd}>Enter ↵</kbd> para continuar</div>
                  }
                </div>
                <p style={s.privacyNote}>Usado apenas para enviar o convite da reunião. Sem spam.</p>
                <div style={s.nav}>
                  <button style={s.btnBack} onClick={() => goTo(SCREEN.AGENDAMENTO_HORA, 'back')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Voltar
                  </button>
                  <button
                    style={{ ...s.btnPrimary, marginLeft: 'auto', opacity: canAdvance() ? 1 : 0.4, cursor: canAdvance() ? 'pointer' : 'default' }}
                    onClick={canAdvance() ? handleNext : undefined}
                  >
                    Confirmar agendamento
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </>
            )}

            {/* ── TELA 09: CONFIRMAÇÃO ── */}
            {screen === SCREEN.CONFIRMACAO && (
              <>
                <div style={s.successIcon}>
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#BD8AF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="7 12.5 10.5 16 17 9"/>
                  </svg>
                </div>
                <h2 style={s.successTitle} className="tf-success-title">Recebemos seu contato, {firstName}!</h2>
                <p style={s.successSub} className="tf-success-sub">
                  Em breve nossa equipe vai entrar em contato com você pelo WhatsApp <strong style={{ color: '#F7F2E5' }}>{answers.whatsapp}</strong>.
                </p>
                <button style={{ ...s.btnPrimary, marginTop: 8, alignSelf: 'flex-start' }} onClick={onClose}>Fechar</button>
              </>
            )}

          </div>
        </div>

        {/* Rodapé */}
        <div style={s.footer} className="tf-modal-footer">
          <span style={s.footerBrand} className="tf-footer-brand">
            <span style={{ color: 'rgba(247,242,229,0.35)' }}>alvo</span><span style={{ color: 'rgba(155,50,241,0.4)' }}>brando</span>
          </span>
          <span style={s.footerSafe} className="tf-footer-safe">Seus dados são protegidos</span>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.97) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 640px) {
          .tf-modal-body { padding: 48px 16px 24px !important; min-height: 320px !important; }
          .tf-modal-footer { padding: 10px 16px !important; flex-direction: row !important; justify-content: space-between !important; align-items: center !important; }
          .tf-footer-brand { order: 1 !important; }
          .tf-footer-safe { order: 2 !important; margin-left: auto !important; }
          .tf-question { font-size: 16px !important; margin-bottom: 8px !important; }
          .tf-input { font-size: 14px !important; padding: 10px 12px !important; }
          .tf-select-item { font-size: 13px !important; padding: 10px 12px !important; gap: 10px !important; }
          .tf-hour-btn { font-size: 13px !important; padding: 10px 6px !important; }
          .tf-hours-grid { gap: 6px !important; }
          .tf-success-title { font-size: 18px !important; margin-bottom: 10px !important; }
          .tf-success-sub { font-size: 13px !important; }
          .tf-confirm-box { width: 100% !important; align-self: stretch !important; box-sizing: border-box !important; }
          .tf-upsell-title { font-size: 17px !important; }
          .tf-upsell-card { padding: 14px 14px !important; }
          .tf-hint { font-size: 12px !important; margin-bottom: 14px !important; }
          .tf-cal { padding: 14px 10px !important; }
          .tf-cal-day { font-size: 11px !important; }
          .tf-cal-month { font-size: 13px !important; }
          .tf-cal-dow { font-size: 9px !important; }
          .tf-nav { margin-top: 16px !important; }
        }
        @media (max-width: 480px) {
          .tf-overlay-inner { padding: 12px !important; align-items: center !important; }
          .tf-modal { border-radius: 20px !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

// Estilos do calendário Calendly — tema escuro
const sc = {
  cal: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '12px 12px',
    userSelect: 'none',
  },
  calHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10,
  },
  calMonthLabel: {
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
    color: '#F7F2E5', letterSpacing: '-0.01em',
  },
  calArrow: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 7, width: 26, height: 26,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.7)', transition: 'all 0.15s',
  },
  calDowRow: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: 4,
  },
  calDow: {
    textAlign: 'center', fontSize: 9, fontWeight: 600,
    color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
    letterSpacing: '0.05em', padding: '2px 0',
  },
  calGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
  },
  calDay: {
    position: 'relative',
    aspectRatio: '1',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, border: 'none',
    fontSize: 14, fontWeight: 600,
    fontFamily: 'var(--font-display)',
    transition: 'all 0.15s',
    cursor: 'default',
    outline: 'none',
    padding: 0,
  },
  calDayAvail: {
    background: 'rgba(155,50,241,0.12)',
    border: '1px solid rgba(189,138,247,0.3)',
    color: '#BD8AF7',
    cursor: 'pointer',
  },
  calDayDisabled: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.12)',
    border: '1px solid transparent',
  },
  calDaySelected: {
    background: 'linear-gradient(135deg, #BD8AF7 0%, #9B32F1 100%)',
    border: '1px solid transparent',
    color: '#FFFFFF',
    boxShadow: '0 4px 16px rgba(155,50,241,0.4)',
    transform: 'scale(1.08)',
  },
  calDot: {
    position: 'absolute', bottom: 4,
    width: 4, height: 4, borderRadius: '50%',
    background: 'rgba(255,255,255,0.7)',
  },
};

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(7, 12, 27, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    background: 'linear-gradient(180deg, #18213D 0%, #0D0218 60%, #0A1228 100%)',
    borderRadius: 24,
    width: '100%', maxWidth: 640,
    maxHeight: '92vh',
    display: 'flex', flexDirection: 'column',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4)',
    animation: 'modalIn 0.32s cubic-bezier(0.2,0.7,0.2,1)',
    position: 'relative',
    overflow: 'hidden',
  },
  progressTrack: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
    background: 'rgba(255,255,255,0.08)',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #BD8AF7, #9B32F1)',
    transition: 'width 0.4s cubic-bezier(0.2,0.7,0.2,1)',
    borderRadius: 999,
  },
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    background: 'rgba(255,255,255,0.06)', border: 'none',
    color: 'rgba(255,255,255,0.5)', borderRadius: 10,
    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s',
    zIndex: 10, outline: 'none',
  },
  body: {
    padding: '56px 48px 32px',
    minHeight: 320,
    flex: 1,
    overflowY: 'auto',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  slide: {
    display: 'flex', flexDirection: 'column',
  },
  introLabel: {
    fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
    color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.12em',
    marginBottom: 14,
  },
  question: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
    color: '#F7F2E5', lineHeight: 1.2, letterSpacing: '-0.02em',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.6,
  },
  label: {
    fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10, display: 'block',
  },
  inputWrap: { display: 'flex', flexDirection: 'column', gap: 10 },
  input: {
    background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 12, padding: '14px 18px',
    color: '#F7F2E5', fontSize: 18, fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%', boxSizing: 'border-box',
  },
  inputHint: {
    fontSize: 12, color: 'rgba(255,255,255,0.3)',
    display: 'flex', alignItems: 'center', gap: 6,
  },
  fieldError: {
    fontSize: 13, color: '#A95BF4', fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  privacyNote: {
    fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 10, lineHeight: 1.5,
  },
  kbd: {
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 5, padding: '1px 6px', fontSize: 11,
    fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.5)',
  },
  selectList: {
    display: 'flex', flexDirection: 'column', gap: 8,
    marginBottom: 8,
  },
  selectItem: {
    background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '13px 16px',
    color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 14,
    transition: 'all 0.18s', fontFamily: 'var(--font-body)', fontSize: 15,
    textAlign: 'left',
  },
  selectSelected: {
    background: 'rgba(155,50,241,0.12)',
    border: '1.5px solid rgba(189,138,247,0.5)',
    color: '#F7F2E5',
  },
  selectLetter: {
    width: 24, height: 24, borderRadius: 6,
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-display)',
    color: 'rgba(255,255,255,0.5)', flexShrink: 0,
  },
  selectLabel: { flex: 1 },
  // Horas
  hoursGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
  },
  hourBtn: {
    background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '14px 10px',
    color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.18s', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
  },
  hourSelected: {
    background: 'rgba(155,50,241,0.15)',
    border: '1.5px solid rgba(189,138,247,0.5)',
    color: '#BD8AF7',
  },
  // Upsell card
  upsellCard: {
    background: 'rgba(155,50,241,0.08)',
    border: '1.5px solid rgba(189,138,247,0.25)',
    borderRadius: 16, padding: '20px 22px',
    marginBottom: 20,
  },
  upsellBadge: {
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
    color: '#BD8AF7', marginBottom: 8,
  },
  upsellTitle: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
    color: '#F7F2E5', marginBottom: 2,
  },
  upsellSub: {
    fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12,
  },
  upsellDesc: {
    fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6,
  },
  // Caixa de confirmação
  confirmBox: {
    background: 'rgba(155,50,241,0.08)',
    border: '1.5px solid rgba(189,138,247,0.25)',
    borderRadius: 14, padding: '16px 20px',
    display: 'inline-flex', flexDirection: 'column', gap: 10,
    marginBottom: 20, alignSelf: 'flex-start',
  },
  confirmRow: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
  },
  confirmLabel: {
    fontSize: 13, color: 'rgba(255,255,255,0.4)', flexShrink: 0, minWidth: 90,
    display: 'flex', alignItems: 'center',
  },
  confirmValue: {
    fontSize: 15, color: '#F7F2E5', fontWeight: 600,
    fontFamily: 'var(--font-display)',
  },
  // Navegação
  nav: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginTop: 24,
  },
  btnBack: {
    background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 10, padding: '10px 16px',
    color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 500,
    transition: 'all 0.18s',
  },
  btnPrimary: {
    background: 'linear-gradient(180deg, #BD8AF7 0%, #9B32F1 55%, #8C1EDB 100%)',
    color: '#FFFFFF', fontWeight: 700,
    fontSize: 15, padding: '12px 22px', borderRadius: 12, border: 'none',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 16px rgba(155,50,241,0.3)',
    display: 'flex', alignItems: 'center', gap: 8,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    transition: 'opacity 0.18s',
  },
  // Sucesso / encerramento
  successIcon: { fontSize: 48, marginBottom: 8 },
  successTitle: {
    fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600,
    color: '#F7F2E5', marginBottom: 14, lineHeight: 1.2,
  },
  successSub: {
    fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 12,
  },
  // Exit overlay
  exitOverlay: {
    position: 'absolute', inset: 0, zIndex: 20,
    background: 'rgba(7,12,27,0.85)', backdropFilter: 'blur(6px)',
    borderRadius: 24,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 32,
  },
  exitBox: {
    background: 'linear-gradient(180deg, #18213D 0%, #0D0218 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 18, padding: '32px 28px',
    maxWidth: 360, width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  exitTitle: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
    color: '#F7F2E5', letterSpacing: '-0.02em',
  },
  exitBody: {
    fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
  },
  exitBtns: {
    display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8,
  },
  exitBtnPrimary: {
    background: 'linear-gradient(180deg, #BD8AF7 0%, #9B32F1 55%, #8C1EDB 100%)',
    color: '#FFFFFF', fontWeight: 700, fontSize: 14,
    padding: '12px 20px', borderRadius: 10, border: 'none',
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
  },
  exitBtnSecondary: {
    background: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: 14,
    padding: '11px 20px', borderRadius: 10,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  footer: {
    padding: '14px 48px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  footerBrand: {
    fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800,
    letterSpacing: '-0.03em',
  },
  footerSafe: {
    fontSize: 12, color: 'rgba(255,255,255,0.25)',
  },
};

export default TypeformModal;
